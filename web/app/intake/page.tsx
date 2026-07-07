"use client";

import { useState } from "react";
import Panel from "@/components/Panel";
import ClinicalText from "@/components/ClinicalText";
import UrgencyBadge from "@/components/UrgencyBadge";
import { submitIntake } from "@/lib/api";

const PIPELINE_STEPS = [
  "Intake normalization",
  "Clinical reasoning",
  "Urgency stratification",
  "Report generation",
];

export default function IntakePage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(40);
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setStep(0);

    const timer = setInterval(() => {
      setStep((s) => Math.min(s + 1, PIPELINE_STEPS.length - 1));
    }, 600);

    try {
      const data = await submitIntake({ name, age, symptoms });
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      clearInterval(timer);
      setLoading(false);
      setStep(PIPELINE_STEPS.length);
    }
  }

  return (
    <div className="animate-fade-up grid grid-cols-2 gap-8">
      <div className="glass p-6">
        <h2 className="text-lg font-semibold text-white">New Patient Presentation</h2>
        <p className="mt-1 text-sm text-[#6b8cb8]">
          Enter case details to run the multi-agent clinical pipeline.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            className="w-full rounded-lg border border-border bg-canvas px-4 py-3 text-white outline-none focus:border-accent"
            placeholder="Patient identifier"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            className="w-full rounded-lg border border-border bg-canvas px-4 py-3 text-white outline-none focus:border-accent"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            min={0}
            max={120}
          />
          <textarea
            className="h-32 w-full rounded-lg border border-border bg-canvas px-4 py-3 text-white outline-none focus:border-accent"
            placeholder="Chief complaint (e.g. blurry vision, eye pain, floaters)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-[#1e4a6f] to-accent py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Processing clinical workflow…" : "Run Clinical Pipeline"}
          </button>
        </form>
      </div>

      <div className="glass p-6">
        <h2 className="text-lg font-semibold text-white">Analysis Output</h2>

        {loading && (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-[#6b8cb8]">Processing clinical workflow…</p>
            {PIPELINE_STEPS.map((label, i) => (
              <div
                key={label}
                className={`flex items-center gap-2 text-sm ${
                  i <= step ? "text-live" : "text-slate-600"
                }`}
              >
                <span>{i < step ? "✓" : i === step ? "●" : "○"}</span>
                {label}
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="mt-6 text-sm text-red-400">{error}</p>
        )}

        {!loading && !error && !result && (
          <p className="mt-8 text-[#6b8cb8]">Awaiting patient presentation…</p>
        )}

        {!loading && result && (
          <div className="mt-6 space-y-4">
            <Panel title="Presentation Summary">
              <ClinicalText text={result.summary} />
            </Panel>
            <Panel title="Clinical Assessment">
              <ClinicalText text={result.analysis} />
            </Panel>
            <UrgencyBadge urgency={result.urgency} />
          </div>
        )}
      </div>
    </div>
  );
}
