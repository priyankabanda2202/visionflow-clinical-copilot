from sqlalchemy.orm import Session
from database.models import Patient


def generate_daily_brief(db: Session):

    patients = db.query(Patient).all()

    total = len(patients)

    red = len(
        [p for p in patients if p.urgency == "RED"]
    )

    return f"""
Good Morning, Clinical Director

Total Patients:
{total}

High Urgency:
{red}
"""