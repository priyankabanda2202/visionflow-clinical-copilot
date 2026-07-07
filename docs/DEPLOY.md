# Deploy Live Demo (Render)

## 1. Get a free Groq API key (cloud LLM)

Ollama does not run on Render's free tier. Use Groq for the public demo.

1. Go to https://console.groq.com/
2. Sign up → **API Keys** → Create key
3. Copy the key

Groq powers the live demo with `llama-3.1-8b-instant`.

## 2. Deploy on Render

1. Go to https://dashboard.render.com/
2. **New +** → **Blueprint** (or **Web Service**)
3. Connect GitHub repo: `myeyesai-clinical-copilot`
4. Render reads `render.yaml` automatically:
   - **Build:** `pip install -r requirements.txt && cd web && npm install && npm run build`
   - **Start:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable:
   - `GROQ_API_KEY` = your Groq key
6. Click **Deploy**

Live URL: **https://visionflow-clinical-copilot.onrender.com**

*(First load may take 30–60s on free tier — Render spins down when idle.)*

## 3. Local development

### Modern UI (Next.js + FastAPI)

```powershell
# Terminal 1 — API
pip install -r requirements.txt
ollama serve   # optional if using Groq locally
uvicorn backend.main:app --reload --port 8000

# Terminal 2 — Next.js dev
cd web
npm install
npm run dev
```

Open http://localhost:3000 — create `web/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production-like (single server)

```powershell
cd web && npm run build && cd ..
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

Open http://localhost:8000

## 4. Portfolio link

Live Demo: `https://visionflow-clinical-copilot.onrender.com`
