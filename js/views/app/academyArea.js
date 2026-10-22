// #/app/academy/area (and /area/:domainId) — the map (§8.5): area accordions → modules → requirement rows.
// /area/FM is the same as ?area=FM. Accordions open for filtered results; otherwise they remember what you opened.
import { ACADEMY as A } from '../../../data/academy.js';
import { esc, clamp } from '../../util.js';
import { icon } from '../../components/icon.js';
import { emptyState } from '../../components/feedback.js';
import { reqRow } from '../../components/reqRow.js';
import { rememberUi, getState } from '../../store.js';
import { parseLensFilters } from '../../lens.js';
import { lensItems, filterItems, byArea } from '../../lensSelectors.js';
import { lensHeader, bindLensHeader, activeCount } from './lensHeader.js';

const filtersOf = (ctx) => {
  const f = parseLensFilters(ctx.query);
  if (ctx.params.domainId) f.area = ctx.params.domainId;
  return f;
};

function moduleGroup(m) {
  const p = m.progress;
  return `
    <section class="mod-group" aria-labelledby="mg-${esc(m.id)}">
      <div class="mod-group__head">
        <h3 class="mod-group__title" id="mg-${esc(m.id)}"><a href="#/app/module/${esc(m.id)}">${esc(m.title)}</a></h3>
        <span class="mod-group__progress">${esc(A.module.learningLine(p.learningPct, p.verified, p.total))}</span>
      </div>
      <ul class="req-list">${m.items.map((x) => reqRow(x)).join('')}</ul>
    </section>`;
}

function areaAccordion(a, open) {
  const pct = (n) => clamp((n / a.total) * 100, 0, 100);
  return `
    <details class="area-acc" data-area="${esc(a.id)}"${open ? ' open' : ''}>
      <summary class="area-acc__summary">
        <span class="icon-tile area-acc__icon">${icon(a.icon)}</span>
        <h2 class="area-acc__name">${esc(a.name)}</h2>
        <span class="area-acc__count">${a.locked ? `${icon('lock')}Locked` : `${a.verified}/${a.total}<span class="sr-only"> verified</span>`}</span>
        <span class="progress area-acc__bar" aria-hidden="true">
          <span class="progress__fill" style="width:${pct(a.verified)}%"></span>
          ${a.claimed && !a.locked ? `<span class="progress__fill progress__fill--claimed" style="width:${pct(a.claimed)}%"></span>` : ''}
        </span>
        <span class="area-acc__chev" aria-hidden="true">${icon('chevron-down')}</span>
      </summary>
      <div class="area-acc__body">${a.modules.map(moduleGroup).join('')}</div>
    </details>`;
}

export function render(ctx) {
  const { state, org, today } = ctx;
  const f = filtersOf(ctx);
  const all = lensItems(state, org, today);
  const items = filterItems(all, f);
  const filtered = activeCount(f) > 0;
  const openAreas = state.ui.openAreas ?? [];
  const areas = byArea(state, org, items, all).filter((a) => !filtered || a.shown);
  return `
    <div class="page lens-page">
      ${lensHeader(ctx, 'area', f, { shown: items.length, total: all.length })}
      ${areas.length
        ? `<div class="area-list">${areas.map((a) => areaAccordion(a, filtered || openAreas.includes(a.id))).join('')}</div>`
        : emptyState({ title: A.noMatch.title, text: A.noMatch.text, action: '<button type="button" class="btn btn--outline" data-clear-filters>Clear filters</button>' })}
    </div>`;
}

export function bind(root, ctx) {
  bindLensHeader(root, 'area', filtersOf(ctx));
  if (activeCount(filtersOf(ctx))) return; // filtered views open everything; don't overwrite what the user opened
  root.querySelectorAll('.area-acc').forEach((d) => d.addEventListener('toggle', () => {
    const open = new Set(getState().ui.openAreas ?? []);
    if (d.open) open.add(d.dataset.area); else open.delete(d.dataset.area);
    rememberUi({ openAreas: [...open] });
  }));
}
