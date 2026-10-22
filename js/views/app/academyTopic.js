// #/app/academy/topic — the learning library (§8.5): Continue learning, Recommended for your gaps,
// then every module. Filters: area and format (video / session / template), plus search.
import { ACADEMY as A } from '../../../data/academy.js';
import { esc } from '../../util.js';
import { emptyState } from '../../components/feedback.js';
import { parseLensFilters } from '../../lens.js';
import { moduleCards, topicRows, filterModules } from '../../lensSelectors.js';
import { lensHeader, bindLensHeader, activeCount } from './lensHeader.js';
import { moduleCard } from './moduleCard.js';

const row = (id, title, cards) => (cards.length ? `
  <section class="topic-row" aria-labelledby="${id}">
    <h2 class="h3" id="${id}">${esc(title)}</h2>
    <ul class="module-grid">${cards.map(moduleCard).join('')}</ul>
  </section>` : '');

export function render(ctx) {
  const { state, org } = ctx;
  const f = parseLensFilters(ctx.query);
  const cards = moduleCards(state, org);
  const shown = filterModules(cards, f);
  const filtered = activeCount(f) > 0;
  const { started, gaps } = topicRows(state, org, cards);
  // Unique ids: a module can appear in a top row and in the full grid, so only the grid uses the card ids
  return `
    <div class="page lens-page">
      ${lensHeader(ctx, 'topic', f, { shown: shown.length, total: cards.length, noun: 'modules' })}
      ${!filtered ? row('topic-continue', A.topic.continue, started) + row('topic-gaps', A.topic.gaps, gaps) : ''}
      ${shown.length ? row('topic-all', A.topic.all, shown) : emptyState({ title: A.noModules.title, text: A.noModules.text, action: '<button type="button" class="btn btn--outline" data-clear-filters>Clear filters</button>' })}
    </div>`;
}

export function bind(root, ctx) {
  bindLensHeader(root, 'topic', parseLensFilters(ctx.query));
}
