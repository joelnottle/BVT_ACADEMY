// Small shared helpers. No DOM access here, so selectors and views can import freely.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape a value for safe interpolation into template-string HTML. */
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

let counter = 0;
/** Unique id for aria-labelledby, SVG pattern ids, etc. */
export const uid = (prefix = 'id') => `${prefix}-${++counter}`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2027-12-08" → "8 Dec 2027" (CLAUDE.md date format). */
export function formatDate(iso) {
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return '';
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Clamp a number into [min, max]. */
export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
