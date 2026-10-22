// Floating Demo panel (§6.3): view as a persona, time travel, simulate outcomes, reset.
// Lives outside #app so it survives re-renders and stays usable while modals are open.
import { PROTOTYPE_NOTE } from '../data/copy.js';
import { esc, formatDate } from './util.js';
import { icon, renderIcons } from './components/icon.js';
import { showToast } from './components/toast.js';
import {
  getState, subscribe, currentPersona, currentOrg, today, isPersistent, personaFor, personaIds,
  timeTravel, jumpToAccredited, resetDemo,
} from './store.js';
import { decideNext, completeNextSession } from './reqStore.js';
import { parseHash, navigate } from './router.js';
import { switchPersona } from './session.js';
import { isAccredited } from './selectors.js';

const SIMULATIONS = {
  'verifier-approves': { label: 'Verifier approves next item', icon: 'circle-check', toast: 'Simulated: the verifier approved the next item' },
  'verifier-changes': { label: 'Verifier requests changes', icon: 'pencil-line', toast: 'Simulated: the verifier asked for one more thing' },
  'mentor-complete': { label: 'Mentor session completed', icon: 'users', toast: 'Simulated: your mentor session is complete' },
};

let open = false;
let host;

function personaButton(p, currentId) {
  const on = p.id === currentId;
  return `
    <li>
      <button type="button" class="demo__persona" data-demo-persona="${p.id}" data-focus-key="persona-${p.id}" aria-pressed="${on}">
        <span class="demo__persona-key" aria-hidden="true">${p.id === 'visitor' ? icon('globe') : p.id === 'N' ? icon('sparkles') : p.id}</span>
        <span class="demo__persona-text">
          <span class="demo__persona-name">${esc(p.name)}${p.title ? `, ${esc(p.title)}` : ''}</span>
          <span class="demo__persona-sum">${esc(p.summary)}</span>
        </span>
      </button>
    </li>`;
}

function panel() {
  const s = getState();
  const persona = currentPersona(s);
  const org = currentOrg(s);
  const canAccredit = persona.role === 'lead' && org && !isAccredited(org);
  return `
    <section class="demo__panel on-dark" id="demo-panel" aria-labelledby="demo-title" ${open ? '' : 'hidden'}>
      <div class="demo__head">
        <h2 class="demo__title" id="demo-title">${icon('flask-conical')}Demo controls</h2>
        <button type="button" class="btn btn--on-dark-ghost btn--icon" data-demo-close data-focus-key="close" aria-label="Close demo controls">${icon('x')}</button>
      </div>

      <div class="demo__section">
        <h3 class="demo__label">View as</h3>
        <ul class="demo__personas">${personaIds(s).map((id) => personaButton(personaFor(s, id), s.personaId)).join('')}</ul>
      </div>

      <div class="demo__section">
        <h3 class="demo__label">Time travel</h3>
        <p class="demo__date">Demo date: <strong>${formatDate(today(s), { weekday: true })}</strong></p>
        <div class="demo__row">
          <button type="button" class="btn btn--on-dark" data-demo-time="7" data-focus-key="t7">${icon('fast-forward')}+1 week</button>
          <button type="button" class="btn btn--on-dark" data-demo-time="30" data-focus-key="t30">${icon('fast-forward')}+1 month</button>
        </div>
        <button type="button" class="btn btn--on-dark btn--block" data-demo-accredit data-focus-key="accredit" ${canAccredit ? '' : 'disabled'}>
          ${icon('award')}Jump to accredited</button>
        ${canAccredit ? '' : `<p class="demo__hint">${persona.role === 'lead' ? 'Already accredited.' : 'Choose persona A, B or C first.'}</p>`}
      </div>

      <div class="demo__section">
        <h3 class="demo__label">Simulate</h3>
        <div class="demo__stack">
          ${Object.entries(SIMULATIONS).map(([k, v]) => `
            <button type="button" class="btn btn--on-dark btn--block btn--wrap" data-demo-sim="${k}" data-focus-key="sim-${k}">${icon(v.icon)}${v.label}</button>`).join('')}
        </div>
      </div>

      <div class="demo__section">
        <button type="button" class="btn btn--on-dark-ghost btn--block" data-demo-reset data-focus-key="reset">${icon('rotate-ccw')}Reset demo</button>
        <p class="demo__note">${icon('shield-check')}${PROTOTYPE_NOTE}.${isPersistent() ? '' : ' Browser storage is unavailable, so changes last until you refresh.'}</p>
      </div>
    </section>`;
}

function render() {
  const key = host.contains(document.activeElement) ? document.activeElement.dataset.focusKey : null;
  host.innerHTML = `
    <div class="demo">
      <button type="button" class="demo__toggle" data-demo-toggle data-focus-key="toggle"
        aria-expanded="${open}" aria-controls="demo-panel">${icon('sliders-horizontal')}Demo</button>
      ${panel()}
    </div>`;
  renderIcons(host);
  if (key) host.querySelector(`[data-focus-key="${key}"]`)?.focus();
}

function setOpen(value, { focus = true } = {}) {
  open = value;
  render();
  if (!focus) return;
  host.querySelector(open ? '[data-demo-persona][aria-pressed="true"]' : '[data-demo-toggle]')?.focus();
}

/** Simulate a verifier or mentor outcome. On a requirement page, that requirement is decided first. */
function runSimulation(kind) {
  const s = SIMULATIONS[kind];
  if (kind === 'mentor-complete') {
    const session = completeNextSession();
    showToast(session ? s.toast : 'No upcoming mentor session to complete', { text: session ? `${session.topic} · notes are on the Mentoring page.` : '', iconName: s.icon });
    return;
  }
  const m = parseHash().path.match(/^\/app\/req\/([^/]+)/);
  const outcome = decideNext(kind === 'verifier-approves' ? 'verified' : 'changes', { reqId: m?.[1] });
  if (!outcome) {
    showToast('Nothing is waiting for verification', { text: 'Submit evidence on a requirement first, then simulate the outcome.', iconName: 'info' });
    return;
  }
  // Follow the outcome on the requirement page it belongs to
  if (m?.[1] === outcome.reqId) navigate(`/app/req/${outcome.reqId}/${kind === 'verifier-approves' ? 'closed' : 'verify'}`);
  showToast(outcome.title, { text: outcome.text, iconName: s.icon });
}

function onClick(e) {
  const t = e.target;
  const persona = t.closest('[data-demo-persona]');
  const time = t.closest('[data-demo-time]');
  const sim = t.closest('[data-demo-sim]');
  if (t.closest('[data-demo-toggle]')) setOpen(!open);
  else if (t.closest('[data-demo-close]')) setOpen(false);
  else if (persona) {
    const p = personaFor(getState(), persona.dataset.demoPersona);
    switchPersona(p.id);
    showToast(`Viewing as ${p.name}`, { text: p.summary, iconName: 'user' });
  } else if (time) {
    timeTravel(Number(time.dataset.demoTime));
    showToast(`Demo date is now ${formatDate(today(), { weekday: true })}`, { iconName: 'calendar-days' });
  } else if (t.closest('[data-demo-accredit]')) {
    const org = jumpToAccredited();
    if (org) showToast(`${org.name} is accredited`, { text: 'Connect profile and Enterprise hub now unlock where the date allows.', iconName: 'award' });
  } else if (sim) {
    runSimulation(sim.dataset.demoSim);
  } else if (t.closest('[data-demo-reset]')) {
    resetDemo();
    showToast('Demo reset', { text: 'Every persona is back to its starting point.', iconName: 'rotate-ccw' });
  }
}

export function mountDemoPanel() {
  host = document.getElementById('demo-root');
  if (!host) return;
  host.addEventListener('click', onClick);
  host.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) { e.stopPropagation(); setOpen(false); }
  });
  subscribe(render);
  render();
}
