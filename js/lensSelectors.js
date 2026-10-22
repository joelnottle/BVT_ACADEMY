// Academy lens selectors (BUILD_PLAN §8.5). One list of items feeds all three lenses, so every lens,
// the sidebar and the dashboard show the same truth. Pure: no DOM, no storage.
import { DOMAINS } from '../data/domains.js';
import { PATHWAYS } from '../data/pathways.js';
import { MODULES, MODULE_BY_ID } from '../data/modules.js';
import {
  REQ_BY_ID, coreReqs, pathwayReqs, progressOf, isLocked, recommendedNext, moduleProgress, biggestGapArea,
} from './selectors.js';
import { reqHref } from './lens.js';

const DOMAIN_NAME = Object.fromEntries(DOMAINS.map((d) => [d.id, d.name]));
export const PATHWAY_AREA = 'PW';

export const effortBucket = (hrs) => (hrs < 1 ? 'short' : hrs < 3 ? 'medium' : 'long');

/** The tag a card shows (§8.5): changes → Almost there, in place → Quick win, plus the dashboard's picks. */
function reasonFor(p, picks, id) {
  if (p.status === 'changes') return { reason: 'changes' };
  if (picks[id]) return picks[id];
  if (p.type === 'in-place' && p.status === 'evidence-needed') return { reason: 'quick-win' };
  if (p.status === 'learning') return { reason: 'continue' };
  return null;
}

/** Every requirement the organisation works on (pathway first), shaped for the lenses. */
export function lensItems(state, org, today) {
  const picks = Object.fromEntries(recommendedNext(state, org, today, { limit: 10 })
    .filter((x) => x.reqId).map((x) => [x.reqId, { reason: x.reason, n: x.n }]));
  return [...pathwayReqs(org), ...coreReqs(org)].map((r) => {
    const p = progressOf(state, org.id, r.id);
    const locked = isLocked(state, r, org);
    const areaId = r.domainId ?? PATHWAY_AREA;
    return {
      id: r.id, title: r.title, question: r.question, moduleId: r.moduleId, moduleTitle: MODULE_BY_ID[r.moduleId]?.title ?? '',
      areaId, areaName: r.domainId ? DOMAIN_NAME[r.domainId] : PATHWAYS[org.pathway].title,
      type: p.type, status: locked ? 'locked' : p.status, locked, effortHrs: r.effortHrs, effort: effortBucket(r.effortHrs),
      lastActivity: p.lastActivity, tag: locked ? null : reasonFor(p, picks, r.id), href: reqHref(r.id),
      placeholder: r.placeholder,
    };
  });
}

const matchesQ = (item, q) => {
  if (!q) return true;
  const hay = `${item.id} ${item.title} ${item.question ?? ''} ${item.moduleTitle ?? ''} ${item.areaName ?? ''}`.toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
};

/** Apply URL filters to lens items. */
export function filterItems(items, f) {
  return items.filter((x) => (!f.status.length || f.status.includes(x.status))
    && (!f.type || x.type === f.type)
    && (!f.area || x.areaId === f.area)
    && (!f.effort || x.effort === f.effort)
    && matchesQ(x, f.q));
}

/** Areas present for this organisation, pathway first: [{ id, name }]. */
export function lensAreas(org) {
  const areas = DOMAINS.filter((d) => coreReqs(org).some((r) => r.domainId === d.id)).map((d) => ({ id: d.id, name: d.name, icon: d.icon }));
  return org.pathway ? [{ id: PATHWAY_AREA, name: PATHWAYS[org.pathway].title, icon: 'route' }, ...areas] : areas;
}

/** By area: areas → modules → requirement items, with progress for each area. */
export function byArea(state, org, items, all) {
  return lensAreas(org).map((a) => {
    const own = all.filter((x) => x.areaId === a.id);
    const shown = items.filter((x) => x.areaId === a.id);
    const moduleIds = [...new Set(shown.map((x) => x.moduleId))];
    return {
      ...a,
      total: own.length,
      verified: own.filter((x) => x.status === 'verified').length,
      claimed: own.filter((x) => x.type === 'in-place' && ['evidence-needed', 'locked'].includes(x.status)).length,
      locked: own.some((x) => x.locked),
      modules: moduleIds.map((id) => ({ ...MODULE_BY_ID[id], progress: moduleProgress(state, org, id), items: shown.filter((x) => x.moduleId === id) })),
      shown: shown.length,
    };
  });
}

/** Module cards for By topic, with learning and evidence progress and formats. */
export function moduleCards(state, org) {
  const scope = new Set([...pathwayReqs(org), ...coreReqs(org)].map((r) => r.id));
  return MODULES.filter((m) => m.requirementIds.some((id) => scope.has(id))).map((m) => {
    const progress = moduleProgress(state, org, m.id);
    const reqIds = m.requirementIds.filter((id) => scope.has(id));
    return {
      ...m,
      areaId: m.domainId ?? PATHWAY_AREA,
      areaName: m.domainId ? DOMAIN_NAME[m.domainId] : (org.pathway ? PATHWAYS[org.pathway].title : ''),
      progress,
      reqIds,
      videoMins: m.videos.reduce((sum, v) => sum + v.mins, 0),
      locked: reqIds.every((id) => isLocked(state, REQ_BY_ID[id], org)),
    };
  });
}

/** Continue learning: started but not finished. Recommended for gaps: untouched modules in the weakest areas. */
export function topicRows(state, org, cards) {
  const started = cards.filter((c) => c.progress.learningPct > 0 && c.progress.learningPct < 100);
  const gap = biggestGapArea(state, org);
  const gapIds = gap ? [gap.id] : [];
  const gaps = cards.filter((c) => c.progress.learningPct === 0 && !c.locked && (gapIds.includes(c.domainId) || c.progress.verified === 0))
    .sort((a, b) => (gapIds.includes(b.domainId) ? 1 : 0) - (gapIds.includes(a.domainId) ? 1 : 0))
    .slice(0, 3);
  return { started, gaps };
}

/** Module matches the By topic filters (area, format, search). */
export function filterModules(cards, f) {
  return cards.filter((c) => (!f.area || c.areaId === f.area)
    && (!f.format || (f.format === 'video' ? c.videos.length : f.format === 'session' ? c.sessions.length : c.templates.length))
    && (!f.q || `${c.title} ${c.intro} ${c.areaName}`.toLowerCase().includes(f.q.toLowerCase())));
}
