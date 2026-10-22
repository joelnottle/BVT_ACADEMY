// Organisations per persona (BUILD_PLAN §6.2, §10 shape). All fictional.
// Phase 1 stub. `_stub` holds figures that Phase 2 replaces with derived selectors.

export const ORGS = {
  'org-kestrel': {
    id: 'org-kestrel', name: 'Kestrel Community Services Ltd', staff: 14, state: 'SA',
    checkId: 'core-ms', checkScore: 41, tier: 'core',
    enrolledOn: '2027-03-08', endsOn: '2027-12-08',
    pathway: null, accreditedOn: null, certNo: null,
    credits: { ali: 7.5, mentor: 2 }, weeklyGoalHrs: 2, reminderDay: 'Mon',
    consentToPartners: ['partner-scl'],
    _stub: {
      total: 45, verified: 10, claimed: 9, pace: 'on-pace',
      domains: { GC: [3, 6], BD: [1, 5], FM: [4, 9], OH: [1, 8], RC: [0, 7], RP: [1, 10] },
    },
  },
  'org-brightfield': {
    id: 'org-brightfield', name: 'Brightfield Start-up Co', staff: 3, state: 'VIC',
    checkId: 'core-ms', checkScore: 18, tier: 'foundation',
    enrolledOn: '2027-04-05', endsOn: '2028-04-05',
    pathway: 'startup', accreditedOn: null, certNo: null,
    credits: { ali: 10, mentor: 3 }, /* PLACEHOLDER — credit allowances per tier come from Doc 3 */
    weeklyGoalHrs: 2, reminderDay: 'Tue', consentToPartners: [],
    _stub: {
      total: 45, verified: 0, claimed: 8, pace: 'on-pace', pathwayDone: 4, pathwayTotal: 7,
      domains: { GC: [0, 6], BD: [0, 5], FM: [0, 9], OH: [0, 8], RC: [0, 7], RP: [0, 10] },
    },
  },
  'org-harbourline': {
    id: 'org-harbourline', name: 'Harbourline Civil Pty Ltd', staff: 48, state: 'NSW',
    checkId: 'core-ml', checkScore: 58, tier: 'advanced',
    enrolledOn: '2027-01-11', endsOn: '2027-07-11',
    pathway: null, accreditedOn: '2027-06-28', certNo: 'BVT-2027-000123',
    credits: { ali: 4, mentor: 1 }, weeklyGoalHrs: 3, reminderDay: 'Mon',
    consentToPartners: ['partner-scl'],
    _stub: {
      total: 60, verified: 60, claimed: 0, pace: 'ahead',
      domains: { GC: [8, 8], BD: [7, 7], FM: [12, 12], OH: [11, 11], RC: [9, 9], RP: [13, 13] },
    },
  },
};
