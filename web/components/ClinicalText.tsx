import { formatClinicalText } from "@/lib/formatClinicalText";

export default function ClinicalText({
  text,
  className = "",
}: {
  text: string | null | undefined;
  className?: string;
}) {
  const formatted = formatClinicalText(text);
  if (!formatted) return null;

  return (
    <div className={`clinical-text whitespace-pre-wrap leading-relaxed ${className}`}>
      {formatted}
    </div>
  );
}
