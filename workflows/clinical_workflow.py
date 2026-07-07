from typing import TypedDict

from langgraph.graph import END, StateGraph

from agents.clinical_reasoning_agent import analyze_patient
from agents.intake_agent import intake_summary
from agents.patient_education_agent import generate_patient_education
from agents.report_agent import generate_doctor_report
from agents.urgency_agent import get_urgency


class ClinicalState(TypedDict, total=False):
    name: str
    age: int
    symptoms: str
    summary: str
    analysis: str
    urgency: str
    doctor_report: str
    patient_education: str
    brief: str


def intake_node(state: ClinicalState) -> ClinicalState:
    state["summary"] = intake_summary(
        state["name"],
        state["age"],
        state["symptoms"],
    )
    return state


def clinical_reasoning_node(state: ClinicalState) -> ClinicalState:
    state["analysis"] = analyze_patient(state["summary"])
    return state


def urgency_node(state: ClinicalState) -> ClinicalState:
    state["urgency"] = get_urgency(state["symptoms"], state.get("analysis", ""))
    return state


def report_node(state: ClinicalState) -> ClinicalState:
    state["doctor_report"] = generate_doctor_report(
        state["analysis"],
        state["urgency"],
    )
    return state


def patient_education_node(state: ClinicalState) -> ClinicalState:
    state["patient_education"] = generate_patient_education(
        state["symptoms"],
        state["analysis"],
        state["urgency"],
    )
    return state


def daily_brief_node(state: ClinicalState) -> ClinicalState:
    urgency = state.get("urgency", "GREEN")
    state["brief"] = (
        f"Patient {state['name']} processed. "
        f"Urgency: {urgency}. Ready for daily brief aggregation."
    )
    return state


def build_clinical_workflow():
    graph = StateGraph(ClinicalState)

    graph.add_node("intake", intake_node)
    graph.add_node("clinical_reasoning", clinical_reasoning_node)
    graph.add_node("urgency", urgency_node)
    graph.add_node("report", report_node)
    graph.add_node("patient_education", patient_education_node)
    graph.add_node("daily_brief", daily_brief_node)

    graph.set_entry_point("intake")
    graph.add_edge("intake", "clinical_reasoning")
    graph.add_edge("clinical_reasoning", "urgency")
    graph.add_edge("urgency", "report")
    graph.add_edge("report", "patient_education")
    graph.add_edge("patient_education", "daily_brief")
    graph.add_edge("daily_brief", END)

    return graph.compile()


clinical_workflow = build_clinical_workflow()


def run_clinical_workflow(name: str, age: int, symptoms: str) -> ClinicalState:
    return clinical_workflow.invoke(
        {
            "name": name,
            "age": age,
            "symptoms": symptoms,
        }
    )
