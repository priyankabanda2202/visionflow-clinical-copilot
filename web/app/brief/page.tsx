"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchDailyBrief } from "@/lib/api";

export default function BriefPage() {
  const [brief, setBrief] = useState({ total: 0, red: 0, yellow: 0, green: 0 });

  useEffect(() => {
    fetchDailyBrief().then(setBrief);
  }, []);

  const chartData = [
    { name: "Critical", value: brief.red },
    { name: "Urgent", value: brief.yellow },
    { name: "Routine", value: brief.green },
  ];

  return (
    <div className="animate-fade-up space-y-8">
      <h2 className="text-2xl font-semibold text-white">Chief of Staff Daily Brief</h2>
      <div className="grid grid-cols-4 gap-4">
        {[
          ["Total Caseload", brief.total],
          ["Critical Today", brief.red],
          ["Urgent Today", brief.yellow],
          ["Routine Today", brief.green],
        ].map(([label, value]) => (
          <div key={label as string} className="glass p-5">
            <p className="text-xs uppercase text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value as number}</p>
          </div>
        ))}
      </div>
      <div className="glass p-6">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ background: "#111b28", border: "1px solid #1e3048" }} />
            <Bar dataKey="value" fill="#00d4aa" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="glass border-live/30 bg-gradient-to-br from-[#0f2438] to-[#132a42] p-6">
        <p className="font-semibold text-white">Morning Brief — Clinical Director</p>
        <p className="mt-4 text-slate-300">
          Critical cases requiring immediate action: <strong>{brief.red}</strong>
          <br />
          Urgent reviews scheduled: <strong>{brief.yellow}</strong>
          <br />
          Routine follow-ups: <strong>{brief.green}</strong>
        </p>
      </div>
    </div>
  );
}
