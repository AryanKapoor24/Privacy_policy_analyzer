import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoutes from "./routes/analyze.js";

// Load environment variables from .env file
dotenv.config();

// Create an Express app instance
const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Allow Express to read JSON data from requests
app.use(express.json());

// Register routes — anything that starts with "/api" will go to analyzeRoutes
app.use("/api", analyzeRoutes);

// Define which port the server will listen on
const PORT = process.env.PORT || 5000;

// Start the server and log a message to the console
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
