// Free Check flow copy (BUILD_PLAN §8.2): sign-up, authorised-lead declaration, recommendation, runner, results.

export const FLOW_STEPS = ['Your details', 'Choose a check', 'Questions', 'Results'];

export const DECLARATION = {
  title: 'Who should complete this?',
  text: 'Your nominated authorised lead — someone who can speak for the whole organisation. For example:',
  examples: ['Public officer', 'Bank-account holder', 'Founder or CEO', 'Executive director', 'CFO or finance lead'],
  decides: 'Your organisation decides who completes this.',
  roles: ['Public officer', 'Bank-account holder', 'Founder or CEO', 'Executive director', 'CFO or finance lead', 'Other nominated lead'],
  confirm: 'I am the nominated authorised lead for this organisation',
};

// "Fill with demo details" — persona A's organisation (fictional)
export const DEMO_DETAILS = {
  leadName: 'Sam Rivera', email: 'sam.rivera@kestrel.example', leadRole: 'Founder or CEO',
  orgName: 'Kestrel Community Services Ltd', abn: '41 824 753 019', staff: 14, oric: 'no', debt: 'no',
};

export const RECOMMEND = {
  why: {
    'core-ms': 'Recommended because you have fewer than 20 staff.',
    'core-ml': 'Recommended because you have 20 or more staff.',
    oric: 'Suggested because you are registered with ORIC.',
    debt: 'Suggested because you are managing debt or recovering.',
  },
  // TODO(client): do the ORIC and Debt Management checks feed into the Academy? (BUILD_PLAN §14 Q13)
  standalone: 'A standalone check with its own report. In this prototype, Academy enrolment runs from a Core check.',
};

export const RUNNER = {
  prompt: 'Where is your organisation today?',
  whyLabel: 'Why we ask',
  noteLabel: 'Note',
  footer: 'Completed by your nominated authorised lead. Your answers save automatically.',
  skip: 'Skip to results (demo)',
  sampleNote: 'Prototype: this check has 12 sample questions. The counter shows the real total.',
};

/* PLACEHOLDER — ORIC and Debt Management question banks to come (BUILD_PLAN §14 Q1, Q13) */
export const SAMPLE_QUESTIONS = {
  oric: Array.from({ length: 12 }, (_, i) => ({ id: `OR-${String(i + 1).padStart(2, '0')}`, question: `ORIC governance sample question ${i + 1}`, why: 'Placeholder — the ORIC Governance Check question bank is to be supplied.' })),
  debt: Array.from({ length: 12 }, (_, i) => ({ id: `DM-${String(i + 1).padStart(2, '0')}`, question: `Debt management sample question ${i + 1}`, why: 'Placeholder — the Debt Management Check question bank is to be supplied.' })),
};

export const RESULTS = {
  eyebrow: 'Your free check result',
  clock: 'Your enrolment clock only starts when you enrol in the Academy, not today.',
  inPlace: { title: 'Already in place', text: 'You’ll upload evidence for these. No training needed — your fastest wins.' },
  toBuild: { title: 'To build', text: 'Training, templates, Ask Ali and mentors help you put these in place.' },
  start: {
    title: 'After you enrol, you choose where to *start*',
    cards: [
      { id: 'quick-wins', title: 'Quick wins', text: (n) => `Upload evidence for the ${n} already in place and watch your readiness climb.`, recommended: true },
      { id: 'biggest-gaps', title: 'Biggest gaps', text: (area) => `Start with ${area}, where the check found the most to do.` },
      { id: 'choose-area', title: 'Choose an area', text: () => 'Pick any area. Everything is unlocked.' },
    ],
  },
  // PLACEHOLDER — package prices and credit allowances come from Doc 3 (BUILD_PLAN §14 Q6)
  enrol: { title: (tier) => `Enrol in the Academy — ${tier} package`, detail: (months) => `${months} months · Ask Ali credits [X] · Mentor credits [X] · Verification included · [Price — Doc 3]`, action: 'Enrol now' },
};
