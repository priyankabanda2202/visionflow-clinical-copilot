from pydantic import BaseModel


class PatientOut(BaseModel):
    id: int
    name: str
    age: int
    symptoms: str
    diagnosis: str | None
    urgency: str | None

    class Config:
        from_attributes = True


class IntakeRequest(BaseModel):
    name: str
    age: int
    symptoms: str


class IntakeResponse(BaseModel):
    summary: str
    analysis: str
    urgency: str
    patient: PatientOut


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
