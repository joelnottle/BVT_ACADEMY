// #/connect/:orgId — a public BVT Connect profile (§8.13) with a "Verify this certificate" link.
import { PROFILE as P } from '../../../data/connectPage.js';
import { esc, formatDate } from '../../util.js';
import { icon } from '../../components/icon.js';
import { showToast } from '../../components/toast.js';
import { listingById } from '../../connectSelectors.js';

export function render(ctx) {
  const l = listingById(ctx.state, ctx.today, ctx.params.orgId);
  if (!l || l.visible === false) {
    return `<section class="section"><div class="container stack"><h1 class="h2">${esc(P.notFound)}</h1><p class="text-2">${esc(P.notFoundText)}</p>
      <p><a class="btn btn--action" href="#/connect">${esc(P.back)}</a></p></div></section>`;
  }
  const valid = l.status === 'valid';
  return `
    <section class="cx-profile-hero on-dark">
      <div class="container cx-profile-hero__inner">
        <nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="#/connect">BVT Connect</a></li><li><span aria-current="page">${esc(l.name)}</span></li></ol></nav>
        <h1 class="h1">${esc(l.name)}</h1>
        <p class="lead">${esc([l.industry, `${l.city} ${l.state}`.trim(), l.size].filter(Boolean).join(' · '))}</p>
        <div class="cluster">${valid ? `<span class="chip chip--st-verified">${icon('badge-check')}BVT Accredited</span>` : `<span class="chip chip--st-locked">${icon('clock')}Certificate expired</span>`}</div>
      </div>
    </section>
    <section class="section">
      <div class="container cx-profile">
        <div class="stack stack-lg">
          ${l.description ? `<section aria-labelledby="cx-about"><h2 class="h3" id="cx-about">${esc(P.about)}</h2><p class="text-2">${esc(l.description)}</p></section>` : ''}
          ${l.capabilities?.length ? `<section aria-labelledby="cx-cap"><h2 class="h3" id="cx-cap">${esc(P.capabilities)}</h2><ul class="pill-list">${l.capabilities.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></section>` : ''}
          <section aria-labelledby="cx-contact" class="stack stack-sm"><h2 class="h3" id="cx-contact">${esc(P.contact)}</h2>
            ${l.contact ? `<p>${icon('user')} ${esc(l.contact)}</p>` : ''}
            <div><button type="button" class="btn btn--outline" data-cx-contact>${icon('mail')}${esc(P.contactVia)}</button></div></section>
        </div>
        <aside class="card stack cx-cert" aria-labelledby="cx-cert-h">
          <h2 class="dash-title" id="cx-cert-h">${esc(P.cert)}</h2>
          <p class="dash-big">${icon('award')}${esc(l.certNo)}</p>
          <p class="text-2">${esc(P.accredited(formatDate(l.accreditedOn)))}<br>${esc(valid ? P.renews(formatDate(l.renewsOn)) : P.expired(formatDate(l.renewsOn)))}</p>
          <a class="btn btn--action" href="#/verify/${esc(l.certNo)}">${icon('shield-check')}${esc(P.verify)}</a>
        </aside>
      </div>
    </section>`;
}

export function bind(root) {
  root.querySelector('[data-cx-contact]')?.addEventListener('click', () => showToast(P.contactToast, { text: P.contactText, iconName: 'mail' }));
}
