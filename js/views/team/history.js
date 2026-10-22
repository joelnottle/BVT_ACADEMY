// #/team/history — every verification decision, newest first (§8.16).
import { HISTORY as H } from '../../../data/backoffice.js';
import { TEAM } from '../../../data/users.js';
import { REQ_BY_ID } from '../../../data/requirements.js';
import { esc, formatDate } from '../../util.js';
import { icon } from '../../components/icon.js';
import { statusChip } from '../../components/chips.js';
import { replaceHash } from '../../router.js';
import { orgById } from '../../selectors.js';

export function render(ctx) {
  const { state, query, persona } = ctx;
  const decided = state.reviews.filter((r) => r.decidedOn && (!query.mine || r.verifierId === persona.id))
    .sort((a, b) => b.decidedOn.localeCompare(a.decidedOn));
  return `
    <div class="page">
      <header class="page-header"><p class="eyebrow">BVT verification team</p><h1>Decision history</h1><p class="lead">${esc(H.lead)}</p></header>
      <label class="check"><input type="checkbox" data-mine${query.mine ? ' checked' : ''}><span class="check__text">${esc(H.mine)}</span></label>
      <div class="data-table-wrap"><table class="data-table"><caption class="sr-only">Decisions</caption>
        <thead><tr>${H.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
        <tbody>${decided.map((r) => `<tr>
          <td data-label="${H.cols[0]}">${esc(formatDate(r.decidedOn))}</td>
          <td data-label="${H.cols[1]}"><a href="#/team/review/${esc(r.id)}"><span class="dash-code">${esc(r.reqId)}</span> ${esc(REQ_BY_ID[r.reqId].title)}</a></td>
          <td data-label="${H.cols[2]}">${esc(orgById(state, r.orgId)?.name ?? r.orgId)}</td>
          <td data-label="${H.cols[3]}">${statusChip(r.status)}</td>
          <td data-label="${H.cols[4]}">${esc(TEAM[r.verifierId]?.name ?? r.verifierId ?? '')}</td>
          <td data-label="${H.cols[5]}"><span class="ev-note">${esc(r.comment)}</span></td>
        </tr>`).join('')}</tbody></table></div>
      ${decided.length ? '' : `<p class="text-2">${icon('info')} No decisions yet.</p>`}
    </div>`;
}

export function bind(root) {
  root.querySelector('[data-mine]').addEventListener('change', (e) => replaceHash(`/team/history${e.target.checked ? '?mine=1' : ''}`));
}
