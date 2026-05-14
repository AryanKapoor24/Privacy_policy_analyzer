# Quick Reference: Architecture Overview

## 🎯 What Does This App Do?
Upload PDFs (privacy policies, legal docs) → AI analyzes them → Get simple summaries you can understand

---

## 🏗️ Three Main Parts

### 1️⃣ **FRONTEND** (React/Next.js - Port 3000)
What users see and interact with
- **Home page**: Landing page with features
- **Upload page**: Drag-drop to upload PDF
- **Results page**: Shows original text + AI summary side-by-side
- **Chatbot**: Ask questions about the document

**Key files:**
- `frontend/src/app/page.jsx` - Home
- `frontend/src/app/upload/` - Upload interface
- `frontend/src/app/results/` - Results display
- `frontend/src/components/` - Reusable UI parts

---

### 2️⃣ **BACKEND** (Express.js - Port 3001)
The "brain" that coordinates everything
- Receives PDFs from frontend
- Forwards them to Python server for processing
- Calls Groq LLM to create summaries
- Manages the conversation flow

**Main file:**
- `backend/server.js` - **ALL the logic is here!**

**Key endpoints:**
```
POST /api/upload         → sends PDF to Python server
POST /api/query          → asks question, gets summary
GET  /api/original-text  → gets full document text
```

---

### 3️⃣ **PYTHON SERVER** (FastAPI - Port 8000)
Specialized for document intelligence
- Loads PDFs and extracts text
- Splits documents into manageable chunks
- Creates "embeddings" (mathematical representations)
- Stores in a vector database (ChromaDB)
- Finds relevant chunks when user asks questions

**Main file:**
- `python-server/main.py`

**Key endpoints:**
```
POST /process/   → receives PDF, processes it, stores in database
POST /retrieve/  → searches database for chunks matching a question
```

**Database:**
- `python-server/chroma_db/` - Stores all embeddings for fast search

---

## 🔄 How Data Flows (Step by Step)

```
USER UPLOADS PDF
        ↓
   Frontend detects file
        ↓
   POST to backend (/api/upload)
        ↓
   Backend forwards to Python server
        ↓
   Python: Extracts text → Splits chunks → Creates embeddings
        ↓
   Stores in ChromaDB database
        ↓
   Python returns: "I indexed 125 chunks"
        ↓
   Frontend navigates to Results page
        ↓

USER ASKS A QUESTION ("What data is collected?")
        ↓
   Frontend sends question to backend (/api/query)
        ↓
   Backend asks Python: "Find chunks matching this question"
        ↓
   Python searches ChromaDB vector database
        ↓
   Python returns: 5 most relevant chunks
        ↓
   Backend sends chunks + question to Groq LLM
        ↓
   Groq LLM reads chunks and generates summary
        ↓
   Backend streams response back to frontend
        ↓
   Frontend displays: "• They collect your location data"
               "• Your browsing history"
               etc.
```

---

## 💡 Key Technologies

| What | Technology | Why |
|------|-----------|-----|
| **User Interface** | React 19 + Next.js 15 | Modern, fast, components |
| **Styling** | Tailwind CSS | Beautiful UI with utilities |
| **Backend** | Express.js | Lightweight, reliable web server |
| **Document Processing** | Python + LangChain | Best for text/AI tasks |
| **Vector Database** | ChromaDB | Super fast semantic search |
| **Text Embeddings** | HuggingFace | Convert text to searchable vectors |
| **AI/LLM** | Groq (llama-3.1) | Fast, accurate summaries |

---

## 📊 File Organization

```
Privacy_policy_analyzer/
│
├── frontend/              ← React app (what users see)
│   ├── src/app/
│   │   ├── page.jsx      ← Home page
│   │   ├── upload/       ← Upload interface
│   │   └── results/      ← Results view
│   ├── src/components/   ← Buttons, cards, etc.
│   └── src/lib/api.js    ← Connects to backend
│
├── backend/               ← Express server (the coordinator)
│   ├── server.js         ← All API endpoints
│   └── routes/           ← (empty)
│
├── python-server/         ← FastAPI (document intelligence)
│   ├── main.py           ← Process PDFs + vector search
│   └── chroma_db/        ← Database (stores embeddings)
│
└── uploads/              ← Temporary file storage
```

---

## 🔌 Connections Between Parts

```
FRONTEND (React)        BACKEND (Express)       PYTHON SERVER (FastAPI)
     ↓                       ↓                           ↓
  Upload PDF        Receives PDF file         Processes PDF:
     ↓                       ↓                  - Extract text
  Send to           Forwards to Python         - Split chunks
  backend           server (/process/)         - Create embeddings
                                               - Store in ChromaDB
                                                    ↓
                                          Returns: collection_id

Ask question        Send question to         Search ChromaDB:
     ↓                Python server           - Find top chunks
  Send to           (/retrieve/)              - Return matches
  backend

                    Receive chunks
                         ↓
                    Call Groq LLM
                         ↓
                    Stream back
                    to frontend
```

---

## 🚀 How to Start Everything

```bash
# Terminal 1: Start Python server
cd python-server
python -m uvicorn main:app --reload --port 8000

# Terminal 2: Start Backend
cd backend
npm install
node server.js          # or: npm run dev

# Terminal 3: Start Frontend
cd frontend
npm install
npm run dev

# Open browser at http://localhost:3000
```

---

## 🎯 What Happens When You Upload a PDF

1. **Frontend**: "I have a PDF, sending to /api/upload"
2. **Backend**: "Got it! Forwarding to Python server /process/"
3. **Python**: 
   - Reads PDF file
   - Extracts all text
   - Chops into 1000-character pieces (chunks)
   - Converts each chunk to a vector (384 numbers)
   - Stores in ChromaDB with filename & page number
   - Returns: "I created 125 chunks!"
4. **Backend**: "Success! Here's your collection_id"
5. **Frontend**: "Showing results page! You can now ask questions"

---

## 🎯 What Happens When You Ask a Question

1. **Frontend**: "User asked: 'What personal data is collected?'"
2. **Backend**: Sends to Python /retrieve/ endpoint
3. **Python**: 
   - Converts question to vector
   - Searches ChromaDB: "Which chunks are most similar?"
   - Returns top 5 matching chunks with relevance scores
4. **Backend**: 
   - Takes those 5 chunks
   - Creates prompt for Groq LLM
   - Sends: "Here are 5 relevant passages. Summarize them."
5. **Groq LLM**: "Based on these passages, here's a simple summary: ..."
6. **Backend**: Streams response back word-by-word
7. **Frontend**: Shows answer appearing on screen + sources used

---

## 🔐 Security/Info

- **API Keys**: Groq API key stored in backend only (not exposed)
- **File Size**: Max 10MB (mentioned in UI)
- **File Types**: Only PDFs accepted
- **Privacy**: Documents stored in local chroma_db/ folder

---

## 📈 Performance Facts

- **Uploading 150-page PDF**: ~1-5 minutes (chunking + embedding)
- **Asking a question**: ~3-10 seconds (search + LLM)
- **Reusing same document**: Instant (already processed)
- **Why it's fast**: ChromaDB vector search is O(log n), not O(n)

---

## 🧠 Cool AI Concepts Used Here

**RAG (Retrieval-Augmented Generation)**
- Idea: "Smart retrieval" + "Smart generation"
- Instead of: Send whole 100-page document to AI
- We do: Find 5 most relevant chunks → Send those to AI
- Result: Faster, cheaper, more accurate

**Vector Embeddings**
- Convert text to numbers: "Hello world" → [0.23, -0.45, 0.12, ...]
- Similar texts → Similar vectors
- Enables ultra-fast searching via math

**Chunking Strategy**
- Don't process entire document (too slow)
- Split into 1000-char pieces (smart about not breaking sentences)
- Store with metadata (filename, page number)
- Retrieve only relevant pieces when asked

---

## 🎓 Learning Path

If you want to understand the code:
1. **Start**: [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) (full detailed guide)
2. **Frontend**: Read `frontend/src/app/page.jsx` + `upload/` folder
3. **Backend**: Read `backend/server.js` (everything is there!)
4. **Python**: Read `python-server/main.py`
5. **Test**: Use Postman/curl to test endpoints independently

---

**For detailed information, see SYSTEM_DESIGN.md in the project root**
