import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// --- CONFIGURATION ---
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';
const PORT = process.env.PORT || 3001;

// Groq API Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY || 'YOUR_GROQ_API_KEY_HERE';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';  // Widely available Groq model
const GROQ_API_URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists for multer's temporary storage
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.GROQ_API_KEY) {
  console.warn('Warning: GROQ_API_KEY is not set. Add it in backend/.env before using /api/query.');
} else {
  const keyPreview = GROQ_API_KEY.substring(0, 10) + '...' + GROQ_API_KEY.substring(GROQ_API_KEY.length - 5);
  console.log(`✓ Groq API Key configured: ${keyPreview}`);
  console.log(`✓ Groq Model: ${GROQ_MODEL}`);
}

// ==============================
// HEALTH CHECK
// ==============================
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Node.js backend is running' });
});


// UPLOAD ENDPOINT (NOW CALLS PYTHON)

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`📤 Uploading file to Python: ${req.file.originalname}`);
    console.log(`   Python server URL: ${PYTHON_API_URL}/process/`);

    // Create a form and append the file stream from the path where multer saved it
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path), req.file.originalname);

    // Forward the file to the Python RAG server's /process/ endpoint
    const uploadStart = Date.now();
    const response = await axios.post(`${PYTHON_API_URL}/process/`, form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 120000, // 2 minute timeout for file processing
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const elapsed = Date.now() - uploadStart;
    console.log(`✓ Python processing completed in ${elapsed}ms`);
    console.log(`   Collection ID: ${response.data?.collection_id}`);

    // IMPORTANT: Clean up the temporary file saved by multer
    fs.unlinkSync(req.file.path);

    // Return the successful response from the Python server to the frontend
    return res.json(response.data);

  } catch (err) {
    console.error("❌ Upload processing error:", {
      message: err.message,
      code: err.code,
      pythonUrl: `${PYTHON_API_URL}/process/`,
      pythonError: err.response?.data || err.response?.statusText || 'No response',
      status: err.response?.status,
    });
    
    // Clean up file on error as well
    if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }
    
    // Better error messages
    let detail = err.message;
    if (err.code === 'ECONNREFUSED') {
      detail = `Cannot connect to Python server at ${PYTHON_API_URL}. Is it running?`;
    } else if (err.code === 'ENOTFOUND') {
      detail = `Python server hostname not found: ${PYTHON_API_URL}`;
    } else if (err.response?.status === 400) {
      detail = `File validation failed: ${err.response.data?.detail || 'Invalid PDF'}`;
    } else if (err.response?.status === 500) {
      detail = `Python server error: ${err.response.data?.detail || 'Internal error'}`;
    }
    
    res.status(500).json({ 
      error: "processing_failed", 
      detail: detail,
      pythonUrl: PYTHON_API_URL
    });
  }
});

// ==============================
// HELPER: Call Groq API (OpenAI-compatible)
// ==============================
async function callGroq(prompt, maxTokens = 500) {
  try {
    console.log(`\n🔄 Groq API call:`);
    console.log(`   Key: ${GROQ_API_KEY ? '✓ Present' : '❌ MISSING'}`);
    console.log(`   Model: ${GROQ_MODEL}`);
    console.log(`   Tokens: ${maxTokens}`);
    
    const response = await axios.post(GROQ_API_URL, {
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt.substring(0, 2000) }
      ],
      max_tokens: Math.max(100, Math.min(maxTokens, 2000)),
      temperature: 0.2
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    console.log(`✓ Groq success`);
    return response.data.choices?.[0]?.message?.content?.trim() || 'No response';
  } catch (err) {
    console.error(`❌ Groq failed:`);
    console.error(`   Status: ${err.response?.status}`);
    console.error(`   Code: ${err.code}`);
    console.error(`   Message: ${err.message}`);
    console.error(`   Response: ${JSON.stringify(err.response?.data)?.substring(0, 200)}`);
    throw err;
  }
}

// ==============================
// HELPER: Summarize a single chunk (for Map phase)
// ==============================
async function summarizeChunk(chunkText, index) {
const prompt = `Summarize in 2-3 bullets, key practical points only:\n\n${chunkText}`;

  try {
    const summary = await callGroq(prompt, 80);  // Ultra-short chunks
    return { index, summary: summary || chunkText.substring(0, 150) + '...' };
  } catch (err) {
    console.error(`Error summarizing chunk ${index}:`, err.message);
    return { index, summary: chunkText.substring(0, 200) + '...' }; // Fallback to truncated original
  }
}

// ==============================
// QUERY ENDPOINT (SMART: FAST PATH FOR SHORT TEXT, MAP-REDUCE FOR LONG)
// ==============================
app.post('/api/query', async (req, res) => {
  try {
    const { collection_id, question, top_k = 3 } = req.body;

    if (!collection_id) return res.status(400).json({ error: 'collection_id missing' });
    if (!question) return res.status(400).json({ error: 'question missing' });

    // 1. Retrieve relevant chunks from the Python RAG server
    const queryStart = Date.now();
    const retrieveResponse = await axios.post(`${PYTHON_API_URL}/retrieve/`, {
      collection_id,
      question,
      top_k: top_k || 5,  // Reduced from 10 to 5 for speed (still good coverage)
    });
    console.log(`Retrieved ${retrieveResponse.data.sources.length} chunks in ${Date.now() - queryStart}ms`);

    const sources = retrieveResponse.data.sources;
    const combinedText = sources.map(s => s.text_snippet).join('\n\n');

    // Set headers for streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // FAST PATH: If text is short, skip Map-Reduce and call LLM directly
    const FAST_PATH_THRESHOLD = 15000; // Handle even longer docs in single call
    
    let prompt;
    if (combinedText.length < FAST_PATH_THRESHOLD) {
      // Direct simplification - single LLM call
      res.write(`data: ${JSON.stringify({ status: 'Simplifying text...' })}\n\n`);
      
      prompt = `Summarize key points from this policy in 5-10 bullets. Be concise, practical, focus on what affects the user:\n\n${combinedText}`;
    } else {
      // MAP-REDUCE for longer text
      res.write(`data: ${JSON.stringify({ status: 'Summarizing chunks in parallel...' })}\n\n`);

      // MAP PHASE: Summarize each chunk in parallel
      const mapStart = Date.now();
      const chunkTexts = sources.map(s => s.text_snippet);
      const summaryPromises = chunkTexts.map((text, index) => summarizeChunk(text, index));
      const summaryResults = await Promise.all(summaryPromises);
      console.log(`Map phase (${chunkTexts.length} chunks) completed in ${Date.now() - mapStart}ms`);

      // Sort by index to maintain order
      summaryResults.sort((a, b) => a.index - b.index);
      const summaries = summaryResults.map(r => r.summary);

      res.write(`data: ${JSON.stringify({ status: 'Generating final summary...' })}\n\n`);

      // REDUCE PHASE: Combine summaries
      const combinedSummaries = summaries.join('\n');
      prompt = `Combine into concise bullets, avoid repeats, focus on user impact:\n\n${combinedSummaries}`;
    }

    // Call Groq API
    res.write(`data: ${JSON.stringify({ status: 'Generating response...' })}\n\n`);
    
    let simplifiedText = '';
    try {
      simplifiedText = await callGroq(prompt, 500);  // Ultra-low token limit for speed
    } catch (groqErr) {
      console.error('Groq call failed:', groqErr.message);
      res.write(`data: ${JSON.stringify({ status: 'Service temporarily unavailable, retrying...', error: groqErr.message })}\n\n`);
      // Send basic fallback instead of crashing
      simplifiedText = `• Unable to process at this moment\n• Error: ${groqErr.message}\n• Please refresh and try again`;
    }
    
    // Send the result as tokens (simulating streaming for smooth UI)
    if (!simplifiedText) {
      res.write(`data: ${JSON.stringify({ token: 'No response generated.' })}\n\n`);
    } else {
      const lines = simplifiedText.split('\n');
      for (const line of lines) {
        if (line.trim()) {
          res.write(`data: ${JSON.stringify({ token: line + '\n' })}\n\n`);
        }
      }
    }
    
    // Send done signal
    res.write(`data: ${JSON.stringify({ done: true, sources })}\n\n`);
    res.end();

  } catch (err) {
    console.error("Query error:", err.response ? err.response.data : err.message);
    // Check if headers have already been sent
    if (!res.headersSent) {
      res.status(500).json({ error: "query_failed", detail: err.response ? err.response.data : err.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  }
});

// ==============================
// GET ORIGINAL TEXT ENDPOINT
// ==============================
app.get('/api/original-text/:collection_id', async (req, res) => {
  try {
    const { collection_id } = req.params;
    if (!collection_id) {
      return res.status(400).json({ error: 'collection_id is required' });
    }

    // Forward the request to the Python server's new endpoint
    const response = await axios.get(`${PYTHON_API_URL}/get-text/${collection_id}`);

    // Return the successful response from the Python server to the frontend
    return res.json(response.data);

  } catch (err) {
    console.error("Error fetching original text:", err.response ? err.response.data : err.message);
    res.status(500).json({ error: "original_text_failed", detail: err.response ? err.response.data : err.message });
  }
});

// ==============================
// SERVER START
// ==============================
app.listen(PORT, () => {
  console.log(`Backend running (connected to Python) → http://localhost:${PORT}`);
});