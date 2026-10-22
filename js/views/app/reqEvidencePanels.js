// Requirement step panels 5–7 (§8.7): Upload evidence, Verify, Closed.
// Uploads are pretend: only the file name and size are read, locally. The VC Vault prompt sits below the
// dropzone, is labelled "From our partners", never blocks anything, and stays dismissed once dismissed.
import { REQ } from '../../../data/reqPage.js';
import { FEEDBACK } from '../../../data/copy.js';
import { BADGE_BY_ID } from '../../../data/badges.js';
import { esc, formatDate } from '../../util.js';
import { icon } from '../../components/icon.js';
import { milestoneCard } from '../../components/feedback.js';
import { reasonTag } from '../../components/chips.js';
import { draftOf } from '../../reqStore.js';

const U = REQ.upload;
const V = REQ.verify;
const kb = (n) => (n >= 1024 ? `${(n / 1024).toFixed(1)} MB` : `${n} KB`);

function goodEvidence(req) {
  return `
    <div class="evidence-guide">
      <section aria-labelledby="eg-good"><h3 class="card__title" id="eg-good">${esc(U.good)}</h3>
        <ul class="ticks">${req.goodEvidence.map((g) => `<li>${icon('check')}<span>${esc(g)}</span></li>`).join('')}</ul></section>
      <details class="why"><summary>${icon('rotate-ccw')}${esc(U.returns)}</summary>
        <ul class="ticks why__list">${req.commonReturns.map((g) => `<li>${icon('circle-alert')}<span>${esc(g)}</span></li>`).join('')}</ul></details>
    </div>`;
}

function vaultPrompt() {
  return `
    <aside class="vault" aria-label="${esc(REQ.vault.label)}">
      <p class="vault__label">${esc(REQ.vault.label)}</p>
      <p class="vault__text">${esc(REQ.vault.text)} <a href="#/" data-pretend="${esc(REQ.vault.pretend)}">${esc(REQ.vault.more)}</a></p>
      <button type="button" class="btn btn--ghost btn--icon" data-dismiss-vault aria-label="${esc(REQ.vault.dismiss)}">${icon('x')}</button>
    </aside>`;
}

export function uploadPanel({ req, p, state, org, locked, review }) {
  const d = draftOf(p);
  const linked = d.linkedIds.map((id) => state.evidence.find((e) => e.id === id)).filter(Boolean);
  const count = d.files.length + linked.length;
  const revising = p.status === 'changes';
  const submitted = ['in-review', 'verified'].includes(p.status);
  if (submitted) {
    return `<p class="callout">${icon('hourglass')}<span>${esc(p.status === 'verified' ? 'This requirement is verified.' : 'Your evidence is with a verifier.')} <a href="#/app/req/${esc(req.id)}/verify">See the Verify step</a></span></p>
      ${goodEvidence(req)}`;
  }
  return `
    ${revising ? `<p class="callout callout--changes">${icon('pencil-line')}<span><strong>${esc(U.revising)}.</strong> ${esc(review?.comment ?? '')}</span></p>` : `<p class="text-2">${esc(U.lead)}</p>`}
    ${goodEvidence(req)}
    <div class="dropzone${locked ? ' is-disabled' : ''}" data-dropzone>
      ${icon('upload-cloud')}
      <label class="dropzone__label" for="evidence-files"><span class="dropzone__strong">${esc(U.drop)}</span></label>
      <input class="dropzone__input" id="evidence-files" type="file" multiple data-files aria-describedby="drop-hint"${locked ? ' disabled' : ''}>
      <p class="dropzone__hint" id="drop-hint">${esc(U.dropHint)}</p>
    </div>
    ${state.ui.vaultDismissed ? '' : vaultPrompt()}
    <div class="cluster"><button type="button" class="btn btn--outline" data-link-evidence data-focus-key="link-evidence"${locked ? ' disabled' : ''}>${icon('folder-open')}${esc(U.link)}</button></div>
    ${count ? `
      <section aria-labelledby="files-h">
        <h3 class="card__title" id="files-h">${esc(U.files)} (${count})</h3>
        <ul class="file-list">
          ${d.files.map((f) => `<li class="file-row">${icon('file')}<span class="file-row__name">${esc(f.name)}</span><span class="file-row__size">${kb(f.sizeKb)}</span>
            <button type="button" class="btn btn--ghost btn--icon" data-remove-file="${esc(f.id)}" aria-label="Remove ${esc(f.name)}">${icon('trash-2')}</button></li>`).join('')}
          ${linked.map((e) => `<li class="file-row">${icon('link')}<span class="file-row__name">${esc(e.fileName)} <span class="text-3">· from your locker</span></span><span class="file-row__size">${kb(e.sizeKb)}</span>
            <button type="button" class="btn btn--ghost btn--icon" data-unlink="${esc(e.id)}" aria-label="Unlink ${esc(e.fileName)}">${icon('x')}</button></li>`).join('')}
        </ul>
      </section>` : ''}
    ${revising ? `
      <div class="field">
        <label class="field__label" for="reply">${esc(V.replyLabel)}</label>
        <textarea class="textarea" id="reply" rows="3" data-reply>${esc(d.reply)}</textarea>
      </div>` : ''}
    <form class="stack" data-submit-form novalidate>
      <div class="field">
        <label class="check"><input type="checkbox" id="declared" data-declared${d.declared ? ' checked' : ''}${locked ? ' disabled' : ''}><span class="check__text">${esc(U.declare)}</span></label>
        <p class="field__error" id="submit-err" hidden></p>
      </div>
      <div class="step-actions"><button type="submit" class="btn btn--action" data-focus-key="submit"${locked ? ' disabled' : ''}>${icon('send')}${esc(revising ? U.resubmit : U.submit)}</button></div>
    </form>`;
}

function timeline(steps) {
  return `<ol class="timeline-v">${steps.map((t) => `
    <li class="timeline-v__item is-${t.state}"${t.state === 'current' ? ' aria-current="step"' : ''}>
      <span class="timeline-v__dot" aria-hidden="true">${icon(t.state === 'done' ? 'check' : t.icon)}</span>
      <span class="timeline-v__text"><strong>${esc(t.title)}</strong>${t.meta ? `<span>${esc(t.meta)}</span>` : ''}</span>
    </li>`).join('')}</ol>`;
}

export function verifyPanel({ req, p, review, state }) {
  if (!review || p.status === 'not-started' || p.status === 'learning' || p.status === 'evidence-needed') {
    return `<p class="text-2">${esc(V.nothing)}</p><div class="step-actions"><a class="btn btn--action" href="#/app/req/${esc(req.id)}/upload">${esc(V.toUpload)}${icon('arrow-right')}</a></div>`;
  }
  const evidence = review.evidenceIds.map((id) => state.evidence.find((e) => e.id === id)).filter(Boolean);
  const steps = [
    { title: V.submitted, meta: formatDate(review.submittedOn), state: 'done', icon: 'send' },
    { title: V.inReview, meta: p.status === 'in-review' ? FEEDBACK.reviewEstimate : '', state: p.status === 'in-review' ? 'current' : 'done', icon: 'hourglass' },
    p.status === 'verified' ? { title: 'Verified', meta: formatDate(review.decidedOn), state: 'done', icon: 'circle-check' }
      : p.status === 'changes' ? { title: FEEDBACK.changesHeading, meta: formatDate(review.decidedOn), state: 'changes', icon: 'pencil-line' }
        : { title: V.outcome, meta: V.pending, state: 'todo', icon: 'circle-dashed' },
  ];
  return `
    ${timeline(steps)}
    ${p.status === 'changes' ? `
      <section class="almost" aria-labelledby="almost-h">
        <h3 class="almost__title" id="almost-h">${icon('pencil-line')}${esc(FEEDBACK.changesHeading)}</h3>
        <blockquote class="almost__comment"><p>${esc(review.comment)}</p><footer>BVT verifier · ${esc(formatDate(review.decidedOn))}</footer></blockquote>
        <div class="field">
          <label class="field__label" for="reply">${esc(V.replyLabel)}</label>
          <textarea class="textarea" id="reply" rows="3" data-reply>${esc(draftOf(p).reply)}</textarea>
        </div>
        <div class="step-actions"><a class="btn btn--action" href="#/app/req/${esc(req.id)}/upload">${icon('upload')}${esc(V.revise)}</a></div>
      </section>` : ''}
    ${p.status === 'verified' ? `<p class="callout callout--ok">${icon('circle-check')}<span>${esc(V.verifiedText)} <a href="#/app/req/${esc(req.id)}/closed">${esc(V.toClosed)}</a></span></p>` : ''}
    ${p.status === 'in-review' ? `<p class="text-3">${icon('flask-conical')} ${esc(V.demoHint)}</p>` : ''}
    ${evidence.length ? `
      <section aria-labelledby="ev-h"><h3 class="card__title" id="ev-h">${esc(V.evidence)}</h3>
        <ul class="file-list">${evidence.map((e) => `<li class="file-row">${icon('file')}<span class="file-row__name">${esc(e.fileName)}</span><span class="file-row__size">${kb(e.sizeKb)}</span></li>`).join('')}</ul></section>` : ''}
    ${review.history?.length ? `<details class="why"><summary>${icon('history')}History</summary><ul class="ticks why__list">${review.history.map((h) => `<li>${icon('dot')}<span>${esc(formatDate(h.on))} · ${esc(h.text)}</span></li>`).join('')}</ul></details>` : ''}`;
}

export function closedPanel({ req, p, nextRec, verifiedLine }) {
  if (p.status !== 'verified') return `<p class="text-2">${esc(REQ.closed.notYet)}</p>`;
  return `
    <div class="closed">
      <p class="closed__line">${icon('badge-check')}<span>${esc(verifiedLine)}</span></p>
      ${(p.milestones ?? []).map((id) => milestoneCard({ title: `Milestone: ${BADGE_BY_ID[id].name}`, text: BADGE_BY_ID[id].trigger, iconName: BADGE_BY_ID[id].icon })).join('')}
      <section class="closed__next" aria-labelledby="next-h">
        <h3 class="card__title" id="next-h">${esc(REQ.closed.next)}</h3>
        ${nextRec ? `<a class="rec-row" href="${esc(nextRec.href)}">${reasonTag(nextRec.reason, { n: nextRec.n })}
          <span class="rec-row__main"><span class="rec-row__title"><span class="dash-code">${esc(nextRec.code)}</span> ${esc(nextRec.title)}</span><span class="rec-row__meta">${esc(nextRec.meta)}</span></span>${icon('chevron-right')}</a>`
          : `<p class="text-2">${esc(REQ.closed.nothingNext)}</p>`}
      </section>
    </div>`;
}
