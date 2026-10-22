// Mentor team (BUILD_PLAN §8.11). Fictional. "BVT accredited specialists", led by the General Manager.
// Mentors help organisations implement. They never verify (§2).

export const MENTORS = [
  {
    id: 'm-marcus', userId: 'F', name: 'Marcus Hale', initials: 'MH', title: 'Senior mentor',
    specialties: ['Financial management', 'Cash flow & budgeting', 'Financial controls'],
    bio: 'Former finance manager in the community sector. Helps boards and CEOs build simple, reliable financial routines.',
    mentees: ['org-kestrel', 'org-brightfield', 'org-riverbend', 'org-mallee', 'org-gumtree'],
    active: true,
  },
  {
    id: 'm-aisha', userId: null, name: 'Aisha Rahman', initials: 'AR', title: 'Mentor',
    specialties: ['Governance', 'Board effectiveness', 'Conflicts of interest'],
    bio: 'Company secretary and board adviser. Makes governance practical for small boards.',
    mentees: ['org-harbourline'],
    active: true,
  },
  {
    id: 'm-ben', userId: null, name: 'Ben Castellano', initials: 'BC', title: 'Mentor',
    specialties: ['People & HR', 'Work health & safety', 'Operations'],
    bio: 'HR and WHS practitioner who has set up induction and safety systems for dozens of small teams.',
    mentees: [],
    active: true,
  },
  {
    id: 'm-mele', userId: null, name: 'Mele Fonua', initials: 'MF', title: 'Mentor',
    specialties: ['Risk & continuity', 'Compliance', 'Privacy'],
    bio: 'Risk and compliance specialist. Turns risk registers into something the board actually uses.',
    mentees: [],
    active: true,
  },
  // Priya mentored Coastline before moving to the verification team. Verifier views must block her
  // decisions on Coastline's evidence (conflict guard, §8.16).
  {
    id: 'm-priya-former', userId: 'E', name: 'Priya Desai', initials: 'PD', title: 'Former mentor',
    specialties: ['Governance'], bio: '', mentees: [], formerMentees: ['org-coastline'], active: false,
  },
];

export const MENTOR_BY_ID = Object.fromEntries(MENTORS.map((m) => [m.id, m]));

/* PLACEHOLDER — mentor availability. Times are AEST, in the demo week (Mon 3 May 2027) and the next. */
export const SLOTS = ['09:00', '10:00', '11:30', '14:00', '15:30'];
