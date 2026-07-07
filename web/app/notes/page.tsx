"use client";

import { useEffect, useState } from "react";
import Panel from "@/components/Panel";
import ClinicalText from "@/components/ClinicalText";
import UrgencyBadge from "@/components/UrgencyBadge";
import { fetchPatients, Patient } from "@/lib/api";

export default function NotesPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatients()
      .then(setPatients)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return <div className="glass p-6 text-red-300">{error}</div>;
  }

  if (!patients.length) {
    return <div className="glass p-6 text-amber-300">No clinical records available.</div>;
  }

  return (
    <div className="animate-fade-up space-y-6">
      <p className="text-sm text-[#6b8cb8]">
        Structured clinical notes for all active cases in the caseload.
      </p>
      {patients.map((p) => (
        <div key={p.id} className="glass p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">
              {p.name} · {p.age}y
            </h3>
            <UrgencyBadge urgency={p.urgency} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Panel title="Chief Complaint">{p.symptoms}</Panel>
            <Panel title="Assessment">
              <ClinicalText text={p.diagnosis} />
            </Panel>
          </div>
        </div>
      ))}
    </div>
  );
}
