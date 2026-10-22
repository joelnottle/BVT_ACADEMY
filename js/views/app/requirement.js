// #/app/req/:reqId(/:step) — the core screen (BUILD_PLAN §8.7).
// Not yet in place: all 7 steps, 1–4 optional and freely clickable, plus "I know this — go to evidence".
// Already in place: compact Upload → Verify → Closed, with "Need a refresher?" to open the learning.
// Locked (Core before the pathway is done): readable, steps disabled, banner to the pathway.
import { STEPS, FEEDBACK } from '../../../data/copy.js';
import { REQ } from '../../../data/reqPage.js';
import { DOMAINS } from '../../../data/domains.js';
import { PATHWAYS } from '../../../data/pathways.js';
import { MODULE_BY_ID } from '../../../data/modules.js';
import { esc, effortLabel } from '../../util.js';
import { icon } from '../../components/icon.js';
import { emptyState } from '../../components/feedback.js';
import { statusChip, typeChip } from '../../components/chips.js';
import { stepper } from '../../components/stepper.js';
import {
  REQ_BY_ID, progressOf, isLocked, pathwayProgress, domainStat, recommendedNext,
} from '../../selectors.js';
import { currentStep, recommendedRows } from '../../dashboardSelectors.js';
import { lensHref } from '../../lens.js';
import { watchPanel, learnPanel, downloadPanel, doItPanel } from './reqLearnPanels.js';
import { uploadPanel, verifyPanel, closedPanel } from './reqEvidencePanels.js';
import { bindRequirement } from './requirementBind.js';

const SUBMITTED = ['in-review', 'changes', 'verified'];
const PANELS = { watch: watchPanel, learn: learnPanel, download: downloadPanel, doIt: doItPanel, upload: uploadPanel, verify: verifyPanel, closed: closedPanel };
const LEARNING = ['watch', 'learn', 'download', 'doIt'];

/** The page model, shared by render and bind. */
export function model(ctx) {
  const { state, org, today, params, query } = ctx;
  const req = REQ_BY_ID[params.reqId];
  if (!req || !state.progress[org.id]?.[req.id]) return null;
  const p = progressOf(state, org.id, req.id);
  const bySlug = STEPS.find((s) => s.slug === params.step);
  const step = bySlug?.id ?? currentStep(req, p);
  const compact = p.type === 'in-place' && !query.learning && !LEARNING.includes(step);
  const review = state.reviews.filter((r) => r.orgId === org.id && r.reqId === req.id).sort((a, b) => b.submittedOn.localeCompare(a.submittedOn))[0] ?? null;
  return { req, p, step, compact, review, locked: isLocked(state, req, org), mod: MODULE_BY_ID[req.moduleId] };
}

function doneSteps(p) {
  const s = p.steps ?? {};
  return [
    s.watch && 'watch', s.learn && 'learn', s.download && 'download', (s.doIt ?? []).length && s.doIt.every(Boolean) && 'doIt',
    SUBMITTED.includes(p.status) && 'upload', p.status === 'verified' && 'verify', p.status === 'verified' && 'closed',
  ].filter(Boolean);
}

function header(req, p, area, mod) {
  return `
    <nav class="breadcrumb" aria-label="Breadcrumb"><ol>
      <li><a href="${lensHref('area')}">Academy</a></li>
      <li><a href="${req.domainId ? `#/app/academy/area/${req.domainId}` : '#/app/pathway'}">${esc(area)}</a></li>
      <li><a href="#/app/module/${esc(mod.id)}">${esc(mod.title)}</a></li>
      <li><span aria-current="page">${esc(req.id)}</span></li>
    </ol></nav>
    <header class="req-head">
      <h1><span class="req-head__code">${esc(req.id)}</span> ${esc(req.title)}</h1>
      <div class="cluster req-head__chips">
        ${typeChip(p.type)}${statusChip(p.status)}
        <span class="chip chip--type">${icon('clock')}${esc(effortLabel(req.effortHrs))}</span>
        ${p.fastTracked ? `<span class="chip chip--reason">${icon('fast-forward')}${esc(REQ.fastTracked)}</span>` : ''}
        ${req.placeholder ? `<span class="placeholder-flag">${icon('triangle-alert')}Placeholder content</span>` : ''}
      </div>
    </header>`;
}

function rail(ctx, req, mod, p, locked) {
  const R = REQ.rail;
  const siblings = mod.requirementIds.filter((id) => id !== req.id && ctx.state.progress[ctx.org.id]?.[id]);
  return `
    <aside class="req-rail" aria-labelledby="rail-h">
      <h2 class="sr-only" id="rail-h">${esc(R.title)}</h2>
      <section class="card req-rail__card">
        <div><h3 class="card__title">${esc(R.required)}</h3><p class="text-2">${esc(req.required)}</p></div>
        <div><h3 class="card__title">${esc(R.why)}</h3><p class="text-2">${esc(req.why)}</p></div>
        <div><h3 class="card__title">${esc(R.good)}</h3><ul class="ticks">${req.goodEvidence.map((g) => `<li>${icon('check')}<span>${esc(g)}</span></li>`).join('')}</ul></div>
        ${siblings.length ? `<div><h3 class="card__title">${esc(R.shared)}</h3>
          <ul class="sibling-list">${siblings.map((id) => `<li><a href="#/app/req/${id}">${esc(id)} ${esc(REQ_BY_ID[id].title)}</a> ${statusChip(isLocked(ctx.state, REQ_BY_ID[id], ctx.org) ? 'locked' : progressOf(ctx.state, ctx.org.id, id).status)}</li>`).join('')}</ul></div>` : ''}
        <div class="field">
          <label class="card__title" for="req-notes">${esc(R.notes)}</label>
          <textarea class="textarea" id="req-notes" rows="3" aria-describedby="req-notes-hint" data-notes>${esc(p.notes ?? '')}</textarea>
          <p class="field__hint" id="req-notes-hint" data-notes-hint>${esc(R.notesHint)}</p>
        </div>
        <div class="req-rail__actions">
          <button type="button" class="btn btn--action" data-open-ali>${icon('sparkles')}${esc(R.ali(req.id))}</button>
          <a class="btn btn--outline" href="#/app/mentoring/book?req=${esc(req.id)}">${icon('users')}${esc(R.mentor)}</a>
          <p class="text-3">${esc(R.credits(ctx.org.credits.mentor))}</p>
        </div>
      </section>
    </aside>`;
}

export function render(ctx) {
  const m = model(ctx);
  if (!m) {
    return `<div class="page"><h1 class="sr-only">Requirement not found</h1>
      ${emptyState({ title: 'We couldn’t find that requirement', text: 'It may not be part of your organisation’s Academy.', action: `<a class="btn btn--action" href="${lensHref('area')}">Browse every requirement</a>` })}</div>`;
  }
  const { state, org, today } = ctx;
  const { req, p, step, compact, review, locked, mod } = m;
  const area = req.domainId ? DOMAINS.find((d) => d.id === req.domainId).name : PATHWAYS[org.pathway]?.title ?? '';
  const stepMeta = STEPS.find((s) => s.id === step);
  const pp = locked ? pathwayProgress(state, org) : null;
  const canFastTrack = p.type === 'not-yet' && ['not-started', 'learning'].includes(p.status) && !locked;
  const d = req.domainId ? domainStat(state, org, req.domainId) : pathwayProgress(state, org);
  const verifiedLine = FEEDBACK.verified(req.id, area, d.verified ?? d.done, d.total);
  const nextRec = recommendedRows(recommendedNext(state, org, today, { exclude: ['changes'], skipIds: [req.id] }))[0] ?? null;
  const panel = PANELS[step]({ ...ctx, ...m, nextRec, verifiedLine });

  return `
    <div class="page req-page">
      ${header(req, p, area, mod)}
      ${locked ? `<p class="callout lens-locked">${icon('lock')}<span>${esc(REQ.locked(PATHWAYS[org.pathway].title, pp.done, pp.total))} <a href="#/app/pathway">${esc(REQ.lockedAction)}</a></span></p>` : ''}
      <div class="req-stepper">
        ${stepper({ current: step, done: doneSteps(p), variant: compact ? 'compact' : 'full', locked, label: `${req.id} steps` })}
        <div class="req-stepper__links">
          ${canFastTrack ? `<button type="button" class="link-btn" data-fast-track>${esc(REQ.fastTrack)}${icon('arrow-right')}</button>` : ''}
          ${p.type === 'in-place' && compact ? `<a class="link-btn" href="#/app/req/${esc(req.id)}/watch?learning=1">${icon('book-open')}${esc(REQ.refresher)}</a>` : ''}
          ${p.type === 'in-place' && !compact ? `<a class="link-btn" href="#/app/req/${esc(req.id)}/${SUBMITTED.includes(p.status) ? 'verify' : 'upload'}">${esc(REQ.hideLearning)}</a>` : ''}
        </div>
      </div>
      <div class="req-body">
        <section class="card step-panel" aria-labelledby="step-h" data-step-panel="${step}">
          <h2 class="step-panel__title" id="step-h"><span class="step-panel__n">${STEPS.indexOf(stepMeta) + 1}</span>${esc(stepMeta.label)}${stepMeta.optional ? '<span class="stepper__opt">Optional</span>' : ''}</h2>
          ${panel}
        </section>
        ${rail(ctx, req, mod, p, locked)}
      </div>
    </div>`;
}

export function bind(root, ctx) {
  const m = model(ctx);
  if (m) bindRequirement(root, ctx, m);
}
