// The store owns all state (CLAUDE.md). Views never touch localStorage.
// State is seeded from /data, persisted under `bvt-demo-v1`, and falls back to memory
// if storage is unavailable. subscribe() lets the app re-render on change.
// Derived values live in selectors.js.
import { PERSONAS, PERSONA_ORDER, NEW_LEAD, TEAM_MEMBER } from '../data/users.js';
import { ORGS } from '../data/orgs.js';
import { EVIDENCE } from '../data/evidence.js';
import { REVIEWS } from '../data/reviews.js';
import { SESSIONS } from '../data/sessions.js';
import { NOTIFICATIONS } from '../data/notifications.js';
import { ALI_HISTORY_SEED } from '../data/ali.js';
import { seedProgress, seedAnswers, seedLearning, seedEarned, sampleAnswers, freshProgress } from '../data/progress.js';
import { addDays, addMonths } from './util.js';
import { coreReqs, pathwayReqs } from './selectors.js';
import { checkQuestions, enrolmentOffer } from './checkSelectors.js';

const KEY = 'bvt-demo-v1';
const VERSION = 4; // bump whenever the seed shape changes; older saved state is replaced

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
    ali: structuredClone(ALI_HISTORY_SEED), // orgId → Ask Ali questions and answers
    check: null,                      // free Check draft (§8.2) — see blankCheck()
    ui: { sidebarCollapsed: false, areaTreeOpen: true, lens: 'area', boardView: null },
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

/** For companion action modules (reqStore.js): the same mutate → persist → notify path. */
export const commit = (mutate, opts) => update(mutate, opts);

// ---- Session selectors (who and when) ----
const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || NEW_LEAD.initials;

/** A persona by id. "N" is the organisation enrolled from the free Check (exists once it has enrolled);
 *  "T" is the team member chosen with "View as" in the Enterprise hub. */
export function personaFor(s, id) {
  if (id === TEAM_MEMBER.id) {
    const v = s.memberView;
    const m = v && s.orgs[v.orgId]?.team?.find((x) => x.id === v.memberId);
    return m ? { ...TEAM_MEMBER, name: m.name, title: m.role, initials: initials(m.name), orgId: v.orgId, memberId: m.id, summary: `Team member at ${s.orgs[v.orgId].name}` } : null;
  }
  if (id !== NEW_LEAD.id) return PERSONAS[id] ?? null;
  const org = s.orgs[NEW_LEAD.orgId];
  if (!org) return null;
  return { ...NEW_LEAD, name: org.lead.name, title: org.lead.role, initials: initials(org.lead.name), summary: `${org.name}, enrolled in this demo` };
}
/** Persona ids for "View as" lists: the fixed personas, plus N once it exists. */
export const personaIds = (s = state) => [...PERSONA_ORDER, ...(s.orgs[NEW_LEAD.orgId] ? [NEW_LEAD.id] : []), ...(personaFor(s, TEAM_MEMBER.id) ? [TEAM_MEMBER.id] : [])];
/** The team member being viewed, when the persona is a team member. */
export const currentMember = (s = state) => {
  const p = currentPersona(s);
  return p.role === 'member' ? s.orgs[p.orgId].team.find((m) => m.id === p.memberId) : null;
};

export const currentPersona = (s = state) => personaFor(s, s.personaId) ?? PERSONAS.visitor;
export const currentOrg = (s = state) => s.orgs[currentPersona(s).orgId] ?? null;
export const todayFor = (persona, s = state) => addDays(persona.demoDate, s.dayOffset);
export const today = (s = state) => todayFor(currentPersona(s), s);

// ---- Actions ----
export function setPersona(id, opts) {
  if (!personaFor(state, id)) return;
  update((s) => { s.personaId = id; }, opts);
}

export function timeTravel(days) {
  update((s) => { s.dayOffset += days; });
}

export function setUi(patch) {
  update((s) => { Object.assign(s.ui, patch); });
}

/** Remember a UI preference without re-rendering (the element already shows it, e.g. an open <details>). */
export function rememberUi(patch) {
  update((s) => { Object.assign(s.ui, patch); }, { silent: true });
}

/** Remember the Academy lens last viewed (§8.5). Silent: called while that lens is on screen. */
export function rememberLens(lens) {
  if (state.ui.lens === lens) return;
  update((s) => { s.ui.lens = lens; }, { silent: true });
}

/** Pretend learning (§8.6): mark a video watched, a session viewed or a template downloaded. */
export function markLearning(kind, itemId) {
  const org = currentOrg();
  if (!org) return;
  update((s) => {
    const l = (s.learning[org.id] ??= { watched: [], sessions: [], downloads: [] });
    if (!l[kind].includes(itemId)) l[kind].push(itemId);
    s.activity.unshift({ kind: `learning-${kind}`, orgId: org.id, itemId, on: today(s) });
  });
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

/** Silent: the enrol page updates its package card itself, so the radios keep focus. */
export function setScreening(patch) {
  update((s) => { const c = draft(s); c.screening = { ...c.screening, ...patch }; }, { silent: true });
}

// ---- Enrolment & onboarding (§8.3) ----
/**
 * Pretend payment: create the organisation from the free Check, start its clock today and sign in as its lead.
 * Enrolling again replaces the earlier demo organisation.
 */
export function enrolFromCheck() {
  const c = state.check;
  if (!c?.completedOn) return null;
  const offer = enrolmentOffer(c);
  const on = today();
  const id = NEW_LEAD.orgId;
  const answers = Object.fromEntries(checkQuestions(c.checkId).map((q) => [q.id, c.answers[q.id] ?? 'not-yet']));
  update((s) => {
    s.orgs[id] = {
      id, name: c.orgName, staff: Number(c.staff), state: '', city: '', industry: '', abn: c.abn,
      checkId: c.checkId, checkScore: offer.score, tier: offer.tier,
      enrolledOn: on, endsOn: addMonths(on, offer.months),
      pathway: offer.pathway, accreditedOn: null, certNo: null,
      credits: { ...offer.credits }, weeklyGoalHrs: null, reminderDay: null,
      momentum: { activeWeeks: 0, thisWeekMins: 0, graceUsedOn: null },
      startChoice: null, startDomainId: null, onboardedOn: null,
      consentToPartners: [], mentorId: null,
      lead: { name: c.leadName, email: c.email, role: c.leadRole },
    };
    s.progress[id] = freshProgress(c.checkId, answers, offer.pathway);
    s.answers[id] = answers;
    s.learning[id] = { watched: [], sessions: [], downloads: [] };
    s.ali[id] = [];
    s.earned[id] = { 'check-complete': c.completedOn, enrolled: on };
    s.personaId = NEW_LEAD.id;
    s.activity.unshift({ kind: 'enrolled', orgId: id, on });
  });
  return state.orgs[id];
}

/** Onboarding choices save as they change (silent: the wizard updates itself). */
export function saveOnboarding(patch) {
  const org = currentOrg();
  if (!org) return;
  update((s) => { Object.assign(s.orgs[org.id], patch); }, { silent: true });
}

/** Finish (or skip) onboarding: anything not chosen gets a sensible default. */
export function finishOnboarding() {
  const org = currentOrg();
  if (!org) return null;
  update((s) => {
    const o = s.orgs[org.id];
    o.weeklyGoalHrs ??= 2;
    o.reminderDay ??= 'Mon';
    const anyInPlace = Object.values(s.progress[o.id] ?? {}).some((p) => p.type === 'in-place');
    o.startChoice ??= o.pathway ? 'pathway' : anyInPlace ? 'quick-wins' : 'biggest-gaps';
    o.onboardedOn ??= today(s);
  });
  return state.orgs[org.id];
}

export function resetDemo() {
  const keepPersona = state.personaId;
  state = seed();
  state.personaId = personaFor(state, keepPersona) ? keepPersona : 'visitor';
  save();
  notify();
}
