// Help & resources (#/app/help): ways to get help, how the Academy works, what each status means, and FAQs.
// Australian English. "Almost there" for changes requested. No ecosystem marketing.

export const HELP = {
  lead: 'Three ways to get unstuck, plus how the Academy works and what each status means.',
  ways: [
    { id: 'ali', icon: 'sparkles', title: 'Ask Ali', text: 'Plain-English answers about any requirement, any time. Open it from the header on any page.', action: 'Ask Ali' },
    { id: 'mentor', icon: 'users', title: 'Book a mentor', text: 'A 45-minute session with a mentor who helps you put things in place. Mentors never verify.', action: 'Book a mentor', href: '/app/mentoring/book' },
    { id: 'contact', icon: 'mail', title: 'Contact BVT', text: 'Questions about your account, billing or verification.', action: 'Send a message (demo)' },
  ],
  // TODO(client): support email, phone and response time (not in the brief)
  contactEmail: 'hello@bvtacademy.com.au',
  contactNote: 'We reply within two business days.',
  contactToast: 'Message sent (demo)',
  contactToastText: 'In the real Academy this goes to the BVT support team. Nothing was sent.',

  howTitle: 'How the Academy works',
  howLead: 'Every requirement is visible from day one, and you can start wherever you like.',
  types: [
    { type: 'in-place', text: 'You already do this. Upload your evidence, a verifier checks it, and it closes. These are your fastest wins.' },
    { type: 'not-yet', text: 'You’ll build this. Use the learning steps as much or as little as you need, put it in place, then upload.' },
  ],
  loopTitle: 'The seven steps',
  loopNote: 'Steps 1–4 are optional. “I know this — go to evidence” is always there.',

  statusTitle: 'What each status means',
  statuses: {
    'not-started': 'You haven’t opened this requirement yet.',
    learning: 'You’ve started the learning steps or the Do it checklist.',
    'evidence-needed': 'It’s in place (or you’ve done the work). Upload your evidence.',
    'in-review': 'A verifier has your evidence. We’ll let you know the outcome.',
    changes: 'Almost there. The verifier has said exactly what to add. Reply and upload again.',
    verified: 'Independently verified. This counts towards your readiness.',
    locked: 'Opens after your Start-up or Recovery pathway is complete.',
  },

  shortcutsTitle: 'Keyboard shortcuts',
  shortcuts: [
    ['⌘ K / Ctrl K', 'Search requirements, modules and evidence'],
    ['Esc', 'Close Ask Ali, menus and dialogs'],
    ['Tab / Shift Tab', 'Move between links and buttons'],
  ],

  faqTitle: 'Questions',
  faq: [
    { q: 'Do we have to do the requirements in order?', a: 'No. Every requirement is open from day one. Many organisations start with what is already in place, because those close fastest.' },
    { q: 'Can we skip the videos and learning?', a: 'Yes. Watch, Learn, Download and Do it are optional. Choose “I know this — go to evidence” on any requirement.' },
    { q: 'What does “Almost there” mean?', a: 'The verifier needs one more thing. Their comment says exactly what to add. Reply with a note, upload a revised file and resubmit.' },
    // TODO(client): confirm the verification SLA shown to users (BUILD_PLAN §14 Q5)
    { q: 'How long does verification take?', a: 'Usually within 5 business days. You’ll get a notification as soon as it’s reviewed.' },
    { q: 'Can one document cover several requirements?', a: 'Yes. Link a file from your Evidence locker to any requirement it supports, so you never upload it twice.' },
    { q: 'What happens if we run out of time?', a: 'You can re-plan your remaining time without losing any work, or extend by one month or three from Plan & pace.' },
    { q: 'What is an Ali credit?', a: 'One credit is roughly an hour of back-and-forth with Ali. Each answer uses a quarter of a credit. You can top up at any time.' },
    { q: 'Can our mentor verify our evidence?', a: 'No. Mentors help you put things in place. A separate, independent verification team decides.' },
  ],
};
