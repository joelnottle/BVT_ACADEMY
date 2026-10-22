// Enrolment package summary (§8.3): tier, time limit, pathway, requirements, credits, verification, price.
// Returns the card's inner HTML so the enrol page can refresh it when the screening answers change.
import { TIERS } from '../../data/copy.js';
import { PATHWAYS } from '../../data/pathways.js';
import { ENROL } from '../../data/enrolment.js';
import { esc, formatDate } from '../util.js';
import { icon } from './icon.js';
import { tierBadge } from './chips.js';

const row = (iconName, term, value, meta) => `
  <div class="pkg__row">
    <dt>${icon(iconName)}${esc(term)}</dt>
    <dd><strong>${esc(value)}</strong>${meta ? `<span>${esc(meta)}</span>` : ''}</dd>
  </div>`;

/** offer: from enrolmentOffer(); startsOn/endsOn: ISO dates. `headingId` labels the card. */
export function packageCard(offer, { startsOn, endsOn, headingId = 'package-h' }) {
  const { tier, months, total, inPlace, pathway, pathwaySteps, credits, price } = offer;
  return `
    <p class="eyebrow">Your package</p>
    <div class="pkg__head">
      <h2 class="h3" id="${esc(headingId)}">${esc(TIERS[tier].label)} package</h2>
      ${tierBadge(tier, { showMonths: false })}
    </div>
    <dl class="pkg__list">
      ${row('calendar-range', 'Time limit', `${months} months`, `${formatDate(startsOn)} to ${formatDate(endsOn)}`)}
      ${pathway ? row('route', 'Pathway first', PATHWAYS[pathway].title, pathwaySteps ? `${pathwaySteps} foundations before Core` : 'Content to come') : ''}
      ${row('list-checks', 'Requirements', String(total), `${inPlace} already in place`)}
      ${row('sparkles', 'Ask Ali', `${credits.ali} credits`, '1 credit ≈ 1 hour of typical use')}
      ${row('users', 'Mentor sessions', `${credits.mentor} included`, 'One-to-one with a BVT mentor')}
      ${row('shield-check', 'Verification', 'Included', 'By an independent BVT team')}
    </dl>
    <div class="pkg__price"><span>Price</span><strong>${esc(price ?? ENROL.price)}</strong></div>
    <p class="placeholder-flag">${icon('triangle-alert')}${esc(ENROL.placeholderNote)}</p>`;
}
