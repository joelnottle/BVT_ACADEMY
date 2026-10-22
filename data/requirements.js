/* PLACEHOLDER — replace with BVT question bank (BUILD_PLAN §14 Q1).
   One requirement per Check question. Titles and questions are realistic placeholders.
   Only FM-04, GC-01 and GC-02 are fully written (requirements-hero.js); the rest use the template below
   and carry `placeholder: true` so the UI can flag them. */
import { HERO } from './requirements-hero.js';

const MS = ['core-ms', 'core-ml']; // Micro–Small questions also appear in Medium–Large
const ML = ['core-ml'];            // the 15 extra Medium–Large questions

// [id, moduleId, title, question, effortHrs, checks, pathway?]
const ROWS = [
  // ---- Governance & Constitution ----
  ['GC-01', 'mod-constitution', 'Constitution on file', 'Do you have a current constitution or rules that reflect how your organisation operates?', 0.25, MS],
  ['GC-02', 'mod-conflicts', 'Conflict of interest register', "Do you keep a register of directors' conflicts of interest that the board reviews?", 1, MS],
  ['GC-03', 'mod-constitution', 'Registration details current with the regulator', 'Are your details with ASIC, the ACNC or your state regulator up to date?', 0.5, MS],
  ['GC-04', 'mod-conflicts', 'Code of conduct adopted', 'Has the board adopted a code of conduct for directors and staff?', 1.5, MS],
  ['GC-05', 'mod-conflicts', 'Related-party transactions policy', 'Do you have a policy for approving transactions with related parties?', 2, MS],
  ['GC-06', 'mod-policies', 'Policy register with review dates', 'Do you keep a register of your policies, with the date each is due for review?', 2, MS],
  ['GC-07', 'mod-constitution', 'Constitution reviewed in the last five years', 'Has your constitution been reviewed in the last five years?', 2, ML],
  ['GC-08', 'mod-policies', 'Whistleblower policy', 'Do you have a whistleblower policy that staff know how to use?', 2, ML],
  // ---- Board & Directors ----
  ['BD-01', 'mod-board', 'Director register current', 'Is your register of directors and officers complete and current?', 0.5, MS],
  ['BD-02', 'mod-board', 'Board charter or terms of reference', 'Does the board have a charter setting out its role and how it works?', 2, MS],
  ['BD-03', 'mod-board-capability', 'Director induction', 'Do new directors receive an induction covering their duties and the organisation?', 2, MS],
  ['BD-04', 'mod-board', 'Board meets at least quarterly with minutes', 'Does your board meet at least quarterly with recorded minutes?', 1, MS],
  ['BD-05', 'mod-board-capability', 'Board skills matrix', 'Have you mapped the skills on your board against what the organisation needs?', 2, MS],
  ['BD-06', 'mod-board-capability', 'Annual board performance review', 'Does the board review its own performance each year?', 2, ML],
  ['BD-07', 'mod-board-capability', 'Independent chair or director', 'Does the board include at least one independent director?', 1, ML],
  // ---- Financial Management ----
  ['FM-01', 'mod-fin-reporting', 'Accounts prepared by a qualified person', 'Are your accounts prepared or reviewed by a qualified bookkeeper or accountant?', 0.5, MS],
  ['FM-02', 'mod-fin-reporting', 'Monthly reconciliations completed', 'Are your bank accounts reconciled every month?', 1, MS],
  ['FM-03', 'mod-cashflow', 'Annual budget approved by the board', 'Does the board approve an annual budget before the year starts?', 3, MS],
  ['FM-04', 'mod-cashflow', 'Monthly cash flow forecast', 'Do you prepare a cash flow forecast at least monthly, looking 12 months ahead?', 3, MS],
  ['FM-05', 'mod-cashflow', 'Budget vs actual reviewed quarterly', 'Does the board compare actual results against the budget at least quarterly?', 2, MS],
  ['FM-06', 'mod-fin-reporting', 'Financial statements reviewed by the board', 'Does the board review and approve your annual financial statements?', 1, MS],
  ['FM-07', 'mod-controls', 'Two signatories on payments', 'Do payments need approval from two authorised people?', 1, MS],
  ['FM-08', 'mod-controls', 'Delegations of financial authority', 'Is there a written schedule of who can approve spending, and up to what amount?', 2, MS],
  ['FM-09', 'mod-controls', 'Fraud and misuse controls', 'Do you have controls to prevent and detect fraud and misuse of funds?', 3, MS],
  ['FM-10', 'mod-fin-reporting', 'Annual audit or independent review', 'Are your annual accounts audited or independently reviewed?', 1, ML],
  ['FM-11', 'mod-controls', 'Segregation of duties', 'Are financial duties split so no one person controls a transaction end to end?', 2, ML],
  ['FM-12', 'mod-controls', 'Asset register', 'Do you keep a register of significant assets?', 1.5, ML],
  // ---- Operations & HR ----
  ['OH-01', 'mod-people', 'Written employment contracts', 'Does every employee have a written employment contract?', 1, MS],
  ['OH-02', 'mod-people', 'Induction process', 'Do new staff and volunteers go through a documented induction?', 2, MS],
  ['OH-03', 'mod-people', 'Position descriptions', 'Does every role have a current position description?', 2, MS],
  ['OH-04', 'mod-whs', 'WHS policy and risk assessment', 'Do you have a work health and safety policy and a current risk assessment?', 3, MS],
  ['OH-05', 'mod-whs', 'Incident reporting register', 'Do you record and follow up workplace incidents and near misses?', 1.5, MS],
  ['OH-06', 'mod-operations', 'Key processes documented', 'Are your core operating processes written down so others can follow them?', 3, MS],
  ['OH-07', 'mod-operations', 'Insurance cover reviewed annually', 'Do you review your insurance cover each year against your risks?', 1, MS],
  ['OH-08', 'mod-operations', 'Supplier and contract register', 'Do you keep a register of key suppliers and contracts, with renewal dates?', 1.5, MS],
  ['OH-09', 'mod-people', 'Performance reviews', 'Do staff have a performance and development review each year?', 2, ML],
  ['OH-10', 'mod-whs', 'WHS consultation', 'Do you consult workers on health and safety matters?', 1.5, ML],
  ['OH-11', 'mod-operations', 'IT systems and access controls', 'Do you control who can access your systems, and remove access when people leave?', 2, ML],
  // ---- Risk & Continuity ----
  ['RC-01', 'mod-risk', 'Risk register', 'Do you maintain a register of your key risks and how you manage them?', 3, MS],
  ['RC-02', 'mod-continuity', 'Data backed up and tested', 'Is your important data backed up, and have you tested restoring it?', 1, MS],
  ['RC-03', 'mod-risk', 'Risk appetite statement', 'Has the board agreed how much risk the organisation is willing to take?', 2, MS],
  ['RC-04', 'mod-risk', 'Board reviews risk at least annually', 'Does the board review your key risks at least once a year?', 1, MS],
  ['RC-05', 'mod-continuity', 'Business continuity plan', 'Do you have a plan to keep operating through a major disruption?', 4, MS],
  ['RC-06', 'mod-continuity', 'Key person and succession plan', 'Have you planned for the loss of a key person, such as the CEO or finance lead?', 2, MS],
  ['RC-07', 'mod-continuity', 'Cyber security basics', 'Do you have basic cyber security in place, such as multi-factor sign-in and updates?', 2, MS],
  ['RC-08', 'mod-risk', 'Internal audit or assurance plan', 'Do you have a plan for checking that key controls work?', 2, ML],
  ['RC-09', 'mod-continuity', 'Crisis communications plan', 'Do you know who will say what, to whom, if something goes wrong?', 1.5, ML],
  // ---- Reporting & Compliance ----
  ['RP-01', 'mod-compliance', 'Annual return lodged on time', 'Was your last annual return or statement lodged on time?', 0.5, MS],
  ['RP-02', 'mod-compliance', 'Tax lodgements current', 'Are your BAS and other tax lodgements up to date?', 0.5, MS],
  ['RP-03', 'mod-compliance', 'Payroll obligations met', 'Are super, PAYG withholding and other payroll obligations paid on time?', 0.5, MS],
  ['RP-04', 'mod-compliance', 'Licences and registrations current', 'Are all the licences and registrations you need to operate current?', 0.5, MS],
  ['RP-05', 'mod-reporting', 'Annual report published', 'Do you publish an annual report for members and stakeholders?', 1, MS],
  ['RP-06', 'mod-reporting', 'Grant and funding acquittals on time', 'Are grant and funding acquittals submitted on time?', 1.5, MS],
  ['RP-07', 'mod-reporting', 'KPIs reported to the board', 'Does the board receive regular reports on key performance measures?', 2, MS],
  ['RP-08', 'mod-privacy', 'Privacy policy', 'Do you have a privacy policy covering how you handle personal information?', 1.5, MS],
  ['RP-09', 'mod-privacy', 'Records management', 'Do you know which records you must keep, and for how long?', 2, MS],
  ['RP-10', 'mod-privacy', 'Complaints handling process', 'Do you have a documented process for receiving and resolving complaints?', 1.5, MS],
  ['RP-11', 'mod-compliance', 'Compliance register', 'Do you keep a register of your legal and regulatory obligations?', 2, ML],
  ['RP-12', 'mod-reporting', 'Outcomes and impact reporting', 'Do you report on the outcomes and impact of your work?', 2, ML],
  ['RP-13', 'mod-privacy', 'Data breach response plan', 'Do you know what to do, and who to notify, if personal information is breached?', 1.5, ML],
  // ---- Start-up pathway (completed before Core unlocks, §8.8) ----
  ['SU-01', 'mod-su-setup', 'Business structure chosen and registered', 'Have you chosen your legal structure and registered your ABN and business name?', 1, [], 'startup'],
  ['SU-02', 'mod-su-setup', 'Business plan with 12-month goals', 'Do you have a simple business plan with goals for the next 12 months?', 3, [], 'startup'],
  ['SU-03', 'mod-su-setup', 'Licences and tax registrations identified', 'Have you identified the licences, permits and tax registrations you need?', 1.5, [], 'startup'],
  ['SU-04', 'mod-su-money', 'Separate business bank account', 'Do you keep business money in a separate business bank account?', 0.5, [], 'startup'],
  ['SU-05', 'mod-su-money', 'First-year budget', 'Do you have a budget for your first year of trading?', 2, [], 'startup'],
  ['SU-06', 'mod-su-money', 'Bookkeeping system set up', 'Do you record income and expenses in a bookkeeping system?', 2, [], 'startup'],
  ['SU-07', 'mod-su-money', 'Insurance needs reviewed', 'Have you checked which insurance your business needs?', 1, [], 'startup'],
];

const THEME = {
  GC: 'sound governance', BD: 'an effective board', FM: 'financial control',
  OH: 'well-run operations', RC: 'risk awareness and resilience', RP: 'reliable reporting and compliance',
  SU: 'a business that is set up properly',
};

/* PLACEHOLDER — replace with BVT question bank */
function template(title, prefix) {
  const thing = title.charAt(0).toLowerCase() + title.slice(1);
  const goodEvidence = [
    'The current document or record for this requirement',
    'Proof it is in use, such as a recent example or a board minute',
    'Approval by the board or owner, dated within the last 12 months',
  ];
  return {
    required: `Evidence that ${thing} is in place and current in your organisation.`,
    why: `Funders, lenders and procurement panels look for this as a sign of ${THEME[prefix]}.`,
    goodEvidence,
    commonReturns: ['The document is out of date or still a draft', 'No sign it is actually used'],
    checklist: ['Read what is required and what good evidence looks like', `Put ${thing} in place, or update it`, 'Have it approved by the board or owner', 'Gather the evidence to upload'],
    video: { title: `Why ${thing} matters`, mins: 5 },
    transcript: '',
    aliPrompts: ['What does good evidence look like for this?', 'Where do we start?', 'Explain this to my board in plain English'],
    placeholder: true,
  };
}

export const REQUIREMENTS = ROWS.map(([id, moduleId, title, question, effortHrs, checks, pathway = null]) => {
  const prefix = id.slice(0, 2);
  const detail = HERO[id] ? { ...HERO[id], placeholder: false } : template(title, prefix);
  return {
    id, moduleId, title, question, effortHrs, checks, pathway,
    domainId: pathway ? null : prefix,
    ...detail,
    criteria: detail.goodEvidence, // what the verifier checks (§8.16)
  };
});

export const REQ_BY_ID = Object.fromEntries(REQUIREMENTS.map((r) => [r.id, r]));

/** Requirements asked by a given Check, in order. */
export const reqsForCheck = (checkId) => REQUIREMENTS.filter((r) => r.checks.includes(checkId));
