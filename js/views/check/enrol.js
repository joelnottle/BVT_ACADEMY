// #/enrol — package and tier from the free Check, Start-up / Recovery screening, and a pretend payment
// with no card fields (§8.3). Paying creates the organisation, starts its clock and opens onboarding.
import { ENROL, SCREENING } from '../../../data/enrolment.js';
import { TIERS } from '../../../data/copy.js';
import { esc, formatDate, addMonths } from '../../util.js';
import { icon, renderIcons } from '../../components/icon.js';
import { yesNo } from '../../components/form.js';
import { packageCard } from '../../components/packageCard.js';
import { emptyState } from '../../components/feedback.js';
import { tierBadge } from '../../components/chips.js';
import { openModal } from '../../components/modal.js';
import { showToast } from '../../components/toast.js';
import { navigate } from '../../router.js';
import { getState, today, setScreening, enrolFromCheck } from '../../store.js';
import { enrolmentOffer, screeningFor, pathwayFor } from '../../checkSelectors.js';

const wrap = (inner) => `<div class="container check-flow">${inner}</div>`;

function notReady(c) {
  const h1 = '<h1 class="sr-only">Enrol in the Academy</h1>';
  if (!c?.completedOn) {
    const started = c?.checkId && Object.keys(c.answers ?? {}).length;
    return wrap(`${h1}${emptyState({
      title: started ? 'Finish your free check first' : 'Start with the free check',
      text: 'Your tier and time limit come from your check results.',
      action: started
        ? `<a class="btn btn--action" href="#/check/run/${esc(c.checkId)}">Back to my check</a>`
        : '<a class="btn btn--action" href="#/sign-up">Start your free check</a>',
    })}`);
  }
  return wrap(`${h1}${emptyState({
    title: 'Enrolment runs from a Core check',
    text: 'This check is standalone, with its own report. Take a Core check to enrol in the Academy.',
    action: '<a class="btn btn--action" href="#/check/choose">Choose a Core check</a>',
  })}`);
}

function alreadyEnrolled(ctx) {
  const o = ctx.org;
  return wrap(`
    <header class="stack stack-sm">
      <p class="eyebrow">${esc(ENROL.eyebrow)}</p>
      <h1 class="h2 rule">You’re <span class="accent">enrolled</span></h1>
      <p class="lead">${esc(o.name)} is in the Academy until ${esc(formatDate(o.endsOn))}.</p>
    </header>
    <div class="card stack">
      <div class="cluster">${tierBadge(o.tier)}</div>
      <div class="cluster">
        <a class="btn btn--action" href="#/app/dashboard">${icon('layout-dashboard')}Go to my dashboard</a>
        ${o.onboardedOn ? '' : `<a class="btn btn--outline" href="#/onboarding">${icon('list-checks')}Finish setting up</a>`}
      </div>
    </div>`);
}

const outcome = (pathway) => {
  const o = SCREENING.outcome[pathway ?? 'none'];
  return `${icon(o.icon)}<span>${esc(o.text)}</span>`;
};

export function render(ctx) {
  if (ctx.persona.role === 'lead' && ctx.org) return alreadyEnrolled(ctx);
  const c = ctx.state.check;
  if (!c?.completedOn || !c.checkId || !enrolmentOffer(c).check.enrols) return notReady(c);

  const screening = screeningFor(c);
  const offer = enrolmentOffer(c, screening);
  const endsOn = addMonths(ctx.today, offer.months);

  return `
    <div class="container enrol">
      <header class="stack stack-sm">
        <p class="eyebrow">${esc(ENROL.eyebrow)} · ${esc(c.orgName)}</p>
        <h1 class="h2 rule">Your Academy <span class="accent">package</span></h1>
        <p class="lead">${esc(ENROL.lead(offer.score))}</p>
      </header>

      <div class="enrol__grid">
        <div class="enrol__main">
          <section class="card stack" aria-labelledby="screen-h">
            <h2 class="h3" id="screen-h">${esc(SCREENING.title)}</h2>
            <p class="text-2">${esc(SCREENING.intro)}</p>
            <form class="stack" data-screening>
              ${yesNo({ name: 'startup', legend: SCREENING.startup(c.orgName), value: screening.startup, idPrefix: 'en' })}
              ${yesNo({ name: 'recovery', legend: SCREENING.recovery(c.orgName), value: screening.recovery, idPrefix: 'en' })}
            </form>
            <p class="callout" data-outcome aria-live="polite">${outcome(offer.pathway)}</p>
          </section>
        </div>

        <aside class="card pkg" aria-labelledby="package-h">
          <div class="pkg__body" data-package>${packageCard(offer, { startsOn: ctx.today, endsOn })}</div>
          <button class="btn btn--action btn--block" type="button" data-pay>${icon('lock')}${esc(ENROL.pay)}</button>
          <p class="text-3 pkg__note">${icon('shield-check')}<span>${esc(ENROL.noCard)}</span></p>
        </aside>

        <div class="enrol__after">
          <section class="card stack" aria-labelledby="next-h">
            <h2 class="h3" id="next-h">What happens next</h2>
            <ol class="next-steps">
              <li><strong>Enrol</strong><span>${esc(ENROL.clock)}</span></li>
              <li><strong>Four short set-up steps</strong><span>Your timeline, a weekly goal, where to start and the support you have.</span></li>
              <li><strong>Your dashboard</strong><span>Every requirement is there from day one.</span></li>
            </ol>
          </section>
          <p><a class="link-btn" href="#/check/results">${icon('arrow-left')}Back to my results</a></p>
        </div>
      </div>
    </div>`;
}

function confirmBody(c, offer, on) {
  const ends = formatDate(addMonths(on, offer.months));
  return `
    <dl class="confirm-list">
      <div><dt>Organisation</dt><dd>${esc(c.orgName)}</dd></div>
      <div><dt>Package</dt><dd>${esc(TIERS[offer.tier].label)} · ${offer.months} months, to ${esc(ends)}</dd></div>
      <div><dt>Price</dt><dd>${esc(offer.price ?? ENROL.price)}</dd></div>
    </dl>
    <p class="callout">${icon('shield-check')}<span>${esc(ENROL.confirmNote)}</span></p>`;
}

export function bind(root, ctx) {
  const form = root.querySelector('[data-screening]');
  if (!form) return;

  form.addEventListener('change', () => {
    const patch = { startup: form.elements.startup.value, recovery: form.elements.recovery.value };
    setScreening(patch);
    const offer = enrolmentOffer(getState().check, patch);
    const box = root.querySelector('[data-package]');
    box.innerHTML = packageCard(offer, { startsOn: ctx.today, endsOn: addMonths(ctx.today, offer.months) });
    root.querySelector('[data-outcome]').innerHTML = outcome(pathwayFor(patch));
    renderIcons(root);
  });

  root.querySelector('[data-pay]').addEventListener('click', () => {
    const c = getState().check;
    const offer = enrolmentOffer(c);
    openModal({
      title: ENROL.confirmTitle,
      body: confirmBody(c, offer, today()),
      actions: [
        { label: 'Cancel', value: 'cancel', variant: 'outline' },
        { label: ENROL.confirmAction, value: 'enrol', variant: 'action' },
      ],
      onAction(value) {
        if (value !== 'enrol') return;
        navigate('/onboarding'); // hash first, so the store change renders the new route once
        const org = enrolFromCheck();
        showToast(ENROL.enrolledToast(org.name), { text: ENROL.enrolledText(offer.months, formatDate(org.endsOn)), iconName: 'flag' });
      },
    });
  });
}
