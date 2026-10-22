// #/app/academy/action — the to-do view (§8.5). Board columns by status, or a List (the default under 768px).
// On phones the board becomes status tabs. No drag-and-drop: statuses change only through real actions.
import { ACADEMY as A } from '../../../data/academy.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { emptyState } from '../../components/feedback.js';
import { reqRow, boardCard } from '../../components/reqRow.js';
import { tabs, bindTabs } from '../../components/tabs.js';
import { setUi } from '../../store.js';
import { parseLensFilters } from '../../lens.js';
import { lensItems, filterItems } from '../../lensSelectors.js';
import { lensHeader, bindLensHeader } from './lensHeader.js';

const isPhone = () => window.matchMedia('(max-width: 767px)').matches;
const viewOf = (ctx) => ctx.state.ui.boardView ?? (isPhone() ? 'list' : 'board');

function columnsFor(items, f) {
  return A.columns
    .filter(([id]) => !f.status.length || f.status.includes(id))
    .map(([id, label]) => ({ id, label, items: items.filter((x) => x.status === id) }));
}

function viewToggle(view) {
  return `
    <div class="segmented" role="group" aria-label="Show as">
      ${A.views.map((v) => `<button type="button" class="segmented__item" data-board-view="${v.id}" data-focus-key="view-${v.id}" aria-pressed="${v.id === view}">${icon(v.icon)}${esc(v.label)}</button>`).join('')}
    </div>`;
}

const emptyCol = `<p class="board-col__empty">${esc(A.emptyColumn)}</p>`;
const SHOW = 6; // long columns show six cards, then "Show all"

function colCards(c) {
  if (!c.items.length) return emptyCol;
  const first = `<ul class="board-col__list">${c.items.slice(0, SHOW).map(boardCard).join('')}</ul>`;
  if (c.items.length <= SHOW) return first;
  return `${first}
    <ul class="board-col__list" id="more-${c.id}" hidden>${c.items.slice(SHOW).map(boardCard).join('')}</ul>
    <button type="button" class="btn btn--ghost board-col__more" aria-expanded="false" aria-controls="more-${c.id}" data-show-more data-focus-key="more-${c.id}">
      Show all ${c.items.length}<span class="sr-only"> ${esc(c.label)}</span></button>`;
}

function board(cols) {
  if (isPhone()) {
    return tabs({
      label: 'Requirements by status',
      items: cols.map((c) => ({ id: c.id, label: c.label, count: c.items.length, panel: c.items.length ? `<ul class="board-col__list">${c.items.map(boardCard).join('')}</ul>` : emptyCol })),
      selected: (cols.find((c) => c.items.length) ?? cols[0])?.id,
    });
  }
  return `
    <div class="board" data-cols="${cols.length}">
      ${cols.map((c) => `
        <section class="board-col" data-status="${c.id}" aria-labelledby="col-${c.id}">
          <h2 class="board-col__head" id="col-${c.id}">${esc(c.label)} <span class="board-col__n">${c.items.length}</span></h2>
          ${colCards(c)}
        </section>`).join('')}
    </div>`;
}

function list(cols) {
  return `
    <div class="status-list">
      ${cols.filter((c) => c.items.length).map((c) => `
        <section class="status-group" aria-labelledby="sg-${c.id}">
          <h2 class="status-group__head" id="sg-${c.id}">${esc(c.label)} <span class="board-col__n">${c.items.length}</span></h2>
          <ul class="req-list">${c.items.map((x) => reqRow(x, { showArea: true })).join('')}</ul>
        </section>`).join('')}
    </div>`;
}

export function render(ctx) {
  const { state, org, today } = ctx;
  const f = parseLensFilters(ctx.query);
  const all = lensItems(state, org, today);
  const items = filterItems(all, f);
  const view = viewOf(ctx);
  const cols = columnsFor(items, f);
  const locked = items.filter((x) => x.status === 'locked');
  const any = cols.some((c) => c.items.length);
  return `
    <div class="page lens-page">
      ${lensHeader(ctx, 'action', f, { shown: items.length, total: all.length }, viewToggle(view))}
      ${any ? (view === 'board' ? board(cols) : list(cols)) : ''}
      ${locked.length ? `
        <section class="status-group" aria-labelledby="sg-locked">
          <h2 class="status-group__head" id="sg-locked">${icon('lock')}Locked until the pathway is done <span class="board-col__n">${locked.length}</span></h2>
          <details class="locked-list"><summary>Show the ${locked.length} locked requirements</summary><ul class="req-list">${locked.map((x) => reqRow(x, { showArea: true })).join('')}</ul></details>
        </section>` : ''}
      ${!any && !locked.length ? emptyState({ title: A.noMatch.title, text: A.noMatch.text, action: '<button type="button" class="btn btn--outline" data-clear-filters>Clear filters</button>' }) : ''}
      ${view === 'board' && any ? `<p class="text-3 lens-note">${icon('info')}${esc(A.noBoardDrag)}</p>` : ''}
    </div>`;
}

export function bind(root, ctx) {
  bindLensHeader(root, 'action', parseLensFilters(ctx.query));
  bindTabs(root);
  root.querySelectorAll('[data-board-view]').forEach((b) => b.addEventListener('click', () => setUi({ boardView: b.dataset.boardView })));
  root.querySelectorAll('[data-show-more]').forEach((b) => b.addEventListener('click', () => {
    const more = document.getElementById(b.getAttribute('aria-controls'));
    more.hidden = !more.hidden;
    b.setAttribute('aria-expanded', String(!more.hidden));
    b.firstChild.textContent = more.hidden ? `Show all ${more.parentElement.querySelectorAll('.board-card').length}` : 'Show fewer';
  }));
}
