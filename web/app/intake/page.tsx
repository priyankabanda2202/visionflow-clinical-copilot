"use client";

import { useState } from "react";
import UrgencyBadge from "@/components/UrgencyBadge";
import { submitIntake } from "@/lib/api";

export default function IntakePage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(40);
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await submitIntake({ name, age, symptoms });
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-up grid grid-cols-2 gap-8">
      <div className="glass p-6">
        <h2 className="text-xl font-semibold text-white">New Presentation</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            className="w-full rounded-xl border border-border bg-canvas px-4 py-3 text-white outline-none focus:border-accent"
            placeholder="Patient name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            className="w-full rounded-xl border border-border bg-canvas px-4 py-3 text-white outline-none focus:border-accent"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            min={0}
            max={120}
          />
          <textarea
            className="h-32 w-full rounded-xl border border-border bg-canvas px-4 py-3 text-white outline-none focus:border-accent"
            placeholder="Chief complaint"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent py-3 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Running clinical pipeline…" : "Run Clinical Pipeline"}
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>

      <div className="glass p-6">
        <h2 className="text-xl font-semibold text-white">Analysis Output</h2>
        {!result ? (
          <p className="mt-8 text-slate-500">Awaiting patient presentation…</p>
        ) : (
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs uppercase text-slate-500">Summary</p>
              <pre className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{result.summary}</pre>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Clinical Assessment</p>
              <pre className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{result.analysis}</pre>
            </div>
            <UrgencyBadge urgency={result.urgency} />
          </div>
        )}
      </div>
    </div>
  );
}
