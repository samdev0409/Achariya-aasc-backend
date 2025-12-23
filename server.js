import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import ImageuploadRoutes from "./routes/uploads-routes/uploadimage.js";
import DocumentuploadRoutes from "./routes/uploads-routes/uploaddocument.js";

// Load environment variables
dotenv.config();

// Import DB Connection (Singleton)
import { getDb } from "./db.js";

// Import Routes
import authRoutes from "./routes/auth.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

// Initialize Express app
const app = express();

// =================================
// MIDDLEWARE
// =================================

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression
app.use(compression());

// MongoDB Sanitization
app.use(mongoSanitize());

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Serve static files
app.use(express.static("public"));

// =================================
// ROUTES
// =================================

// Health Check
app.get("/api/health", async (req, res) => {
  try {
    const db = await getDb();
    res.status(200).json({
      success: true,
      status: "online",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "error",
      database: "disconnected",
      error: error.message,
    });
  }
});

// Auth Routes
app.use("/api/auth", authRoutes);

// Upload Routes
app.use("/api/upload", ImageuploadRoutes);
app.use("/api/upload/document", DocumentuploadRoutes);

// Generated CRUD Routes (for all 35 collections)
app.use("/api", routes);

app.use((req, res, next) => {
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/assets", express.static(path.join(process.cwd(), "assets")));

// Preview PDF route for admin (serves both temp and permanent PDFs)
app.get("/preview-pdf/:filename", (req, res) => {
  const filename = req.params.filename;

  // Try temp folder first
  const tempPath = path.join(
    process.cwd(),
    "assets",
    "documents",
    "temp",
    filename
  );
  const permanentPath = path.join(
    process.cwd(),
    "assets",
    "documents",
    filename
  );

  // Check if file exists in temp folder
  if (require("fs").existsSync(tempPath)) {
    return res.sendFile(tempPath);
  }

  // Check if file exists in permanent folder
  if (require("fs").existsSync(permanentPath)) {
    return res.sendFile(permanentPath);
  }

  // File not found
  res.status(404).json({ message: "PDF not found" });
});

// 404 & Error Handling
app.use(notFound);
app.use(errorHandler);

// =================================
// SERVER INITIALIZATION
// =================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("🚀 Starting AASC Backend Server...");

    // Connect to DB
    await getDb();

    app.listen(PORT, () => {
      console.log(`✨ Server running on port ${PORT}`);
      console.log(`🌐 Local: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
};

startServer();

export default app;
