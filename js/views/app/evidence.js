// #/app/evidence — the evidence locker (§8.9): every document, the requirements it supports, status and the
// verifier's note. Reuse: one document can support several requirements. Filters (status, area) are in the URL.
import { EVIDENCE_PAGE as E } from '../../../data/account.js';
import { REQ } from '../../../data/reqPage.js';
import { STATUS } from '../../../data/copy.js';
import { DOMAINS } from '../../../data/domains.js';
import { REQ_BY_ID } from '../../../data/requirements.js';
import { esc, formatDate } from '../../util.js';
import { icon } from '../../components/icon.js';
import { statusChip } from '../../components/chips.js';
import { emptyState } from '../../components/feedback.js';
import { openModal } from '../../components/modal.js';
import { showToast, announce } from '../../components/toast.js';
import { replaceHash } from '../../router.js';
import { getState, setUi } from '../../store.js';
import { isLocked } from '../../selectors.js';
import { reuseEvidence, replaceEvidence } from '../../accountStore.js';

const STATUSES = ['in-review', 'changes', 'verified'];
const kb = (n) => (n >= 1024 ? `${(n / 1024).toFixed(1)} MB` : `${n} KB`);
const noteFor = (state, e) => {
  if (e.status !== 'changes') return '';
  return state.reviews.find((r) => r.status === 'changes' && r.evidenceIds.includes(e.id))?.comment ?? '';
};

function row(state, e) {
  const note = noteFor(state, e);
  return `
    <tr>
      <td data-label="${E.cols[0]}"><span class="ev-file">${icon('file')}<span><strong>${esc(e.fileName)}</strong><span class="text-3">${kb(e.sizeKb)}</span></span></span></td>
      <td data-label="${E.cols[1]}"><span class="ev-reqs">${e.requirementIds.map((id) => `<a href="#/app/req/${esc(id)}" title="${esc(REQ_BY_ID[id]?.title ?? '')}">${esc(id)}</a>`).join('')}</span></td>
      <td data-label="${E.cols[2]}">${esc(formatDate(e.uploadedOn))}</td>
      <td data-label="${E.cols[3]}">${statusChip(e.status)}</td>
      <td data-label="${E.cols[4]}">${note ? `<span class="ev-note">${esc(note)}</span>` : '<span class="text-3">—</span>'}</td>
      <td data-label="${E.cols[5]}"><span class="ev-actions">
        <button type="button" class="btn btn--ghost btn--icon" data-view="${esc(e.id)}" aria-label="${esc(E.view)} ${esc(e.fileName)}" title="${esc(E.view)}">${icon('eye')}</button>
        <button type="button" class="btn btn--ghost btn--icon" data-reuse="${esc(e.id)}" data-focus-key="reuse-${esc(e.id)}" aria-label="${esc(E.reuseAction)}: ${esc(e.fileName)}" title="${esc(E.reuseAction)}">${icon('link')}</button>
        ${e.status === 'in-review' ? '' : `<label class="btn btn--ghost btn--icon ev-replace" title="${esc(E.replace)}">${icon('replace')}<span class="sr-only">${esc(E.replace)} ${esc(e.fileName)}</span><input type="file" class="sr-only" data-replace="${esc(e.id)}"></label>`}
      </span></td>
    </tr>`;
}

export function render(ctx) {
  const { state, org, query } = ctx;
  const mine = state.evidence.filter((e) => e.orgId === org.id).sort((a, b) => b.uploadedOn.localeCompare(a.uploadedOn));
  const shown = mine.filter((e) => (!query.status || e.status === query.status)
    && (!query.area || e.requirementIds.some((id) => REQ_BY_ID[id]?.domainId === query.area)));
  const reused = mine.find((e) => e.requirementIds.length > 1);
  return `
    <div class="page evidence-page">
      <header class="page-header"><h1>Evidence locker</h1><p class="lead">${esc(E.lead)}</p></header>
      ${reused ? `<p class="callout callout--cream">${icon('copy-check')}<span><strong>${esc(E.reuseLead)}:</strong> ${esc(E.reuse(reused.fileName, reused.requirementIds.join(' and ')))}</span></p>` : ''}
      ${state.ui.vaultDismissed ? '' : `
        <section class="vault vault--slim" aria-label="${esc(REQ.vault.label)}">
          <p class="vault__label">${esc(REQ.vault.label)}</p>
          <p class="vault__text">${esc(REQ.vault.text)} <a href="#/" data-pretend="${esc(REQ.vault.pretend)}">${esc(REQ.vault.more)}</a></p>
          <button type="button" class="btn btn--ghost btn--icon" data-dismiss-vault aria-label="${esc(REQ.vault.dismiss)}">${icon('x')}</button>
        </section>`}
      <div class="ev-filters">
        <div class="field"><label class="field__label" for="ev-status">${esc(E.filters.status)}</label>
          <select class="select" id="ev-status" data-ev-filter="status"><option value="">${esc(E.filters.all)}</option>${STATUSES.map((s) => `<option value="${s}"${query.status === s ? ' selected' : ''}>${esc(STATUS[s].label)}</option>`).join('')}</select></div>
        <div class="field"><label class="field__label" for="ev-area">${esc(E.filters.area)}</label>
          <select class="select" id="ev-area" data-ev-filter="area"><option value="">${esc(E.filters.all)}</option>${DOMAINS.map((d) => `<option value="${d.id}"${query.area === d.id ? ' selected' : ''}>${esc(d.name)}</option>`).join('')}</select></div>
        <p class="ev-count" data-ev-count>${shown.length} of ${mine.length} documents</p>
      </div>
      ${!mine.length ? emptyState({ title: E.empty, text: '' })
        : !shown.length ? `<p class="text-2">${esc(E.noMatch)}</p>`
          : `<div class="data-table-wrap"><table class="data-table ev-table"><caption class="sr-only">Evidence documents</caption>
            <thead><tr>${E.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
            <tbody>${shown.map((e) => row(state, e)).join('')}</tbody></table></div>`}
    </div>`;
}

export function bind(root, ctx) {
  const { org } = ctx;
  root.querySelectorAll('[data-ev-filter]').forEach((sel) => sel.addEventListener('change', () => {
    const q = new URLSearchParams();
    root.querySelectorAll('[data-ev-filter]').forEach((s) => { if (s.value) q.set(s.dataset.evFilter, s.value); });
    replaceHash(`/app/evidence${q.toString() ? `?${q}` : ''}`);
    setTimeout(() => announce(document.querySelector('[data-ev-count]')?.textContent ?? ''), 120);
  }));
  root.querySelector('[data-dismiss-vault]')?.addEventListener('click', () => { setUi({ vaultDismissed: true }); announce('Partner suggestion dismissed'); });
  root.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => showToast(E.viewToast, { text: E.viewText, iconName: 'eye' })));
  root.querySelectorAll('[data-replace]').forEach((input) => input.addEventListener('change', () => {
    const f = input.files?.[0];
    if (!f) return;
    replaceEvidence(input.dataset.replace, f);
    showToast(E.replaced(f.name), { text: E.replacedText, iconName: 'replace' });
  }));
  root.querySelectorAll('[data-reuse]').forEach((b) => b.addEventListener('click', () => {
    const state = getState();
    const e = state.evidence.find((x) => x.id === b.dataset.reuse);
    const options = Object.keys(state.progress[org.id])
      .filter((id) => !e.requirementIds.includes(id) && !['in-review', 'verified'].includes(state.progress[org.id][id].status) && !isLocked(state, REQ_BY_ID[id], org));
    openModal({
      title: E.reuseTitle,
      body: `<p class="text-2">${esc(e.fileName)}</p>
        <div class="field"><label class="field__label" for="reuse-req">${esc(E.reuseLabel)}</label>
        <select class="select" id="reuse-req">${options.map((id) => `<option value="${id}">${esc(id)} ${esc(REQ_BY_ID[id].title)}</option>`).join('')}</select></div>`,
      actions: [{ label: 'Cancel', value: 'cancel', variant: 'outline' }, { label: 'Add to upload', value: 'reuse', variant: 'action' }],
      onAction(value) {
        if (value !== 'reuse') return;
        const reqId = document.getElementById('reuse-req').value;
        reuseEvidence(e.id, reqId);
        showToast(E.reuseToast(reqId), { text: E.reuseText, iconName: 'link' });
      },
    });
  }));
}
