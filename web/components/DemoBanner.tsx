export default function DemoBanner() {
  return (
    <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
      <strong className="font-semibold text-amber-50">Clinical evaluation prototype.</strong>{" "}
      Synthetic cases only — no real patient data (PHI). Supports clinician decision-making;
      not a substitute for examination, diagnosis, or treatment. All outputs require physician
      verification.
    </div>
  );
}
