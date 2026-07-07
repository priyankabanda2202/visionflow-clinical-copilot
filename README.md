# VisionFlow Clinical Copilot

Real-time **ophthalmology clinical intelligence platform** — Next.js 15 frontend + FastAPI backend + LangGraph multi-agent pipeline + Ollama/Groq LLM.

> Fictional product name for portfolio demo. No affiliation with any commercial client.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | **Next.js 15**, React 19, TypeScript, Tailwind CSS, Recharts |
| Backend | **FastAPI**, WebSockets (real-time assistant) |
| AI | **LangGraph**, Groq (cloud) / Ollama (local) |
| Database | SQLAlchemy, SQLite |

## Live Demo

https://visionflow-clinical-copilot.onrender.com/

## Run locally

### Backend + Frontend (production-like)

```bash
# Terminal 1 — API
pip install -r requirements.txt
ollama serve   # optional if using Groq
uvicorn backend.main:app --reload --port 8000

# Terminal 2 — Next.js dev UI
cd web
npm install
npm run dev
```

Open http://localhost:3000 — set `NEXT_PUBLIC_API_URL=http://localhost:8000` in `web/.env.local`

### Legacy Streamlit UI (deprecated)

```bash
streamlit run frontend/app.py
```

## Deploy (Render)

See `docs/DEPLOY.md`

## Author

Priyanka Banda — GenAI Architect
