// Tier ladder: Foundation ─ Core ─ Advanced ─ Ready ─ Accredited
import { TIERS, TIER_ORDER } from '../../data/copy.js';
import { esc } from '../util.js';

export function tierLadder(current) {
  const idx = TIER_ORDER.indexOf(current);
  const items = TIER_ORDER.map((tier, i) => {
    const t = TIERS[tier];
    const state = i < idx ? 'is-past' : i === idx ? 'is-current' : '';
    return `
      <li class="tier-ladder__step ${state}" data-tier="${tier}"${i === idx ? ' aria-current="step"' : ''}>
        <span class="tier-ladder__node" aria-hidden="true"></span>
        <span class="tier-ladder__name">${esc(t.label)}</span>
        <span class="tier-ladder__band">${esc(t.band)}</span>
        ${i === idx ? '<span class="tier-ladder__you">Your tier</span>' : ''}
      </li>`;
  }).join('');
  return `<ol class="tier-ladder" aria-label="Tier ladder">${items}</ol>`;
}
