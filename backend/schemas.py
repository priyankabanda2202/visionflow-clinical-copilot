from pydantic import BaseModel, field_validator

from agents.text_format import clean_clinical_text


class PatientOut(BaseModel):
    id: int
    name: str
    age: int
    symptoms: str
    diagnosis: str | None
    urgency: str | None

    class Config:
        from_attributes = True

    @field_validator("diagnosis")
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
    patient: PatientOut

    @field_validator("analysis")
    @classmethod
    def strip_markdown(cls, value: str) -> str:
        return clean_clinical_text(value)


class DailyBrief(BaseModel):
    total: int
    red: int
    yellow: int
    green: int


class CopilotRequest(BaseModel):
    patient_id: int
    question: str


class CopilotResponse(BaseModel):
    answer: str

    @field_validator("answer")
    @classmethod
    def strip_markdown(cls, value: str) -> str:
        return clean_clinical_text(value)
