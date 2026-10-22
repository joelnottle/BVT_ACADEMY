// Team-member view (§8.14): #/app/learn (My learning), /app/learn/:unitId (Micro-Unit learner page — the
// module layout with a simple linear lesson list), /app/learn/ali (their own Ali meter), /app/learn/profile.
import { MEMBER as M } from '../../../data/enterprise.js';
import { ALI } from '../../../data/copy.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { progressBar } from '../../components/progress.js';
import { milestoneCard } from '../../components/feedback.js';
import { showToast } from '../../components/toast.js';
import { navigate } from '../../router.js';
import { currentMember } from '../../store.js';
import { completeLesson, backToLead, unitById } from '../../enterpriseStore.js';

const leadName = (org) => org.team?.find((m) => m.role === 'Leader')?.name ?? 'Your lead';

function home(ctx, m) {
  const units = Object.entries(m.units ?? {});
  return `
    <header class="page-header"><h1>${esc(M.hello(m.name.split(' ')[0]))}</h1><p class="lead">${esc(M.lead(leadName(ctx.org), ctx.org.name))}</p></header>
    ${units.length ? `<ul class="hub-cards">${units.map(([id, done]) => {
      const u = unitById(id);
      return `<li class="card card--interactive stack">
        <span class="module-card__area">${esc(u.area)}</span>
        <a class="card__link module-card__title" href="#/app/learn/${esc(u.id)}">${esc(u.title)}</a>
        ${progressBar({ label: u.title, value: done, max: u.lessons.length, countText: M.unitProgress(done, u.lessons.length), unit: 'lessons complete' })}
      </li>`;
    }).join('')}</ul>` : `<p class="callout">${icon('info')}<span>${esc(M.none)}</span></p>`}
    <section class="card stack" aria-labelledby="ml-ali-h">
      <h2 class="dash-title" id="ml-ali-h">${esc(M.credits)}</h2>
      <p class="dash-big">${icon('sparkles')}${esc(ALI.creditLine(m.aliCredits ?? 0))}</p>
      <div><button type="button" class="btn btn--action" data-open-ali>${icon('message-circle')}Ask Ali</button></div>
    </section>`;
}

function unitPage(ctx, m) {
  const u = unitById(ctx.params.unitId);
  if (!u || m.units?.[u.id] == null) return `<header class="page-header"><h1>Micro-Unit</h1></header><p class="text-2">You’re not enrolled in that unit. <a href="#/app/learn">Back to My learning</a></p>`;
  const done = m.units[u.id];
  const complete = done === u.lessons.length;
  return `
    <nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="#/app/learn">My learning</a></li><li><span aria-current="page">${esc(u.title)}</span></li></ol></nav>
    <header class="page-header module-head">
      <p class="eyebrow">${esc(u.area)} · Leadership Micro-Unit</p>
      <h1>${esc(u.title)}</h1>
      <p class="lead">${esc(u.summary)}</p>
      <div class="module-head__progress">${progressBar({ label: 'Progress', value: done, max: u.lessons.length, countText: M.unitProgress(done, u.lessons.length), unit: 'lessons complete' })}</div>
    </header>
    ${complete ? milestoneCard({ title: M.complete, text: M.completeText(u.title), iconName: 'graduation-cap' }) : ''}
    <section class="card stack" aria-labelledby="ml-lessons-h">
      <h2 class="h3" id="ml-lessons-h">Lessons</h2>
      <ol class="pw-list">${u.lessons.map((title, i) => {
        const state = i < done ? 'done' : i === done ? 'next' : 'later';
        return `<li class="pw-item${state === 'done' ? ' is-done' : state === 'next' ? ' is-next' : ''}">
          <span class="pw-item__n" aria-hidden="true">${state === 'done' ? icon('check') : i + 1}</span>
          <div class="pw-item__main"><p class="text-3">${esc(M.lesson(i + 1))} · video and workbook</p><h3 class="pw-item__title">${esc(title)}</h3>
            ${state === 'later' ? `<p class="pw-item__meta">${icon('lock')}<span>${esc(M.locked)}</span></p>` : ''}</div>
          ${state === 'next' ? `<button type="button" class="btn btn--action pw-item__go" data-lesson="${esc(u.id)}" data-focus-key="lesson">${esc(M.markDone)}<span class="sr-only">: ${esc(title)}</span></button>`
            : state === 'done' ? `<span class="chip chip--st-verified">${icon('check')}Done<span class="sr-only">: ${esc(title)}</span></span>` : ''}
        </li>`;
      }).join('')}</ol>
    </section>
    <div class="cluster"><button type="button" class="btn btn--outline" data-open-ali>${icon('sparkles')}Ask Ali about this unit</button></div>`;
}

function aliPage(m) {
  return `
    <header class="page-header"><h1>Ask Ali</h1><p class="lead">${esc(ALI.intro)}</p></header>
    <section class="card stack" aria-labelledby="ml-ali2-h">
      <h2 class="dash-title" id="ml-ali2-h">${esc(M.credits)}</h2>
      <p class="dash-big">${icon('sparkles')}${esc(ALI.creditLine(m.aliCredits ?? 0))}</p>
      <div><button type="button" class="btn btn--action" data-open-ali>${icon('message-circle')}Ask a question</button></div>
      <p class="text-3">${icon('shield-check')} ${esc(ALI.footer)} ${esc(ALI.privacy)}</p>
    </section>`;
}

function profile(ctx, m) {
  return `
    <header class="page-header"><h1>Profile</h1><p class="lead">${esc(M.profileLead)}</p></header>
    <section class="card stack"><dl class="settings-list">
      <div><dt>Name</dt><dd>${esc(m.name)}</dd></div><div><dt>Email</dt><dd>${esc(m.email)}</dd></div>
      <div><dt>Role</dt><dd>${esc(m.role)}${m.title ? ` · ${esc(m.title)}` : ''}</dd></div><div><dt>Organisation</dt><dd>${esc(ctx.org.name)}</dd></div>
    </dl></section>
    <div><button type="button" class="btn btn--outline" data-back>${icon('undo-2')}${esc(M.back)}</button></div>`;
}

export function render(ctx) {
  const m = currentMember(ctx.state);
  const p = ctx.params.unitId;
  const body = p === 'ali' ? aliPage(m) : p === 'profile' ? profile(ctx, m) : p ? unitPage(ctx, m) : home(ctx, m);
  return `<div class="page member-page">${body}</div>`;
}

export function bind(root) {
  root.querySelector('[data-lesson]')?.addEventListener('click', (e) => {
    const unitId = e.currentTarget.dataset.lesson;
    const finished = completeLesson(unitId);
    const u = unitById(unitId);
    showToast(finished ? M.complete : 'Lesson complete', { text: finished ? M.completeText(u.title) : 'The next lesson is open.', iconName: finished ? 'graduation-cap' : 'circle-check' });
  });
  root.querySelector('[data-back]')?.addEventListener('click', () => { navigate('/app/enterprise/team'); backToLead(); });
}
