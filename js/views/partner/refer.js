// #/partner/refer (§8.15): name, email, organisation, optional note → a pretend referral link and an email preview.
import { PARTNER } from '../../../data/connectPage.js';
import { PARTNERS } from '../../../data/partners.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { field, validateForm, isEmail } from '../../components/form.js';
import { showToast } from '../../components/toast.js';
import { referClient } from '../../partnerStore.js';
import { replaceHash } from '../../router.js';

let focusResult = false;

const R = PARTNER.referPage;

function result(ref, partner) {
  return `
    <section class="card stack" aria-labelledby="rf-done-h">
      <h2 class="h3" id="rf-done-h">${icon('circle-check')} ${esc(R.created(ref.contact))}</h2>
      <div class="field"><label class="field__label" for="rf-link">${esc(R.link)}</label>
        <div class="rf-link"><input class="input" id="rf-link" readonly value="bvtacademy.com.au/r/${esc(ref.code)}"><button type="button" class="btn btn--outline" data-copy>${icon('copy')}${esc(R.copy)}</button></div></div>
      <h3 class="card__title">${esc(R.preview)}</h3>
      <div class="email">
        <dl class="email__head"><div><dt>From</dt><dd>${esc(partner.name)} via BVT Academy</dd></div><div><dt>To</dt><dd>${esc(ref.contact)} &lt;${esc(ref.email)}&gt;</dd></div><div><dt>Subject</dt><dd><strong>${esc(R.subject(partner.name))}</strong></dd></div></dl>
        <div class="email__body"><p>${esc(R.body(ref.contact.split(' ')[0], partner.name))}</p>${ref.note ? `<p><em>${esc(ref.note)}</em></p>` : ''}<p><span class="email__cta">${esc(R.cta)}</span></p></div>
      </div>
      <p class="text-3">${esc(R.createdText)} <a href="#/partner/clients">See it in your clients list</a></p>
    </section>`;
}

export function render(ctx) {
  const created = ctx.query.created ? (ctx.state.referrals ?? []).find((r) => r.code === ctx.query.created) : null;
  return `
    <div class="page partner-page">
      <header class="page-header"><h1>Refer a client</h1><p class="lead">${esc(R.lead)}</p></header>
      <div class="refer-grid">
        <form class="card stack" data-refer novalidate>
          ${field({ id: 'rf-name', label: R.name, control: '<input class="input" id="rf-name" name="name" autocomplete="off">' })}
          ${field({ id: 'rf-email', label: R.email, control: '<input class="input" id="rf-email" name="email" type="email" autocomplete="off">' })}
          ${field({ id: 'rf-org', label: R.org, control: '<input class="input" id="rf-org" name="org" autocomplete="off">' })}
          ${field({ id: 'rf-note', label: R.note, hint: R.noteHint, optional: true, control: '<textarea class="textarea" id="rf-note" name="note" rows="3" aria-describedby="rf-note-hint"></textarea>' })}
          <div><button type="submit" class="btn btn--action">${icon('link')}${esc(R.create)}</button></div>
        </form>
        <div data-refer-result>${created ? result(created, PARTNERS[ctx.persona.partnerId]) : ''}</div>
      </div>
    </div>`;
}

export function bind(root) {
  root.querySelector('[data-copy]')?.addEventListener('click', () => showToast(R.copied, { iconName: 'copy' }));
  if (focusResult && root.querySelector('#rf-done-h')) {
    focusResult = false;
    const h = root.querySelector('#rf-done-h');
    h.tabIndex = -1;
    requestAnimationFrame(() => h.focus());
  }
  const form = root.querySelector('[data-refer]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = validateForm(form, { name: (v) => (v ? '' : R.errors.name), email: (v) => (isEmail(v) ? '' : R.errors.email), org: (v) => (v ? '' : R.errors.org) }, 'rf');
    if (bad) { bad.focus(); return; }
    const ref = referClient({ contact: form.elements.name.value.trim(), email: form.elements.email.value.trim(), orgName: form.elements.org.value.trim(), note: form.elements.note.value.trim() });
    showToast(R.created(ref.contact), { text: R.createdText, iconName: 'link' });
    focusResult = true;
    replaceHash(`/partner/refer?created=${ref.code}`);
  });
}
