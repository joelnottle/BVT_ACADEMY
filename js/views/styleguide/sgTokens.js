// Styleguide: colour tokens, typography, spacing/radius/shadow.
import { section, panel } from './layout.js';

const COLOUR_GROUPS = [
  ['Navy (chrome)', ['--navy-950', '--navy-900', '--navy-800', '--navy-700', '--navy-600']],
  ['Brand', ['--pink-500', '--orange-400', '--magenta-500', '--magenta-text-on-dark', '--accent-text']],
  ['Vital Consult accents', ['--plum-600', '--plum-700', '--crimson-500', '--crimson-600', '--peach-300', '--cream-200', '--cream-100', '--cream-50']],
  ['Gradients', ['--grad-action', '--grad-brand', '--grad-brand-dark', '--grad-warm', '--grad-vc-bar']],
  ['Light work surface', ['--surface-0', '--surface-1', '--surface-2', '--border', '--border-input', '--text-1', '--text-2', '--text-3']],
  ['On dark', ['--on-dark-1', '--on-dark-2', '--on-dark-3']],
  ['Status', ['--st-not-started', '--st-learning', '--st-evidence', '--st-review', '--st-changes', '--st-verified', '--st-locked']],
  ['Status tints', ['--st-not-started-bg', '--st-learning-bg', '--st-evidence-bg', '--st-review-bg', '--st-changes-bg', '--st-verified-bg']],
  ['Status ink (chip text)', ['--st-not-started-ink', '--st-learning-ink', '--st-evidence-ink', '--st-review-ink', '--st-changes-ink', '--st-verified-ink']],
  ['Tiers', ['--tier-foundation', '--tier-core', '--tier-advanced', '--tier-ready', '--tier-accredited']],
];

const swatch = (token) => `
  <li class="sg-swatch">
    <span class="sg-swatch__chip" style="background:var(${token})"></span>
    <code class="sg-swatch__name">${token}</code>
    <span class="sg-swatch__value text-3" data-token-value="${token}"></span>
  </li>`;

const colours = COLOUR_GROUPS.map(([name, tokens]) => `
  <div class="stack stack-sm">
    <h3 class="h4">${name}</h3>
    <ul class="sg-swatches">${tokens.map(swatch).join('')}</ul>
  </div>`).join('');

const SIZES = [56, 40, 32, 24, 20, 18, 17, 16, 14, 12];
const typeScale = SIZES.map((s) => `
  <li class="sg-type-row">
    <code class="text-3">--fs-${s}</code>
    <span style="font-size:var(--fs-${s});font-family:${s >= 24 ? 'var(--font-display)' : 'var(--font-body)'};font-weight:${s >= 24 ? 'var(--fw-light)' : 'var(--fw-regular)'};line-height:var(--lh-tight)">
      ${s >= 24 ? 'Have you pre-qualified?' : 'Monthly cash flow forecast'}
    </span>
  </li>`).join('');

const type = `
  <div class="sg-grid-2">
    ${panel(`
      <div class="stack">
        <p class="eyebrow">Eyebrow · Prequalified. Accredited. Connected.</p>
        <p class="h1">H1 · Montserrat 300</p>
        <p class="h2">H2 · Montserrat 300</p>
        <p class="h3">H3 · Montserrat 400</p>
        <p class="h4">H4 · Inter 600</p>
        <p class="lead">Lead · Inter 400, 18px, text-2.</p>
        <p>Body · Inter 400, 16px. <a href="#/styleguide/type">Inline link uses --accent-text</a>.</p>
        <p class="text-3">Meta · 14px, text-3 · Updated 8 Dec 2027</p>
        <div class="prose">
          <p><strong>Learning prose</strong> · 17px, 1.6 line-height, max 72ch. A cash flow forecast projects
          money in and out over the next 12 months, so the board can see shortfalls before they happen.</p>
        </div>
      </div>`)}
    ${panel(`
      <div class="stack">
        <p class="eyebrow">Eyebrow on dark</p>
        <p class="h1">Have you pre-qualified your business?</p>
        <p class="lead">Lead on dark uses --on-dark-2.</p>
        <p>Body on dark. <a href="#/styleguide/type">Link on dark uses --orange-400</a>.</p>
        <p class="text-3">Meta on dark uses --on-dark-3</p>
      </div>`, { dark: true })}
  </div>
  <h3 class="h4">Scale</h3>
  <ul class="sg-type-scale">${typeScale}</ul>`;

const SPACES = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20];
const shape = `
  <div class="sg-grid-3">
    <div class="stack stack-sm">
      <h3 class="h4">Spacing</h3>
      <ul class="sg-spaces">${SPACES.map((n) => `<li><code class="text-3">--sp-${n}</code><span class="sg-space" style="width:var(--sp-${n})"></span></li>`).join('')}</ul>
    </div>
    <div class="stack stack-sm">
      <h3 class="h4">Radius</h3>
      <ul class="sg-radii">${['sm', 'md', 'lg', 'pill'].map((r) => `<li><span class="sg-radius" style="border-radius:var(--r-${r})"></span><code class="text-3">--r-${r}</code></li>`).join('')}</ul>
    </div>
    <div class="stack stack-sm">
      <h3 class="h4">Depth</h3>
      <div class="sg-shadow" style="box-shadow:var(--shadow-1)"><code>--shadow-1</code> cards</div>
      <div class="sg-shadow" style="box-shadow:var(--shadow-2)"><code>--shadow-2</code> overlays</div>
      <div class="sg-shadow sg-shadow--dark"><code>--border-on-dark</code> hairline, no shadow</div>
    </div>
  </div>`;

export const tokensSections = () => [
  section('colours', 'Colour tokens', 'All raw colours live in <code>css/tokens.css</code>. Values are read live from the stylesheet.', colours),
  section('type', 'Typography', 'Montserrat for display (300/400), matching Vital Consult. Inter for UI and learning text (400/500/600).', type),
  section('shape', 'Spacing, radius & depth', 'Soft, low, diffuse shadows on light. A 1px hairline instead of shadows on dark.', shape),
].join('');

/** Fill in each swatch's resolved value from the live stylesheet. */
export function bindTokens(root) {
  const cs = getComputedStyle(document.documentElement);
  root.querySelectorAll('[data-token-value]').forEach((el) => {
    const v = cs.getPropertyValue(el.dataset.tokenValue).trim();
    el.textContent = v.startsWith('linear-gradient') ? 'gradient' : v;
  });
}
