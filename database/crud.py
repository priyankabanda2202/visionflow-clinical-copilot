from sqlalchemy.orm import Session

from agents.text_format import clean_clinical_text
from database.models import Patient, Report


def create_patient(
    db: Session,
    name: str,
    age: int,
    symptoms: str,
    diagnosis: str,
    urgency: str,
    doctor_report: str | None = None,
    patient_education: str | None = None,
):
    patient = Patient(
        name=name,
        age=age,
        symptoms=symptoms,
        diagnosis=diagnosis,
        urgency=urgency,
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)

    if doctor_report or patient_education:
        report = Report(
            patient_id=patient.id,
            doctor_report=clean_clinical_text(doctor_report or ""),
            patient_report=clean_clinical_text(patient_education or ""),
        )
        db.add(report)
        db.commit()

    return patient


def get_report_for_patient(db: Session, patient_id: int) -> Report | None:
    return db.query(Report).filter(Report.patient_id == patient_id).first()


def patient_with_reports(db: Session, patient: Patient) -> dict:
    report = get_report_for_patient(db, patient.id)
    return {
        "id": patient.id,
        "name": patient.name,
        "age": patient.age,
        "symptoms": patient.symptoms,
        "diagnosis": patient.diagnosis,
        "urgency": patient.urgency,
        "doctor_report": report.doctor_report if report else None,
        "patient_education": report.patient_report if report else None,
    }
