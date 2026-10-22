// Mentoring copy and booking rules (BUILD_PLAN §8.11). Mentors help organisations implement; they never verify.

export const MENTORING = {
  lead: 'Book a one-to-one with a BVT mentor for help putting any requirement in place.',
  note: 'Mentors help you implement. Verification is done by a separate, independent team.',
  credits: (n) => `${n} mentor ${n === 1 ? 'session' : 'sessions'} left`,
  how: 'Each session is 45 minutes online and uses one credit. Add prep notes so your mentor comes ready.',
  // TODO(client): mentor credit top-ups and prices (Doc 3, §14 Q6)
  outOf: 'You’ve used your mentor sessions. More can be added from Billing & credits.',
  book: 'Book a session',
  upcoming: 'Upcoming sessions',
  past: 'Past sessions',
  noUpcoming: 'No sessions booked. Book one whenever you’d like help.',
  noPast: 'Your completed sessions and your mentor’s notes appear here.',
  team: 'Mentor team',
  teamLead: 'BVT accredited specialists, led by our General Manager.',
  badge: 'BVT accredited specialist',
  prep: 'Your prep notes',
  prepNone: 'No prep notes yet.',
  mentorNotes: 'Mentor’s notes',
  editPrep: 'Edit prep notes',
  savePrep: 'Save notes',
  prepSaved: 'Prep notes saved',
  bookPage: {
    title: 'Book a mentor',
    topic: 'What would you like help with?',
    topicHint: 'Choose a requirement, or a topic module for broader help.',
    mentor: 'Choose a mentor',
    suggested: 'Suggested for this topic',
    yours: 'Your mentor',
    slot: 'Choose a time',
    slotHint: 'Times are AEST. Greyed-out times are already booked.',
    prep: 'Prep notes (optional)',
    prepHint: 'What you’ve tried, and what you’d like to leave the session with.',
    confirm: 'Book session',
    confirmTitle: 'Book this session?',
    confirmText: (who, when) => `${when} with ${who}. This uses one mentor credit.`,
    booked: (when, who) => `Session booked: ${when} with ${who}`,
    bookedText: 'It’s in Upcoming sessions. You can add prep notes any time before.',
    needTopic: 'Choose what you’d like help with.',
    needSlot: 'Choose a time.',
  },
};

// Which mentor suits which area (by specialty)
export const MENTOR_FOR_AREA = { GC: 'm-aisha', BD: 'm-aisha', FM: 'm-marcus', OH: 'm-ben', RC: 'm-mele', RP: 'm-mele' };

/* PLACEHOLDER — availability: a fixed pattern of already-booked slots so the grid looks real */
export const isSlotTaken = (mentorId, date, time) => {
  const n = [...`${mentorId}${date}${time}`].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return n % 3 === 0;
};
