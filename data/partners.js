// Institutions and agents (BUILD_PLAN §8.15). Fictional.
// Referred clients show progress only where the client has consented to share it (§14 Q7).
// stage: 'referred' | 'checked' | 'enrolled' | 'in-progress' | 'accredited'

export const PARTNERS = {
  'partner-scl': { id: 'partner-scl', name: 'Southern Community Lenders', type: 'Community lender', city: 'Adelaide', state: 'SA' },
};

// `snapshot` holds figures for organisations that aren't demo personas; persona orgs are computed live.
export const REFERRALS = [
  { id: 'ref-1', partnerId: 'partner-scl', orgId: 'org-kestrel', contact: 'Sam Rivera', email: 'sam.rivera@kestrel.example', referredOn: '2027-02-18', stage: 'in-progress', consent: true },
  { id: 'ref-2', partnerId: 'partner-scl', orgId: 'org-harbourline', contact: 'Tom Okafor', email: 'tom.okafor@harbourline.example', referredOn: '2026-12-14', stage: 'accredited', consent: true },
  { id: 'ref-3', partnerId: 'partner-scl', orgId: 'org-riverbend', contact: 'Jess Tran', email: 'jess@riverbend.example', referredOn: '2027-02-25', stage: 'in-progress', consent: true,
    snapshot: { checkId: 'core-ms', tier: 'core', readiness: 31, pace: 'on-pace', lastActivity: '2027-05-01' } },
  { id: 'ref-4', partnerId: 'partner-scl', orgId: 'org-mallee', contact: 'Hamish Ward', email: 'hamish@mallee.example', referredOn: '2027-03-10', stage: 'in-progress', consent: false,
    snapshot: { checkId: 'core-ml', tier: 'advanced', readiness: 54, pace: 'ahead', lastActivity: '2027-05-02' } },
  { id: 'ref-5', partnerId: 'partner-scl', orgId: 'org-northside', contact: 'Leah Morgan', email: 'leah@northside.example', referredOn: '2027-04-06', stage: 'checked', consent: true,
    snapshot: { checkId: 'core-ms', tier: 'core', readiness: 0, pace: null, lastActivity: '2027-04-19' } },
  { id: 'ref-6', partnerId: 'partner-scl', orgId: 'org-saltbush', contact: 'Ray Donnelly', email: 'ray@saltbush.example', referredOn: '2027-04-27', stage: 'referred', consent: false,
    snapshot: { checkId: null, tier: null, readiness: 0, pace: null, lastActivity: '2027-04-27' } },
];

export const STAGES = [
  { id: 'referred', label: 'Referred' },
  { id: 'checked', label: 'Checked' },
  { id: 'enrolled', label: 'Enrolled' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'accredited', label: 'Accredited' },
];
