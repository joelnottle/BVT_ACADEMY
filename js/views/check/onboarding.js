// #/onboarding?step=1–4 — four short, skippable steps after enrolment (§8.3).
// Choices save as they change, so the dots and Back never lose anything. Finishing lands on the dashboard.
import { ONBOARDING } from '../../../data/enrolment.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { stepDots } from '../../components/stepDots.js';
import { emptyState } from '../../components/feedback.js';
import { accentText } from '../../components/marketing.js';
import { showToast } from '../../components/toast.js';
import { navigate } from '../../router.js';
import { getState, currentOrg, saveOnboarding, finishOnboarding } from '../../store.js';
import { STEP_BODIES, goalFor, choiceSummary } from './onboardingSteps.js';

const STEPS = ONBOARDING.steps;
const hrefFor = (i) => `#/onboarding?step=${i + 1}`;
const stepIndex = (query) => {
  const n = Number(query.step);
  return Number.isInteger(n) && n >= 1 && n <= STEPS.length ? n - 1 : 0;
};

export function render(ctx) {
  const { org, persona } = ctx;
  if (persona.role !== 'lead' || !org) {
    return `<div class="container check-flow"><h1 class="sr-only">Welcome to the Academy</h1>
      ${emptyState({ title: 'Enrol first', text: 'Set-up starts once your organisation is enrolled in the Academy.', action: '<a class="btn btn--action" href="#/enrol">Go to enrolment</a>' })}</div>`;
  }
  const i = stepIndex(ctx.query);
  const step = STEPS[i];
  const last = i === STEPS.length - 1;
  return `
    <div class="container check-flow onboarding">
      <header class="onboarding__top">
        <p class="eyebrow">${esc(ONBOARDING.welcome(persona.name.split(' ')[0]))} · ${esc(org.name)}</p>
        ${stepDots(STEPS, i, hrefFor)}
      </header>
      <form class="card onboarding__card" data-onboarding="${step.id}">
        <h1 class="h2 rule">${accentText(step.title)}</h1>
        ${STEP_BODIES[step.id](ctx)}
        <div class="onboarding__nav">
          ${i > 0 ? `<a class="btn btn--outline" href="${hrefFor(i - 1)}">${icon('arrow-left')}Back</a>` : '<span></span>'}
          <div class="onboarding__nav-end">
            ${last ? '' : `<button class="link-btn" type="button" data-skip>${esc(ONBOARDING.skip)}</button>`}
            ${last
              ? `<button class="btn btn--action" type="submit">${esc(ONBOARDING.finish)}${icon('arrow-right')}</button>`
              : `<a class="btn btn--action" href="${hrefFor(i + 1)}">Next: ${esc(STEPS[i + 1].label)}${icon('arrow-right')}</a>`}
          </div>
        </div>
      </form>
    </div>`;
}

function finish({ skipped }) {
  navigate('/app/dashboard'); // hash first, so the store change renders the new route once
  const org = finishOnboarding();
  if (!org) return;
  showToast(skipped ? ONBOARDING.skippedToast : ONBOARDING.doneToast, {
    text: skipped ? 'We’ve used sensible defaults for now.' : choiceSummary(getState(), org),
    iconName: 'circle-check',
  });
}

export function bind(root) {
  const form = root.querySelector('[data-onboarding]');
  if (!form) return;

  form.addEventListener('change', (e) => {
    const { name, value } = e.target;
    if (name === 'goal') saveOnboarding({ weeklyGoalHrs: ONBOARDING.goals.find((g) => g.id === value).hrs });
    if (name === 'reminderDay') saveOnboarding({ reminderDay: value });
    if (name === 'startDomainId') saveOnboarding({ startDomainId: value });
    if (name === 'startChoice') {
      const area = form.querySelector('[data-area-field]');
      area.hidden = value !== 'choose-area';
      saveOnboarding({ startChoice: value, ...(value === 'choose-area' ? { startDomainId: form.elements.startDomainId.value } : {}) });
    }
  });

  // Defaults shown on screen are saved the moment the step is seen, so what you see is what you get.
  const org = currentOrg();
  if (form.dataset.onboarding === 'goal' && org.weeklyGoalHrs == null) saveOnboarding({ weeklyGoalHrs: goalFor(null).hrs, reminderDay: org.reminderDay ?? 'Mon' });
  if (form.dataset.onboarding === 'start' && !org.startChoice) {
    const checked = form.querySelector('input[name="startChoice"]:checked');
    saveOnboarding({ startChoice: checked ? checked.value : 'pathway' });
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); finish({ skipped: false }); });
  root.querySelector('[data-skip]')?.addEventListener('click', () => finish({ skipped: true }));
}
