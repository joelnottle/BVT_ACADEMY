// Back-office copy (BUILD_PLAN §8.16–8.17). Verifiers decide; mentors help and never verify.

export const QUEUE = {
  lead: 'Evidence waiting for an independent decision. Oldest first.',
  waiting: (n) => `${n} waiting`,
  filters: { type: 'Type', all: 'All types', mine: 'Assigned to me' },
  types: { 'in-place': 'Already in place', implemented: 'Implemented', resubmission: 'Resubmission' },
  cols: ['Requirement', 'Organisation', 'Waiting', 'Ali pre-check', ''],
  // TODO(client): confirm the verification SLA (§14 Q5). Prototype: 5 business days ≈ 7 calendar days.
  sla: (days) => {
    const d = `${days} ${days === 1 ? 'day' : 'days'}`;
    return days <= 3 ? { label: `${d} · on track`, icon: 'circle-check', tone: 'ok' } : days <= 6 ? { label: `${d} · due soon`, icon: 'clock', tone: 'soon' } : { label: `${d} · over target`, icon: 'triangle-alert', tone: 'over' };
  },
  fast: 'Fast-tracked',
  conflict: 'You mentored this organisation',
  precheck: (pass, total) => `${pass} of ${total} checks found`,
  open: 'Review',
  none: 'Nothing waiting. Every item has a decision.',
  noneMine: 'Nothing assigned to you.',
};

export const REVIEW = {
  criteria: 'What the verifier checks',
  criteriaHint: 'Tick each criterion the evidence meets.',
  orgNote: 'Note from the organisation',
  noNote: 'No note added.',
  fastTracked: 'The organisation went straight to evidence without the learning steps. Check their understanding is evident.',
  history: 'Submission history',
  evidence: 'Evidence',
  noEvidence: 'Sample document (prototype)',
  previewNote: 'Prototype preview — no real document is stored.',
  precheck: 'Ali pre-check',
  precheckTag: 'A suggestion — you decide',
  precheckNote: 'Ali reads the documents for the criteria. It can miss things, so check each one yourself.',
  decision: 'Your decision',
  template: 'Comment template',
  comment: 'Comment to the organisation',
  commentHint: 'Specific and constructive. For changes, say exactly what to add.',
  needComment: 'Add a comment saying exactly what to add.',
  verify: 'Verify',
  changes: 'Request changes',
  confirmVerify: 'Verify this requirement?',
  confirmChanges: 'Send “Almost there”?',
  confirmText: (org) => `${org} will see your decision and comment straight away.`,
  assign: 'Assign to me', unassign: 'Unassign me',
  conflictTitle: 'You’ve mentored this organisation, so another verifier must decide.',
  conflictText: 'Decisions are blocked to keep verification independent. You can still read the evidence.',
  decided: (kind, who, on) => `${kind === 'verified' ? 'Verified' : 'Changes requested'} by ${who} on ${on}.`,
  done: (code, kind) => (kind === 'verified' ? `${code} verified` : `“Almost there” sent for ${code}`),
  doneText: 'The organisation has been notified.',
  next: 'Next in the queue',
  back: 'Back to the queue',
};

export const HISTORY = {
  lead: 'Every verification decision, newest first.',
  cols: ['Decided', 'Requirement', 'Organisation', 'Decision', 'Verifier', 'Comment'],
  mine: 'My decisions only',
};

export const MENTOR_VIEW = {
  weekLead: 'Your sessions this week. Mentors help organisations implement — verification is done by a separate, independent team.',
  noVerify: 'Mentors never verify evidence. If you’re asked to, point the organisation to the Verify step.',
  none: 'No sessions this week.',
  upcoming: 'Upcoming', done: 'Completed',
  open: 'Open session',
  askAli: 'Ask Ali (mentor)',
  menteesLead: 'Organisations you mentor.',
  menteeCols: ['Organisation', 'Tier', 'Verified readiness', 'Topics booked', 'Next session'],
  session: {
    prep: 'Prep notes from the organisation',
    noPrep: 'No prep notes yet.',
    context: 'Requirement context',
    notes: 'Your session notes',
    notesHint: 'Shared with the organisation after the session.',
    save: 'Save notes',
    saved: 'Notes saved',
    complete: 'Mark complete',
    completed: 'Session completed',
    completedText: (org) => `${org} can see your notes on their Mentoring page.`,
    isDone: 'This session is complete.',
  },
};
