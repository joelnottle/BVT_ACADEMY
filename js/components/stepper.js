// Requirement stepper (§8.7). Steps are buttons in an <ol>; the current one has aria-current="step".
// Full: Watch → … → Closed (steps 1–4 optional, freely clickable). Compact: Upload → Verify → Closed.
// Below 768px the full variant shows "Step 4 of 7 · Do it" with prev/next.
import { STEPS, COMPACT_STEP_IDS } from '../../data/copy.js';
import { esc } from '../util.js';
import { icon } from './icon.js';

export function stepper({ current, done = [], variant = 'full', locked = false, label = 'Requirement steps' }) {
  const steps = variant === 'compact' ? STEPS.filter((s) => COMPACT_STEP_IDS.includes(s.id)) : STEPS;
  const idx = Math.max(0, steps.findIndex((s) => s.id === current));
  const total = steps.length;

  const items = steps.map((s, i) => {
    const isDone = done.includes(s.id);
    const marker = locked ? icon('lock') : isDone ? icon('check') : i + 1;
    return `
      <li class="stepper__item${isDone ? ' is-done' : ''}">
        <button type="button" class="stepper__btn" data-step="${s.id}"
          ${i === idx ? 'aria-current="step"' : ''} ${locked ? 'disabled' : ''}>
          <span class="stepper__marker" aria-hidden="true">${marker}</span>
          <span class="stepper__label"><span class="sr-only">Step ${i + 1}: </span>${esc(s.label)}${isDone ? '<span class="sr-only"> (done)</span>' : ''}</span>
          ${variant === 'full' && s.optional ? '<span class="stepper__opt">Optional</span>' : ''}
          ${i === idx && !locked ? '<span class="stepper__here" aria-hidden="true">You are here</span>' : ''}
        </button>
      </li>`;
  }).join('');

  const prev = steps[idx - 1];
  const next = steps[idx + 1];
  const mobile = variant === 'full' ? `
    <div class="stepper__mobile">
      <button type="button" class="btn btn--ghost btn--icon" data-step="${prev?.id ?? ''}"
        aria-label="${prev ? `Previous step: ${esc(prev.label)}` : 'No previous step'}" ${prev && !locked ? '' : 'disabled'}>${icon('chevron-left')}</button>
      <p class="stepper__mobile-label">${locked ? `${icon('lock')} Locked · ${total} steps` :
        `Step ${idx + 1} of ${total} · ${esc(steps[idx].label)}${steps[idx].optional ? ' <span>(optional)</span>' : ''}`}</p>
      <button type="button" class="btn btn--ghost btn--icon" data-step="${next?.id ?? ''}"
        aria-label="${next ? `Next step: ${esc(next.label)}` : 'No next step'}" ${next && !locked ? '' : 'disabled'}>${icon('chevron-right')}</button>
    </div>` : '';

  return `
    <div class="stepper stepper--${variant}" role="group" aria-label="${esc(label)}">
      <ol class="stepper__list">${items}</ol>
      ${mobile}
    </div>`;
}

/** Calls onSelect(stepId) when any step (or prev/next) is activated. */
export function bindStepper(root, onSelect) {
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.stepper [data-step]');
    if (btn && btn.dataset.step && !btn.disabled) onSelect(btn.dataset.step);
  });
}
