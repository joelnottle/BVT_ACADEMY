// Progress bar and the two-layer readiness ring (§8.4: solid = verified, hatched = claimed in place).
import { esc, uid, clamp } from '../util.js';

const pct = (n, total) => (total ? clamp((n / total) * 100, 0, 100) : 0);

/** Labelled progress row. `claimed` adds a hatched segment after the verified fill. */
export function progressBar({ label, value, max, claimed = 0, countText, unit = 'verified' }) {
  const count = countText ?? `${value}/${max}`;
  const valueText = `${value} of ${max} ${unit}${claimed ? `, ${claimed} more in place awaiting evidence` : ''}`;
  return `
    <div class="progress-row">
      <span class="progress-row__label">${esc(label)}</span>
      <span class="progress-row__count">${esc(count)}</span>
      <div class="progress" role="progressbar" aria-label="${esc(label)}"
           aria-valuemin="0" aria-valuemax="${max}" aria-valuenow="${value}" aria-valuetext="${esc(valueText)}">
        <div class="progress__fill" style="width:${pct(value, max)}%"></div>
        ${claimed ? `<div class="progress__fill progress__fill--claimed" style="width:${pct(claimed, max)}%"></div>` : ''}
      </div>
    </div>`;
}

/**
 * Readiness ring.
 * @param {{verified:number, claimed?:number, total:number, size?:'lg'|'sm', legend?:boolean}} o
 */
export function readinessRing({ verified, claimed = 0, total, size = 'lg', legend = true }) {
  const id = uid('ring');
  const v = pct(verified, total);
  const c = pct(claimed, total);
  const shown = Math.round(v);
  const stroke = size === 'sm' ? 14 : 11;
  const desc = `${shown}% verified (${verified} of ${total} requirements).` +
    (claimed ? ` A further ${claimed} are in place and awaiting evidence.` : '');

  return `
    <div class="ring${size === 'sm' ? ' ring--sm' : ''}">
      <div class="ring__figure">
        <svg class="ring__svg" viewBox="0 0 100 100" role="img" aria-labelledby="${id}-t">
          <title id="${id}-t">${esc(desc)}</title>
          <defs>
            <linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" class="ring__stop-a"></stop><stop offset="1" class="ring__stop-b"></stop>
            </linearGradient>
            <pattern id="${id}-h" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="1" y1="0" x2="1" y2="4" class="ring__hatch-line" stroke-width="1.6"></line>
            </pattern>
          </defs>
          <circle class="ring__track" cx="50" cy="50" r="42" fill="none" stroke-width="${stroke}"></circle>
          ${c ? `<circle class="ring__claimed" cx="50" cy="50" r="42" fill="none" stroke="url(#${id}-h)" stroke-width="${stroke}"
                  pathLength="100" stroke-dasharray="0 ${v} ${c} 100"></circle>` : ''}
          <circle cx="50" cy="50" r="42" fill="none" stroke="url(#${id}-g)" stroke-width="${stroke}"
                  pathLength="100" stroke-dasharray="${v} 100"></circle>
        </svg>
        <div class="ring__center" aria-hidden="true">
          <span class="ring__value">${shown}%</span>
          <span class="ring__label">verified</span>
        </div>
      </div>
      ${legend && size !== 'sm' ? `
        <div class="ring__legend" aria-hidden="true">
          <span class="ring__key"><span class="ring__swatch ring__swatch--verified"></span>Verified ${verified}</span>
          ${claimed ? `<span class="ring__key"><span class="ring__swatch ring__swatch--claimed"></span>In place, awaiting evidence ${claimed}</span>` : ''}
        </div>` : ''}
    </div>`;
}
