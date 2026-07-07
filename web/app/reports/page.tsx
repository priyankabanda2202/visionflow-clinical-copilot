"use client";

import { useEffect, useState } from "react";
import Panel from "@/components/Panel";
import ClinicalText from "@/components/ClinicalText";
import UrgencyBadge from "@/components/UrgencyBadge";
import { fetchPatients, Patient } from "@/lib/api";

export default function ReportsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatients()
      .then((data) => {
        setPatients(data);
        if (data.length) setSelected(data[0]);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return <div className="glass p-6 text-red-300">{error}</div>;
  }

  if (!patients.length) {
    return <div className="glass p-6 text-amber-300">No reports available.</div>;
  }

  return (
    <div className="animate-fade-up space-y-6">
      <p className="text-sm text-[#6b8cb8]">
        Attending-level reports for case review and referral planning.
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
            {p.name}
          </option>
        ))}
      </select>
      {selected && (
        <div className="grid grid-cols-2 gap-6">
          <Panel title="Attending Report">
            <ClinicalText text={selected.diagnosis} />
          </Panel>
          <div className="space-y-4">
            <UrgencyBadge urgency={selected.urgency} />
            <Panel title="Patient Summary">
              <p>Age {selected.age}</p>
              <p className="mt-2">{selected.symptoms}</p>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}
