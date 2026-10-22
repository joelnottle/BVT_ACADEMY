// Seed progress per persona organisation (BUILD_PLAN §6.2, §10 reqProgress).
// Figures are built from short lists so they're easy to check against §6.2:
//   Kestrel (A): 45 requirements · 18 in place / 27 to build · 10 verified (22%) · 9 in place awaiting evidence
//                · GC-02 changes requested · FM-06 in review · FM-04 learning (step 4 Do it) · Check score 41%
//   Brightfield (B): Start-up pathway 4 of 7 verified · Core locked · Check score 18%
//   Harbourline (C): 60 requirements, all verified · accredited · Check score 58%
import { REQUIREMENTS, reqsForCheck } from './requirements.js';
import { EVIDENCE } from './evidence.js';

const SEED = {
  'org-kestrel': {
    inPlace: ['GC-01', 'GC-02', 'GC-03', 'GC-04', 'BD-01', 'BD-02', 'FM-01', 'FM-02', 'FM-06', 'OH-01', 'OH-02', 'OH-03', 'RC-02', 'RP-01', 'RP-02', 'RP-03', 'RP-04', 'RP-05'],
    partly: ['FM-05'],
    notSure: ['BD-05', 'OH-07', 'RC-03', 'RP-09'],
    status: {
      verified: ['GC-03', 'GC-04', 'GC-05', 'BD-01', 'FM-01', 'FM-02', 'FM-03', 'FM-07', 'OH-01', 'RP-01'],
      'in-review': ['FM-06'],
      changes: ['GC-02'],
      learning: ['FM-04', 'OH-04'],
      'evidence-needed': ['GC-01', 'BD-02', 'OH-02', 'OH-03', 'RC-02', 'RP-02', 'RP-03', 'RP-04', 'RP-05'],
    },
    steps: {
      'FM-04': { watch: true, learn: true, download: true, doIt: [true, true, false, false] },
      'OH-04': { watch: true },
    },
    activity: {
      'FM-04': ['2027-05-01', 'Do it checklist updated'],
      'GC-02': ['2027-04-29', 'Changes requested by the verifier'],
      'FM-06': ['2027-04-30', 'Submitted for verification'],
      'FM-02': ['2027-04-28', 'Verified'],
      'FM-03': ['2027-04-26', 'Verified'],
      'OH-04': ['2027-04-22', 'Watched the introduction'],
    },
    learning: { watched: ['v-cf-1', 'v-cf-2', 'mod-whs-v1'], sessions: ['s-cf-1'], downloads: ['t-cf-1'] },
    earned: { 'check-complete': '2027-03-01', enrolled: '2027-03-08', 'first-evidence': '2027-03-22', 'first-verified': '2027-03-29' },
  },
  'org-brightfield': {
    inPlace: ['GC-01', 'GC-03', 'BD-01', 'FM-01', 'FM-07', 'OH-01', 'RP-01'],
    partly: ['FM-02', 'RP-02'],
    notSure: ['RC-02', 'OH-07'],
    status: {
      verified: ['SU-01', 'SU-02', 'SU-03', 'SU-04'],
      learning: ['SU-05'],
    },
    steps: { 'SU-05': { watch: true, learn: true } },
    activity: { 'SU-05': ['2027-04-30', 'Watched the introduction'], 'SU-04': ['2027-04-29', 'Verified'] },
    learning: { watched: ['mod-su-money-v1'], sessions: [], downloads: [] },
    earned: { 'check-complete': '2027-03-30', enrolled: '2027-04-05', 'first-evidence': '2027-04-08', 'first-verified': '2027-04-12' },
  },
  'org-harbourline': {
    // 34 of 60 in place + 2 partly = 58%. Everything is now verified.
    inPlaceRule: (i) => i % 7 < 4,
    inPlaceCount: 34,
    partlyCount: 2,
    status: { verified: 'all' },
    learning: { watched: [], sessions: [], downloads: [] },
    earned: {
      'check-complete': '2027-01-05', enrolled: '2027-01-11', 'first-evidence': '2027-01-18', 'first-verified': '2027-01-25',
      'tier-25': '2027-02-08', 'all-in-place': '2027-02-22', 'tier-50': '2027-03-01', 'tier-75': '2027-03-29',
      'area-GC': '2027-03-15', 'area-BD': '2027-03-22', 'area-FM': '2027-04-05', 'area-OH': '2027-04-12', 'area-RC': '2027-04-19', 'area-RP': '2027-04-23',
      accredited: '2027-04-26',
    },
  },
};

const ORG_CHECK = { 'org-kestrel': 'core-ms', 'org-brightfield': 'core-ms', 'org-harbourline': 'core-ml' };
const ORG_PATHWAY = { 'org-brightfield': 'startup' };

function lists(orgId) {
  const s = SEED[orgId];
  if (!s.inPlaceRule) return s;
  const core = reqsForCheck(ORG_CHECK[orgId]);
  const inPlace = core.filter((_, i) => s.inPlaceRule(i)).slice(0, s.inPlaceCount).map((r) => r.id);
  const partly = core.filter((r) => !inPlace.includes(r.id)).slice(0, s.partlyCount).map((r) => r.id);
  return { ...s, inPlace, partly, notSure: [] };
}

function statusFor(s, id) {
  if (s.status.verified === 'all') return 'verified';
  return Object.keys(s.status).find((k) => s.status[k].includes(id)) ?? 'not-started';
}

/** reqProgress for one organisation, shaped as in BUILD_PLAN §10. */
function buildProgress(orgId) {
  const s = lists(orgId);
  const reqs = [...reqsForCheck(ORG_CHECK[orgId]), ...REQUIREMENTS.filter((r) => r.pathway && r.pathway === ORG_PATHWAY[orgId])];
  return Object.fromEntries(reqs.map((r) => {
    const type = s.inPlace.includes(r.id) ? 'in-place' : 'not-yet';
    // Already in place and not yet submitted = evidence needed (the same rule as a new enrolment)
    const listed = statusFor(s, r.id);
    const status = listed === 'not-started' && type === 'in-place' ? 'evidence-needed' : listed;
    const done = status === 'verified' && type === 'not-yet';
    const seeded = s.steps?.[r.id] ?? {};
    const steps = {
      watch: done || Boolean(seeded.watch),
      learn: done || Boolean(seeded.learn),
      download: done || Boolean(seeded.download),
      doIt: seeded.doIt ?? r.checklist.map(() => done),
    };
    const [on, text] = s.activity?.[r.id] ?? [null, null];
    return [r.id, {
      type, status, steps, fastTracked: false, notes: '',
      evidenceIds: EVIDENCE.filter((e) => e.orgId === orgId && e.requirementIds.includes(r.id)).map((e) => e.id),
      lastActivity: on ? { on, text } : null,
    }];
  }));
}

/** Check answers per requirement: in-place / partly / not-yet / not-sure / na. */
function buildAnswers(orgId) {
  const s = lists(orgId);
  return Object.fromEntries(reqsForCheck(ORG_CHECK[orgId]).map((r) => {
    let a = 'not-yet';
    if (s.inPlace.includes(r.id)) a = 'in-place';
    else if (s.partly.includes(r.id)) a = 'partly';
    else if (s.notSure.includes(r.id)) a = 'not-sure';
    return [r.id, a];
  }));
}

const ORG_IDS = Object.keys(SEED);
export const seedProgress = () => Object.fromEntries(ORG_IDS.map((id) => [id, buildProgress(id)]));
export const seedAnswers = () => Object.fromEntries(ORG_IDS.map((id) => [id, buildAnswers(id)]));
export const seedLearning = () => Object.fromEntries(ORG_IDS.map((id) => [id, structuredClone(SEED[id].learning)]));
/** Sample answers used by "Skip to results (demo)": persona A's for Micro–Small, C's for Medium–Large. */
export const sampleAnswers = (checkId) => (checkId === 'core-ms' ? buildAnswers('org-kestrel') : checkId === 'core-ml' ? buildAnswers('org-harbourline') : {});

/** reqProgress for a newly enrolled organisation: "in place" answers await evidence, the rest are not started. */
export function freshProgress(checkId, answers, pathway = null) {
  const reqs = [...reqsForCheck(checkId), ...REQUIREMENTS.filter((r) => r.pathway && r.pathway === pathway)];
  return Object.fromEntries(reqs.map((r) => {
    const type = answers[r.id] === 'in-place' ? 'in-place' : 'not-yet';
    return [r.id, {
      type, status: type === 'in-place' ? 'evidence-needed' : 'not-started',
      steps: { watch: false, learn: false, download: false, doIt: r.checklist.map(() => false) },
      fastTracked: false, notes: '', evidenceIds: [], lastActivity: null,
    }];
  }));
}

export const seedEarned = () => Object.fromEntries(ORG_IDS.map((id) => [id, { ...SEED[id].earned }]));
