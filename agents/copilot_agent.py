from agents.ollama_client import chat
from agents.text_format import clean_clinical_text


def _fields(patient):
    return {
        "name": getattr(patient, "name", None) or patient.get("name", ""),
        "age": getattr(patient, "age", None) or patient.get("age", ""),
        "symptoms": getattr(patient, "symptoms", None) or patient.get("symptoms", ""),
        "diagnosis": getattr(patient, "diagnosis", None) or patient.get("diagnosis", ""),
        "urgency": getattr(patient, "urgency", None) or patient.get("urgency", ""),
    }


def answer(question, patient):
    p = _fields(patient)

    prompt = f"""
You are an ophthalmology clinical assistant supporting an attending physician.

Patient:
Name: {p['name']}
Age: {p['age']}
Symptoms: {p['symptoms']}
Assessment: {p['diagnosis']}
Triage: {p['urgency']}

Question: {question}

Respond in clear, authoritative clinical language. Plain text only — no markdown or asterisks.
Be concise and actionable.
"""
    return clean_clinical_text(chat(prompt))
