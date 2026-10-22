// Assertions for the #/styleguide/data debug page: do the selectors return the §6.2 persona figures?
// Pure — runs in the browser and in Node.
import { PERSONAS } from '../../../data/users.js';
import { REQUIREMENTS, reqsForCheck } from '../../../data/requirements.js';
import { MODULES } from '../../../data/modules.js';
import { CONNECT_LISTINGS } from '../../../data/connect.js';
import { ALI_SCRIPTS } from '../../../data/ali.js';
import { MICRO_UNITS } from '../../../data/microunits.js';
import { sampleAnswers, freshProgress } from '../../../data/progress.js';
import { todayFor } from '../../store.js';
import * as S from '../../selectors.js';
import { enrolmentOffer } from '../../checkSelectors.js';
import * as DS from '../../dashboardSelectors.js';
import * as L from '../../lensSelectors.js';
import { parseLensFilters } from '../../lens.js';
import { matchScript } from '../../supportStore.js';
import * as AS from '../../accountSelectors.js';

const verifiedOf = (state, org) => S.domainProgress(state, org).map((d) => `${d.id} ${d.verified}/${d.total}`).join(' · ');
const inPlaceOf = (state, org) => S.domainProgress(state, org).map((d) => `${d.id} ${d.inPlace}`).join(' · ');

/** @returns {{group:string, label:string, expected:any, actual:any, pass:boolean}[]} */
export function runDataChecks(state) {
  const rows = [];
  const check = (group, label, expected, actual) => rows.push({ group, label, expected, actual, pass: JSON.stringify(expected) === JSON.stringify(actual) });

  // ---- Content volume ----
  check('Content', 'Core Micro–Small requirements', 45, reqsForCheck('core-ms').length);
  check('Content', 'Core Medium–Large requirements', 60, reqsForCheck('core-ml').length);
  check('Content', 'Start-up pathway requirements', 7, REQUIREMENTS.filter((r) => r.pathway === 'startup').length);
  check('Content', 'Core topic modules', 16, MODULES.filter((m) => m.domainId).length);
  check('Content', 'Every module serves 2–5 requirements', true, MODULES.every((m) => m.requirementIds.length >= 2 && m.requirementIds.length <= 5));
  check('Content', 'Hero requirements fully written', ['FM-04', 'GC-01', 'GC-02'], REQUIREMENTS.filter((r) => !r.placeholder).map((r) => r.id).sort());
  check('Content', 'Connect listings', 12, CONNECT_LISTINGS.length);
  check('Content', 'Ask Ali scripts (15+)', true, ALI_SCRIPTS.length >= 15);
  check('Content', 'Micro-Unit price for 3 participants', 3500, S.microUnitPrice(3, MICRO_UNITS[0]));

  // ---- Persona A: Kestrel ----
  const a = state.orgs['org-kestrel'];
  const ta = todayFor(PERSONAS.A, state);
  const ra = S.verifiedReadiness(state, a);
  check('A · Kestrel', 'Requirements', 45, ra.total);
  check('A · Kestrel', 'Already in place / to build', { inPlace: 18, notYet: 27 }, S.typeCounts(state, a));
  check('A · Kestrel', 'Verified (readiness %)', '10 (22%)', `${ra.verified} (${ra.pct}%)`);
  check('A · Kestrel', 'In place, awaiting evidence', 9, ra.claimed);
  check('A · Kestrel', 'Changes requested', 1, S.statusCounts(state, a).changes);
  check('A · Kestrel', 'Verified by area', 'GC 3/6 · BD 1/5 · FM 4/9 · OH 1/8 · RC 0/7 · RP 1/10', verifiedOf(state, a));
  check('A · Kestrel', 'In place by area (Check results)', 'GC 4 · BD 2 · FM 3 · OH 3 · RC 1 · RP 5', inPlaceOf(state, a));
  check('A · Kestrel', 'Check score → tier', '41% → core', `${S.checkScore(state.answers[a.id])}% → ${S.tierForScore(S.checkScore(state.answers[a.id]))}`);
  if (state.dayOffset === 0) {
    check('A · Kestrel', 'Days left · pace', '219 · on-pace', `${S.paceStatus(state, a, ta).daysLeft} · ${S.paceStatus(state, a, ta).status}`);
  }
  check('A · Kestrel', 'Mentor sessions booked', 1, S.upcomingSessions(state, a.id, ta).length);
  check('A · Kestrel', 'Recommended next (reasons)', ['changes', 'quick-win', 'unblocks', 'biggest-gap'], S.recommendedNext(state, a, ta, { limit: 4 }).map((x) => x.reason));
  check('A · Kestrel', 'Quick win · biggest gap', 'GC-01 · RC-01', (() => { const r = S.recommendedNext(state, a, ta, { limit: 5 }); return `${r.find((x) => x.reason === 'quick-win')?.reqId} · ${r.find((x) => x.reason === 'biggest-gap')?.reqId}`; })());
  check('A · Kestrel', 'FM-04 at step 4 (Do it 2 of 4)', '2/4', (() => { const d = S.progressOf(state, a.id, 'FM-04').steps.doIt; return `${d.filter(Boolean).length}/${d.length}`; })());

  // Dashboard (§8.4)
  const fa = DS.focusItem(state, a);
  check('A · Dashboard', 'Resume: FM-04 at Do it, 2 of 4', 'resume FM-04 doIt 2/4', `${fa.mode} ${fa.reqId} ${fa.step} ${fa.checklist?.done}/${fa.checklist?.total}`);
  check('A · Dashboard', 'Needs your attention', ['changes', 'evidence', 'review', 'neutral'], DS.attentionItems(state, a, ta).map((x) => x.tone));
  check('A · Dashboard', 'Recommended next (no changes row)', ['quick-win', 'unblocks', 'biggest-gap'], S.recommendedNext(state, a, ta, { exclude: ['changes'] }).map((x) => x.reason));
  check('A · Dashboard', 'Unread notifications (bell)', 3, DS.unreadCount(state, a.id));
  check('A · Dashboard', 'Most recent item', 'FM-02', DS.recentItems(state, a)[0]?.text.slice(0, 5));

  // Academy lenses (§8.5): the dashboard's link lands on exactly what it promised
  const la = L.lensItems(state, a, ta);
  check('A · Academy', 'Lens items', 45, la.length);
  check('A · Academy', '"9 in-place items need evidence" link → 9 items', 9, L.filterItems(la, parseLensFilters({ status: 'evidence-needed', type: 'in-place' })).length);
  check('A · Academy', 'Board columns (to start · learning · evidence · review · changes · verified)', '22 · 2 · 9 · 1 · 1 · 10',
    ['not-started', 'learning', 'evidence-needed', 'in-review', 'changes', 'verified'].map((st) => la.filter((x) => x.status === st).length).join(' · '));
  check('A · Academy', 'Search "cash flow" finds FM-04', true, L.filterItems(la, parseLensFilters({ q: 'cash flow' })).some((x) => x.id === 'FM-04'));
  check('A · Academy', 'Modules in the library', 16, L.moduleCards(state, a).length);

  // Ask Ali (§8.10): keyword-matched scripts, with the requirement in context preferred
  check('A · Ask Ali', 'Seeded conversations', 4, (state.ali?.[a.id] ?? []).length);
  check('A · Ask Ali', '"How far ahead…" on FM-04', 'forecast-horizon', matchScript('How far ahead should our forecast go?', 'FM-04')?.id);
  check('A · Ask Ali', '"What does good evidence look like" → evidence guidance', 'good-evidence', matchScript('What does good evidence look like for this?', 'GC-01')?.id);
  check('A · Ask Ali', 'No match falls back', null, matchScript('Tell me a joke about kangaroos') ?? null);

  // Plan, reminders, accreditation (§8.12, §8.18, §8.19)
  if (state.dayOffset === 0) {
    const wp = AS.weeklyPlan(state, a, ta);
    check('A · Plan', 'Open requirements · weeks · per week', '34 · 32 · 2', `${wp.open} · ${wp.weeks} · ${wp.perWeek}`);
    check('A · Plan', 'First week: Almost there, then a quick win', ['GC-02', 'GC-01'], wp.plan[0].items.map((r) => r.id));
    check('A · Plan', 'No reminders at 219 days and 7.5 credits', 0, AS.derivedReminders(state, a, ta).length);
  }
  check('A · Plan', '14-day reminder near the end', '14 days to go', AS.derivedReminders(state, a, '2027-11-24')[0]?.title);
  check('A · Accreditation', 'Verified of total', '10 of 45', (() => { const x = AS.accreditationState(state, a); return `${x.verified} of ${x.total}`; })());

  // ---- Persona B: Brightfield ----
  const b = state.orgs['org-brightfield'];
  const tb = todayFor(PERSONAS.B, state);
  check('B · Brightfield', 'Tier', 'foundation', b.tier);
  check('B · Brightfield', 'Start-up pathway', '4 of 7', (() => { const p = S.pathwayProgress(state, b); return `${p.done} of ${p.total}`; })());
  check('B · Brightfield', 'Core locked', true, S.coreLocked(state, b));
  check('B · Brightfield', 'Check score → tier', '18% → foundation', `${S.checkScore(state.answers[b.id])}% → ${S.tierForScore(S.checkScore(state.answers[b.id]))}`);
  check('B · Brightfield', 'Recommended next starts with the pathway', 'SU-05', S.recommendedNext(state, b, tb)[0]?.reqId);
  check('B · Brightfield', 'Locked Core items on the board', 45, S.statusCounts(state, b).locked);
  check('B · Brightfield', 'Lens: 7 pathway open, 45 locked', '7 · 45', (() => { const it = L.lensItems(state, b, tb); return `${it.filter((x) => !x.locked).length} · ${it.filter((x) => x.locked).length}`; })());

  // ---- Persona C: Harbourline ----
  const c = state.orgs['org-harbourline'];
  const tc = todayFor(PERSONAS.C, state);
  check('C · Harbourline', 'Accredited', true, S.isAccredited(c));
  check('C · Harbourline', 'Requirements verified', '60 of 60', `${S.verifiedReadiness(state, c).verified} of ${S.verifiedReadiness(state, c).total}`);
  check('C · Harbourline', 'Check score → tier', '58% → advanced', `${S.checkScore(state.answers[c.id])}% → ${S.tierForScore(S.checkScore(state.answers[c.id]))}`);
  check('C · Harbourline', 'Enterprise hub open (demo date ≥ 1 Jul 2027)', true, S.enterpriseOpen(c, tc));
  check('C · Harbourline', 'Certificate verifies', 'valid', S.certificateStatus(c.certNo, tc).status);

  // ---- Persona D: partner ----
  const clients = S.partnerClients(state, 'partner-scl', todayFor(PERSONAS.D, state));
  check('D · Partner', 'Referred clients', 6, clients.length);
  check('D · Partner', 'Clients sharing progress (consent)', 4, clients.filter((x) => x.consentShown).length);
  check('D · Partner', 'Non-consented rows hide readiness', true, clients.filter((x) => !x.consentShown).every((x) => x.readiness === undefined));

  // ---- Persona E: verifier ----
  const queue = S.reviewQueue(state, 'E', todayFor(PERSONAS.E, state));
  check('E · Verifier', 'Items in queue', 9, queue.length);
  check('E · Verifier', 'Mentor conflict blocks', ['org-coastline'], [...new Set(queue.filter((q) => q.conflict).map((q) => q.orgId))]);
  check('E · Verifier', 'No conflict on Kestrel', false, S.mentorConflict(state, 'E', 'org-kestrel'));

  // ---- Persona F: mentor ----
  const mentor = S.mentorFor('F');
  check('F · Mentor', 'Mentees', 5, mentor.mentees.length);
  check('F · Mentor', 'Sessions this week', 3, S.mentorWeek(state, mentor.id, todayFor(PERSONAS.F, state)).length);

  // ---- Enrolment (§8.3), from the free Check sample answers (Kestrel's) ----
  const draft = { checkId: 'core-ms', answers: sampleAnswers('core-ms'), debt: 'no' };
  const offerOf = (screening) => { const o = enrolmentOffer(draft, screening); return `${o.tier} · ${o.months} months · ${o.pathway ?? 'no pathway'}`; };
  check('Enrolment', 'Tier from score (41%)', 'core · 9 months · no pathway', offerOf({ startup: 'no', recovery: 'no' }));
  check('Enrolment', 'Start-up screening → Foundation + pathway', 'foundation · 12 months · startup', offerOf({ startup: 'yes', recovery: 'no' }));
  check('Enrolment', 'Start-up comes before Recovery', 'startup', enrolmentOffer(draft, { startup: 'yes', recovery: 'yes' }).pathway);
  const fresh = Object.values(freshProgress('core-ms', draft.answers, 'startup'));
  check('Enrolment', 'New org: evidence needed / not started', '18 / 34', `${fresh.filter((p) => p.status === 'evidence-needed').length} / ${fresh.filter((p) => p.status === 'not-started').length}`);
  check('Enrolment', 'Empty Recovery pathway does not lock Core', false, S.coreLocked(state, { checkId: 'core-ms', pathway: 'recovery' }));

  // ---- Verify page states ----
  const tv = todayFor(PERSONAS.visitor, state);
  check('Verify', 'Valid / expired / not found', ['valid', 'expired', 'not-found'],
    ['BVT-2027-000101', 'BVT-2026-000041', 'BVT-0000-000000'].map((n) => S.certificateStatus(n, tv).status));

  return rows;
}
