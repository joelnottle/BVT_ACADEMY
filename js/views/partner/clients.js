// #/partner/clients and /partner/clients/:orgId (§8.15). Consent-aware: without the client's consent, only
// the name and stage are shown — no tier, readiness, pace or activity.
import { PARTNER as P } from '../../../data/connectPage.js';
import { esc, formatDate } from '../../util.js';
import { icon } from '../../components/icon.js';
import { readinessRing, progressBar } from '../../components/progress.js';
import { tierBadge, pacePill } from '../../components/chips.js';
import { showToast } from '../../components/toast.js';
import { domainProgress } from '../../selectors.js';
import { partnerRows } from '../../connectSelectors.js';

const consentChip = (r) => (r.consent
  ? `<span class="chip chip--st-verified">${icon('eye')}${esc(P.consent)}</span>`
  : `<span class="chip chip--st-locked">${icon('eye-off')}${esc(P.noConsent)}</span>`);
const dash = '<span class="text-3">—</span>';

function table(rows) {
  return `
    <div class="data-table-wrap"><table class="data-table client-table"><caption class="sr-only">Referred clients</caption>
      <thead><tr>${P.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((r) => `
        <tr>
          <td data-label="${P.cols[0]}"><a class="client-link" href="#/partner/clients/${esc(r.orgId ?? r.id)}"><strong>${esc(r.name)}</strong></a><br>${consentChip(r)}</td>
          <td data-label="${P.cols[1]}">${r.consent && r.checkName ? esc(r.checkName) : dash}</td>
          <td data-label="${P.cols[2]}">${r.consent && r.tier ? tierBadge(r.tier, { showMonths: false }) : dash}</td>
          <td data-label="${P.cols[3]}">${r.consent && r.readiness != null && ['in-progress', 'enrolled', 'accredited'].includes(r.stage) ? `${r.readiness}%` : dash}</td>
          <td data-label="${P.cols[4]}">${r.consent && r.pace ? pacePill(r.pace) : dash}</td>
          <td data-label="${P.cols[5]}">${r.consent && r.lastActivity ? esc(formatDate(r.lastActivity)) : dash}</td>
          <td data-label="${P.cols[6]}"><span class="chip chip--type">${esc(r.stageLabel)}</span></td>
        </tr>`).join('')}</tbody></table></div>`;
}

function detail(ctx, r) {
  const live = ctx.state.orgs[r.orgId];
  if (!r.consent) {
    return `
      <header class="page-header"><p class="eyebrow">Client</p><h1>${esc(r.name)}</h1></header>
      <p class="callout">${icon('eye-off')}<span>${esc(P.noConsentText(r.stageLabel))}</span></p>
      <p class="text-2">Referred ${esc(formatDate(r.referredOn))} · ${esc(r.contact)}</p>
      <div><button type="button" class="btn btn--outline" data-ask-consent>${icon('send')}${esc(P.ask)}</button></div>`;
  }
  return `
    <header class="page-header"><p class="eyebrow">Client · ${esc(r.stageLabel)}</p><h1>${esc(r.name)}</h1><p class="text-2">Referred ${esc(formatDate(r.referredOn))} · ${esc(r.contact)}</p></header>
    <div class="partner-top">
      <section class="card client-summary" aria-labelledby="cl-h">
        <h2 class="sr-only" id="cl-h">Progress</h2>
        ${readinessRing({ verified: r.readiness ?? 0, total: 100, legend: false, description: `${r.readiness ?? 0}% of requirements verified.` })}
        <div class="stack stack-sm">
          ${r.tier ? `<div class="cluster">${tierBadge(r.tier, { showMonths: false })}</div>` : ''}
          ${r.checkName ? `<p class="text-2">${esc(r.checkName)}</p>` : ''}
          ${r.pace ? `<div class="cluster">${pacePill(r.pace)}</div>` : ''}
          ${r.lastActivity ? `<p class="text-3">Last activity ${esc(formatDate(r.lastActivity))}</p>` : ''}
        </div>
      </section>
      ${live ? `<section class="card stack" aria-labelledby="cl-a-h"><h2 class="h3" id="cl-a-h">By area</h2>
        ${domainProgress(ctx.state, live).filter((d) => d.total).map((d) => progressBar({ label: d.name, value: d.verified, max: d.total })).join('')}</section>` : ''}
    </div>
    <p class="text-3">${icon('shield-check')} ${esc(P.consentNote)}</p>`;
}

export function render(ctx) {
  const rows = partnerRows(ctx.state, ctx.persona.partnerId, ctx.today);
  const id = ctx.params.orgId;
  if (id) {
    const r = rows.find((x) => (x.orgId ?? x.id) === id);
    return `<div class="page partner-page">
      <nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="#/partner/clients">Clients</a></li><li><span aria-current="page">${esc(r?.name ?? 'Client')}</span></li></ol></nav>
      ${r ? detail(ctx, r) : '<h1>Client not found</h1><p><a href="#/partner/clients">Back to clients</a></p>'}</div>`;
  }
  return `
    <div class="page partner-page">
      <header class="page-header"><h1>Clients</h1><p class="lead">${esc(P.consentNote)}</p></header>
      <div class="cluster"><a class="btn btn--action" href="#/partner/refer">${icon('user-plus')}${esc(P.refer)}</a></div>
      ${table(rows)}
    </div>`;
}

export function bind(root) {
  root.querySelector('[data-ask-consent]')?.addEventListener('click', () => showToast(P.askToast, { text: P.askText, iconName: 'send' }));
}

