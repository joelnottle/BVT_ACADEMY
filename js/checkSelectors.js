// Free Check selectors (BUILD_PLAN §8.2): question list, sections, recommendation and results.
// Pure functions of the check draft held in state.check.
import { CHECKS } from '../data/checks.js';
import { DOMAINS } from '../data/domains.js';
import { reqsForCheck } from '../data/requirements.js';
import { SAMPLE_QUESTIONS } from '../data/checkFlow.js';
import { checkScore, tierForScore } from './selectors.js';

/** Questions for a check, grouped into sections. Core checks use the full bank; ORIC/Debt use 12 samples. */
export function checkQuestions(checkId) {
  if (checkId === 'core-ms' || checkId === 'core-ml') {
    const domainName = Object.fromEntries(DOMAINS.map((d) => [d.id, d.name]));
    return reqsForCheck(checkId).map((r) => ({ id: r.id, sectionId: r.domainId, sectionName: domainName[r.domainId], question: r.question, why: r.why, title: r.title }));
  }
  return (SAMPLE_QUESTIONS[checkId] ?? []).map((q) => ({ ...q, sectionId: 'sample', sectionName: 'Sample questions', title: '' }));
}

export function checkSections(checkId, answers = {}) {
  const sections = [];
  checkQuestions(checkId).forEach((q, index) => {
    let s = sections.find((x) => x.id === q.sectionId);
    if (!s) { s = { id: q.sectionId, name: q.sectionName, total: 0, answered: 0, firstIndex: index }; sections.push(s); }
    s.total += 1;
    if (answers[q.id]) s.answered += 1;
  });
  return sections;
}

/** Recommend a check from staff count, ORIC registration and debt. Core is always the lead option. */
export function recommendChecks({ staff = 0, oric = 'no', debt = 'no' } = {}) {
  const core = Number(staff) >= 20 ? 'core-ml' : 'core-ms';
  const also = [oric === 'yes' && 'oric', debt === 'yes' && 'debt'].filter(Boolean);
  return { recommended: core, also };
}

/** Results for a completed (or partly completed) check draft. */
export function checkResults(check) {
  const questions = checkQuestions(check.checkId);
  const answers = check.answers ?? {};
  const score = checkScore(Object.fromEntries(questions.map((q) => [q.id, answers[q.id] ?? 'not-yet'])));
  const count = (a) => questions.filter((q) => answers[q.id] === a).length;
  const na = count('na');
  const inPlace = count('in-place');
  const byArea = checkSections(check.checkId, answers).map((s) => {
    const qs = questions.filter((q) => q.sectionId === s.id);
    const inArea = qs.filter((q) => answers[q.id] === 'in-place').length;
    return { id: s.id, name: s.name, total: qs.length, inPlace: inArea, toBuild: qs.length - inArea - qs.filter((q) => answers[q.id] === 'na').length };
  });
  // Biggest gap: most to build; ties go to the larger area
  const biggestGap = [...byArea].sort((a, b) => b.toBuild - a.toBuild || b.total - a.total)[0];
  return {
    check: CHECKS[check.checkId],
    score,
    tier: tierForScore(score),
    total: questions.length,
    answered: questions.filter((q) => answers[q.id]).length,
    inPlace,
    toBuild: questions.length - inPlace - na,
    na,
    byArea,
    biggestGap,
  };
}
