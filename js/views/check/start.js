// #/check/start — authorised-lead declaration and organisation details (§8.2).
// The ABN is format-checked only; nothing is looked up.
import { DECLARATION, DEMO_DETAILS } from '../../../data/checkFlow.js';
import { PROTOTYPE_NOTE } from '../../../data/copy.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { field, yesNo, validateForm, isEmail } from '../../components/form.js';
import { flowSteps } from '../../components/flowSteps.js';
import { navigate } from '../../router.js';
import { saveCheckDetails } from '../../store.js';

const digits = (v) => String(v).replace(/\s/g, '');

const RULES = {
  leadName: (v) => (v ? '' : 'Enter your name.'),
  email: (v) => (isEmail(v) ? '' : 'Enter your work email.'),
  leadRole: (v) => (v ? '' : 'Choose your role.'),
  declared: (v) => (v ? '' : 'Confirm you are the nominated authorised lead.'),
  orgName: (v) => (v ? '' : 'Enter your organisation’s name.'),
  abn: (v) => (/^\d{11}$/.test(digits(v)) ? '' : 'An ABN has 11 digits, for example 41 824 753 019.'),
  staff: (v) => (/^\d+$/.test(v) && Number(v) >= 1 ? '' : 'Enter the number of staff, for example 14.'),
};

export function render(ctx) {
  const c = ctx.state.check ?? {};
  const val = (k) => esc(c[k] ?? '');
  return `
    <div class="container check-flow">
      ${flowSteps(0)}
      <header class="stack stack-sm">
        <h1 class="h2 rule">Before you <span class="accent">start</span></h1>
        <p class="lead">A few details so we can recommend the right check.</p>
      </header>
      <form class="check-form" data-start novalidate>
        <section class="card stack" aria-labelledby="decl-h">
          <h2 class="h3" id="decl-h">${esc(DECLARATION.title)}</h2>
          <p class="text-2">${esc(DECLARATION.text)}</p>
          <ul class="pill-list">${DECLARATION.examples.map((e) => `<li>${icon('user')}<span>${esc(e)}</span></li>`).join('')}</ul>
          <p class="callout">${icon('info')}<span>${esc(DECLARATION.decides)}</span></p>
          <div class="grid-2">
            ${field({ id: 'cs-leadName', label: 'Your name', control: `<input class="input" id="cs-leadName" name="leadName" autocomplete="name" value="${val('leadName')}">` })}
            ${field({ id: 'cs-email', label: 'Work email', control: `<input class="input" id="cs-email" name="email" type="email" autocomplete="email" value="${val('email')}">` })}
          </div>
          ${field({ id: 'cs-leadRole', label: 'Your role', control: `<select class="select" id="cs-leadRole" name="leadRole"><option value="">Choose one</option>${DECLARATION.roles.map((r) => `<option${c.leadRole === r ? ' selected' : ''}>${esc(r)}</option>`).join('')}</select>` })}
          <div class="field">
            <label class="check"><input type="checkbox" id="cs-declared" name="declared"${c.declared ? ' checked' : ''}><span class="check__text">${esc(DECLARATION.confirm)}</span></label>
            <p class="field__error" id="cs-declared-err" hidden></p>
          </div>
        </section>
        <section class="card stack" aria-labelledby="org-h">
          <h2 class="h3" id="org-h">Your organisation</h2>
          ${field({ id: 'cs-orgName', label: 'Organisation name', control: `<input class="input" id="cs-orgName" name="orgName" autocomplete="organization" value="${val('orgName')}">` })}
          <div class="grid-2">
            ${field({ id: 'cs-abn', label: 'ABN', hint: 'We check the format only — nothing is looked up.', control: `<input class="input" id="cs-abn" name="abn" inputmode="numeric" value="${val('abn')}">` })}
            ${field({ id: 'cs-staff', label: 'Number of staff', hint: 'Include part-time staff. Volunteers don’t count.', control: `<input class="input" id="cs-staff" name="staff" inputmode="numeric" value="${val('staff')}">` })}
          </div>
          ${yesNo({ name: 'oric', legend: 'Is your organisation registered with ORIC?', value: c.oric ?? 'no', idPrefix: 'cs' })}
          ${yesNo({ name: 'debt', legend: 'Are you managing debt or recovering from a difficult period?', value: c.debt ?? 'no', idPrefix: 'cs' })}
        </section>
        <div class="check-form__actions">
          <button class="btn btn--action" type="submit">Continue${icon('arrow-right')}</button>
          <button class="link-btn" type="button" data-demo-fill>Fill with demo details</button>
        </div>
        <p class="text-3">${icon('shield-check')} ${PROTOTYPE_NOTE}.</p>
      </form>
    </div>`;
}

export function bind(root) {
  const form = root.querySelector('[data-start]');
  root.querySelector('[data-demo-fill]').addEventListener('click', () => {
    const d = DEMO_DETAILS;
    ['leadName', 'email', 'orgName', 'abn', 'staff'].forEach((k) => { form.elements[k].value = d[k]; });
    form.elements.leadRole.value = d.leadRole;
    form.elements.declared.checked = true;
    form.querySelector(`#cs-oric-${d.oric}`).checked = true;
    form.querySelector(`#cs-debt-${d.debt}`).checked = true;
    form.elements.leadName.focus();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const invalid = validateForm(form, RULES, 'cs');
    if (invalid) { invalid.focus(); return; }
    const f = form.elements;
    navigate('/check/choose');
    saveCheckDetails({
      leadName: f.leadName.value.trim(), email: f.email.value.trim(), leadRole: f.leadRole.value, declared: true,
      orgName: f.orgName.value.trim(), abn: f.abn.value.trim(), staff: Number(f.staff.value), oric: f.oric.value, debt: f.debt.value,
    });
  });
}
