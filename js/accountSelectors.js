// Phase 10 selectors (BUILD_PLAN §8.12, §8.18, §8.19, §9). Pure functions of state.
import { REQ_BY_ID } from '../data/requirements.js';
import {
  coreReqs, pathwayReqs, progressOf, daysLeft, isAccredited, biggestGapArea, coreLocked,
} from './selectors.js';
import { addDays, daysBetween } from './util.js';

const OPEN = ['not-started', 'learning', 'evidence-needed', 'changes'];

/** Reminders worked out from the date and balances, shown above stored notifications (§8.18). */
export function derivedReminders(state, org, today) {
  const out = [];
  if (!isAccredited(org)) {
    const left = daysLeft(org, today);
    const at = [14, 30, 60].find((d) => left <= d);
    if (at && left >= 0) {
      out.push({ id: `deadline-${at}`, type: 'deadline', on: today, title: `${left} days to go`, text: 'Quick wins first: in-place items only need evidence. You can also re-plan or extend from Plan & pace — nothing is lost.', href: '/app/plan' });
    }
  }
  if (org.credits.ali <= 1) {
    out.push({ id: 'credit-low', type: 'credit', on: today, title: `Ask Ali credits are running low: ${org.credits.ali} left`, text: 'Top up any time from Ask Ali or Billing & credits.', href: '/app/ali' });
  }
  return out;
}

/** Open work in a sensible order: Almost there, quick wins, learning under way, then the biggest gaps. */
function openInOrder(state, org) {
  const reqs = coreLocked(state, org) ? pathwayReqs(org) : [...pathwayReqs(org), ...coreReqs(org)];
  const p = (r) => progressOf(state, org.id, r.id);
  const gap = biggestGapArea(state, org)?.id;
  const rank = (r) => {
    const x = p(r);
    if (x.status === 'changes') return 0;
    if (x.type === 'in-place' && x.status === 'evidence-needed') return 1;
    if (x.status === 'learning' || x.status === 'evidence-needed') return 2;
    return r.domainId === gap ? 3 : 4;
  };
  return reqs.filter((r) => OPEN.includes(p(r).status)).sort((a, b) => rank(a) - rank(b));
}

/** The pace plan (§8.19): open requirements spread evenly across the remaining weeks. */
export function weeklyPlan(state, org, today, { show = 6 } = {}) {
  const open = openInOrder(state, org);
  const weeks = Math.max(1, Math.ceil(daysBetween(today, org.endsOn) / 7));
  const perWeek = Math.max(1, Math.ceil(open.length / weeks));
  const plan = [];
  for (let w = 0; w < weeks && plan.length < show && w * perWeek < open.length; w += 1) {
    plan.push({ weekOf: addDays(today, w * 7), items: open.slice(w * perWeek, (w + 1) * perWeek).map((r) => REQ_BY_ID[r.id]) });
  }
  const shown = plan.reduce((n, w) => n + w.items.length, 0);
  return { weeks, perWeek, open: open.length, plan, moreItems: open.length - shown, moreWeeks: Math.max(0, Math.ceil((open.length - shown) / perWeek)) };
}

/** Accreditation progress (§8.12). */
export function accreditationState(state, org) {
  const reqs = [...pathwayReqs(org), ...coreReqs(org)];
  const byStatus = {};
  reqs.forEach((r) => { const st = progressOf(state, org.id, r.id).status; byStatus[st] = (byStatus[st] ?? 0) + 1; });
  const verified = byStatus.verified ?? 0;
  return {
    total: reqs.length, verified, byStatus,
    allVerified: verified === reqs.length,
    requested: Boolean(org.accreditationRequestedOn),
    accredited: isAccredited(org),
  };
}

/** The last `n` weeks for the momentum strip: the most recent `activeWeeks` are active (§9). */
export function momentumWeeks(org, today, n = 12) {
  const active = Math.min(n, org.momentum?.activeWeeks ?? 0);
  return Array.from({ length: n }, (_, i) => ({ weekOf: addDays(today, -7 * (n - 1 - i)), active: i >= n - active }));
}
