// #/app/accreditation (§8.12): progress to accreditation, what's left (each links to a filtered lens),
// final checks, Request review → pending → Accredited, then the certificate, what unlocks, and a quiet referral.
import { ACCREDITATION as A } from '../../../data/account.js';
import { STATUS } from '../../../data/copy.js';
import { esc, formatDate, addMonths } from '../../util.js';
import { icon } from '../../components/icon.js';
import { readinessRing } from '../../components/progress.js';
import { certificate } from '../../components/certificate.js';
import { openModal } from '../../components/modal.js';
import { showToast } from '../../components/toast.js';
import { enterpriseOpen } from '../../selectors.js';
import { lensHref } from '../../lens.js';
import { accreditationState } from '../../accountSelectors.js';
import { requestAccreditation, verifyAllRemaining, issueAccreditation } from '../../accountStore.js';

const LEFT = ['changes', 'in-review', 'evidence-needed', 'learning', 'not-started'];

function accredited(ctx) {
  const { org, today } = ctx;
  const renews = addMonths(org.accreditedOn, 12);
  const open = enterpriseOpen(org, today);
  return `
    <section class="accr-done" aria-labelledby="accr-h2">
      <p class="closed__line">${icon('award')}<span id="accr-h2">${esc(A.accredited(org.name))}</span></p>
      <p class="text-2">${esc(A.renews(formatDate(renews)))}</p>
    </section>
    <div class="accr-grid">
      ${certificate({ orgName: org.name, certNo: org.certNo, issuedOn: org.accreditedOn, renewsOn: renews })}
      <div class="stack">
        <div class="cluster">
          <button type="button" class="btn btn--action" data-cert-pdf>${icon('file-down')}${esc(A.download)}</button>
          <a class="btn btn--outline" href="#/verify/${esc(org.certNo)}">${icon('shield-check')}${esc(A.verifyLink)}</a>
        </div>
        <section class="card" aria-labelledby="unlocked-h">
          <h2 class="h3" id="unlocked-h">${esc(A.unlocked)}</h2>
          <ul class="ticks">
            <li>${icon('check')}<span><a href="#/app/connect-profile">${esc(A.connect)}</a></span></li>
            <li>${icon(open ? 'check' : 'lock')}<span>${open ? `<a href="#/app/enterprise">${esc(A.enterprise)}</a>` : `${esc(A.enterprise)} · ${esc(A.enterpriseFrom)}`}</span></li>
          </ul>
        </section>
        <p class="accr-referral text-2">${esc(A.referral)} ${esc(A.referralText)} <a href="#/" data-pretend="${esc(A.referralPretend)}">${esc(A.referralLink)}</a></p>
      </div>
    </div>`;
}

function progress(ctx, a) {
  const { org } = ctx;
  const left = LEFT.filter((st) => a.byStatus[st]);
  const checks = [a.allVerified, a.requested, false];
  return `
    <div class="accr-grid">
      <section class="card accr-progress" aria-labelledby="accr-p-h">
        <h2 class="dash-title" id="accr-p-h">${esc(A.progress(a.verified, a.total))}</h2>
        ${readinessRing({ verified: a.verified, total: a.total, legend: false })}
        ${a.allVerified ? '' : `
          <h3 class="card__title">${esc(A.left)}</h3>
          <ul class="accr-left">${left.map((st) => `<li><a class="attn-row" href="${esc(lensHref('action', { status: [st] }))}">
            <span class="attn-row__icon">${icon(STATUS[st].icon)}</span><span class="attn-row__text">${esc(A.leftLink(a.byStatus[st], STATUS[st].label))}</span>${icon('chevron-right')}</a></li>`).join('')}</ul>
          <button type="button" class="link-btn" data-demo-verify-all>${icon('flask-conical')}${esc(A.demoVerifyAll)}</button>`}
      </section>
      <section class="card stack" aria-labelledby="accr-c-h">
        <h2 class="h3" id="accr-c-h">${esc(A.finalChecks)}</h2>
        <ol class="accr-checks">${A.checks.map((c, i) => `<li class="${checks[i] ? 'is-done' : ''}">${icon(checks[i] ? 'circle-check' : 'circle-dashed')}<span>${esc(c)}${checks[i] ? '<span class="sr-only"> (done)</span>' : ''}</span></li>`).join('')}</ol>
        ${a.requested ? `
          <p class="callout">${icon('hourglass')}<span><strong>${esc(A.pending)}.</strong> ${esc(A.pendingText(formatDate(org.accreditationRequestedOn)))}</span></p>
          <button type="button" class="link-btn" data-demo-issue>${icon('flask-conical')}${esc(A.demoIssue)}</button>`
          : `<form class="stack" data-request>
              <label class="check"><input type="checkbox" id="accr-declare"${a.allVerified ? '' : ' disabled'}><span class="check__text">${esc(A.declare)}</span></label>
              <p class="field__error" id="accr-err" hidden></p>
              <div><button type="submit" class="btn btn--action"${a.allVerified ? '' : ' disabled'}>${icon('send')}${esc(A.request)}</button></div>
            </form>`}
      </section>
    </div>`;
}

export function render(ctx) {
  const a = accreditationState(ctx.state, ctx.org);
  return `
    <div class="page accr-page">
      <header class="page-header"><h1>Accreditation</h1><p class="lead">${esc(A.lead)}</p></header>
      ${a.accredited ? accredited(ctx) : progress(ctx, a)}
    </div>`;
}

export function bind(root) {
  root.querySelector('[data-cert-pdf]')?.addEventListener('click', () => showToast(A.download, { text: A.downloadText, iconName: 'file-down' }));
  root.querySelector('[data-demo-verify-all]')?.addEventListener('click', () => {
    verifyAllRemaining();
    showToast('Demo: every requirement verified', { text: 'Now confirm the final check and request your review.', iconName: 'flask-conical' });
  });
  root.querySelector('[data-demo-issue]')?.addEventListener('click', () => {
    const org = issueAccreditation();
    if (org) showToast(A.accredited(org.name), { text: 'Milestone: Accredited. Your Connect profile is open.', iconName: 'award' });
  });
  root.querySelector('[data-request]')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const box = root.querySelector('#accr-declare');
    const err = root.querySelector('#accr-err');
    if (!box.checked) {
      err.hidden = false;
      err.textContent = 'Confirm your organisation’s details are current.';
      box.setAttribute('aria-invalid', 'true');
      box.setAttribute('aria-describedby', 'accr-err');
      box.focus();
      return;
    }
    openModal({
      title: A.requestTitle,
      body: `<p>${esc(A.requestText)}</p>`,
      actions: [{ label: 'Cancel', value: 'cancel', variant: 'outline' }, { label: A.request, value: 'go', variant: 'action' }],
      onAction(v) { if (v === 'go') { requestAccreditation(); showToast(A.pending, { text: A.requestText, iconName: 'hourglass' }); } },
    });
  });
}
