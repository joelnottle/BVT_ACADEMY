// The four free Checks (BUILD_PLAN §2 Free Checks) and the answer scale (§8.2).
// Times are placeholders. The prototype enrols from the Core Checks only (§14 Q13).

export const CHECKS = {
  'core-ms': { id: 'core-ms', name: 'BVT Core Pre-Qualification — Micro to Small', short: 'Core — Micro to Small', for: 'Under 20 staff', questions: 45, mins: 25, enrols: true },
  'core-ml': { id: 'core-ml', name: 'BVT Core Pre-Qualification — Medium to Large', short: 'Core — Medium to Large', for: '20 or more staff', questions: 60, mins: 35, enrols: true },
  oric: { id: 'oric', name: 'ORIC Governance Check', short: 'ORIC Governance', for: 'ORIC-registered organisations', questions: 76, mins: 40, enrols: false },
  debt: { id: 'debt', name: 'Debt Management Check', short: 'Debt Management', for: 'Organisations managing debt or in recovery', questions: 25, mins: 15, enrols: false },
};

// TODO(client): confirm the scale, and how "Partly" classifies (BUILD_PLAN §14 Q4).
// Prototype: Partly counts as half towards the score and is treated as "not yet in place".
export const ANSWER_SCALE = [
  { id: 'in-place', label: 'In place', hint: 'we do this and can show evidence', weight: 1 },
  { id: 'partly', label: 'Partly', hint: 'some of it, not consistently', weight: 0.5 },
  { id: 'not-yet', label: 'Not yet', hint: "we'll build this in the Academy", weight: 0 },
  { id: 'not-sure', label: 'Not sure', hint: '', weight: 0 },
  { id: 'na', label: 'Not applicable', hint: '', weight: null }, // excluded from the score
];
