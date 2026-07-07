"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Activity,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Stethoscope,
  Sun,
} from "lucide-react";

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

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-border bg-[#0a1018] p-6">
      <div className="mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-live">VisionFlow</p>
        <h1 className="mt-1 text-lg font-semibold text-white">Clinical Copilot</h1>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-live/30 bg-live/10 px-3 py-1 text-xs text-live">
          <span className="h-2 w-2 rounded-full bg-live live-pulse" />
          Live Console
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
              path === href || (href !== "/" && path.startsWith(href))
                ? "bg-accent/20 text-white border border-accent/40"
                : "text-slate-400 hover:bg-panel hover:text-white"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <p className="text-xs text-slate-500">Engine · Groq / Ollama · LangGraph</p>
    </aside>
  );
}
