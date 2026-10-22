// #/check/results — score ring, tier and time limit, in place vs to build, area bars, pretend PDF,
// where-to-start preview and the Enrol call to action (§8.2).
import { RESULTS } from '../../../data/checkFlow.js';
import { TIERS } from '../../../data/copy.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { flowSteps } from '../../components/flowSteps.js';
import { readinessRing, progressBar } from '../../components/progress.js';
import { tierBadge } from '../../components/chips.js';
import { milestoneCard, emptyState } from '../../components/feedback.js';
import { accentText } from '../../components/marketing.js';
import { showToast } from '../../components/toast.js';
import { checkResults } from '../../checkSelectors.js';

function empty() {
  return `
    <div class="container check-flow">
      <h1 class="sr-only">Your results</h1>
      ${emptyState({ title: 'No results yet', text: 'Take the free check to see your score, tier and what to build.', action: '<a class="btn btn--action" href="#/sign-up">Start your free check</a>' })}
    </div>`;
}

function startCards(r) {
  const s = RESULTS.start;
  return `
    <section class="card stack" aria-labelledby="start-h">
      <h2 class="h3 rule" id="start-h">${accentText(s.title)}</h2>
      <ul class="grid-3 start-cards">
        ${s.cards.map((card) => `
          <li class="start-card${card.recommended ? ' is-recommended' : ''}">
            ${card.recommended ? '<p class="eyebrow">Recommended</p>' : ''}
            <h3 class="card__title">${esc(card.title)}</h3>
            <p class="card__meta">${esc(card.id === 'quick-wins' ? card.text(r.inPlace) : card.id === 'biggest-gaps' ? card.text(r.biggestGap.name) : card.text())}</p>
          </li>`).join('')}
      </ul>
      <p class="text-3">You’ll choose in onboarding, and you can change your mind any time.</p>
    </section>`;
}

function enrolBand(r) {
  if (!r.check.enrols) {
    return `
      <section class="enrol-band" aria-labelledby="enrol-h">
        <div><h2 class="h3" id="enrol-h">Ready for the Academy?</h2><p>This check is standalone. Take a Core check to enrol and work towards accreditation.</p></div>
        <a class="btn btn--light" href="#/check/choose">Choose a Core check${icon('arrow-right')}</a>
      </section>`;
  }
  const t = TIERS[r.tier];
  return `
    <section class="enrol-band" aria-labelledby="enrol-h">
      <div>
        <h2 class="h3" id="enrol-h">${esc(RESULTS.enrol.title(t.label))}</h2>
        <p>${esc(RESULTS.enrol.detail(t.months))}</p>
      </div>
      <a class="btn btn--light" href="#/enrol">${esc(RESULTS.enrol.action)}${icon('arrow-right')}</a>
    </section>`;
}

export function render(ctx) {
  const c = ctx.state.check;
  if (!c?.checkId || !Object.keys(c.answers ?? {}).length) return empty();
  const r = checkResults(c);
  const t = TIERS[r.tier];
  const unfinished = r.answered < r.total;

  return `
    <div class="results">
      <section class="results-hero on-dark" aria-labelledby="results-h">
        <div class="container results-hero__inner">
          ${readinessRing({ verified: r.score, total: 100, legend: false, label: 'pre-qualification met', description: `Score: ${r.score}% of pre-qualification met.` })}
          <div class="stack">
            <p class="eyebrow">${esc(RESULTS.eyebrow)} · ${esc(c.orgName)}</p>
            <h1 class="h1" id="results-h">You’re in the <span class="accent">${esc(t.label)}</span> tier</h1>
            <div class="cluster">${tierBadge(r.tier, { showMonths: false })}<span class="chip chip--pace">${icon('calendar-clock')}<span>${t.months} months to complete</span></span></div>
            <p class="lead">${esc(RESULTS.clock)}</p>
          </div>
        </div>
      </section>

      <div class="container results__body">
        ${flowSteps(3)}
        ${unfinished ? `<p class="callout">${icon('info')}<span>You’ve answered ${r.answered} of ${r.total} questions, so unanswered ones count as “not yet”. <a href="#/check/run/${esc(c.checkId)}">Finish the check</a> for an accurate score.</span></p>` : ''}

        <div class="grid-2">
          <article class="card card--highlight result-count">
            <p class="result-count__n">${r.inPlace}</p>
            <h2 class="card__title">${esc(RESULTS.inPlace.title)}</h2>
            <p class="card__meta">${esc(RESULTS.inPlace.text)}</p>
          </article>
          <article class="card result-count">
            <p class="result-count__n">${r.toBuild}</p>
            <h2 class="card__title">${esc(RESULTS.toBuild.title)}</h2>
            <p class="card__meta">${esc(RESULTS.toBuild.text)}</p>
          </article>
        </div>

        <section class="card stack" aria-labelledby="areas-h">
          <h2 class="h3" id="areas-h">By area</h2>
          <div class="stack">
            ${r.byArea.map((a) => progressBar({ label: a.name, value: a.inPlace, max: a.total, countText: `${a.inPlace} of ${a.total} in place`, unit: 'in place' })).join('')}
          </div>
          <p><button class="link-btn" type="button" data-pdf>${icon('file-down')}Download question-by-question report (PDF)</button></p>
        </section>

        ${milestoneCard({ title: 'Milestone: Check complete', text: `${c.orgName} has a baseline. ${r.inPlace} requirements are already in place.`, iconName: 'clipboard-check' })}
        ${r.check.enrols ? startCards(r) : ''}
        ${enrolBand(r)}
      </div>
    </div>`;
}

export function bind(root) {
  root.querySelector('[data-pdf]')?.addEventListener('click', () => {
    showToast('Report ready (pretend)', { text: 'In the real product this downloads a PDF of every answer. Nothing was downloaded.', iconName: 'file-down' });
  });
}
