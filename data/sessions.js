// Mentor sessions (BUILD_PLAN §8.11, §8.17). Demo week starts Mon 3 May 2027.
// status: 'upcoming' | 'completed'. A booked session has already used a mentor credit.

export const SESSIONS = [
  {
    id: 'ses-kestrel-0506', orgId: 'org-kestrel', mentorId: 'm-marcus', date: '2027-05-06', time: '10:00', mins: 45,
    status: 'upcoming', topic: 'Cash flow forecasting', reqId: 'FM-04',
    prepNotes: "We've loaded 12 months of actuals. We'd like help with assumptions for grant income that arrives quarterly.",
    mentorNotes: '',
  },
  {
    id: 'ses-kestrel-0415', orgId: 'org-kestrel', mentorId: 'm-marcus', date: '2027-04-15', time: '10:00', mins: 45,
    status: 'completed', topic: 'Annual budget for board approval', reqId: 'FM-03',
    prepNotes: 'Draft budget attached. Not sure how to present the deficit year.',
    mentorNotes: 'Agreed a simple one-page budget summary for the board, with the deficit explained by the one-off fit-out. Next: build the 12-month forecast from it.',
  },
  {
    id: 'ses-brightfield-0504', orgId: 'org-brightfield', mentorId: 'm-marcus', date: '2027-05-04', time: '14:00', mins: 45,
    status: 'upcoming', topic: 'First-year budget', reqId: 'SU-05',
    prepNotes: 'We have three months of sales. How do we budget for a seasonal business?',
    mentorNotes: '',
  },
  {
    id: 'ses-mallee-0507', orgId: 'org-mallee', mentorId: 'm-marcus', date: '2027-05-07', time: '09:00', mins: 45,
    status: 'upcoming', topic: 'Fraud and misuse controls', reqId: 'FM-09',
    prepNotes: 'Board wants a simple fraud control checklist before harvest season.',
    mentorNotes: '',
  },
  {
    id: 'ses-riverbend-0420', orgId: 'org-riverbend', mentorId: 'm-marcus', date: '2027-04-20', time: '11:30', mins: 45,
    status: 'completed', topic: 'Delegations of financial authority', reqId: 'FM-08',
    prepNotes: '', mentorNotes: 'Drafted a delegations table with three spending levels. The board will adopt it at the May meeting.',
  },
  {
    id: 'ses-harbourline-0329', orgId: 'org-harbourline', mentorId: 'm-aisha', date: '2027-03-29', time: '15:30', mins: 45,
    status: 'completed', topic: 'Board skills matrix', reqId: 'BD-05',
    prepNotes: '', mentorNotes: 'Skills matrix completed; gap in risk expertise noted for the next board appointment.',
  },
  // Source of Priya's conflict on Coastline (she mentored them before joining the verification team)
  {
    id: 'ses-coastline-1112', orgId: 'org-coastline', mentorId: 'm-priya-former', date: '2026-11-12', time: '10:00', mins: 45,
    status: 'completed', topic: 'Board meetings and minutes', reqId: 'BD-04',
    prepNotes: '', mentorNotes: 'Set up a quarterly meeting calendar and a minutes template.',
  },
];
