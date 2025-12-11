import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let dbInstance = null;

export const getDb = async () => {
  if (dbInstance) return dbInstance;

  if (mongoose.connection.readyState === 1) {
    dbInstance = mongoose.connection.db;
    return dbInstance;
  }

 
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || 'aasc_db'  
    });
    console.log(`✅ Connected to database: ${process.env.MONGODB_DB}`);
    dbInstance = mongoose.connection.useDb(process.env.MONGODB_DB );
    return dbInstance;
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
    throw error;
  }
};

export const getCollection = async (collectionName) => {
  const db = await getDb();
  return db.collection(collectionName);
};

// Helper to close connection if needed (e.g. after seeding)
export const closeDb = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    dbInstance = null;
    console.log("👋 Database connection closed");
  }
};
