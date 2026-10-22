// Professional milestones (BUILD_PLAN §9). Credential-style, understated, static. Earned via store actions.
// Area milestones are generated per domain; tier milestones at 25 / 50 / 75% verified.
import { DOMAINS } from './domains.js';

export const BADGES = [
  { id: 'check-complete', name: 'Check complete', icon: 'clipboard-check', trigger: 'Finish the free Check' },
  { id: 'enrolled', name: 'Enrolled', icon: 'flag', trigger: 'Complete enrolment' },
  { id: 'first-evidence', name: 'First evidence submitted', icon: 'upload', trigger: 'Submit evidence for the first time' },
  { id: 'first-verified', name: 'First requirement verified', icon: 'badge-check', trigger: 'Your first requirement is verified' },
  { id: 'all-in-place', name: 'All in-place evidence submitted', icon: 'check-check', trigger: 'Submit evidence for every "already in place" item' },
  ...DOMAINS.map((d) => ({ id: `area-${d.id}`, name: `${d.name} complete`, icon: d.icon, trigger: `Every ${d.name} requirement verified`, domainId: d.id })),
  { id: 'tier-25', name: 'Passed 25% verified', icon: 'trending-up', trigger: 'Verified readiness passes 25%', threshold: 25 },
  { id: 'tier-50', name: 'Passed 50% verified', icon: 'trending-up', trigger: 'Verified readiness passes 50%', threshold: 50 },
  { id: 'tier-75', name: 'Passed 75% verified', icon: 'trending-up', trigger: 'Verified readiness passes 75%', threshold: 75 },
  { id: 'pathway-complete', name: 'Pathway complete', icon: 'route', trigger: 'Finish the Start-up or Recovery pathway', pathwayOnly: true },
  { id: 'accredited', name: 'Accredited', icon: 'award', trigger: 'Accreditation issued' },
  { id: 'microunit-complete', name: 'Micro-Unit complete', icon: 'graduation-cap', trigger: 'A team member completes a Micro-Unit', enterpriseOnly: true },
];

export const BADGE_BY_ID = Object.fromEntries(BADGES.map((b) => [b.id, b]));
