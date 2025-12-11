import { getDb, closeDb } from "../db.js";

const verify = async () => {
  try {
    console.log("🔍 Verifying Database State...");
    const db = await getDb();
    // Use native db to list collections
    const collections = await db.db.listCollections().toArray();

    console.log(`📊 Total Collections Found: ${collections.length}`);
    console.log("---------------------------------------------------");

    let emptyCount = 0;

    // Sort for readability
    collections.sort((a, b) => a.name.localeCompare(b.name));

    for (const [i, c] of collections.entries()) {
      const count = await db.collection(c.name).countDocuments();
      const status = count === 0 ? "❌ EMPTY" : "✅";
      if (count === 0) emptyCount++;
      console.log(
        `${(i + 1).toString().padStart(2, "0")}. ${c.name.padEnd(
          40
        )} : ${count} docs ${status}`
      );
    }
    console.log("---------------------------------------------------");

    if (collections.length === 36) {
      console.log("✅ COLLECTION COUNT PASSED: Exactly 36 collections.");
    } else {
      console.error(
        `❌ COLLECTION COUNT FAILED: Expected 36, found ${collections.length}.`
      );
    }

    if (emptyCount === 0) {
      console.log("✅ DATA CHECK PASSED: No empty collections.");
    } else {
      console.warn(
        `⚠️  DATA CHECK WARNING: ${emptyCount} collections are empty.`
      );
    }

    await closeDb();
  } catch (e) {
    console.error("❌ Verification Error:", e);
    process.exit(1);
  }
};

verify();
