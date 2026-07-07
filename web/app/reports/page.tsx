"use client";

import { Suspense } from "react";
import ReportsContent from "./ReportsContent";

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="glass p-6 text-slate-400">Loading reports…</div>}>
      <ReportsContent />
    </Suspense>
  );
}
