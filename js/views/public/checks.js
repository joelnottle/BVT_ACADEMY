// #/checks — the four free Checks, who completes them, what you get, and the tailored pathways (§2, §3).
import { CHECKS_PAGE as P } from '../../../data/site-pages.js';
import { HOME } from '../../../data/site.js';
import { CHECKS } from '../../../data/checks.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { pageHero, sectionHead, featureCard, checkCard, tierCards, ctaBand } from '../../components/marketing.js';

export function render() {
  return `
    ${pageHero(P.hero)}
    <section class="section" aria-labelledby="checks-list-h">
      <div class="container stack stack-lg">
        <h2 class="sr-only" id="checks-list-h">The four free checks</h2>
        <div class="grid-4">${Object.values(CHECKS).map((c) => checkCard(c, { detailed: true })).join('')}</div>
      </div>
    </section>
    <section class="section band-cream" aria-labelledby="who-h">
      <div class="container grid-2">
        ${sectionHead({ eyebrow: P.who.eyebrow, title: P.who.title, lead: P.who.text, id: 'who-h' })}
        <ul class="pill-list">${P.who.examples.map((e) => `<li>${icon('user')}<span>${esc(e)}</span></li>`).join('')}</ul>
      </div>
    </section>
    <section class="section" aria-labelledby="results-h">
      <div class="container stack stack-lg">
        ${sectionHead({ eyebrow: P.results.eyebrow, title: P.results.title, id: 'results-h' })}
        <div class="grid-4">${P.results.items.map((it) => featureCard(it)).join('')}</div>
        ${tierCards({ foundationNote: HOME.tiers.foundationNote })}
        <p class="callout callout--plain">${icon('calendar-clock')}<span>${esc(HOME.tiers.note)}</span></p>
      </div>
    </section>
    <section class="section section--tint" aria-labelledby="pathways-h">
      <div class="container stack stack-lg">
        ${sectionHead({ eyebrow: P.pathways.eyebrow, title: P.pathways.title, id: 'pathways-h' })}
        <div class="grid-2">${P.pathways.items.map((it) => featureCard(it)).join('')}</div>
        <p class="callout">${icon('route')}<span>${esc(P.pathways.note)}</span></p>
      </div>
    </section>
    ${ctaBand(HOME.cta)}`;
}
