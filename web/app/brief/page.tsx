"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ClinicalText from "@/components/ClinicalText";
import UrgencyBadge from "@/components/UrgencyBadge";
import { fetchDailyBrief } from "@/lib/api";

export default function BriefPage() {
  const [brief, setBrief] = useState({
    total: 0,
    red: 0,
    yellow: 0,
    green: 0,
    narrative: "",
    priority_cases: [] as { id: number; name: string; urgency: string }[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyBrief()
      .then(setBrief)
      .finally(() => setLoading(false));
  }, []);

  const chartData = [
    { name: "Critical", value: brief.red },
    { name: "Urgent", value: brief.yellow },
    { name: "Routine", value: brief.green },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <p className="text-sm text-[#6b8cb8]">
        Operational brief for clinical leadership — prioritized caseload and staffing actions.
      </p>

      <div className="grid grid-cols-4 gap-4">
        {[
          ["Total Caseload", brief.total],
          ["Critical Today", brief.red],
          ["Urgent Today", brief.yellow],
          ["Routine Today", brief.green],
        ].map(([label, value]) => (
          <div key={label as string} className="glass p-5">
            <p className="text-xs uppercase text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold">{loading ? "—" : (value as number)}</p>
          </div>
        ))}
      </div>

      <div className="brief-card">
        <ClinicalText text={brief.narrative} structured={false} />
      </div>

      {brief.priority_cases.length > 0 && (
        <div className="glass p-6">
          <h3 className="font-medium text-white">Cases to action today</h3>
          <div className="mt-4 space-y-2">
            {brief.priority_cases.map((p) => (
              <Link
                key={p.id}
                href={`/reports/?id=${p.id}`}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm hover:border-accent/30"
              >
                <span className="text-white">{p.name}</span>
                <UrgencyBadge urgency={p.urgency} />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="glass p-6">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#111b28", border: "1px solid #1e3048" }} />
              <Bar dataKey="value" fill="#00d4aa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
