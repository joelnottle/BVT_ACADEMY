// Enterprise hub copy (BUILD_PLAN §2 Stages, §8.14). Hub access after accreditation: no subscription.

export const HUB = {
  badge: 'First release · July 2027',
  lead: 'Keep your accreditation current, build your leaders’ skills, and add further checks when you need them.',
  sections: [
    ['', 'Overview', 'layout-dashboard'], ['team', 'Team', 'users'], ['micro-units', 'Micro-Units', 'graduation-cap'],
    ['checks', 'Further checks', 'clipboard-list'], ['purchases', 'Purchases', 'receipt'],
  ],
  locked: 'The Enterprise hub opens after accreditation, from 1 July 2027.',
  lockedWhy: 'It’s where you keep your accreditation current, invite your board and leaders, and enrol them in Leadership Micro-Units.',
  noSubscription: 'No subscription. Pay only for what you use.',
  accredited: 'Accreditation',
  reassessment: 'Re-assessment due',
  reassessmentText: (days) => (days > 0 ? `In ${days} days. Re-assessment keeps your accreditation and Connect listing current.` : 'Due now. Re-assessment keeps your accreditation and Connect listing current.'),
  buyReassessment: 'Purchase re-assessment',
  reassessmentBooked: (on) => `Re-assessment purchased ${on}. The verification team will be in touch.`,
  score: 'Your Check',
  scoreText: (score, tier) => `${score}% at enrolment · ${tier} tier`,
  scoreSub: (tier) => `at enrolment · ${tier} tier`,
  scoreLink: 'Review your score and answers',
  teamSummary: (active, invited, enrolled) => `${active} active · ${invited} invited · ${enrolled} in Micro-Units`,
  resultsTitle: 'Ask Ali · Results assistant',
  resultsSoon: 'Coming soon',
  resultsItems: ['Draft tender responses from your verified evidence', 'Explain your financial reports in plain English', 'Draft contracts and HR documents'],
  // TODO(client): confirm prices (Doc 3, §14 Q6)
  price: 'Price to be confirmed (Doc 3)',
  paid: 'Prototype — no payment is taken and no card details are collected.',
};

export const TEAM_PAGE = {
  lead: 'Invite your board, leaders and staff. They get their own login, Micro-Units and Ask Ali credits.',
  invite: 'Invite a team member',
  name: 'Name', email: 'Email', role: 'Role',
  roles: ['Board member', 'Leader', 'Staff'],
  send: 'Send invite',
  sent: (name) => `Invite sent to ${name}`,
  sentText: 'Pretend — no email was sent. They show as invited until they accept.',
  cols: ['Name', 'Role', 'Status', 'Micro-Units', 'Ask Ali', 'Actions'],
  active: 'Active', invited: 'Invited',
  accept: 'Accept (demo)',
  accepted: (name) => `${name} accepted the invite`,
  resend: 'Resend',
  resent: 'Invite resent (pretend)',
  viewAs: 'View as (demo)',
  none: 'Not enrolled yet',
  errors: { name: 'Enter their name.', email: 'Enter an email address, like name@organisation.com.au.' },
};

export const MICRO = {
  lead: 'Short online units for your board and leaders. Learning is shared; each participant gets their own Ask Ali credits.',
  facts: (u) => `${u.weeks} weeks · ${u.format} · ${u.lessons.length} lessons · ${u.aliCredits} Ask Ali credits per participant`,
  price: '$1,500 first participant · $1,000 each additional',
  enrol: 'Enrol participants',
  enrolled: (n) => `${n} enrolled`,
  enrolTitle: (t) => `Enrol in ${t}`,
  choose: 'Who’s taking part?',
  chooseHint: 'Invited members get access when they accept.',
  summary: 'Price summary',
  first: 'First participant', additional: 'Additional participant',
  total: 'Total',
  credits: (n) => `Includes ${n} Ask Ali credits (8 per participant)`,
  pay: 'Pay and enrol (demo)',
  confirmTitle: 'Confirm Micro-Unit enrolment',
  done: (n, title, total) => `${n} enrolled in ${title} — ${total}`,
  doneText: 'They’ll see it in My learning, with their own Ask Ali credits.',
  needOne: 'Choose at least one participant.',
  already: 'Already enrolled',
};

export const CHECKS_PAGE = {
  lead: 'Add further checks as your organisation grows.',
  soon: 'Coming soon', available: 'Available',
  start: 'Start this check',
  startToast: 'Check started (pretend)',
  startText: 'In the full product this check opens inside your hub.',
};

export const MEMBER = {
  hello: (name) => `Hi ${name}`,
  lead: (lead, org) => `${lead} manages ${org}’s enrolments. Your Micro-Units and Ask Ali credits are your own.`,
  none: 'You’re not enrolled in a Micro-Unit yet. Your organisation’s lead can enrol you from the Enterprise hub.',
  credits: 'Your Ask Ali credits',
  unitProgress: (done, total) => `${done} of ${total} lessons complete`,
  lesson: (n) => `Lesson ${n}`,
  markDone: 'Mark lesson complete',
  locked: 'Opens after the previous lesson',
  complete: 'Micro-Unit complete',
  completeText: (title) => `${title} is complete. Your organisation’s lead can see it in the Enterprise hub.`,
  back: 'Back to the lead’s view (demo)',
  profileLead: 'Your details in this organisation.',
};
