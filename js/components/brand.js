// Placeholder wordmark and the V motif (§4.3, §4.5).
// TODO(client): replace with the real BVT Academy logo (BUILD_PLAN §14 Q2).
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

export function logo({ href = '#/' } = {}) {
  return `
    <a class="logo" href="${esc(href)}" aria-label="BVT Academy home">
      ${vMark({ className: 'logo__mark', stopClass: 'logo__mark' })}
      <span aria-hidden="true"><span class="logo__bvt">BVT</span> <span class="logo__academy">Academy</span></span>
    </a>`;
}
