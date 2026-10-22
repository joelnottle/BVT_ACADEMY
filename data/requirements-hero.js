// The three hero requirements, fully written (BUILD_PLAN §10):
// FM-04 (not yet in place, full loop) · GC-01 (already in place, upload only) · GC-02 (changes requested).

export const HERO = {
  'FM-04': {
    required: 'A rolling 12-month cash flow forecast, updated every month, showing expected money in and out. Assumptions are noted, and the board or owner has reviewed it in the last quarter.',
    why: 'Lenders, funders and tender panels want to see that you can spot a cash shortfall months before it happens, and act on it. A current forecast is one of the first things a lender asks for.',
    goodEvidence: [
      'Your current forecast (a spreadsheet or an export from your accounting system) covering the next 12 months',
      'At least the last two monthly updates, so the verifier can see it is kept current',
      'A board or owner minute, or email, showing the forecast was reviewed in the last quarter',
    ],
    commonReturns: [
      'The forecast covers fewer than 12 months',
      'No sign it has been updated recently',
      'Assumptions, such as grant timing or wage increases, are not stated',
      'No evidence the board or owner reviewed it',
    ],
    checklist: ['Choose a forecast template', 'Load 12 months of actuals', 'Project 12 months forward', 'Have it reviewed by the board or owner'],
    video: { title: 'Why cash flow forecasting matters', mins: 6 },
    transcript: 'Cash flow is the timing of money, not just the amount. A forecast lets you see the months where more goes out than comes in, so you can move a payment, draw on a reserve or talk to your bank early — before it becomes a crisis.',
    aliPrompts: ['How far ahead should our forecast go?', 'What does good evidence look like for this?', 'Explain this to my board in plain English'],
  },
  'GC-01': {
    required: 'A copy of your current constitution or rules, including every amendment, as lodged with your regulator (ASIC, the ACNC or your state regulator).',
    why: "Funders and procurement panels check that you are properly constituted, and that the people signing contracts have the authority to do so. It's usually the first document they ask for.",
    goodEvidence: [
      'The full current constitution, including all amendments',
      "Your regulator's register entry or lodgement receipt showing it is current",
      'If it was amended recently, the minute or special resolution approving the change',
    ],
    commonReturns: [
      'A draft or unsigned version was uploaded',
      'Amendments are missing',
      'The organisation name differs from your ABN record',
    ],
    checklist: ['Find the latest version, including amendments', 'Check it matches your regulator record', 'Upload the full document'],
    video: { title: 'What your constitution does for you', mins: 5 },
    transcript: 'Your constitution sets out who can make decisions and how. Funders read it to confirm that the people signing an agreement have the authority to sign.',
    aliPrompts: ['Which version of our constitution should we upload?', 'Do we need to include amendments?', 'What if our name has changed?'],
  },
  'GC-02': {
    required: 'A register listing every director and their declared interests, reviewed at a board meeting in the last 12 months, with a signed declaration from each director.',
    why: 'Conflicts of interest are a top concern for funders and government buyers. A current register shows that decisions are made in the organisation’s interest, not a director’s.',
    goodEvidence: [
      'The register, listing all directors and their declared interests',
      'The board minute where the register was reviewed, within the last 12 months',
      'A signed declaration from each director',
    ],
    commonReturns: [
      'Signed declarations are missing',
      'A current director is missing from the register',
      'No board review in the last 12 months',
    ],
    checklist: ['List every director and their interests', 'Table the register at a board meeting', 'Collect a signed declaration from each director'],
    video: { title: 'Managing conflicts of interest', mins: 7 },
    transcript: 'A conflict of interest is not wrongdoing in itself. What matters is that it is declared, recorded and managed — for example, the director steps out of the decision.',
    aliPrompts: ['What should a declaration of interests include?', 'How often should the board review the register?', 'Draft a one-page declaration form'],
  },
};
