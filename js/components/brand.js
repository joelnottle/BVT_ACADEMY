// BVT Academy logo (assets/img/bvt-logo.png: white "ACADEMY" for dark backgrounds;
// bvt-logo-on-light.png: navy "ACADEMY" for light ones) and the V motif (§4.3).
// The collapsed sidebar rail shows the mark only (bvt-mark.png).
import { esc, uid } from '../util.js';

/** The V shape, stroked with the brand gradient. Decorative. */
export function vMark({ className = '', stopClass = 'v-mark' } = {}) {
  const id = uid('v');
  return `
    <svg class="${esc(className)}" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" class="${stopClass}-stop-a"></stop><stop offset="1" class="${stopClass}-stop-b"></stop>
      </linearGradient></defs>
      <path d="M5 7 L16 25 L27 7" fill="none" stroke="url(#${id})" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>`;
}

/** `withMark` adds the mark-only image, shown instead of the full logo in the collapsed sidebar rail. */
export function logo({ href = '#/', onLight = false, withMark = false } = {}) {
  return `
    <a class="logo" href="${esc(href)}" aria-label="BVT Academy home">
      <img class="logo__full" src="assets/img/${onLight ? 'bvt-logo-on-light' : 'bvt-logo'}.png" alt="" width="508" height="209">
      ${withMark ? '<img class="logo__mark" src="assets/img/bvt-mark.png" alt="" width="209" height="209">' : ''}
    </a>`;
}

/** Logo as a plain image (no link), e.g. on the certificate. */
export const logoImage = ({ onLight = true, className = '' } = {}) =>
  `<img class="${esc(className)}" src="assets/img/${onLight ? 'bvt-logo-on-light' : 'bvt-logo'}.png" alt="BVT Academy" width="508" height="209">`;
