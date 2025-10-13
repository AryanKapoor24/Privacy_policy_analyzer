import express from "express";
import { analyzePolicy } from "../controllers/aiController.js";

const router = express.Router();

// POST route: /api/analyze
router.post("/analyze", analyzePolicy);

export default router;
