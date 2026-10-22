// Right-hand slide-over panel (420px; full width on small screens). Used by Ask Ali and detail panels.
import { esc, uid } from '../util.js';
import { icon } from './icon.js';
import { openOverlay } from './overlay.js';

/** openSlideOver({ title, iconName?, body, footer?, onClose }) — body/footer are trusted HTML. */
export function openSlideOver({ title, iconName, body, footer = '', onClose }) {
  const id = uid('slideover');
  return openOverlay({
    variant: 'slideover',
    onClose,
    content: `
      <div class="slideover" role="dialog" aria-modal="true" aria-labelledby="${id}" tabindex="-1">
        <div class="slideover__header">
          <h2 class="slideover__title" id="${id}">${iconName ? icon(iconName) : ''}${esc(title)}</h2>
          <button type="button" class="btn btn--ghost btn--icon" data-close aria-label="Close panel">${icon('x')}</button>
        </div>
        <div class="slideover__body">${body}</div>
        ${footer ? `<div class="slideover__footer">${footer}</div>` : ''}
      </div>`,
  });
}
