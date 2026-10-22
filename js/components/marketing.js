// Public-site building blocks (BUILD_PLAN §8.1): section heading, inner-page hero, feature card,
// check card, tier cards, FAQ, testimonial, CTA band. Vital Consult accents per §4.1a.
import { TIERS, TIER_ORDER } from '../../data/copy.js';
import { esc } from '../util.js';
import { icon } from './icon.js';

/** Escape, then turn *word* into the crimson accent span. */
export const accentText = (s) => esc(s).replace(/\*(.+?)\*/g, '<span class="accent">$1</span>');

/** Eyebrow + two-tone heading with the crimson rule. */
export function sectionHead({ eyebrow, title, lead, id, center = false, level = 2, size = 'h2' }) {
  return `
    <header class="section-head${center ? ' section-head--center' : ''}">
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <h${level} class="${size} rule${center ? ' rule--center' : ''}"${id ? ` id="${id}"` : ''}>${accentText(title)}</h${level}>
      ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
    </header>`;
}

/** Dark hero for inner pages: navy with the magenta/plum glow. */
export function pageHero({ eyebrow, title, lead, actions = [] }) {
  return `
    <section class="page-hero on-dark" aria-labelledby="page-hero-h">
      <div class="container page-hero__inner">
        <p class="eyebrow">${esc(eyebrow)}</p>
        <h1 class="display" id="page-hero-h">${accentText(title)}</h1>
        ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
        ${actions.length ? `<div class="cluster">${actions.map(actionLink).join('')}</div>` : ''}
      </div>
    </section>`;
}

export function actionLink({ label, href, variant = 'outline', icon: iconName }) {
  return `<a class="btn btn--${variant}" href="#${esc(href)}">${esc(label)}${iconName ? icon(iconName) : ''}</a>`;
}

/** Cream icon tile with a gradient line icon, title and text. */
export function featureCard({ icon: iconName, title, text }, { level = 3, card = true } = {}) {
  return `
    <article class="${card ? 'card ' : ''}feature">
      <span class="icon-tile">${icon(iconName)}</span>
      <h${level} class="card__title">${esc(title)}</h${level}>
      <p class="card__meta">${esc(text)}</p>
    </article>`;
}

export function checkCard(check, { detailed = false } = {}) {
  return `
    <article class="card card--interactive check-card">
      <span class="icon-tile">${icon(check.enrols ? 'clipboard-check' : check.id === 'oric' ? 'landmark' : 'banknote')}</span>
      <h3 class="card__title"><a class="card__link" href="#/sign-up?check=${esc(check.id)}">${esc(check.name)}</a></h3>
      <p class="check-card__for">${esc(check.for)}</p>
      <p class="card__meta">${check.questions} questions · about ${check.mins} min</p>
      ${detailed ? `<p class="card__meta">${check.enrols ? 'Leads into the Academy and accreditation.' : 'A standalone check with its own report.'}</p>` : ''}
      <span class="check-card__go" aria-hidden="true">Start ${icon('arrow-right')}</span>
    </article>`;
}

/** Tier cards, colour-keyed (§2 Timeframes). */
export function tierCards({ foundationNote = '' } = {}) {
  return `
    <ul class="tier-cards">
      ${TIER_ORDER.filter((t) => TIERS[t].months).map((t) => `
        <li class="tier-card" data-tier="${t}">
          <p class="tier-card__name">${esc(TIERS[t].label)}</p>
          <p class="tier-card__band">${esc(TIERS[t].band)} met${t === 'foundation' && foundationNote ? ` · ${esc(foundationNote)}` : ''}</p>
          <p class="tier-card__months"><span>${TIERS[t].months}</span> months</p>
        </li>`).join('')}
    </ul>`;
}

/** Native <details> accordion: keyboard and screen-reader friendly by default. */
export function faq(items) {
  return `
    <div class="faq">
      ${items.map((it) => `
        <details class="faq__item">
          <summary class="faq__q">${esc(it.q)}${icon('chevron-down')}</summary>
          <div class="faq__a"><p>${esc(it.a)}</p></div>
        </details>`).join('')}
    </div>`;
}

export function testimonial(t) {
  return `
    <figure class="testimonial">
      <span class="testimonial__mark" aria-hidden="true">“</span>
      <blockquote><p>${esc(t.quote)}</p></blockquote>
      <figcaption><strong>${esc(t.name)}</strong> · ${esc(t.role)}</figcaption>
      <p class="placeholder-flag">${icon('triangle-alert')}Placeholder testimonial</p>
    </figure>`;
}

/** Navy CTA band with the gradient top edge and a crimson accent word. */
export function ctaBand({ title, text, label, href }) {
  return `
    <section class="cta-band on-dark" aria-labelledby="cta-band-h">
      <div class="container cta-band__inner">
        <div>
          <h2 class="h2" id="cta-band-h">${accentText(title)}</h2>
          ${text ? `<p class="lead">${esc(text)}</p>` : ''}
        </div>
        <a class="btn btn--action" href="#${esc(href)}">${esc(label)}${icon('arrow-right')}</a>
      </div>
    </section>`;
}
