// Derived selectors (BUILD_PLAN §10). Pure functions of state — no DOM, no storage.
// Views read through these so every lens shows the same truth.
import { REQUIREMENTS, REQ_BY_ID, reqsForCheck } from '../data/requirements.js';
import { MODULE_BY_ID } from '../data/modules.js';
import { DOMAINS } from '../data/domains.js';
import { PATHWAYS } from '../data/pathways.js';
import { ANSWER_SCALE } from '../data/checks.js';
import { BADGES } from '../data/badges.js';
import { MENTORS, MENTOR_BY_ID } from '../data/mentors.js';
import { OTHER_ORGS } from '../data/orgs.js';
import { REFERRALS } from '../data/partners.js';
import { CONNECT_LISTINGS } from '../data/connect.js';
import { FEEDBACK } from '../data/copy.js';
import { daysBetween, addDays, clamp } from './util.js';

export const ENTERPRISE_OPENS = '2027-07-01';
const SUBMITTED = ['in-review', 'changes', 'verified'];
const EMPTY = { type: 'not-yet', status: 'not-started', steps: {}, evidenceIds: [], fastTracked: false, notes: '', lastActivity: null };

// ---- Basics ----
export const isAccredited = (org) => Boolean(org?.accreditedOn);
export const daysLeft = (org, today) => (org ? daysBetween(today, org.endsOn) : 0);
export const enterpriseOpen = (org, today) => isAccredited(org) && today >= ENTERPRISE_OPENS;
export const orgById = (state, id) => state.orgs[id] ?? OTHER_ORGS[id] ?? null;

export const coreReqs = (org) => (org ? reqsForCheck(org.checkId) : []);
export const pathwayReqs = (org) => (org?.pathway ? PATHWAYS[org.pathway].requirementIds.map((id) => REQ_BY_ID[id]) : []);
export const progressOf = (state, orgId, reqId) => state.progress[orgId]?.[reqId] ?? EMPTY;

// ---- Check score and tier (§2 Timeframes) ----
/** Score = (in place + half of partly) / applicable questions. TODO(client): confirm scoring (§14 Q4). */
export function checkScore(answers = {}) {
  const weights = Object.fromEntries(ANSWER_SCALE.map((a) => [a.id, a.weight]));
  const applicable = Object.values(answers).filter((a) => weights[a] !== null);
  if (!applicable.length) return 0;
  const points = applicable.reduce((sum, a) => sum + (weights[a] ?? 0), 0);
  return Math.round((points / applicable.length) * 100);
}
export const tierForScore = (pct) => (pct <= 25 ? 'foundation' : pct <= 50 ? 'core' : pct <= 75 ? 'advanced' : 'ready');

// ---- Pathway & locking ----
export function pathwayProgress(state, org) {
  const reqs = pathwayReqs(org);
  const done = reqs.filter((r) => progressOf(state, org.id, r.id).status === 'verified').length;
  return { done, total: reqs.length, complete: reqs.length > 0 && done === reqs.length };
}
// A pathway with no content yet (Recovery, TODO(client) §14 Q11) does not lock Core.
export const coreLocked = (state, org) => pathwayReqs(org).length > 0 && !pathwayProgress(state, org).complete;
export const isLocked = (state, req, org) => !req.pathway && coreLocked(state, org);

// ---- Readiness ----
/** Verified share of Core requirements (the real measure) and claimed-in-place items not yet evidenced. */
export function verifiedReadiness(state, org) {
  const reqs = coreReqs(org);
  const p = (r) => progressOf(state, org.id, r.id);
  const verified = reqs.filter((r) => p(r).status === 'verified').length;
  const claimed = claimedInPlace(state, org);
  return { verified, claimed, total: reqs.length, pct: reqs.length ? Math.round((verified / reqs.length) * 100) : 0 };
}
export function claimedInPlace(state, org) {
  return coreReqs(org).filter((r) => {
    const p = progressOf(state, org.id, r.id);
    return p.type === 'in-place' && !SUBMITTED.includes(p.status);
  }).length;
}
export const typeCounts = (state, org) => {
  const inPlace = coreReqs(org).filter((r) => progressOf(state, org.id, r.id).type === 'in-place').length;
  return { inPlace, notYet: coreReqs(org).length - inPlace };
};

export function domainProgress(state, org) {
  const reqs = coreReqs(org);
  return DOMAINS.map((d) => {
    const own = reqs.filter((r) => r.domainId === d.id);
    const p = (r) => progressOf(state, org.id, r.id);
    return {
      ...d,
      total: own.length,
      verified: own.filter((r) => p(r).status === 'verified').length,
      inPlace: own.filter((r) => p(r).type === 'in-place').length,
      claimed: own.filter((r) => p(r).type === 'in-place' && !SUBMITTED.includes(p(r).status)).length,
    };
  });
}
export const domainStat = (state, org, domainId) => domainProgress(state, org).find((d) => d.id === domainId);

/** Counts per status for the board (locked items counted separately). */
export function statusCounts(state, org) {
  const counts = { 'not-started': 0, learning: 0, 'evidence-needed': 0, 'in-review': 0, changes: 0, verified: 0, locked: 0 };
  coreReqs(org).forEach((r) => {
    if (isLocked(state, r, org)) counts.locked += 1;
    else counts[progressOf(state, org.id, r.id).status] += 1;
  });
  return counts;
}

// ---- Pace (§9): Ahead · On pace · Needs a catch-up — never a red countdown ----
export function paceStatus(state, org, today) {
  if (isAccredited(org)) return { status: 'ahead', accredited: true, daysLeft: 0, remaining: 0, perWeek: 0 };
  const units = [...pathwayReqs(org), ...coreReqs(org)];
  const p = (r) => progressOf(state, org.id, r.id).status;
  const verified = units.filter((r) => p(r) === 'verified').length;
  const done = verified + units.filter((r) => p(r) === 'in-review').length;
  const totalDays = Math.max(1, daysBetween(org.enrolledOn, org.endsOn));
  const elapsed = clamp(daysBetween(org.enrolledOn, today) / totalDays, 0, 1);
  const expected = units.length * elapsed;
  const ratio = expected < 1 ? 1 : done / expected;
  const status = ratio >= 1.25 ? 'ahead' : ratio >= 0.85 ? 'on-pace' : 'catch-up';
  const left = daysLeft(org, today);
  const remaining = units.length - verified;
  const perWeek = left > 0 ? Math.round((remaining / (left / 7)) * 10) / 10 : remaining;
  const behindBy = Math.max(0, Math.ceil(expected * 0.85 - done));
  return {
    status, daysLeft: left, remaining, perWeek, done, expected: Math.round(expected * 10) / 10,
    suggestion: status === 'catch-up' ? FEEDBACK.catchUp(behindBy) : null,
  };
}

// ---- Recommended next (§10 rules, with reason tags) ----
/**
 * 1 changes requested · 2 in-place items with no evidence (quick win) · 3 the module being learned
 * (unblocks N, or continue) · 4 the biggest-gap area's first requirement · 5 due by the pace plan.
 * Locked organisations get their pathway first. Short lists are topped up with further quick wins.
 * `skipIds` leaves out requirements shown elsewhere (e.g. the dashboard's Start here card).
 * @returns {{reqId?:string, moduleId?:string, reason:string, n?:number}[]}
 */
export function recommendedNext(state, org, today, { limit = 3, exclude = [], skipIds = [] } = {}) {
  const out = [];
  const seen = new Set();
  const push = (item) => {
    const key = item.reqId ?? item.moduleId;
    if (!seen.has(key) && !exclude.includes(item.reason) && !skipIds.includes(item.reqId)) { seen.add(key); out.push(item); }
  };
  const p = (id) => progressOf(state, org.id, id);
  const open = (id) => !SUBMITTED.includes(p(id).status);

  if (coreLocked(state, org)) {
    pathwayReqs(org).filter((r) => open(r.id)).forEach((r, i) => push({ reqId: r.id, reason: i === 0 ? 'continue' : 'due-soon' }));
    return out.slice(0, limit);
  }

  const reqs = coreReqs(org);
  reqs.filter((r) => p(r.id).status === 'changes').forEach((r) => push({ reqId: r.id, reason: 'changes' }));

  const quickWins = reqs.filter((r) => p(r.id).type === 'in-place' && p(r.id).status === 'evidence-needed');
  if (quickWins[0]) push({ reqId: quickWins[0].id, reason: 'quick-win', n: quickWins.length });

  const learning = reqs.find((r) => p(r.id).status === 'learning');
  if (learning) {
    const mod = MODULE_BY_ID[learning.moduleId];
    const unverified = mod.requirementIds.filter((id) => reqs.some((r) => r.id === id) && p(id).status !== 'verified');
    push(unverified.length >= 2 ? { moduleId: mod.id, reason: 'unblocks', n: unverified.length } : { reqId: learning.id, reason: 'continue' });
  }

  const gaps = domainProgress(state, org).filter((d) => d.total)
    .sort((a, b) => a.verified / a.total - b.verified / b.total || (b.total - b.inPlace) - (a.total - a.inPlace) || b.total - a.total);
  for (const d of gaps) {
    const r = reqs.find((x) => x.domainId === d.id && p(x.id).type === 'not-yet' && p(x.id).status === 'not-started' && !skipIds.includes(x.id));
    if (r) { push({ reqId: r.id, reason: 'biggest-gap', domainId: d.id }); break; }
  }

  if (paceStatus(state, org, today).status === 'catch-up') quickWins.slice(1).forEach((r) => push({ reqId: r.id, reason: 'due-soon' }));
  quickWins.slice(1).forEach((r) => push({ reqId: r.id, reason: 'quick-win', n: quickWins.length }));
  return out.slice(0, limit);
}

// ---- Onboarding (§8.3) ----
/** Suggested pace for the whole enrolment, as requirements per fortnight (at least 1). */
export function suggestedPace(org) {
  const units = pathwayReqs(org).length + coreReqs(org).length;
  const fortnights = Math.max(1, daysBetween(org.enrolledOn, org.endsOn) / 14);
  return { units, perFortnight: Math.max(1, Math.round(units / fortnights)) };
}

/** The area with the most still to build (not yet in place, not verified); ties go to the larger area. */
export function biggestGapArea(state, org) {
  const reqs = coreReqs(org);
  return DOMAINS.map((d) => {
    const own = reqs.filter((r) => r.domainId === d.id);
    const toBuild = own.filter((r) => { const p = progressOf(state, org.id, r.id); return p.type === 'not-yet' && p.status !== 'verified'; }).length;
    return { ...d, total: own.length, toBuild };
  }).filter((d) => d.total).sort((a, b) => b.toBuild - a.toBuild || b.total - a.total)[0];
}

// ---- Learning (module page "Learning 60% · 1 of 3 verified") ----
export function moduleProgress(state, org, moduleId) {
  const mod = MODULE_BY_ID[moduleId];
  const l = state.learning[org.id] ?? { watched: [], sessions: [], downloads: [] };
  const items = [...mod.videos.map((v) => l.watched.includes(v.id)), ...mod.sessions.map((s) => l.sessions.includes(s.id))];
  const own = new Set([...coreReqs(org), ...pathwayReqs(org)].map((r) => r.id));
  const inScope = mod.requirementIds.filter((id) => own.has(id));
  return {
    learningPct: items.length ? Math.round((items.filter(Boolean).length / items.length) * 100) : 0,
    verified: inScope.filter((id) => progressOf(state, org.id, id).status === 'verified').length,
    total: inScope.length,
  };
}

// ---- Recognition (§9) ----
export function earnedBadges(state, org) {
  const earned = state.earned[org.id] ?? {};
  return BADGES
    .filter((b) => (!b.pathwayOnly || org.pathway) && (!b.enterpriseOnly || isAccredited(org)))
    .map((b) => ({ ...b, earnedOn: earned[b.id] ?? null }));
}

// ---- Mentoring & verification ----
/** A verifier who has mentored the organisation must not decide on its evidence (§8.16). */
export function mentorConflict(state, verifierUserId, orgId) {
  const asMentor = MENTORS.filter((m) => m.userId === verifierUserId);
  return asMentor.some((m) => (m.mentees ?? []).includes(orgId) || (m.formerMentees ?? []).includes(orgId)
    || state.sessions.some((s) => s.mentorId === m.id && s.orgId === orgId));
}

export function reviewQueue(state, verifierUserId, today) {
  return state.reviews.filter((r) => r.status === 'in-review')
    .map((r) => ({ ...r, ageDays: daysBetween(r.submittedOn, today), conflict: mentorConflict(state, verifierUserId, r.orgId) }))
    .sort((a, b) => b.ageDays - a.ageDays);
}

export const mentorFor = (userId) => MENTORS.find((m) => m.userId === userId && m.active) ?? null;

/** Sessions for a mentor in the Monday-to-Sunday week containing `today`. */
export function mentorWeek(state, mentorId, today) {
  const dow = (new Date(`${today}T00:00:00Z`).getUTCDay() + 6) % 7; // 0 = Monday
  const start = addDays(today, -dow);
  const end = addDays(start, 6);
  return state.sessions.filter((s) => s.mentorId === mentorId && s.date >= start && s.date <= end)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}
export const upcomingSessions = (state, orgId, today) => state.sessions
  .filter((s) => s.orgId === orgId && s.status === 'upcoming' && s.date >= today)
  .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
export const mentorById = (id) => MENTOR_BY_ID[id] ?? null;

// ---- Partners (consent-aware, §8.15) ----
export function partnerClients(state, partnerId, today) {
  return REFERRALS.filter((r) => r.partnerId === partnerId).map((r) => {
    const org = orgById(state, r.orgId);
    const live = state.orgs[r.orgId];
    const detail = live
      ? { checkId: live.checkId, tier: isAccredited(live) ? 'accredited' : live.tier, readiness: verifiedReadiness(state, live).pct, pace: paceStatus(state, live, today).status }
      : r.snapshot;
    return { ...r, name: org?.name ?? r.orgId, ...(r.consent ? detail : {}), consentShown: r.consent };
  });
}

// ---- Connect & certificate verification (§8.13) ----
export function certificateStatus(certNo, today) {
  const listing = CONNECT_LISTINGS.find((l) => l.certNo.toUpperCase() === String(certNo).trim().toUpperCase());
  if (!listing) return { status: 'not-found', listing: null };
  return { status: listing.renewsOn < today ? 'expired' : 'valid', listing };
}

// ---- Enterprise pricing (§2 Stages) ----
export const microUnitPrice = (n, unit = { priceFirst: 1500, priceAdditional: 1000 }) => (n <= 0 ? 0 : unit.priceFirst + (n - 1) * unit.priceAdditional);

export { REQUIREMENTS, REQ_BY_ID };
