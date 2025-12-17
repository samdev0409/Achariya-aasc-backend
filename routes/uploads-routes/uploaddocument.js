import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

const TEMP_DIR = path.join(process.cwd(), "assets/documents/temp");
const FINAL_DIR = path.join(process.cwd(), "assets/documents");

// Ensure folders exist
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
if (!fs.existsSync(FINAL_DIR)) fs.mkdirSync(FINAL_DIR, { recursive: true });

// Multer storage config for documents
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, TEMP_DIR),
  filename: (_, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "-");
    const uniqueName = Date.now() + "-" + cleanName;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    // Accept PDF and common document types
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and document files are allowed!"));
    }
  },
});

/* -----------------------------------------
   Upload document to TEMP
------------------------------------------ */
router.post("/documentupload", upload.single("document"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Read all existing files in temp
    const existingFiles = fs.readdirSync(TEMP_DIR);

    // Keep the last uploaded file (the new one)
    const newFile = req.file.filename;

    // Delete all previous temp files except the new one
    existingFiles.forEach((file) => {
      if (file !== newFile) {
        const filePath = path.join(TEMP_DIR, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("Deleted old temp document:", file);
        }
      }
    });
  } catch (error) {
    console.error("Error cleaning temp folder:", error);
  }

  // Return temp path and file info
  res.json({
    fileName: req.file.filename,
    tempPath: `/assets/documents/temp/${req.file.filename}`,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

/* -----------------------------------------
   Move temp document to permanent storage
------------------------------------------ */
router.post("/save-temp-document", (req, res) => {
  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).json({ error: "fileName is required" });
  }

  const oldPath = path.join(TEMP_DIR, fileName);
  const newPath = path.join(FINAL_DIR, fileName);

  try {
    if (!fs.existsSync(oldPath)) {
      return res.status(404).json({ error: "Temp document not found" });
    }

    fs.renameSync(oldPath, newPath);

    const fullUrl = `${process.env.BASE_URL}/assets/documents/${fileName}`;

    res.json({
      saved: true,
      fileName,
      url: fullUrl,
    });
  } catch (error) {
    console.error("Error saving temp document:", error);
    res.status(500).json({ error: "Failed to save document" });
  }
});

/* -----------------------------------------
   Remove temp documents (JSON and FormData support)
------------------------------------------ */
router.post("/remove-temp-document", (req, res) => {
  try {
    let fileName, files, sessionId;

    // Handle FormData from sendBeacon (content-type: multipart/form-data)
    if (req.body.files && typeof req.body.files === "string") {
      try {
        files = JSON.parse(req.body.files);
        sessionId = req.body.sessionId;
      } catch (e) {
        console.error("Failed to parse files from FormData:", e);
      }
    } else {
      // Handle regular JSON request
      fileName = req.body.fileName;
      files = req.body.files;
      sessionId = req.body.sessionId;
    }

    console.log("Remove-temp-document called with:", {
      fileName,
      files,
      sessionId,
    });

    // Handle single file deletion
    if (fileName) {
      const filePath = path.join(TEMP_DIR, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Deleted single document:", fileName);
        return res.json({ removed: true, fileName });
      }
      return res.json({ removed: false, message: "Document not found" });
    }

    // Handle multiple files deletion
    if (files && Array.isArray(files)) {
      const removed = [];
      const notFound = [];

      files.forEach((file) => {
        const filePath = path.join(TEMP_DIR, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          removed.push(file);
          console.log("Deleted document:", file);
        } else {
          notFound.push(file);
          console.log("Document not found:", file);
        }
      });

      return res.json({
        removed: true,
        count: removed.length,
        removedFiles: removed,
        notFound,
        sessionId,
      });
    }

    res.json({ removed: false, message: "No files specified" });
  } catch (error) {
    console.error("Error removing temp documents:", error);
    res.status(500).json({ error: "Failed to remove documents" });
  }
});

/* -----------------------------------------
   Cleanup old temp documents (run periodically)
------------------------------------------ */
router.post("/cleanup-old-temp-documents", (req, res) => {
  const maxAge = 1000 * 60 * 60; // 1 hour

  try {
    const files = fs.readdirSync(TEMP_DIR);
    const now = Date.now();
    let cleaned = 0;

    files.forEach((file) => {
      const filePath = path.join(TEMP_DIR, file);
      const stats = fs.statSync(filePath);
      const age = now - stats.mtimeMs;

      if (age > maxAge) {
        fs.unlinkSync(filePath);
        cleaned++;
      }
    });

    res.json({
      success: true,
      cleaned,
      message: `Cleaned up ${cleaned} old temp documents`,
    });
  } catch (error) {
    console.error("Error cleaning temp documents:", error);
    res.status(500).json({ error: "Failed to cleanup" });
  }
});

export default router;
