# VisionFlow Clinical Copilot

Real-time **ophthalmology clinical intelligence platform** — Next.js 15 frontend + FastAPI backend + LangGraph multi-agent pipeline.

> Fictional product name for portfolio demo. No affiliation with any commercial client.

## Stack

| Layer | Tech |
|-------|------|
| **Frontend (main)** | Next.js 15, React 19, TypeScript, Tailwind CSS, Recharts |
| **Backend** | FastAPI, REST APIs |
| **AI** | LangGraph, Groq (cloud) / Ollama (local) |
| **Legacy UI** | Streamlit (`frontend/`) — local fallback only |

## Live Demo (public)

**https://visionflow-clinical-copilot.onrender.com**

Deployed as FastAPI + Next.js static export (single service on Render).

## Run locally (Windows PowerShell)

PowerShell requires `.\` before scripts in the current folder.

### Terminal 1 — API

```powershell
cd C:\Users\admin\Downloads\myeyesai-clinical-copilot
.\start-api.ps1
```

### Terminal 2 — UI

```powershell
cd C:\Users\admin\Downloads\myeyesai-clinical-copilot
.\start-web.ps1
```

Open **http://localhost:3000**

### CMD alternative

```cmd
cd C:\Users\admin\Downloads\myeyesai-clinical-copilot
start-api.bat
start-web.bat
```

### PowerShell (note the `.\` prefix)

```powershell
cd C:\Users\admin\Downloads\myeyesai-clinical-copilot
.\start-api.ps1
.\start-web.ps1
```

Or batch files from PowerShell:

```powershell
.\start-api.bat
.\start-web.bat
```

> Both terminals must run at the same time. The UI talks to the API on port 8000.

## Deploy to Render

1. Push to GitHub
2. Render reads `render.yaml` — builds Next.js + starts FastAPI
3. Set `GROQ_API_KEY` in Render environment variables

See `docs/DEPLOY.md`

## Author

Priyanka Banda — GenAI Architect
