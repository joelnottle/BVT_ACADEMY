// Route table (BUILD_PLAN §7). Every route renders something: real views replace placeholders phase by phase.
// layout: 'public' | 'portal' | 'backoffice' | 'bare'. `focused` = minimal public header (Check & enrolment).
// roles: who may view (others see a "switch view" page). nav: which sidebar item to highlight.
// load: () => import('./views/…') once a real view exists; otherwise the placeholder view is used.

const LEAD = ['lead'];
const PARTNER = ['partner'];
const VERIFIER = ['verifier'];
const MENTOR = ['mentor'];

const pub = (path, title, phase, summary, extra = {}) => ({ path, layout: 'public', title, phase, summary, ...extra });
const check = (path, title, phase, summary) => ({ path, layout: 'public', focused: true, title, phase, summary, section: 'Free Check' });
const app = (path, title, phase, summary, extra = {}) => ({ path, layout: 'portal', roles: LEAD, title, phase, summary, ...extra });

export const ROUTES = [
  // ---- Public (§7.1) ----
  pub('/', 'Home', 3, 'Home: hero with three paths, the four free Checks, how the Academy works, tiers, support, the credential, Connect teaser.'),
  pub('/how-it-works', 'How it works', 3, 'Check → Academy → Accreditation → Connect.'),
  pub('/checks', 'Free Checks', 3, 'The four free Checks and the Start-up and Recovery pathways.'),
  pub('/academy', 'Inside the Academy', 3, 'The learning loop, Ask Ali, mentors, tiers and timeframes.'),
  pub('/institutions', 'Send my clients through BVT', 3, 'For lenders, funders and agents: why pre-qualified clients matter and how referral works.'),
  pub('/connect', 'BVT Connect', 13, 'Search pre-qualified and accredited businesses.'),
  pub('/connect/:orgId', 'Connect profile', 13, 'Public profile with a link to verify the certificate.'),
  pub('/verify', 'Verify a certificate', 13, 'Enter a certificate number to check it is valid.'),
  pub('/verify/:certNo', 'Certificate check', 13, 'Valid, expired or not found.'),
  pub('/sign-in', 'Sign in', 4, 'Pretend sign-in. For now, use the Demo panel to choose who you are.'),
  pub('/sign-up', 'Create your account', 4, 'Pretend sign-up, leading into the free Check.'),

  // ---- Free Check & enrolment (§7.2) ----
  check('/check/start', 'Start your free check', 4, 'Authorised-lead declaration and organisation details.'),
  check('/check/choose', 'Choose your check', 4, 'We recommend a Check from your answers; the others stay selectable.'),
  check('/check/run/:checkId', 'Your free check', 4, 'One question per card, sections by area, autosave, save & exit.'),
  check('/check/results', 'Your results', 4, 'Score, tier, area breakdown and your next step.'),
  { ...check('/enrol', 'Enrol in the Academy', 5, 'Package and tier, with a pretend payment (no card fields).'), section: 'Enrolment' },
  { ...check('/onboarding', 'Welcome to the Academy', 5, 'Four short steps: timeline, weekly goal, where to start, your support.'), section: 'Enrolment' },

  // ---- Portal (§7.3) ----
  app('/app/dashboard', 'Dashboard', 6, 'How close you are to accreditation, and what to do next.'),
  app('/app/score', 'My Check & Score', 6, 'Your Check answers (read-only), area breakdown and re-take information.'),
  app('/app/pathway', 'Start-up pathway', 11, 'The short pathway to complete before Core requirements unlock.'),
  app('/app/academy/area', 'Academy — by area', 7, 'Every requirement, grouped by area and module.', { section: 'Academy' }),
  app('/app/academy/area/:domainId', 'Academy — area', 7, 'One area: its modules and requirements.', { section: 'Academy' }),
  app('/app/academy/action', 'Academy — by next action', 7, 'A status board (or list) of what to do next.', { section: 'Academy' }),
  app('/app/academy/topic', 'Academy — by topic', 7, 'The learning library: modules, videos and templates.', { section: 'Academy' }),
  app('/app/module/:moduleId', 'Module', 7, 'Shared learning and the requirements this module serves.', { section: 'Academy', nav: '/app/academy/topic' }),
  app('/app/req/:reqId', 'Requirement', 8, 'The requirement page: Watch → Learn → Download → Do it → Upload → Verify → Closed.', { section: 'Academy', nav: '/app/academy/area' }),
  app('/app/req/:reqId/:step', 'Requirement', 8, 'The requirement page, opened at a step.', { section: 'Academy', nav: '/app/academy/area' }),
  app('/app/evidence', 'Evidence locker', 10, 'Every file you have uploaded, and the requirements it supports.'),
  app('/app/ali', 'Ask Ali', 9, 'Your conversations with Ali, grouped by requirement, and saved answers.'),
  app('/app/mentoring', 'Mentoring', 9, 'Your mentor credits, the mentor team, and upcoming and past sessions.'),
  app('/app/mentoring/book', 'Book a mentor', 9, 'Choose a topic, a time and add prep notes.', { nav: '/app/mentoring' }),
  app('/app/accreditation', 'Accreditation', 10, 'What is left before accreditation, and your certificate.'),
  app('/app/connect-profile', 'Connect profile', 10, 'Your listing on BVT Connect, with a live preview. Opens after accreditation.'),
  app('/app/recognition', 'Profile & recognition', 10, 'Milestones, badges and your weekly momentum.'),
  app('/app/notifications', 'Notifications', 10, 'Verifier outcomes, reminders and milestones, plus mock reminder emails.'),
  app('/app/plan', 'Plan & pace', 10, 'Your pace plan, weekly goal, re-planning and extensions.'),
  app('/app/enterprise', 'Enterprise hub', 12, 'After accreditation: re-assessment, your team, Leadership Micro-Units and further checks.'),
  app('/app/enterprise/:section', 'Enterprise hub', 12, 'Team, Micro-Units, further checks or purchases.', { nav: '/app/enterprise' }),
  app('/app/help', 'Help & resources', 15, 'How the Academy works, and where to get help.'),
  app('/app/settings', 'Settings', 10, 'Your organisation details.'),
  app('/app/settings/:tab', 'Settings', 10, 'Organisation, or billing and credits.', { nav: '/app/settings' }),

  // ---- Partner portal (§7.4) ----
  { path: '/partner/dashboard', layout: 'portal', roles: PARTNER, title: 'Partner dashboard', phase: 13, summary: 'Referred clients and where they are up to.' },
  { path: '/partner/clients', layout: 'portal', roles: PARTNER, title: 'Clients', phase: 13, summary: 'Client progress, shown only where the client has consented.' },
  { path: '/partner/clients/:orgId', layout: 'portal', roles: PARTNER, title: 'Client', phase: 13, summary: 'One client, consent-aware.', nav: '/partner/clients' },
  { path: '/partner/refer', layout: 'portal', roles: PARTNER, title: 'Refer a client', phase: 13, summary: 'Create a referral link and preview the email.' },
  { path: '/partner/connect', layout: 'portal', roles: PARTNER, title: 'Connect search', phase: 13, summary: 'The BVT Connect directory.' },

  // ---- Back-office (§7.5) ----
  { path: '/team/queue', layout: 'backoffice', roles: VERIFIER, title: 'Review queue', phase: 14, summary: 'Evidence waiting for verification.' },
  { path: '/team/review/:reviewId', layout: 'backoffice', roles: VERIFIER, title: 'Review', phase: 14, summary: 'Split view: criteria and evidence, with an assistive AI pre-check.', nav: '/team/queue' },
  { path: '/team/history', layout: 'backoffice', roles: VERIFIER, title: 'Decision history', phase: 14, summary: 'Every verify and request-changes decision.' },
  { path: '/team/mentor', layout: 'backoffice', roles: MENTOR, title: 'This week', phase: 14, summary: "This week's mentoring sessions." },
  { path: '/team/mentor/mentees', layout: 'backoffice', roles: MENTOR, title: 'Mentees', phase: 14, summary: 'Organisations you mentor. Mentors never verify.' },
  { path: '/team/mentor/sessions/:id', layout: 'backoffice', roles: MENTOR, title: 'Session', phase: 14, summary: 'Client prep notes, requirement context, and your notes.', nav: '/team/mentor' },

  // ---- Developer ----
  { path: '/styleguide', layout: 'bare', title: 'Styleguide', load: () => import('./views/styleguide/view.js') },
  { path: '/styleguide/data', layout: 'bare', title: 'Mock data', load: () => import('./views/styleguide/dataView.js') },
  { path: '/styleguide/:section', layout: 'bare', title: 'Styleguide', load: () => import('./views/styleguide/view.js') },
];
