// Enrolment and onboarding copy (BUILD_PLAN §8.3).

/* PLACEHOLDER — package prices and credit allowances per tier come from Doc 3 (BUILD_PLAN §14 Q6) */
export const PACKAGES = {
  foundation: { credits: { ali: 10, mentor: 3 }, price: null },
  core:       { credits: { ali: 8, mentor: 2 }, price: null },
  advanced:   { credits: { ali: 6, mentor: 2 }, price: null },
  ready:      { credits: { ali: 4, mentor: 1 }, price: null },
};

export const ENROL = {
  eyebrow: 'Enrolment',
  lead: (score) => `Based on your free check: ${score}% of pre-qualification met.`,
  price: 'Price to be confirmed',
  placeholderNote: 'Prices and credit allowances are placeholders until BVT confirms them (Doc 3).',
  pay: 'Pay and enrol (demo)',
  noCard: 'No card details are asked for. This prototype takes no payment.',
  clock: 'Your clock starts today, when you enrol.',
  confirmTitle: 'Confirm your enrolment',
  confirmNote: 'Prototype — no payment is taken and no card details are collected.',
  confirmAction: 'Confirm and enrol',
  enrolledToast: (org) => `${org} is enrolled`,
  enrolledText: (months, ends) => `Milestone: Enrolled. Your ${months} months run to ${ends}.`,
};

// Start-up / Recovery screening (§2 Tailored pathways). A pathway puts the organisation at Foundation.
// TODO(client): confirm that Start-up and Recovery organisations always join at Foundation (§2 Timeframes).
// TODO(client): can an organisation be both? The prototype puts Start-up first (§14 Q14).
export const SCREENING = {
  title: 'Two quick questions',
  intro: 'Some organisations start with a short tailored pathway before the Core requirements. Your answers decide that.',
  startup: (org) => `Has ${org} been operating for less than two years?`,
  recovery: (org) => `Is ${org} recovering from a difficult period, such as debt or a downturn?`,
  outcome: {
    none: { icon: 'lock-open', text: 'Every requirement is open from day one, and you choose where to start.' },
    startup: { icon: 'route', text: 'The Start-up pathway comes first: 7 foundations every new business needs. Your Core requirements unlock once they are verified. Start-up organisations join at Foundation, with 12 months.' },
    // TODO(client): Recovery pathway content (§14 Q11). Until it exists, Core requirements stay open for Recovery organisations.
    recovery: { icon: 'route', text: 'A Recovery pathway comes first, to steady the organisation before building back. Recovery organisations join at Foundation, with 12 months. The pathway content is still being written, so in this prototype your Core requirements stay open.' },
  },
};

export const ONBOARDING = {
  steps: [
    { id: 'timeline', label: 'Your timeline', title: 'Your *timeline*' },
    { id: 'goal', label: 'Your weekly goal', title: 'Your weekly *goal*' },
    { id: 'start', label: 'Where to start', title: 'Where to *start*' },
    { id: 'support', label: 'Your support', title: 'Your *support*' },
  ],
  welcome: (name) => `Welcome, ${name}`,
  skip: 'Skip for now',
  skippedToast: 'You can set these up any time in Plan & pace',
  finish: 'Go to my dashboard',
  timeline: {
    lead: 'Everything in the Academy is visible from today. Here is the time you have.',
    pace: (n) => `about ${n} ${n === 1 ? 'requirement' : 'requirements'} a fortnight`,
    inPlace: (n) => `The ${n} already in place are the quickest: evidence only, no training.`,
    pathway: (n) => `Your ${n} pathway foundations come first.`,
    clock: 'Your clock started when you enrolled. If life gets in the way, you can re-plan or extend from Plan & pace.',
  },
  goals: [
    { id: 'light', hrs: 2, label: '1–2 hours a week', text: 'Steady progress alongside a full workload.' },
    { id: 'steady', hrs: 3, label: '3–4 hours a week', text: 'Good momentum on both the learning and the doing.' },
    { id: 'focused', hrs: 5, label: '5 hours or more', text: 'A focused push towards accreditation.' },
  ],
  goalLead: 'Pick a time budget that fits your week. It sets your pace plan, not a target to hit.',
  days: [['Mon', 'Monday'], ['Tue', 'Tuesday'], ['Wed', 'Wednesday'], ['Thu', 'Thursday'], ['Fri', 'Friday'], ['Sat', 'Saturday'], ['Sun', 'Sunday']],
  reminderHint: 'One short reminder that day, with your next step. Change it any time in Plan & pace.',
  start: {
    lead: 'There is no set order. Pick a way in, and change your mind any time.',
    cards: [
      { id: 'quick-wins', title: 'Quick wins', text: (n) => `${n} requirements are already in place. Upload evidence and watch your readiness climb.` },
      { id: 'biggest-gaps', title: 'Biggest gaps', text: (area) => `${area} needs the most work. Start with the learning there.` },
      { id: 'choose-area', title: 'Choose an area', text: () => 'Pick the area that matters most to you right now.' },
    ],
    areaLabel: 'Area to start with',
    pathwayTitle: (title) => `Your ${title} comes first`,
    pathwayWhy: "Here's why",
    pathwayPoints: (n) => [
      `${n} foundations every new business needs, such as a separate bank account and a first-year budget.`,
      'Your Core requirements unlock once the pathway is verified.',
      'You can look through everything in the Academy in the meantime.',
    ],
  },
  support: {
    lead: 'You do the work. Ask Ali and your mentor are there whenever you want them.',
    ali: { title: 'Ask Ali', text: 'Ali helps you understand requirements and prepare evidence, any time.', credits: (n) => `${n} credits included`, note: '1 credit ≈ 1 hour of typical use' },
    mentor: { title: 'Mentor sessions', text: 'Book a one-to-one with a BVT mentor for help with any requirement.', credits: (n) => `${n} ${n === 1 ? 'session' : 'sessions'} included` },
    roles: {
      title: 'Mentors help. Independent verifiers decide.',
      help: { title: 'Helps you', text: 'Ask Ali and your mentor explain, suggest and review drafts with you.' },
      decide: { title: 'Decides', text: 'A separate BVT verification team checks your evidence. Your mentor is never your verifier.' },
    },
  },
  doneToast: 'You’re all set',
};
