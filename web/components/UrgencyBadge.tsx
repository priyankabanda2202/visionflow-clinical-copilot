import clsx from "clsx";

export default function UrgencyBadge({ urgency }: { urgency: string | null }) {
  if (!urgency) return null;
  const styles: Record<string, string> = {
    RED: "border-red-500/50 bg-red-500/10 text-red-300",
    YELLOW: "border-amber-500/50 bg-amber-500/10 text-amber-300",
    GREEN: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
  };
  const labels: Record<string, string> = {
    RED: "Critical",
    YELLOW: "Urgent",
    GREEN: "Routine",
  };
  return (
    <span
      className={clsx(
        "inline-flex rounded-lg border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        styles[urgency] || styles.GREEN
      )}
    >
      {labels[urgency] || urgency}
    </span>
  );
}
