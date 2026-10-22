// #/academy — what's inside: the learning loop, two requirement types, three lenses, Ask Ali,
// support, tiers & timeframes, momentum and what's included (§2, §4, §9).
import { ACADEMY_PAGE as P } from '../../../data/site-pages.js';
import { HOME } from '../../../data/site.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { pageHero, sectionHead, featureCard, tierCards, ctaBand } from '../../components/marketing.js';
import { learningLoop, miniFlow } from '../../components/learningLoop.js';

export function render() {
  return `
    ${pageHero({ ...P.hero, actions: [{ label: 'Start your free check', href: '/sign-up', variant: 'action', icon: 'arrow-right' }] })}
    <section class="section" aria-labelledby="loop-h">
      <div class="container stack stack-lg">
        ${sectionHead({ ...HOME.loop, id: 'loop-h' })}
        ${learningLoop({ skipLabel: HOME.loop.skip, optionalLabel: HOME.loop.optional })}
      </div>
    </section>
    <section class="section band-cream" aria-labelledby="types-h">
      <div class="container stack stack-lg">
        ${sectionHead({ eyebrow: P.types.eyebrow, title: P.types.title, id: 'types-h' })}
        <div class="grid-2">
          ${P.types.items.map((it) => `
            <article class="card feature">
              <span class="icon-tile">${icon(it.icon)}</span>
              <h3 class="card__title">${esc(it.title)}</h3>
              <p class="card__meta">${esc(it.text)}</p>
              ${miniFlow(it.flow)}
            </article>`).join('')}
        </div>
      </div>
    </section>
    <section class="section" aria-labelledby="lenses-h">
      <div class="container stack stack-lg">
        ${sectionHead({ eyebrow: P.lenses.eyebrow, title: P.lenses.title, id: 'lenses-h' })}
        <div class="grid-3">${P.lenses.items.map((it) => featureCard(it)).join('')}</div>
      </div>
    </section>
    <section class="section section--tint" aria-labelledby="ali-h">
      <div class="container grid-2">
        ${sectionHead({ eyebrow: P.ali.eyebrow, title: P.ali.title, lead: P.ali.text, id: 'ali-h' })}
        <div class="card stack">
          <ul class="ticks">${P.ali.points.map((p) => `<li>${icon('check')}<span>${esc(p)}</span></li>`).join('')}</ul>
          <p class="placeholder-flag">${icon('triangle-alert')}Privacy wording pending confirmation of the AI provider’s data location</p>
        </div>
      </div>
    </section>
    <section class="section" aria-labelledby="support-h">
      <div class="container stack stack-lg">
        ${sectionHead({ ...HOME.support, id: 'support-h' })}
        <div class="grid-3">${HOME.support.items.map((it) => featureCard(it)).join('')}</div>
      </div>
    </section>
    <section class="section section--tint" aria-labelledby="tiers-h">
      <div class="container stack stack-lg">
        ${sectionHead({ ...HOME.tiers, id: 'tiers-h' })}
        ${tierCards({ foundationNote: HOME.tiers.foundationNote })}
        <p class="callout callout--plain">${icon('calendar-clock')}<span>${esc(HOME.tiers.note)} Extend monthly or in three-month blocks, or re-enrol at your current tier.</span></p>
      </div>
    </section>
    <section class="section" aria-labelledby="momentum-h">
      <div class="container stack stack-lg">
        ${sectionHead({ eyebrow: P.motivation.eyebrow, title: P.motivation.title, id: 'momentum-h' })}
        <div class="grid-3">${P.motivation.items.map((it) => featureCard(it)).join('')}</div>
        <p class="text-2">${esc(P.motivation.note)}</p>
      </div>
    </section>
    <section class="section band-cream" aria-labelledby="pkg-h">
      <div class="container">
        <div class="card package">
          <h2 class="h3" id="pkg-h">${esc(P.package.title)}</h2>
          <ul class="ticks">${P.package.items.map((p) => `<li>${icon('check')}<span>${esc(p)}</span></li>`).join('')}</ul>
          <p class="package__price">${esc(P.package.price)}</p>
          <p class="placeholder-flag">${icon('triangle-alert')}Pricing and credit allowances come from Doc 3</p>
        </div>
      </div>
    </section>
    ${ctaBand(HOME.cta)}`;
}
