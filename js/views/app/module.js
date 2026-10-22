// #/app/module/:moduleId — shared learning for 2–5 related requirements (§8.6).
// Left: Watch (videos), Learn (topic sessions), Download (templates). Right: the requirements it serves.
// Marking learning done is pretend but real in the store: progress updates everywhere.
import { ACADEMY as A } from '../../../data/academy.js';
import { DOMAINS } from '../../../data/domains.js';
import { PATHWAYS } from '../../../data/pathways.js';
import { MODULE_BY_ID } from '../../../data/modules.js';
import { esc, clamp } from '../../util.js';
import { icon } from '../../components/icon.js';
import { emptyState } from '../../components/feedback.js';
import { reqRow } from '../../components/reqRow.js';
import { showToast } from '../../components/toast.js';
import { getState, currentOrg, markLearning } from '../../store.js';
import { moduleProgress } from '../../selectors.js';
import { lensItems } from '../../lensSelectors.js';
import { lensHref } from '../../lens.js';

const M = A.module;
const KINDS = { video: 'watched', session: 'sessions', template: 'downloads' };

function item(kind, x, done, locked) {
  const labels = {
    video: [M.watchAction, M.watched, 'play', `${x.mins} min · captions and transcript`],
    session: [M.sessionAction, M.viewed, 'presentation', `${x.mins} min recorded session`],
    template: [M.downloadAction, M.downloaded, 'file-down', x.format],
  }[kind];
  const [action, doneLabel, iconName, meta] = labels;
  return `
    <li class="learn-item${done ? ' is-done' : ''}">
      <span class="learn-item__icon">${icon(done ? 'circle-check' : iconName)}</span>
      <span class="learn-item__text"><span class="learn-item__title">${esc(x.title)}</span><span class="learn-item__meta">${esc(meta)}</span></span>
      ${done
        ? `<span class="chip chip--st-verified" tabindex="-1" data-focus-key="learn-${esc(x.id)}">${icon('check')}${esc(doneLabel)}<span class="sr-only">: ${esc(x.title)}</span></span>`
        : `<button type="button" class="btn btn--outline" data-learn="${kind}" data-item="${esc(x.id)}" data-focus-key="learn-${esc(x.id)}"${locked ? ' disabled' : ''}>${esc(action)}<span class="sr-only">: ${esc(x.title)}</span></button>`}
    </li>`;
}

function learnSection(id, title, kind, list, l, locked) {
  if (!list.length) return '';
  const doneSet = l[KINDS[kind]];
  return `
    <section class="card learn-section" aria-labelledby="${id}">
      <h2 class="h3" id="${id}">${esc(title)}</h2>
      <ul class="learn-list">${list.map((x) => item(kind, x, doneSet.includes(x.id), locked)).join('')}</ul>
    </section>`;
}

const bar = (label, text, pct) => `
  <div class="progress-row">
    <span class="progress-row__label">${esc(label)}</span><span class="progress-row__count">${esc(text)}</span>
    <div class="progress" role="progressbar" aria-label="${esc(label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}" aria-valuetext="${esc(text)}">
      <div class="progress__fill" style="width:${clamp(pct, 0, 100)}%"></div>
    </div>
  </div>`;

export function render(ctx) {
  const { state, org, today, params } = ctx;
  const m = MODULE_BY_ID[params.moduleId];
  const items = lensItems(state, org, today).filter((x) => x.moduleId === m?.id);
  if (!m || !items.length) {
    return `<div class="page"><h1 class="sr-only">Module not found</h1>
      ${emptyState({ title: 'We couldn’t find that module', text: 'It may not be part of your organisation’s Academy.', action: `<a class="btn btn--action" href="${lensHref('topic')}">Browse the learning library</a>` })}</div>`;
  }
  const p = moduleProgress(state, org, m.id);
  const l = state.learning[org.id] ?? { watched: [], sessions: [], downloads: [] };
  const locked = items.every((x) => x.locked);
  const area = m.domainId ? DOMAINS.find((d) => d.id === m.domainId).name : PATHWAYS[org.pathway]?.title ?? '';
  return `
    <div class="page module-page">
      <nav class="breadcrumb" aria-label="Breadcrumb"><ol>
        <li><a href="${lensHref('topic')}">Academy · By topic</a></li>
        <li><a href="${m.domainId ? `#/app/academy/area/${m.domainId}` : '#/app/pathway'}">${esc(area)}</a></li>
        <li><span aria-current="page">${esc(m.title)}</span></li>
      </ol></nav>
      <header class="page-header module-head">
        <p class="eyebrow">${esc(area)}</p>
        <h1>${esc(m.title)}</h1>
        <p class="lead">${esc(m.intro)}</p>
        <div class="module-head__progress">
          ${bar('Learning', `${p.learningPct}%`, p.learningPct)}
          ${bar('Evidence', `${p.verified} of ${p.total} verified`, p.total ? (p.verified / p.total) * 100 : 0)}
        </div>
        ${m.placeholder ? `<p class="placeholder-flag">${icon('triangle-alert')}Placeholder learning content — to be replaced with BVT material</p>` : ''}
      </header>
      ${locked ? `<p class="callout">${icon('lock')}<span>${esc(M.lockedNote)}</span></p>` : ''}
      <div class="module-grid-2">
        <div class="module-learn">
          ${learnSection('m-watch', `1 · ${M.watch}`, 'video', m.videos, l, locked)}
          ${learnSection('m-learn', `2 · ${M.learn}`, 'session', m.sessions, l, locked)}
          ${learnSection('m-download', `3 · ${M.download}`, 'template', m.templates, l, locked)}
        </div>
        <aside class="module-aside" aria-labelledby="m-serves">
          <section class="card">
            <h2 class="h3" id="m-serves">${esc(M.serves)}</h2>
            <ul class="req-list req-list--compact">${items.map((x) => reqRow(x)).join('')}</ul>
            <p class="callout callout--cream">${icon('info')}<span>${esc(M.shared)}</span></p>
            <div class="module-aside__actions">
              <button type="button" class="btn btn--action" data-open-ali>${icon('sparkles')}${esc(M.askAli)}</button>
              <a class="btn btn--outline" href="#/app/mentoring/book?module=${esc(m.id)}">${icon('users')}${esc(M.bookMentor)}</a>
            </div>
          </section>
        </aside>
      </div>
    </div>`;
}

export function bind(root, ctx) {
  root.querySelectorAll('[data-learn]').forEach((btn) => btn.addEventListener('click', () => {
    const { learn: kind, item: id } = btn.dataset;
    const m = MODULE_BY_ID[ctx.params.moduleId];
    const title = [...m.videos, ...m.sessions, ...m.templates].find((x) => x.id === id)?.title ?? '';
    markLearning(KINDS[kind], id);
    const pct = moduleProgress(getState(), currentOrg(), m.id).learningPct;
    showToast(kind === 'template' ? `Downloaded: ${title}` : `${kind === 'video' ? 'Watched' : 'Viewed'}: ${title}`, {
      text: kind === 'template' ? 'Pretend download — no file was saved.' : `${m.title} learning is now ${pct}%.`,
      iconName: kind === 'template' ? 'file-down' : 'circle-check',
    });
  }));
}
