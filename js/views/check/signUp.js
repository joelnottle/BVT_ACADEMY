// #/sign-up — pretend account creation, leading into the free Check (demo script A).
// No password is asked for or stored: the real product would send a sign-in link.
import { CHECKS } from '../../../data/checks.js';
import { DEMO_DETAILS } from '../../../data/checkFlow.js';
import { PROTOTYPE_NOTE } from '../../../data/copy.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { field, validateForm, isEmail } from '../../components/form.js';
import { showToast } from '../../components/toast.js';
import { navigate } from '../../router.js';
import { startSignUp } from '../../store.js';

const RULES = {
  leadName: (v) => (v ? '' : 'Enter your name.'),
  email: (v) => (isEmail(v) ? '' : 'Enter your work email, like name@organisation.com.au.'),
};

export function render(ctx) {
  const pre = CHECKS[ctx.query.check];
  const c = ctx.state.check ?? {};
  return `
    <div class="container auth">
      <div class="auth__intro stack">
        <p class="eyebrow">Free check</p>
        <h1 class="h2 rule">Create your account and <span class="accent">start</span></h1>
        <p class="lead">It takes about 25 minutes, needs no payment, and your enrolment clock doesn’t start until you choose to enrol.</p>
        <ul class="ticks">
          <li>${icon('check')}<span>Your score, tier and a breakdown by area</span></li>
          <li>${icon('check')}<span>What’s already in place, and what to build</span></li>
          <li>${icon('check')}<span>Answers save as you go — stop and come back any time</span></li>
        </ul>
        ${c.checkId && !c.completedOn ? `<p class="callout callout--resume">${icon('rotate-ccw')}<span>You have a check in progress for ${esc(c.orgName)}. <a href="#/check/run/${esc(c.checkId)}">Resume where you left off</a></span></p>` : ''}
        ${c.completedOn ? `<p class="callout">${icon('circle-check')}<span>Your check is complete. <a href="#/check/results">See your results</a></span></p>` : ''}
        ${pre ? `<p class="callout">${icon('clipboard-check')}<span>You chose the <strong>${esc(pre.name)}</strong>. You can change this in step 2.</span></p>` : ''}
      </div>
      <form class="card stack auth__form" data-signup novalidate aria-labelledby="signup-h">
        <h2 class="h3" id="signup-h">Your account</h2>
        ${field({ id: 'su-leadName', label: 'Your name', control: `<input class="input" id="su-leadName" name="leadName" autocomplete="name" value="${esc(c.leadName ?? '')}">` })}
        ${field({ id: 'su-email', label: 'Work email', hint: 'We’d send you a sign-in link — no password needed.', control: `<input class="input" id="su-email" name="email" type="email" autocomplete="email" value="${esc(c.email ?? '')}">` })}
        <div class="cluster">
          <button class="btn btn--action" type="submit">Create account and continue${icon('arrow-right')}</button>
          <button class="link-btn" type="button" data-demo-fill>Fill with demo details</button>
        </div>
        <p class="text-3">Already have an account? <a href="#/sign-in">Sign in</a></p>
        <p class="text-3">${icon('shield-check')} ${PROTOTYPE_NOTE}.</p>
      </form>
    </div>`;
}

export function bind(root, ctx) {
  const form = root.querySelector('[data-signup]');
  root.querySelector('[data-demo-fill]')?.addEventListener('click', () => {
    form.elements.leadName.value = DEMO_DETAILS.leadName;
    form.elements.email.value = DEMO_DETAILS.email;
    form.elements.leadName.focus();
  });
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const invalid = validateForm(form, RULES, 'su');
    if (invalid) { invalid.focus(); return; }
    const details = { leadName: form.elements.leadName.value.trim(), email: form.elements.email.value.trim(), preselect: ctx.query.check };
    navigate('/check/start');
    startSignUp(details);
    showToast('Account created', { text: 'Pretend only — in the real product we’d email you a sign-in link.', iconName: 'user-plus' });
  });
}
