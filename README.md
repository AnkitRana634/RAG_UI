RAG UI
======

Simple Vite + React UI to interact with the RAGApi backend.

Features:
- Chat/Agent: send questions to /api/Chat/ChatWithOllama?question=...
- Upload document: POST multipart form to /api/Document
- Link to Swagger UI at /swagger/index.html

Quick start

1. Install dependencies:
   npm install
2. Start dev server:
   npm run dev
3. By default the UI expects the API at http://localhost:5000. You can change this by setting VITE_API_BASE in an .env file, for example:
   VITE_API_BASE=http://localhost:5000

Notes
- This is a minimal example. Adjust styles, error handling and UX as needed.
