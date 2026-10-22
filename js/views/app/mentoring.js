// #/app/mentoring — credits and how they work, upcoming and past sessions, and the mentor team (§8.11).
// Mentors help organisations implement. They never verify: the note below says so on every visit.
import { MENTORING as M } from '../../../data/mentoring.js';
import { MENTORS } from '../../../data/mentors.js';
import { esc, formatDate } from '../../util.js';
import { icon } from '../../components/icon.js';
import { showToast } from '../../components/toast.js';
import { mentorById } from '../../selectors.js';
import { savePrepNotes } from '../../supportStore.js';

function sessionCard(s, upcoming) {
  const mentor = mentorById(s.mentorId);
  return `
    <li class="card session">
      <div class="session__when"><span class="session__day">${esc(formatDate(s.date, { weekday: true }))}</span><span>${esc(s.time)} · ${s.mins} min</span></div>
      <div class="session__main">
        <h3 class="card__title">${esc(s.topic)}</h3>
        <p class="text-2">${icon('user')} ${esc(mentor?.name ?? '')}${s.reqId ? ` · <a href="#/app/req/${esc(s.reqId)}">${esc(s.reqId)}</a>` : ''}</p>
        ${upcoming ? `
          <details class="why"><summary>${icon('notebook-pen')}${esc(s.prepNotes ? M.prep : M.editPrep)}</summary>
            <form class="stack stack-sm session__prep" data-prep="${esc(s.id)}">
              <label class="sr-only" for="prep-${esc(s.id)}">${esc(M.prep)}</label>
              <textarea class="textarea" id="prep-${esc(s.id)}" rows="3">${esc(s.prepNotes)}</textarea>
              <div><button type="submit" class="btn btn--outline">${esc(M.savePrep)}</button></div>
            </form></details>`
          : `<div class="session__notes"><p class="card__title">${esc(M.mentorNotes)}</p><p class="text-2">${esc(s.mentorNotes || '—')}</p></div>`}
      </div>
    </li>`;
}

export function render(ctx) {
  const { state, org, today } = ctx;
  const mine = state.sessions.filter((s) => s.orgId === org.id);
  const upcoming = mine.filter((s) => s.status === 'upcoming' && s.date >= today).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const past = mine.filter((s) => !upcoming.includes(s)).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  const n = org.credits.mentor;
  return `
    <div class="page mentoring-page">
      <header class="page-header"><h1>Mentoring</h1><p class="lead">${esc(M.lead)}</p></header>
      <p class="callout callout--cream">${icon('shield-check')}<span><strong>${esc(M.note)}</strong></span></p>
      <section class="card mentor-credits" aria-labelledby="mc-h">
        <div><h2 class="dash-title" id="mc-h">Credits</h2><p class="dash-big">${icon('users')}${esc(M.credits(n))}</p><p class="text-2">${esc(n ? M.how : M.outOf)}</p></div>
        ${n ? `<a class="btn btn--action" href="#/app/mentoring/book">${icon('calendar-plus')}${esc(M.book)}</a>` : ''}
      </section>
      <section aria-labelledby="up-h" class="stack">
        <h2 class="h3" id="up-h">${esc(M.upcoming)}</h2>
        ${upcoming.length ? `<ul class="session-list">${upcoming.map((s) => sessionCard(s, true)).join('')}</ul>` : `<p class="text-2">${esc(M.noUpcoming)}</p>`}
      </section>
      <section aria-labelledby="past-h" class="stack">
        <h2 class="h3" id="past-h">${esc(M.past)}</h2>
        ${past.length ? `<ul class="session-list">${past.map((s) => sessionCard(s, false)).join('')}</ul>` : `<p class="text-2">${esc(M.noPast)}</p>`}
      </section>
      <section aria-labelledby="team-h" class="stack">
        <div><h2 class="h3" id="team-h">${esc(M.team)}</h2><p class="text-2">${esc(M.teamLead)}</p></div>
        <ul class="mentor-grid">
          ${MENTORS.filter((m) => m.active).map((m) => `
            <li class="card mentor-card">
              <div class="mentor-card__head"><span class="avatar avatar--lg" aria-hidden="true">${esc(m.initials)}</span>
                <div><h3 class="card__title">${esc(m.name)}</h3><p class="text-3">${esc(m.title)}${org.mentorId === m.id ? ' · Your mentor' : ''}</p></div></div>
              <span class="chip chip--reason">${icon('badge-check')}${esc(M.badge)}</span>
              <p class="text-2">${esc(m.bio)}</p>
              <ul class="pill-list mentor-card__skills">${m.specialties.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
            </li>`).join('')}
        </ul>
      </section>
    </div>`;
}

export function bind(root) {
  root.querySelectorAll('[data-prep]').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault();
    savePrepNotes(f.dataset.prep, f.querySelector('textarea').value.trim());
    showToast(M.prepSaved, { text: 'Your mentor will see them before the session.', iconName: 'notebook-pen' });
  }));
}
