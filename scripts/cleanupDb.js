import mongoose from "mongoose";
import { getDb, closeDb } from "../db.js";

const cleanup = async () => {
  try {
    console.log("🧹 Starting DB Cleanup...");
    const db = await getDb();
    // getDb ensures connection.
    // mongoose.connection.db is the native db.
    const nativeDb = mongoose.connection.db;

    if (!nativeDb) {
      throw new Error("Native DB not found. Connection might be closed.");
    }

    const collections = await nativeDb.listCollections().toArray();

    const toDrop = [
      "placdements__placementrecords",
      "placdements__trainingandplacementsdata",
      "home__missionvissiondata",
      "academics__valuedaddedcoursesdata",
      "academics__pgprogramsdetails",
      "cheifMentorSchema",
      "getAllController",
    ];

    const badCollections = [
      "home__missionvisiondata",
      "committees__committiesdata",
      "academics__departmentsdata",
      "about__ourteamdata",
    ];

    const allToDrop = [...toDrop, ...badCollections];

    for (const c of collections) {
      if (allToDrop.includes(c.name)) {
        console.log(`   Dropping ${c.name}...`);
        await nativeDb.collection(c.name).drop();
      }

      if (c.name.startsWith("placdements")) {
        console.log(`   Dropping ${c.name} (typo prefix)...`);
        try {
          await nativeDb.collection(c.name).drop();
        } catch (e) {}
      }
    }

    console.log("✅ Cleanup complete.");
    await closeDb();
  } catch (error) {
    console.error("❌ Cleanup Failed:", error);
    process.exit(1);
  }
};

cleanup();
