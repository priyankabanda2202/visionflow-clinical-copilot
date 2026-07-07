"use client";

import { useEffect, useState } from "react";

export default function ClinicalHeader() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="clinical-header mb-6 flex items-center justify-between rounded-2xl border border-[#1e3a5f] bg-gradient-to-r from-[#0f1c2e] to-[#132438] px-5 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#f0f6ff]">
          VisionFlow Clinical Copilot
        </h1>
        <p className="mt-1 text-sm text-[#7a9bc4]">
          Ophthalmology Clinical Decision Support · Physician Review Console
        </p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-live/35 bg-live/10 px-3 py-1.5 text-xs font-semibold text-live">
        <span className="h-2 w-2 rounded-full bg-live live-pulse" />
        LIVE · {time}
      </div>
    </header>
  );
}
