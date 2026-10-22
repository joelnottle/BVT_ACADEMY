// Mentor back-office (§8.17): #/team/mentor (this week), /team/mentor/mentees, /team/mentor/sessions/:id.
// Mentors help organisations implement. There are no verify controls anywhere in these views.
import { MENTOR_VIEW as M } from '../../../data/backoffice.js';
import { REQ_BY_ID } from '../../../data/requirements.js';
import { TIERS } from '../../../data/copy.js';
import { REFERRALS } from '../../../data/partners.js';
import { esc, formatDate } from '../../util.js';
import { icon } from '../../components/icon.js';
import { tierBadge } from '../../components/chips.js';
import { showToast } from '../../components/toast.js';
import { mentorFor, mentorWeek, orgById, verifiedReadiness, isAccredited } from '../../selectors.js';
import { saveMentorNotes, completeSession } from '../../supportStore.js';

const note = `<p class="callout callout--cream">${icon('shield-check')}<span>${esc(M.noVerify)}</span></p>`;
const askAli = `<button type="button" class="btn btn--outline" data-open-ali>${icon('sparkles')}${esc(M.askAli)}</button>`;

function sessionCard(state, s) {
  const org = orgById(state, s.orgId);
  return `<li class="card session">
    <div class="session__when"><span class="session__day">${esc(formatDate(s.date, { weekday: true }))}</span><span>${esc(s.time)} · ${s.mins} min</span></div>
    <div class="session__main">
      <h2 class="card__title">${esc(org?.name ?? s.orgId)}</h2>
      <p class="text-2">${esc(s.topic)}${s.reqId ? ` · ${esc(s.reqId)}` : ''}</p>
      <div class="cluster">${s.status === 'completed' ? `<span class="chip chip--st-verified">${icon('check')}${esc(M.done)}</span>` : `<span class="chip chip--type">${icon('calendar')}${esc(M.upcoming)}</span>`}
        <a class="btn btn--outline" href="#/team/mentor/sessions/${esc(s.id)}">${esc(M.open)}<span class="sr-only">: ${esc(org?.name ?? '')}, ${esc(s.topic)}</span></a></div>
    </div></li>`;
}

function week(ctx, mentor) {
  const list = mentorWeek(ctx.state, mentor.id, ctx.today);
  return `
    <header class="page-header"><p class="eyebrow">${esc(mentor.name)} · ${esc(mentor.title)}</p><h1>This week</h1><p class="lead">${esc(M.weekLead)}</p></header>
    <div class="cluster">${askAli}</div>
    ${list.length ? `<ul class="session-list">${list.map((s) => sessionCard(ctx.state, s)).join('')}</ul>` : `<p class="text-2">${esc(M.none)}</p>`}
    ${note}`;
}

function mentees(ctx, mentor) {
  const { state, today } = ctx;
  const rows = mentor.mentees.map((id) => {
    const org = orgById(state, id);
    const live = state.orgs[id];
    const snap = REFERRALS.find((r) => r.orgId === id)?.snapshot;
    const sessions = state.sessions.filter((s) => s.orgId === id && s.mentorId === mentor.id);
    const next = sessions.filter((s) => s.status === 'upcoming' && s.date >= today).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
    return {
      name: org?.name ?? id,
      tier: live ? (isAccredited(live) ? 'accredited' : live.tier) : org?.tier,
      readiness: live ? `${verifiedReadiness(state, live).pct}%` : snap?.readiness != null ? `${snap.readiness}%` : '—',
      topics: [...new Set(sessions.map((s) => s.topic))].join(', ') || '—',
      next,
    };
  });
  return `
    <header class="page-header"><h1>Mentees</h1><p class="lead">${esc(M.menteesLead)}</p></header>
    <div class="data-table-wrap"><table class="data-table"><caption class="sr-only">Mentees</caption>
      <thead><tr>${M.menteeCols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((r) => `<tr>
        <td data-label="${M.menteeCols[0]}"><strong>${esc(r.name)}</strong></td>
        <td data-label="${M.menteeCols[1]}">${r.tier && TIERS[r.tier] ? tierBadge(r.tier, { showMonths: false }) : '—'}</td>
        <td data-label="${M.menteeCols[2]}">${esc(r.readiness)}</td>
        <td data-label="${M.menteeCols[3]}">${esc(r.topics)}</td>
        <td data-label="${M.menteeCols[4]}">${r.next ? `<a href="#/team/mentor/sessions/${esc(r.next.id)}">${esc(formatDate(r.next.date, { weekday: true }))}, ${esc(r.next.time)}</a>` : '—'}</td>
      </tr>`).join('')}</tbody></table></div>
    ${note}`;
}

function sessionPage(ctx, mentor) {
  const S = M.session;
  const s = ctx.state.sessions.find((x) => x.id === ctx.params.id && x.mentorId === mentor.id);
  if (!s) return `<h1>Session not found</h1><p><a href="#/team/mentor">Back to this week</a></p>`;
  const org = orgById(ctx.state, s.orgId);
  const req = s.reqId ? REQ_BY_ID[s.reqId] : null;
  const done = s.status === 'completed';
  return `
    <nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="#/team/mentor">This week</a></li><li><span aria-current="page">${esc(org?.name ?? '')}</span></li></ol></nav>
    <header class="page-header"><p class="eyebrow">${esc(formatDate(s.date, { weekday: true }))} · ${esc(s.time)} · ${s.mins} min</p><h1>${esc(org?.name ?? s.orgId)}</h1><p class="lead">${esc(s.topic)}</p></header>
    <div class="review-split">
      <div class="stack stack-lg">
        <section class="card stack" aria-labelledby="ms-prep-h"><h2 class="h3" id="ms-prep-h">${esc(S.prep)}</h2><p class="text-2">${esc(s.prepNotes || S.noPrep)}</p></section>
        ${req ? `<section class="card stack" aria-labelledby="ms-ctx-h"><h2 class="h3" id="ms-ctx-h">${esc(S.context)}: <span class="dash-code">${esc(req.id)}</span> ${esc(req.title)}</h2>
          <p class="text-2">${esc(req.required)}</p><ul class="ticks">${req.goodEvidence.map((g) => `<li>${icon('check')}<span>${esc(g)}</span></li>`).join('')}</ul></section>` : ''}
      </div>
      <div class="stack stack-lg">
        <section class="card stack" aria-labelledby="ms-notes-h">
          <h2 class="h3" id="ms-notes-h">${esc(S.notes)}</h2>
          ${done ? `<p class="callout callout--ok">${icon('circle-check')}<span>${esc(S.isDone)}</span></p>` : ''}
          <form class="stack" data-mentor-notes novalidate>
            <label class="sr-only" for="ms-notes">${esc(S.notes)}</label>
            <textarea class="textarea" id="ms-notes" rows="6" aria-describedby="ms-notes-hint">${esc(s.mentorNotes)}</textarea>
            <p class="field__hint" id="ms-notes-hint">${esc(S.notesHint)}</p>
            <div class="decision-actions">
              <button type="submit" class="btn btn--outline">${icon('save')}${esc(S.save)}</button>
              ${done ? '' : `<button type="button" class="btn btn--action" data-complete>${icon('check')}${esc(S.complete)}</button>`}
            </div>
          </form>
        </section>
        <div class="cluster">${askAli}</div>
        ${note}
      </div>
    </div>`;
}

export function render(ctx) {
  const mentor = mentorFor(ctx.persona.id);
  const path = ctx.path;
  const body = path.startsWith('/team/mentor/sessions/') ? sessionPage(ctx, mentor) : path === '/team/mentor/mentees' ? mentees(ctx, mentor) : week(ctx, mentor);
  return `<div class="page mentor-page">${body}</div>`;
}

export function bind(root, ctx) {
  const form = root.querySelector('[data-mentor-notes]');
  if (!form) return;
  const notes = form.querySelector('#ms-notes');
  form.addEventListener('submit', (e) => { e.preventDefault(); saveMentorNotes(ctx.params.id, notes.value.trim()); showToast(M.session.saved, { iconName: 'save' }); });
  root.querySelector('[data-complete]')?.addEventListener('click', () => {
    const s = completeSession(ctx.params.id, notes.value.trim());
    if (s) showToast(M.session.completed, { text: M.session.completedText(orgById(ctx.state, s.orgId)?.name ?? ''), iconName: 'circle-check' });
  });
}
