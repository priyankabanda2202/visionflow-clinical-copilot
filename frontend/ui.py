import streamlit as st
from datetime import datetime


def inject_styles():
    st.markdown(
        """
<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

html, body, [class*="css"] {
    font-family: 'IBM Plex Sans', sans-serif;
}

.stApp {
    background: linear-gradient(135deg, #070b12 0%, #0d1520 50%, #0a1118 100%);
    color: #e8edf5;
}

[data-testid="stSidebar"] {
    background: #0a1018;
    border-right: 1px solid #1a2a3d;
}

[data-testid="stSidebar"] .stRadio label {
    background: #111b28;
    border: 1px solid #1e3048;
    border-radius: 8px;
    padding: 0.55rem 0.75rem;
    margin-bottom: 0.35rem;
    transition: all 0.2s ease;
}

[data-testid="stMetric"] {
    background: #111b28;
    border: 1px solid #1e3048;
    border-radius: 12px;
    padding: 0.75rem 1rem;
}

.clinical-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    background: linear-gradient(90deg, #0f1c2e 0%, #132438 100%);
    border: 1px solid #1e3a5f;
    border-radius: 14px;
    margin-bottom: 1.25rem;
}

.clinical-header h1 {
    font-size: 1.45rem;
    font-weight: 700;
    margin: 0;
    color: #f0f6ff;
    letter-spacing: -0.02em;
}

.clinical-header .sub {
    color: #7a9bc4;
    font-size: 0.85rem;
    margin-top: 0.2rem;
}

.live-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    background: rgba(0, 212, 170, 0.12);
    border: 1px solid rgba(0, 212, 170, 0.35);
    color: #00d4aa;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 600;
}

.live-dot {
    width: 8px;
    height: 8px;
    background: #00d4aa;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
}

.panel {
    background: #111b28;
    border: 1px solid #1e3048;
    border-radius: 12px;
    padding: 1.1rem 1.25rem;
    margin-bottom: 1rem;
}

.panel-title {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6b8cb8;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.urgency-red {
    background: rgba(239, 68, 68, 0.12);
    border-left: 4px solid #ef4444;
    padding: 0.65rem 0.9rem;
    border-radius: 0 8px 8px 0;
    color: #fca5a5;
    font-weight: 600;
}

.urgency-yellow {
    background: rgba(245, 158, 11, 0.12);
    border-left: 4px solid #f59e0b;
    padding: 0.65rem 0.9rem;
    border-radius: 0 8px 8px 0;
    color: #fcd34d;
    font-weight: 600;
}

.urgency-green {
    background: rgba(34, 197, 94, 0.12);
    border-left: 4px solid #22c55e;
    padding: 0.65rem 0.9rem;
    border-radius: 0 8px 8px 0;
    color: #86efac;
    font-weight: 600;
}

.brief-card {
    background: linear-gradient(135deg, #0f2438 0%, #132a42 100%);
    border: 1px solid #1e4a6f;
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
    color: #dce8f5;
}

.stButton > button {
    background: linear-gradient(90deg, #1e4a6f, #2563eb);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
}

div[data-testid="stChatMessage"] {
    background: #111b28;
    border: 1px solid #1e3048;
    border-radius: 12px;
}
</style>
        """,
        unsafe_allow_html=True,
    )


def render_header():
    now = datetime.now().strftime("%H:%M:%S")
    st.markdown(
        f"""
<div class="clinical-header">
  <div>
    <h1>VisionFlow Clinical Copilot</h1>
    <div class="sub">Ophthalmology Decision Support · Live Clinical Console</div>
  </div>
  <div class="live-badge"><span class="live-dot"></span> LIVE · {now}</div>
</div>
        """,
        unsafe_allow_html=True,
    )


def urgency_html(urgency):
    labels = {"RED": "HIGH URGENCY", "YELLOW": "URGENT", "GREEN": "ROUTINE"}
    css = {"RED": "urgency-red", "YELLOW": "urgency-yellow", "GREEN": "urgency-green"}
    label = labels.get(urgency, urgency or "UNKNOWN")
    cls = css.get(urgency, "urgency-green")
    return f'<div class="{cls}">TRIAGE · {label}</div>'


def show_urgency(urgency):
    if not urgency:
        st.markdown('<div class="panel"><span style="color:#6b8cb8">Triage pending</span></div>', unsafe_allow_html=True)
        return
    st.markdown(urgency_html(urgency), unsafe_allow_html=True)


def panel(title, content, markdown=False):
    st.markdown(f'<div class="panel"><div class="panel-title">{title}</div>', unsafe_allow_html=True)
    if markdown:
        st.markdown(content)
    else:
        st.write(content)
    st.markdown("</div>", unsafe_allow_html=True)
