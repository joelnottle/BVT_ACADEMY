// #/check/choose — recommend a Check from staff count, ORIC and debt answers; the others stay selectable (§8.2).
import { CHECKS } from '../../../data/checks.js';
import { RECOMMEND } from '../../../data/checkFlow.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { flowSteps } from '../../components/flowSteps.js';
import { emptyState } from '../../components/feedback.js';
import { navigate } from '../../router.js';
import { chooseCheck } from '../../store.js';
import { recommendChecks } from '../../checkSelectors.js';

export function render(ctx) {
  const c = ctx.state.check;
  if (!c?.orgName) {
    return `<div class="container check-flow">${flowSteps(1)}
      <h1 class="sr-only">Choose a check</h1>
      ${emptyState({ title: 'Start with your details', text: 'We need a few details about your organisation to recommend a check.', action: '<a class="btn btn--action" href="#/check/start">Add your details</a>' })}</div>`;
  }
  const rec = recommendChecks(c);
  const selected = c.checkId ?? c.preselect ?? rec.recommended;
  const order = [rec.recommended, ...rec.also, ...Object.keys(CHECKS).filter((id) => id !== rec.recommended && !rec.also.includes(id))];
  return `
    <div class="container check-flow">
      ${flowSteps(1)}
      <header class="stack stack-sm">
        <h1 class="h2 rule">We recommend the <span class="accent">${esc(CHECKS[rec.recommended].short)}</span> check</h1>
        <p class="lead">For ${esc(c.orgName)}. You can choose a different check if it suits you better.</p>
      </header>
      <form class="stack" data-choose>
        <fieldset class="fieldset">
          <legend class="sr-only">Choose a check</legend>
          <div class="choose-grid">
            ${order.map((id) => {
              const ch = CHECKS[id];
              const isRec = id === rec.recommended;
              const isAlso = rec.also.includes(id);
              return `
                <label class="option choose-card${isRec ? ' is-recommended' : ''}">
                  <input type="radio" name="checkId" value="${id}"${id === selected ? ' checked' : ''}>
                  <span class="choose-card__body">
                    ${isRec ? `<span class="chip chip--reason">${icon('sparkles')}Recommended</span>` : isAlso ? `<span class="chip chip--reason">${icon('info')}Also suggested</span>` : ''}
                    <strong class="choose-card__name">${esc(ch.name)}</strong>
                    <span class="text-2">${esc(ch.for)} · ${ch.questions} questions · about ${ch.mins} min</span>
                    ${isRec || isAlso ? `<span class="text-3">${esc(RECOMMEND.why[id])}</span>` : ''}
                    ${ch.enrols ? '' : `<span class="text-3">${esc(RECOMMEND.standalone)}</span>`}
                  </span>
                </label>`;
            }).join('')}
          </div>
        </fieldset>
        <div class="check-form__actions">
          <a class="btn btn--outline" href="#/check/start">${icon('arrow-left')}Back</a>
          <button class="btn btn--action" type="submit">Start the check${icon('arrow-right')}</button>
        </div>
      </form>
    </div>`;
}

export function bind(root) {
  root.querySelector('[data-choose]')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = e.currentTarget.checkId.value;
    navigate(`/check/run/${id}`); // hash first, so the store change renders the new route once
    chooseCheck(id);
  });
}
