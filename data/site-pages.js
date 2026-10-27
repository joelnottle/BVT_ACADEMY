// Public inner pages copy (BUILD_PLAN §2, §7.1): How it works, Checks, Academy, Institutions.
// *word* marks the crimson accent word in a heading.

export const HOW_IT_WORKS = {
  hero: { eyebrow: 'How it works', title: 'From free check to *accredited*', lead: 'Australia’s first end-to-end organisation development portal: four stages, one login, at your own pace, with help whenever you need it.' },
  stages: [
    { icon: 'clipboard-check', title: 'Check', lead: 'A free check, completed by your nominated authorised lead.',
      points: ['25 to 76 questions, depending on the check', 'Your score, your tier and a breakdown by area', 'Which requirements are already in place, and which to build'] },
    { icon: 'book-open', title: 'Academy', lead: 'Close every requirement, starting wherever you like.',
      points: ['Every requirement visible and unlocked from day one', 'Already in place? Upload evidence. Not yet? Learn, put it in place, then upload', 'Ask Ali, mentors and templates whenever you need them'] },
    { icon: 'shield-check', title: 'Accreditation', lead: 'Independent verification of every piece of evidence.',
      points: ['A separate verification team reviews each requirement', '“Almost there” feedback tells you exactly what to add', 'A certificate with a number and QR code anyone can check'] },
    { icon: 'building', title: 'Connect', lead: 'Get found by the people who fund and buy.',
      points: ['Listed in the directory funders, lenders and buyers search', 'Your authorised lead is the contact', 'Keep your profile current after accreditation'] },
  ],
  stagesOfJourney: {
    eyebrow: 'Two stages',
    title: 'Pre-qualify first, then *grow*',
    items: [
      { badge: 'From January 2027', title: 'Prequalification Stage', text: 'One person, one organisation, one journey: check, Academy, accreditation, then listing on BVT Connect.' },
      { badge: 'First release · July 2027', title: 'Enterprise Stage', text: 'After accreditation: invite your board, leaders and staff, enrol them in Leadership Micro-Units, keep your accreditation current and add Growth and ESG checks.' },
    ],
    // TODO(client): one login for both stages is assumed (BUILD_PLAN §14 Q8)
    note: 'No subscription after accreditation. Pay only for what you use.',
  },
};

export const CHECKS_PAGE = {
  hero: { eyebrow: 'Free checks', title: 'Know where you *stand*, free', lead: 'Four checks, no payment. Your result shows your score, your tier and exactly what to build.' },
  who: {
    eyebrow: 'Who completes it',
    title: 'Your nominated *authorised lead*',
    text: 'Your organisation decides who completes the check. It is usually someone who can speak for the whole organisation:',
    examples: ['Public officer', 'Bank-account holder', 'Founder or CEO', 'Executive director', 'CFO or finance lead'],
  },
  results: {
    eyebrow: 'What you get',
    title: 'A result you can *act* on',
    items: [
      { icon: 'gauge', title: 'Your score', text: 'How much of pre-qualification you already meet.' },
      { icon: 'layers', title: 'Your tier and time', text: 'Foundation, Core, Advanced or Ready — and how long you have to finish.' },
      { icon: 'map', title: 'A breakdown by area', text: 'Governance, board, finance, operations, risk and reporting.' },
      { icon: 'check-check', title: 'In place vs to build', text: 'Quick wins you can evidence now, and what the Academy will help you build.' },
    ],
  },
  pathways: {
    eyebrow: 'Tailored pathways',
    title: 'Starting out, or *steadying* the ship?',
    items: [
      { icon: 'sprout', title: 'Start-up pathway', text: 'Seven foundations every new business needs — structure, a plan, a business account, a first-year budget and more. Complete them and your Core requirements unlock.' },
      { icon: 'life-buoy', title: 'Recovery pathway', text: 'For organisations managing debt or recovering from a difficult period. Steady things first, then build back towards pre-qualification.' },
    ],
    note: 'Both pathways unlock at enrolment, and both sit in the Foundation tier with 12 months to complete.',
  },
};

export const ACADEMY_PAGE = {
  hero: { eyebrow: 'The Academy', title: 'Close every requirement, *your* way', lead: 'Everything is visible from day one. You choose where to start, skip what you already know, and get help when you need it.' },
  types: {
    eyebrow: 'Two kinds of requirement',
    title: 'Skip what you already *know*',
    items: [
      { icon: 'check-check', title: 'Already in place', text: 'Upload your evidence, a verifier checks it, and it closes. No training needed — these are your fastest wins.', flow: ['Upload', 'Verify', 'Closed'] },
      { icon: 'hammer', title: 'Not yet in place', text: 'Watch, learn and download what you need, put it in place, then upload. Know it already? Go straight to evidence.', flow: ['Watch', 'Learn', 'Download', 'Do it', 'Upload', 'Verify', 'Closed'] },
    ],
  },
  lenses: {
    eyebrow: 'Three ways in',
    title: 'One set of requirements, three *lenses*',
    items: [
      { icon: 'map', title: 'By area', text: 'The map: every area, module and requirement, with progress for each.' },
      { icon: 'list-checks', title: 'By next action', text: 'The to-do view: what to start, what needs evidence, what is in review.' },
      { icon: 'book-open', title: 'By topic', text: 'The library: short videos, recorded sessions and templates, shared across related requirements.' },
    ],
  },
  ali: {
    eyebrow: 'Ask Ali AI',
    title: 'A guide that’s always *on*',
    text: 'Ask Ali explains requirements in plain English, suggests what good evidence looks like and helps you prepare. It offers guidance — it never verifies your evidence.',
    points: ['Credits included in every package (1 credit ≈ 1 hour of typical use)', 'Top up any time', 'Works in a closed environment, with your consent', 'Your conversations are not used to train public AI models'],
  },
  motivation: {
    eyebrow: 'Momentum',
    title: 'Progress you can *see*',
    items: [
      { icon: 'award', title: 'Professional milestones', text: 'First requirement verified, an area complete, a tier crossed, accredited.' },
      { icon: 'calendar-check', title: 'A weekly rhythm', text: 'Set a weekly time goal and a reminder day. Active weeks build quiet momentum.' },
      { icon: 'route', title: 'Pace, not pressure', text: 'Ahead, on pace or needs a catch-up — with a concrete suggestion and an easy re-plan.' },
    ],
    note: 'No leaderboards, no comparisons with other organisations.',
  },
  // PLACEHOLDER — pricing lives in Doc 3 (BUILD_PLAN §14 Q6)
  package: { title: 'What’s included', items: ['Full Academy access for your tier’s time limit', 'Ask Ali credits', 'Mentor credits', 'Independent verification', 'Certificate and BVT Connect listing'], price: '[Price — Doc 3]' },
};

export const INSTITUTIONS_PAGE = {
  hero: { eyebrow: 'For institutions', title: 'Send your clients through *BVT*', lead: 'Australian lenders, funders, accountants and industry bodies refer clients to BVT. They pre-qualify, build what’s missing, and come back ready.' },
  why: {
    eyebrow: 'Why it matters',
    title: 'Better-prepared *applicants*',
    items: [
      { icon: 'file-check', title: 'Fewer incomplete applications', text: 'Clients arrive with governance, finance and compliance evidence already verified.' },
      { icon: 'shield-check', title: 'Independent verification', text: 'Every requirement is checked by a separate verification team, not the client’s mentor.' },
      { icon: 'gauge', title: 'Progress you can see', text: 'With your client’s consent, follow their tier, readiness and pace in the partner portal.' },
    ],
  },
  how: {
    eyebrow: 'How referral works',
    title: 'Refer once, follow *along*',
    steps: [
      { title: 'Refer', text: 'Send a referral link or email from the partner portal.' },
      { title: 'They check and enrol', text: 'Your client takes the free check and, if they choose, enrols in the Academy.' },
      { title: 'You follow progress', text: 'Where they consent, you see their tier, readiness and pace.' },
      { title: 'They’re accredited', text: 'They receive a certificate and appear in BVT Connect.' },
    ],
  },
  consent: {
    title: 'Consent comes first',
    // TODO(client): confirm what referred-client data institutions can see, and how consent is captured (§14 Q7)
    withConsent: ['Check type and tier', 'Verified readiness', 'Pace status', 'Last activity'],
    withoutConsent: ['Stage only: referred, checked, enrolled, in progress or accredited'],
  },
  form: {
    title: 'Become a referral partner',
    text: 'Tell us about your organisation and we’ll set up your partner portal.',
    types: ['Lender', 'Funder or grant-maker', 'Accountant or adviser', 'Industry or peak body', 'Other'],
    success: (name) => `Thanks, ${name}. In the real product our partnerships team would be in touch within two business days.`,
  },
};
