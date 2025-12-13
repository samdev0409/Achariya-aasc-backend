import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

const TEMP_DIR = path.join(process.cwd(), "assets/images/temp");
const FINAL_DIR = path.join(process.cwd(), "assets/images");

// Ensure folders exist
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
if (!fs.existsSync(FINAL_DIR)) fs.mkdirSync(FINAL_DIR, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, TEMP_DIR),
  filename: (_, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "-");
    const uniqueName = Date.now() + "-" + cleanName;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

/* -----------------------------------------
   Upload file to TEMP
------------------------------------------ */
router.post("/imageupload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Read all existing files in temp
    const existingFiles = fs.readdirSync(TEMP_DIR);

    // Keep the last uploaded file (the new one)
    const newFile = req.file.filename;

    // Delete all previous temp files except the new one
    existingFiles.forEach(file => {
      if (file !== newFile) {
        const filePath = path.join(TEMP_DIR, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("Deleted old temp file:", file);
        }
      }
    });
  } catch (error) {
    console.error("Error cleaning temp folder:", error);
  }

  // DO NOT CHANGE ANYTHING BELOW
  res.json({
    fileName: req.file.filename,
    tempPath: `/assets/images/temp/${req.file.filename}`,
  });
});


/* -----------------------------------------
   Move temp file to permanent storage
------------------------------------------ */
router.post("/save-temp-file", (req, res) => {
  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).json({ error: "fileName is required" });
  }

  const oldPath = path.join(TEMP_DIR, fileName);
  const newPath = path.join(FINAL_DIR, fileName);

  try {
    if (!fs.existsSync(oldPath)) {
      return res.status(404).json({ error: "Temp file not found" });
    }

    fs.renameSync(oldPath, newPath);

    const fullUrl = `${process.env.BASE_URL}/assets/images/${fileName}`;

    res.json({
      saved: true,
      fileName,
      url: fullUrl
    });
  } catch (error) {
    console.error("Error saving temp file:", error);
    res.status(500).json({ error: "Failed to save file" });
  }
});

/* -----------------------------------------
   Remove temp files (JSON and FormData support)
------------------------------------------ */
router.post("/remove-temp", (req, res) => {
  try {
    let fileName, files, sessionId;

    // Handle FormData from sendBeacon (content-type: multipart/form-data)
    if (req.body.files && typeof req.body.files === 'string') {
      try {
        files = JSON.parse(req.body.files);
        sessionId = req.body.sessionId;
      } catch (e) {
        console.error('Failed to parse files from FormData:', e);
      }
    } else {
      // Handle regular JSON request
      fileName = req.body.fileName;
      files = req.body.files;
      sessionId = req.body.sessionId;
    }

    console.log('Remove-temp called with:', { fileName, files, sessionId });

    // Handle single file deletion
    if (fileName) {
      const filePath = path.join(TEMP_DIR, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Deleted single file:', fileName);
        return res.json({ removed: true, fileName });
      }
      return res.json({ removed: false, message: "File not found" });
    }

    // Handle multiple files deletion
    if (files && Array.isArray(files)) {
      const removed = [];
      const notFound = [];

      files.forEach(file => {
        const filePath = path.join(TEMP_DIR, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          removed.push(file);
          console.log('Deleted file:', file);
        } else {
          notFound.push(file);
          console.log('File not found:', file);
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
    console.error("Error removing temp files:", error);
    res.status(500).json({ error: "Failed to remove files" });
  }
});

/* -----------------------------------------
   Cleanup old temp files (run periodically)
------------------------------------------ */
router.post("/cleanup-old-temp", (req, res) => {
  const maxAge = 1000 * 60 * 60; // 1 hour

  try {
    const files = fs.readdirSync(TEMP_DIR);
    const now = Date.now();
    let cleaned = 0;

    files.forEach(file => {
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
      message: `Cleaned up ${cleaned} old temp files`,
    });
  } catch (error) {
    console.error("Error cleaning temp files:", error);
    res.status(500).json({ error: "Failed to cleanup" });
  }
});

export default router;