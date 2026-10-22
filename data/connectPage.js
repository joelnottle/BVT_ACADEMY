// BVT Connect directory, profile and certificate verification (§8.13), and the partner portal (§8.15).

export const DIRECTORY = {
  hero: { eyebrow: 'BVT Connect', title: 'Find pre-qualified *businesses*', lead: 'Every listed organisation has had its governance, finance and compliance independently verified by BVT.' },
  search: 'Search by name, industry, capability or town',
  filters: { status: 'Accreditation', industry: 'Industry', state: 'State', size: 'Size', all: 'All' },
  statuses: [['valid', 'Accredited'], ['expired', 'Certificate expired']],
  showing: (n, t) => `${n} of ${t} organisations`,
  none: 'No organisations match. Try fewer filters.',
  clear: 'Clear filters',
};

export const PROFILE = {
  about: 'About',
  capabilities: 'Capabilities',
  contact: 'Contact',
  contactVia: 'Contact through BVT Connect',
  contactToast: 'Message (pretend)',
  contactText: 'In the real product this sends a message through BVT Connect. Nothing was sent.',
  cert: 'Certificate',
  verify: 'Verify this certificate',
  accredited: (d) => `Accredited ${d}`,
  renews: (d) => `Renews ${d}`,
  expired: (d) => `Expired ${d}`,
  back: 'Back to the directory',
  notFound: 'We couldn’t find that organisation',
  notFoundText: 'It may no longer be listed on BVT Connect.',
};

export const VERIFY = {
  hero: { eyebrow: 'Verify a certificate', title: 'Is this certificate *valid*?', lead: 'Enter the certificate number shown on a BVT certificate, for example BVT-2027-000123.' },
  label: 'Certificate number',
  hint: 'The format is BVT, the year, then six digits.',
  check: 'Check certificate',
  need: 'Enter a certificate number, like BVT-2027-000123.',
  valid: { title: 'Valid certificate', text: (org, renews) => `${org} is accredited by BVT Academy. This certificate is valid until ${renews}.` },
  expired: { title: 'This certificate has expired', text: (org, on) => `${org}${org.endsWith('s') ? '’' : '’s'} certificate expired on ${on}. The organisation may be completing its re-assessment.` },
  notFound: { title: 'We couldn’t find that certificate', text: (n) => `No BVT certificate matches ${n}. Check the number and try again.` },
  again: 'Check another certificate',
  profile: 'View their BVT Connect profile',
  examples: 'Try one',
};

export const PARTNER = {
  lead: 'Your referred clients and where they’re up to. Progress shows only where a client has chosen to share it.',
  referred: (n) => `${n} referred ${n === 1 ? 'client' : 'clients'}`,
  funnel: 'Where your clients are',
  attention: 'Clients who may need a nudge',
  attentionNone: 'Nobody needs a nudge right now.',
  why: {
    'catch-up': 'Needs a catch-up on their plan',
    quiet: (days) => `No activity for ${days} days`,
    referred: 'Hasn’t started the free Check yet',
  },
  refer: 'Refer a client',
  consent: 'Sharing progress',
  noConsent: 'Progress not shared',
  noConsentText: (stage) => `This client hasn’t chosen to share their progress with you. You can see their stage: ${stage}.`,
  // TODO(client): what referred-client data institutions can see, and how consent is captured (§14 Q7)
  consentNote: 'Clients choose whether to share their progress with you, and can change their mind at any time.',
  ask: 'Ask them to share (pretend)',
  askToast: 'Request sent (pretend)',
  askText: 'In the real product the client gets a request in their portal. Nothing was sent.',
  cols: ['Client', 'Check', 'Tier', 'Verified readiness', 'Pace', 'Last activity', 'Stage'],
  referPage: {
    lead: 'Send a client a link to start their free Check. When they enrol, they’ll appear in your clients list.',
    name: 'Contact name', email: 'Contact email', org: 'Organisation', note: 'A note for them (optional)',
    noteHint: 'This appears in the email.',
    create: 'Create referral link',
    created: (name) => `Referral created for ${name}`,
    createdText: 'Pretend — no email was sent.',
    link: 'Referral link',
    copy: 'Copy link',
    copied: 'Link copied (pretend)',
    preview: 'Email preview',
    subject: (partner) => `${partner} has invited you to pre-qualify with BVT Academy`,
    body: (name, partner) => `Hi ${name}, ${partner} uses BVT Academy to help clients get ready for funding and contracts. Start with the free Check — it takes about 25 minutes, and you choose whether to share your progress with us.`,
    cta: 'Start your free Check',
    errors: { name: 'Enter their name.', email: 'Enter an email address, like name@organisation.com.au.', org: 'Enter their organisation.' },
  },
};
