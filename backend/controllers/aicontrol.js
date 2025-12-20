import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

// Ensure the uploads directory exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const UPLOADS_DIR = join(__dirname, '..', 'uploads');
const JSON_OUTPUT_DIR = join(UPLOADS_DIR, 'parsed');

// Create directories if they don't exist
const ensureDirExists = async (dir) => {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
};

// Initialize directories
await ensureDirExists(UPLOADS_DIR);
await ensureDirExists(JSON_OUTPUT_DIR);

const parsePdfBuffer = async (buffer) => {
    try {
        // Use dynamic import for better ESM compatibility
        const { default: pdfParse } = await import('pdf-parse/lib/pdf-parse.js');
        
        console.log("pdf-parse loaded successfully");
        
        if (typeof pdfParse !== 'function') {
            throw new Error(`Could not load pdf-parse library function. Resolved type: ${typeof pdfParse}`);
        }

        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        console.error("Error parsing PDF buffer:", error);
        throw new Error("Failed to parse PDF content: " + error.message);
    }
};

export const analyzePDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await parsePdfBuffer(req.file.buffer);
    const text = (result?.text || "").trim();
    const pages = result?.pages?.length || 1; // Get page count from the result
    const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
    
    // Create a unique filename using timestamp and random number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const jsonFilename = `doc_${timestamp}_${random}.json`;
    const jsonPath = join(JSON_OUTPUT_DIR, jsonFilename);
    
    // Prepare the data to save
    const jsonData = {
      originalFilename: req.file.originalname,
      timestamp: new Date().toISOString(),
      pages,
      wordCount,
      textLength: text.length,
      preview: text.slice(0, 2000),
      fullText: text,
      metadata: {
        pageCount: pages,
        characters: text.length,
        words: wordCount,
      }
    };
    
    // Save as JSON file
    await fs.writeFile(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');
    
    // Return the response with the path to the JSON file
    return res.json({
      success: true,
      pages,
      wordCount,
      preview: jsonData.preview,
      textLength: jsonData.textLength,
      jsonFile: `/api/uploads/parsed/${jsonFilename}`, // Public URL to access the file
      timestamp: jsonData.timestamp,
      originalFilename: req.file.originalname
    });
  } catch (err) {
    // log full error for debugging
    console.error("analyzePDF error:", err && err.stack ? err.stack : err);
    return res.status(500).json({ error: "Failed to process document", details: err?.message || String(err) });
  }
};