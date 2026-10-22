// Module card for By topic (§8.5): thumbnail, title, area, videos and minutes, "Serves N requirements",
// learning progress and evidence progress. The whole card is one link.
import { ACADEMY as A } from '../../../data/academy.js';
import { DOMAINS } from '../../../data/domains.js';
import { esc, clamp } from '../../util.js';
import { icon } from '../../components/icon.js';

const ICON = Object.fromEntries(DOMAINS.map((d) => [d.id, d.icon]));
const bar = (pct) => `<span class="progress" aria-hidden="true"><span class="progress__fill" style="width:${clamp(pct, 0, 100)}%"></span></span>`;

export function moduleCard(c) {
  const p = c.progress;
  return `
    <li class="card card--interactive module-card">
      <span class="module-card__thumb" aria-hidden="true">${icon(ICON[c.domainId] ?? 'route')}<span>${c.videos.length} videos</span></span>
      <span class="module-card__area">${esc(c.areaName)}</span>
      <a class="card__link module-card__title" href="#/app/module/${esc(c.id)}">${esc(c.title)}</a>
      <span class="module-card__meta">${icon('play')}${c.videos.length} videos · ${c.videoMins} min · ${esc(A.topic.serves(c.reqIds.length))}</span>
      <span class="module-card__progress">
        <span class="module-card__row"><span>Learning</span><span>${p.learningPct}%</span></span>${bar(p.learningPct)}
        <span class="module-card__row"><span>Evidence</span><span>${p.verified} of ${p.total} verified</span></span>${bar(p.total ? (p.verified / p.total) * 100 : 0)}
      </span>
      ${c.locked ? `<span class="chip chip--st-locked">${icon('lock')}Unlocks after the pathway</span>` : ''}
      ${c.placeholder ? `<span class="placeholder-flag">${icon('triangle-alert')}Placeholder content</span>` : ''}
    </li>`;
}
