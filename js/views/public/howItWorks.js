// #/how-it-works — Check → Academy → Accreditation → Connect, and the two stages (§2, §7.1).
import { HOW_IT_WORKS as P } from '../../../data/site-pages.js';
import { HOME } from '../../../data/site.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { pageHero, sectionHead, ctaBand } from '../../components/marketing.js';

function stage(s, i) {
  return `
    <li class="stage">
      <div class="stage__marker" aria-hidden="true"><span class="icon-tile">${icon(s.icon)}</span><span class="stage__num">${i + 1}</span></div>
      <div class="stage__body">
        <h2 class="h3">${esc(s.title)}</h2>
        <p class="lead">${esc(s.lead)}</p>
        <ul class="ticks">${s.points.map((p) => `<li>${icon('check')}<span>${esc(p)}</span></li>`).join('')}</ul>
      </div>
    </li>`;
}

export function render() {
  const j = P.stagesOfJourney;
  return `
    ${pageHero({ ...P.hero, actions: [{ label: 'Start your free check', href: '/sign-up', variant: 'action', icon: 'arrow-right' }] })}
    <section class="section" aria-label="The four stages">
      <div class="container"><ol class="stages">${P.stages.map(stage).join('')}</ol></div>
    </section>
    <section class="section band-cream" aria-labelledby="journey-h">
      <div class="container stack stack-lg">
        ${sectionHead({ eyebrow: j.eyebrow, title: j.title, id: 'journey-h' })}
        <div class="grid-2">
          ${j.items.map((it) => `
            <article class="card">
              <span class="chip chip--type">${icon('calendar-days')}${esc(it.badge)}</span>
              <h3 class="card__title">${esc(it.title)}</h3>
              <p class="card__meta">${esc(it.text)}</p>
            </article>`).join('')}
        </div>
        <p class="callout callout--plain">${icon('banknote')}<span>${esc(j.note)}</span></p>
      </div>
    </section>
    ${ctaBand(HOME.cta)}`;
}
