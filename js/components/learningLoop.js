// The learning loop as a connected flow (§2, §8.1): Watch → Learn → Download → Do it → Upload → Verify → Closed.
// Steps 1–4 are optional; a branch shows "Already in place? Skip straight to evidence" landing on Upload.
// Horizontal from 1024px; a vertical timeline below.
import { STEPS } from '../../data/copy.js';
import { esc } from '../util.js';
import { icon } from './icon.js';

export function learningLoop({ skipLabel, optionalLabel }) {
  return `
    <div class="loop">
      <p class="loop__skip"><span>${esc(skipLabel)}</span>${icon('corner-right-down')}</p>
      <p class="loop__optional"><span>${esc(optionalLabel)}</span></p>
      <ol class="loop__steps">
        ${STEPS.map((s, i) => `
          <li class="loop__step${s.optional ? ' is-optional' : ''}${s.id === 'upload' ? ' is-landing' : ''}">
            <span class="loop__node" aria-hidden="true">${icon(s.icon)}</span>
            <span class="loop__num">${String(i + 1).padStart(2, '0')}</span>
            <span class="loop__label">${esc(s.label)}${s.optional ? '<span class="sr-only"> (optional)</span>' : ''}</span>
            <span class="loop__blurb">${esc(s.blurb)}</span>
          </li>`).join('')}
      </ol>
    </div>`;
}

/** Small inline flow, e.g. "Upload → Verify → Closed". */
export function miniFlow(labels) {
  return `<p class="mini-flow">${labels.map((l) => `<span>${esc(l)}</span>`).join(icon('arrow-right'))}</p>`;
}
