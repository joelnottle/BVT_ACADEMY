// Public site copy: Home (BUILD_PLAN §8.1). *word* marks the crimson accent word in a heading.
// Australian English. Placeholder quotes and people are fictional.

export const HOME = {
  hero: {
    eyebrow: 'Prequalified. Accredited. Connected.',
    title: 'Have you *pre-qualified* your business?',
    lead: 'Independent pre-qualification for tenders, funding, loans and procurement. Start free, close every requirement at your own pace, and get accredited.',
    actions: [
      { label: 'Pre-qualify my business', href: '/sign-up', variant: 'action', icon: 'arrow-right' },
      { label: 'Send my clients through BVT', href: '/institutions', variant: 'on-dark' },
      { label: 'Find pre-qualified businesses', href: '/connect', variant: 'on-dark' },
    ],
    image: { src: 'assets/img/hero-bvt.jpg', alt: 'Two colleagues reviewing a Business Vitality Tracker score on a laptop' },
    endorsement: { text: 'A product of', logo: 'assets/img/vital-consult-logo-reversed.png', alt: 'Vital Consult' },
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
