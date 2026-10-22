// Accreditation certificate preview (§8.1, §8.12): cream, V motif, number, QR, issue and renewal dates.
// Reused on the home page, the accreditation page and the public verify page.
import { esc, formatDate } from '../util.js';
import { icon } from './icon.js';
import { vMark } from './brand.js';

/** Illustrative QR-style pattern, generated from the certificate number (not a real QR code). */
function fakeQr(seed, size = 21) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h ^= h >>> 13; return (h >>> 0) / 4294967296; };
  const finder = (x, y) => [[0, 0], [size - 7, 0], [0, size - 7]].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
  const inFinder = (x, y) => {
    const [fx, fy] = [[0, 0], [size - 7, 0], [0, size - 7]].find(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7);
    const dx = x - fx; const dy = y - fy;
    return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
  };
  let rects = '';
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const on = finder(x, y) ? inFinder(x, y) : rand() > 0.52;
      if (on) rects += `<rect x="${x}" y="${y}" width="1" height="1"></rect>`;
    }
  }
  return `<svg class="cert__qr" viewBox="-1 -1 ${size + 2} ${size + 2}" role="img" aria-label="QR code linking to the verification page (illustrative)">${rects}</svg>`;
}

export function certificate({ orgName, certNo, issuedOn, renewsOn, check = 'BVT Core Pre-Qualification' }) {
  return `
    <article class="cert" aria-label="Certificate of accreditation for ${esc(orgName)}">
      <div class="cert__v" aria-hidden="true">${vMark({ className: 'cert__v-mark' })}</div>
      <header class="cert__head">
        <span class="cert__brand"><strong>BVT</strong> Academy</span>
        <span class="cert__badge">${icon('award')}Accredited</span>
      </header>
      <p class="cert__kicker">Certificate of accreditation</p>
      <p class="cert__org">${esc(orgName)}</p>
      <p class="cert__text">has had every requirement of the ${esc(check)} independently verified.</p>
      <div class="cert__foot">
        <dl class="cert__meta">
          <div><dt>Certificate</dt><dd>${esc(certNo)}</dd></div>
          <div><dt>Issued</dt><dd>${formatDate(issuedOn)}</dd></div>
          <div><dt>Renews</dt><dd>${formatDate(renewsOn)}</dd></div>
        </dl>
        ${fakeQr(certNo)}
      </div>
      <p class="cert__verify">Verify at bvtacademy.com.au/verify/${esc(certNo)}</p>
    </article>`;
}
