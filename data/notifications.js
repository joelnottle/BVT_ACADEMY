// Notifications and mock reminder emails (BUILD_PLAN §8.18). Nothing is ever sent.
// type: 'outcome' | 'mentor' | 'goal' | 'deadline' | 'milestone' | 'credit'
// Copy rules (§9): specific, forward-looking, "Almost there" for changes, never shame on time.

const N = (id, orgId, type, on, title, text, href, read = false) => ({ id, orgId, type, on, title, text, href, read });

export const NOTIFICATIONS = [
  // ---- Kestrel (A) ----
  N('n-k1', 'org-kestrel', 'outcome', '2027-04-29', 'Almost there — GC-02 needs one more thing', 'Please add a signed declaration from each director. The register and board minute look good.', '/app/req/GC-02/verify'),
  N('n-k2', 'org-kestrel', 'mentor', '2027-05-03', 'Mentor session on Thursday at 10:00', 'Marcus Hale · Cash flow forecasting (FM-04). Add prep notes any time before the session.', '/app/mentoring'),
  N('n-k3', 'org-kestrel', 'goal', '2027-05-03', "This week's goal: 2 hours", "You've done 1h 20m. FM-04 is one checklist item from Upload.", '/app/plan'),
  N('n-k4', 'org-kestrel', 'outcome', '2027-04-28', 'FM-02 verified — Financial Management is now 4 of 9', 'Next in this area: FM-04 Monthly cash flow forecast.', '/app/req/FM-02', true),
  N('n-k5', 'org-kestrel', 'outcome', '2027-04-26', 'FM-03 verified — Financial Management is now 3 of 9', 'Shared learning with FM-04 and FM-05 is already done.', '/app/req/FM-03', true),
  N('n-k6', 'org-kestrel', 'milestone', '2027-03-29', 'Milestone: First requirement verified', 'FM-01 verified. 44 to go — 18 of them are already in place.', '/app/recognition', true),
  // ---- Brightfield (B) ----
  N('n-b1', 'org-brightfield', 'outcome', '2027-04-29', 'SU-04 verified — Start-up pathway is now 4 of 7', 'Next: SU-05 First-year budget. Three more and your Core requirements unlock.', '/app/pathway'),
  N('n-b2', 'org-brightfield', 'mentor', '2027-05-03', 'Mentor session on Tuesday at 14:00', 'Marcus Hale · First-year budget (SU-05).', '/app/mentoring'),
  N('n-b3', 'org-brightfield', 'milestone', '2027-04-12', 'Milestone: First requirement verified', 'SU-01 verified. Your pathway is under way.', '/app/recognition', true),
  // ---- Harbourline (C) ----
  N('n-c1', 'org-harbourline', 'milestone', '2027-07-01', 'The Enterprise hub is open', 'Invite your board and leaders, and enrol them in Leadership Micro-Units.', '/app/enterprise'),
  N('n-c2', 'org-harbourline', 'credit', '2027-07-20', 'Ask Ali credits are running low', 'You have 4 credits left. Top up any time from Billing & credits.', '/app/settings/billing', true),
  N('n-c3', 'org-harbourline', 'milestone', '2027-04-26', 'Milestone: Accredited', 'Certificate BVT-2027-000123 issued. Your Connect profile is now live.', '/app/accreditation', true),
];

// Mock email previews for the "Mock emails" tab (§8.18). {name} and {org} are filled in by the view.
export const MOCK_EMAILS = [
  { id: 'em-goal', type: 'goal', subject: 'Your week in the Academy: 2 hours planned', preview: 'Hi {name}, one checklist item stands between FM-04 and upload. Twenty minutes this week would do it.' },
  { id: 'em-outcome', type: 'outcome', subject: 'Almost there: GC-02 needs one more thing', preview: 'Hi {name}, your verifier has asked for signed declarations from each director. Everything else looks good.' },
  { id: 'em-mentor', type: 'mentor', subject: 'Reminder: mentor session Thursday 10:00', preview: 'Hi {name}, Marcus Hale is looking forward to talking cash flow with you. Add your prep notes here.' },
  { id: 'em-60', type: 'deadline', subject: '60 days to go: your plan for the final stretch', preview: 'Hi {name}, here is what is left for {org}, and an easy way to re-plan or extend if life got in the way.' },
  { id: 'em-30', type: 'deadline', subject: '30 days to go', preview: 'Hi {name}, quick wins first: these in-place items only need evidence.' },
  { id: 'em-14', type: 'deadline', subject: 'Two weeks left: your options', preview: 'Hi {name}, you can extend by one month or three. Nothing you have done is lost.' },
];
