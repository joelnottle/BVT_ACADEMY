// Confirmation modal. Use only for irreversible pretend actions (submit for verification, pay) — §8.20.
import { esc, uid } from '../util.js';
import { icon } from './icon.js';
import { openOverlay } from './overlay.js';

/**
 * openModal({ title, body, actions: [{ label, value, variant: 'action'|'outline'|'ghost' }], onAction })
 * `body` is trusted HTML. onAction(value) runs before the modal closes.
 */
export function openModal({ title, body, actions = [], onAction, onClose }) {
  const id = uid('modal');
  const buttons = actions.map((a) =>
    `<button type="button" class="btn btn--${a.variant ?? 'outline'}" data-action="${esc(a.value)}">${esc(a.label)}</button>`).join('');

  const overlay = openOverlay({
    variant: 'modal',
    onClose,
    content: `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="${id}" tabindex="-1">
        <div class="modal__header">
          <h2 class="modal__title" id="${id}">${esc(title)}</h2>
          <button type="button" class="btn btn--ghost btn--icon" data-close aria-label="Close">${icon('x')}</button>
        </div>
        <div class="modal__body">${body}</div>
        ${buttons ? `<div class="modal__footer">${buttons}</div>` : ''}
      </div>`,
  });

  overlay.dialog.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    onAction?.(btn.dataset.action);
    overlay.close(btn.dataset.action);
  });
  return overlay;
}
