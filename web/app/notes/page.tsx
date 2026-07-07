"use client";

import { useEffect, useMemo, useState } from "react";
import Panel from "@/components/Panel";
import ClinicalText from "@/components/ClinicalText";
import UrgencyBadge from "@/components/UrgencyBadge";
import { fetchPatients, Patient } from "@/lib/api";

export default function NotesPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filter, setFilter] = useState<"ALL" | "RED" | "YELLOW" | "GREEN">("ALL");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatients()
      .then(setPatients)
      .catch((e) => setError(e.message));
  }, []);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      if (filter !== "ALL" && p.urgency !== filter) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [patients, filter, search]);

  if (error) {
    return <div className="glass p-6 text-red-300">{error}</div>;
  }

  if (!patients.length) {
    return <div className="glass p-6 text-amber-300">No clinical records available.</div>;
  }

  return (
    <div className="animate-fade-up space-y-6">
      <p className="text-sm text-[#6b8cb8]">
        Caseload sorted by triage priority — critical cases first.
      </p>
      <div className="flex flex-wrap gap-3">
        <input
          className="rounded-lg border border-border bg-panel px-3 py-2 text-sm text-white"
          placeholder="Search by patient ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {(["ALL", "RED", "YELLOW", "GREEN"] as const).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setFilter(level)}
            className={`rounded-lg border px-3 py-2 text-xs ${
              filter === level
                ? "border-accent/40 bg-accent/20 text-white"
                : "border-border text-slate-400"
            }`}
          >
            {level === "ALL" ? "All" : level}
          </button>
        ))}
      </div>

      {filtered.map((p) => (
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
