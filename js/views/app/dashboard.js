// #/app/dashboard — how close you are to accreditation, and what to do next (BUILD_PLAN §8.4).
// Source order is the phone order (focus, attention, readiness, recommended, …); the grid rearranges it.
import { DASHBOARD as D } from '../../../data/dashboard.js';
import { TIERS } from '../../../data/copy.js';
import { esc, formatDate } from '../../util.js';
import {
  verifiedReadiness, paceStatus, recommendedNext, domainProgress, isAccredited, coreLocked, pathwayProgress,
} from '../../selectors.js';
import { focusItem, attentionItems, recentItems, recommendedRows } from '../../dashboardSelectors.js';
import {
  focusCard, attentionCard, readinessCard, paceCard, ladderCard, recommendedCard, areasCard, weekCard, recentCard, aliBar, lockedBanner,
} from './dashboardWidgets.js';

export function render(ctx) {
  const { state, org, persona, today } = ctx;
  const locked = coreLocked(state, org);
  const accredited = isAccredited(org);
  const focus = focusItem(state, org);
  const recs = recommendedNext(state, org, today, { exclude: ['changes'], skipIds: focus ? [focus.reqId] : [] });
  const firstName = persona.name.split(' ')[0];
  const sub = accredited
    ? `${org.name} · Accredited ${formatDate(org.accreditedOn)}`
    : `${org.name} · ${TIERS[org.tier].label} tier · finish by ${formatDate(org.endsOn)}`;

  return `
    <div class="page dash-page">
      <header class="page-header">
        <h1>${esc(D.greeting(new Date().getHours(), firstName))}</h1>
        <p class="text-2">${esc(sub)}</p>
      </header>
      ${locked ? lockedBanner(org, pathwayProgress(state, org)) : ''}
      <div class="dash">
        ${focusCard(focus, ctx)}
        ${attentionCard(attentionItems(state, org, today))}
        ${readinessCard(verifiedReadiness(state, org), locked)}
        ${recommendedCard(recommendedRows(recs))}
        ${paceCard(paceStatus(state, org, today), org)}
        ${ladderCard(accredited ? 'accredited' : org.tier)}
        ${areasCard(domainProgress(state, org).filter((d) => d.total), locked)}
        ${weekCard(org)}
        ${recentCard(recentItems(state, org))}
        ${aliBar(recs)}
      </div>
    </div>`;
}
