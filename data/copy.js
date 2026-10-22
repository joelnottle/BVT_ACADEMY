// Shared microcopy, status labels and feedback phrasing (BUILD_PLAN §9).
// Rules: specific > generic, forward-looking, "Almost there" for changes requested,
// never shame on time or streaks, no exclamation-mark hype. Australian English.

export const PROTOTYPE_NOTE = 'Prototype — no data is sent';

// Requirement statuses (§10 reqProgress.status, plus "locked").
// `tone` maps to the --st-* tokens and .chip--st-* classes.
export const STATUS = {
  'not-started':     { label: 'Not started',             icon: 'circle-dashed', tone: 'not-started' },
  learning:          { label: 'Learning & implementing', icon: 'book-open',     tone: 'learning' },
  'evidence-needed': { label: 'Evidence needed',         icon: 'file-up',       tone: 'evidence' },
  'in-review':       { label: 'In review',               icon: 'hourglass',     tone: 'review' },
  changes:           { label: 'Changes requested',       icon: 'pencil-line',   tone: 'changes' },
  verified:          { label: 'Verified',                icon: 'circle-check',  tone: 'verified' },
  locked:            { label: 'Locked',                  icon: 'lock',          tone: 'locked' },
};

export const REQ_TYPE = {
  'in-place': { label: 'Already in place', icon: 'check-check' },
  'not-yet':  { label: 'Not yet in place', icon: 'hammer' },
};

// Reason tags on "Recommended next" (§8.4)
export const REASONS = {
  'quick-win':   { label: 'Quick win',       icon: 'zap' },
  unblocks:      { label: 'Unblocks {n}',    icon: 'layers' },
  'biggest-gap': { label: 'Biggest gap',     icon: 'target' },
  continue:      { label: 'Continue module', icon: 'bookmark' },
  'due-soon':    { label: 'Due soon',        icon: 'calendar-clock' },
  changes:       { label: 'Almost there',    icon: 'pencil-line' },
};

// Pace states (§9) — never a red countdown
export const PACE = {
  ahead:      { label: 'Ahead',            icon: 'trending-up' },
  'on-pace':  { label: 'On pace',          icon: 'gauge' },
  'catch-up': { label: 'Needs a catch-up', icon: 'footprints' },
};

// Tiers & timeframes (§2 Timeframes). Clock starts at enrolment.
export const TIERS = {
  foundation: { label: 'Foundation', band: '0–25%',   months: 12, icon: 'sprout' },
  core:       { label: 'Core',       band: '26–50%',  months: 9,  icon: 'layers' },
  advanced:   { label: 'Advanced',   band: '51–75%',  months: 6,  icon: 'trending-up' },
  ready:      { label: 'Ready',      band: '76–100%', months: 3,  icon: 'flag' },
  accredited: { label: 'Accredited', band: 'Verified', months: null, icon: 'award' },
};
export const TIER_ORDER = ['foundation', 'core', 'advanced', 'ready', 'accredited'];

// Learning loop (§2, §8.7). Steps 1–4 are optional.
export const STEPS = [
  { id: 'watch',    label: 'Watch',    icon: 'play',         optional: true,  blurb: 'A short video on why it matters' },
  { id: 'learn',    label: 'Learn',    icon: 'book-open',    optional: true,  blurb: 'Topic sessions, Ask Ali and mentors' },
  { id: 'download', label: 'Download', icon: 'download',     optional: true,  blurb: 'Templates and resources' },
  { id: 'doIt',     label: 'Do it',    icon: 'list-checks',  optional: true,  blurb: 'Put it in place in your organisation' },
  { id: 'upload',   label: 'Upload',   icon: 'upload',       optional: false, blurb: 'Add your evidence' },
  { id: 'verify',   label: 'Verify',   icon: 'shield-check', optional: false, blurb: 'Independent review by BVT' },
  { id: 'closed',   label: 'Closed',   icon: 'badge-check',  optional: false, blurb: 'Done — on to the next' },
];
export const COMPACT_STEP_IDS = ['upload', 'verify', 'closed'];

export const FAST_TRACK_LABEL = 'I know this — go to evidence';

// Feedback phrasing
export const FEEDBACK = {
  verified: (code, area, done, total) => `${code} verified — ${area} is now ${done} of ${total}`,
  changesHeading: 'Almost there — one thing to add',
  submittedTitle: (code) => `${code} submitted for verification`,
  submittedText: "We'll let you know when a verifier has reviewed it.",
  catchUp: (n) => (n === 1 ? 'One quick win would put you back on pace' : `${n} quick wins would put you back on pace`),
  // TODO(client): confirm the verification SLA shown to users (BUILD_PLAN §14 Q5)
  reviewEstimate: 'Usually reviewed within 5 business days',
};

export const PLACEHOLDER_LABEL = 'Placeholder content';

// Ask Ali (§4.2, §8.10). 1 credit ≈ 1 hour of typical use.
// TODO(client): final privacy wording once the AI provider's data location is confirmed (§14 Q9).
export const ALI = {
  intro: 'Ali helps you understand requirements and prepare evidence, any time.',
  creditLine: (c) => `${c} credits · about ${Math.floor(c)} ${Math.floor(c) === 1 ? 'hour' : 'hours'} of typical use`,
  footer: "Ali offers guidance — it doesn't verify your evidence. Conversations stay private and aren't used to train public models.",
};
