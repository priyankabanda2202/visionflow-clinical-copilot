"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  Activity,
  Building2,
  Calendar,
  ClipboardCheck,
  ClipboardList,
  Eye,
  FileText,
  HelpCircle,
  Info,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Radio,
  Shield,
  Stethoscope,
  Sun,
  TrendingUp,
  X,
} from "lucide-react";
import { fetchHealth, fetchReviewQueue } from "@/lib/api";
import { useBranch } from "@/lib/branchContext";
import { useCloseNavOnNavigate, useNav } from "@/lib/navContext";

const clinicalLinks = [
  { href: "/", label: "Command Center", icon: LayoutDashboard },
  { href: "/live/", label: "Live Triage Board", icon: Radio, highlight: true },
  { href: "/intake/", label: "Patient Intake", icon: Stethoscope },
  { href: "/review/", label: "Physician Review", icon: ClipboardCheck, badge: true },
  { href: "/scheduling/", label: "Scheduling Desk", icon: Calendar },
  { href: "/notes/", label: "Clinical Notes", icon: FileText },
  { href: "/reports/", label: "Reports", icon: Activity },
  { href: "/brief/", label: "Daily Brief", icon: Sun },
  { href: "/assistant/", label: "Clinical Assistant", icon: MessageSquare },
  { href: "/operations/", label: "Operations", icon: TrendingUp },
];

const adminLinks = [
  { href: "/audit/", label: "Audit Trail", icon: ClipboardList },
  { href: "/branches/", label: "Locations", icon: Building2 },
  { href: "/about/", label: "About Us", icon: Info },
  { href: "/compliance/", label: "Privacy & Security", icon: Shield },
  { href: "/help/", label: "Help Desk", icon: HelpCircle },
];

function SidebarPanel({
  path,
  pendingReviews,
  branch,
  engine,
  onNavigate,
  showClose,
  onClose,
}: {
  path: string;
  pendingReviews: number;
  branch: { name: string };
  engine: string;
  onNavigate: () => void;
  showClose?: boolean;
  onClose?: () => void;
}) {
  function NavSection({
    title,
    links,
  }: {
    title: string;
    links: (typeof clinicalLinks)[number][];
  }) {
    return (
      <>
        <p className="mb-1 mt-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">
          {title}
        </p>
        {links.map(({ href, label, icon: Icon, highlight, badge }) => {
          const active = path === href || (href !== "/" && path.startsWith(href));
          const showBadge = badge && pendingReviews > 0;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={clsx(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-to-r from-accent/25 to-accent/5 text-white"
                  : "text-slate-400 hover:bg-panel-hover hover:text-white",
                highlight && !active && "text-live/90"
              )}
            >
              <Icon size={17} className={active ? "text-accent-glow" : highlight ? "text-live" : ""} />
              <span className="flex-1">{label}</span>
              {showBadge && (
                <span className="rounded-full bg-gold/20 px-1.5 py-0.5 text-[10px] font-bold text-gold">
                  {pendingReviews}
                </span>
              )}
              {highlight && active && (
                <span className="h-1.5 w-1.5 rounded-full bg-live live-pulse" />
              )}
            </Link>
          );
        })}
      </>
    );
  }

  return (
    <>
      {showClose && onClose && (
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-white"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="mb-4 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 to-transparent p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-blue-700 shadow-lg shadow-accent/30">
            <Eye size={22} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent-glow">
              VisionFlow
            </p>
            <h1 className="text-sm font-bold leading-tight text-white">Eye Institute</h1>
          </div>
        </div>
        <p className="mt-2 truncate text-[10px] text-slate-500">{branch.name}</p>
        <div className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-live/30 bg-live/10 py-1 text-[10px] font-semibold text-live">
          <span className="h-1.5 w-1.5 rounded-full bg-live live-pulse" />
          Live Operations
        </div>
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto overscroll-contain">
        <NavSection title="Clinical" links={clinicalLinks} />
        <NavSection title="Institution" links={adminLinks} />
      </nav>

      <div className="mt-3 rounded-xl border border-border/40 bg-canvas/50 p-3 text-[10px]">
        <p className="text-slate-500">Clinical Intelligence</p>
        <p className="text-white">{engine} · Online</p>
      </div>
    </>
  );
}

export default function Sidebar() {
  const path = usePathname();
  const { open, setOpen, toggle } = useNav();
  const [engine, setEngine] = useState("…");
  const [pendingReviews, setPendingReviews] = useState(0);
  const { branch } = useBranch();

  useCloseNavOnNavigate(path);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    fetchHealth()
      .then((h) => setEngine(h.engine.charAt(0).toUpperCase() + h.engine.slice(1)))
      .catch(() => setEngine("Reconnecting"));
    fetchReviewQueue()
      .then((q) => setPendingReviews(q.length))
      .catch(() => null);
    const id = setInterval(() => {
      fetchReviewQueue()
        .then((q) => setPendingReviews(q.length))
        .catch(() => null);
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const panelProps = {
    path,
    pendingReviews,
    branch,
    engine,
    onNavigate: closeMenu,
  };

  return (
    <>
      {/* Mobile top bar — menu hidden until tapped */}
      <div className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between border-b border-border/60 bg-[#060b14]/95 px-4 py-3 backdrop-blur-xl md:hidden">
        <button
          type="button"
          onClick={toggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-panel/80 text-white"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <Eye size={18} className="text-accent-glow" />
          <span className="text-sm font-bold text-white">VisionFlow</span>
        </div>
        <span className="flex items-center gap-1 rounded-full border border-live/30 bg-live/10 px-2 py-1 text-[10px] font-semibold text-live">
          <span className="h-1.5 w-1.5 rounded-full bg-live live-pulse" />
          Live
        </span>
      </div>

      {/* Mobile drawer — completely hidden unless open */}
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm md:hidden"
          aria-label="Close menu backdrop"
          onClick={closeMenu}
        />
      )}

      <aside
        aria-hidden={!open}
        className={clsx(
          "fixed left-0 top-0 z-50 flex h-[100dvh] w-[85vw] max-w-[300px] flex-col border-r border-border/60 bg-[#060b14] p-4 shadow-2xl transition-transform duration-300 ease-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full pointer-events-none invisible"
        )}
      >
        <SidebarPanel {...panelProps} showClose onClose={closeMenu} />
      </aside>

      {/* Desktop sidebar — always visible, never on mobile */}
      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-[272px] flex-col border-r border-border/60 bg-[#060b14]/95 p-5 backdrop-blur-2xl md:flex">
        <SidebarPanel {...panelProps} />
      </aside>
    </>
  );
}
