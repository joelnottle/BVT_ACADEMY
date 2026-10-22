// Leadership Micro-Units (BUILD_PLAN §2 Stages, §8.14). Enterprise Stage, first release 1 July 2027.
// Pricing is from the brief: $1,500 first participant, $1,000 each additional. 2–4 weeks, online,
// 8 Ask Ali credits per participant. Unit titles and lessons are placeholders.

const PRICING = { priceFirst: 1500, priceAdditional: 1000, aliCredits: 8, weeks: '2–4', format: 'Online' };

/* PLACEHOLDER — Micro-Unit titles and lessons */
export const MICRO_UNITS = [
  { id: 'mu-fin-statements', area: 'Finance', title: 'Reading your financial statements', summary: 'Understand the profit and loss, balance sheet and cash flow statement well enough to ask the right questions.', lessons: ['The three statements', 'Ratios that matter', 'Questions for your finance team'], ...PRICING },
  { id: 'mu-fin-cashflow', area: 'Finance', title: 'Cash flow and budgeting for leaders', summary: 'Lead budget conversations and read a forecast with confidence.', lessons: ['Budget vs forecast', 'Reading variances', 'Making decisions from the numbers'], ...PRICING },
  { id: 'mu-gov-board', area: 'Governance', title: 'Board essentials for directors', summary: 'Directors’ duties, conflicts, and how good boards make decisions.', lessons: ['Your duties', 'Conflicts in practice', 'Effective meetings'], ...PRICING },
  { id: 'mu-gov-risk', area: 'Governance', title: 'Risk and compliance oversight', summary: 'Set risk appetite and oversee compliance without micromanaging.', lessons: ['Risk appetite', 'Reading a risk register', 'Assurance'], ...PRICING },
  { id: 'mu-hr-people', area: 'HR', title: 'Leading people well', summary: 'Recruitment, performance and difficult conversations for small-team leaders.', lessons: ['Hiring well', 'Performance conversations', 'Wellbeing and safety'], ...PRICING },
  { id: 'mu-ops-planning', area: 'Operations', title: 'Operational planning and reporting', summary: 'Turn strategy into a plan, and report progress the board can act on.', lessons: ['From strategy to plan', 'Measures that matter', 'Reporting to the board'], ...PRICING },
];

export const MICRO_UNIT_AREAS = ['Finance', 'Governance', 'HR', 'Operations'];

// Further checks in the Enterprise hub (§8.14)
export const FURTHER_CHECKS = [
  { id: 'growth', name: 'Growth Check', status: 'coming-soon' },
  { id: 'esg', name: 'ESG Check', status: 'coming-soon' },
  { id: 'debt', name: 'Debt Management Check', status: 'available' },
  { id: 'oric', name: 'ORIC Governance Check', status: 'available' },
];

// TODO(client): prices for re-assessment, mentoring, Ali top-ups and extensions come from Doc 3 (§14 Q6).
export const PURCHASES = [
  { id: 'reassessment', title: 'Annual re-assessment', price: null },
  { id: 'mentoring', title: 'Mentor session (1 credit)', price: null },
  { id: 'ali-topup', title: 'Ask Ali top-up (5 credits)', price: null },
  { id: 'extend-1', title: 'Extension — 1 month', price: null },
  { id: 'extend-3', title: 'Extension — 3 months', price: null },
];
