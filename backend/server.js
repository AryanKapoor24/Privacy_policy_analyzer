import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoutes from "./routes/analyze.js";
import multer from "multer";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// allow frontend dev server
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", analyzeRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/api/uploads', express.static(join(__dirname, 'uploads')));

// PDF upload endpoint - Mock implementation to restore flow
app.post("/upload", upload.single("pdfFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Mock response to allow frontend to proceed to results page
    // This reverts the actual parsing logic which was causing issues
    res.json({
      success: true,
      text: "This is sample text. The actual PDF parsing has been disabled to restore the original website flow.",
      info: {},
      metadata: {},
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ 
      error: "Failed to process PDF",
      details: error.message
    });
  }
});

// basic root + health endpoints
app.get("/", (_req, res) =>
  res.status(200).send("Server running. Use POST /api/upload")
);
app.get("/api", (_req, res) => res.status(200).json({ status: "ok" }));

// global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(err?.status || 500).json({
    error: err?.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server listening on http://localhost:${PORT}`)
);