"use client";

import { useState } from "react";

type Status = "pending" | "accepted" | "modified" | "rejected";

const LABELS: Record<Status, string> = {
  pending: "Pending physician review",
  accepted: "Assessment accepted for chart",
  modified: "Marked for modification",
  rejected: "Assessment rejected — manual review required",
};

export default function AttestationBar() {
  const [status, setStatus] = useState<Status>("pending");

  return (
    <div className="rounded-xl border border-border bg-canvas/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6b8cb8]">
        Physician attestation
      </p>
      <p className="mt-1 text-sm text-slate-300">{LABELS[status]}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(["accepted", "modified", "rejected"] as const).map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => setStatus(action)}
            className={`rounded-lg border px-3 py-1.5 text-xs capitalize transition ${
              status === action
                ? "border-live/50 bg-live/10 text-live"
                : "border-border text-slate-400 hover:text-white"
            }`}
          >
            {action}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-slate-500">
        Demo workflow — attestation is recorded in-session for evaluator review.
      </p>
    </div>
  );
}
