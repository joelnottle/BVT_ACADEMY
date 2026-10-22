/* PLACEHOLDER — replace with BVT question bank and learning content.
   Topic modules: learning is shared across 2–5 related requirements; implementation and evidence
   stay tailored per requirement (BUILD_PLAN §2, §8.6). Only "Cash flow & budgeting" is fully written. */
import { REQUIREMENTS } from './requirements.js';

const idsFor = (moduleId) => REQUIREMENTS.filter((r) => r.moduleId === moduleId).map((r) => r.id);

/* PLACEHOLDER — templated learning items */
function learning(id, title) {
  const t = title.charAt(0).toLowerCase() + title.slice(1);
  return {
    videos: [
      { id: `${id}-v1`, title: `Why ${t} matters`, mins: 6 },
      { id: `${id}-v2`, title: `Putting ${t} in place`, mins: 11 },
    ],
    sessions: [{ id: `${id}-s1`, title: `${title}: recorded topic session`, mins: 40 }],
    templates: [{ id: `${id}-t1`, title: `${title} starter template`, format: 'DOCX' }],
    placeholder: true,
  };
}

const M = (id, domainId, title, intro, extra = null) => ({
  id, domainId, title, intro,
  requirementIds: idsFor(id),
  ...(extra ?? learning(id, title)),
});

export const MODULES = [
  M('mod-constitution', 'GC', 'Constitution & legal structure', 'Make sure your founding documents and registrations match how you actually operate.'),
  M('mod-conflicts', 'GC', 'Conflicts & ethics', 'Declare, record and manage conflicts so decisions are made in the organisation’s interest.'),
  M('mod-policies', 'GC', 'Policy framework', 'Keep a small set of current policies, each with an owner and a review date.'),
  M('mod-board', 'BD', 'Board structure & meetings', 'How your board is set up, how often it meets and how decisions are recorded.'),
  M('mod-board-capability', 'BD', 'Board capability', 'Induct directors well, know the skills you have and the ones you need.'),
  M('mod-fin-reporting', 'FM', 'Financial reporting', 'Accurate books, monthly reconciliations and statements the board actually reviews.'),
  M('mod-cashflow', 'FM', 'Cash flow & budgeting', 'Plan the money before it moves: an approved budget, a rolling 12-month forecast, and a quarterly look at what actually happened.', {
    videos: [
      { id: 'v-cf-1', title: 'Why cash flow forecasting matters', mins: 6 },
      { id: 'v-cf-2', title: 'Building a 12-month forecast, step by step', mins: 12 },
      { id: 'v-cf-3', title: 'Budget vs actual: reading the gaps', mins: 9 },
    ],
    sessions: [
      { id: 's-cf-1', title: 'Cash flow for community organisations (recorded session)', mins: 45 },
      { id: 's-cf-2', title: 'Presenting the budget to your board (recorded session)', mins: 30 },
    ],
    templates: [
      { id: 't-cf-1', title: 'Cash flow forecast template', format: 'XLSX' },
      { id: 't-cf-2', title: 'Annual budget template', format: 'XLSX' },
      { id: 't-cf-3', title: 'Budget vs actual board report', format: 'DOCX' },
    ],
    placeholder: false,
  }),
  M('mod-controls', 'FM', 'Banking & financial controls', 'Simple controls that protect your money: approvals, delegations and checks.'),
  M('mod-people', 'OH', 'People & HR', 'Contracts, inductions and role clarity for staff and volunteers.'),
  M('mod-whs', 'OH', 'Work health & safety', 'Your WHS duties, a current risk assessment and a way to learn from incidents.'),
  M('mod-operations', 'OH', 'Operations & suppliers', 'Documented processes, the right insurance and a handle on your contracts.'),
  M('mod-risk', 'RC', 'Risk management', 'Name your key risks, decide how much risk you accept and review it with the board.'),
  M('mod-continuity', 'RC', 'Business continuity', 'Keep operating through disruption: backups, continuity plans and key-person cover.'),
  M('mod-compliance', 'RP', 'Regulatory compliance', 'Lodgements, payroll obligations and licences — on time, every time.'),
  M('mod-reporting', 'RP', 'Reporting to stakeholders', 'Report clearly to your board, members and funders.'),
  M('mod-privacy', 'RP', 'Privacy & records', 'Handle personal information well, keep the right records and resolve complaints.'),
  // Start-up pathway
  M('mod-su-setup', null, 'Setting up properly', 'The structure, plan and registrations a new business needs from day one.'),
  M('mod-su-money', null, 'Money basics', 'Separate accounts, a first-year budget, bookkeeping and the right insurance.'),
];

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m]));
