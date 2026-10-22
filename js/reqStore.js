// Requirement actions (BUILD_PLAN §8.7) and verifier outcomes (§8.16, driven by the demo panel until Phase 14).
// Everything goes through store.commit(), so it persists and re-renders like any other change.
// Status path: not-started → learning → evidence-needed → in-review → verified | changes → in-review …
import { REQ_BY_ID } from '../data/requirements.js';
import { DOMAINS } from '../data/domains.js';
import { PATHWAYS } from '../data/pathways.js';
import { BADGE_BY_ID, BADGES } from '../data/badges.js';
import { FEEDBACK } from '../data/copy.js';
import { COMMENT_TEMPLATES } from '../data/reviews.js';
import { commit, getState, currentOrg, today } from './store.js';
import { coreReqs, verifiedReadiness, domainStat, pathwayProgress } from './selectors.js';

const SUBMITTED = ['in-review', 'changes', 'verified'];
let seq = 0;
const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${(seq += 1)}`;

const prog = (s, orgId, reqId) => s.progress[orgId][reqId];
const touch = (p, on, text) => { p.lastActivity = { on, text }; };
const startLearning = (p) => { if (p.status === 'not-started') p.status = 'learning'; };
const blankDraft = () => ({ files: [], linkedIds: [], declared: false, reply: '' });
export const draftOf = (p) => p?.draft ?? blankDraft();

/** Run a mutation on the current organisation's progress for one requirement. */
function onReq(reqId, fn, opts) {
  const org = currentOrg();
  if (!org || !getState().progress[org.id]?.[reqId]) return null;
  commit((s) => fn(prog(s, org.id, reqId), s, org.id, today(s)), opts);
  return org;
}

// ---- Learning steps (all optional) ----
export const markWatched = (reqId) => onReq(reqId, (p, s, o, on) => { p.steps.watch = true; startLearning(p); touch(p, on, 'Watched the introduction'); });
export const markLearned = (reqId) => onReq(reqId, (p, s, o, on) => { p.steps.learn = true; startLearning(p); touch(p, on, 'Learning done'); });
export function downloadTemplate(reqId, templateId) {
  return onReq(reqId, (p, s, orgId, on) => {
    p.steps.download = true; startLearning(p); touch(p, on, 'Downloaded a template');
    const l = s.learning[orgId];
    if (!l.downloads.includes(templateId)) l.downloads.push(templateId);
  });
}
export const toggleChecklist = (reqId, i, done) => onReq(reqId, (p, s, o, on) => { p.steps.doIt[i] = done; startLearning(p); touch(p, on, 'Do it checklist updated'); });

/** Notes save silently while typing (the field already shows them). */
export const saveNotes = (reqId, notes) => onReq(reqId, (p) => { p.notes = notes; }, { silent: true });
export const saveVerifierNote = (reqId, note) => onReq(reqId, (p) => { p.verifierNote = note; }, { silent: true });
export const saveReply = (reqId, reply) => onReq(reqId, (p) => { p.draft = { ...draftOf(p), reply }; }, { silent: true });

/** "Mark done → Upload" from Do it, or the fast-track: either way the next thing is evidence. */
export function readyForEvidence(reqId, { fastTrack = false } = {}) {
  return onReq(reqId, (p, s, o, on) => {
    if (fastTrack) p.fastTracked = true;
    if (['not-started', 'learning'].includes(p.status)) p.status = 'evidence-needed';
    touch(p, on, fastTrack ? 'Fast-tracked to evidence' : 'Ready to upload evidence');
  });
}

// ---- Evidence draft: pretend files (name and size only) and links to the locker ----
export function addFiles(reqId, files) {
  return onReq(reqId, (p) => {
    const d = draftOf(p);
    p.draft = { ...d, files: [...d.files, ...files.map((f) => ({ id: newId('f'), name: f.name, sizeKb: Math.max(1, Math.round(f.size / 1024)) }))] };
  });
}
export const removeFile = (reqId, fileId) => onReq(reqId, (p) => { const d = draftOf(p); p.draft = { ...d, files: d.files.filter((f) => f.id !== fileId) }; });
export const linkEvidence = (reqId, ids) => onReq(reqId, (p) => { const d = draftOf(p); p.draft = { ...d, linkedIds: [...new Set([...d.linkedIds, ...ids])] }; });
export const unlinkEvidence = (reqId, id) => onReq(reqId, (p) => { const d = draftOf(p); p.draft = { ...d, linkedIds: d.linkedIds.filter((x) => x !== id) }; });
export const setDeclared = (reqId, declared) => onReq(reqId, (p) => { p.draft = { ...draftOf(p), declared }; }, { silent: true });

// ---- Milestones (§9): awarded by the action that earns them, shown statically ----
function award(s, orgId, ids, on) {
  const earned = s.earned[orgId] ??= {};
  const fresh = ids.filter((id) => BADGE_BY_ID[id] && !earned[id]);
  fresh.forEach((id) => {
    earned[id] = on;
    s.notifications.unshift({ id: newId('n'), orgId, type: 'milestone', on, title: `Milestone: ${BADGE_BY_ID[id].name}`, text: BADGE_BY_ID[id].trigger, href: '/app/recognition', read: false });
  });
  return fresh;
}

/** Submit (or resubmit) for verification: files become locker evidence, a review joins the queue. */
export function submitForVerification(reqId) {
  const org = currentOrg();
  const req = REQ_BY_ID[reqId];
  let result = null;
  commit((s) => {
    const on = today(s);
    const p = prog(s, org.id, reqId);
    const d = draftOf(p);
    const newEvidence = d.files.map((f) => ({ id: newId('ev'), orgId: org.id, fileName: f.name, sizeKb: f.sizeKb, uploadedOn: on, requirementIds: [reqId], status: 'in-review' }));
    s.evidence.push(...newEvidence);
    d.linkedIds.forEach((id) => { const e = s.evidence.find((x) => x.id === id); if (e && !e.requirementIds.includes(reqId)) e.requirementIds.push(reqId); });
    const ids = [...newEvidence.map((e) => e.id), ...d.linkedIds];
    p.evidenceIds = [...new Set([...p.evidenceIds, ...ids])];
    const resubmit = p.status === 'changes';
    const text = d.reply ? `Resubmitted with a reply: "${d.reply}"` : resubmit ? 'Resubmitted revised evidence' : 'Submitted for verification';
    let review = s.reviews.find((r) => r.orgId === org.id && r.reqId === reqId && r.status !== 'verified');
    if (review) {
      Object.assign(review, { status: 'in-review', type: resubmit ? 'resubmission' : review.type, submittedOn: on, decidedOn: null, evidenceIds: [...new Set([...review.evidenceIds, ...ids])] });
    } else {
      review = {
        id: newId('rev'), orgId: org.id, reqId, submittedOn: on, type: p.type === 'in-place' ? 'in-place' : 'implemented',
        fastTracked: p.fastTracked, evidenceIds: ids, orgNote: p.verifierNote ?? '', status: 'in-review', verifierId: null, decidedOn: null, comment: '',
        // Assistive only: the human verifier decides (§8.16)
        aiPrecheck: req.criteria.map((c, i) => ({ label: c, pass: i < req.criteria.length - 1 })), history: [],
      };
      s.reviews.push(review);
    }
    review.history.push({ on, by: 'org', text });
    p.status = 'in-review';
    p.draft = blankDraft();
    touch(p, on, text);
    const milestones = ['first-evidence'];
    const inPlace = coreReqs(org).filter((r) => s.progress[org.id][r.id].type === 'in-place');
    if (inPlace.length && inPlace.every((r) => SUBMITTED.includes(s.progress[org.id][r.id].status))) milestones.push('all-in-place');
    result = { resubmit, milestones: award(s, org.id, milestones, on) };
  });
  return result;
}

// ---- Verifier outcomes (demo panel Simulate; Phase 14's verifier screens call the same functions) ----
const KESTREL = 'org-kestrel';
/** The review to decide: this requirement if it is in review, else the organisation's oldest in review. */
function pickReview(s, orgId, reqId) {
  const queue = s.reviews.filter((r) => r.orgId === orgId && r.status === 'in-review');
  return queue.find((r) => r.reqId === reqId) ?? queue.sort((a, b) => a.submittedOn.localeCompare(b.submittedOn))[0] ?? null;
}

function progressLine(s, org, req) {
  if (req.pathway) {
    const pp = pathwayProgress(s, org);
    return FEEDBACK.verified(req.id, PATHWAYS[req.pathway].title, pp.done, pp.total);
  }
  const d = domainStat(s, org, req.domainId);
  return FEEDBACK.verified(req.id, DOMAINS.find((x) => x.id === req.domainId).name, d.verified, d.total);
}

/**
 * kind: 'verified' | 'changes'. Acts on the current persona's organisation (Kestrel when the persona has none).
 * @returns {{ reqId, orgId, title, text } | null}
 */
export function decideNext(kind, { reqId, verifierId = 'E', comment } = {}) {
  const s0 = getState();
  const orgId = currentOrg()?.id ?? KESTREL;
  const review = pickReview(s0, orgId, reqId);
  if (!review) return null;
  let out = null;
  commit((s) => {
    const on = today(s);
    const org = s.orgs[orgId];
    const r = s.reviews.find((x) => x.id === review.id);
    const req = REQ_BY_ID[r.reqId];
    const p = prog(s, orgId, r.reqId);
    r.status = kind; r.verifierId = verifierId; r.decidedOn = on;
    r.evidenceIds.forEach((id) => { const e = s.evidence.find((x) => x.id === id); if (e) e.status = kind === 'verified' ? 'verified' : 'changes'; });
    if (kind === 'verified') {
      const before = verifiedReadiness(s, org).pct;
      p.status = 'verified';
      r.comment = comment ?? COMMENT_TEMPLATES.verified[0];
      r.history.push({ on, by: 'verifier', text: 'Verified' });
      touch(p, on, 'Verified');
      const after = verifiedReadiness(s, org).pct;
      const ms = ['first-verified'];
      if (req.domainId) {
        const d = domainStat(s, org, req.domainId);
        if (d.verified === d.total) ms.push(`area-${req.domainId}`);
      }
      BADGES.filter((b) => b.threshold && before < b.threshold && after >= b.threshold).forEach((b) => ms.push(b.id));
      if (req.pathway && pathwayProgress(s, org).complete) ms.push('pathway-complete');
      const line = progressLine(s, org, req);
      s.notifications.unshift({ id: newId('n'), orgId, type: 'outcome', on, title: line, text: 'See what to do next.', href: `/app/req/${req.id}/closed`, read: false });
      p.milestones = award(s, orgId, ms, on);
      out = { reqId: req.id, orgId, title: line, text: p.milestones.length ? `Milestone: ${p.milestones.map((id) => BADGE_BY_ID[id].name).join(', ')}` : 'See what to do next on the Closed step.' };
    } else {
      p.status = 'changes';
      r.comment = comment ?? COMMENT_TEMPLATES.changes[2];
      r.history.push({ on, by: 'verifier', text: `Changes requested: "${r.comment}"` });
      touch(p, on, 'Changes requested by the verifier');
      const title = FEEDBACK.changesNotice(req.id);
      s.notifications.unshift({ id: newId('n'), orgId, type: 'outcome', on, title, text: r.comment, href: `/app/req/${req.id}/verify`, read: false });
      out = { reqId: req.id, orgId, title, text: r.comment };
    }
  });
  return out;
}

/** Simulate: the next upcoming mentor session is marked complete (Phase 9 builds the mentoring pages). */
export function completeNextSession() {
  const orgId = currentOrg()?.id ?? KESTREL;
  const session = getState().sessions.filter((x) => x.orgId === orgId && x.status === 'upcoming').sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
  if (!session) return null;
  commit((s) => {
    const x = s.sessions.find((y) => y.id === session.id);
    x.status = 'completed';
    x.mentorNotes ||= 'Session complete. Your mentor’s notes and agreed next steps appear here.';
    s.notifications.unshift({ id: newId('n'), orgId, type: 'mentor', on: today(s), title: `Mentor session complete · ${x.topic}`, text: 'Your mentor’s notes are on the Mentoring page.', href: '/app/mentoring', read: false });
  });
  return session;
}

