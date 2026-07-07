"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import MetricCard from "@/components/MetricCard";
import { fetchDailyBrief } from "@/lib/api";

const EVALUATOR_STEPS = [
  { href: "/intake/", label: "Patient Intake", desc: "Submit a new case and run the clinical pipeline" },
  { href: "/notes/", label: "Clinical Notes", desc: "Review structured assessments across the caseload" },
  { href: "/reports/", label: "Reports", desc: "View attending-level reports and triage levels" },
  { href: "/assistant/", label: "Clinical Assistant", desc: "Ask follow-up questions on any active case" },
];

export default function DashboardPage() {
  const [brief, setBrief] = useState({ total: 0, red: 0, yellow: 0, green: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDailyBrief()
      .then(setBrief)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const chartData = [
    { name: "Critical", value: brief.red },
    { name: "Urgent", value: brief.yellow },
    { name: "Routine", value: brief.green },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="glass p-6">
        <h3 className="text-lg font-semibold text-white">Welcome — Clinical Evaluator Guide</h3>
        <p className="mt-2 text-sm text-[#6b8cb8]">
          This platform demonstrates multi-agent ophthalmology decision support. Suggested review path:
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

      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Active Caseload" value={brief.total} loading={loading} />
        <MetricCard label="Critical" value={brief.red} delta="Immediate" loading={loading} />
        <MetricCard label="Urgent" value={brief.yellow} loading={loading} />
        <MetricCard label="Routine" value={brief.green} loading={loading} />
      </div>

      <div className="glass p-6">
        <h3 className="mb-4 text-lg font-medium text-white">Triage Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#111b28", border: "1px solid #1e3048" }} />
              <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
