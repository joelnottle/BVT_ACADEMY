// Requirement row (By area, List view, module page) and board card (By next action). §8.5.
// The whole row is one link; chips are icon + label.
import { esc, formatDate, effortLabel } from '../util.js';
import { icon } from './icon.js';
import { statusChip, typeChip, reasonTag } from './chips.js';

export function reqRow(x, { showArea = false } = {}) {
  return `
    <li class="req-row">
      <a class="req-row__link" href="${esc(x.href)}">
        <span class="req-row__main">
          <span class="req-row__title"><span class="req-row__code">${esc(x.id)}</span> ${esc(x.title)}</span>
          ${showArea ? `<span class="req-row__meta">${esc(x.areaName)}</span>` : ''}
        </span>
        <span class="req-row__chips">${typeChip(x.type)}${statusChip(x.status)}</span>
        <span class="req-row__effort">${icon('clock')}${esc(effortLabel(x.effortHrs))}</span>
        ${icon('chevron-right')}
      </a>
    </li>`;
}

export function boardCard(x) {
  return `
    <li class="card card--interactive board-card">
      <a class="card__link board-card__title" href="${esc(x.href)}"><span class="req-row__code">${esc(x.id)}</span> ${esc(x.title)}</a>
      <span class="board-card__area">${esc(x.areaName)}</span>
      ${x.tag ? `<span>${reasonTag(x.tag.reason, { n: x.tag.n })}</span>` : ''}
      ${x.lastActivity ? `<span class="board-card__activity">${icon('history')}${esc(x.lastActivity.text)} · ${esc(formatDate(x.lastActivity.on))}</span>` : ''}
    </li>`;
}
