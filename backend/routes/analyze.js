import express from "express";
import multer from "multer";
import { analyzePDF } from "../controllers/aicontroller.js";

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route: handles PDF upload and passes it to AI controller
router.post("/analyze", upload.single("file"), analyzePDF);

export default router;
