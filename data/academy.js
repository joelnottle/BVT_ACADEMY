// Academy lenses and module page copy (BUILD_PLAN §8.5–8.6).

export const ACADEMY = {
  title: 'Academy',
  lenses: [
    { id: 'area', label: 'By area', icon: 'map', lead: 'Every requirement, grouped by area and topic module.' },
    { id: 'action', label: 'By next action', icon: 'list-checks', lead: 'What to do next, by where each requirement is up to.' },
    { id: 'topic', label: 'By topic', icon: 'book-open', lead: 'The learning library. Each module serves 2–5 related requirements.' },
  ],
  search: { label: 'Search requirements and modules', placeholder: 'Search by code, title or topic' },
  filters: {
    title: 'Filters',
    type: { label: 'Type', options: [['in-place', 'Already in place'], ['not-yet', 'Not yet in place']] },
    status: { label: 'Status' },
    effort: { label: 'Effort', options: [['short', 'Under 1 hour'], ['medium', '1–2 hours'], ['long', '3 hours or more']] },
    area: { label: 'Area', all: 'All areas' },
    format: { label: 'Format', options: [['video', 'Videos'], ['session', 'Topic sessions'], ['template', 'Templates']] },
    clear: 'Clear filters',
    showing: (n, total, noun = 'requirements') => `Showing ${n} of ${total} ${noun}`,
  },
  // Board columns (§8.5): "To start" is the not-started status
  columns: [
    ['not-started', 'To start'], ['learning', 'Learning & implementing'], ['evidence-needed', 'Evidence needed'],
    ['in-review', 'In review'], ['changes', 'Changes requested'], ['verified', 'Verified'],
  ],
  views: [{ id: 'board', label: 'Board', icon: 'columns-3' }, { id: 'list', label: 'List', icon: 'list' }],
  noBoardDrag: 'Status changes come from what you do on each requirement, so this board always matches reality.',
  emptyColumn: 'Nothing here right now',
  noMatch: { title: 'No requirements match', text: 'Try fewer filters, or a different search.' },
  noModules: { title: 'No modules match', text: 'Try a different area or format.' },
  locked: (title) => `Your Core requirements unlock once your ${title} is verified. You can look through them any time.`,
  pathwayGroup: 'Pathway first',
  topic: {
    continue: 'Continue learning',
    gaps: 'Recommended for your gaps',
    all: 'All modules',
    serves: (n) => `Serves ${n} ${n === 1 ? 'requirement' : 'requirements'}`,
  },
  module: {
    shared: 'Learning is shared. What you implement and upload is specific to each requirement.',
    serves: 'Requirements this module serves',
    watch: 'Watch', learn: 'Learn', download: 'Download',
    watchAction: 'Mark as watched', watched: 'Watched',
    sessionAction: 'Mark as viewed', viewed: 'Viewed',
    downloadAction: 'Download', downloaded: 'Downloaded',
    askAli: 'Ask Ali about this module',
    bookMentor: 'Book a mentor for this topic',
    learningLine: (pct, done, total) => `Learning ${pct}% · Evidence ${done} of ${total} verified`,
    lockedNote: 'This module’s requirements unlock after your pathway. You can preview the learning now.',
  },
};
