// #/team/queue — the verifier's review queue (§8.16): oldest first, with age against the target, type,
// fast-track flag, the assistive Ali pre-check, and the mentor-conflict marker. Filters in the URL.
import { QUEUE as Q } from '../../../data/backoffice.js';
import { REQ_BY_ID } from '../../../data/requirements.js';
import { esc, formatDate } from '../../util.js';
import { icon } from '../../components/icon.js';
import { replaceHash } from '../../router.js';
import { reviewQueue, orgById } from '../../selectors.js';

const chip = (cls, ic, label) => `<span class="chip ${cls}">${icon(ic)}${esc(label)}</span>`;
const SLA_CLASS = { ok: 'chip--st-verified', soon: 'chip--st-evidence', over: 'chip--st-changes' };

export function render(ctx) {
  const { state, today, query, persona } = ctx;
  const all = reviewQueue(state, persona.id, today);
  const rows = all.filter((r) => (!query.type || r.type === query.type) && (!query.mine || r.assignee === persona.id));
  return `
    <div class="page queue-page">
      <header class="page-header"><p class="eyebrow">BVT verification team</p><h1>Review queue</h1><p class="lead">${esc(Q.lead)}</p></header>
      <div class="ev-filters">
        <div class="field"><label class="field__label" for="q-type">${esc(Q.filters.type)}</label>
          <select class="select" id="q-type" data-q="type"><option value="">${esc(Q.filters.all)}</option>${Object.entries(Q.types).map(([v, l]) => `<option value="${v}"${query.type === v ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
        <label class="check q-mine"><input type="checkbox" id="q-mine" data-q="mine"${query.mine ? ' checked' : ''}><span class="check__text">${esc(Q.filters.mine)}</span></label>
        <p class="ev-count">${esc(Q.waiting(rows.length))}</p>
      </div>
      ${rows.length ? `<div class="data-table-wrap"><table class="data-table queue-table"><caption class="sr-only">Evidence waiting for a decision</caption>
        <thead><tr>${Q.cols.map((c) => `<th scope="col">${c ? esc(c) : '<span class="sr-only">Action</span>'}</th>`).join('')}</tr></thead>
        <tbody>${rows.map((r) => {
          const req = REQ_BY_ID[r.reqId];
          const sla = Q.sla(r.ageDays);
          const pass = r.aiPrecheck.filter((x) => x.pass).length;
          return `<tr>
            <td data-label="${Q.cols[0]}"><strong><span class="dash-code">${esc(r.reqId)}</span> ${esc(req.title)}</strong><br><span class="text-3">${esc(Q.types[r.type] ?? r.type)}</span>
              <span class="queue-flags">${r.fastTracked ? chip('chip--reason', 'fast-forward', Q.fast) : ''}${r.conflict ? chip('chip--st-locked', 'lock', Q.conflict) : ''}${r.assignee === persona.id ? chip('chip--type', 'user-check', 'Assigned to you') : ''}</span></td>
            <td data-label="${Q.cols[1]}">${esc(orgById(state, r.orgId)?.name ?? r.orgId)}</td>
            <td data-label="${Q.cols[2]}">${chip(SLA_CLASS[sla.tone], sla.icon, sla.label)}<br><span class="text-3">Since ${esc(formatDate(r.submittedOn))}</span></td>
            <td data-label="${Q.cols[3]}">${icon('sparkles')} ${esc(Q.precheck(pass, r.aiPrecheck.length))}</td>
            <td data-label="Action"><a class="btn btn--outline" href="#/team/review/${esc(r.id)}">${esc(Q.open)}<span class="sr-only"> ${esc(r.reqId)}, ${esc(orgById(state, r.orgId)?.name ?? '')}</span></a></td>
          </tr>`;
        }).join('')}</tbody></table></div>`
        : `<p class="callout">${icon('circle-check')}<span>${esc(query.mine ? Q.noneMine : Q.none)}</span></p>`}
    </div>`;
}

export function bind(root) {
  const go = () => {
    const q = new URLSearchParams();
    const type = root.querySelector('[data-q="type"]').value;
    if (type) q.set('type', type);
    if (root.querySelector('[data-q="mine"]').checked) q.set('mine', '1');
    replaceHash(`/team/queue${q.toString() ? `?${q}` : ''}`);
  };
  root.querySelectorAll('[data-q]').forEach((el) => el.addEventListener('change', go));
}
