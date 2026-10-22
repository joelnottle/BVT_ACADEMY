// Partner portal actions (§8.15): a pretend referral creates a link and an email preview. Nothing is sent.
import { commit, currentPersona, today } from './store.js';

/** Returns the referral, with its pretend link code. */
export function referClient({ contact, email, orgName, note }) {
  const partnerId = currentPersona().partnerId;
  const code = `SCL-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const ref = { id: `ref-${code}`, partnerId, orgId: null, orgName, contact, email, note, code, referredOn: today(), stage: 'referred', consent: false, snapshot: { lastActivity: today() } };
  commit((s) => { (s.referrals ??= []).push(ref); });
  return ref;
}
