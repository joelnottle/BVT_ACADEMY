// Lucide icons (pinned in index.html). Views emit <i data-lucide> placeholders;
// call renderIcons(root) after inserting markup to swap them for inline SVG.
import { esc } from '../util.js';

/** Decorative by default. Pass `label` when the icon carries meaning on its own. */
export function icon(name, { label } = {}) {
  return label
    ? `<i data-lucide="${esc(name)}" role="img" aria-label="${esc(label)}"></i>`
    : `<i data-lucide="${esc(name)}" aria-hidden="true"></i>`;
}

export function renderIcons(root = document) {
  // If the CDN is unreachable, icons simply don't render — every icon is paired with a text label.
  window.lucide?.createIcons({ root, attrs: { 'stroke-width': 1.5 } });
}
