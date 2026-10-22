// Progress dots for short wizards (onboarding, §8.3). Each dot links to its step, so steps can be skipped.
import { esc } from '../util.js';

/** steps: [{ label }], current: 0-based index, hrefFor(i) → "#/…" */
export function stepDots(steps, current, hrefFor, { label = 'Set-up progress' } = {}) {
  return `
    <nav class="step-dots" aria-label="${esc(label)}">
      <ol>
        ${steps.map((s, i) => {
          const state = i < current ? 'is-done' : i === current ? 'is-current' : '';
          const sr = i < current ? ' (visited)' : '';
          return `
            <li>
              <a class="step-dots__dot ${state}" href="${esc(hrefFor(i))}"${i === current ? ' aria-current="step"' : ''}>
                <span class="sr-only">Step ${i + 1}: ${esc(s.label)}${sr}</span>
              </a>
            </li>`;
        }).join('')}
      </ol>
      <p class="step-dots__label" aria-hidden="true">Step ${current + 1} of ${steps.length} · ${esc(steps[current].label)}</p>
    </nav>`;
}
