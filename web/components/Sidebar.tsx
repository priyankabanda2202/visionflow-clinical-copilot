"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  Activity,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Stethoscope,
  Sun,
} from "lucide-react";
import { fetchHealth } from "@/lib/api";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/intake/", label: "Patient Intake", icon: Stethoscope },
  { href: "/notes/", label: "Clinical Notes", icon: FileText },
  { href: "/reports/", label: "Reports", icon: Activity },
  { href: "/brief/", label: "Daily Brief", icon: Sun },
  { href: "/assistant/", label: "Clinical Assistant", icon: MessageSquare },
];

export default function Sidebar() {
  const path = usePathname();
  const [engine, setEngine] = useState("Connecting…");
  const [model, setModel] = useState("");

  useEffect(() => {
    fetchHealth()
      .then((h) => {
        setEngine(h.engine.charAt(0).toUpperCase() + h.engine.slice(1));
        setModel(h.model);
      })
      .catch(() => setEngine("Offline — start API"));
  }, []);

  return (
    <aside className="fixed left-0 top-0 z-10 flex h-screen w-64 flex-col border-r border-border bg-[#0a1018] p-6">
      <div className="mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-live">VisionFlow</p>
        <h1 className="mt-1 text-lg font-semibold text-white">Clinical Copilot</h1>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-live/30 bg-live/10 px-3 py-1 text-xs text-live">
          <span className="h-2 w-2 rounded-full bg-live live-pulse" />
          Live Console
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== "/" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all",
                active
                  ? "border-accent/40 bg-accent/20 text-white"
                  : "border-transparent text-slate-400 hover:border-border hover:bg-panel hover:text-white"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 text-xs text-slate-500">
        <p>AI Engine · {engine}</p>
        {model && <p>Model · {model}</p>}
        <p className="pt-2 text-[10px] uppercase tracking-wider text-slate-600">
          Stakeholder preview
        </p>
      </div>
    </aside>
  );
}
