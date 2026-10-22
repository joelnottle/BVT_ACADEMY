// Styleguide: chips, tier badges, header chips, cards, empty state, badge seals.
import { STATUS, REQ_TYPE, PACE, TIER_ORDER } from '../../../data/copy.js';
import { icon } from '../../components/icon.js';
import { statusChip, typeChip, reasonTag, pacePill, tierBadge, headerChip } from '../../components/chips.js';
import { emptyState, badgeSeal, milestoneCard } from '../../components/feedback.js';
import { section, pair, example } from './layout.js';

const chipsLight = `
  <div class="stack">
    ${example('Status (icon + label, every state)', `<div class="cluster">${Object.keys(STATUS).map(statusChip).join('')}</div>`)}
    ${example('Requirement type', `<div class="cluster">${Object.keys(REQ_TYPE).map(typeChip).join('')}</div>`)}
    ${example('Reason tags', `<div class="cluster">${reasonTag('quick-win')}${reasonTag('unblocks', { n: 3 })}${reasonTag('biggest-gap')}${reasonTag('continue')}${reasonTag('due-soon')}${reasonTag('changes')}</div>`)}
    ${example('Pace', `<div class="cluster">${Object.keys(PACE).map((p) => pacePill(p)).join('')}</div>`)}
    ${example('Tier badges', `<div class="cluster">${TIER_ORDER.map((t) => tierBadge(t)).join('')}</div>`)}
  </div>`;

const chipsDark = `
  <div class="stack">
    ${example('Header chips (portal frame)', `<div class="cluster">
      ${headerChip({ iconName: 'sparkles', label: 'Ali', value: '7.5 credits' })}
      ${headerChip({ iconName: 'users', label: '2 mentor sessions' })}
      ${pacePill('on-pace', { prefix: '219 days' })}</div>`)}
    ${example('Pace on dark', `<div class="cluster">${Object.keys(PACE).map((p) => pacePill(p)).join('')}</div>`)}
    ${example('Status chips keep their light tint on dark', `<div class="cluster">${statusChip('verified')}${statusChip('locked')}</div>`)}
  </div>`;

const cards = `
  <div class="sg-grid-3">
    <article class="card">
      <div class="cluster">${typeChip('not-yet')}${statusChip('learning')}</div>
      <h3 class="card__title">FM-04 · Monthly cash flow forecast</h3>
      <p class="card__meta">Financial Management · ~3h · Step: Do it</p>
      <div class="card__footer"><a class="btn btn--action" href="#/styleguide/cards">Continue ${icon('arrow-right')}</a></div>
    </article>
    <article class="card card--interactive">
      <div class="cluster">${reasonTag('quick-win')}${statusChip('evidence-needed')}</div>
      <h3 class="card__title"><a class="card__link" href="#/styleguide/cards">GC-01 · Constitution on file</a></h3>
      <p class="card__meta">Upload only · ~15 min. The whole card is one link.</p>
    </article>
    <article class="card card--dark">
      <span class="icon-tile">${icon('shield-check')}</span>
      <h3 class="card__title">Independent verification</h3>
      <p class="card__meta">Mentors help you implement. A separate team verifies.</p>
    </article>
    <article class="card card--flat">
      <span class="icon-tile">${icon('sparkles')}</span>
      <h3 class="card__title">Flat card</h3>
      <p class="card__meta">No shadow, for nesting inside panels.</p>
      <span class="placeholder-flag">${icon('triangle-alert')}Placeholder content</span>
    </article>
  </div>
  <div class="sg-grid-2">
    ${emptyState({ title: 'No evidence uploaded yet', text: 'Evidence you upload is kept here and can support more than one requirement.', action: '<a class="btn btn--outline" href="#/styleguide/cards">Go to quick wins</a>' })}
    ${emptyState({ title: 'Nothing in review', text: 'When you submit evidence, it shows here until a verifier responds.' })}
  </div>`;

const SEALS = [
  { name: 'Check complete', iconName: 'clipboard-check', earnedOn: '2027-03-01' },
  { name: 'Enrolled', iconName: 'flag', earnedOn: '2027-03-08' },
  { name: 'First requirement verified', iconName: 'badge-check', earnedOn: '2027-03-29' },
  { name: 'Financial Management complete', iconName: 'award' },
  { name: 'Accredited', iconName: 'shield-check' },
];
const seals = (dark) => `<div class="sg-seals">${SEALS.map((s) => badgeSeal(s)).join('')}</div>${dark ? '' : `
  <div class="sg-example"><p class="sg-example__label">Static milestone card (Closed step)</p>
  ${milestoneCard({ title: 'Milestone: First requirement verified', text: 'FM-04 verified — Financial Management is now 5 of 9. Next: GC-01, a quick win.' })}</div>`}`;

export const statusSections = () => [
  section('chips', 'Chips & tier badges', 'Status is always an icon plus a label, never colour alone. Pace is never red.', pair(chipsLight, chipsDark)),
  section('cards', 'Cards & empty states', 'Cards on light use a soft shadow; dark cards use a hairline. Empty states use the V motif.', cards),
  section('seals', 'Badge seals & milestones', 'Credential-style and static. No animation, no sound, no confetti.', pair(seals(false), seals(true))),
].join('');
