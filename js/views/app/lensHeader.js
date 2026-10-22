// Shared Academy lens header (§8.5): title, [By area | By next action | By topic], search, filter chips
// and the result count. Filters live in the URL; changing one updates it in place (replaceHash),
// so focus and scroll stay put, and the new count is announced to screen readers.
import { ACADEMY as A } from '../../../data/academy.js';
import { STATUS } from '../../../data/copy.js';
import { PATHWAYS } from '../../../data/pathways.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { announce } from '../../components/toast.js';
import { replaceHash } from '../../router.js';
import { getState, rememberUi, rememberLens } from '../../store.js';
import { lensHref, lensPath } from '../../lens.js';
import { lensAreas } from '../../lensSelectors.js';
import { coreLocked } from '../../selectors.js';

const FILTER_KEYS = ['status', 'type', 'effort', 'area', 'format', 'q'];
export const activeCount = (f) => FILTER_KEYS.filter((k) => (Array.isArray(f[k]) ? f[k].length : f[k])).length;

let pendingAnnounce = false;

function chip(group, value, label, pressed) {
  return `<button type="button" class="chip chip--filter" aria-pressed="${pressed}" data-filter="${group}" data-value="${esc(value)}"
    data-focus-key="f-${group}-${esc(value)}"><span class="chip__tick">${icon('check')}</span>${esc(label)}</button>`;
}

function chipGroup(label, chips) {
  return `<fieldset class="lens-filter"><legend>${esc(label)}</legend><div class="lens-filter__chips">${chips}</div></fieldset>`;
}

function areaSelect(org, f) {
  return `
    <div class="lens-filter lens-filter--area">
      <label class="lens-filter__label" for="lens-area">${esc(A.filters.area.label)}</label>
      <select class="select" id="lens-area" data-filter-select="area">
        <option value="">${esc(A.filters.area.all)}</option>
        ${lensAreas(org).map((a) => `<option value="${a.id}"${f.area === a.id ? ' selected' : ''}>${esc(a.name)}</option>`).join('')}
      </select>
    </div>`;
}

function filterGroups(lens, ctx, f) {
  const F = A.filters;
  if (lens === 'topic') {
    return areaSelect(ctx.org, f)
      + chipGroup(F.format.label, F.format.options.map(([v, l]) => chip('format', v, l, f.format === v)).join(''));
  }
  const statuses = [...A.columns.map(([id]) => id), ...(coreLocked(ctx.state, ctx.org) ? ['locked'] : [])];
  return areaSelect(ctx.org, f)
    + chipGroup(F.type.label, F.type.options.map(([v, l]) => chip('type', v, l, f.type === v)).join(''))
    + chipGroup(F.status.label, statuses.map((s) => chip('status', s, STATUS[s].label, f.status.includes(s))).join(''))
    + chipGroup(F.effort.label, F.effort.options.map(([v, l]) => chip('effort', v, l, f.effort === v)).join(''));
}

/** The header. `count` = { shown, total, noun }. `extra` is trusted HTML placed beside the count (e.g. Board | List). */
export function lensHeader(ctx, lens, f, count, extra = '') {
  const meta = A.lenses.find((l) => l.id === lens);
  const n = activeCount(f) - (f.q ? 1 : 0); // search has its own box; count only the panel's filters
  // Closed by default to keep the page calm; open when filters are applied (e.g. from a dashboard link)
  const open = n > 0 || (ctx.state.ui.filtersOpen ?? false);
  const keep = { area: f.area, q: f.q };
  const org = ctx.org;
  return `
    <header class="page-header lens-head">
      <h1>${esc(A.title)}<span class="sr-only">: ${esc(meta.label)}</span></h1>
      <p class="lead">${esc(meta.lead)}</p>
    </header>
    <nav class="segmented lens-switch" aria-label="Academy views">
      ${A.lenses.map((l) => `<a class="segmented__item" href="${esc(lensHref(l.id, keep))}"${l.id === lens ? ' aria-current="page"' : ''}>${icon(l.icon)}${esc(l.label)}</a>`).join('')}
    </nav>
    <div class="lens-tools">
      <form class="lens-search" role="search" data-lens-search>
        <label class="sr-only" for="lens-q">${esc(A.search.label)}</label>
        ${icon('search')}
        <input class="input" id="lens-q" type="search" value="${esc(f.q)}" placeholder="${esc(A.search.placeholder)}" autocomplete="off">
      </form>
      <details class="lens-filters" data-lens-filters${open ? ' open' : ''}>
        <summary>${icon('sliders-horizontal')}${esc(A.filters.title)}${n ? ` <span class="lens-filters__n">${n}<span class="sr-only"> active</span></span>` : ''}</summary>
        <div class="lens-filters__body">${filterGroups(lens, ctx, f)}</div>
      </details>
    </div>
    ${coreLocked(ctx.state, org) && lens !== 'topic' ? `<p class="callout lens-locked">${icon('lock')}<span>${esc(A.locked(PATHWAYS[org.pathway].title))} <a href="#/app/pathway">Open the pathway</a></span></p>` : ''}
    <div class="lens-count">
      <p data-lens-count>${esc(A.filters.showing(count.shown, count.total, count.noun))}${n ? ` · <button type="button" class="link-btn" data-clear-filters data-focus-key="clear-filters">${esc(A.filters.clear)}</button>` : ''}</p>
      ${extra}
    </div>`;
}

/** Wire the header. `base` is the current filters; the URL is rewritten in place on every change. */
export function bindLensHeader(root, lens, f) {
  rememberLens(lens);
  if (pendingAnnounce) {
    pendingAnnounce = false;
    const text = root.querySelector('[data-lens-count]')?.textContent.replace(/·.*$/, '').trim();
    if (text) announce(text);
  }
  const go = (next) => { pendingAnnounce = true; replaceHash(lensPath(lens, next)); };

  root.querySelectorAll('[data-filter]').forEach((btn) => btn.addEventListener('click', () => {
    const { filter: key, value } = btn.dataset;
    const next = { ...f, status: [...f.status] };
    if (key === 'status') next.status = f.status.includes(value) ? f.status.filter((s) => s !== value) : [...f.status, value];
    else next[key] = f[key] === value ? null : value;
    go(next);
  }));
  root.querySelector('[data-filter-select="area"]')?.addEventListener('change', (e) => go({ ...f, area: e.target.value || null }));
  root.querySelectorAll('[data-clear-filters]').forEach((b) => b.addEventListener('click', () => {
    go({});
    requestAnimationFrame(() => document.getElementById('lens-q')?.focus());
  }));

  const search = root.querySelector('[data-lens-search]');
  const input = search.querySelector('input');
  let timer;
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => go({ ...f, q: input.value.trim() }), 350); });
  search.addEventListener('submit', (e) => { e.preventDefault(); clearTimeout(timer); go({ ...f, q: input.value.trim() }); });

  // <details open> fires 'toggle' when first rendered too; only remember a change the user made
  const details = root.querySelector('[data-lens-filters]');
  const rendered = details.open;
  details.addEventListener('toggle', () => {
    if (details.open !== rendered && getState().ui.filtersOpen !== details.open) rememberUi({ filtersOpen: details.open });
  });
}
