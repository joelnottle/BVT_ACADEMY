// Every text/background (and UI/background) pairing the design system allows, plus the ones it
// forbids. Ratios are calculated live from tokens.css on #/styleguide/contrast.
// kind: 'text' ≥ 4.5 · 'large' ≥ 3 (≥ 24px, or ≥ 18.66px bold) · 'ui' ≥ 3 (WCAG 1.4.11) · 'never' = documented fail, not used.

export const MIN_RATIO = { text: 4.5, large: 3, ui: 3, never: 4.5 };

export const CONTRAST_PAIRS = [
  // Light work surface
  ['--text-1', '--surface-0', 'text', 'Body text on cards'],
  ['--text-1', '--surface-1', 'text', 'Body text on canvas'],
  ['--text-1', '--surface-2', 'text', 'Text on subtle fills'],
  ['--text-2', '--surface-0', 'text', 'Secondary text'],
  ['--text-2', '--surface-1', 'text', 'Secondary text on canvas'],
  ['--text-2', '--surface-2', 'text', 'Secondary text on fills'],
  ['--text-3', '--surface-0', 'text', 'Meta text'],
  ['--text-3', '--surface-1', 'text', 'Meta text on canvas'],
  ['--text-3', '--surface-2', 'text', 'Meta text on fills'],
  ['--accent-text', '--surface-0', 'text', 'Links, eyebrows'],
  ['--accent-text', '--surface-1', 'text', 'Links on canvas'],
  ['--accent-text', '--surface-2', 'text', 'Links on fills'],
  ['--surface-0', '--text-1', 'text', 'Selected filter chip'],
  // Action gradient (both ends checked)
  ['--on-action', '--act-start', 'text', 'Button text, gradient start'],
  ['--on-action', '--act-end', 'text', 'Button text, gradient end'],
  // Status chips: ink on tint
  ['--st-not-started-ink', '--st-not-started-bg', 'text', 'Not started chip'],
  ['--st-learning-ink', '--st-learning-bg', 'text', 'Learning & implementing chip'],
  ['--st-evidence-ink', '--st-evidence-bg', 'text', 'Evidence needed chip'],
  ['--st-review-ink', '--st-review-bg', 'text', 'In review chip'],
  ['--st-changes-ink', '--st-changes-bg', 'text', 'Changes requested chip'],
  ['--st-verified-ink', '--st-verified-bg', 'text', 'Verified chip'],
  ['--st-locked-ink', '--st-locked-bg', 'text', 'Locked chip'],
  ['--st-changes-ink', '--surface-0', 'text', 'Field error message'],
  ['--st-evidence-ink', '--surface-0', 'text', 'Placeholder flag'],
  // Dark frame
  ['--on-dark-1', '--navy-950', 'text', 'Primary text on darkest'],
  ['--on-dark-1', '--navy-900', 'text', 'Primary text on sidebar/header'],
  ['--on-dark-1', '--navy-800', 'text', 'Primary text on dark cards'],
  ['--on-dark-1', '--navy-700', 'text', 'Active nav item, CTA bands'],
  ['--on-dark-2', '--navy-900', 'text', 'Secondary on sidebar'],
  ['--on-dark-2', '--navy-800', 'text', 'Secondary on dark cards'],
  ['--on-dark-2', '--navy-700', 'text', 'Secondary on active item'],
  ['--on-dark-3', '--navy-900', 'text', 'Meta on sidebar'],
  ['--on-dark-3', '--navy-800', 'text', 'Meta on dark cards'],
  ['--on-dark-3', '--navy-700', 'text', 'Meta on active item'],
  ['--orange-400', '--navy-900', 'text', 'Highlights, links on dark'],
  ['--orange-400', '--navy-800', 'text', 'Highlights on dark cards'],
  ['--orange-400', '--navy-700', 'text', 'Highlights on active item'],
  ['--magenta-text-on-dark', '--navy-950', 'text', 'Eyebrows on hero'],
  ['--magenta-text-on-dark', '--navy-900', 'text', 'Eyebrows on dark'],
  ['--magenta-text-on-dark', '--navy-800', 'text', 'Eyebrows on dark cards'],
  ['--pink-500', '--navy-900', 'large', 'Large pink display text on dark'],
  ['--magenta-500', '--navy-900', 'large', 'Large magenta display text on dark'],
  // Non-text (UI components, focus, graphics)
  ['--border-input', '--surface-0', 'ui', 'Input and checkbox edges'],
  ['--border-input', '--surface-1', 'ui', 'Input edges on canvas'],
  ['--focus-light', '--surface-0', 'ui', 'Focus ring on light'],
  ['--focus-light', '--surface-1', 'ui', 'Focus ring on canvas'],
  ['--focus-dark', '--navy-900', 'ui', 'Focus ring on dark'],
  ['--focus-dark', '--navy-800', 'ui', 'Focus ring on dark cards'],
  ['--tier-foundation', '--surface-0', 'ui', 'Foundation tier marker'],
  ['--tier-core', '--surface-0', 'ui', 'Core tier marker'],
  ['--tier-advanced', '--surface-0', 'ui', 'Advanced tier marker'],
  ['--tier-ready', '--surface-0', 'ui', 'Ready tier marker'],
  ['--st-verified', '--surface-0', 'ui', 'Done step marker, connectors'],
  ['--accent-text', '--surface-2', 'ui', 'Hatched "claimed" arc on ring track'],
  ['--pink-500', '--surface-0', 'ui', 'Decorative pink on light'],
  // Forbidden for text — listed so the rule is visible
  ['--on-action', '--brand-end', 'never', 'White text on --grad-brand (use --grad-action)'],
  ['--pink-500', '--surface-0', 'never', 'Pink as small text on light (use --accent-text)'],
  ['--magenta-500', '--navy-900', 'never', 'Magenta as small text on dark (use --magenta-text-on-dark)'],
  ['--tier-foundation', '--surface-0', 'never', 'Foundation grey as text'],
  ['--border', '--surface-0', 'never', '--border as a control edge (decorative dividers only)'],
];
