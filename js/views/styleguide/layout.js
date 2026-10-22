// Styleguide building blocks: section wrapper, light/dark demo pair, labelled example.
import { esc } from '../../util.js';

export function section(id, title, intro, content) {
  return `
    <section class="sg-section" id="sg-${id}" aria-labelledby="sg-${id}-h">
      <h2 class="h3" id="sg-${id}-h" tabindex="-1">${esc(title)}</h2>
      ${intro ? `<p class="text-2">${intro}</p>` : ''}
      ${content}
    </section>`;
}

/** Side-by-side demo: the same component on the light work surface and on the dark frame. */
export function pair(light, dark) {
  return `
    <div class="sg-pair">
      <div class="sg-panel"><p class="sg-panel__label">On light</p>${light}</div>
      <div class="sg-panel on-dark"><p class="sg-panel__label">On dark</p>${dark}</div>
    </div>`;
}

export function panel(content, { dark = false, label = dark ? 'On dark' : 'On light' } = {}) {
  return `<div class="sg-panel${dark ? ' on-dark' : ''}"><p class="sg-panel__label">${esc(label)}</p>${content}</div>`;
}

export function example(label, content) {
  return `<div class="sg-example"><p class="sg-example__label">${esc(label)}</p>${content}</div>`;
}
