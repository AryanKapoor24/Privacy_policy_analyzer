import express from "express";
import multer from "multer";
import { analyzePDF } from "../controllers/aicontrol.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// debug middleware
router.use((req, _res, next) => {
  console.log("Incoming request:", req.method, req.originalUrl, "Content-Type:", req.headers["content-type"]);
  next();
});

// unified upload handler that calls controller
const uploadHandler = (req, res, next) => {
  console.log("handler hit:", req.path, "req.file:", !!req.file, req.file && { name: req.file.originalname, size: req.file.size });
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded. Ensure form-data key is "file".' });
  }
  return analyzePDF(req, res, next);
};

router.post(["/upload", "/analyze"], upload.single("file"), uploadHandler);

// Multer error handler
router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    const friendly = err.code === "FIELD_NAME_MISSING"
      ? 'Missing form field name "file". Use form-data key "file".'
      : err.message;
    return res.status(400).json({ error: friendly });
  }
  next(err);
});

export default router;