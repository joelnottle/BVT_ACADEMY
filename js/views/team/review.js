// #/team/review/:reviewId — the split review screen (§8.16). Left: criteria checklist, the organisation's note,
// submission history and the assistive Ali pre-check. Right: evidence preview and the decision.
// Conflict guard: if this verifier has mentored the organisation, Verify / Request changes are disabled.
import { REVIEW as R } from '../../../data/backoffice.js';
import { COMMENT_TEMPLATES } from '../../../data/reviews.js';
import { REQ_BY_ID } from '../../../data/requirements.js';
import { TEAM } from '../../../data/users.js';
import { esc, formatDate } from '../../util.js';
import { icon } from '../../components/icon.js';
import { statusChip } from '../../components/chips.js';
import { tabs, bindTabs } from '../../components/tabs.js';
import { openModal } from '../../components/modal.js';
import { showToast } from '../../components/toast.js';
import { navigate } from '../../router.js';
import { getState, currentPersona, today } from '../../store.js';
import { mentorConflict, orgById, reviewQueue } from '../../selectors.js';
import { decideReview, assignReview } from '../../reqStore.js';

const kb = (n) => (n >= 1024 ? `${(n / 1024).toFixed(1)} MB` : `${n} KB`);

function docPreview(name, size) {
  return `
    <figure class="doc-mock" aria-label="Preview of ${esc(name)}">
      <div class="doc-mock__page" aria-hidden="true">
        <span class="doc-mock__title"></span>${Array.from({ length: 9 }, (_, i) => `<span class="doc-mock__line" style="width:${[92, 86, 95, 70, 88, 80, 94, 60, 76][i]}%"></span>`).join('')}
        <span class="doc-mock__sign"></span>
      </div>
      <figcaption>${icon('file')} ${esc(name)}${size ? ` · ${kb(size)}` : ''}</figcaption>
    </figure>`;
}

function evidencePanel(state, r, req) {
  const files = r.evidenceIds.map((id) => state.evidence.find((e) => e.id === id)).filter(Boolean);
  const list = files.length ? files : [{ id: 'sample', fileName: `${req.id.toLowerCase()}-evidence.pdf`, sizeKb: null }];
  return `
    <section class="card stack" aria-labelledby="rv-ev-h">
      <h2 class="h3" id="rv-ev-h">${esc(R.evidence)}</h2>
      ${list.length > 1
        ? tabs({ label: 'Evidence files', items: list.map((f, i) => ({ id: `f${i}`, label: f.fileName.length > 26 ? `${f.fileName.slice(0, 24)}…` : f.fileName, panel: docPreview(f.fileName, f.sizeKb) })) })
        : docPreview(list[0].fileName, list[0].sizeKb)}
      <p class="text-3">${icon('info')} ${esc(files.length ? R.previewNote : R.noEvidence)}</p>
    </section>`;
}

function decisionPanel(r, org, conflict) {
  if (r.status !== 'in-review') {
    return `<section class="card stack" aria-labelledby="rv-dec-h"><h2 class="h3" id="rv-dec-h">${esc(R.decision)}</h2>
      <div class="cluster">${statusChip(r.status)}</div><p class="text-2">${esc(R.decided(r.status, TEAM[r.verifierId]?.name ?? r.verifierId, formatDate(r.decidedOn)))}</p>
      ${r.comment ? `<blockquote class="almost__comment"><p>${esc(r.comment)}</p></blockquote>` : ''}</section>`;
  }
  const dis = conflict ? ' disabled' : '';
  return `
    <section class="card stack" aria-labelledby="rv-dec-h">
      <h2 class="h3" id="rv-dec-h">${esc(R.decision)}</h2>
      ${conflict ? `<p class="callout callout--changes" role="note">${icon('lock')}<span><strong>${esc(R.conflictTitle)}</strong> ${esc(R.conflictText)}</span></p>` : ''}
      <form class="stack" data-decide novalidate>
        <div class="field"><label class="field__label" for="rv-tpl">${esc(R.template)}</label>
          <select class="select" id="rv-tpl"${dis}><option value="">Choose a template</option>
            <optgroup label="Almost there">${COMMENT_TEMPLATES.changes.map((t) => `<option>${esc(t)}</option>`).join('')}</optgroup>
            <optgroup label="Verified">${COMMENT_TEMPLATES.verified.map((t) => `<option>${esc(t)}</option>`).join('')}</optgroup>
          </select></div>
        <div class="field"><label class="field__label" for="rv-comment">${esc(R.comment)}</label>
          <textarea class="textarea" id="rv-comment" rows="4" aria-describedby="rv-comment-hint"${dis}></textarea>
          <p class="field__hint" id="rv-comment-hint">${esc(R.commentHint)}</p><p class="field__error" id="rv-comment-err" hidden></p></div>
        <div class="decision-actions">
          <button type="button" class="btn btn--outline" data-decide-kind="changes"${dis}>${icon('pencil-line')}${esc(R.changes)}</button>
          <button type="button" class="btn btn--action" data-decide-kind="verified"${dis}>${icon('shield-check')}${esc(R.verify)}</button>
        </div>
      </form>
    </section>`;
}

export function render(ctx) {
  const { state, params, persona } = ctx;
  const r = state.reviews.find((x) => x.id === params.reviewId);
  if (!r) return `<div class="page"><h1>Review not found</h1><p><a href="#/team/queue">${esc(R.back)}</a></p></div>`;
  const req = REQ_BY_ID[r.reqId];
  const org = orgById(state, r.orgId);
  const conflict = mentorConflict(state, persona.id, r.orgId);
  return `
    <div class="page review-page">
      <nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="#/team/queue">Review queue</a></li><li><span aria-current="page">${esc(r.reqId)} · ${esc(org?.name ?? '')}</span></li></ol></nav>
      <header class="page-header">
        <p class="eyebrow">${esc(org?.name ?? r.orgId)}</p>
        <h1><span class="req-head__code">${esc(r.reqId)}</span> ${esc(req.title)}</h1>
        <div class="cluster">
          ${statusChip(r.status)}
          <span class="chip chip--type">${icon('calendar')}Submitted ${esc(formatDate(r.submittedOn))}</span>
          ${r.fastTracked ? `<span class="chip chip--reason">${icon('fast-forward')}Fast-tracked</span>` : ''}
          ${r.status === 'in-review' && !conflict ? `<button type="button" class="btn btn--ghost" data-assign>${icon('user-check')}${esc(r.assignee === persona.id ? R.unassign : R.assign)}</button>` : ''}
        </div>
      </header>
      <div class="review-split">
        <div class="stack stack-lg">
          <section class="card stack" aria-labelledby="rv-cr-h">
            <h2 class="h3" id="rv-cr-h">${esc(R.criteria)}</h2>
            <p class="text-2">${esc(R.criteriaHint)}</p>
            <fieldset class="fieldset"><legend class="sr-only">${esc(R.criteria)}</legend>
              <ul class="checklist">${req.criteria.map((c, i) => `<li><label class="check"><input type="checkbox" id="crit-${i}"${r.status === 'verified' ? ' checked disabled' : ''}><span class="check__text">${esc(c)}</span></label></li>`).join('')}</ul></fieldset>
          </section>
          <section class="card stack precheck" aria-labelledby="rv-ai-h">
            <div class="dash-row"><h2 class="h3" id="rv-ai-h">${icon('sparkles')}${esc(R.precheck)}</h2><span class="chip chip--reason">${esc(R.precheckTag)}</span></div>
            <ul class="precheck__list">${r.aiPrecheck.map((p) => `<li class="${p.pass ? 'is-pass' : 'is-miss'}">${icon(p.pass ? 'circle-check' : 'circle-x')}<span>${esc(p.label)} <span class="precheck__state">· ${p.pass ? 'found' : 'not found'}</span></span></li>`).join('')}</ul>
            <p class="text-3">${esc(R.precheckNote)}</p>
          </section>
          <section class="card stack" aria-labelledby="rv-note-h">
            <h2 class="h3" id="rv-note-h">${esc(R.orgNote)}</h2>
            <p class="text-2">${esc(r.orgNote || R.noNote)}</p>
            ${r.fastTracked ? `<p class="callout">${icon('fast-forward')}<span>${esc(R.fastTracked)}</span></p>` : ''}
            <h3 class="card__title">${esc(R.history)}</h3>
            <ol class="ticks rv-history">${r.history.map((h) => `<li>${icon(h.by === 'org' ? 'send' : 'shield-check')}<span>${esc(formatDate(h.on))} · ${esc(h.text)}</span></li>`).join('')}</ol>
          </section>
        </div>
        <div class="stack stack-lg">
          ${evidencePanel(state, r, req)}
          ${decisionPanel(r, org, conflict)}
        </div>
      </div>
    </div>`;
}

export function bind(root, ctx) {
  bindTabs(root);
  const r = getState().reviews.find((x) => x.id === ctx.params.reviewId);
  if (!r) return;
  root.querySelector('[data-assign]')?.addEventListener('click', () => assignReview(r.id, currentPersona().id));
  const form = root.querySelector('[data-decide]');
  if (!form) return;
  const comment = form.querySelector('#rv-comment');
  form.querySelector('#rv-tpl').addEventListener('change', (e) => { if (e.target.value) { comment.value = e.target.value; comment.focus(); comment.setSelectionRange(comment.value.length, comment.value.length); } });
  form.querySelectorAll('[data-decide-kind]').forEach((b) => b.addEventListener('click', () => {
    const kind = b.dataset.decideKind;
    const text = comment.value.trim();
    const err = form.querySelector('#rv-comment-err');
    const bad = kind === 'changes' && (!text || text.endsWith('…'));
    err.hidden = !bad;
    err.textContent = bad ? R.needComment : '';
    comment.setAttribute('aria-invalid', String(bad));
    comment.setAttribute('aria-describedby', bad ? 'rv-comment-hint rv-comment-err' : 'rv-comment-hint');
    if (bad) { comment.focus(); return; }
    const org = orgById(getState(), r.orgId);
    openModal({
      title: kind === 'verified' ? R.confirmVerify : R.confirmChanges,
      body: `<p>${esc(R.confirmText(org?.name ?? ''))}</p>${text ? `<blockquote class="almost__comment"><p>${esc(text)}</p></blockquote>` : ''}`,
      actions: [{ label: 'Cancel', value: 'cancel', variant: 'outline' }, { label: kind === 'verified' ? R.verify : R.changes, value: 'go', variant: 'action' }],
      onAction(v) {
        if (v !== 'go') return;
        const next = reviewQueue(getState(), currentPersona().id, today()).find((x) => x.id !== r.id && !x.conflict);
        navigate(next ? `/team/review/${next.id}` : '/team/queue');
        decideReview(r.id, kind, { verifierId: currentPersona().id, comment: text });
        showToast(R.done(r.reqId, kind), { text: `${R.doneText}${next ? ` ${R.next}: ${next.reqId}.` : ''}`, iconName: kind === 'verified' ? 'shield-check' : 'pencil-line' });
      },
    });
  }));
}
