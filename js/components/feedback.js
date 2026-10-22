// Empty state, badge seal and static milestone card (§8.20, §9). No animation, ever.
import { esc, formatDate } from '../util.js';
import { icon } from './icon.js';
import { vMark } from './brand.js';

/** emptyState({ title, text, action: '<a class="btn …">…</a>' }) — action is trusted HTML. */
export function emptyState({ title, text, action = '' }) {
  return `
    <div class="empty">
      ${vMark({ className: 'empty__mark' })}
      <p class="empty__title">${esc(title)}</p>
      ${text ? `<p class="empty__text">${esc(text)}</p>` : ''}
      ${action}
    </div>`;
}

/** Credential-style seal. Earned when `earnedOn` is set; muted outline otherwise. */
export function badgeSeal({ name, iconName, earnedOn }) {
  const earned = Boolean(earnedOn);
  return `
    <figure class="seal seal--${earned ? 'earned' : 'unearned'}">
      <span class="seal__disc">${icon(iconName)}</span>
      <figcaption>
        <span class="seal__name">${esc(name)}</span><br>
        <span class="seal__state">${earned ? `Earned ${esc(formatDate(earnedOn))}` : 'Not yet earned'}</span>
      </figcaption>
    </figure>`;
}

/** Static milestone card shown on the Closed step or the recognition page. */
export function milestoneCard({ title, text, iconName = 'award' }) {
  return `
    <div class="milestone">
      <span class="seal seal--earned"><span class="seal__disc">${icon(iconName)}</span></span>
      <div>
        <p class="milestone__title">${esc(title)}</p>
        ${text ? `<p class="milestone__text">${esc(text)}</p>` : ''}
      </div>
    </div>`;
}
