# Deploy Live Demo (Render)

> **Site still shows Streamlit?** Follow **[docs/RENDER_FIX.md](RENDER_FIX.md)** — update Render start command manually.

## Quick Render settings

| Setting | Value |
|---------|-------|
| Repo | `priyankabanda2202/visionflow-clinical-copilot` |
| Build | `bash build.sh` |
| Start | `uvicorn backend.main:app --host 0.0.0.0 --port $PORT` |
| Env | `GROQ_API_KEY` (required for cloud LLM) |

Live URL: **https://visionflow-clinical-copilot.onrender.com**

## Local development

See [README.md](../README.md)
