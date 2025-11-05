import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoutes from "./routes/analyze.js"; // <- ensure this import exists

dotenv.config();
const app = express();

// allow frontend dev server
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", analyzeRoutes);

// basic root + health endpoints
app.get("/", (_req, res) => res.status(200).send("Server running. Use POST /api/upload"));
app.get("/api", (_req, res) => res.status(200).json({ status: "ok" }));

// global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(err?.status || 500).json({ error: err?.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server listening on http://localhost:${PORT}`));