// Phase 10 actions (BUILD_PLAN §8.9, §8.12, §8.13, §8.18, §8.19): evidence reuse, accreditation,
// Connect profile, notifications and plan. All pretend; all through store.commit().
import { COMMENT_TEMPLATES } from '../data/reviews.js';
import { CONNECT_LISTINGS } from '../data/connect.js';
import { commit, getState, currentOrg, today, jumpToAccredited } from './store.js';
import { coreReqs, pathwayReqs } from './selectors.js';
import { addMonths } from './util.js';

let seq = 0;
const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${(seq += 1)}`;

// ---- Notifications ----
export function markRead(id) {
  const n = getState().notifications.find((x) => x.id === id);
  if (!n || n.read) return;
  commit((s) => { s.notifications.find((x) => x.id === id).read = true; }, { silent: true });
}
export function markAllRead() {
  const org = currentOrg();
  commit((s) => { s.notifications.filter((n) => n.orgId === org.id).forEach((n) => { n.read = true; }); });
}

// ---- Evidence locker: reuse one document for another requirement ----
/** Adds the document to that requirement's upload, ready to submit there (§8.9 reuse). */
export function reuseEvidence(evidenceId, reqId) {
  const org = currentOrg();
  commit((s) => {
    const p = s.progress[org.id][reqId];
    const d = p.draft ?? { files: [], linkedIds: [], declared: false, reply: '' };
    p.draft = { ...d, linkedIds: [...new Set([...d.linkedIds, evidenceId])] };
    if (['not-started', 'learning'].includes(p.status)) p.status = 'evidence-needed';
  });
}

/** Pretend replace: only the new name and size are kept. */
export function replaceEvidence(evidenceId, file) {
  commit((s) => {
    const e = s.evidence.find((x) => x.id === evidenceId);
    Object.assign(e, { fileName: file.name, sizeKb: Math.max(1, Math.round(file.size / 1024)), uploadedOn: today(s) });
  });
}

// ---- Accreditation (§8.12): request → pending → accredited ----
export function requestAccreditation() {
  commit((s) => {
    const o = s.orgs[currentOrg().id];
    o.accreditationRequestedOn = today(s);
    s.notifications.unshift({ id: newId('n'), orgId: o.id, type: 'milestone', on: today(s), title: 'Accreditation review requested', text: 'The verification team will confirm your final checks.', href: '/app/accreditation', read: false });
  });
}

/** Demo shortcut: verify everything still open, so the request flow can be shown. */
export function verifyAllRemaining() {
  const org = currentOrg();
  commit((s) => {
    const on = today(s);
    [...pathwayReqs(org), ...coreReqs(org)].forEach((r) => {
      const p = s.progress[org.id][r.id];
      if (p.status === 'verified') return;
      p.status = 'verified';
      p.lastActivity = { on, text: 'Verified' };
      s.reviews.filter((x) => x.orgId === org.id && x.reqId === r.id && x.status !== 'verified').forEach((x) => {
        Object.assign(x, { status: 'verified', verifierId: 'E', decidedOn: on, comment: COMMENT_TEMPLATES.verified[0] });
      });
    });
  });
}

/** Demo shortcut: the review finishes and the certificate is issued. */
export function issueAccreditation() {
  const org = jumpToAccredited();
  if (!org) return null;
  commit((s) => {
    const o = s.orgs[org.id];
    s.notifications.unshift({ id: newId('n'), orgId: o.id, type: 'milestone', on: today(s), title: 'Milestone: Accredited', text: `Certificate ${o.certNo} issued. Your Connect profile is open.`, href: '/app/accreditation', read: false });
  });
  return org;
}

// ---- Connect profile (§8.13) ----
/** The saved profile, or sensible defaults from the organisation (and its listing, if it has one). */
export function connectProfileOf(org) {
  const listing = CONNECT_LISTINGS.find((l) => l.orgId === org.id);
  const sizeOf = (n) => (n < 5 ? 'Micro' : n < 20 ? 'Small' : n < 200 ? 'Medium' : 'Large');
  return {
    industry: listing?.industry ?? org.industry ?? '', city: listing?.city ?? org.city ?? '', state: listing?.state ?? org.state ?? '',
    size: listing?.size ?? sizeOf(org.staff ?? 1), capabilities: listing?.capabilities ?? [], description: listing?.description ?? '',
    showContact: true, visible: Boolean(listing), ...(org.connect ?? {}),
  };
}
export function saveConnectProfile(profile) {
  commit((s) => { s.orgs[currentOrg().id].connect = profile; });
}

// ---- Plan & extensions (§8.19) ----
export function savePlanSettings({ weeklyGoalHrs, reminderDay }) {
  commit((s) => Object.assign(s.orgs[currentOrg().id], { weeklyGoalHrs, reminderDay }));
}
/** Re-plan: the remaining work is spread over the remaining weeks again. Nothing done is lost. */
export function replan() {
  commit((s) => { s.orgs[currentOrg().id].replannedOn = today(s); });
}
/** Pretend extension: moves the end date; price is a Doc 3 placeholder. */
export function extendEnrolment(months) {
  let endsOn = null;
  commit((s) => {
    const o = s.orgs[currentOrg().id];
    o.endsOn = addMonths(o.endsOn, months);
    (o.extensions ??= []).push({ on: today(s), months });
    endsOn = o.endsOn;
    s.notifications.unshift({ id: newId('n'), orgId: o.id, type: 'deadline', on: today(s), title: `Extended by ${months} ${months === 1 ? 'month' : 'months'}`, text: 'Your plan has been spread over the extra time. Nothing you’ve done is lost.', href: '/app/plan', read: false });
  });
  return endsOn;
}

