// Demo personas (BUILD_PLAN §6.2). All people and organisations are fictional.
// Phase 1 stub: identity, role, landing route and demo date only. Phase 2 adds the rest.

export const PERSONAS = {
  visitor: {
    id: 'visitor', name: 'Visitor', role: 'visitor', landing: '/', demoDate: '2027-05-03',
    summary: 'Public site, not signed in',
  },
  A: {
    id: 'A', name: 'Sam Rivera', title: 'CEO', initials: 'SR', role: 'lead', orgId: 'org-kestrel',
    landing: '/app/dashboard', demoDate: '2027-05-03', summary: 'Core tier, working the Academy',
  },
  B: {
    id: 'B', name: 'Ana Kowalski', title: 'Founder', initials: 'AK', role: 'lead', orgId: 'org-brightfield',
    landing: '/app/dashboard', demoDate: '2027-05-03', summary: 'Start-up pathway first, Core locked',
  },
  C: {
    id: 'C', name: 'Tom Okafor', title: 'CFO', initials: 'TO', role: 'lead', orgId: 'org-harbourline',
    landing: '/app/enterprise', demoDate: '2027-08-02', summary: 'Accredited, Enterprise hub',
  },
  D: {
    id: 'D', name: 'Lena Ng', title: 'Lending Partner', initials: 'LN', role: 'partner', partnerId: 'partner-scl',
    landing: '/partner/dashboard', demoDate: '2027-05-03', summary: 'Referral partner, 6 clients',
  },
  E: {
    id: 'E', name: 'Priya Desai', title: 'Verifier', initials: 'PD', role: 'verifier',
    landing: '/team/queue', demoDate: '2027-05-03', summary: 'Verification team, 9 in queue',
  },
  F: {
    id: 'F', name: 'Marcus Hale', title: 'Mentor', initials: 'MH', role: 'mentor',
    landing: '/team/mentor', demoDate: '2027-05-03', summary: '5 mentees, 3 sessions this week',
  },
};

export const PERSONA_ORDER = ['visitor', 'A', 'B', 'C', 'D', 'E', 'F'];

export const ROLE_LABELS = {
  visitor: 'Visitor',
  lead: "an organisation's authorised lead",
  partner: 'institution and agent partners',
  verifier: 'the BVT verification team',
  mentor: 'BVT mentors',
};
