// Verification reviews (BUILD_PLAN §8.16). Fictional.
// status: 'in-review' (in the queue) | 'verified' | 'changes'
// type: 'in-place' | 'implemented' | 'resubmission'
// aiPrecheck is assistive only — the human verifier decides.

const P = (label, pass) => ({ label, pass });

const QUEUE = [
  {
    id: 'rev-k-fm06', orgId: 'org-kestrel', reqId: 'FM-06', submittedOn: '2027-04-30', type: 'in-place', fastTracked: false,
    evidenceIds: ['ev-k13', 'ev-k10'],
    aiPrecheck: [P('Statements cover the full financial year', true), P('Board minute shows the statements were reviewed', true), P('Signed by two directors', false)],
    orgNote: 'Statements were tabled at the February meeting (minute 4.2).',
  },
  {
    id: 'rev-r-oh02', orgId: 'org-riverbend', reqId: 'OH-02', submittedOn: '2027-04-29', type: 'implemented', fastTracked: true,
    evidenceIds: [], aiPrecheck: [P('Induction checklist provided', true), P('Covers WHS and code of conduct', true), P('Signed by a recent starter', false), P('Dated within 12 months', false)],
    orgNote: '',
  },
  {
    id: 'rev-m-gc01', orgId: 'org-mallee', reqId: 'GC-01', submittedOn: '2027-05-02', type: 'in-place', fastTracked: false,
    evidenceIds: [], aiPrecheck: [P('Full constitution, including amendments', true), P('Matches regulator record', true), P('Organisation name matches ABN', true)],
    orgNote: '',
  },
  {
    id: 'rev-g-rc01', orgId: 'org-gumtree', reqId: 'RC-01', submittedOn: '2027-04-27', type: 'implemented', fastTracked: false,
    evidenceIds: [], aiPrecheck: [P('Lists risks with owners', true), P('Includes likelihood and consequence', true), P('Controls described for each risk', true), P('Reviewed by the board', false)],
    orgNote: 'Board review is scheduled for 12 May.',
  },
  {
    id: 'rev-c-bd04', orgId: 'org-coastline', reqId: 'BD-04', submittedOn: '2027-04-28', type: 'in-place', fastTracked: false,
    evidenceIds: [], aiPrecheck: [P('Four meetings in the last 12 months', true), P('Minutes record decisions', true), P('Minutes signed by the chair', false)],
    orgNote: '',
  },
  {
    id: 'rev-g-fm03', orgId: 'org-gumtree', reqId: 'FM-03', submittedOn: '2027-04-23', type: 'implemented', fastTracked: false,
    evidenceIds: [], aiPrecheck: [P('Budget covers the full year', true), P('Approved before the year started', false), P('Approval recorded in a minute', false)],
    orgNote: 'Our year starts 1 July, so the budget was approved early.',
  },
  {
    id: 'rev-r-rp08', orgId: 'org-riverbend', reqId: 'RP-08', submittedOn: '2027-05-01', type: 'implemented', fastTracked: false,
    evidenceIds: [], aiPrecheck: [P('Covers collection, use and disclosure', true), P('Explains how to access or correct information', true), P('Published or available to the public', true)],
    orgNote: '',
  },
  {
    id: 'rev-m-oh04', orgId: 'org-mallee', reqId: 'OH-04', submittedOn: '2027-04-30', type: 'implemented', fastTracked: true,
    evidenceIds: [], aiPrecheck: [P('WHS policy signed by the chair', true), P('Risk assessment dated within 12 months', true), P('Covers seasonal workers', false)],
    orgNote: '',
  },
  {
    id: 'rev-g-rp02', orgId: 'org-gumtree', reqId: 'RP-02', submittedOn: '2027-05-02', type: 'in-place', fastTracked: false,
    evidenceIds: [], aiPrecheck: [P('Latest BAS lodged', true), P('No overdue lodgements shown', true)],
    orgNote: '',
  },
].map((r) => ({ ...r, status: 'in-review', verifierId: null, decidedOn: null, comment: '', history: [{ on: r.submittedOn, by: 'org', text: 'Submitted for verification' }] }));

// Kestrel's changes-requested item (persona A's "Almost there").
const GC02 = {
  id: 'rev-k-gc02', orgId: 'org-kestrel', reqId: 'GC-02', submittedOn: '2027-04-24', type: 'in-place', fastTracked: false,
  evidenceIds: ['ev-k12'],
  aiPrecheck: [P('Lists all directors with declared interests', true), P('Board minute reference dated within 12 months', true), P('Signed declarations detected', false)],
  orgNote: 'Register reviewed at the March board meeting.',
  status: 'changes', verifierId: 'E', decidedOn: '2027-04-29',
  comment: 'Almost there — please add a signed declaration from each director. The register and board minute look good.',
  history: [
    { on: '2027-04-24', by: 'org', text: 'Submitted coi-register.pdf for verification' },
    { on: '2027-04-29', by: 'verifier', text: 'Changes requested: "Almost there — please add a signed declaration from each director."' },
  ],
};

// Kestrel's decided items (decision history). FM-01 was the first verified.
const DECIDED = [
  ['FM-01', '2027-03-29', 'E'], ['GC-03', '2027-04-01', 'v-jordan'], ['BD-01', '2027-04-05', 'E'],
  ['OH-01', '2027-04-08', 'v-jordan'], ['RP-01', '2027-04-12', 'E'], ['GC-04', '2027-04-14', 'E'],
  ['FM-07', '2027-04-19', 'v-jordan'], ['GC-05', '2027-04-21', 'E'], ['FM-03', '2027-04-26', 'E'], ['FM-02', '2027-04-28', 'E'],
].map(([reqId, decidedOn, verifierId]) => ({
  id: `rev-k-${reqId.toLowerCase().replace('-', '')}`, orgId: 'org-kestrel', reqId, submittedOn: decidedOn, type: 'in-place',
  fastTracked: false, evidenceIds: [], aiPrecheck: [], orgNote: '',
  status: 'verified', verifierId, decidedOn, comment: 'Verified — thank you, this meets the requirement.',
  history: [{ on: decidedOn, by: 'verifier', text: 'Verified' }],
}));

export const REVIEWS = [...QUEUE, GC02, ...DECIDED];

// Comment templates for verifiers: constructive, specific (§8.16)
export const COMMENT_TEMPLATES = {
  verified: ['Verified — thank you, this meets the requirement.', 'Verified — clear and complete evidence.'],
  changes: [
    'Almost there — please add …',
    'Almost there — the document needs to be dated within the last 12 months.',
    'Almost there — please include the board minute showing this was approved.',
  ],
};
