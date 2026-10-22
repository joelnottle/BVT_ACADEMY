// Enterprise hub actions (BUILD_PLAN §8.14): invites, Micro-Unit enrolment (pretend checkout), purchases,
// the team-member view and lesson progress. Pricing: $1,500 first participant, $1,000 each additional.
import { MICRO_UNITS, PURCHASES } from '../data/microunits.js';
import { TEAM_MEMBER } from '../data/users.js';
import { commit, currentOrg, currentPersona, today } from './store.js';
import { microUnitPrice } from './selectors.js';

let seq = 0;
const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${(seq += 1)}`;
const UNIT = Object.fromEntries(MICRO_UNITS.map((u) => [u.id, u]));
const note = (s, orgId, title, text, href) => s.notifications.unshift({ id: newId('n'), orgId, type: 'milestone', on: today(s), title, text, href, read: false });

export function inviteMember({ name, email, role }) {
  const org = currentOrg();
  const member = { id: newId('tm'), name, email, role, title: '', status: 'invited', aliCredits: 0, units: {} };
  commit((s) => { (s.orgs[org.id].team ??= []).push(member); });
  return member;
}
export function acceptInvite(memberId) {
  const org = currentOrg();
  commit((s) => { const m = s.orgs[org.id].team.find((x) => x.id === memberId); if (m) m.status = 'active'; });
}

/** Pretend checkout: participants get the unit and 8 Ask Ali credits each. Returns the enrolment. */
export function enrolMicroUnit(unitId, memberIds) {
  const org = currentOrg();
  const unit = UNIT[unitId];
  const total = microUnitPrice(memberIds.length, unit);
  const enrolment = { id: newId('mue'), unitId, memberIds, on: today(), total };
  commit((s) => {
    const o = s.orgs[org.id];
    (o.microUnitEnrolments ??= []).push(enrolment);
    memberIds.forEach((id) => {
      const m = o.team.find((x) => x.id === id);
      m.aliCredits = (m.aliCredits ?? 0) + unit.aliCredits;
      (m.units ??= {})[unitId] = m.units[unitId] ?? 0;
    });
    (o.purchases ??= []).push({ id: newId('pu'), on: today(s), title: `${unit.title} · ${memberIds.length} ${memberIds.length === 1 ? 'participant' : 'participants'}`, amount: total });
    note(s, o.id, `${memberIds.length} enrolled in ${unit.title}`, 'They’ll see it in My learning.', '/app/enterprise/team');
  });
  return enrolment;
}

/** Pretend purchase of a placeholder-priced item (re-assessment, top-ups, mentoring, extensions). */
export function buyItem(itemId) {
  const org = currentOrg();
  const item = PURCHASES.find((p) => p.id === itemId);
  commit((s) => {
    const o = s.orgs[org.id];
    (o.purchases ??= []).push({ id: newId('pu'), on: today(s), title: item.title, amount: null });
    if (itemId === 'reassessment') o.reassessmentPurchasedOn = today(s);
    if (itemId === 'ali-topup') o.credits.ali += 5;
    if (itemId === 'mentoring') o.credits.mentor += 1;
  });
  return item;
}

// ---- Team-member view (demo) ----
export function viewAsMember(memberId) {
  const org = currentOrg();
  commit((s) => { s.memberView = { orgId: org.id, memberId, leadPersonaId: s.personaId }; s.personaId = TEAM_MEMBER.id; });
}
export function backToLead() {
  commit((s) => { s.personaId = s.memberView?.leadPersonaId ?? 'C'; });
}

/** Lessons are linear: completing one opens the next. The last one completes the unit (milestone). */
export function completeLesson(unitId) {
  const p = currentPersona();
  let finished = false;
  commit((s) => {
    const o = s.orgs[p.orgId];
    const m = o.team.find((x) => x.id === p.memberId);
    const unit = UNIT[unitId];
    m.units[unitId] = Math.min(unit.lessons.length, (m.units[unitId] ?? 0) + 1);
    if (m.units[unitId] === unit.lessons.length) {
      finished = true;
      s.earned[o.id] ??= {};
      s.earned[o.id]['microunit-complete'] ??= today(s);
      note(s, o.id, `${m.name} completed ${unit.title}`, 'Milestone: Micro-Unit complete.', '/app/enterprise/team');
    }
  });
  return finished;
}

export const unitById = (id) => UNIT[id];
