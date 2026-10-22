// Styleguide: free Check and enrolment components (Phases 4–5) — flow steps, form field with error, yes/no,
// answer scale, "Why we ask", score ring, enrol band, package card, step dots, choice cards, day picker,
// timeline facts and the helps/decides panel.
import { ANSWER_SCALE } from '../../../data/checks.js';
import { icon } from '../../components/icon.js';
import { flowSteps } from '../../components/flowSteps.js';
import { field, yesNo } from '../../components/form.js';
import { readinessRing } from '../../components/progress.js';
import { packageCard } from '../../components/packageCard.js';
import { stepDots } from '../../components/stepDots.js';
import { ONBOARDING, PACKAGES } from '../../../data/enrolment.js';
import { section, pair, example } from './layout.js';

const SAMPLE_OFFER = { tier: 'core', months: 9, total: 45, inPlace: 18, pathway: null, pathwaySteps: 0, credits: PACKAGES.core.credits, price: null };
const SAMPLE_PATHWAY = { ...SAMPLE_OFFER, tier: 'foundation', months: 12, pathway: 'startup', pathwaySteps: 7, credits: PACKAGES.foundation.credits };

const enrolment = `
  <div class="sg-grid-2">
    ${example('Package card (Core)', `<div class="card pkg"><div class="pkg__body">${packageCard(SAMPLE_OFFER, { startsOn: '2027-05-03', endsOn: '2028-02-03', headingId: 'sg-pkg-1' })}</div></div>`)}
    ${example('Package card (Start-up pathway first)', `<div class="card pkg"><div class="pkg__body">${packageCard(SAMPLE_PATHWAY, { startsOn: '2027-05-03', endsOn: '2028-05-03', headingId: 'sg-pkg-2' })}</div></div>`)}
  </div>
  <div class="stack stack-lg">
    ${example('Step dots (step 2 of 4, each dot links to its step)', stepDots(ONBOARDING.steps, 1, (i) => `#/styleguide/checkflow?step=${i + 1}`, { label: 'Styleguide set-up progress' }))}
    ${example('Timeline and facts', `
      <dl class="timeline">
        <div class="timeline__end"><dt>Started</dt><dd>3 May 2027</dd></div>
        <div class="timeline__track" aria-hidden="true"><span>Core · 9 months</span></div>
        <div class="timeline__end timeline__end--finish"><dt>Finish by</dt><dd>3 Feb 2028</dd></div>
      </dl>
      <ul class="facts"><li class="fact"><span class="fact__n">45</span><span>Core requirements</span></li><li class="fact"><span class="fact__n">18</span><span>already in place</span></li><li class="fact"><span class="fact__n">~2</span><span>a fortnight</span></li></ul>`)}
    ${example('Choice cards', `<fieldset class="fieldset"><legend>Weekly time budget</legend><div class="choice-grid">
      ${ONBOARDING.goals.map((g, i) => `<label class="option choice-card"><input type="radio" name="sg-goal"${i === 0 ? ' checked' : ''}><span class="choice-card__body"><strong>${g.label}</strong><span class="text-2">${g.text}</span></span></label>`).join('')}
      </div></fieldset>`)}
    ${example('Day picker', `<fieldset class="fieldset"><legend>Reminder day</legend><div class="day-picker">
      ${ONBOARDING.days.map(([id, name], i) => `<label class="option day-picker__day"><input type="radio" name="sg-day"${i === 0 ? ' checked' : ''}><span aria-hidden="true">${id}</span><span class="sr-only">${name}</span></label>`).join('')}
      </div></fieldset>`)}
    ${example('Helps / decides', `<section class="roles" aria-label="Example"><p class="h3">${ONBOARDING.support.roles.title}</p><div class="roles__grid">
      <div class="roles__col">${icon('hand-helping')}<div><strong>Helps you</strong><p>${ONBOARDING.support.roles.help.text}</p></div></div>
      <div class="roles__col">${icon('shield-check')}<div><strong>Decides</strong><p>${ONBOARDING.support.roles.decide.text}</p></div></div></div></section>`)}
  </div>`;

const light = `
  <div class="stack stack-lg">
    ${example('Flow steps (current: Questions)', flowSteps(2))}
    ${example('Field with hint and error', `
      <div class="field">
        <label class="field__label" for="sgc-abn">ABN</label>
        <input class="input" id="sgc-abn" value="41 824" aria-invalid="true" aria-describedby="sgc-abn-hint sgc-abn-err">
        <p class="field__hint" id="sgc-abn-hint">We check the format only — nothing is looked up.</p>
        <p class="field__error" id="sgc-abn-err">${icon('circle-alert')}An ABN has 11 digits, for example 41 824 753 019.</p>
      </div>`)}
    ${example('Yes / No', yesNo({ name: 'sgc-oric', legend: 'Is your organisation registered with ORIC?', idPrefix: 'sgc' }))}
    ${example('Answer scale', `<fieldset class="fieldset"><legend>Where is your organisation today?</legend><div class="stack stack-sm">
      ${ANSWER_SCALE.map((a, i) => `<label class="option"><input type="radio" name="sgc-answer"${i === 0 ? ' checked' : ''}><span><strong>${a.label}</strong>${a.hint ? ` — ${a.hint}` : ''}</span></label>`).join('')}
      </div></fieldset>`)}
    ${example('Why we ask (open)', `<details class="why" open><summary>${icon('circle-question-mark')}Why we ask</summary><p>Funders and procurement panels look for this as a sign of sound governance.</p></details>`)}
  </div>`;

const dark = `
  <div class="stack stack-lg">
    ${example('Score ring', readinessRing({ verified: 41, total: 100, legend: false, label: 'pre-qualification met', description: 'Score: 41% of pre-qualification met.' }))}
  </div>`;

export const checkFlowSection = () => section('checkflow', 'Free check & enrolment components', 'Used in sign-up, the runner, results, enrolment and onboarding.', `
  ${pair(light, dark)}
  <section class="enrol-band" aria-label="Enrol band example">
    <div><p class="h3">Enrol in the Academy — Core package</p><p>9 months · 8 Ask Ali credits · 2 mentor sessions · Verification included</p></div>
    <a class="btn btn--light" href="#/styleguide/checkflow">Enrol now${icon('arrow-right')}</a>
  </section>
  ${enrolment}`);
