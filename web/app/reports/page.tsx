"use client";

import { useEffect, useState } from "react";
import UrgencyBadge from "@/components/UrgencyBadge";
import { fetchPatients, Patient } from "@/lib/api";

export default function ReportsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);

  useEffect(() => {
    fetchPatients().then((data) => {
      setPatients(data);
      if (data.length) setSelected(data[0]);
    });
  }, []);

  return (
    <div className="animate-fade-up space-y-6">
      <h2 className="text-2xl font-semibold text-white">Reports</h2>
      <select
        className="rounded-xl border border-border bg-panel px-4 py-2 text-white"
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
          <div className="glass p-6">
            <h3 className="font-medium text-white">Attending Report</h3>
            <pre className="mt-4 whitespace-pre-wrap text-sm text-slate-300">
              {selected.diagnosis}
            </pre>
          </div>
          <div className="glass p-6">
            <h3 className="font-medium text-white">Patient Summary</h3>
            <p className="mt-4 text-sm text-slate-300">Age: {selected.age}</p>
            <p className="mt-2 text-sm text-slate-300">{selected.symptoms}</p>
            <div className="mt-4">
              <UrgencyBadge urgency={selected.urgency} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
