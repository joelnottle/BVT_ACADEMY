// Ask Ali and mentoring actions (BUILD_PLAN §8.10–8.11). Ali answers are scripted and keyword-matched:
// no AI is called and nothing leaves the browser. Each answer uses 0.25 credits.
import { ALI_SCRIPTS, ALI_FALLBACK, ALI_CREDIT_PER_ANSWER } from '../data/ali.js';
import { REQ_BY_ID } from '../data/requirements.js';
import { MENTOR_BY_ID } from '../data/mentors.js';
import { commit, getState, currentOrg, today } from './store.js';

let seq = 0;
const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${(seq += 1)}`;
const words = (s) => s.toLowerCase();

/** The best scripted answer: keyword hits, with a bonus for scripts about the requirement in context. */
export function matchScript(question, reqId = null) {
  const q = words(question);
  let best = null;
  let bestScore = 0;
  ALI_SCRIPTS.forEach((s) => {
    const hits = s.keywords.filter((k) => q.includes(k)).length;
    if (!hits) return;
    const score = hits + (reqId && s.reqIds?.includes(reqId) ? 2 : 0);
    if (score > bestScore) { best = s; bestScore = score; }
  });
  return best;
}

export const answerFor = (entry) => ALI_SCRIPTS.find((s) => s.id === entry.scriptId)?.answer ?? ALI_FALLBACK;

/** Ask a question. Returns the stored entry (with its answer), or null if there are no credits. */
export function askAli(question, reqId = null) {
  const org = currentOrg();
  if (!org || org.credits.ali < ALI_CREDIT_PER_ANSWER) return null;
  const script = matchScript(question, reqId);
  const entry = { id: newId('ali'), reqId, on: today(), q: question, scriptId: script?.id ?? null, pinned: false };
  commit((s) => {
    const o = s.orgs[org.id];
    o.credits.ali = Math.max(0, Math.round((o.credits.ali - ALI_CREDIT_PER_ANSWER) * 100) / 100);
    (s.ali[org.id] ??= []).push(entry);
    // A question about a requirement counts towards this week's momentum (§9)
    o.momentum.thisWeekMins = (o.momentum.thisWeekMins ?? 0) + 5;
  });
  return { ...entry, answer: script?.answer ?? ALI_FALLBACK };
}

/** Pin an answer to its requirement's notes (§8.10 "saved answers"). */
export function pinAnswer(entryId) {
  const org = currentOrg();
  const entry = getState().ali[org.id]?.find((e) => e.id === entryId);
  if (!entry || entry.pinned || !entry.reqId) return null;
  // The same answer pinned to the same requirement is only added to the notes once
  const already = getState().ali[org.id].some((x) => x.pinned && x.reqId === entry.reqId && x.q === entry.q);
  commit((s) => {
    const e = s.ali[org.id].find((x) => x.id === entryId);
    e.pinned = true;
    const p = s.progress[org.id][e.reqId];
    if (p && !already) p.notes = `${p.notes ? `${p.notes}\n\n` : ''}From Ask Ali — ${e.q}\n${answerFor(e)}`;
  });
  return entry;
}

/** Pretend top-up: credits are added, no payment is taken. */
export function topUpAli(n) {
  const org = currentOrg();
  if (!org) return;
  commit((s) => { s.orgs[org.id].credits.ali += n; });
}

// ---- Mentoring ----
/** Book a session: uses one mentor credit and adds it to upcoming. */
export function bookSession({ mentorId, date, time, topic, reqId, prepNotes }) {
  const org = currentOrg();
  if (!org || org.credits.mentor < 1) return null;
  const session = { id: newId('ses'), orgId: org.id, mentorId, date, time, mins: 45, status: 'upcoming', topic, reqId: reqId ?? null, prepNotes: prepNotes ?? '', mentorNotes: '' };
  commit((s) => {
    s.orgs[org.id].credits.mentor -= 1;
    s.sessions.push(session);
    s.notifications.unshift({ id: newId('n'), orgId: org.id, type: 'mentor', on: today(s), title: `Mentor session booked · ${topic}`, text: `With ${MENTOR_BY_ID[mentorId].name}. Add prep notes any time before.`, href: '/app/mentoring', read: false });
  });
  return session;
}

export function savePrepNotes(sessionId, notes) {
  commit((s) => { const x = s.sessions.find((y) => y.id === sessionId); if (x) x.prepNotes = notes; });
}

export const reqTitle = (reqId) => (reqId ? REQ_BY_ID[reqId]?.title ?? '' : '');
