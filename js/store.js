// The store owns all state (CLAUDE.md). Views never touch localStorage.
// State is seeded from /data, persisted under `bvt-demo-v1`, and falls back to memory
// if storage is unavailable. subscribe() lets the app re-render on change.
// Derived values live in selectors.js.
import { PERSONAS } from '../data/users.js';
import { ORGS } from '../data/orgs.js';
import { EVIDENCE } from '../data/evidence.js';
import { REVIEWS } from '../data/reviews.js';
import { SESSIONS } from '../data/sessions.js';
import { NOTIFICATIONS } from '../data/notifications.js';
import { seedProgress, seedAnswers, seedLearning, seedEarned, sampleAnswers } from '../data/progress.js';
import { addDays } from './util.js';
import { coreReqs, pathwayReqs } from './selectors.js';
import { checkQuestions } from './checkSelectors.js';

const KEY = 'bvt-demo-v1';
const VERSION = 2; // bump whenever the seed shape changes; older saved state is replaced

function seed() {
  return {
    version: VERSION,
    personaId: 'visitor',
    dayOffset: 0,                     // time travel: days added to every persona's demo date
    orgs: structuredClone(ORGS),
    progress: seedProgress(),         // orgId → reqId → { type, status, steps, evidenceIds, … }
    answers: seedAnswers(),           // orgId → reqId → Check answer
    learning: seedLearning(),         // orgId → { watched, sessions, downloads }
    earned: seedEarned(),             // orgId → badgeId → date
    evidence: structuredClone(EVIDENCE),
    reviews: structuredClone(REVIEWS),
    sessions: structuredClone(SESSIONS),
    notifications: structuredClone(NOTIFICATIONS),
    check: null,                      // free Check draft (§8.2) — see blankCheck()
    ui: { sidebarCollapsed: false, areaTreeOpen: true },
    activity: [],                     // simulated events, newest first
  };
}

// ---- Persistence (try/catch everywhere: storage can throw in private modes or sandboxes) ----
let persistent = true;

function load() {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.version === VERSION ? parsed : seed();
  } catch {
    persistent = false;
    return seed();
  }
}

function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    persistent = false;
  }
}

let state = load();
const subscribers = new Set();

export const getState = () => state;
export const isPersistent = () => persistent;

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function notify() {
  subscribers.forEach((fn) => fn(state));
}

/** Mutate state, persist, and notify unless `silent` (caller will trigger the render itself). */
function update(mutate, { silent = false } = {}) {
  mutate(state);
  save();
  if (!silent) notify();
}

// ---- Session selectors (who and when) ----
export const currentPersona = (s = state) => PERSONAS[s.personaId] ?? PERSONAS.visitor;
export const currentOrg = (s = state) => s.orgs[currentPersona(s).orgId] ?? null;
export const todayFor = (persona, s = state) => addDays(persona.demoDate, s.dayOffset);
export const today = (s = state) => todayFor(currentPersona(s), s);

// ---- Actions ----
export function setPersona(id, opts) {
  if (!PERSONAS[id]) return;
  update((s) => { s.personaId = id; }, opts);
}

export function timeTravel(days) {
  update((s) => { s.dayOffset += days; });
}

export function setUi(patch) {
  update((s) => { Object.assign(s.ui, patch); });
}

/** Demo shortcut: verify every Core requirement and accredit the current persona's organisation today. */
export function jumpToAccredited() {
  const org = currentOrg();
  if (!org) return null;
  const on = today();
  update((s) => {
    const o = s.orgs[org.id];
    o.accreditedOn = on;
    o.certNo = o.certNo ?? 'BVT-2027-000124';
    [...pathwayReqs(o), ...coreReqs(o)].forEach((r) => {
      const p = s.progress[o.id][r.id];
      p.status = 'verified';
      p.lastActivity = { on, text: 'Verified' };
    });
    s.earned[o.id].accredited = on;
    s.activity.unshift({ kind: 'accredited', orgId: o.id, on });
  });
  return org;
}

/** Demo panel "Simulate" actions. Phase 8 (requirements) and Phase 14 (back-office) wire real outcomes. */
export function simulate(kind) {
  update((s) => { s.activity.unshift({ kind, personaId: s.personaId, on: today(s) }); });
}

// ---- Free Check draft (§8.2). One draft per browser; answers save as you go. ----
const blankCheck = () => ({
  leadName: '', email: '', leadRole: '', declared: false,
  orgName: '', abn: '', staff: '', oric: 'no', debt: 'no',
  checkId: null, preselect: null, answers: {}, notes: {}, index: 0,
  startedOn: null, savedAt: null, completedOn: null,
});
const draft = (s) => (s.check ??= blankCheck());

export function startSignUp({ leadName, email, preselect }) {
  update((s) => { Object.assign(draft(s), { leadName, email }, preselect ? { preselect } : {}); });
}

export function saveCheckDetails(details) {
  update((s) => { Object.assign(draft(s), details); });
}

/** Choosing a different check starts its answers afresh. */
export function chooseCheck(checkId) {
  update((s) => {
    const c = draft(s);
    if (c.checkId !== checkId) Object.assign(c, { checkId, answers: {}, notes: {}, index: 0, completedOn: null });
    c.startedOn ??= today(s);
  });
}

export function answerQuestion(questionId, answer) {
  update((s) => { const c = draft(s); c.answers[questionId] = answer; c.savedAt = Date.now(); });
}

/** Notes save silently (no re-render while typing). */
export function setCheckNote(questionId, note) {
  update((s) => { const c = draft(s); c.notes[questionId] = note; c.savedAt = Date.now(); }, { silent: true });
}

export function goToQuestion(index) {
  update((s) => { const c = draft(s); c.index = Math.max(0, Math.min(index, checkQuestions(c.checkId).length - 1)); });
}

export function completeCheck() {
  update((s) => { draft(s).completedOn = today(s); });
}

/** Demo shortcut: keep the answers given so far, fill the rest with the sample organisation's answers. */
export function skipCheckToResults() {
  update((s) => {
    const c = draft(s);
    const sample = sampleAnswers(c.checkId);
    checkQuestions(c.checkId).forEach((q) => { c.answers[q.id] ??= sample[q.id] ?? 'not-yet'; });
    c.completedOn = today(s);
    c.savedAt = Date.now();
  });
}

export function resetDemo() {
  const keepPersona = state.personaId;
  state = seed();
  state.personaId = keepPersona;
  save();
  notify();
}
