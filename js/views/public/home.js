// #/ — Public home (BUILD_PLAN §8.1). VC rhythm: dark hero → crimson strip → cream band → light sections
// → navy CTA band. One warm focal point per section.
import { HOME } from '../../../data/site.js';
import { CHECKS } from '../../../data/checks.js';
import { CONNECT_LISTINGS } from '../../../data/connect.js';
import { esc, addMonths } from '../../util.js';
import { icon } from '../../components/icon.js';
import { navigate } from '../../router.js';
import { accentText, sectionHead, actionLink, featureCard, checkCard, tierCards, faq, testimonial, ctaBand } from '../../components/marketing.js';
import { learningLoop } from '../../components/learningLoop.js';
import { certificate } from '../../components/certificate.js';
import { listingCard } from '../../components/listingCard.js';

const listing = (id, today) => {
  const l = CONNECT_LISTINGS.find((x) => x.id === id);
  return { ...l, status: l.renewsOn < today ? 'expired' : 'accredited' };
};

function hero() {
  const h = HOME.hero;
  return `
    <section class="home-hero on-dark" aria-labelledby="home-hero-h">
      <div class="container home-hero__inner">
        <div class="home-hero__copy">
          <p class="eyebrow">${esc(h.eyebrow)}</p>
          <h1 class="display rule" id="home-hero-h">${accentText(h.title)}</h1>
          <p class="lead">${esc(h.lead)}</p>
          <div class="home-hero__actions">${h.actions.map(actionLink).join('')}</div>
        </div>
        <div class="home-hero__media" role="img" aria-label="${esc(h.imageNote)}">
          <span class="home-hero__media-note">${icon('image')}${esc(h.imageNote)}</span>
        </div>
      </div>
    </section>`;
}

function strip() {
  return `
    <div class="home-strip-band">
    <section class="container" aria-labelledby="strip-h">
      <h2 class="sr-only" id="strip-h">${esc(HOME.strip.heading)}</h2>
      <ol class="card card--crimson home-strip">
        ${HOME.strip.steps.map((s) => `
          <li class="home-strip__step">
            <span class="home-strip__icon">${icon(s.icon)}</span>
            <h3 class="card__title">${esc(s.title)}</h3>
            <p class="card__meta">${esc(s.text)}</p>
          </li>`).join('')}
      </ol>
    </section>
    </div>`;
}

function checks() {
  const c = HOME.checks;
  return `
    <section class="section band-cream" aria-labelledby="checks-h">
      <div class="container stack stack-lg">
        <div class="section-split">
          ${sectionHead({ ...c, id: 'checks-h' })}
          <a class="btn btn--outline" href="#/checks">Compare the checks${icon('arrow-right')}</a>
        </div>
        <div class="grid-4">${Object.values(CHECKS).map((ch) => checkCard(ch)).join('')}</div>
        <p class="callout">${icon('route')}<span>${esc(c.pathwayNote)}</span></p>
      </div>
    </section>`;
}

function loop() {
  const l = HOME.loop;
  return `
    <section class="section" aria-labelledby="loop-h">
      <div class="container stack stack-lg">
        ${sectionHead({ ...l, id: 'loop-h' })}
        ${learningLoop({ skipLabel: l.skip, optionalLabel: l.optional })}
      </div>
    </section>`;
}

function tiers() {
  const t = HOME.tiers;
  return `
    <section class="section section--tint" aria-labelledby="tiers-h">
      <div class="container stack stack-lg">
        ${sectionHead({ ...t, id: 'tiers-h' })}
        ${tierCards({ foundationNote: t.foundationNote })}
        <p class="callout callout--plain">${icon('calendar-clock')}<span>${esc(t.note)}</span></p>
      </div>
    </section>`;
}

function support() {
  const s = HOME.support;
  return `
    <section class="section" aria-labelledby="support-h">
      <div class="container stack stack-lg">
        ${sectionHead({ ...s, id: 'support-h', center: true })}
        <div class="grid-3">${s.items.map((it) => featureCard(it)).join('')}</div>
      </div>
    </section>`;
}

function credentialAndConnect(today) {
  const cr = HOME.credential;
  const cn = HOME.connect;
  const cert = listing(cr.listingId, today);
  return `
    <section class="section section--tint" aria-label="The credential and BVT Connect">
      <div class="container grid-2">
        <div class="card stack">
          ${sectionHead({ eyebrow: cr.eyebrow, title: cr.title, size: 'h3' })}
          <p class="text-2">${esc(cr.text)}</p>
          ${certificate({ orgName: cert.name, certNo: cert.certNo, issuedOn: cert.accreditedOn, renewsOn: addMonths(cert.accreditedOn, 12) })}
          <p>${actionLink({ ...cr.action, variant: 'outline' })}</p>
        </div>
        <div class="card stack">
          ${sectionHead({ eyebrow: cn.eyebrow, title: cn.title, size: 'h3' })}
          <form class="connect-search" role="search" data-connect-search>
            <label class="field__label" for="home-connect-q">${esc(cn.label)}</label>
            <div class="connect-search__row">
              <input class="input" id="home-connect-q" name="q" type="search" placeholder="${esc(cn.placeholder)}">
              <button class="btn btn--action" type="submit">${icon('search')}Search</button>
            </div>
          </form>
          <div class="stack stack-sm">${cn.listingIds.map((id) => listingCard(listing(id, today), { compact: true })).join('')}</div>
          <p><a href="#/connect">Browse all pre-qualified businesses</a></p>
        </div>
      </div>
    </section>`;
}

function institutions() {
  const i = HOME.institutions;
  return `
    <section class="container section-band" aria-labelledby="inst-h">
      <div class="inst-band">
        <span class="icon-tile">${icon('handshake')}</span>
        <div>
          <h2 class="h3" id="inst-h">${esc(i.title)}</h2>
          <p class="text-2">${esc(i.text)}</p>
        </div>
        ${actionLink(i.action)}
      </div>
    </section>`;
}

function voices() {
  return `
    <section class="section" aria-labelledby="faq-h">
      <div class="container grid-2 grid-2--wide-right">
        ${testimonial(HOME.testimonial)}
        <div class="stack">
          ${sectionHead({ title: HOME.faq.title, id: 'faq-h' })}
          ${faq(HOME.faq.items)}
        </div>
      </div>
    </section>`;
}

export function render(ctx) {
  return `
    <div class="home">
      ${hero()}
      ${strip()}
      ${checks()}
      ${loop()}
      ${tiers()}
      ${support()}
      ${credentialAndConnect(ctx.today)}
      ${institutions()}
      ${voices()}
      ${ctaBand(HOME.cta)}
    </div>`;
}

export function bind(root) {
  root.querySelector('[data-connect-search]')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = e.currentTarget.q.value.trim();
    navigate(q ? `/connect?q=${encodeURIComponent(q)}` : '/connect');
  });
}
