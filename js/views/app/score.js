// #/app/score — My Check & Score: the free Check result the tier was set from, the area breakdown,
// every answer (read-only) and when a re-take happens. Tier is fixed at enrolment (§14 Q3 assumption).
import { TIERS } from '../../../data/copy.js';
import { CHECKS, ANSWER_SCALE } from '../../../data/checks.js';
import { DOMAINS } from '../../../data/domains.js';
import { esc, formatDate, addMonths } from '../../util.js';
import { icon } from '../../components/icon.js';
import { readinessRing, progressBar } from '../../components/progress.js';
import { tierBadge } from '../../components/chips.js';
import { coreReqs, isAccredited } from '../../selectors.js';

const LABEL = Object.fromEntries(ANSWER_SCALE.map((a) => [a.id, a.label]));

export function render(ctx) {
  const { state, org } = ctx;
  const answers = state.answers[org.id] ?? {};
  const reqs = coreReqs(org);
  const checkedOn = state.earned[org.id]?.['check-complete'];
  const retake = isAccredited(org)
    ? `Your re-assessment is due ${formatDate(addMonths(org.accreditedOn, 12))}, and includes a fresh Check.`
    : 'Your tier stays as set at enrolment. Readiness on your dashboard counts verified requirements. A fresh Check is part of re-assessment, 12 months after accreditation.';
  return `
    <div class="page score-page">
      <header class="page-header"><h1>My Check &amp; Score</h1><p class="lead">${esc(CHECKS[org.checkId]?.name ?? '')}${checkedOn ? ` · completed ${esc(formatDate(checkedOn))}` : ''}</p></header>
      <section class="card score-summary" aria-labelledby="sc-h">
        ${readinessRing({ verified: org.checkScore, total: 100, legend: false, label: 'pre-qualification met', description: `Check score: ${org.checkScore}% of pre-qualification met.` })}
        <div class="stack">
          <h2 class="h3" id="sc-h">${org.checkScore}% at enrolment</h2>
          <div class="cluster">${tierBadge(org.tier)}</div>
          <p class="text-2">${esc(retake)}</p>
        </div>
      </section>
      <section class="card stack" aria-labelledby="sc-area-h">
        <h2 class="h3" id="sc-area-h">By area</h2>
        ${DOMAINS.filter((d) => reqs.some((r) => r.domainId === d.id)).map((d) => {
          const own = reqs.filter((r) => r.domainId === d.id);
          const inPlace = own.filter((r) => answers[r.id] === 'in-place').length;
          return progressBar({ label: d.name, value: inPlace, max: own.length, countText: `${inPlace} of ${own.length} in place`, unit: 'in place' });
        }).join('')}
      </section>
      <section class="stack" aria-labelledby="sc-ans-h">
        <h2 class="h3" id="sc-ans-h">Your answers</h2>
        ${DOMAINS.filter((d) => reqs.some((r) => r.domainId === d.id)).map((d) => `
          <details class="card score-area"><summary><span>${esc(d.name)}</span>${icon('chevron-down')}</summary>
            <ul class="score-answers">${reqs.filter((r) => r.domainId === d.id).map((r) => `
              <li><span class="score-answers__q"><span class="dash-code">${esc(r.id)}</span> ${esc(r.question)}</span><span class="score-answers__a">${esc(LABEL[answers[r.id]] ?? 'Not answered')}</span></li>`).join('')}</ul>
          </details>`).join('')}
      </section>
    </div>`;
}
