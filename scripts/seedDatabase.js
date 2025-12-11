import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import dotenv from "dotenv";
import mongoose from "mongoose";
import * as babelParser from "@babel/parser";
import traverseModule from "@babel/traverse";
import generateModule from "@babel/generator";

import { getDb, closeDb } from "../db.js";

const require = createRequire(import.meta.url);
const { sync: globSync } = require("glob");
const generate = generateModule.default;
const traverse = traverseModule.default;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "..", "..", "client", "src", "data");

// -----------------------------
// HELPERS
// -----------------------------

function getCollectionName(filePath) {
  const rel = path.relative(DATA_DIR, filePath);
  const parts = rel.split(path.sep);
  const fileName = parts.pop();
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
  const prefix = parts.join("__").toLowerCase();
  const collectionName = prefix
    ? `${prefix}__${nameWithoutExt}`
    : nameWithoutExt;
  return collectionName.toLowerCase();
}

function buildImportMap(ast, filePath) {
  const map = Object.create(null);
  for (const node of ast.program.body) {
    if (node.type === "ImportDeclaration") {
      const src = node.source?.value || null;
      const friendly = src ? path.basename(src) : src;
      (node.specifiers || []).forEach((spec) => {
        if (spec.local?.name) {
          map[spec.local.name] = friendly;
        }
      });
    }
  }
  return map;
}

function sanitizeAndEval(node, importMap) {
  const fakeAST = {
    type: "File",
    program: {
      type: "Program",
      body: [{ type: "ExpressionStatement", expression: node }],
    },
  };

  traverse(fakeAST, {
    Identifier(innerPath) {
      const parent = innerPath.parent;
      const node = innerPath.node;
      if (
        parent &&
        (parent.type === "ObjectProperty" || parent.type === "ObjectMethod") &&
        parent.key === node &&
        parent.computed === false
      )
        return;

      if (
        parent &&
        (parent.type === "MemberExpression" ||
          parent.type === "OptionalMemberExpression") &&
        parent.property === node &&
        parent.computed === false
      )
        return;

      const name = node.name;
      if (importMap[name]) {
        innerPath.replaceWith({
          type: "StringLiteral",
          value: importMap[name],
        });
      } else {
        innerPath.replaceWith({ type: "NullLiteral" });
      }
    },
  });

  const exprNode = fakeAST.program.body[0].expression;
  const codeGen = generate(exprNode).code;
  try {
    return new Function(`return (${codeGen});`)();
  } catch (err) {
    return undefined;
  }
}

function extractExportsFromCode(code, filePath) {
  code = code.replace(/^\uFEFF/, "");
  const ast = babelParser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
  const importMap = buildImportMap(ast, filePath);
  ast.program.body = ast.program.body.filter(
    (node) => node.type !== "ImportDeclaration"
  );

  const variables = {};
  const exports = [];

  traverse(ast, {
    VariableDeclaration(pathNode) {
      const decl = pathNode.node;
      decl.declarations.forEach((d) => {
        if (!d.init) return;
        const value = sanitizeAndEval(d.init, importMap);
        if (typeof value !== "undefined") {
          variables[d.id.name] = value;
          // Check if exported via named export
          if (pathNode.parent.type === "ExportNamedDeclaration") {
            exports.push({ name: d.id.name, value });
          }
        }
      });
    },
    ExportDefaultDeclaration(pathNode) {
      const decl = pathNode.node.declaration;
      if (!decl) return;

      if (decl.type === "Identifier") {
        // Handle: export default myVar;
        const val = variables[decl.name];
        if (typeof val !== "undefined") {
          exports.push({ name: "default", value: val });
        }
      } else {
        // Handle: export default { ... };
        const value = sanitizeAndEval(decl, importMap);
        if (typeof value !== "undefined")
          exports.push({ name: "default", value });
      }
    },
  });
  return exports;
}

// -----------------------------
// MAIN LOGIC
// -----------------------------

const seedDatabase = async () => {
  try {
    console.log("🚀 Starting Bulletproof Incremental Seeding...");
    const db = await getDb();

    if (!fs.existsSync(DATA_DIR)) {
      throw new Error(`DATA_DIR does not exist: ${DATA_DIR}`);
    }

    const patterns = ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx"];
    const files = patterns.flatMap((p) =>
      globSync(p, { cwd: DATA_DIR, absolute: true })
    );

    console.log(`📂 Found ${files.length} files in ${DATA_DIR}`);

    for (const f of files) {
      const collectionName = getCollectionName(f);
      console.log(`\nProcessing ${path.basename(f)} -> ${collectionName}`);

      let content;
      try {
        content = fs.readFileSync(f, "utf8");
      } catch (e) {
        console.error(`❌ Failed to read file: ${f}`);
        continue;
      }

      const exports = extractExportsFromCode(content, f);

      // Filter out null/undefined values
      const validExports = exports.filter(
        (e) => e.value !== undefined && e.value !== null
      );

      if (!validExports.length) {
        console.log(`   ⚠️ No valid exports found, skipping.`);
        continue;
      }

      // Prefer default export, else first named export
      const mainExport =
        validExports.find((e) => e.name === "default") || validExports[0];
      const seedData = mainExport.value;

      const collection = db.collection(collectionName);
      const existingCount = await collection.countDocuments();

      // Normalize to array of docs
      let docsToProcess = [];
      if (Array.isArray(seedData)) {
        // List collection
        docsToProcess = seedData.map((item) => ({ data: item }));
      } else {
        // Singleton collection
        docsToProcess = [{ data: seedData }];
      }

      if (existingCount === 0) {
        // EMPTY -> Full Import
        if (docsToProcess.length > 0) {
          await collection.insertMany(docsToProcess);
          console.log(
            `   ✅ Created collection with ${docsToProcess.length} documents.`
          );
        }
      } else {
        // EXISTS -> Incremental Merge
        let added = 0;
        let fixed = 0;
        let skipped = 0;

        for (const doc of docsToProcess) {
          const data = doc.data;
          let query = null;

          if (docsToProcess.length === 1 && existingCount === 1) {
            const existing = await collection.findOne({});
            if (existing) query = { _id: existing._id };
          } else {
            if (data.id) query = { "data.id": data.id };
            else if (data._id) query = { "data._id": data._id };
            else if (data.title) query = { "data.title": data.title };
            else if (data.name) query = { "data.name": data.name };
            else if (data.label) query = { "data.label": data.label };
            else if (data.role) query = { "data.role": data.role };
          }

          if (query) {
            const existingDoc = await collection.findOne(query);

            if (!existingDoc) {
              await collection.insertOne(doc);
              added++;
            } else {
              if (
                !existingDoc.data ||
                Object.keys(existingDoc.data).length === 0
              ) {
                await collection.updateOne(
                  { _id: existingDoc._id },
                  { $set: { data: doc.data } }
                );
                fixed++;
              } else {
                if (docsToProcess.length === 1) {
                  await collection.updateOne(
                    { _id: existingDoc._id },
                    { $set: { data: doc.data } }
                  );
                  fixed++;
                } else {
                  skipped++;
                }
              }
            }
          } else {
            console.warn(
              `   ⚠️ Could not identify unique key for doc, skipping.`
            );
            skipped++;
          }
        }
        console.log(
          `   🔄 Incremental: ${added} added, ${fixed} fixed/updated, ${skipped} skipped.`
        );
      }
    }

    // Create Admin User
    const userColl = db.collection("users");
    const adminEmail = process.env.ADMIN_EMAIL || "admin@achariya.org";
    const adminUser = await userColl.findOne({ email: adminEmail });

    if (!adminUser) {
      console.log("🔐 Creating Admin User...");
      await userColl.insertOne({
        name: "System Administrator",
        email: adminEmail,
        password:
          process.env.ADMIN_PASSWORD_HASH ||
          "$2a$10$pKA25t45d0DuvDnLEDHSiev3fdHOyCJqciflX8pfgr7T4F0NE5J0q",
        role: "admin",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✅ Admin user created.");
    }

    await closeDb();
    console.log("✨ Seeding Complete!");
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
    process.exit(1);
  }
};

seedDatabase();
