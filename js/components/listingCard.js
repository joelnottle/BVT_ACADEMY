// BVT Connect listing card (§8.13). Used on the home teaser now, the directory in Phase 13.
import { esc } from '../util.js';
import { icon } from './icon.js';

export function listingCard(l, { compact = false } = {}) {
  const status = l.status === 'expired'
    ? `<span class="chip chip--st-locked">${icon('clock')}Certificate expired</span>`
    : `<span class="chip chip--st-verified">${icon('badge-check')}BVT Accredited</span>`;
  return `
    <article class="listing${compact ? ' listing--compact' : ''} card--interactive">
      <div class="listing__main">
        <h3 class="listing__name"><a class="card__link" href="#/connect/${esc(l.id)}">${esc(l.name)}</a></h3>
        <p class="listing__meta">${esc(l.industry)} · ${esc(l.city)} ${esc(l.state)} · ${esc(l.size)}</p>
      </div>
      <div class="listing__status">${status}${compact ? '' : `<span class="listing__cert">${esc(l.certNo)}</span>`}</div>
    </article>`;
}
