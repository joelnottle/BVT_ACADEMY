// Circular infographic of the six areas BVT checks (Home "What it checks"). An SVG ring in the plum → crimson
// action gradient (white text passes AA at both ends), split into equal segments, with HTML labels laid over
// each segment so the text stays crisp and readable at any size. The whole figure is one image to assistive
// tech (role="img" + aria-label); the list beside it carries the detail.
import { esc } from '../util.js';
import { icon } from './icon.js';

const CX = 200;
const R_OUT = 196;
const R_IN = 102;
const LABEL_R = 37.5; // label centre, as % of the figure's width from its centre ((R_OUT + R_IN) / 2 / 400)

const pt = (r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CX + r * Math.sin(a)].map((n) => n.toFixed(2));
};

function segment(i, n) {
  const a0 = (360 / n) * i;
  const a1 = a0 + 360 / n;
  const [x0, y0] = pt(R_OUT, a0); const [x1, y1] = pt(R_OUT, a1);
  const [x2, y2] = pt(R_IN, a1); const [x3, y3] = pt(R_IN, a0);
  return `<path class="wheel__seg" d="M${x0} ${y0} A${R_OUT} ${R_OUT} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${R_IN} ${R_IN} 0 0 0 ${x3} ${y3} Z"/>`;
}

/** areas: [{ id, name, icon }]; centre: { big, small, note } */
export function areaWheel({ areas, centre, label }) {
  const n = areas.length;
  return `
    <figure class="wheel" role="img" aria-label="${esc(label)}">
      <svg class="wheel__ring" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
        <defs><linearGradient id="wheel-grad" gradientUnits="userSpaceOnUse" x1="40" y1="20" x2="360" y2="380">
          <stop offset="0" style="stop-color: var(--plum-600)"/><stop offset="1" style="stop-color: var(--crimson-600)"/></linearGradient></defs>
        <g fill="url(#wheel-grad)">${areas.map((_, i) => segment(i, n)).join('')}</g>
        <circle class="wheel__inner" cx="${CX}" cy="${CX}" r="${R_IN - 10}"/>
      </svg>
      ${areas.map((a, i) => {
        const mid = ((360 / n) * (i + 0.5) * Math.PI) / 180;
        const left = (50 + LABEL_R * Math.sin(mid)).toFixed(2);
        const top = (50 - LABEL_R * Math.cos(mid)).toFixed(2);
        return `<span class="wheel__label" style="--x: ${left}%; --y: ${top}%" aria-hidden="true">${icon(a.icon)}<span>${esc(a.name).replace(' &amp; ', '\u00a0&amp; ')}</span></span>`; // keep "&" with the word before it
      }).join('')}
      <span class="wheel__centre" aria-hidden="true">
        <strong>${esc(centre.big)}</strong><span>${esc(centre.small)}</span><span class="wheel__note">${esc(centre.note)}</span>
      </span>
    </figure>`;
}
