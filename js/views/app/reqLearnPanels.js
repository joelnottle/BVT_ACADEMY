// Requirement step panels 1–4 (§8.7): Watch, Learn, Download, Do it. All optional.
// Each takes the page context { req, p, org, mod, locked, today } and returns trusted HTML.
import { REQ } from '../../../data/reqPage.js';
import { SLOTS } from '../../../data/mentors.js';
import { esc, formatDate, addDays } from '../../util.js';
import { icon } from '../../components/icon.js';

const dis = (locked) => (locked ? ' disabled' : '');
const doneChip = (label) => `<span class="chip chip--st-verified">${icon('check')}${esc(label)}</span>`;

export function watchPanel({ req, p, locked }) {
  const W = REQ.watch;
  return `
    <p class="text-2">${esc(W.lead)}</p>
    <div class="video">
      <button type="button" class="video__poster" data-play aria-label="${esc(W.play)}: ${esc(req.video.title)}, ${req.video.mins} minutes"${dis(locked)}>
        <span class="video__play">${icon('play')}</span>
        <span class="video__meta"><span class="video__title">${esc(req.video.title)}</span><span>${req.video.mins} min</span></span>
      </button>
    </div>
    <div class="cluster">
      <button type="button" class="btn btn--ghost" data-captions aria-pressed="true" data-focus-key="captions">${icon('captions')}${esc(W.captions)}</button>
    </div>
    <details class="why"><summary>${icon('file-text')}${esc(W.transcript)}</summary><p>${esc(req.transcript || W.noTranscript)}</p></details>
    <div class="step-actions">
      ${p.steps.watch ? doneChip('Watched') : `<button type="button" class="btn btn--outline" data-mark="watch" data-focus-key="mark-watch"${dis(locked)}>${esc(W.done)}</button>`}
    </div>`;
}

export function learnPanel({ req, p, org, mod, locked, today }) {
  const L = REQ.learn;
  const next = `${formatDate(addDays(today, 2), { weekday: true })}, ${SLOTS[3]}`;
  return `
    <p class="text-2">${esc(L.lead)}</p>
    <div class="learn-cards">
      <section class="learn-card" aria-labelledby="lc-sessions">
        <span class="icon-tile">${icon('presentation')}</span>
        <h3 id="lc-sessions" class="card__title">${esc(L.sessions)}</h3>
        <ul class="ticks">${mod.sessions.map((x) => `<li>${icon('play')}<span>${esc(x.title)} · ${x.mins} min</span></li>`).join('')}</ul>
        <a class="dash-link" href="#/app/module/${esc(mod.id)}">Open ${esc(mod.title)}${icon('arrow-right')}</a>
      </section>
      <section class="learn-card" aria-labelledby="lc-ali">
        <span class="icon-tile">${icon('sparkles')}</span>
        <h3 id="lc-ali" class="card__title">${esc(L.ali)}</h3>
        <p class="text-2">${esc(L.aliText)}</p>
        <ul class="prompt-list">${req.aliPrompts.map((q) => `<li><button type="button" class="prompt" data-open-ali data-ali-prompt="${esc(q)}">${esc(q)}</button></li>`).join('')}</ul>
      </section>
      <section class="learn-card" aria-labelledby="lc-mentor">
        <span class="icon-tile">${icon('users')}</span>
        <h3 id="lc-mentor" class="card__title">${esc(L.mentor)}</h3>
        <p class="text-2">${esc(L.mentorText(org.credits.mentor))} ${esc(L.nextSlot(next))}</p>
        <a class="btn btn--outline" href="#/app/mentoring/book?req=${esc(req.id)}">${icon('calendar-plus')}${esc(L.mentor)}</a>
      </section>
    </div>
    <div class="step-actions">
      ${p.steps.learn ? doneChip('Learning done') : `<button type="button" class="btn btn--outline" data-mark="learn" data-focus-key="mark-learn"${dis(locked)}>${esc(L.done)}</button>`}
    </div>`;
}

export function downloadPanel({ mod, state, org, locked }) {
  const D = REQ.download;
  const got = state.learning[org.id]?.downloads ?? [];
  return `
    <p class="text-2">${esc(D.lead)}</p>
    <ul class="template-grid">
      ${mod.templates.map((t) => `
        <li class="template-card">
          <span class="template-card__icon">${icon('file-spreadsheet')}</span>
          <span class="template-card__text"><strong>${esc(t.title)}</strong><span>${esc(t.format)}</span></span>
          ${got.includes(t.id)
            ? `<span class="chip chip--st-verified" tabindex="-1" data-focus-key="dl-${esc(t.id)}">${icon('check')}Downloaded<span class="sr-only">: ${esc(t.title)}</span></span>`
            : `<button type="button" class="btn btn--outline" data-download="${esc(t.id)}" data-focus-key="dl-${esc(t.id)}"${dis(locked)}>${icon('download')}Download<span class="sr-only"> ${esc(t.title)}</span></button>`}
        </li>`).join('')}
    </ul>
    <div class="partner-slot" aria-label="${esc(D.partner)}">
      <p class="partner-slot__title">${icon('puzzle')}${esc(D.partner)}</p>
      <p class="text-3">${esc(D.partnerText)}</p>
    </div>`;
}

export function doItPanel({ req, p, locked }) {
  const D = REQ.doIt;
  const done = p.steps.doIt ?? [];
  return `
    <p class="text-2">${esc(D.lead)}</p>
    <fieldset class="fieldset">
      <legend class="sr-only">Implementation checklist</legend>
      <ul class="checklist">
        ${req.checklist.map((item, i) => `
          <li><label class="check"><input type="checkbox" id="doit-${i}" data-check="${i}"${done[i] ? ' checked' : ''}${dis(locked)}><span class="check__text">${esc(item)}</span></label></li>`).join('')}
      </ul>
    </fieldset>
    <p class="checklist__count" aria-live="polite">${done.filter(Boolean).length} of ${req.checklist.length} done</p>
    <div class="field">
      <label class="field__label" for="verifier-note">${esc(D.verifierNote)} <span class="field__optional">(optional)</span></label>
      <textarea class="textarea" id="verifier-note" rows="3" aria-describedby="verifier-note-hint" data-verifier-note${dis(locked)}>${esc(p.verifierNote ?? '')}</textarea>
      <p class="field__hint" id="verifier-note-hint">${esc(D.verifierHint)}</p>
    </div>
    <div class="step-actions">
      <a class="btn btn--outline" href="#/app/req/${esc(req.id)}/download">${icon('arrow-left')}Back</a>
      <button type="button" class="btn btn--action" data-ready${dis(locked)}>${esc(D.next)}</button>
    </div>`;
}
