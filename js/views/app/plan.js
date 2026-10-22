// #/app/plan (§8.19): pace summary, the pace plan (remaining work spread over remaining weeks), weekly goal and
// reminder day, and "Life got in the way?" — re-plan, extend (pretend, price placeholder), re-enrolment.
// Tone: practical and judgement-free.
import { PLAN as P } from '../../../data/account.js';
import { ONBOARDING } from '../../../data/enrolment.js';
import { esc, formatDate, addMonths } from '../../util.js';
import { icon } from '../../components/icon.js';
import { pacePill } from '../../components/chips.js';
import { openModal } from '../../components/modal.js';
import { showToast } from '../../components/toast.js';
import { paceStatus, isAccredited } from '../../selectors.js';
import { weeklyPlan } from '../../accountSelectors.js';
import { goalFor } from '../check/onboardingSteps.js';
import { savePlanSettings, replan, extendEnrolment } from '../../accountStore.js';
import { getState, currentOrg, today as todayOf } from '../../store.js';

function settings(org) {
  const goal = goalFor(org.weeklyGoalHrs).id;
  const day = org.reminderDay ?? 'Mon';
  return `
    <section class="card stack" aria-labelledby="plan-set-h">
      <h2 class="h3" id="plan-set-h">${esc(P.settings)}</h2>
      <form class="stack" data-plan-settings>
        <fieldset class="fieldset"><legend>Weekly time budget</legend><div class="choice-grid">
          ${ONBOARDING.goals.map((g) => `<label class="option choice-card"><input type="radio" name="goal" value="${g.id}"${g.id === goal ? ' checked' : ''}><span class="choice-card__body"><strong>${esc(g.label)}</strong><span class="text-2">${esc(g.text)}</span></span></label>`).join('')}
        </div></fieldset>
        <fieldset class="fieldset"><legend>Reminder day</legend><div class="day-picker">
          ${ONBOARDING.days.map(([id, name]) => `<label class="option day-picker__day"><input type="radio" name="reminderDay" value="${id}"${id === day ? ' checked' : ''}><span aria-hidden="true">${id}</span><span class="sr-only">${name}</span></label>`).join('')}
        </div><p class="field__hint">${esc(ONBOARDING.reminderHint)}</p></fieldset>
        <div><button type="submit" class="btn btn--outline">${icon('save')}${esc(P.save)}</button></div>
      </form>
    </section>`;
}

export function render(ctx) {
  const { state, org, today } = ctx;
  if (isAccredited(org)) {
    return `<div class="page"><header class="page-header"><h1>Plan &amp; pace</h1></header>
      <p class="callout callout--ok">${icon('award')}<span>${esc(P.accredited)} <a href="#/app/enterprise">Enterprise hub</a></span></p></div>`;
  }
  const pace = paceStatus(state, org, today);
  const plan = weeklyPlan(state, org, today);
  const ext = org.extensions?.at(-1);
  return `
    <div class="page plan-page">
      <header class="page-header"><h1>Plan &amp; pace</h1><p class="lead">${esc(P.lead)}</p></header>
      <section class="card plan-summary" aria-labelledby="plan-sum-h">
        <div>
          <h2 class="dash-title" id="plan-sum-h">Finish by ${esc(formatDate(org.endsOn))}</h2>
          <p class="dash-big">${esc(P.summary(pace.daysLeft, pace.remaining))}</p>
          <div class="cluster">${pacePill(pace.status)}<span class="text-2">${esc(P.perWeek(plan.perWeek))}</span></div>
          ${pace.suggestion ? `<p class="text-2">${esc(pace.suggestion)}</p>` : ''}
          ${ext ? `<p class="text-3">${esc(P.lastExtension(ext.months, formatDate(ext.on)))}</p>` : ''}
        </div>
      </section>
      <div class="plan-grid">
        <section class="card stack" aria-labelledby="plan-h">
          <h2 class="h3" id="plan-h">${esc(P.planTitle)}</h2>
          <ol class="plan-weeks">
            ${plan.plan.map((w) => `
              <li class="plan-week"><p class="plan-week__date">${esc(P.weekOf(formatDate(w.weekOf)))}</p>
                <ul class="plan-week__items">${w.items.map((r) => `<li><a href="#/app/req/${esc(r.id)}"><span class="dash-code">${esc(r.id)}</span> ${esc(r.title)}</a></li>`).join('')}</ul></li>`).join('')}
          </ol>
          ${plan.moreItems > 0 ? `<p class="text-2">${esc(P.more(plan.moreItems, plan.moreWeeks))}</p>` : ''}
        </section>
        <div class="stack stack-lg">
          ${settings(org)}
          <section class="card stack plan-life" aria-labelledby="plan-life-h">
            <h2 class="h3" id="plan-life-h">${esc(P.lifeTitle)}</h2>
            <p class="text-2">${esc(P.lifeLead)}</p>
            <div class="plan-life__actions">
              <button type="button" class="btn btn--outline" data-replan>${icon('refresh-cw')}${esc(P.replan)}</button>
              <button type="button" class="btn btn--outline" data-extend="1">${icon('calendar-plus')}${esc(P.extend(1))}</button>
              <button type="button" class="btn btn--outline" data-extend="3">${icon('calendar-plus')}${esc(P.extend(3))}</button>
            </div>
            <div><h3 class="card__title">${esc(P.reenrol)}</h3><p class="text-2">${esc(P.reenrolText)}</p></div>
          </section>
        </div>
      </div>
    </div>`;
}

export function bind(root) {
  root.querySelector('[data-plan-settings]')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const goal = ONBOARDING.goals.find((g) => g.id === f.querySelector('input[name="goal"]:checked').value);
    const day = f.querySelector('input[name="reminderDay"]:checked').value;
    savePlanSettings({ weeklyGoalHrs: goal.hrs, reminderDay: day });
    showToast(P.saved, { text: `${goal.label} · reminders on ${ONBOARDING.days.find(([id]) => id === day)[1]}s`, iconName: 'circle-check' });
  });
  root.querySelector('[data-replan]')?.addEventListener('click', () => {
    replan();
    const plan = weeklyPlan(getState(), currentOrg(), todayOf());
    const left = paceStatus(getState(), currentOrg(), todayOf()).remaining;
    showToast(P.replanned(left, plan.weeks), { text: P.replannedText, iconName: 'refresh-cw' });
  });
  root.querySelectorAll('[data-extend]').forEach((b) => b.addEventListener('click', () => {
    const n = Number(b.dataset.extend);
    const to = formatDate(addMonths(currentOrg().endsOn, n));
    openModal({
      title: P.extendTitle(n),
      body: `<p>${esc(P.extendText(to))}</p><p class="text-3">${icon('shield-check')} ${esc(P.extendPrice)}</p>`,
      actions: [{ label: 'Cancel', value: 'cancel', variant: 'outline' }, { label: `${P.extend(n)} (demo)`, value: 'go', variant: 'action' }],
      onAction(v) { if (v === 'go') { const end = extendEnrolment(n); showToast(P.extended(formatDate(end)), { text: 'Your plan is spread over the extra time. Nothing you’ve done is lost.', iconName: 'calendar-plus' }); } },
    });
  }));
}
