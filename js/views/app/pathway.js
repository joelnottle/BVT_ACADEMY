// #/app/pathway (§8.8): the Start-up pathway — the one place a sequence is recommended, still progress-based.
// Every item opens the standard requirement page. Completing it unlocks Core (demo shortcut included).
import { PATHWAYS, PATHWAY_PAGE as P } from '../../../data/pathways.js';
import { STEPS } from '../../../data/copy.js';
import { esc, formatDate, effortLabel } from '../../util.js';
import { icon } from '../../components/icon.js';
import { statusChip } from '../../components/chips.js';
import { progressBar } from '../../components/progress.js';
import { milestoneCard } from '../../components/feedback.js';
import { showToast } from '../../components/toast.js';
import { pathwayReqs, pathwayProgress, progressOf, coreReqs } from '../../selectors.js';
import { currentStep } from '../../dashboardSelectors.js';
import { lensHref, reqHref } from '../../lens.js';
import { completePathway } from '../../reqStore.js';

const OPEN = ['not-started', 'learning', 'evidence-needed', 'changes'];

export function render(ctx) {
  const { state, org } = ctx;
  const path = org.pathway && PATHWAYS[org.pathway];
  if (!path) {
    return `<div class="page"><header class="page-header"><h1>Pathway</h1></header>
      <p class="callout">${icon('lock-open')}<span>${esc(P.noPathway)} <a href="#/app/dashboard">Go to your dashboard</a></span></p></div>`;
  }
  const reqs = pathwayReqs(org);
  if (!reqs.length) {
    return `<div class="page"><header class="page-header"><h1>${esc(path.title)}</h1><p class="lead">${esc(path.intro)}</p></header>
      <p class="callout">${icon('info')}<span>${esc(P.recoveryEmpty)}</span></p></div>`;
  }
  const pp = pathwayProgress(state, org);
  const nextId = reqs.find((r) => OPEN.includes(progressOf(state, org.id, r.id).status))?.id;
  const nCore = coreReqs(org).length;
  return `
    <div class="page pathway-page">
      <header class="page-header"><h1>${esc(path.title)}</h1><p class="lead">${esc(path.intro)}</p></header>
      ${pp.complete
        ? `${milestoneCard({ title: P.done, text: P.doneText(nCore), iconName: 'route' })}
           <p><a class="btn btn--action" href="#/app/dashboard">${esc(P.doneAction)}${icon('arrow-right')}</a></p>`
        : `<p class="callout">${icon('lock')}<span>${esc(P.lockedCore(nCore))} <a href="${lensHref('area')}">${esc(P.preview)}</a></span></p>`}
      <div class="pathway-grid">
        <section class="card stack" aria-labelledby="pw-list-h">
          <div class="dash-row"><h2 class="h3" id="pw-list-h">${esc(P.order)}</h2></div>
          ${progressBar({ label: 'Pathway progress', value: pp.done, max: pp.total, countText: P.progress(pp.done, pp.total) })}
          <p class="text-2">${esc(P.orderNote)}</p>
          <ol class="pw-list">
            ${reqs.map((r, i) => {
              const p = progressOf(state, org.id, r.id);
              const step = STEPS.find((s) => s.id === currentStep(r, p));
              const isNext = r.id === nextId;
              const label = p.status === 'verified' ? P.view : p.status === 'not-started' ? P.start : P.continue;
              return `
                <li class="pw-item${p.status === 'verified' ? ' is-done' : ''}${isNext ? ' is-next' : ''}">
                  <span class="pw-item__n" aria-hidden="true">${p.status === 'verified' ? icon('check') : i + 1}</span>
                  <div class="pw-item__main">
                    ${isNext ? `<span class="chip chip--reason">${icon('sparkles')}${esc(P.next)}</span>` : ''}
                    <h3 class="pw-item__title"><span class="dash-code">${esc(r.id)}</span> ${esc(r.title)}</h3>
                    <p class="pw-item__meta">${statusChip(p.status)}<span>${icon('clock')}${esc(effortLabel(r.effortHrs))}</span>${p.lastActivity ? `<span>${esc(p.lastActivity.text)} · ${esc(formatDate(p.lastActivity.on))}</span>` : ''}</p>
                  </div>
                  <a class="btn ${isNext ? 'btn--action' : 'btn--outline'} pw-item__go" href="${esc(reqHref(r.id, p.status === 'verified' ? 'closed' : step.slug))}">${esc(label)}<span class="sr-only"> ${esc(r.id)}</span>${icon('arrow-right')}</a>
                </li>`;
            }).join('')}
          </ol>
          ${pp.complete ? '' : `<p><button type="button" class="link-btn" data-complete-pathway>${icon('flask-conical')}${esc(P.demo)}</button></p>`}
        </section>
        <aside class="card stack" aria-labelledby="pw-why-h">
          <h2 class="h3" id="pw-why-h">${esc(P.why)}</h2>
          <ul class="ticks">${P.whyPoints.map((t) => `<li>${icon('check')}<span>${esc(t)}</span></li>`).join('')}</ul>
        </aside>
      </div>
    </div>`;
}

export function bind(root) {
  root.querySelector('[data-complete-pathway]')?.addEventListener('click', () => {
    const org = completePathway();
    if (org) showToast(P.done, { text: P.doneText(coreReqs(org).length), iconName: 'route' });
  });
}
