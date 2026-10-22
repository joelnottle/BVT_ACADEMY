// The store owns all state (CLAUDE.md). Views never touch localStorage.
// State is seeded from /data, persisted under `bvt-demo-v1`, and falls back to memory
// if storage is unavailable. subscribe() lets the app re-render on change.
import { PERSONAS } from '../data/users.js';
import { ORGS } from '../data/orgs.js';
import { addDays, daysBetween } from './util.js';

const KEY = 'bvt-demo-v1';
const VERSION = 1;

/** Enterprise Stage first release (§2 Stages). */
export const ENTERPRISE_OPENS = '2027-07-01';

function seed() {
  return {
    version: VERSION,
    personaId: 'visitor',
    dayOffset: 0,                       // time travel: days added to every persona's demo date
    orgs: structuredClone(ORGS),
    ui: { sidebarCollapsed: false, areaTreeOpen: true },
    activity: [],                       // simulated events, newest first
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

// ---- Selectors ----
export const currentPersona = (s = state) => PERSONAS[s.personaId] ?? PERSONAS.visitor;
export const currentOrg = (s = state) => s.orgs[currentPersona(s).orgId] ?? null;
export const today = (s = state) => addDays(currentPersona(s).demoDate, s.dayOffset);

export const isAccredited = (org) => Boolean(org?.accreditedOn);
export const daysLeft = (org, on) => (org ? daysBetween(on, org.endsOn) : 0);
export const enterpriseOpen = (org, on) => isAccredited(org) && on >= ENTERPRISE_OPENS;

// Phase 2 replaces these stubs with selectors derived from requirement progress (§10).
export const verifiedReadiness = (org) => {
  const { verified = 0, total = 0, claimed = 0 } = org?._stub ?? {};
  return { verified, total, claimed, pct: total ? Math.round((verified / total) * 100) : 0 };
};
export const paceStatus = (org) => org?._stub?.pace ?? 'on-pace';
export const domainProgress = (org, domainId) => org?._stub?.domains?.[domainId] ?? [0, 0];
export const pathwayProgress = (org) => ({ done: org?._stub?.pathwayDone ?? 0, total: org?._stub?.pathwayTotal ?? 0 });
export const coreLocked = (org) => Boolean(org?.pathway) && pathwayProgress(org).done < pathwayProgress(org).total;

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

/** Demo shortcut: mark the current persona's organisation accredited today. Phase 10 completes the flow. */
export function jumpToAccredited() {
  const org = currentOrg();
  if (!org) return null;
  const on = today();
  update((s) => {
    const o = s.orgs[org.id];
    o.accreditedOn = on;
    o.certNo = o.certNo ?? 'BVT-2027-000124';
    o._stub.verified = o._stub.total;
    o._stub.claimed = 0;
    Object.values(o._stub.domains).forEach((d) => { d[0] = d[1]; });
    s.activity.unshift({ kind: 'accredited', orgId: o.id, on });
  });
  return org;
}

/** Demo panel "Simulate" actions. Phase 8 (requirements) and Phase 14 (back-office) wire real outcomes. */
export function simulate(kind) {
  update((s) => { s.activity.unshift({ kind, personaId: s.personaId, on: today(s) }); });
}

export function resetDemo() {
  const keepPersona = state.personaId;
  state = seed();
  state.personaId = keepPersona;
  save();
  notify();
}
