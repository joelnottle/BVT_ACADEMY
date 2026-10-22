// Styleguide: Academy components (Phase 7) — requirement rows, board cards, module card, learning items,
// and the breadcrumb. Filter chips and the segmented control are in "Segmented, filters & tabs".
import { reqRow, boardCard } from '../../components/reqRow.js';
import { icon } from '../../components/icon.js';
import { moduleCard } from '../app/moduleCard.js';
import { section, example } from './layout.js';

const H = '#/styleguide/academy';
const ROWS = [
  { id: 'GC-01', title: 'Constitution on file', type: 'in-place', status: 'evidence-needed', effortHrs: 0.25, areaName: 'Governance & Constitution', href: H, tag: { reason: 'quick-win' }, lastActivity: null },
  { id: 'GC-02', title: 'Conflict of interest register', type: 'in-place', status: 'changes', effortHrs: 1, areaName: 'Governance & Constitution', href: H, tag: { reason: 'changes' }, lastActivity: { on: '2027-04-29', text: 'Changes requested by the verifier' } },
  { id: 'FM-04', title: 'Monthly cash flow forecast', type: 'not-yet', status: 'learning', effortHrs: 3, areaName: 'Financial Management', href: H, tag: { reason: 'continue' }, lastActivity: { on: '2027-05-01', text: 'Do it checklist updated' } },
  { id: 'RC-01', title: 'Risk register', type: 'not-yet', status: 'locked', effortHrs: 3, areaName: 'Risk & Continuity', href: H, tag: null, lastActivity: null },
];
const MODULE = {
  id: 'mod-cashflow', domainId: 'FM', title: 'Cash flow & budgeting', areaName: 'Financial Management', videos: [{}, {}, {}], videoMins: 27, reqIds: ['FM-03', 'FM-04', 'FM-05'],
  progress: { learningPct: 60, verified: 1, total: 3 }, locked: false, placeholder: false,
};

export const academySection = () => section('academy', 'Academy components', 'Rows and cards used by the three lenses and the module page. Every status is icon + label.', `
  <div class="stack stack-lg">
    ${example('Requirement rows (type, status, effort)', `<ul class="req-list">${ROWS.map((x) => reqRow(x, { showArea: true })).join('')}</ul>`)}
    ${example('Board cards (reason tag, last activity)', `<ul class="board-col__list sg-board">${ROWS.slice(0, 3).map(boardCard).join('')}</ul>`)}
    <div class="sg-grid-2">
      ${example('Module card', `<ul class="module-grid">${moduleCard(MODULE)}</ul>`)}
      ${example('Learning items (to do · done)', `<ul class="learn-list">
        <li class="learn-item"><span class="learn-item__icon">${icon('play')}</span><span class="learn-item__text"><span class="learn-item__title">Budget vs actual: reading the gaps</span><span class="learn-item__meta">9 min · captions and transcript</span></span><button type="button" class="btn btn--outline">Mark as watched</button></li>
        <li class="learn-item is-done"><span class="learn-item__icon">${icon('circle-check')}</span><span class="learn-item__text"><span class="learn-item__title">Cash flow forecast template</span><span class="learn-item__meta">XLSX</span></span><span class="chip chip--st-verified">${icon('check')}Downloaded</span></li>
      </ul>`)}
    </div>
    ${example('Breadcrumb', `<nav class="breadcrumb" aria-label="Example breadcrumb"><ol><li><a href="${H}">Academy · By topic</a></li><li><a href="${H}">Financial Management</a></li><li><span aria-current="page">Cash flow &amp; budgeting</span></li></ol></nav>`)}
  </div>`);
