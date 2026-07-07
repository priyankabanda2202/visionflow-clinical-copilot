"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchDailyBrief } from "@/lib/api";

export default function DashboardPage() {
  const [brief, setBrief] = useState({ total: 0, red: 0, yellow: 0, green: 0 });
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
    <div className="animate-fade-up space-y-8">
      <header>
        <p className="text-sm font-mono uppercase tracking-widest text-slate-500">Overview</p>
        <h2 className="mt-1 text-3xl font-semibold text-white">Clinical Operations Dashboard</h2>
      </header>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Caseload", value: brief.total },
          { label: "Critical", value: brief.red },
          { label: "Urgent", value: brief.yellow },
          { label: "Routine", value: brief.green },
        ].map((m) => (
          <div key={m.label} className="glass p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">{m.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {loading ? "—" : m.value}
            </p>
          </div>
        ))}
      </div>

      <div className="glass p-6">
        <h3 className="mb-4 text-lg font-medium text-white">Triage Distribution</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: "#111b28", border: "1px solid #1e3048" }} />
              <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
