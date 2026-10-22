// Small shared helpers. No DOM access here, so selectors and views can import freely.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape a value for safe interpolation into template-string HTML. */
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

let counter = 0;
/** Unique id for aria-labelledby, SVG pattern ids, etc. */
export const uid = (prefix = 'id') => `${prefix}-${++counter}`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Dates are ISO "YYYY-MM-DD" strings, handled in UTC so time zones never shift a day.
const toUTC = (iso) => {
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};
const fromUTC = (ms) => new Date(ms).toISOString().slice(0, 10);

/** "2027-12-08" → "8 Dec 2027" (CLAUDE.md date format). `weekday` → "Wed 8 Dec 2027". */
export function formatDate(iso, { weekday = false } = {}) {
  const ms = toUTC(iso);
  if (Number.isNaN(ms)) return '';
  const dt = new Date(ms);
  const base = `${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
  return weekday ? `${DAYS[dt.getUTCDay()]} ${base}` : base;
}

export const addDays = (iso, n) => fromUTC(toUTC(iso) + n * 86400000);

/** Whole days from a to b (positive when b is later). */
export const daysBetween = (a, b) => Math.round((toUTC(b) - toUTC(a)) / 86400000);

/** Calendar months, keeping the day where possible: addMonths('2027-03-08', 9) → '2027-12-08'. */
export function addMonths(iso, n) {
  const dt = new Date(toUTC(iso));
  dt.setUTCMonth(dt.getUTCMonth() + n);
  return fromUTC(dt.getTime());
}

/** Clamp a number into [min, max]. */
export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
