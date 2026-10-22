// Toasts — announced through the polite live region in index.html. Calm, no animation beyond a 200ms fade.
import { esc } from '../util.js';
import { icon, renderIcons } from './icon.js';

const DURATION = 6000;

/** Announce a short status to screen readers only (e.g. "9 requirements match"). The region lives outside #app. */
export function announce(text) {
  const region = document.getElementById('sr-status');
  if (!region) return;
  region.textContent = '';
  setTimeout(() => { region.textContent = text; }, 50);
}

/** showToast('FM-04 submitted', { text: 'We'll let you know…', iconName: 'circle-check' }) */
export function showToast(title, { text = '', iconName = 'circle-check', duration = DURATION } = {}) {
  const region = document.getElementById('toast-region');
  if (!region) return () => {};

  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `
    <span class="toast__icon">${icon(iconName)}</span>
    <p class="toast__body"><strong class="toast__title">${esc(title)}</strong>${text ? `<span class="toast__text">${esc(text)}</span>` : ''}</p>
    <button type="button" class="btn btn--on-dark-ghost btn--icon" aria-label="Dismiss notification">${icon('x')}</button>`;
  region.append(el);
  renderIcons(el);
  requestAnimationFrame(() => el.classList.add('is-open'));

  let timer;
  const close = () => {
    clearTimeout(timer);
    el.classList.remove('is-open');
    setTimeout(() => el.remove(), 220);
  };
  const start = (ms) => { clearTimeout(timer); timer = setTimeout(close, ms); };

  el.querySelector('button').addEventListener('click', close);
  // Pause while the pointer or keyboard focus is on the toast (WCAG 2.2.1)
  el.addEventListener('mouseenter', () => clearTimeout(timer));
  el.addEventListener('mouseleave', () => start(duration / 2));
  el.addEventListener('focusin', () => clearTimeout(timer));
  el.addEventListener('focusout', () => start(duration / 2));
  start(duration);
  return close;
}
