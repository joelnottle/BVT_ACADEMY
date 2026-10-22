// #/app/enterprise(/:section) — the Enterprise hub (BUILD_PLAN §8.14). Opens after accreditation, from 1 July 2027.
// Sections: overview, team, micro-units (+ enrol), checks, purchases. No subscription — pay as needed.
import { HUB, CHECKS_PAGE as CK } from '../../../data/enterprise.js';
import { TIERS } from '../../../data/copy.js';
import { FURTHER_CHECKS, PURCHASES } from '../../../data/microunits.js';
import { esc, formatDate, addMonths, daysBetween } from '../../util.js';
import { icon } from '../../components/icon.js';
import { openModal } from '../../components/modal.js';
import { showToast } from '../../components/toast.js';
import { enterpriseOpen, isAccredited } from '../../selectors.js';
import { buyItem } from '../../enterpriseStore.js';
import { teamSection, microSection, enrolSection, bindTeam } from './enterpriseTeam.js';

const money = (n) => (n == null ? HUB.price : `$${n.toLocaleString('en-AU')}`);

function sectionNav(current) {
  return `<nav class="segmented hub-nav" aria-label="Enterprise hub sections">${HUB.sections.map(([id, label, ic]) => `
    <a class="segmented__item" href="#/app/enterprise${id ? `/${id}` : ''}"${id === current || (current === 'enrol' && id === 'micro-units') ? ' aria-current="page"' : ''}>${icon(ic)}${esc(label)}</a>`).join('')}</nav>`;
}

function overview(ctx) {
  const { org, today } = ctx;
  const due = addMonths(org.accreditedOn, 12);
  const team = org.team ?? [];
  const enrolledIds = new Set((org.microUnitEnrolments ?? []).flatMap((e) => e.memberIds));
  return `
    <div class="hub-grid">
      <section class="card stack" aria-labelledby="hub-acc-h">
        <h2 class="dash-title" id="hub-acc-h">${esc(HUB.accredited)}</h2>
        <p class="dash-big">${icon('award')}${esc(org.certNo)}</p>
        <p class="text-2">Accredited ${esc(formatDate(org.accreditedOn))}. <a href="#/app/accreditation">View certificate</a></p>
      </section>
      <section class="card card--highlight stack" aria-labelledby="hub-re-h">
        <h2 class="dash-title" id="hub-re-h">${esc(HUB.reassessment)}</h2>
        <p class="dash-big">${icon('calendar-clock')}${esc(formatDate(due))}</p>
        <p class="text-2">${esc(HUB.reassessmentText(daysBetween(today, due)))}</p>
        ${org.reassessmentPurchasedOn
          ? `<p class="callout callout--ok">${icon('circle-check')}<span>${esc(HUB.reassessmentBooked(formatDate(org.reassessmentPurchasedOn)))}</span></p>`
          : `<div><button type="button" class="btn btn--action" data-buy="reassessment">${icon('refresh-cw')}${esc(HUB.buyReassessment)}</button></div>`}
      </section>
      <section class="card stack" aria-labelledby="hub-score-h">
        <h2 class="dash-title" id="hub-score-h">${esc(HUB.score)}</h2>
        <p class="dash-big">${icon('clipboard-check')}${org.checkScore}%</p>
        <p class="text-2">${esc(HUB.scoreSub(TIERS[org.tier].label))}</p>
        <a class="dash-link" href="#/app/score">${esc(HUB.scoreLink)}${icon('arrow-right')}</a>
      </section>
      <section class="card stack" aria-labelledby="hub-team-h">
        <h2 class="dash-title" id="hub-team-h">Team</h2>
        <p class="dash-big">${icon('users')}${team.length}</p>
        <p class="text-2">${esc(HUB.teamSummary(team.filter((m) => m.status === 'active').length, team.filter((m) => m.status === 'invited').length, enrolledIds.size))}</p>
        <a class="dash-link" href="#/app/enterprise/team">Invite and manage${icon('arrow-right')}</a>
      </section>
    </div>
    <p class="callout callout--cream">${icon('badge-dollar-sign')}<span><strong>${esc(HUB.noSubscription)}</strong></span></p>
    <section class="card stack hub-soon" aria-labelledby="hub-ali-h">
      <div class="dash-row"><h2 class="h3" id="hub-ali-h">${icon('sparkles')}${esc(HUB.resultsTitle)}</h2><span class="chip chip--st-not-started">${icon('clock')}${esc(HUB.resultsSoon)}</span></div>
      <ul class="ticks">${HUB.resultsItems.map((t) => `<li>${icon('check')}<span>${esc(t)}</span></li>`).join('')}</ul>
    </section>`;
}

function checks() {
  return `
    <p class="text-2">${esc(CK.lead)}</p>
    <ul class="hub-cards">${FURTHER_CHECKS.map((c) => `
      <li class="card stack">
        <span class="chip ${c.status === 'available' ? 'chip--st-verified' : 'chip--st-not-started'}">${icon(c.status === 'available' ? 'circle-check' : 'clock')}${esc(c.status === 'available' ? CK.available : CK.soon)}</span>
        <h2 class="h3">${esc(c.name)}</h2>
        ${c.status === 'available' ? `<div><button type="button" class="btn btn--outline" data-start-check="${esc(c.id)}">${esc(CK.start)}<span class="sr-only">: ${esc(c.name)}</span></button></div>` : ''}
      </li>`).join('')}</ul>`;
}

function purchases(org) {
  const history = [...(org.purchases ?? [])].reverse();
  return `
    <p class="text-2">${esc(HUB.noSubscription)}</p>
    <ul class="hub-cards">${PURCHASES.map((p) => `
      <li class="card stack"><h2 class="card__title">${esc(p.title)}</h2><p class="text-2">${esc(money(p.price))}</p>
        <div><button type="button" class="btn btn--outline" data-buy="${esc(p.id)}">Buy (demo)<span class="sr-only">: ${esc(p.title)}</span></button></div></li>`).join('')}</ul>
    <section class="stack" aria-labelledby="hub-hist-h">
      <h2 class="h3" id="hub-hist-h">Purchase history</h2>
      ${history.length ? `<div class="data-table-wrap"><table class="data-table"><caption class="sr-only">Purchases</caption>
        <thead><tr><th scope="col">Date</th><th scope="col">Item</th><th scope="col">Amount</th></tr></thead>
        <tbody>${history.map((h) => `<tr><td data-label="Date">${esc(formatDate(h.on))}</td><td data-label="Item">${esc(h.title)}</td><td data-label="Amount">${esc(money(h.amount))}</td></tr>`).join('')}</tbody></table></div>`
        : '<p class="text-2">No purchases yet.</p>'}
    </section>`;
}

export function render(ctx) {
  const { org, today, params } = ctx;
  if (!enterpriseOpen(org, today)) {
    return `<div class="page"><header class="page-header"><p class="eyebrow">${esc(HUB.badge)}</p><h1>Enterprise hub</h1></header>
      <p class="callout">${icon('lock')}<span><strong>${esc(HUB.locked)}</strong> ${esc(HUB.lockedWhy)} ${isAccredited(org) ? '' : '<a href="#/app/accreditation">See what’s left</a>'}</span></p></div>`;
  }
  const section = params.section ?? '';
  const body = { '': overview, team: teamSection, 'micro-units': microSection, enrol: enrolSection, checks, purchases: () => purchases(org) }[section];
  return `
    <div class="page hub-page">
      <header class="page-header"><p class="eyebrow">${esc(HUB.badge)}</p><h1>Enterprise hub</h1><p class="lead">${esc(HUB.lead)}</p></header>
      ${sectionNav(section)}
      ${body ? body(ctx) : `<p class="text-2">That section doesn’t exist. <a href="#/app/enterprise">Back to the overview</a></p>`}
    </div>`;
}

export function bind(root, ctx) {
  root.querySelectorAll('[data-buy]').forEach((b) => b.addEventListener('click', () => {
    const item = PURCHASES.find((p) => p.id === b.dataset.buy);
    openModal({
      title: `Buy: ${item.title}`,
      body: `<p>${esc(money(item.price))}</p><p class="text-3">${icon('shield-check')} ${esc(HUB.paid)}</p>`,
      actions: [{ label: 'Cancel', value: 'cancel', variant: 'outline' }, { label: 'Confirm (demo)', value: 'buy', variant: 'action' }],
      onAction(v) { if (v === 'buy') { buyItem(item.id); showToast(`Purchased: ${item.title}`, { text: HUB.paid, iconName: 'receipt' }); } },
    });
  }));
  root.querySelectorAll('[data-start-check]').forEach((b) => b.addEventListener('click', () => showToast(CK.startToast, { text: CK.startText, iconName: 'clipboard-list' })));
  bindTeam(root, ctx);
}
