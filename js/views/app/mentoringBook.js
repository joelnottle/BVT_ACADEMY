// #/app/mentoring/book(?req=FM-04 | ?module=mod-cashflow) — topic → mentor → slot from the week grid → prep
// notes → confirm (§8.11). Pretend: uses one mentor credit and adds the session to Upcoming.
import { MENTORING as M, MENTOR_FOR_AREA, isSlotTaken } from '../../../data/mentoring.js';
import { MENTORS, SLOTS } from '../../../data/mentors.js';
import { MODULE_BY_ID } from '../../../data/modules.js';
import { esc, formatDate, addDays } from '../../util.js';
import { icon, renderIcons } from '../../components/icon.js';
import { openModal } from '../../components/modal.js';
import { showToast } from '../../components/toast.js';
import { navigate } from '../../router.js';
import { currentOrg } from '../../store.js';
import { REQ_BY_ID, mentorById } from '../../selectors.js';
import { lensItems, lensAreas, moduleCards } from '../../lensSelectors.js';
import { bookSession } from '../../supportStore.js';

const B = M.bookPage;
const ACTIVE = MENTORS.filter((m) => m.active);

/** The next five weekdays after today. */
function weekDays(today) {
  const out = [];
  for (let i = 1; out.length < 5; i += 1) {
    const d = addDays(today, i);
    const dow = new Date(`${d}T00:00:00Z`).getUTCDay();
    if (dow !== 0 && dow !== 6) out.push(d);
  }
  return out;
}

const topicArea = (value) => {
  const [kind, id] = (value ?? '').split(':');
  if (kind === 'req') return REQ_BY_ID[id]?.domainId ?? null;
  if (kind === 'mod') return MODULE_BY_ID[id]?.domainId ?? null;
  return null;
};

function mentorOptions(org, topic, selected) {
  const suggested = MENTOR_FOR_AREA[topicArea(topic)] ?? null;
  return ACTIVE.map((m) => `
    <label class="option choice-card mentor-option">
      <input type="radio" name="mentor" value="${m.id}"${m.id === selected ? ' checked' : ''}>
      <span class="choice-card__body">
        ${m.id === org.mentorId ? `<span class="chip chip--reason">${icon('user-check')}${esc(B.yours)}</span>` : m.id === suggested ? `<span class="chip chip--reason">${icon('sparkles')}${esc(B.suggested)}</span>` : ''}
        <strong>${esc(m.name)}</strong><span class="text-2">${esc(m.specialties.join(' · '))}</span>
      </span>
    </label>`).join('');
}

function slotGrid(mentorId, days, selected) {
  return days.map((d) => `
    <div class="slot-day">
      <p class="slot-day__name" aria-hidden="true">${esc(formatDate(d, { weekday: true }).replace(/ \d{4}$/, ''))}</p>
      ${SLOTS.map((t) => {
        const value = `${d}T${t}`;
        const taken = isSlotTaken(mentorId, d, t);
        return `<label class="slot${taken ? ' is-taken' : ''}">
          <input type="radio" name="slot" value="${value}"${taken ? ' disabled' : ''}${value === selected ? ' checked' : ''}>
          <span aria-hidden="true">${t}</span><span class="sr-only">${esc(formatDate(d, { weekday: true }))}, ${t}${taken ? ', already booked' : ''}</span></label>`;
      }).join('')}
    </div>`).join('');
}

export function render(ctx) {
  const { state, org, today, query } = ctx;
  if (org.credits.mentor < 1) {
    return `<div class="page"><header class="page-header"><h1>${esc(B.title)}</h1></header>
      <p class="callout">${icon('info')}<span>${esc(M.outOf)} <a href="#/app/mentoring">Back to Mentoring</a></span></p></div>`;
  }
  const topic = query.req ? `req:${query.req}` : query.module ? `mod:${query.module}` : '';
  const mentorId = org.mentorId ?? MENTOR_FOR_AREA[topicArea(topic)] ?? ACTIVE[0].id;
  const items = lensItems(state, org, today);
  const days = weekDays(today);
  return `
    <div class="page book-page">
      <nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="#/app/mentoring">Mentoring</a></li><li><span aria-current="page">${esc(B.title)}</span></li></ol></nav>
      <header class="page-header"><h1>${esc(B.title)}</h1><p class="lead">${esc(M.how)}</p><p class="text-2">${icon('users')} ${esc(M.credits(org.credits.mentor))}</p></header>
      <form class="book-form" data-book novalidate>
        <section class="card stack" aria-labelledby="bk-1">
          <h2 class="h3" id="bk-1">1 · ${esc(B.topic)}</h2>
          <div class="field">
            <label class="field__label" for="bk-topic">Topic</label>
            <select class="select" id="bk-topic" name="topic" aria-describedby="bk-topic-hint">
              <option value="">Choose a requirement or module</option>
              ${lensAreas(org).map((a) => `<optgroup label="${esc(a.name)}">${items.filter((x) => x.areaId === a.id).map((x) => `<option value="req:${x.id}"${topic === `req:${x.id}` ? ' selected' : ''}>${esc(x.id)} ${esc(x.title)}</option>`).join('')}</optgroup>`).join('')}
              <optgroup label="Topic modules">${moduleCards(state, org).map((c) => `<option value="mod:${c.id}"${topic === `mod:${c.id}` ? ' selected' : ''}>${esc(c.title)}</option>`).join('')}</optgroup>
            </select>
            <p class="field__hint" id="bk-topic-hint">${esc(B.topicHint)}</p>
            <p class="field__error" id="bk-topic-err" hidden></p>
          </div>
        </section>
        <section class="card stack" aria-labelledby="bk-2">
          <h2 class="h3" id="bk-2">2 · ${esc(B.mentor)}</h2>
          <fieldset class="fieldset"><legend class="sr-only">${esc(B.mentor)}</legend><div class="choice-grid mentor-options" data-mentors>${mentorOptions(org, topic, mentorId)}</div></fieldset>
        </section>
        <section class="card stack" aria-labelledby="bk-3">
          <h2 class="h3" id="bk-3">3 · ${esc(B.slot)}</h2>
          <fieldset class="fieldset" aria-describedby="bk-slot-hint"><legend class="sr-only">${esc(B.slot)}</legend>
            <p class="field__hint" id="bk-slot-hint">${esc(B.slotHint)}</p>
            <div class="slot-grid" data-slots>${slotGrid(mentorId, days, '')}</div>
            <p class="field__error" id="bk-slot-err" hidden></p>
          </fieldset>
        </section>
        <section class="card stack" aria-labelledby="bk-4">
          <h2 class="h3" id="bk-4">4 · ${esc(B.prep)}</h2>
          <div class="field"><label class="sr-only" for="bk-prep">${esc(B.prep)}</label>
            <textarea class="textarea" id="bk-prep" name="prep" rows="4" aria-describedby="bk-prep-hint"></textarea>
            <p class="field__hint" id="bk-prep-hint">${esc(B.prepHint)}</p></div>
        </section>
        <p class="callout callout--cream">${icon('shield-check')}<span>${esc(M.note)}</span></p>
        <div class="step-actions"><a class="btn btn--outline" href="#/app/mentoring">Cancel</a><button type="submit" class="btn btn--action">${icon('calendar-check')}${esc(B.confirm)}</button></div>
      </form>
    </div>`;
}

const showErr = (form, id, msg) => {
  const el = form.querySelector(`#${id}`);
  el.hidden = !msg;
  el.innerHTML = msg ? `${icon('circle-alert')}${esc(msg)}` : '';
  renderIcons(el);
};

export function bind(root, ctx) {
  const form = root.querySelector('[data-book]');
  if (!form) return;
  const days = weekDays(ctx.today);
  const mentorNow = () => form.querySelector('input[name="mentor"]:checked')?.value;

  form.elements.topic.addEventListener('change', () => {
    const box = form.querySelector('[data-mentors]');
    box.innerHTML = mentorOptions(currentOrg(), form.elements.topic.value, mentorNow());
    renderIcons(box);
  });
  form.querySelector('[data-slots]').addEventListener('change', () => showErr(form, 'bk-slot-err', ''));
  form.elements.topic.addEventListener('change', () => { showErr(form, 'bk-topic-err', ''); form.elements.topic.setAttribute('aria-invalid', 'false'); });
  form.querySelector('[data-mentors]').addEventListener('change', () => {
    const box = form.querySelector('[data-slots]');
    box.innerHTML = slotGrid(mentorNow(), days, '');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const topic = form.elements.topic.value;
    const slot = form.querySelector('input[name="slot"]:checked')?.value;
    showErr(form, 'bk-topic-err', topic ? '' : B.needTopic);
    showErr(form, 'bk-slot-err', slot ? '' : B.needSlot);
    form.elements.topic.setAttribute('aria-invalid', String(!topic));
    if (!topic) { form.elements.topic.focus(); return; }
    if (!slot) { form.querySelector('input[name="slot"]:not(:disabled)')?.focus(); return; }
    const [kind, id] = topic.split(':');
    const [date, time] = slot.split('T');
    const mentor = mentorById(mentorNow());
    const when = `${formatDate(date, { weekday: true })}, ${time}`;
    openModal({
      title: B.confirmTitle,
      body: `<p>${esc(B.confirmText(mentor.name, when))}</p>`,
      actions: [{ label: 'Cancel', value: 'cancel', variant: 'outline' }, { label: B.confirm, value: 'book', variant: 'action' }],
      onAction(value) {
        if (value !== 'book') return;
        navigate('/app/mentoring');
        bookSession({
          mentorId: mentor.id, date, time, reqId: kind === 'req' ? id : null,
          topic: kind === 'req' ? REQ_BY_ID[id].title : MODULE_BY_ID[id].title,
          prepNotes: form.elements.prep.value.trim(),
        });
        showToast(B.booked(when, mentor.name), { text: B.bookedText, iconName: 'calendar-check' });
      },
    });
  });
}
