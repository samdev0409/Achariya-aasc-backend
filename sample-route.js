import express from "express";
import { getCollection } from "./db.js";

const router = express.Router();

/**
 * @route GET /api/sample
 * @desc Sample route demonstrating singleton DB usage
 */
router.get("/", async (req, res) => {
  try {
    // Example: Fetching from 'users' collection using the singleton helper
    const usersCollection = await getCollection("users");

    // Using native MongoDB driver methods
    const userCount = await usersCollection.countDocuments();
    const sampleUser = await usersCollection.findOne(
      {},
      { projection: { password: 0 } }
    );

    res.json({
      success: true,
      message: "Connected to DB successfully via singleton",
      stats: {
        userCount,
        sampleUser,
      },
    });
  } catch (error) {
    console.error("Sample route error:", error);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

export default router;
