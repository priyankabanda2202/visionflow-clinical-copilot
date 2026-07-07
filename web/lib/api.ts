const API = process.env.NEXT_PUBLIC_API_URL || "";

export type Patient = {
  id: number;
  name: string;
  age: number;
  symptoms: string;
  diagnosis: string | null;
  urgency: string | null;
};

export type DailyBrief = {
  total: number;
  red: number;
  yellow: number;
  green: number;
};

export async function fetchPatients(): Promise<Patient[]> {
  const res = await fetch(`${API}/api/patients`);
  if (!res.ok) throw new Error("Failed to load patients");
  return res.json();
}

export async function fetchDailyBrief(): Promise<DailyBrief> {
  const res = await fetch(`${API}/api/daily-brief`);
  if (!res.ok) throw new Error("Failed to load brief");
  return res.json();
}

export async function submitIntake(data: {
  name: string;
  age: number;
  symptoms: string;
}) {
  const res = await fetch(`${API}/api/intake`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Intake failed");
  }
  return res.json();
}

export async function askCopilot(patientId: number, question: string) {
  const res = await fetch(`${API}/api/copilot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patient_id: patientId, question }),
  });
  if (!res.ok) throw new Error("Copilot request failed");
  return res.json();
}

export function wsUrl(patientId: number) {
  const base = API || (typeof window !== "undefined" ? window.location.origin : "");
  const wsBase = base.replace(/^http/, "ws");
  return `${wsBase}/ws/copilot/${patientId}`;
}
