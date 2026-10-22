// #/verify and #/verify/:certNo — public certificate check (§8.13): valid, expired or not found.
import { VERIFY as V } from '../../../data/connectPage.js';
import { esc, formatDate } from '../../util.js';
import { icon } from '../../components/icon.js';
import { pageHero } from '../../components/marketing.js';
import { certificate } from '../../components/certificate.js';
import { navigate } from '../../router.js';
import { certificateLookup } from '../../connectSelectors.js';

const EXAMPLES = ['BVT-2027-000123', 'BVT-2026-000041', 'BVT-2027-999999'];

function result(ctx) {
  const n = ctx.params.certNo;
  if (!n) return '';
  const { status, listing: l } = certificateLookup(ctx.state, ctx.today, n);
  if (status === 'not-found') {
    return `<section class="verify-result verify-result--none" aria-labelledby="vr-h">
      <h2 class="h3" id="vr-h">${icon('search-x')}${esc(V.notFound.title)}</h2><p>${esc(V.notFound.text(n.toUpperCase()))}</p></section>`;
  }
  if (status === 'expired') {
    return `<section class="verify-result verify-result--expired" aria-labelledby="vr-h">
      <h2 class="h3" id="vr-h">${icon('clock')}${esc(V.expired.title)}</h2><p>${esc(V.expired.text(l.name, formatDate(l.renewsOn)))}</p>
      ${l.visible === false ? '' : `<p><a href="#/connect/${esc(l.id)}">${esc(V.profile)}</a></p>`}</section>`;
  }
  return `<section class="verify-result verify-result--valid" aria-labelledby="vr-h">
      <h2 class="h3" id="vr-h">${icon('badge-check')}${esc(V.valid.title)}</h2><p>${esc(V.valid.text(l.name, formatDate(l.renewsOn)))}</p>
      ${l.visible === false ? '' : `<p><a href="#/connect/${esc(l.id)}">${esc(V.profile)}</a></p>`}
      <div class="verify-cert">${certificate({ orgName: l.name, certNo: l.certNo, issuedOn: l.accreditedOn, renewsOn: l.renewsOn })}</div>
    </section>`;
}

export function render(ctx) {
  const n = ctx.params.certNo ?? '';
  return `
    ${pageHero(V.hero)}
    <section class="section"><div class="container verify-page">
      <form class="verify-form" data-verify novalidate>
        <div class="field">
          <label class="field__label" for="cert-no">${esc(V.label)}</label>
          <input class="input" id="cert-no" name="cert" value="${esc(n)}" autocomplete="off" aria-describedby="cert-no-hint" spellcheck="false">
          <p class="field__hint" id="cert-no-hint">${esc(V.hint)}</p>
          <p class="field__error" id="cert-no-err" hidden></p>
        </div>
        <div><button type="submit" class="btn btn--action">${icon('shield-check')}${esc(V.check)}</button></div>
      </form>
      ${n ? '' : `<p class="text-2">${esc(V.examples)}: ${EXAMPLES.map((x) => `<a href="#/verify/${x}">${x}</a>`).join(' · ')}</p>`}
      <div aria-live="polite">${result(ctx)}</div>
    </div></section>`;
}

export function bind(root) {
  const form = root.querySelector('[data-verify]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = form.elements.cert.value.trim();
    const err = form.querySelector('#cert-no-err');
    if (!v) {
      err.hidden = false; err.textContent = V.need;
      form.elements.cert.setAttribute('aria-invalid', 'true');
      form.elements.cert.setAttribute('aria-describedby', 'cert-no-hint cert-no-err');
      form.elements.cert.focus();
      return;
    }
    navigate(`/verify/${encodeURIComponent(v.toUpperCase())}`);
  });
}
