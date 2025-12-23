import dotenv from "dotenv";
import { getDb, closeDb } from "./db.js";

dotenv.config();

const checkDepartmentsData = async () => {
  try {
    console.log("🔍 Checking academics__departmentsdata collection...\n");
    const db = await getDb();
    const collection = db.collection("academics__departmentsdata");

    // Get all documents
    const docs = await collection.find({}).toArray();

    console.log(`📊 Found ${docs.length} document(s) in collection\n`);

    if (docs.length > 0) {
      docs.forEach((doc, index) => {
        console.log(`\n========== Document ${index + 1} ==========`);
        console.log(`_id: ${doc._id}`);

        if (doc.data) {
          console.log(`\nData structure:`);
          console.log(`  Type: ${typeof doc.data}`);
          console.log(`  Is Array: ${Array.isArray(doc.data)}`);

          if (typeof doc.data === "object" && !Array.isArray(doc.data)) {
            const keys = Object.keys(doc.data);
            console.log(`  Department Keys (${keys.length}):`, keys);

            // Check first 3 departments
            keys.slice(0, 3).forEach((key) => {
              const dept = doc.data[key];
              console.log(`\n  Department: ${key}`);
              console.log(`    Type: ${typeof dept}`);
              console.log(`    Is null: ${dept === null}`);

              if (dept && typeof dept === "object") {
                const props = Object.keys(dept);
                console.log(
                  `    Properties (${props.length}):`,
                  props.slice(0, 10)
                );

                if (dept.name) console.log(`    ✅ name: "${dept.name}"`);
                if (dept.aboutDepartment)
                  console.log(`    ✅ aboutDepartment exists`);
                if (dept.vision) console.log(`    ✅ vision exists`);
                if (dept.departmentActivities) {
                  console.log(
                    `    ✅ departmentActivities: ${dept.departmentActivities.length} items`
                  );
                }
              }
            });
          }
        } else {
          console.log(`  ⚠️ No 'data' field!`);
        }

        console.log(`\n  Full document keys:`, Object.keys(doc));
      });
    } else {
      console.log("❌ Collection is empty");
    }

    await closeDb();
    console.log("\n✅ Analysis complete");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

checkDepartmentsData();
