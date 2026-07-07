import { formatClinicalText } from "@/lib/formatClinicalText";

function splitSections(text: string): { title: string; body: string }[] {
  const formatted = formatClinicalText(text);
  const parts = formatted.split(/\n(?=\d+\.\s)/);
  if (parts.length <= 1) return [{ title: "", body: formatted }];

  return parts.map((part) => {
    const lines = part.trim().split("\n");
    const first = lines[0] || "";
    const title = first.replace(/^\d+\.\s*/, "").trim();
    const body = lines.slice(1).join("\n").trim() || first;
    return { title, body };
  });
}

export default function ClinicalText({
  text,
  className = "",
  structured = true,
}: {
  text: string | null | undefined;
  className?: string;
  structured?: boolean;
}) {
  const formatted = formatClinicalText(text);
  if (!formatted) return null;

  if (!structured) {
    return (
      <div className={`clinical-text whitespace-pre-wrap leading-relaxed ${className}`}>
        {formatted}
      </div>
    );
  }

  const sections = splitSections(formatted);

  return (
    <div className={`clinical-text space-y-4 ${className}`}>
      {sections.map((section, i) => (
        <div key={i}>
          {section.title && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#6b8cb8]">
              {section.title}
            </p>
          )}
          <p className="whitespace-pre-wrap leading-relaxed text-slate-300">{section.body}</p>
        </div>
      ))}
    </div>
  );
}
