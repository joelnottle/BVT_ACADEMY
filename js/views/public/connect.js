// #/connect — the BVT Connect directory (§8.13): search and filters (accreditation status, industry, state,
// size) kept in the URL. Also embedded in the partner portal at #/partner/connect.
import { DIRECTORY as D } from '../../../data/connectPage.js';
import { INDUSTRIES, STATES, SIZES } from '../../../data/connect.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { pageHero } from '../../components/marketing.js';
import { listingCard } from '../../components/listingCard.js';
import { announce } from '../../components/toast.js';
import { replaceHash } from '../../router.js';
import { directory, filterDirectory } from '../../connectSelectors.js';

const KEYS = ['q', 'status', 'industry', 'state', 'size'];
const filtersOf = (query) => Object.fromEntries(KEYS.map((k) => [k, query[k] ?? '']));
const select = (key, label, options, value) => `
  <div class="field"><label class="field__label" for="cx-${key}">${esc(label)}</label>
    <select class="select" id="cx-${key}" data-cx="${key}"><option value="">${esc(D.filters.all)}</option>
    ${options.map(([v, l]) => `<option value="${esc(v)}"${value === v ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></div>`;

function body(ctx) {
  const f = filtersOf(ctx.query);
  const all = directory(ctx.state, ctx.today);
  const shown = filterDirectory(all, f);
  const active = KEYS.some((k) => f[k]);
  return `
    <form class="cx-search" role="search" data-cx-form>
      <label class="sr-only" for="cx-q">${esc(D.search)}</label>
      ${icon('search')}<input class="input" id="cx-q" type="search" value="${esc(f.q)}" placeholder="${esc(D.search)}" autocomplete="off">
    </form>
    <div class="cx-filters">
      ${select('status', D.filters.status, D.statuses, f.status)}
      ${select('industry', D.filters.industry, INDUSTRIES.map((x) => [x, x]), f.industry)}
      ${select('state', D.filters.state, STATES.map((x) => [x, x]), f.state)}
      ${select('size', D.filters.size, SIZES.map((x) => [x, x]), f.size)}
    </div>
    <p class="cx-count"><span data-cx-count>${esc(D.showing(shown.length, all.length))}</span>${active ? ` · <button type="button" class="link-btn" data-cx-clear>${esc(D.clear)}</button>` : ''}</p>
    <h2 class="sr-only">Results</h2>
    ${shown.length ? `<ul class="cx-grid">${shown.map((l) => `<li>${listingCard(l)}</li>`).join('')}</ul>` : `<p class="callout">${icon('search')}<span>${esc(D.none)}</span></p>`}`;
}

export function render(ctx) {
  if (ctx.route.layout === 'portal') {
    return `<div class="page"><header class="page-header"><h1>Connect search</h1><p class="lead">${esc(D.hero.lead)}</p></header>${body(ctx)}</div>`;
  }
  return `${pageHero(D.hero)}<section class="section"><div class="container stack">${body(ctx)}</div></section>`;
}

export function bind(root, ctx) {
  const base = ctx.path;
  const go = (f) => {
    const q = new URLSearchParams(Object.entries(f).filter(([, v]) => v));
    replaceHash(`${base}${q.toString() ? `?${q}` : ''}`);
    setTimeout(() => announce(document.querySelector('[data-cx-count]')?.textContent ?? ''), 120);
  };
  const current = () => ({ ...filtersOf(ctx.query), q: root.querySelector('#cx-q').value.trim(), ...Object.fromEntries([...root.querySelectorAll('[data-cx]')].map((s) => [s.dataset.cx, s.value])) });
  root.querySelectorAll('[data-cx]').forEach((s) => s.addEventListener('change', () => go(current())));
  const input = root.querySelector('#cx-q');
  let t;
  input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => go(current()), 350); });
  root.querySelector('[data-cx-form]').addEventListener('submit', (e) => { e.preventDefault(); clearTimeout(t); go(current()); });
  root.querySelector('[data-cx-clear]')?.addEventListener('click', () => { go({}); setTimeout(() => document.getElementById('cx-q')?.focus(), 100); });
}
