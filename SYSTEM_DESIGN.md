# Privacy Policy Analyzer - Complete System Design

## 🎯 Project Overview
A full-stack AI-powered application that analyzes privacy policies and legal documents, converting complex legal language into simple, readable summaries using RAG (Retrieval-Augmented Generation) and LLMs.

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                    (Next.js Frontend - Port 3000)                │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑
                    HTTP/REST API Calls
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                    NODE.JS BACKEND                               │
│                  (Express Server - Port 3001)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ • File upload handling (multer)                          │  │
│  │ • Route /api/upload → forwards to Python                │  │
│  │ • Route /api/query → retrieves chunks + calls Groq LLM  │  │
│  │ • Route /api/original-text → gets full doc              │  │
│  │ • Groq API integration (LLM for summarization)          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                     ↓ ↑                    ↓ ↑
            HTTP Requests          HTTP Requests
                     ↓ ↑                    ↓ ↑
    ┌──────────────────────┐    ┌──────────────────────┐
    │  GROQ LLM API        │    │ PYTHON RAG SERVER    │
    │  (Cloud Service)     │    │ (FastAPI - Port 8000)│
    │  • Summarization     │    │ ┌──────────────────┐ │
    │  • Text generation   │    │ │ /process/        │ │
    │  • Streaming         │    │ │ - Load PDF       │ │
    │                      │    │ │ - Split chunks   │ │
    │                      │    │ │ - Create embedding
    │                      │    │ │ - Store in Chroma
    │                      │    │ ┌──────────────────┐ │
    │                      │    │ │ /retrieve/       │ │
    │                      │    │ │ - Vector search  │ │
    │                      │    │ │ - Return sources │ │
    │                      │    │ ┌──────────────────┐ │
    │                      │    │ │ /get-text/       │ │
    │                      │    │ │ - Return full doc│ │
    │                      │    │ └──────────────────┘ │
    └──────────────────────┘    └──────────────────────┘
                                         ↓ ↑
                                   Local Storage
                                         ↓ ↑
                    ┌──────────────────────────────┐
                    │   CHROMA VECTOR DATABASE     │
                    │   (chroma_db/ folder)        │
                    │ • Stores embeddings          │
                    │ • Persists document chunks   │
                    │ • Each PDF gets collection   │
                    └──────────────────────────────┘
```

---

## 🗂️ FRONTEND (Next.js 15.5 + React 19)
**Location:** `frontend/`

### Key Files & Responsibilities:

#### 1. **Layout & Pages**
- `src/app/layout.jsx` - Root layout with providers
- `src/app/page.jsx` - **HOME PAGE** - Hero landing page with CTA buttons
- `src/app/upload/` - **UPLOAD PAGE** - Drag-drop PDF upload interface
- `src/app/results/` - **RESULTS PAGE** - Display analyzed results & simplified text
- `src/app/login/` - Authentication pages (if implemented)

#### 2. **Components** (`src/components/`)
- **Header.jsx** - Navigation bar across all pages
- **Footer.jsx** - Footer with links
- **UploadArea.jsx** - **Drag-drop file upload component**
  - Validates PDF file type
  - Handles drag/drop and click-to-upload
  - Shows upload progress
  
- **Chatbot.jsx** - Chat interface for asking questions about uploaded document
  
- **ComparisonView.jsx** - Side-by-side comparison of:
  - Original legal text
  - Simplified AI summary
  
- **Timeline.jsx** - Process visualization/steps
- **FeatureCard.jsx** - Reusable component for feature cards
- **Providers.jsx** - React context providers setup

#### 3. **API Client** (`src/lib/api.js`)
```javascript
analyzePdf(file) - Sends PDF to backend
  └─> POST /api/upload
      └─> Returns: { collection_id, chunks_indexed, filename }
```

#### 4. **Styling**
- **globals.css** - Global styles + animations
- **tailwindcss** - Utility-first CSS framework (v4)
- **postcss** - CSS preprocessing

#### 5. **Configuration**
- **next.config.mjs** - Next.js config (turbopack, etc.)
- **package.json** - Frontend dependencies
- **jsconfig.json** - JavaScript/JSX config
- **.eslintrc** - Code linting rules

### Frontend Workflow:
1. User lands on HOME page
2. User navigates to UPLOAD page and drops/selects PDF
3. File sent to backend: `POST /api/upload`
4. Backend forwards to Python server for processing
5. User redirected to RESULTS page with `collection_id`
6. User can ask questions about document
7. Questions sent to backend: `POST /api/query`
8. Backend retrieves chunks from Python server
9. Backend calls Groq LLM to summarize
10. Results streamed back to frontend

---

## 🔧 BACKEND (Express.js - Node.js)
**Location:** `backend/`

### Key Files & Responsibilities:

#### 1. **server.js** - Main Application File
The core backend server with all API endpoints:

#### **Configuration Section**
```javascript
- PYTHON_API_URL = http://localhost:8000 (connects to Python server)
- PORT = 3001
- GROQ_API_KEY = API key for Groq LLM
- GROQ_MODEL = 'llama-3.1-8b-instant'
- Multer setup for file uploads → stores in /uploads directory
```

#### **API Endpoints:**

##### **1. Health Check**
```
GET /api/health
→ { ok: true, message: 'Node.js backend is running' }
```

##### **2. File Upload** ⭐ KEY ENDPOINT
```
POST /api/upload
Input: FormData with PDF file
Process:
  1. Multer receives file → saves to /uploads temp folder
  2. Creates FormData with file stream
  3. Forwards to Python: POST http://localhost:8000/process/
  4. Python returns: { collection_id, chunks_indexed, filename }
  5. Cleans up temp file
  6. Returns response to frontend
Output: { collection_id, chunks_indexed, filename }
Error handling: Connection errors, file validation, timeouts
```

##### **3. Query/Analysis** ⭐ KEY ENDPOINT
```
POST /api/query
Input: { collection_id, question, top_k }
Process:
  1. Retrieves chunks from Python: POST /retrieve/
  2. Two paths based on text length:
     
     FAST PATH (< 15KB):
     └─> Single Groq call to summarize all chunks
     
     MAP-REDUCE PATH (> 15KB):
     ├─> MAP: Summarize each chunk in parallel
     └─> REDUCE: Combine summaries into final answer
  
  3. Streams response back using Server-Sent Events (SSE)
     - Status updates: "Retrieving...", "Simplifying...", "Generating..."
     - Token-by-token streaming of results
     - Final sources array with metadata
     
Output: Server-Sent Events stream with:
   - { status: "..." } - Progress updates
   - { token: "..." } - Response text chunks
   - { done: true, sources: [...] } - Completion signal
```

##### **4. Get Original Text**
```
GET /api/original-text/:collection_id
→ Retrieves full original document text from Python server
```

#### **Helper Functions:**

**callGroq(prompt, maxTokens)**
- Makes authenticated calls to Groq API
- Uses OpenAI-compatible format
- Handles errors and retries
- System prompt: "You are a helpful assistant."
- Max tokens: Limited to 500-2000 for speed

**summarizeChunk(chunkText, index)**
- Summarizes individual chunks (for map phase)
- Returns 2-3 bullet points
- Fallback: Truncated original text if API fails

#### 2. **Dependencies** (package.json)
```json
- express: Web framework
- cors: Cross-origin requests
- multer: File upload handling
- axios: HTTP client (calls Python & Groq)
- dotenv: Environment variables
- form-data: Multipart form handling
- pdf-parse: PDF processing (alternative method)
- uuid: Generate unique IDs
- body-parser: Parse request bodies
```

#### 3. **.env Configuration** (Not in repo - create locally)
```
PYTHON_API_URL=http://localhost:8000
PORT=3001
GROQ_API_KEY=your_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
```

### Backend Workflow:
1. Express server starts on port 3001
2. CORS enabled for frontend requests
3. Multer middleware intercepts file uploads
4. Routes requests to appropriate handlers
5. Coordinates between frontend and Python server
6. Manages LLM API calls to Groq
7. Streams results back progressively

---

## 🐍 PYTHON SERVER (FastAPI)
**Location:** `python-server/`

### Key Files & Responsibilities:

#### 1. **main.py** - FastAPI Application
RAG (Retrieval-Augmented Generation) server for document processing and retrieval.

#### **Configuration Section**
```python
- PYTHON_API_URL = http://localhost:8000
- UPLOADS_DIR = "temp_uploads/" (temporary file storage)
- CHROMA_DIR = "chroma_db/" (vector database)
- EMBEDDING_MODEL = "all-MiniLM-L6-v2" (HuggingFace embeddings)
```

#### **Libraries Used:**
```python
- FastAPI: Web framework
- PyPDFLoader: Extract text from PDFs
- RecursiveCharacterTextSplitter: Split documents into chunks
- HuggingFaceEmbeddings: Create text embeddings
- ChromaDB: Vector database for storing embeddings
- LangChain: RAG orchestration
```

#### **Data Models (Pydantic):**
```python
ProcessResponse:
  - collection_id: str (unique ID for processed document)
  - chunks_indexed: int (number of chunks created)
  - filename: str

RetrieveRequest:
  - collection_id: str
  - question: str (query to search for)
  - top_k: int = 3 (number of results)

Source:
  - id: str (chunk ID)
  - filename: str
  - page_number: int
  - score: float (relevance score)
  - text_snippet: str

RetrieveResponse:
  - sources: list[Source] (retrieved chunks)
```

#### **API Endpoints:**

##### **1. Process PDF** ⭐ CORE ENDPOINT
```
POST /process/
Input: PDF file (multipart/form-data)
Process:
  1. Validate file is PDF
  2. Generate unique collection_id: "rag_{filename}_{timestamp}"
  3. Save file temporarily
  4. Load PDF with PyPDFLoader
     └─> Extracts all text and metadata
  5. Split document into chunks
     └─> Size: 1000 chars, overlap: 100 chars
     └─> Strategy: RecursiveCharacterTextSplitter
  6. Create vector store (ChromaDB)
  7. Generate embeddings for each chunk
     └─> Using: all-MiniLM-L6-v2
     └─> Stored with metadata (filename, page number)
  8. Persist to chroma_db/{collection_id}/
  9. Clean up temp file
  10. Return response

Output:
{
  "collection_id": "rag_document_name_1234567890",
  "chunks_indexed": 42,
  "filename": "document_name.pdf"
}

Errors:
- 400: Not a PDF file
- 404: No text extracted from PDF
- 500: Processing error
```

##### **2. Retrieve Chunks** ⭐ CORE ENDPOINT
```
POST /retrieve/
Input: { collection_id, question, top_k }
Process:
  1. Load vector store from chroma_db/{collection_id}/
  2. Initialize embeddings with same model
  3. Perform vector similarity search
     └─> Converts question to embedding
     └─> Finds k most similar chunks
     └─> Returns with similarity scores
  4. Format results with metadata

Output:
{
  "sources": [
    {
      "id": "chunk_0",
      "filename": "google_privacy_policy_en.pdf",
      "page_number": 3,
      "score": 0.87,  // Similarity score 0-1
      "text_snippet": "We collect data to improve..."
    },
    ...
  ]
}
```

##### **3. Get Text**
```
GET /get-text/:collection_id
→ Returns full original document text
```

#### 2. **Vector Database** (ChromaDB)
**Location:** `chroma_db/` directory

Structure:
```
chroma_db/
├── rag_google_privacy_policy_en_1771349102/
│   ├── chroma.sqlite3 (database file)
│   └── (embedded documents stored)
├── rag_autoCV_1769849383/
├── rag_Academic_Rules_and_Regulations_May2024_1776163401/
└── ... (one folder per uploaded document)
```

Each folder contains:
- **chroma.sqlite3**: Vector embeddings + metadata
- **Chunks**: Split document text
- **Metadata**: Filename, page numbers, etc.

#### 3. **Temporary Uploads** (temp_uploads/)
- Stores uploaded PDFs temporarily
- Automatically cleaned after processing
- Never persisted

#### 4. **Dependencies** (req.txt)
```
fastapi
pydantic
langchain
langchain-community
langchain-text-splitters
pypdf (or PyPDFLoader from langchain)
huggingface-hub
chroma-db
sentence-transformers (for embeddings)
uvicorn (ASGI server)
python-multipart
```

#### 5. **Running the Server**
```bash
cd python-server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Python Server Workflow:
1. FastAPI server starts on port 8000
2. Waits for PDF uploads from backend
3. Processes PDFs into document chunks
4. Creates vector embeddings (numerical representations)
5. Stores in ChromaDB for fast retrieval
6. On queries: finds most relevant chunks via vector similarity
7. Returns ranked results to backend for LLM processing

---

## 🔄 Data Flow (Complete Journey)

### Scenario: User uploads a privacy policy

```
1. USER UPLOADS PDF
   └─> Frontend: UploadArea.jsx detects file
       └─> Calls: analyzePdf(file)
           └─> Makes: POST /api/upload (with FormData)

2. BACKEND RECEIVES FILE
   └─> server.js: /api/upload endpoint
       └─> Multer saves to /uploads/temp
           └─> Creates FormData with file stream
               └─> HTTP POST to Python: /process/

3. PYTHON PROCESSES PDF
   └─> main.py: /process/ endpoint
       ├─> Loads PDF (extracts text + metadata)
       ├─> Splits into ~1000 char chunks (1-5 min for large docs)
       ├─> Generates embeddings for each chunk (HuggingFace model)
       ├─> Stores in ChromaDB: chroma_db/rag_{name}_{timestamp}/
       └─> Returns: { collection_id, chunks_indexed, filename }

4. BACKEND CLEANS UP & RESPONDS
   └─> Deletes /uploads/temp file
       └─> Returns collection_id to frontend

5. FRONTEND RECEIVES COLLECTION_ID
   └─> Stores in URL/state
       └─> Navigates to results page
           └─> Displays: "42 chunks indexed"

════════════════════════════════════════════════════════════

6. USER ASKS A QUESTION
   └─> Frontend: textbox in ComparisonView
       └─> Sends: POST /api/query
           └─> Body: { collection_id, question: "What data is collected?" }

7. BACKEND RETRIEVES RELEVANT CHUNKS
   └─> server.js: /api/query endpoint
       ├─> Calls Python: POST /retrieve/
       │   └─> Returns: 5 most relevant chunks with scores
       │
       ├─> Decision: Text size < 15KB? (FAST PATH)
       │   YES → Direct Groq call
       │   NO  → Map-Reduce with parallel summarization
       │
       ├─> Map Phase (if needed):
       │   └─> Groq call for each chunk in parallel
       │       └─> Extract key points from snippet
       │
       └─> Reduce Phase:
           └─> Groq call to combine summaries

8. GROQ LLM GENERATES ANSWER
   └─> Groq API (cloud): /chat/completions
       ├─> Receives: prompt + chunks
       ├─> Model: llama-3.1-8b-instant
       └─> Returns: Streaming response

9. BACKEND STREAMS BACK
   └─> Uses Server-Sent Events (SSE)
       ├─> First: { status: "Retrieving..." }
       ├─> Then: { status: "Simplifying..." }
       ├─> Then: { token: "•" }, { token: "Data" }, ...
       └─> Finally: { done: true, sources: [...] }

10. FRONTEND DISPLAYS RESULTS
    └─> ComparisonView component
        ├─> Left side: Original text from PDF
        ├─> Right side: Streamed simplified answer
        ├─> Bottom: Sources (which chunks were used)
        └─> Interactive: User can ask new questions
```

---

## 🗂️ Directory Structure Summary

```
project-root/
│
├── README.md (Project overview)
├── SYSTEM_DESIGN.md (This file)
│
├── frontend/                      # React/Next.js frontend
│   ├── package.json              # Dependencies: react, next, tailwindcss
│   ├── next.config.mjs           # Next.js config
│   ├── postcss.config.mjs        # CSS processing
│   ├── jsconfig.json             # JS config
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.jsx          # HOME page
│   │   │   ├── layout.jsx        # Root layout with Providers
│   │   │   ├── globals.css       # Global styles
│   │   │   ├── upload/           # UPLOAD page
│   │   │   ├── results/          # RESULTS page
│   │   │   └── login/            # LOGIN pages
│   │   │
│   │   ├── components/           # Reusable React components
│   │   │   ├── Header.jsx        # Navigation
│   │   │   ├── Footer.jsx        # Footer
│   │   │   ├── UploadArea.jsx    # Drag-drop upload
│   │   │   ├── ComparisonView.jsx # Side-by-side display
│   │   │   ├── Chatbot.jsx       # Chat interface
│   │   │   ├── Timeline.jsx      # Process steps
│   │   │   ├── FeatureCard.jsx   # Feature cards
│   │   │   └── Providers.jsx     # Context providers
│   │   │
│   │   └── lib/
│   │       └── api.js            # API client (analyzePdf function)
│   │
│   ├── public/                   # Static assets
│   └── pnpm-lock.yaml           # Dependency lock file
│
├── backend/                      # Express.js backend
│   ├── package.json              # Dependencies: express, cors, multer, axios
│   ├── server.js                 # Main server (ALL endpoints here)
│   ├── routes/                   # (Empty - all routes in server.js)
│   └── uploads/                  # Temp storage for uploaded files
│
├── python-server/                # FastAPI Python server
│   ├── main.py                   # Main app (RAG processing)
│   ├── req.txt                   # Python dependencies
│   │   # Libraries: fastapi, langchain, chroma, sentence-transformers
│   │
│   ├── chroma_db/                # Vector database (persistent storage)
│   │   ├── rag_google_privacy_policy_en_1771349102/
│   │   ├── rag_autoCV_1769849383/
│   │   ├── rag_Academic_Rules_and_Regulations_May2024_1776163401/
│   │   └── ... (one folder per uploaded document)
│   │
│   └── temp_uploads/             # Temporary file storage (cleaned after processing)
│
└── uploads/                      # Alternative uploads folder (created by Docker or setup)
```

---

## 🔌 How Components Connect

### Connection 1: FRONTEND ↔ BACKEND
```
Frontend                    Backend (Express)
  ↓                              ↓
  uploadArea.jsx --------→ POST /api/upload
  (FormData)                  (receives PDF)
                                 ↓
                            returns collection_id
                                 ↓
  ComparisonView.jsx ←----- JSON response

  question input --------→ POST /api/query
                                 ↓
                            returns SSE stream
                                 ↓
  displays answer ←------ SSE: token-by-token
```

### Connection 2: BACKEND ↔ PYTHON SERVER
```
Backend (Express)           Python Server (FastAPI)
  ↓                              ↓
  POST /api/upload ------→ POST /process/
  (forwards PDF)                 ↓
                            - Load PDF
                            - Split chunks
                            - Create embeddings
                            - Store in ChromaDB
  ←------------------------ JSON response
  (collection_id)

  POST /api/query -------→ POST /retrieve/
  (sends collection_id)          ↓
  (sends question)         - Vector similarity search
                            - Return top chunks
  ←------------------------ JSON response
  (sources array)
```

### Connection 3: BACKEND ↔ GROQ LLM
```
Backend (Express)           Groq API (Cloud)
  ↓                              ↓
  POST /chat/completions →  llama-3.1-8b-instant
  (prompt + chunks)              ↓
  (auth: API key)           - Generate response
                            - Stream tokens
  ←------------------------ SSE stream
  (response tokens)
```

---

## 🚀 Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15.5 + React 19 | User interface, file upload, results display |
| **Frontend UI** | Tailwind CSS v4 | Styling and animations |
| **Backend** | Node.js + Express 5 | API server, file routing, LLM coordination |
| **File Upload** | Multer | Handle multipart/form-data uploads |
| **HTTP Client** | Axios | Make requests to Python server & Groq |
| **Python Server** | FastAPI | RAG document processing |
| **Document Processing** | LangChain | PDF loading, chunking, embedding |
| **PDF Extraction** | PyPDFLoader | Extract text from PDFs |
| **Text Splitting** | RecursiveCharacterTextSplitter | Smart document chunking |
| **Embeddings** | HuggingFace (all-MiniLM-L6-v2) | Convert text to vectors |
| **Vector DB** | ChromaDB | Store and retrieve embeddings |
| **LLM** | Groq (llama-3.1-8b-instant) | Generate summaries & responses |
| **Server** | Uvicorn | ASGI server for Python |

---

## 📝 Environment Setup

### Frontend (.env or hardcoded)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### Backend (.env)
```
PYTHON_API_URL=http://localhost:8000
PORT=3001
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.1-8b-instant
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
```

### Python Server (hardcoded in main.py)
```python
UPLOADS_DIR = "temp_uploads"
CHROMA_DIR = "chroma_db"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
```

---

## 🎯 Key Features Explained

### Feature 1: Document Upload & Processing
- User uploads PDF → Multer saves temporarily
- Backend forwards to Python server
- Python: Extracts text, splits into chunks, generates embeddings
- Stores in ChromaDB with metadata
- Returns collection_id for future queries

### Feature 2: Question Answering (RAG)
- User asks question about document
- Backend retrieves most relevant chunks via vector similarity search
- Smart path selection (fast vs map-reduce) based on text length
- Groq LLM summarizes chunks into human-readable answer
- Results streamed back progressively (SSE)

### Feature 3: Comparison View
- Shows original legal text on left (from Python /get-text/)
- Shows AI-simplified summary on right (from Groq)
- User can compare and understand differences
- Browse sources used for answer

### Feature 4: Multi-Document Support
- Each PDF gets unique collection_id
- Separate vector store per document in chroma_db/
- Can upload multiple documents and query any of them
- User likely tracks collections in session/database

---

## 🔐 Security Considerations

1. **File Validation**
   - Only PDF files accepted
   - Size limits enforced (10MB mentioned in UI)
   - Temp files cleaned after processing

2. **API Keys**
   - Groq API key stored in backend .env (not exposed to frontend)
   - Backend never leaks API keys in responses

3. **CORS**
   - Enabled on backend for frontend requests
   - Should be configured for specific origins in production

4. **Error Handling**
   - Graceful error messages to frontend
   - No stack traces exposed
   - Connection errors handled

---

## 📊 Performance Considerations

1. **Document Processing**
   - Large PDFs take 1-5 minutes (chunking + embedding)
   - Embeddings created only once and stored
   - Reusing collection_id is instant

2. **Query Speed**
   - Vector similarity search: ~100ms (ChromaDB is fast)
   - LLM generation: 2-10 seconds (depends on prompt length)
   - Streaming: Progressive display to user

3. **Optimization Paths**
   - Fast path (< 15KB): Single LLM call
   - Map-reduce (> 15KB): Parallel chunk summarization

---

## 🔄 Example Request-Response Cycle

### Upload Request
```
POST http://localhost:3001/api/upload
Content-Type: multipart/form-data

[PDF file binary data]

Response (201):
{
  "collection_id": "rag_privacy_policy_1776163401",
  "chunks_indexed": 125,
  "filename": "privacy_policy.pdf"
}
```

### Query Request
```
POST http://localhost:3001/api/query
Content-Type: application/json

{
  "collection_id": "rag_privacy_policy_1776163401",
  "question": "What data do you collect from users?",
  "top_k": 5
}

Response (streaming):
data: {"status":"Retrieving..."}
data: {"status":"Simplifying text..."}
data: {"token":"• All"}
data: {"token":" personal"}
data: {"token":" information"}
...
data: {"done":true,"sources":[...]}
```

---

## 🎓 Key Concepts

**RAG (Retrieval-Augmented Generation)**
- Retrieve relevant document chunks matching user query
- Generate LLM response based on retrieved context
- Better than: Raw LLM (no context) or Full document (too much text)

**Vector Embeddings**
- Convert text to numerical vectors (~384 dimensions)
- Similar meanings have similar vectors
- Enables fast similarity search over thousands of chunks

**ChromaDB**
- In-memory or persistent vector database
- Stores embeddings + metadata
- Powers fast semantic search

**Chunking Strategy**
- Split large documents into smaller pieces (1000 chars each)
- Overlap (100 chars) preserves context between chunks
- Enables fine-grained retrieval

**Server-Sent Events (SSE)**
- Allows backend to stream responses to frontend
- User sees progressive text appearance
- Better UX than waiting for full response

---

## 📋 Summary Table

| Component | Location | Language | Purpose |
|-----------|----------|----------|---------|
| **Home Page** | frontend/src/app/page.jsx | JSX | Landing page with hero |
| **Upload Page** | frontend/src/app/upload/ | JSX | File upload interface |
| **Results Page** | frontend/src/app/results/ | JSX | Display analysis & chat |
| **UploadArea** | frontend/src/components/ | JSX | Drag-drop component |
| **ComparisonView** | frontend/src/components/ | JSX | Side-by-side display |
| **Backend Server** | backend/server.js | JavaScript | Express API + routing |
| **Python RAG** | python-server/main.py | Python | Document processing |
| **Vector DB** | python-server/chroma_db/ | SQLite | Persistent embeddings |

---

## 🚀 Starting All Services

```bash
# Terminal 1: Python Server
cd python-server
python -m uvicorn main:app --reload --port 8000

# Terminal 2: Backend
cd backend
npm install
npm run dev  # or: node server.js

# Terminal 3: Frontend
cd frontend
npm install
npm run dev  # or: pnpm dev
```

Access at: `http://localhost:3000`

---

**This system is a full-stack AI application achieving document understanding through retrieval-augmented generation (RAG) combined with LLM summarization.**
