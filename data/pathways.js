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
