export function formatClinicalText(text: string | null | undefined): string {
  if (!text) return "";

  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/(?<!\w)\*(?!\*)(.+?)(?<!\*)\*(?!\w)/g, "$1")
    .replace(/^Clinical Assessment:\s*/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
