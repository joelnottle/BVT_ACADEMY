// Ask Ali scripted answers (BUILD_PLAN §8.10). Keyword-matched, canned — no AI is called.
// Each answer costs 0.25 credits in the prototype (Phase 9). Ali offers guidance; it never verifies evidence.
/* PLACEHOLDER — answers are illustrative; BVT to review the guidance before any production use. */

export const ALI_SCRIPTS = [
  { id: 'forecast-horizon', keywords: ['how far', 'forecast', 'ahead', 'months'], reqIds: ['FM-04'],
    answer: 'Most lenders and funders expect a rolling 12-month forecast, updated monthly. Each month, replace the oldest month with actuals and add a new month at the end. Note your assumptions — for example, when grant instalments land — so the board can see why the numbers move.' },
  { id: 'good-evidence', keywords: ['good evidence', 'evidence look', 'what to upload', 'upload'],
    answer: 'Good evidence shows three things: the document itself, that it is current (dated within the last 12 months), and that it is used or approved — usually a board minute or an email from the owner. Check the "What good evidence looks like" list on the requirement before you upload.' },
  { id: 'plain-english', keywords: ['plain english', 'explain', 'board'],
    answer: 'In plain English: this requirement asks whether the organisation can show, on paper, that it does what it says it does. For your board, frame it as "what a funder would ask to see, and whether we could hand it over tomorrow".' },
  { id: 'risk-register', keywords: ['risk register', 'risk'], reqIds: ['RC-01', 'RC-03', 'RC-04'],
    answer: 'A good risk register lists each key risk, who owns it, how likely and serious it is, the controls in place, and what you will do next. Ten to fifteen well-described risks beat a hundred vague ones. The board should review it at least once a year.' },
  { id: 'declarations', keywords: ['declaration', 'conflict', 'interest'], reqIds: ['GC-02'],
    answer: 'A declaration of interests is a short signed form: the director’s name, any roles, shareholdings or relationships that could conflict with the organisation, and the date. Ask each director to sign one at least annually and when anything changes, and keep them with the register.' },
  { id: 'constitution', keywords: ['constitution', 'amendment', 'rules'], reqIds: ['GC-01', 'GC-07'],
    answer: 'Upload the full current constitution including every amendment — the version your regulator holds. If you have changed it recently, add the special resolution or minute that approved the change.' },
  { id: 'budget-actual', keywords: ['budget', 'variance', 'actual'], reqIds: ['FM-03', 'FM-05'],
    answer: 'For budget vs actual, show the board three columns — budget, actual, difference — and a sentence on any line that is more than about 10% out. The conversation about why matters more than the spreadsheet.' },
  { id: 'minutes', keywords: ['minutes', 'meeting', 'quarterly'], reqIds: ['BD-04'],
    answer: 'Minutes should record who attended, the decisions made and any conflicts declared — not every word said. Have the chair sign them once they are confirmed at the next meeting.' },
  { id: 'induction', keywords: ['induction', 'onboarding', 'new staff'], reqIds: ['OH-02', 'BD-03'],
    answer: 'A simple induction checklist works well: the code of conduct, WHS basics, key policies, systems access and who to ask for help. Have the new starter and their manager sign it off.' },
  { id: 'privacy', keywords: ['privacy', 'personal information'], reqIds: ['RP-08', 'RP-13'],
    answer: 'Your privacy policy should explain what personal information you collect, why, how you store and share it, and how people can access or correct it. Keep it short and publish it where people can find it.' },
  { id: 'whs', keywords: ['whs', 'safety', 'health'], reqIds: ['OH-04', 'OH-05'],
    answer: 'Start with a one-page WHS policy signed by the chair, then a risk assessment of your actual work: what could hurt someone, how likely it is, and what you do about it. Review it each year or after any incident.' },
  { id: 'insurance', keywords: ['insurance', 'cover'], reqIds: ['OH-07', 'SU-07'],
    answer: 'Most organisations need public liability, workers compensation and professional indemnity, and often directors and officers cover. Review it annually against your risk register so the cover matches the risks.' },
  { id: 'delegations', keywords: ['delegation', 'approve spending', 'authority'], reqIds: ['FM-08'],
    answer: 'A delegations schedule is a table: who can approve what, and up to how much. Three or four levels are usually enough — for example staff, manager, CEO and board — and the board adopts it.' },
  { id: 'succession', keywords: ['succession', 'key person'], reqIds: ['RC-06'],
    answer: 'For key-person risk, write down what only one person knows: passwords and systems, key contacts, regular deadlines. Then name who would step in and what they would need. That alone covers most of the risk.' },
  { id: 'time', keywords: ['deadline', 'extension', 'time', 'finish in time'],
    answer: 'If time is tight, you can re-plan your remaining time without losing anything, or extend by one month or three from Plan & pace. Quick wins — in-place items that only need evidence — are the fastest way back on pace.' },
  { id: 'verification', keywords: ['verify', 'verification', 'how long', 'review'],
    answer: 'Once you submit, an independent verifier reviews your evidence — usually within 5 business days. If they need anything more, you will see "Almost there" with exactly what to add. Mentors and Ali can help you prepare, but never verify.' },
  { id: 'credits', keywords: ['credit', 'credits', 'how does ali'],
    answer: 'Each package includes Ask Ali credits. One credit is about an hour of typical use. You can see your balance in the header and top up any time from Billing & credits.' },
  { id: 'mentor', keywords: ['mentor', 'book', 'session'],
    answer: 'You can book a mentor from any requirement or from Mentoring. Choose a topic, pick a time and add prep notes so your mentor can come ready. Each session uses one mentor credit.' },
];

export const ALI_FALLBACK = "I don't have a scripted answer for that in this prototype. Try asking what good evidence looks like, how to explain this to your board, or about a specific requirement such as a risk register or cash flow forecast.";

export const ALI_DEFAULT_PROMPTS = ['What does good evidence look like for this?', 'Where do we start?', 'Explain this to my board in plain English'];

export const ALI_CREDIT_PER_ANSWER = 0.25;

// ---- Seeded history (persona A) and UI copy (§8.10) ----
// Each entry is one question and Ali's answer. reqId null = a general question.
export const ALI_HISTORY_SEED = {
  'org-kestrel': [
    { id: 'ali-k1', reqId: 'FM-03', on: '2027-04-14', q: 'How should we present a deficit budget to the board?', scriptId: 'budget-actual', pinned: false },
    { id: 'ali-k2', reqId: 'FM-04', on: '2027-04-28', q: 'How far ahead should our forecast go?', scriptId: 'forecast-horizon', pinned: true },
    { id: 'ali-k3', reqId: 'GC-02', on: '2027-04-29', q: 'What should a declaration of interests include?', scriptId: 'declarations', pinned: false },
    { id: 'ali-k4', reqId: null, on: '2027-04-30', q: 'How long does verification take?', scriptId: 'verification', pinned: false },
  ],
};

/* PLACEHOLDER — top-up bundles; prices come from Doc 3 (BUILD_PLAN §14 Q6) */
export const ALI_TOPUPS = [5, 10, 20];

export const ALI_UI = {
  title: 'Ask Ali',
  context: (code, title) => `About ${code} · ${title}`,
  moduleContext: (title) => `About ${title}`,
  removeContext: 'Remove context',
  suggested: 'Try asking',
  placeholder: 'Ask about a requirement, evidence or your board',
  send: 'Ask',
  typing: 'Ali is typing',
  you: 'You',
  ali: 'Ali',
  pin: (code) => `Pin to ${code} notes`,
  pinned: 'Pinned to notes',
  pinnedToast: (code) => `Saved to ${code} notes`,
  low: (c) => `Running low: ${c} credits left. Top up any time.`,
  out: 'You’ve used your Ask Ali credits. Top up to keep asking.',
  topUp: 'Top up',
  topUpTitle: 'Top up Ask Ali credits',
  topUpPrice: 'Price to be confirmed (Doc 3)',
  topUpNote: 'Prototype — no payment is taken.',
  topUpToast: (n) => `Added ${n} Ask Ali credits`,
  history: 'See all conversations',
  page: {
    lead: 'Your questions and Ali’s answers, grouped by requirement. Pin the useful ones to that requirement’s notes.',
    ask: 'Ask a question',
    saved: 'Saved answers',
    savedNone: 'Pin an answer and it shows here, and in that requirement’s notes.',
    general: 'General questions',
    none: 'No conversations yet. Ask Ali anything about a requirement or your evidence.',
    credits: 'Your credits',
  },
};
