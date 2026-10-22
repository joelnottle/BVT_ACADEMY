// #/app/settings(/billing) — Organisation details and Billing & credits, reached from the account menu.
// Read-only in the prototype; balances link to where they can be topped up or extended.
import { TIERS, fmtCredits } from '../../../data/copy.js';
import { CHECKS } from '../../../data/checks.js';
import { esc, formatDate } from '../../util.js';
import { icon } from '../../components/icon.js';
import { openTopUp } from './aliPanel.js';

const TABS = [['/app/settings', 'Organisation'], ['/app/settings/billing', 'Billing & credits']];

const row = (k, v) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`;

function organisation(org, persona) {
  return `
    <section class="card stack" aria-labelledby="set-org-h">
      <h2 class="h3" id="set-org-h">Organisation</h2>
      <dl class="settings-list">
        ${row('Name', esc(org.name))}${row('ABN', esc(org.abn ?? '—'))}
        ${row('Staff', esc(org.staff ?? '—'))}${row('Location', esc([org.city, org.state].filter(Boolean).join(' ') || '—'))}
        ${row('Authorised lead', esc(org.lead?.name ?? persona.name))}${row('Check', esc(CHECKS[org.checkId]?.name ?? ''))}
      </dl>
      <p class="text-3">${icon('info')} To change these details, contact BVT. Your Connect profile is edited separately.</p>
      <p><a class="btn btn--outline" href="#/app/connect-profile">${icon('building')}Edit Connect profile</a></p>
    </section>`;
}

function billing(org) {
  // TODO(client): package prices, top-up and extension prices, and invoices (Doc 3, §14 Q6)
  return `
    <section class="card stack" aria-labelledby="set-bill-h">
      <h2 class="h3" id="set-bill-h">Billing &amp; credits</h2>
      <dl class="settings-list">
        ${row('Package', `${esc(TIERS[org.tier].label)} · ${TIERS[org.tier].months} months`)}
        ${row('Enrolled', esc(formatDate(org.enrolledOn)))}${row('Finish by', esc(formatDate(org.endsOn)))}
        ${row('Ask Ali credits', `${esc(fmtCredits(org.credits.ali))} <button type="button" class="link-btn" data-topup>Top up</button>`)}
        ${row('Mentor sessions', `${esc(org.credits.mentor)} <a href="#/app/mentoring">Mentoring</a>`)}
        ${row('Extensions', org.extensions?.length ? org.extensions.map((x) => `${x.months} month${x.months === 1 ? '' : 's'} · ${esc(formatDate(x.on))}`).join('<br>') : 'None · <a href="#/app/plan">Plan &amp; pace</a>')}
      </dl>
      <p class="placeholder-flag">${icon('triangle-alert')}Prices, invoices and payment methods are placeholders until BVT confirms them (Doc 3).</p>
    </section>`;
}

export function render(ctx) {
  const { org, persona, params, path } = ctx;
  const tab = params.tab === 'billing' ? 'billing' : 'org';
  return `
    <div class="page settings-page">
      <header class="page-header"><h1>Settings</h1></header>
      <nav class="segmented" aria-label="Settings sections">${TABS.map(([href, label]) => `<a class="segmented__item" href="#${href}"${path === href ? ' aria-current="page"' : ''}>${esc(label)}</a>`).join('')}</nav>
      ${tab === 'billing' ? billing(org) : organisation(org, persona)}
    </div>`;
}

export function bind(root) {
  root.querySelector('[data-topup]')?.addEventListener('click', () => openTopUp());
}
