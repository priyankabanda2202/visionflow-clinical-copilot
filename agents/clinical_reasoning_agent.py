from agents.ollama_client import chat
from agents.text_format import clean_clinical_text


def analyze_patient(summary):
    prompt = f"""
You are a senior ophthalmology clinical reasoning engine supporting attending physicians.

Patient presentation:
{summary}

Write a structured clinical assessment in plain text only.
Rules:
- Do NOT use markdown, asterisks, hashtags, or bullet symbols
- Use numbered sections with clear headings on their own line
- Use blank lines between sections
- Write in concise, professional clinical language

Required sections:
1. Primary Diagnosis
2. Differential Diagnosis
3. Recommended Workup
4. Clinical Confidence (percentage with brief rationale)
5. Recommendation
"""
    return clean_clinical_text(chat(prompt))
