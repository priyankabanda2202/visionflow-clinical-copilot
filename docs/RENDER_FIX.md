# Fix Render — switch from Streamlit to Next.js + FastAPI

Your live site still shows **Streamlit** because Render is using the **old start command**.
The repo is correct; you must update Render settings once.

## Step 1 — Open Render dashboard

1. Go to https://dashboard.render.com/
2. Click **visionflow-clinical-copilot** (your web service)

## Step 2 — Verify GitHub repo

Under **Settings → Build & Deploy → Repository**, confirm it points to:

**`priyankabanda2202/visionflow-clinical-copilot`**

(not `myeyesai-clinical-copilot`)

Branch: **main**

## Step 3 — Update commands (critical)

Under **Settings → Build & Deploy**, set exactly:

| Field | Value |
|-------|-------|
| **Build Command** | `bash build.sh` |
| **Start Command** | `uvicorn backend.main:app --host 0.0.0.0 --port $PORT` |

**Delete** any old Streamlit command like:
`streamlit run frontend/app.py ...`

## Step 4 — Environment variables

Ensure **GROQ_API_KEY** is set (for cloud LLM).

Optional: `GROQ_MODEL` = `llama-3.1-8b-instant`

## Step 5 — Manual deploy

Click **Manual Deploy → Deploy latest commit**

Wait 5–8 minutes for build (npm + Python).

## Step 6 — Verify

Open: https://visionflow-clinical-copilot.onrender.com/

You should see **VisionFlow Clinical Copilot** with sidebar (Dashboard, Patient Intake, etc.) — **not** Streamlit.

Test API: https://visionflow-clinical-copilot.onrender.com/api/health

Should return JSON like `{"status":"ok","engine":"groq",...}` — **not** a Streamlit page.

## Build logs to check

In Render **Logs**, you should see:

```
=== VisionFlow build: Next.js frontend ===
...
=== VisionFlow build: OK ===
Frontend: serving Next.js from .../web/out
```

If build fails on npm, ensure Build Command is `bash build.sh`.
