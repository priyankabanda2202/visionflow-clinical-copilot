"use client";

import { DEMO_CASES } from "@/lib/demoCases";

export default function SampleCasePicker({
  onSelect,
}: {
  onSelect: (caseData: (typeof DEMO_CASES)[number]) => void;
}) {
  return (
    <div className="mt-4 rounded-xl border border-border bg-canvas/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6b8cb8]">
        Quick-load demo cases for evaluators
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {DEMO_CASES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c)}
            className="rounded-lg border border-border px-3 py-2 text-left text-xs text-slate-300 transition hover:border-accent/40 hover:text-white"
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
