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

## Render cold start (free tier)

Render sleeps after 15 minutes of no traffic. First load can take 30–60 seconds.

**Free fix — UptimeRobot (no GitHub workflow needed):**

1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add monitor → **HTTP(s)**
3. URL: `https://visionflow-clinical-copilot.onrender.com/api/health`
4. Interval: **5 minutes**

**Paid fix:** Render Starter (~$7/mo) — no sleep, no cold starts.

## Local development

See [README.md](../README.md)
