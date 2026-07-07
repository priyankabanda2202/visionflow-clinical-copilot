"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Panel from "@/components/Panel";
import ClinicalText from "@/components/ClinicalText";
import UrgencyBadge from "@/components/UrgencyBadge";
import { fetchPatients, Patient } from "@/lib/api";

type ReportTab = "attending" | "assessment" | "education";

export default function ReportsContent() {
  const searchParams = useSearchParams();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [tab, setTab] = useState<ReportTab>("attending");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatients()
      .then((data) => {
        setPatients(data);
        const idParam = searchParams.get("id");
        if (idParam) {
          const match = data.find((p) => p.id === Number(idParam));
          if (match) {
            setSelected(match);
            return;
          }
        }
        if (data.length) setSelected(data[0]);
      })
      .catch((e) => setError(e.message));
  }, [searchParams]);

  if (error) {
    return <div className="glass p-6 text-red-300">{error}</div>;
  }

  if (!patients.length) {
    return <div className="glass p-6 text-amber-300">No reports available.</div>;
  }

  return (
    <div className="animate-fade-up space-y-6">
      <p className="text-sm text-[#6b8cb8]">
        Attending reports, clinical assessments, and patient-facing summaries for case review.
      </p>
      <select
        className="rounded-lg border border-border bg-panel px-4 py-2 text-white"
        value={selected?.id ?? ""}
        onChange={(e) =>
          setSelected(patients.find((p) => p.id === Number(e.target.value)) || null)
        }
      >
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} — {p.urgency}
          </option>
        ))}
      </select>

      {selected && (
        <>
          <UrgencyBadge urgency={selected.urgency} />
          <div className="flex gap-2 border-b border-border pb-2">
            {(
              [
                ["attending", "Attending Report"],
                ["assessment", "Clinical Assessment"],
                ["education", "Patient Education"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`rounded-lg px-3 py-1.5 text-xs ${
                  tab === key ? "bg-accent/20 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              {tab === "attending" && (
                <Panel title="Attending Report">
                  <ClinicalText
                    text={
                      selected.doctor_report ||
                      "Attending report available for cases processed after the latest update. Run a new intake to generate."
                    }
                    structured={false}
                  />
                </Panel>
              )}
              {tab === "assessment" && (
                <Panel title="Clinical Assessment">
                  <ClinicalText text={selected.diagnosis} />
                </Panel>
              )}
              {tab === "education" && (
                <Panel title="Patient Education">
                  <ClinicalText
                    text={
                      selected.patient_education ||
                      "Patient education summary available for new cases."
                    }
                    structured={false}
                  />
                </Panel>
              )}
            </div>
            <Panel title="Presentation Summary">
              <p className="text-white">
                {selected.name} · {selected.age} years
              </p>
              <p className="mt-3 text-slate-300">{selected.symptoms}</p>
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}
