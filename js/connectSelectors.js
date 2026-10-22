// BVT Connect directory and certificate lookups (§8.13), and partner client rows (§8.15). Pure functions.
// The directory is the fixed listings plus any persona organisation that is accredited and has chosen to list.
import { CONNECT_LISTINGS } from '../data/connect.js';
import { REFERRALS, STAGES } from '../data/partners.js';
import { CHECKS } from '../data/checks.js';
import { connectProfileOf } from './accountStore.js';
import { isAccredited, verifiedReadiness, paceStatus, orgById } from './selectors.js';
import { addMonths, daysBetween } from './util.js';

const withStatus = (l, today) => ({ ...l, status: l.renewsOn < today ? 'expired' : 'valid' });

/** A persona organisation as a listing, from its saved Connect profile. */
function liveListing(org) {
  const p = connectProfileOf(org);
  const base = CONNECT_LISTINGS.find((l) => l.orgId === org.id);
  return {
    id: base?.id ?? `cx-${org.id.replace('org-', '')}`, orgId: org.id, name: org.name,
    industry: p.industry || 'Not stated', city: p.city, state: p.state, size: p.size,
    certNo: org.certNo, accreditedOn: org.accreditedOn, renewsOn: addMonths(org.accreditedOn, 12),
    capabilities: p.capabilities, description: p.description, contact: p.showContact ? (org.lead?.name ?? null) : null,
    visible: p.visible,
  };
}

/** Every certificate BVT has issued in the demo, listed or not. */
export function certificates(state, today) {
  const live = Object.values(state.orgs).filter(isAccredited).map(liveListing);
  const fixed = CONNECT_LISTINGS.filter((l) => !live.some((x) => x.orgId && x.orgId === l.orgId));
  return [...fixed, ...live].map((l) => withStatus(l, today));
}

/** The public directory: certificates whose organisations are listed. */
export const directory = (state, today) => certificates(state, today).filter((l) => l.visible !== false).sort((a, b) => a.name.localeCompare(b.name));

export const listingById = (state, today, id) => certificates(state, today).find((l) => l.id === id) ?? null;

export function certificateLookup(state, today, certNo) {
  const n = String(certNo ?? '').trim().toUpperCase();
  const listing = certificates(state, today).find((l) => l.certNo.toUpperCase() === n);
  return listing ? { status: listing.status, listing } : { status: 'not-found', listing: null };
}

export function filterDirectory(list, f) {
  const q = (f.q ?? '').toLowerCase().split(/\s+/).filter(Boolean);
  return list.filter((l) => (!f.status || l.status === f.status) && (!f.industry || l.industry === f.industry)
    && (!f.state || l.state === f.state) && (!f.size || l.size === f.size)
    && q.every((w) => `${l.name} ${l.industry} ${l.city} ${l.state} ${(l.capabilities ?? []).join(' ')}`.toLowerCase().includes(w)));
}

// ---- Partner portal ----
const lastActivityOf = (state, org) => Object.values(state.progress[org.id] ?? {}).map((p) => p.lastActivity?.on).filter(Boolean).sort().at(-1) ?? org.accreditedOn ?? org.enrolledOn;

/** Client rows, consent-aware: without consent only the stage (and name) is shown. */
export function partnerRows(state, partnerId, today) {
  return (state.referrals ?? REFERRALS).filter((r) => r.partnerId === partnerId).map((r) => {
    const live = state.orgs[r.orgId];
    const stage = live ? (isAccredited(live) ? 'accredited' : 'in-progress') : r.stage;
    const detail = live
      ? { checkId: live.checkId, tier: isAccredited(live) ? 'accredited' : live.tier, readiness: verifiedReadiness(state, live).pct, pace: isAccredited(live) ? null : paceStatus(state, live, today).status, lastActivity: lastActivityOf(state, live) }
      : r.snapshot ?? {};
    const name = orgById(state, r.orgId)?.name ?? r.orgName ?? r.orgId;
    return { ...r, name, stage, stageLabel: STAGES.find((s) => s.id === stage)?.label ?? stage, checkName: detail.checkId ? CHECKS[detail.checkId].short : null, ...(r.consent ? detail : { lastActivity: detail.lastActivity }) };
  });
}

/** Who might need a nudge: behind on pace, quiet for 14+ days (consented only), or referred but not started. */
export function needsAttention(rows, today) {
  return rows.flatMap((r) => {
    if (r.stage === 'referred') return [{ row: r, why: 'referred' }];
    if (!r.consent) return [];
    if (r.pace === 'catch-up') return [{ row: r, why: 'catch-up' }];
    const quiet = r.lastActivity ? daysBetween(r.lastActivity, today) : 0;
    return quiet >= 14 && r.stage !== 'accredited' ? [{ row: r, why: 'quiet', days: quiet }] : [];
  });
}

export const stageCounts = (rows) => STAGES.map((s) => ({ ...s, n: rows.filter((r) => r.stage === s.id).length }));
