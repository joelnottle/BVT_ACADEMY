// "Your details · Choose a check · Questions · Results" progress for the free Check flow.
import { FLOW_STEPS } from '../../data/checkFlow.js';
import { esc } from '../util.js';
import { icon } from './icon.js';

export function flowSteps(current) {
  return `
    <ol class="flow-steps" aria-label="Free check progress">
      ${FLOW_STEPS.map((label, i) => {
        const state = i < current ? 'is-done' : i === current ? 'is-current' : '';
        return `
          <li class="flow-steps__item ${state}"${i === current ? ' aria-current="step"' : ''}>
            <span class="flow-steps__marker" aria-hidden="true">${i < current ? icon('check') : i + 1}</span>
            <span>${esc(label)}${i < current ? '<span class="sr-only"> (done)</span>' : ''}</span>
          </li>`;
      }).join('')}
    </ol>`;
}
