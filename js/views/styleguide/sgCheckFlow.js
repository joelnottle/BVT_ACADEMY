// Styleguide: free Check components (Phase 4) — flow steps, form field with error, yes/no, answer scale,
// "Why we ask", score ring and the enrol band.
import { ANSWER_SCALE } from '../../../data/checks.js';
import { icon } from '../../components/icon.js';
import { flowSteps } from '../../components/flowSteps.js';
import { field, yesNo } from '../../components/form.js';
import { readinessRing } from '../../components/progress.js';
import { section, pair, example } from './layout.js';

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

export const checkFlowSection = () => section('checkflow', 'Free check components', 'Used in sign-up, the runner and results.', `
  ${pair(light, dark)}
  <section class="enrol-band" aria-label="Enrol band example">
    <div><p class="h3">Enrol in the Academy — Core package</p><p>9 months · Ask Ali credits [X] · Mentor credits [X] · Verification included · [Price — Doc 3]</p></div>
    <a class="btn btn--light" href="#/styleguide/checkflow">Enrol now${icon('arrow-right')}</a>
  </section>`);
