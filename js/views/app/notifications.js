// #/app/notifications (§8.18): reminders worked out from the date and balances, then stored notifications
// (new first), and a Mock emails tab showing the nudge strategy as rendered emails. Nothing is ever sent.
import { NOTIFICATIONS_PAGE as N } from '../../../data/account.js';
import { MOCK_EMAILS } from '../../../data/notifications.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { tabs, bindTabs } from '../../components/tabs.js';
import { noteRow } from '../../components/noteRow.js';
import { showToast } from '../../components/toast.js';
import { derivedReminders } from '../../accountSelectors.js';
import { markAllRead } from '../../accountStore.js';

function emailCard(m, persona, org) {
  const fill = (s) => s.replaceAll('{name}', persona.name.split(' ')[0]).replaceAll('{org}', org.name);
  return `
    <li class="email">
      <dl class="email__head">
        <div><dt>From</dt><dd>${esc(N.from)}</dd></div>
        <div><dt>To</dt><dd>${esc(persona.name)}</dd></div>
        <div><dt>Subject</dt><dd><strong>${esc(fill(m.subject))}</strong></dd></div>
      </dl>
      <div class="email__body">
        <p>${esc(fill(m.preview))}</p>
        <p><span class="email__cta">${esc(N.open)}</span></p>
      </div>
    </li>`;
}

export function render(ctx) {
  const { state, org, persona, today } = ctx;
  const mine = state.notifications.filter((n) => n.orgId === org.id).sort((a, b) => b.on.localeCompare(a.on));
  const reminders = derivedReminders(state, org, today).map((r) => ({ ...r, derived: true }));
  const fresh = mine.filter((n) => !n.read);
  const earlier = mine.filter((n) => n.read);
  const group = (title, list, id) => (list.length ? `<section aria-labelledby="${id}"><h2 class="h3" id="${id}">${esc(title)}</h2><ul class="note-list">${list.map((n) => noteRow(n)).join('')}</ul></section>` : '');
  const panel = `
    <div class="stack stack-lg">
      ${fresh.length ? `<div class="cluster"><button type="button" class="btn btn--outline" data-mark-all data-focus-key="mark-all">${icon('check-check')}${esc(N.markAll)}</button></div>` : ''}
      ${group(N.reminders, reminders, 'n-rem')}
      ${group(N.newer, fresh, 'n-new')}
      ${group(N.earlier, earlier, 'n-old')}
      ${!mine.length && !reminders.length ? `<p class="text-2">${esc(N.none)}</p>` : ''}
    </div>`;
  const emails = `<p class="text-2">${icon('shield-check')} ${esc(N.emailsLead)}</p><ul class="email-list">${MOCK_EMAILS.map((m) => emailCard(m, persona, org)).join('')}</ul>`;
  return `
    <div class="page notes-page">
      <header class="page-header"><h1>Notifications</h1><p class="lead">${esc(N.lead)}</p></header>
      ${tabs({ label: 'Notifications', items: [{ id: 'all', label: N.tabs.all, count: fresh.length, panel }, { id: 'emails', label: N.tabs.emails, count: MOCK_EMAILS.length, panel: emails }] })}
    </div>`;
}

export function bind(root) {
  bindTabs(root);
  root.querySelector('[data-mark-all]')?.addEventListener('click', () => {
    markAllRead();
    showToast('All caught up', { text: 'Every notification is marked as read.', iconName: 'check-check' });
  });
}
