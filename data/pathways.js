// Tailored pathways (BUILD_PLAN §2, §8.8). Unlocked at enrolment for eligible organisations and
// completed before Core requirements unlock — the one place a sequence is recommended.

export const PATHWAYS = {
  startup: {
    id: 'startup',
    title: 'Start-up pathway',
    intro: 'Seven foundations every new business needs. Finish these and your Core requirements unlock.',
    requirementIds: ['SU-01', 'SU-02', 'SU-03', 'SU-04', 'SU-05', 'SU-06', 'SU-07'],
  },
  recovery: {
    id: 'recovery',
    title: 'Recovery pathway',
    intro: 'Steady the organisation first, then build back towards pre-qualification.',
    // TODO(client): Recovery pathway content and the tone for distressed organisations (BUILD_PLAN §14 Q11, Q14).
    requirementIds: [],
  },
};

// Pathway page copy (BUILD_PLAN §8.8). The one place a sequence is recommended — still progress-based,
// and every item stays open.
export const PATHWAY_PAGE = {
  why: 'Why this comes first',
  whyPoints: [
    'These are the foundations a lender or funder checks before anything else.',
    'Each one is short, and most need only a document you already have or can set up quickly.',
    'Once all are verified, your Core requirements unlock and you choose where to go next.',
  ],
  progress: (done, total) => `${done} of ${total} verified`,
  order: 'Recommended order',
  orderNote: 'Work through them in any order you like. This is simply the order most new businesses find easiest.',
  next: 'Up next',
  continue: 'Continue',
  start: 'Start',
  view: 'View',
  lockedCore: (n) => `${n} Core requirements unlock when this pathway is complete.`,
  preview: 'Preview the Core requirements',
  demo: 'Complete the pathway (demo)',
  done: 'Pathway complete — Core requirements unlocked',
  doneText: (n) => `All ${n} Core requirements are open. Pick where to start: quick wins are a good first step.`,
  doneAction: 'Go to your dashboard',
  noPathway: 'Your organisation doesn’t have a tailored pathway. Every requirement is open from day one.',
  // TODO(client): Recovery pathway content and tone (§14 Q11, Q14)
  recoveryEmpty: 'The Recovery pathway content is still being written with BVT. In this prototype, your Core requirements stay open.',
};
