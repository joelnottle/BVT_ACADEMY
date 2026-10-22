// Styleguide: Vital Consult accents — two-tone headings, crimson rule, cream surfaces,
// crimson strip, gradient line icons, top bar and warm wash. Dark frame stays; these are highlights.
import { icon } from '../../components/icon.js';
import { section, pair, example } from './layout.js';

const STEPS = [
  ['clipboard-check', '1 · Check', 'Free pre-qualification check. Get your score and tier.'],
  ['book-open', '2 · Academy', 'Close each requirement with learning, Ask Ali and mentors.'],
  ['shield-check', '3 · Accreditation', 'Evidence independently verified. Certificate issued.'],
  ['building', '4 · Connect', 'Listed in the directory funders and buyers search.'],
];

const headings = pair(
  `<div class="stack">
    ${example('Two-tone heading + crimson rule', '<p class="h2 rule">Start anywhere. Close every <span class="accent">requirement</span>.</p>')}
    ${example('Eyebrow in plum', '<p class="eyebrow">How the Academy works</p>')}
  </div>`,
  `<div class="stack">
    ${example('On dark: crimson word at display size only', '<p class="h2 rule">Have you <span class="accent">pre-qualified</span> your business?</p>')}
    ${example('Eyebrow on dark', '<p class="eyebrow">Prequalified. Accredited. Connected.</p>')}
  </div>`,
);

const surfaces = `
  <div class="sg-grid-2">
    <article class="card card--highlight">
      <p class="eyebrow">Resume where you left off</p>
      <h3 class="card__title">FM-04 · Monthly cash flow forecast</h3>
      <p class="card__meta">Financial Management · Step 4 of 7: Do it</p>
      <div class="card__footer"><a class="btn btn--action" href="#/styleguide/accents">Continue ${icon('arrow-right')}</a></div>
    </article>
    <div class="sg-band band-cream stack">
      <p class="eyebrow">Cream band</p>
      <p class="h3">Section backgrounds on the public site, the certificate and results summaries.</p>
    </div>
  </div>
  ${example('Crimson feature strip with white line icons', `
    <div class="card card--crimson sg-strip">
      ${STEPS.map(([i, t, d]) => `<div class="stack stack-sm"><span class="sg-strip__icon">${icon(i)}</span><p class="card__title">${t}</p><p class="card__meta">${d}</p></div>`).join('')}
    </div>`)}
  ${example('Gradient line icons (large, no tile)', `<div class="cluster">${['sparkles', 'users', 'shield-check', 'award', 'route'].map((i) => `<span class="icon-tile">${icon(i)}</span>`).join('')}</div>`)}
  <div class="sg-grid-2">
    ${example('Top bar (--grad-vc-bar)', '<div class="sg-vc-bar"></div>')}
    ${example('Warm wash (--grad-warm)', '<div class="sg-wash band-warm"></div>')}
  </div>`;

export const accentsSection = () => section('accents', 'Brand accents',
  'Vital Consult plum, crimson and cream used as highlights. The dark frame and light work surfaces stay; one warm focal point per screen.',
  `${headings}<div class="sg-panel stack stack-lg">${surfaces}</div>`);
