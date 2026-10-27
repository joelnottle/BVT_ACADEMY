// Public site copy: Home (BUILD_PLAN §8.1). *word* marks the crimson accent word in a heading.
// Australian English. Placeholder quotes and people are fictional.

// TODO(client): real email address and social profile links
export const CONTACT = {
  email: 'hello@bvtacademy.com.au',
  socials: [
    { id: 'linkedin', label: 'BVT Academy on LinkedIn' },
    { id: 'facebook', label: 'BVT Academy on Facebook' },
    { id: 'instagram', label: 'BVT Academy on Instagram' },
  ],
};

export const HOME = {
  hero: {
    eyebrow: 'Prequalified. Accredited. Connected.',
    title: 'Have you *pre-qualified* your business?',
    lead: 'Independent pre-qualification for Australian organisations, for tenders, funding, loans and procurement. \n\nStart free, close every requirement at your own pace, and get accredited.',
    actions: [
      { label: 'Pre-qualify my business', href: '/sign-up', variant: 'action', icon: 'arrow-right' },
      { label: 'Send my clients through BVT', href: '/institutions', variant: 'on-dark' },
      { label: 'Find pre-qualified businesses', href: '/connect', variant: 'on-dark' },
    ],
    image: { src: 'assets/img/hero-bvt.jpg', alt: 'Two colleagues reviewing a Business Vitality Tracker score on a laptop' },
    endorsement: { text: 'A product of', logo: 'assets/img/vital-consult-logo-reversed.png', logoOnLight: 'assets/img/vital-consult-logo.png', alt: 'Vital Consult' },
  },
  // "Proudly Australian" band, straight under the crimson strip, with the faded outline of Australia.
  // TODO(client): substantiate "Australia’s first" before launch (Australian Consumer Law: comparative claims),
  // and confirm the support team is Australia-based.
  australia: {
    eyebrow: 'Proudly Australian',
    title: '*Australia’s first* end-to-end organisation development portal',
    lead: 'Check where you stand, build what’s missing, get independently verified and be found, all in one place. Designed around how Australian organisations are governed, funded and regulated.',
    points: [
      { icon: 'route', title: 'Start to finish, in one place', text: 'Free check, learning, mentors, verification, accreditation and a public listing. No hand-offs between providers.' },
      { icon: 'landmark', title: 'Built for Australian organisations', text: 'Companies, incorporated associations, co-operatives and ORIC-registered corporations, from start-ups to established services.' },
      { icon: 'map-pin', title: 'Support on Australian time', text: 'Mentors and an independent verification team who know the Australian funding and compliance landscape.' },
    ],
  },
  // "What it checks": what BVT is for, and the six areas (circular infographic + list). Area names come from DOMAINS.
  areas: {
    eyebrow: 'What it checks',
    title: 'Everything funders, lenders and buyers *look for*',
    lead: 'Before you win a tender, grant, loan or contract, someone checks that your organisation is well run. BVT checks the same six areas, helps you build what’s missing, then has every requirement independently verified for accreditation.',
    purposes: [
      { icon: 'file-text', label: 'Tenders' },
      { icon: 'hand-coins', label: 'Grants & funding' },
      { icon: 'landmark', label: 'Loans & finance' },
      { icon: 'clipboard-list', label: 'Procurement panels' },
    ],
    centre: { big: '6 areas', small: '45–60 requirements', note: 'independently verified' },
    // PLACEHOLDER — replace with BVT question bank (§14 Q1): example requirements per area
    examples: {
      GC: 'Constitution, conflict of interest register, registration with the regulator, code of conduct.',
      BD: 'Director register, board charter, director induction, regular minuted meetings.',
      FM: 'Qualified accounts, reconciliations, an approved budget, cash flow forecasting.',
      OH: 'Employment contracts, induction, position descriptions, WHS policy and risk assessment.',
      RC: 'Risk register, tested backups, risk appetite, annual board risk review.',
      RP: 'Annual returns, tax and payroll obligations, licences and registrations.',
    },
    outcome: 'Every area verified = accredited, with a certificate anyone can check.',
    outcomeLink: { label: 'How accreditation works', href: '/how-it-works' },
  },
  // Statement band after Tiers (Joel, 27 Oct 2026)
  standards: {
    title: 'Success is dependent on weekly *standards*. Your success creates *change*.',
    text: 'Set a weekly goal when you enrol. Small, steady progress each week is what gets organisations accredited, and accredited organisations win the funding and work that changes their communities.',
  },
  // VC Vault highlight near the bottom of Home (Joel, 27 Oct 2026). A partner product: never a step, never required.
  vault: {
    eyebrow: 'From our partners',
    title: 'VC Vault: your policies *secure, signed and compliant*',
    text: 'Keep every policy, register and signed board document in one place, and link them straight to your Academy evidence. Optional, and separate from BVT.',
    points: [
      { icon: 'lock', title: 'Secure', text: 'One protected home for your governance documents.' },
      { icon: 'pen-line', title: 'Signed', text: 'Approved, signed versions kept with their history.' },
      { icon: 'calendar-check', title: 'Compliant', text: 'Review dates tracked, so nothing quietly lapses.' },
    ],
    action: 'Learn about VC Vault',
    pretend: 'VC Vault is a separate Vital Consult product — link to come.',
    // PLACEHOLDER — illustrative documents for the mock vault panel
    docs: [
      { name: 'Conflict of interest policy', meta: 'Signed 14 Feb 2027 · review Feb 2028', status: 'Signed' },
      { name: 'WHS policy', meta: 'Signed 2 Mar 2027 · review Mar 2028', status: 'Signed' },
      { name: 'Delegations of authority', meta: 'Review due 30 Jun 2027', status: 'Review due' },
    ],
  },
  strip: {
    heading: 'Four steps to pre-qualified',
    steps: [
      { icon: 'clipboard-check', title: '1 · Check', text: 'A free pre-qualification check. Get your score and your tier.' },
      { icon: 'book-open', title: '2 · Academy', text: 'Close each requirement with learning, Ask Ali and mentors.' },
      { icon: 'shield-check', title: '3 · Accreditation', text: 'Evidence independently verified. Certificate issued.' },
      { icon: 'building', title: '4 · Connect', text: 'Listed in the directory funders and buyers search.' },
    ],
  },
  checks: {
    eyebrow: 'Free checks',
    title: 'Start with a *free* check',
    lead: 'No payment required. Completed by your nominated authorised lead.',
    pathwayNote: 'Start-up or in recovery? A tailored pathway unlocks at enrolment and is completed before the Core Academy journey.',
  },
  loop: {
    eyebrow: 'How the Academy works',
    title: 'Start anywhere. Close every *requirement*.',
    lead: 'Every requirement is visible from day one, and you choose where to start. Learning is there when you need it — and optional when you don’t.',
    skip: 'Already in place? Skip straight to evidence',
    optional: 'Learning steps are optional',
  },
  tiers: {
    eyebrow: 'Tiers and timeframes',
    title: 'Your score sets your *tier* and your time',
    note: 'Your clock starts when you enrol, not when you take the free check.',
    foundationNote: 'incl. Start-up & Recovery',
  },
  support: {
    eyebrow: 'Support',
    title: 'Help at every *step*',
    items: [
      { icon: 'sparkles', title: 'Ask Ali AI', text: 'Your built-in guide, 24/7. Credits are included in every package.' },
      { icon: 'users', title: 'Mentors', text: 'Book one-on-one time with a BVT accredited specialist.' },
      { icon: 'shield-check', title: 'Independent verification', text: 'Mentors help. A separate team verifies, so your accreditation stays independent.' },
    ],
  },
  credential: {
    eyebrow: 'The credential',
    title: 'Anyone can *verify* it',
    text: 'Every certificate carries a number and a QR code. Funders, buyers and lenders can check it in seconds.',
    action: { label: 'Verify a certificate', href: '/verify' },
    listingId: 'cx-harbourline',
  },
  connect: {
    eyebrow: 'BVT Connect',
    title: 'Find pre-qualified *businesses*',
    label: 'Search the directory',
    placeholder: 'Industry, location or name',
    listingIds: ['cx-harbourline', 'cx-wattle', 'cx-ironbark'],
  },
  institutions: {
    title: 'Lenders, funders and agents',
    text: 'Send your clients through BVT and see their progress, with their consent.',
    action: { label: 'Become a referral partner', href: '/institutions' },
  },
  /* PLACEHOLDER — testimonial to be supplied (fictional person) */
  testimonial: {
    quote: 'We knew we were doing the right things, we just couldn’t prove it. Uploading what was already in place got us a third of the way in the first month — and the funder conversation changed completely.',
    name: 'Helen Marsh',
    role: 'CEO, a community health service in regional Victoria',
  },
  faq: {
    title: 'Questions',
    items: [
      { q: 'Who should complete the check?', a: 'Your nominated authorised lead — for example the public officer, the bank-account holder, or the founder, CEO, executive director or CFO. Your organisation decides who completes it.' },
      { q: 'Is the check really free?', a: 'Yes. All four checks are free and need no payment details. You only pay if you choose to enrol in the Academy.' },
      { q: 'What if we don’t finish in time?', a: 'Life gets in the way. You can re-plan your remaining time without losing any work, or extend by one month or three. Nothing you have done is lost.' },
      { q: 'Do mentors decide whether we pass?', a: 'No. Mentors help you put things in place. A separate, independent verification team reviews your evidence and decides.' },
      // TODO(client): final privacy wording once the AI provider's data location is confirmed (§14 Q9)
      { q: 'How is my data used by Ask Ali?', a: 'Ask Ali works in a closed environment, with your consent, using de-identified information. Your conversations are not used to train public AI models.' },
    ],
  },
  cta: { title: 'Ready to *pre-qualify*?', text: 'Free, about 25 minutes, and your clock doesn’t start until you enrol.', label: 'Start your free check', href: '/sign-up' },
};
