// Dashboard selectors (BUILD_PLAN §8.4). Pure functions of state: no DOM, no storage.
import { STEPS, REASONS } from '../data/copy.js';
import { PATHWAYS } from '../data/pathways.js';
import { BADGE_BY_ID } from '../data/badges.js';
import { DOMAINS } from '../data/domains.js';
import { MODULE_BY_ID } from '../data/modules.js';
import { DASHBOARD } from '../data/dashboard.js';
import {
  REQ_BY_ID, coreReqs, pathwayReqs, progressOf, coreLocked, pathwayProgress, claimedInPlace,
  biggestGapArea, upcomingSessions, mentorById,
} from './selectors.js';
import { lensHref, reqHref } from './lens.js';
import { formatDate, daysBetween, effortLabel } from './util.js';

const stepById = Object.fromEntries(STEPS.map((s) => [s.id, s]));
const SUBMITTED = ['in-review', 'changes', 'verified'];
const DOMAIN_NAME = Object.fromEntries(DOMAINS.map((d) => [d.id, d.name]));

/** Where a requirement is up to in the learning loop. Learning steps are optional, so this is the step after the last one done. */
export function currentStep(req, p) {
  if (p.status === 'verified') return 'closed';
  if (p.status === 'in-review' || p.status === 'changes') return 'verify';
  if (p.type === 'in-place' || p.fastTracked) return 'upload';
  const s = p.steps ?? {};
  const doIt = s.doIt ?? [];
  if (doIt.length && doIt.every(Boolean)) return 'upload';
  if (doIt.some(Boolean) || s.download) return 'doIt';
  if (s.learn) return 'download';
  if (s.watch) return 'learn';
  return 'watch';
}

const open = (state, org, r) => !SUBMITTED.includes(progressOf(state, org.id, r.id).status);

function stepInfo(state, org, req) {
  const p = progressOf(state, org.id, req.id);
  const step = stepById[currentStep(req, p)];
  const doIt = p.steps?.doIt ?? [];
  return {
    reqId: req.id, title: req.title, step: step.id, stepLabel: step.label,
    stepNumber: STEPS.indexOf(step) + 1, href: reqHref(req.id, step.slug),
    checklist: step.id === 'doIt' ? { done: doIt.filter(Boolean).length, total: doIt.length } : null,
    lastActivity: p.lastActivity,
  };
}

/**
 * The dashboard's focal card: the requirement most recently worked on (learning), or — before any work —
 * the first requirement for the starting choice made in onboarding.
 * @returns {{mode:'resume'|'start', why?:string, …stepInfo} | null}
 */
export function focusItem(state, org) {
  const all = [...pathwayReqs(org), ...coreReqs(org)];
  const learning = all.filter((r) => progressOf(state, org.id, r.id).status === 'learning')
    .sort((a, b) => (progressOf(state, org.id, b.id).lastActivity?.on ?? '').localeCompare(progressOf(state, org.id, a.id).lastActivity?.on ?? ''));
  if (learning[0]) return { mode: 'resume', ...stepInfo(state, org, learning[0]) };

  const why = DASHBOARD.start.why;
  if (coreLocked(state, org)) {
    const r = pathwayReqs(org).find((x) => open(state, org, x));
    return r ? { mode: 'start', why: why.pathway(PATHWAYS[org.pathway].title), ...stepInfo(state, org, r) } : null;
  }
  const reqs = coreReqs(org);
  const p = (r) => progressOf(state, org.id, r.id);
  let r = null;
  let text = '';
  if (org.startChoice === 'choose-area' && org.startDomainId) {
    r = reqs.find((x) => x.domainId === org.startDomainId && open(state, org, x));
    text = why['choose-area'](DOMAIN_NAME[org.startDomainId]);
  } else if (org.startChoice === 'biggest-gaps') {
    const gap = biggestGapArea(state, org);
    r = reqs.find((x) => x.domainId === gap.id && p(x).type === 'not-yet' && p(x).status === 'not-started');
    text = why['biggest-gaps'](gap.name);
  }
  if (!r) {
    r = reqs.find((x) => p(x).type === 'in-place' && p(x).status === 'evidence-needed');
    text = why['quick-wins'];
  }
  r ??= reqs.find((x) => open(state, org, x));
  return r ? { mode: 'start', why: text, ...stepInfo(state, org, r) } : null;
}

/** "Needs your attention": icon + label rows, each linking somewhere specific. */
export function attentionItems(state, org, today) {
  const A = DASHBOARD.attention;
  const items = [];
  const reqs = [...pathwayReqs(org), ...coreReqs(org)];
  reqs.filter((r) => progressOf(state, org.id, r.id).status === 'changes')
    .forEach((r) => items.push({ icon: REASONS.changes.icon, text: A.changes(r.id), href: reqHref(r.id, 'verify'), tone: 'changes' }));
  if (coreLocked(state, org)) {
    const pp = pathwayProgress(state, org);
    items.push({ icon: 'route', text: A.pathway(PATHWAYS[org.pathway].title, pp.done, pp.total), href: '#/app/pathway', tone: 'learning' });
  } else {
    const claimed = claimedInPlace(state, org);
    if (claimed) items.push({ icon: 'file-up', text: A.evidence(claimed), href: lensHref('action', { status: ['evidence-needed'], type: 'in-place' }), tone: 'evidence' });
  }
  const inReview = reqs.filter((r) => progressOf(state, org.id, r.id).status === 'in-review').length;
  if (inReview) items.push({ icon: 'hourglass', text: A.review(inReview), href: lensHref('action', { status: ['in-review'] }), tone: 'review' });
  const session = upcomingSessions(state, org.id, today).find((s) => daysBetween(today, s.date) <= 7);
  if (session) {
    const when = `${formatDate(session.date, { weekday: true }).split(' ')[0]} ${session.time}`;
    items.push({ icon: 'calendar-days', text: A.session(when, session.topic), href: '#/app/mentoring', tone: 'neutral', meta: mentorById(session.mentorId)?.name ?? '' });
  }
  return items;
}

/** "Recent": verified outcomes and milestones, newest first, without repeating what is in attention. */
export function recentItems(state, org, { limit = 3 } = {}) {
  const fromNotes = state.notifications
    .filter((n) => n.orgId === org.id && (n.type === 'milestone' || (n.type === 'outcome' && / verified/.test(n.title))))
    .map((n) => ({ on: n.on, icon: n.type === 'milestone' ? 'award' : 'circle-check', text: n.title, href: `#${n.href}` }));
  const fromBadges = Object.entries(state.earned[org.id] ?? {})
    .filter(([id]) => BADGE_BY_ID[id])
    .map(([id, on]) => ({ on, icon: 'award', text: `Milestone: ${BADGE_BY_ID[id].name}`, href: '#/app/recognition' }));
  const seen = new Set();
  return [...fromNotes, ...fromBadges]
    .sort((a, b) => b.on.localeCompare(a.on))
    .filter((x) => (seen.has(x.text) ? false : seen.add(x.text)))
    .slice(0, limit);
}

/** Recommended next, shaped for display: title, meta line and link. Changes requested lives in attention. */
export function recommendedRows(recs) {
  return recs.map((x) => {
    if (x.moduleId) {
      const m = MODULE_BY_ID[x.moduleId];
      return { ...x, code: 'Module', title: m.title, meta: `Shared learning for ${x.n} requirements`, href: `#/app/module/${m.id}` };
    }
    const r = REQ_BY_ID[x.reqId];
    const effort = effortLabel(r.effortHrs);
    const meta = x.reason === 'quick-win' ? `Upload only · ${effort}`
      : x.reason === 'biggest-gap' ? `Start with a ${r.video.mins}-min video · ${DOMAIN_NAME[r.domainId]}`
      : x.reason === 'changes' ? 'Reply to the verifier'
      : `${effort} · ${r.domainId ? DOMAIN_NAME[r.domainId] : PATHWAYS[r.pathway].title}`;
    const slug = x.reason === 'quick-win' ? 'upload' : x.reason === 'changes' ? 'verify' : null;
    return { ...x, code: r.id, title: r.title, meta, href: reqHref(r.id, slug) };
  });
}

export const unreadCount = (state, orgId) => state.notifications.filter((n) => n.orgId === orgId && !n.read).length;
