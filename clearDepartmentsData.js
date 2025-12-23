import dotenv from "dotenv";
import { getDb, closeDb } from "./db.js";

dotenv.config();

const clearAndReseed = async () => {
  try {
    console.log("🗑️  Clearing academics__departmentsdata collection...\n");
    const db = await getDb();
    const collection = db.collection("academics__departmentsdata");

    // Delete ALL documents
    const deleteResult = await collection.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} old documents\n`);

    await closeDb();
    console.log("✅ Collection cleared - ready for fresh seed\n");
    console.log("Now run: node seedSpecificData.js");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

clearAndReseed();
