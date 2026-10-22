// #/institutions — "Send my clients through BVT" (§8.15 public page) with a pretend partner sign-up form.
import { INSTITUTIONS_PAGE as P } from '../../../data/site-pages.js';
import { PROTOTYPE_NOTE } from '../../../data/copy.js';
import { esc } from '../../util.js';
import { icon, renderIcons } from '../../components/icon.js';
import { showToast } from '../../components/toast.js';
import { pageHero, sectionHead, featureCard } from '../../components/marketing.js';

const field = (id, label, input, hint = '') => `
  <div class="field" data-field="${id}">
    <label class="field__label" for="ref-${id}">${label}</label>
    ${input}
    ${hint ? `<p class="field__hint" id="ref-${id}-hint">${hint}</p>` : ''}
    <p class="field__error" id="ref-${id}-err" hidden></p>
  </div>`;

function form() {
  return `
    <form class="card stack partner-form" data-partner-form novalidate aria-labelledby="partner-form-h">
      <h2 class="h3" id="partner-form-h">${esc(P.form.title)}</h2>
      <p class="text-2">${esc(P.form.text)}</p>
      ${field('name', 'Your name', '<input class="input" id="ref-name" name="name" autocomplete="name" required>')}
      ${field('org', 'Organisation', '<input class="input" id="ref-org" name="org" autocomplete="organization" required>')}
      ${field('email', 'Work email', '<input class="input" id="ref-email" name="email" type="email" autocomplete="email" required>')}
      ${field('type', 'Type of organisation', `<select class="select" id="ref-type" name="type" required>
        <option value="">Choose one</option>${P.form.types.map((t) => `<option>${esc(t)}</option>`).join('')}</select>`)}
      <button class="btn btn--action" type="submit">Request partner access${icon('arrow-right')}</button>
      <p class="text-3">${icon('shield-check')} ${PROTOTYPE_NOTE}.</p>
    </form>`;
}

export function render() {
  return `
    ${pageHero({ ...P.hero, actions: [{ label: 'Become a referral partner', href: '/institutions', variant: 'action', icon: 'arrow-down' }, { label: 'Find pre-qualified businesses', href: '/connect', variant: 'on-dark' }] })}
    <section class="section" aria-labelledby="why-h">
      <div class="container stack stack-lg">
        ${sectionHead({ eyebrow: P.why.eyebrow, title: P.why.title, id: 'why-h' })}
        <div class="grid-3">${P.why.items.map((it) => featureCard(it)).join('')}</div>
      </div>
    </section>
    <section class="section band-cream" aria-labelledby="how-h">
      <div class="container stack stack-lg">
        ${sectionHead({ eyebrow: P.how.eyebrow, title: P.how.title, id: 'how-h' })}
        <ol class="numbered-steps">
          ${P.how.steps.map((s, i) => `<li><span class="numbered-steps__n" aria-hidden="true">${i + 1}</span><h3 class="card__title">${esc(s.title)}</h3><p class="card__meta">${esc(s.text)}</p></li>`).join('')}
        </ol>
      </div>
    </section>
    <section class="section" aria-labelledby="consent-h" id="partner-signup">
      <div class="container grid-2">
        <div class="stack">
          ${sectionHead({ title: P.consent.title, id: 'consent-h' })}
          <div class="card card--flat stack stack-sm">
            <h3 class="h4">${icon('eye')} With your client’s consent</h3>
            <ul class="ticks">${P.consent.withConsent.map((p) => `<li>${icon('check')}<span>${esc(p)}</span></li>`).join('')}</ul>
            <h3 class="h4">${icon('eye-off')} Without consent</h3>
            <ul class="ticks">${P.consent.withoutConsent.map((p) => `<li>${icon('minus')}<span>${esc(p)}</span></li>`).join('')}</ul>
          </div>
        </div>
        <div data-partner-slot>${form()}</div>
      </div>
    </section>`;
}

function validate(f) {
  const rules = {
    name: (v) => (v ? '' : 'Enter your name.'),
    org: (v) => (v ? '' : 'Enter your organisation.'),
    email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? '' : 'Enter an email address, like name@organisation.com.au.'),
    type: (v) => (v ? '' : 'Choose the type of organisation.'),
  };
  let first = null;
  Object.entries(rules).forEach(([key, rule]) => {
    const input = f.elements[key];
    const msg = rule(input.value.trim());
    const err = f.querySelector(`#ref-${key}-err`);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) input.setAttribute('aria-describedby', err.id);
    else input.removeAttribute('aria-describedby');
    err.hidden = !msg;
    err.innerHTML = msg ? `${icon('circle-alert')}${esc(msg)}` : '';
    if (msg && !first) first = input;
  });
  renderIcons(f);
  return first;
}

export function bind(root) {
  // Hero "Become a referral partner" scrolls to the form instead of re-routing
  root.querySelector('.page-hero a[href="#/institutions"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    root.querySelector('#partner-signup').scrollIntoView({ behavior: 'smooth' });
    root.querySelector('#ref-name').focus({ preventScroll: true });
  });
  root.querySelector('[data-partner-form]')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const invalid = validate(f);
    if (invalid) { invalid.focus(); return; }
    const name = f.elements.name.value.trim().split(' ')[0];
    const slot = root.querySelector('[data-partner-slot]');
    slot.innerHTML = `
      <div class="card card--highlight stack" tabindex="-1" data-partner-done>
        <span class="icon-tile">${icon('circle-check')}</span>
        <h2 class="h3">Request received</h2>
        <p>${esc(P.form.success(name))}</p>
        <p class="text-3">${PROTOTYPE_NOTE}.</p>
      </div>`;
    renderIcons(slot);
    slot.querySelector('[data-partner-done]').focus();
    showToast('Partner request received', { text: 'Pretend only — nothing was sent.', iconName: 'handshake' });
  });
}
