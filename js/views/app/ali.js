// #/app/ali — Ask Ali full page (§8.10): credits, conversation history grouped by requirement, saved answers.
import { ALI } from '../../../data/copy.js';
import { ALI_UI as U } from '../../../data/ali.js';
import { REQ_BY_ID } from '../../../data/requirements.js';
import { esc, formatDate } from '../../util.js';
import { icon } from '../../components/icon.js';
import { emptyState } from '../../components/feedback.js';
import { showToast } from '../../components/toast.js';
import { answerFor, pinAnswer } from '../../supportStore.js';
import { openTopUp } from './aliPanel.js';

function entry(e) {
  return `
    <li class="ali-entry">
      <p class="ali-entry__q">${icon('message-circle')}<span>${esc(e.q)}</span></p>
      <p class="ali-entry__a">${esc(answerFor(e))}</p>
      <p class="ali-entry__meta"><span>${esc(formatDate(e.on))}</span>
        ${e.reqId ? (e.pinned
          ? `<span class="chip chip--st-verified" tabindex="-1" data-focus-key="pin-${esc(e.id)}">${icon('check')}${esc(U.pinned)}</span>`
          : `<button type="button" class="link-btn" data-pin="${esc(e.id)}" data-focus-key="pin-${esc(e.id)}">${icon('pin')}${esc(U.pin(e.reqId))}</button>`) : ''}</p>
    </li>`;
}

export function render(ctx) {
  const { state, org } = ctx;
  const all = [...(state.ali[org.id] ?? [])].sort((a, b) => b.on.localeCompare(a.on));
  const groups = [...new Set(all.map((e) => e.reqId ?? ''))].map((reqId) => ({ reqId, items: all.filter((e) => (e.reqId ?? '') === reqId) }));
  const saved = all.filter((e, i) => e.pinned && all.findIndex((x) => x.pinned && x.reqId === e.reqId && x.q === e.q) === i);
  return `
    <div class="page ali-page">
      <header class="page-header"><h1>${esc(U.title)}</h1><p class="lead">${esc(U.page.lead)}</p></header>
      <section class="card ali-credits" aria-labelledby="ali-credits-h">
        <div><h2 class="dash-title" id="ali-credits-h">${esc(U.page.credits)}</h2><p class="dash-big">${icon('sparkles')}${esc(ALI.creditLine(org.credits.ali))}</p></div>
        <div class="cluster">
          <button type="button" class="btn btn--action" data-open-ali>${icon('message-circle')}${esc(U.page.ask)}</button>
          <button type="button" class="btn btn--outline" data-topup>${icon('plus')}${esc(U.topUp)}</button>
        </div>
        <p class="text-3">${icon('shield-check')} ${esc(ALI.footer)} ${esc(ALI.privacy)}</p>
      </section>
      <div class="ali-grid">
        <div class="ali-history">
          ${groups.length ? groups.map((g) => `
            <section class="card" aria-labelledby="ag-${esc(g.reqId || 'general')}">
              <h2 class="h3" id="ag-${esc(g.reqId || 'general')}">${g.reqId ? `<a href="#/app/req/${esc(g.reqId)}"><span class="dash-code">${esc(g.reqId)}</span> ${esc(REQ_BY_ID[g.reqId].title)}</a>` : esc(U.page.general)}</h2>
              <ul class="ali-entries">${g.items.map(entry).join('')}</ul>
            </section>`).join('') : emptyState({ title: U.page.none, text: '', action: `<button type="button" class="btn btn--action" data-open-ali>${esc(U.page.ask)}</button>` })}
        </div>
        <aside class="card ali-saved" aria-labelledby="ali-saved-h">
          <h2 class="h3" id="ali-saved-h">${icon('pin')}${esc(U.page.saved)}</h2>
          ${saved.length ? `<ul class="ali-saved__list">${saved.map((e) => `<li><a href="#/app/req/${esc(e.reqId)}"><span class="dash-code">${esc(e.reqId)}</span> ${esc(e.q)}</a></li>`).join('')}</ul>` : `<p class="text-2">${esc(U.page.savedNone)}</p>`}
        </aside>
      </div>
    </div>`;
}

export function bind(root) {
  root.querySelector('[data-topup]')?.addEventListener('click', () => openTopUp());
  root.querySelectorAll('[data-pin]').forEach((b) => b.addEventListener('click', () => {
    const e = pinAnswer(b.dataset.pin);
    if (e) showToast(U.pinnedToast(e.reqId), { iconName: 'pin' });
  }));
}
