// Styleguide: contrast results, calculated live from tokens.css (WCAG 2.2 relative luminance).
import { icon, renderIcons } from '../../components/icon.js';
import { CONTRAST_PAIRS, MIN_RATIO } from './contrastPairs.js';
import { section } from './layout.js';

const KIND_LABEL = { text: 'Text ≥ 4.5', large: 'Large text ≥ 3', ui: 'Non-text ≥ 3', never: 'Not allowed' };

const rows = CONTRAST_PAIRS.map(([fg, bg, kind, use], i) => `
  <tr>
    <td data-label="Sample"><span class="sg-sample" style="color:var(${fg});background:var(${bg})">Aa</span></td>
    <td data-label="Pair"><span><code>${fg}</code><br><span class="text-3">on</span> <code>${bg}</code></span></td>
    <td data-label="Use">${use}</td>
    <td data-label="Rule">${KIND_LABEL[kind]}</td>
    <td data-label="Ratio" class="tabular" data-contrast-ratio="${i}">…</td>
    <td data-label="Result" data-contrast-result="${i}">…</td>
  </tr>`).join('');

const table = `
  <p class="text-2" data-contrast-summary aria-live="polite"></p>
  <div class="sg-table-wrap">
    <table class="sg-table">
      <caption class="sr-only">Contrast ratio for every allowed and forbidden colour pairing</caption>
      <thead><tr><th scope="col">Sample</th><th scope="col">Pair</th><th scope="col">Use</th><th scope="col">Rule</th><th scope="col">Ratio</th><th scope="col">Result</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;

export const contrastSection = () => section('contrast', 'Contrast results',
  'Every pairing the design system allows, plus the ones it forbids. Gradients are checked at both ends.', table);

// ---- WCAG maths ----
const channel = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const luminance = (hex) => {
  const [r, g, b] = hex.replace('#', '').match(/../g).map((x) => channel(parseInt(x, 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrastRatio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

export function bindContrast(root) {
  const cs = getComputedStyle(document.documentElement);
  const read = (t) => cs.getPropertyValue(t).trim();
  let failures = 0;
  let allowed = 0;

  CONTRAST_PAIRS.forEach(([fg, bg, kind], i) => {
    const ratioCell = root.querySelector(`[data-contrast-ratio="${i}"]`);
    const resultCell = root.querySelector(`[data-contrast-result="${i}"]`);
    const [a, b] = [read(fg), read(bg)];
    if (!/^#[0-9a-f]{6}$/i.test(a) || !/^#[0-9a-f]{6}$/i.test(b)) {
      ratioCell.textContent = 'n/a';
      return;
    }
    const ratio = contrastRatio(a, b);
    const pass = ratio >= MIN_RATIO[kind];
    ratioCell.textContent = `${ratio.toFixed(2)}:1`;
    if (kind === 'never') {
      resultCell.innerHTML = `<span class="chip chip--st-locked">${icon('ban')}Forbidden — not used</span>`;
      return;
    }
    allowed += 1;
    if (!pass) failures += 1;
    resultCell.innerHTML = pass
      ? `<span class="chip chip--st-verified">${icon('circle-check')}Pass</span>`
      : `<span class="chip chip--st-changes">${icon('circle-alert')}Fails</span>`;
  });

  const summary = root.querySelector('[data-contrast-summary]');
  if (summary) {
    summary.textContent = failures
      ? `${failures} of ${allowed} allowed pairings fail. Fix the tokens before using them.`
      : `All ${allowed} allowed pairings pass WCAG 2.2 AA.`;
  }
  renderIcons(root.querySelector('.sg-table'));
}
