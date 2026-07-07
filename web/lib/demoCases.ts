export const DEMO_CASES = [
  {
    id: "crao",
    label: "Emergency — Sudden vision loss",
    name: "Eval-CRAO-01",
    age: 67,
    symptoms:
      "Sudden painless vision loss in right eye since this morning. Patient describes a curtain descending over vision. No trauma.",
  },
  {
    id: "aacg",
    label: "Urgent — Acute angle closure",
    name: "Eval-AACG-01",
    age: 54,
    symptoms:
      "Severe right eye pain, halos around lights, nausea, blurred vision. Red eye with mid-dilated pupil.",
  },
  {
    id: "rd",
    label: "Emergency — Retinal detachment symptoms",
    name: "Eval-RD-01",
    age: 58,
    symptoms:
      "New floaters and flashing lights for 2 days, now shadow in peripheral vision like a curtain. Myopia history.",
  },
  {
    id: "routine",
    label: "Routine — Presbyopia / blur",
    name: "Eval-PRESBY-01",
    age: 42,
    symptoms:
      "Gradual difficulty reading small print over 6 months. No pain, no redness, no sudden vision changes.",
  },
] as const;
