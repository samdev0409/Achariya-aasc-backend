import dotenv from "dotenv";
import { getDb, closeDb } from "./db.js";

dotenv.config();

const seedTrainingPlacements = async () => {
  try {
    console.log("🚀 Seeding Training and Placements Data...");
    const db = await getDb();

    const collectionName = "placements__trainingandplacementsdata";
    const collection = db.collection(collectionName);

    // Hardcoded data from TrainingAndPlacementsData.js
    const data = {
      TrainingAndPlacementsFacultyData: [
        {
          image: "Dr. Ramesh Kumar C.webp",
          name: "Dr. Ramesh Kumar C",
          department: "Commerce",
          designation:
            "Assistant Professor & Training and Placement Cell Officer",
          email: "aascplacement@achariya.org",
        },
      ],
      activities: [
        {
          id: 1,
          text: "Training and Placement Cell offers Career Development Program for the students who are raring to enter the corporate world and introduce them to the prospective employers according to their aspirations and academic background.",
        },
        {
          id: 2,
          text: "The Training programs have been formulated after having a wide discussion with various industrial and academic expert to suit the need of the industry and students.",
        },
        {
          id: 3,
          text: "Inspires the students to participate in co-curricular and extra-curricular activities which will make them confidence and develop their personality.",
        },
        {
          id: 4,
          text: "Encourages the students to participate in various competition conducted by major academic institutions and corporate houses.",
        },
        {
          id: 5,
          text: "Arranges guest lectures by eminent personalities from industry and entrepreneurs to keep the students abreast of the latest happenings.",
        },
        {
          id: 6,
          text: "It always aims to bridge the gap between industry and academia.",
        },
      ],
    };

    // Check if collection exists and has data
    const existingDoc = await collection.findOne({});

    if (existingDoc) {
      // Update existing document
      await collection.updateOne(
        { _id: existingDoc._id },
        { $set: { data: data } }
      );
      console.log("✅ Updated existing document with ID:", existingDoc._id);
    } else {
      // Insert new document
      await collection.insertOne({ data: data });
      console.log("✅ Inserted new document");
    }

    const verification = await collection.findOne({});
    console.log(
      "✅ Verification - Document in DB:",
      JSON.stringify(verification.data, null, 2)
    );

    await closeDb();
    console.log("✨ Training and Placements Data Seeded Successfully!");
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
    process.exit(1);
  }
};

seedTrainingPlacements();
