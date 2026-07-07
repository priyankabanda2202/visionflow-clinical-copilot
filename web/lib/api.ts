export type Patient = {
  id: number;
  name: string;
  age: number;
  symptoms: string;
  diagnosis: string | null;
  urgency: string | null;
  doctor_report?: string | null;
  patient_education?: string | null;
};

export type PriorityCase = {
  id: number;
  name: string;
  age: number;
  urgency: string;
  symptoms: string;
};

export type DailyBrief = {
  total: number;
  red: number;
  yellow: number;
  green: number;
  narrative: string;
  priority_cases: PriorityCase[];
};

export type HealthInfo = {
  status: string;
  engine: string;
  model: string;
};

function apiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") {
    if (window.location.port === "3000") return "http://127.0.0.1:8000";
    return window.location.origin;
  }
  return "";
}

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${apiBase()}${path}`, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed (${res.status})`);
  }
  return res;
}

export async function fetchHealth(): Promise<HealthInfo> {
  const res = await apiFetch("/api/health");
  return res.json();
}

export async function fetchPatients(): Promise<Patient[]> {
  const res = await apiFetch("/api/patients");
  return res.json();
}

export async function fetchDailyBrief(): Promise<DailyBrief> {
  const res = await apiFetch("/api/daily-brief");
  return res.json();
}

export async function submitIntake(data: {
  name: string;
  age: number;
  symptoms: string;
}) {
  const res = await apiFetch("/api/intake", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function askCopilot(patientId: number, question: string) {
  const res = await apiFetch("/api/copilot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patient_id: patientId, question }),
  });
  return res.json();
}
