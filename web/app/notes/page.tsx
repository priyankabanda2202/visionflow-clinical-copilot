"use client";

import { useEffect, useState } from "react";
import UrgencyBadge from "@/components/UrgencyBadge";
import { fetchPatients, Patient } from "@/lib/api";

export default function NotesPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetchPatients().then(setPatients);
  }, []);

  return (
    <div className="animate-fade-up space-y-6">
      <h2 className="text-2xl font-semibold text-white">Clinical Notes</h2>
      {patients.map((p) => (
        <div key={p.id} className="glass p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">
              {p.name} · {p.age}y
            </h3>
            <UrgencyBadge urgency={p.urgency} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs uppercase text-slate-500">Chief Complaint</p>
              <p className="mt-1 text-slate-300">{p.symptoms}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Assessment</p>
              <pre className="mt-1 whitespace-pre-wrap text-slate-300">{p.diagnosis}</pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
