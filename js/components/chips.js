// Chips: status, requirement type, reason tag, pace pill, tier badge, header chip, filter chip.
// Status is always icon + label.
import { STATUS, REQ_TYPE, REASONS, PACE, TIERS } from '../../data/copy.js';
import { esc } from '../util.js';
import { icon } from './icon.js';

export function statusChip(status) {
  const s = STATUS[status] ?? STATUS['not-started'];
  return `<span class="chip chip--st-${s.tone}">${icon(s.icon)}${esc(s.label)}</span>`;
}

export function typeChip(type) {
  const t = REQ_TYPE[type] ?? REQ_TYPE['not-yet'];
  return `<span class="chip chip--type">${icon(t.icon)}${esc(t.label)}</span>`;
}

/** reasonTag('unblocks', { n: 3 }) → "Unblocks 3" */
export function reasonTag(reason, { n } = {}) {
  const r = REASONS[reason];
  if (!r) return '';
  return `<span class="chip chip--reason">${icon(r.icon)}${esc(r.label.replace('{n}', n ?? ''))}</span>`;
}

/** pacePill('on-pace', { prefix: '219 days' }) → "219 days · On pace" */
export function pacePill(pace, { prefix } = {}) {
  const p = PACE[pace] ?? PACE['on-pace'];
  const text = prefix ? `${prefix} · ${p.label}` : p.label;
  return `<span class="chip chip--pace" data-pace="${esc(pace)}">${icon(p.icon)}<span>${esc(text)}</span></span>`;
}

export function tierBadge(tier, { showMonths = true } = {}) {
  const t = TIERS[tier];
  if (!t) return '';
  const meta = showMonths && t.months ? `<span class="tier-badge__meta">· ${t.months} months</span>` : '';
  return `<span class="tier-badge" data-tier="${esc(tier)}"><span class="tier-badge__dot">${icon(t.icon)}</span>${esc(t.label)}${meta}</span>`;
}

/** Header chip on the dark frame. Renders a link if `href`, otherwise a button. */
export function headerChip({ iconName, label, value, href, attrs = '' }) {
  const inner = `${icon(iconName)}<span>${esc(label)}${value != null ? ` · <span class="header-chip__value">${esc(value)}</span>` : ''}</span>`;
  return href
    ? `<a class="header-chip" href="${esc(href)}" ${attrs}>${inner}</a>`
    : `<button type="button" class="header-chip" ${attrs}>${inner}</button>`;
}

export function filterChip(label, { pressed = false, value = '' } = {}) {
  return `<button type="button" class="chip chip--filter" aria-pressed="${pressed}" data-value="${esc(value)}">` +
    `<span class="chip__tick">${icon('check')}</span>${esc(label)}</button>`;
}
