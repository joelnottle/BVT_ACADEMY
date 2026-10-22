// Dashboard copy (BUILD_PLAN §8.4). Rules from §9: specific, forward-looking, never shame on time.

export const DASHBOARD = {
  greeting: (hour, name) => `${hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'}, ${name}`,
  resume: { title: 'Resume where you left off', action: 'Continue' },
  start: {
    title: 'Start here',
    action: 'Start',
    why: {
      'quick-wins': 'You chose quick wins: this one is already in place, so it only needs evidence.',
      'biggest-gaps': (area) => `You chose your biggest gap: ${area}.`,
      'choose-area': (area) => `You chose to start with ${area}.`,
      pathway: (title) => `Your ${title} comes first.`,
    },
  },
  attention: {
    title: 'Needs your attention',
    changes: (code) => `Almost there: ${code} needs one more thing`,
    evidence: (n) => `${n} in-place ${n === 1 ? 'item needs' : 'items need'} evidence`,
    review: (n) => `${n} ${n === 1 ? 'item is' : 'items are'} with a verifier`,
    session: (when, topic) => `Mentor session ${when} · ${topic}`,
    pathway: (title, done, total) => `${title}: ${done} of ${total} verified`,
    none: 'Nothing needs you right now. Pick up a recommendation below.',
  },
  readiness: {
    title: 'Readiness',
    claimed: (n) => `+${n} in place, awaiting evidence`,
    hint: 'Upload evidence for these and the hatched part turns solid.',
    all: 'See every requirement by area',
  },
  pace: { title: 'Your pace', days: (n) => `${n} days left`, toGo: (n) => `${n} to go`, action: 'Adjust plan' },
  accredited: { title: 'Accredited', text: (cert) => `Certificate ${cert}`, action: 'View accreditation' },
  ladder: { title: 'Your tier', note: 'Your tier is set at enrolment. Readiness counts verified requirements.' },
  recommended: { title: 'Recommended next', all: 'See everything by next action', done: 'Everything is verified. Your next step is in the Enterprise hub.' },
  areas: { title: 'Areas', locked: 'Unlocks after the pathway' },
  week: {
    title: 'This week',
    goal: (goalHrs, mins) => `Goal ${goalHrs}h · ${mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60 ? `${mins % 60}m ` : ''}` : `${mins}m `}done`,
    momentum: (n) => (n ? `Momentum: ${n} active ${n === 1 ? 'week' : 'weeks'}` : 'Momentum starts with your first active week'),
    action: 'Plan & pace',
  },
  recent: { title: 'Recent', none: 'Your verified requirements and milestones will show here.', all: 'All notifications' },
  ali: { title: 'Ask Ali', prompt: (thing) => `What does a good ${thing} look like?`, startPrompt: (code, title) => `Where do we start with ${code} ${title}?`, action: 'Ask' },
  locked: {
    title: (title) => `Your ${title} comes first`,
    text: (done, total) => `${done} of ${total} foundations verified. Your Core requirements unlock when the pathway is done. You can look through them any time.`,
    action: 'Open the pathway',
  },
};
