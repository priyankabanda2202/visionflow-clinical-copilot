from pydantic import BaseModel, field_validator

from agents.text_format import clean_clinical_text


class PriorityCase(BaseModel):
    id: int
    name: str
    age: int
    urgency: str
    symptoms: str


class PatientOut(BaseModel):
    id: int
    name: str
    age: int
    symptoms: str
    diagnosis: str | None
    urgency: str | None
    doctor_report: str | None = None
    patient_education: str | None = None

    @field_validator("diagnosis", "doctor_report", "patient_education")
    @classmethod
    def strip_markdown(cls, value: str | None) -> str | None:
        return clean_clinical_text(value) if value else value


class IntakeRequest(BaseModel):
    name: str
    age: int
    symptoms: str


class IntakeResponse(BaseModel):
    summary: str
    analysis: str
    urgency: str
    doctor_report: str
    patient_education: str
    patient: PatientOut

    @field_validator("analysis", "doctor_report", "patient_education")
    @classmethod
    def strip_markdown(cls, value: str) -> str:
        return clean_clinical_text(value)


class DailyBrief(BaseModel):
    total: int
    red: int
    yellow: int
    green: int
    narrative: str
    priority_cases: list[PriorityCase]


class CopilotRequest(BaseModel):
    patient_id: int
    question: str


class CopilotResponse(BaseModel):
    answer: str

    @field_validator("answer")
    @classmethod
    def strip_markdown(cls, value: str) -> str:
        return clean_clinical_text(value)
