from agents.ollama_client import chat
from agents.text_format import clean_clinical_text

RED_FLAGS = (
    "vision loss", "sudden vision", "curtain", "flashes and floaters",
    "new floaters", "chemical", "penetrating", "endophthalmitis",
    "acute angle", "complete loss", "no light perception",
)
YELLOW_FLAGS = (
    "eye pain", "painful", "red eye", "photophobia", "discharge",
    "foreign body", "trauma", "blunt trauma", "halos",
)


def _rule_based_urgency(symptoms: str, analysis: str) -> str:
    text = f"{symptoms} {analysis}".lower()
    if any(flag in text for flag in RED_FLAGS):
        return "RED"
    if any(flag in text for flag in YELLOW_FLAGS):
        return "YELLOW"
    return "GREEN"


def get_urgency(symptoms: str, analysis: str = "") -> str:
    try:
        prompt = f"""
You are an ophthalmology triage nurse applying emergency eye care protocols.

Symptoms: {symptoms}
Clinical assessment excerpt: {analysis[:600] if analysis else "Not yet available"}

Classify triage urgency as exactly one word:
RED = same-day emergency (sudden vision loss, retinal detachment symptoms, acute angle-closure, chemical injury, endophthalmitis, penetrating trauma)
YELLOW = urgent review within 24-48 hours (painful red eye, corneal abrasion, new significant floaters with flashes, severe photophobia)
GREEN = routine or scheduled follow-up

Reply with only: RED, YELLOW, or GREEN
"""
        result = chat(prompt).strip().upper()
        if result in {"RED", "YELLOW", "GREEN"}:
            return result
        if "RED" in result:
            return "RED"
        if "YELLOW" in result:
            return "YELLOW"
    except Exception:
        pass
    return _rule_based_urgency(symptoms, analysis)
