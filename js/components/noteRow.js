// Notification row (§8.18): type icon + label, title, text, date, and "New" as icon + label.
// Used on the notifications page and in the bell dropdown. data-note-id lets the portal mark it read on click.
import { NOTIFICATIONS_PAGE as N } from '../../data/account.js';
import { esc, formatDate } from '../util.js';
import { icon } from './icon.js';

export function noteRow(n, { compact = false } = {}) {
  const t = N.type[n.type] ?? N.type.milestone;
  const unread = n.read === false;
  return `
    <li class="note${unread ? ' is-unread' : ''}${compact ? ' note--compact' : ''}">
      <a class="note__link" href="#${esc(n.href)}"${n.id && !n.derived ? ` data-note-id="${esc(n.id)}"` : ''}>
        <span class="note__icon" data-type="${esc(n.type)}">${icon(t.icon)}</span>
        <span class="note__main">
          <span class="note__meta"><span>${esc(t.label)}</span><span>${esc(formatDate(n.on))}</span>${unread ? `<span class="note__new">${icon('circle-dot')}${esc(N.newer)}</span>` : ''}</span>
          <span class="note__title">${esc(n.title)}</span>
          ${!compact && n.text ? `<span class="note__text">${esc(n.text)}</span>` : ''}
        </span>
      </a>
    </li>`;
}
