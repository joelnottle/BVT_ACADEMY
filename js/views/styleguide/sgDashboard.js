// Styleguide: dashboard widgets (Phase 6) — focus card, attention rows (every tone), recommended rows,
// area tiles with verified + hatched claimed, recent list, Ask Ali bar and the bell's unread badge.
import { icon } from '../../components/icon.js';
import { focusCard, attentionCard, recommendedCard, areasCard, recentCard, aliBar } from '../app/dashboardWidgets.js';
import { section, example } from './layout.js';

const FOCUS = { mode: 'resume', reqId: 'FM-04', title: 'Monthly cash flow forecast', stepNumber: 4, stepLabel: 'Do it', checklist: { done: 2, total: 4 }, href: '#/styleguide/dashboard', lastActivity: { on: '2027-05-01', text: 'Do it checklist updated' } };
const ATTENTION = [
  { icon: 'pencil-line', text: 'Almost there: GC-02 needs one more thing', href: '#/styleguide/dashboard', tone: 'changes' },
  { icon: 'file-up', text: '9 in-place items need evidence', href: '#/styleguide/dashboard', tone: 'evidence' },
  { icon: 'hourglass', text: '1 item is with a verifier', href: '#/styleguide/dashboard', tone: 'review' },
  { icon: 'route', text: 'Start-up pathway: 4 of 7 verified', href: '#/styleguide/dashboard', tone: 'learning' },
  { icon: 'calendar-days', text: 'Mentor session Thu 10:00 · Cash flow forecasting', meta: 'Marcus Hale', href: '#/styleguide/dashboard', tone: 'neutral' },
];
const RECS = [
  { reason: 'quick-win', code: 'GC-01', title: 'Constitution on file', meta: 'Upload only · ~15 min', href: '#/styleguide/dashboard' },
  { reason: 'unblocks', n: 3, code: 'Module', title: 'Cash flow & budgeting', meta: 'Shared learning for 3 requirements', href: '#/styleguide/dashboard' },
  { reason: 'biggest-gap', code: 'RC-01', title: 'Risk register', meta: 'Start with a 5-min video · Risk & Continuity', href: '#/styleguide/dashboard' },
];
const AREAS = [
  { id: 'GC', name: 'Governance & Constitution', verified: 3, claimed: 1, total: 6 },
  { id: 'FM', name: 'Financial Management', verified: 4, claimed: 0, total: 9 },
  { id: 'RC', name: 'Risk & Continuity', verified: 0, claimed: 1, total: 7 },
];
const RECENT = [
  { on: '2027-04-28', icon: 'circle-check', text: 'FM-02 verified — Financial Management is now 4 of 9', href: '#/styleguide/dashboard' },
  { on: '2027-03-29', icon: 'award', text: 'Milestone: First requirement verified', href: '#/styleguide/dashboard' },
];

export const dashboardSection = () => section('dashboard', 'Dashboard widgets', 'Every widget links somewhere specific. Attention rows are icon + label, never colour alone.', `
  <div class="dash-page stack stack-lg">
    ${example('Resume (the one warm focal point)', focusCard(FOCUS, {}))}
    <div class="sg-grid-2">
      ${example('Needs your attention — all tones', attentionCard(ATTENTION))}
      ${example('Recent', recentCard(RECENT))}
    </div>
    ${example('Recommended next, with reason tags', recommendedCard(RECS))}
    <div class="sg-grid-2">
      ${example('Area tiles (verified solid, in place hatched)', areasCard(AREAS, false))}
      ${example('Area tiles, locked behind a pathway', areasCard(AREAS.slice(0, 2), true).replaceAll('dash-areas-h', 'dash-areas-locked-h'))}
    </div>
    ${example('Ask Ali bar', aliBar(RECS.map((r) => ({ ...r, reqId: r.code === 'Module' ? null : r.code }))))}
    ${example('Bell with unread count (on the header)', `<div class="sg-panel on-dark"><a class="btn btn--on-dark-ghost btn--icon bell" href="#/styleguide/dashboard" aria-label="Notifications, 3 unread">${icon('bell')}<span class="bell__count" aria-hidden="true">3</span></a></div>`)}
  </div>`);
