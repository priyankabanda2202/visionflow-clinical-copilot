import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv

load_dotenv(ROOT / ".env", override=True)

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from agents.copilot_agent import answer as copilot_answer
from agents.text_format import clean_clinical_text
from backend.schemas import (
    CopilotRequest,
    CopilotResponse,
    DailyBrief,
    IntakeRequest,
    IntakeResponse,
    PatientOut,
)
from database.crud import create_patient
from database.db import Base, SessionLocal, engine
from database.models import Patient
from workflows.clinical_workflow import run_clinical_workflow
import database.models  # noqa: F401

Base.metadata.create_all(bind=engine)

app = FastAPI(title="VisionFlow Clinical Copilot API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_if_empty(db: Session):
    if db.query(Patient).count() == 0:
        from synthetic_data.generate_patients import generate_patients
        generate_patients(50)


def valid_patients(db: Session):
    return (
        db.query(Patient)
        .filter(Patient.diagnosis.isnot(None), Patient.urgency.isnot(None))
        .all()
    )


static_dir = ROOT / "web" / "out"


@app.on_event("startup")
def check_frontend():
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()
    if static_dir.exists():
        print(f"Frontend: serving Next.js from {static_dir}")
    else:
        print(f"WARNING: {static_dir} not found — run build.sh before deploy")


@app.get("/api/health")
def health():
    if os.getenv("GROQ_API_KEY"):
        provider = "groq"
        model = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    elif os.getenv("OPENAI_API_KEY"):
        provider = "openai"
        model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    else:
        provider = "ollama"
        model = os.getenv("OLLAMA_MODEL", "llama3:latest")
    return {"status": "ok", "engine": provider, "model": model}


@app.get("/api/patients", response_model=list[PatientOut])
def list_patients():
    db = SessionLocal()
    try:
        return valid_patients(db)
    finally:
        db.close()


@app.get("/api/patients/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: int):
    db = SessionLocal()
    try:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        return patient
    finally:
        db.close()


@app.get("/api/daily-brief", response_model=DailyBrief)
def daily_brief():
    db = SessionLocal()
    try:
        patients = valid_patients(db)
        red = len([p for p in patients if p.urgency == "RED"])
        yellow = len([p for p in patients if p.urgency == "YELLOW"])
        green = len([p for p in patients if p.urgency == "GREEN"])
        return DailyBrief(total=len(patients), red=red, yellow=yellow, green=green)
    finally:
        db.close()


@app.post("/api/intake", response_model=IntakeResponse)
def intake(body: IntakeRequest):
    db = SessionLocal()
    try:
        result = run_clinical_workflow(body.name, body.age, body.symptoms)
        analysis = clean_clinical_text(result["analysis"])
        patient = create_patient(
            db,
            body.name,
            body.age,
            body.symptoms,
            analysis,
            result["urgency"],
        )
        return IntakeResponse(
            summary=result["summary"],
            analysis=analysis,
            urgency=result["urgency"],
            patient=patient,
        )
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    finally:
        db.close()


@app.post("/api/copilot", response_model=CopilotResponse)
def copilot_chat(body: CopilotRequest):
    db = SessionLocal()
    try:
        patient = db.query(Patient).filter(Patient.id == body.patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        try:
            response = copilot_answer(body.question, patient)
        except Exception as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
        return CopilotResponse(answer=response)
    finally:
        db.close()


@app.websocket("/ws/copilot/{patient_id}")
async def copilot_ws(websocket: WebSocket, patient_id: int):
    await websocket.accept()
    db = SessionLocal()
    try:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            await websocket.send_json({"error": "Patient not found"})
            await websocket.close()
            return

        while True:
            data = await websocket.receive_json()
            question = data.get("question", "")
            if not question.strip():
                continue
            try:
                response = copilot_answer(question, patient)
                await websocket.send_json({"role": "assistant", "content": response})
            except Exception as exc:
                await websocket.send_json({"role": "assistant", "content": f"Error: {exc}"})
    except WebSocketDisconnect:
        pass
    finally:
        db.close()


if static_dir.exists():
    app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="frontend")
