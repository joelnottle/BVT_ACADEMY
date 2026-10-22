// Organisations (BUILD_PLAN §6.2, §10). All fictional.
// ORGS are the persona organisations (copied into the store and changed by the demo).
// OTHER_ORGS appear in the verifier queue, mentor list, partner referrals and Connect.

export const ORGS = {
  'org-kestrel': {
    id: 'org-kestrel', name: 'Kestrel Community Services Ltd', staff: 14, state: 'SA', city: 'Adelaide',
    industry: 'Community services', abn: '41 824 753 019',
    checkId: 'core-ms', checkScore: 41, tier: 'core',
    enrolledOn: '2027-03-08', endsOn: '2027-12-08',
    pathway: null, accreditedOn: null, certNo: null,
    credits: { ali: 7.5, mentor: 2 }, weeklyGoalHrs: 2, reminderDay: 'Mon',
    momentum: { activeWeeks: 6, thisWeekMins: 80, graceUsedOn: null },
    startChoice: 'quick-wins',
    consentToPartners: ['partner-scl'],
    mentorId: 'm-marcus',
  },
  'org-brightfield': {
    id: 'org-brightfield', name: 'Brightfield Start-up Co', staff: 3, state: 'VIC', city: 'Geelong',
    industry: 'Food manufacturing', abn: '63 109 552 870',
    checkId: 'core-ms', checkScore: 18, tier: 'foundation',
    enrolledOn: '2027-04-05', endsOn: '2028-04-05',
    pathway: 'startup', accreditedOn: null, certNo: null,
    credits: { ali: 10, mentor: 3 }, /* PLACEHOLDER — credit allowances per tier come from Doc 3 */
    weeklyGoalHrs: 2, reminderDay: 'Tue',
    momentum: { activeWeeks: 4, thisWeekMins: 30, graceUsedOn: null },
    startChoice: 'pathway',
    consentToPartners: [],
    mentorId: 'm-marcus',
  },
  'org-harbourline': {
    id: 'org-harbourline', name: 'Harbourline Civil Pty Ltd', staff: 48, state: 'NSW', city: 'Newcastle',
    industry: 'Civil construction', abn: '27 650 318 442',
    checkId: 'core-ml', checkScore: 58, tier: 'advanced',
    enrolledOn: '2027-01-11', endsOn: '2027-07-11',
    pathway: null, accreditedOn: '2027-04-26', certNo: 'BVT-2027-000123',
    credits: { ali: 4, mentor: 1 }, weeklyGoalHrs: 3, reminderDay: 'Mon',
    momentum: { activeWeeks: 14, thisWeekMins: 0, graceUsedOn: null },
    startChoice: 'quick-wins',
    consentToPartners: ['partner-scl'],
    mentorId: 'm-aisha',
    // Enterprise Stage team (§8.14). Tom is the authorised lead.
    team: [
      { id: 'tm-tom', name: 'Tom Okafor', email: 'tom.okafor@harbourline.example', role: 'Leader', title: 'CFO', status: 'active', aliCredits: 0 },
      { id: 'tm-grace', name: 'Grace Liu', email: 'grace.liu@harbourline.example', role: 'Board member', title: 'Chair', status: 'active', aliCredits: 0 },
    ],
    microUnitEnrolments: [],
  },
};

export const OTHER_ORGS = {
  'org-riverbend': { id: 'org-riverbend', name: 'Riverbend Arts Collective', staff: 9, state: 'VIC', city: 'Bendigo', industry: 'Arts and culture', checkId: 'core-ms', tier: 'core' },
  'org-mallee': { id: 'org-mallee', name: 'Mallee Growers Co-operative', staff: 22, state: 'SA', city: 'Loxton', industry: 'Agriculture', checkId: 'core-ml', tier: 'advanced' },
  'org-northside': { id: 'org-northside', name: 'Northside Family Support Inc', staff: 17, state: 'QLD', city: 'Brisbane', industry: 'Family services', checkId: 'core-ms', tier: 'core' },
  'org-coastline': { id: 'org-coastline', name: 'Coastline Youth Services', staff: 11, state: 'WA', city: 'Bunbury', industry: 'Youth services', checkId: 'core-ms', tier: 'ready' },
  'org-gumtree': { id: 'org-gumtree', name: 'Gum Tree Neighbourhood Centre', staff: 12, state: 'NSW', city: 'Orange', industry: 'Community services', checkId: 'core-ms', tier: 'core' },
  'org-saltbush': { id: 'org-saltbush', name: 'Saltbush Catering Pty Ltd', staff: 6, state: 'NT', city: 'Darwin', industry: 'Hospitality', checkId: 'core-ms', tier: 'foundation' },
};
