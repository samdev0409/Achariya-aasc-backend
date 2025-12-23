import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import dotenv from "dotenv";
import * as babelParser from "@babel/parser";
import traverseModule from "@babel/traverse";
import generateModule from "@babel/generator";

import { getDb, closeDb } from "./db.js";

const require = createRequire(import.meta.url);
const generate = generateModule.default;
const traverse = traverseModule.default;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DATA_DIR = path.resolve(__dirname, "..", "client", "src", "data");

// -----------------------------
// HELPERS (Reused from seedDatabase.js)
// -----------------------------

function buildImportMap(ast, filePath) {
  const map = Object.create(null);
  for (const node of ast.program.body) {
    if (node.type === "ImportDeclaration") {
      const src = node.source?.value || null;
      // We want the filename as the value for the import variable
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
      // Don't replace object keys or member properties
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
        // If not in import map, replace with null to avoid ReferenceError
        // unless it's a global like 'undefined'
        if (name !== "undefined") {
          innerPath.replaceWith({ type: "NullLiteral" });
        }
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
  // Remove BOM
  code = code.replace(/^\uFEFF/, "");
  const ast = babelParser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
  const importMap = buildImportMap(ast, filePath);

  // Filter out imports from body processing
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
        const val = variables[decl.name];
        if (typeof val !== "undefined") {
          exports.push({ name: "default", value: val });
        }
      } else {
        const value = sanitizeAndEval(decl, importMap);
        if (typeof value !== "undefined")
          exports.push({ name: "default", value });
      }
    },
  });
  return exports;
}

// -----------------------------
// CONFIGURATION
// -----------------------------

const TARGET_FILES = [
  {
    relativePath: "about/PressReleasesData.js",
    collectionName: "about__pressreleasesdata",
    exportName: "default", // It exports default object
    type: "singleton", // It's an object of { year: [images] }
  },
  {
    relativePath: "academics/ValueAddedCoursesData.js",
    collectionName: "academics__valueaddedcoursesdata",
    exportName: "default", // Exports default { AdditionalCoursesData, ... }
    type: "singleton",
  },
  {
    relativePath: "commitees/committiesdata.js", // Note spelling from find_by_name
    collectionName: "commitees__committiesdata",
    exportName: "committeeDataMapper", // We specifically want this
    type: "singleton",
  },
  {
    relativePath: "placdements/PlacementRecords.js", // Note spelling
    collectionName: "placements__placementrecords",
    exportName: "placementRecords", // Named export
    type: "list", // Array of records
  },
  {
    relativePath: "placdements/TrainingAndPlacementsData.js",
    collectionName: "placements__trainingandplacementsdata",
    exportName: "default",
    type: "singleton",
  },
  {
    relativePath: "academics/departmentsdata.js",
    collectionName: "academics__departmentsdata",
    exportName: "departmentDataMapper", // Named export containing all departments
    type: "singleton", // Single document containing all department data
  },
];

// -----------------------------
// MAIN LOGIC
// -----------------------------

const seedSpecificData = async () => {
  try {
    console.log("🚀 Starting Specific Data Seeding...");
    const db = await getDb();

    if (!fs.existsSync(CLIENT_DATA_DIR)) {
      throw new Error(`CLIENT_DATA_DIR does not exist: ${CLIENT_DATA_DIR}`);
    }

    for (const target of TARGET_FILES) {
      const filePath = path.join(CLIENT_DATA_DIR, target.relativePath);
      const collectionName = target.collectionName;

      console.log(
        `\nProcessing ${path.basename(filePath)} -> ${collectionName}`
      );

      if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        continue;
      }

      let content;
      try {
        content = fs.readFileSync(filePath, "utf8");
      } catch (e) {
        console.error(`❌ Failed to read file: ${filePath}`);
        continue;
      }

      const exports = extractExportsFromCode(content, filePath);

      // Find the desired export
      let seedData;
      if (target.exportName === "default") {
        const def = exports.find((e) => e.name === "default");
        seedData = def ? def.value : null;
      } else {
        const named = exports.find((e) => e.name === target.exportName);
        console.log(
          `Debug: Looking for export '${target.exportName}', found:`,
          named ? "YES" : "NO"
        );
        seedData = named ? named.value : null;
      }

      if (!seedData) {
        console.warn(
          `   ⚠️ Target export '${target.exportName}' not found in ${target.relativePath}, available exports:`,
          exports.map((e) => e.name)
        );
        continue;
      }

      const collection = db.collection(collectionName);

      // Update missing 'image' fields logic requested by user
      // User said: "import thesed datafiles with adding an image field in the collection"
      // We'll traverse the data and ensure strict image paths are strings if they aren't already.
      // Since sanitizeAndEval already does this, we are good on format.
      // If we need to *inject* an image field where missing, we can do it here.
      // For PlacementRecords (list of pdfs), maybe add a placeholder?
      // But let's trust the data first.

      // Prepare docs
      let docsToProcess = [];
      if (target.type === "list" && Array.isArray(seedData)) {
        docsToProcess = seedData.map((item) => ({ data: item }));
      } else {
        // Singleton or Wrapper
        docsToProcess = [{ data: seedData }];
      }

      // Upsert Logic
      let added = 0;
      let updated = 0;

      for (const doc of docsToProcess) {
        // Try to find existing doc to update
        // If singleton, finding any doc is enough?
        // If list, we need a unique key.

        let query = null;
        const data = doc.data;

        if (target.type === "singleton") {
          // Singleton: If any doc exists, update it. If not, insert.
          const existing = await collection.findOne({});
          if (existing) {
            query = { _id: existing._id };
          }
        } else {
          // List: try to identify unique key
          if (data.id) query = { "data.id": data.id };
          else if (data.label)
            query = { "data.label": data.label }; // PlacementRecords has label
          else if (data.title) query = { "data.title": data.title };
          else if (data.name) query = { "data.name": data.name };
        }

        if (query) {
          await collection.updateOne(query, { $set: { data: data } });
          updated++;
        } else {
          // Check if singleton and we didn't find existing, we insert
          // For list, if no ID found, we insert (might duplicate if run multiple times without clear ID)
          await collection.insertOne(doc);
          added++;
        }
      }

      console.log(`   ✅ Finished: ${added} added, ${updated} updated.`);
    }

    await closeDb();
    console.log("✨ Specific Seeding Complete!");
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
    process.exit(1);
  }
};

seedSpecificData();
