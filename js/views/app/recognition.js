// #/app/recognition (§9): professional milestones as understated credential seals, and weekly momentum with
// a grace week. Static — no animation, no leaderboards, no negative copy. Share is for Accredited only.
import { RECOGNITION as R } from '../../../data/account.js';
import { esc, formatDate } from '../../util.js';
import { icon } from '../../components/icon.js';
import { badgeSeal } from '../../components/feedback.js';
import { showToast } from '../../components/toast.js';
import { earnedBadges, isAccredited } from '../../selectors.js';
import { momentumWeeks } from '../../accountSelectors.js';

export function render(ctx) {
  const { state, org, persona, today } = ctx;
  const badges = earnedBadges(state, org);
  const earned = badges.filter((b) => b.earnedOn).sort((a, b) => b.earnedOn.localeCompare(a.earnedOn));
  const toCome = badges.filter((b) => !b.earnedOn);
  const weeks = momentumWeeks(org, today);
  const grace = org.momentum?.graceUsedOn;
  return `
    <div class="page recognition-page">
      <header class="page-header">
        <h1>Profile &amp; recognition</h1>
        <p class="lead">${esc(R.lead)}</p>
        <p class="text-2">${icon('user')} ${esc(persona.name)}${persona.title ? `, ${esc(persona.title)}` : ''} · ${esc(org.name)}</p>
      </header>
      <section class="card stack" aria-labelledby="ms-h">
        <div class="dash-row"><h2 class="h3" id="ms-h">${esc(R.milestones)}</h2><span class="text-2">${esc(R.earnedOf(earned.length, badges.length))}</span></div>
        <ul class="seal-grid">${[...earned, ...toCome].map((b) => `<li>${badgeSeal({ name: b.name, iconName: b.icon, earnedOn: b.earnedOn })}
          ${b.id === 'accredited' && b.earnedOn && isAccredited(org) ? `<button type="button" class="link-btn seal-share" data-share>${icon('share-2')}${esc(R.share)}</button>` : ''}</li>`).join('')}</ul>
      </section>
      <section class="card stack" aria-labelledby="mo-h">
        <h2 class="h3" id="mo-h">${esc(R.momentum)}</h2>
        <p class="dash-big">${icon('calendar-check')}${esc(R.activeWeeks(org.momentum?.activeWeeks ?? 0))}</p>
        <ol class="week-strip" aria-label="The last 12 weeks">
          ${weeks.map((w) => `<li class="week-strip__wk${w.active ? ' is-active' : ''}"><span class="sr-only">Week of ${esc(formatDate(w.weekOf))}: ${w.active ? 'active' : 'no activity'}</span></li>`).join('')}
        </ol>
        <p class="text-2">${esc(R.momentumWhat)}</p>
        <p class="callout">${icon('shield-check')}<span>${esc(R.grace)} <strong>${esc(grace ? R.graceUsed(formatDate(grace)) : R.graceAvailable)}</strong></span></p>
      </section>
    </div>`;
}

export function bind(root) {
  root.querySelector('[data-share]')?.addEventListener('click', () => showToast(R.shareToast, { text: R.shareText, iconName: 'share-2' }));
}
