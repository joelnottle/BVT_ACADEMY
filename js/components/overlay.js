// Shared overlay shell for modals and slide-overs:
// focus trap, Esc closes, scrim click closes, focus returns to the trigger, background made inert.
import { renderIcons } from './icon.js';

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])',
  'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])',
].join(',');

const stack = [];
const closers = new Map();

// Following a link inside an overlay (e.g. "Open Ask Ali page") closes every open overlay.
window.addEventListener('hashchange', () => [...stack].reverse().forEach((el) => closers.get(el)?.()));

function setBackgroundInert(on) {
  document.getElementById('app')?.toggleAttribute('inert', on);
  document.body.classList.toggle('is-scroll-locked', on);
}

/**
 * @param {{ variant:'modal'|'slideover', content:string, initialFocus?:string, onClose?:(result?:string)=>void }} o
 * @returns {{ el:HTMLElement, dialog:HTMLElement, close:(result?:string)=>void }}
 */
export function openOverlay({ variant, content, initialFocus, onClose }) {
  const trigger = document.activeElement;
  const el = document.createElement('div');
  el.className = `overlay overlay--${variant}`;
  el.innerHTML = content;
  document.body.append(el);
  renderIcons(el);

  stack.at(-1)?.setAttribute('inert', '');
  stack.push(el);
  setBackgroundInert(true);

  const dialog = el.querySelector('[role="dialog"]');
  const focusables = () => [...dialog.querySelectorAll(FOCUSABLE)].filter((n) => n.getClientRects().length);

  requestAnimationFrame(() => el.classList.add('is-open'));
  // Default: focus the dialog itself so its title is announced and no action is pre-focused.
  ((initialFocus && dialog.querySelector(initialFocus)) || dialog).focus();

  let closed = false;
  function close(result) {
    if (closed) return;
    closed = true;
    el.classList.remove('is-open');
    stack.splice(stack.indexOf(el), 1);
    closers.delete(el);
    if (stack.length) stack.at(-1).removeAttribute('inert');
    else setBackgroundInert(false);
    setTimeout(() => el.remove(), 220);
    if (trigger && document.contains(trigger)) trigger.focus();
    onClose?.(result);
  }

  closers.set(el, close);

  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key !== 'Tab') return;
    const f = focusables();
    if (!f.length) { e.preventDefault(); return; }
    const [first, last] = [f[0], f[f.length - 1]];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  el.addEventListener('mousedown', (e) => { if (e.target === el) close(); });
  el.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });

  return { el, dialog, close };
}
