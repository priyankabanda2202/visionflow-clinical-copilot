"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Panel from "@/components/Panel";
import ClinicalText from "@/components/ClinicalText";
import UrgencyBadge from "@/components/UrgencyBadge";
import { fetchDailyBrief, PriorityCase } from "@/lib/api";

const EVALUATOR_STEPS = [
  { href: "/intake/", label: "Patient Intake", desc: "Load a demo case or submit a new presentation" },
  { href: "/notes/", label: "Clinical Notes", desc: "Review triage-sorted assessments" },
  { href: "/reports/", label: "Reports", desc: "Attending reports and patient education" },
  { href: "/assistant/", label: "Clinical Assistant", desc: "Case-specific follow-up Q&A" },
];

export default function DashboardPage() {
  const [brief, setBrief] = useState({
    total: 0,
    red: 0,
    yellow: 0,
    green: 0,
    narrative: "",
    priority_cases: [] as PriorityCase[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDailyBrief()
      .then(setBrief)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-up space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="glass p-6">
        <h3 className="text-lg font-semibold text-white">Clinician & Stakeholder Evaluation Guide</h3>
        <p className="mt-2 text-sm text-[#6b8cb8]">
          Recommended review path for ophthalmology decision-support evaluation:
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {EVALUATOR_STEPS.map((step, i) => (
            <Link
              key={step.href}
              href={step.href}
              className="rounded-lg border border-border bg-canvas/50 p-4 transition hover:border-accent/40"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-live">
                Step {i + 1}
              </p>
              <p className="mt-1 font-medium text-white">{step.label}</p>
              <p className="mt-1 text-xs text-slate-400">{step.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {!loading && brief.priority_cases.length > 0 && (
        <div className="glass p-6">
          <h3 className="text-lg font-medium text-white">Priority Cases Requiring Review</h3>
          <div className="mt-4 space-y-2">
            {brief.priority_cases.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                href={`/reports/?id=${p.id}`}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition hover:border-accent/30"
              >
                <div>
                  <p className="font-medium text-white">
                    {p.name} · {p.age}y
                  </p>
                  <p className="text-xs text-slate-400">{p.symptoms}</p>
                </div>
                <UrgencyBadge urgency={p.urgency} />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {[
          ["Active Caseload", brief.total],
          ["Critical", brief.red],
          ["Urgent", brief.yellow],
          ["Routine", brief.green],
        ].map(([label, value]) => (
          <div key={label as string} className="glass p-5">
            <p className="text-xs uppercase text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {loading ? "—" : (value as number)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
