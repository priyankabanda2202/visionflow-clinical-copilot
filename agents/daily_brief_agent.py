from sqlalchemy.orm import Session

from database.models import Patient

URGENCY_ORDER = {"RED": 0, "YELLOW": 1, "GREEN": 2}


def valid_patients(db: Session) -> list[Patient]:
    return (
        db.query(Patient)
        .filter(Patient.diagnosis.isnot(None), Patient.urgency.isnot(None))
        .all()
    )


def build_daily_brief(db: Session) -> dict:
    patients = valid_patients(db)
    patients.sort(key=lambda p: URGENCY_ORDER.get(p.urgency or "GREEN", 3))

    red = [p for p in patients if p.urgency == "RED"]
    yellow = [p for p in patients if p.urgency == "YELLOW"]
    green = [p for p in patients if p.urgency == "GREEN"]

    priority_cases = [
        {
            "id": p.id,
            "name": p.name,
            "age": p.age,
            "urgency": p.urgency,
            "symptoms": (p.symptoms or "")[:120],
        }
        for p in (red + yellow)[:8]
    ]

    narrative_lines = [
        "Morning Brief — Clinical Director",
        "",
        f"Active caseload: {len(patients)} patients under review.",
        f"Critical (same-day): {len(red)} · Urgent (24–48h): {len(yellow)} · Routine: {len(green)}",
        "",
    ]

    if red:
        narrative_lines.append("CRITICAL — immediate attention required:")
        for p in red[:5]:
            narrative_lines.append(f"  • {p.name} ({p.age}y): {p.symptoms[:100]}")
        narrative_lines.append("")
    else:
        narrative_lines.append("No critical cases flagged at this time.")
        narrative_lines.append("")

    if yellow:
        narrative_lines.append("URGENT — schedule within 24–48 hours:")
        for p in yellow[:5]:
            narrative_lines.append(f"  • {p.name} ({p.age}y): {p.symptoms[:100]}")
        narrative_lines.append("")

    narrative_lines.append(
        "Recommendation: Triage RED cases first, confirm workup orders, "
        "and use Clinical Assistant for case-specific follow-up questions."
    )

    return {
        "total": len(patients),
        "red": len(red),
        "yellow": len(yellow),
        "green": len(green),
        "narrative": "\n".join(narrative_lines),
        "priority_cases": priority_cases,
    }
