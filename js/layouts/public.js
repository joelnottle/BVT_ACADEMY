// Public layout (§7.1): marketing header and footer. `focused` routes (Check, enrolment) get a minimal header.
import { PROTOTYPE_NOTE } from '../../data/copy.js';
import { HOME, CONTACT } from '../../data/site.js';
import { socialIcon } from '../components/social.js';
import { esc } from '../util.js';
import { icon } from '../components/icon.js';
import { logo } from '../components/brand.js';
import { australiaOutline } from '../components/australia.js';

const LINKS = [
  ['/how-it-works', 'How it works'],
  ['/checks', 'Checks'],
  ['/academy', 'Academy'],
  ['/institutions', 'For institutions'],
  ['/connect', 'BVT Connect'],
];

const current = (path, href) => (path === href || path.startsWith(`${href}/`) ? ' aria-current="page"' : '');

function navLinks(path) {
  return LINKS.map(([href, label]) => `<li><a class="site-nav__link" href="#${href}"${current(path, href)}>${label}</a></li>`).join('');
}

function actions(persona) {
  if (persona.role !== 'visitor') {
    return `<a class="btn btn--action" href="#${esc(persona.landing)}">${icon('layout-dashboard')}Go to my ${persona.role === 'lead' ? 'dashboard' : 'portal'}</a>`;
  }
  return `
    <a class="btn btn--on-dark-ghost" href="#/sign-in">Sign in</a>
    <a class="btn btn--action" href="#/sign-up">Start free check</a>`;
}

/** Slim top bar (VC pattern): email and social links. Placeholders until BVT supplies them. */
function topbar() {
  return `
    <nav class="topbar" aria-label="Contact and social">
      <div class="container topbar__inner">
        <a class="topbar__link" href="mailto:${esc(CONTACT.email)}" data-pretend="Email address to be confirmed — nothing was sent.">${icon('mail')}<span>${esc(CONTACT.email)}</span></a>
        <ul class="topbar__social">
          ${CONTACT.socials.map((s) => `<li><a class="topbar__icon" href="#/" aria-label="${esc(s.label)}" data-pretend="Social profiles to be supplied.">${socialIcon(s.id)}</a></li>`).join('')}
        </ul>
      </div>
    </nav>`;
}

function header(ctx) {
  if (ctx.route.focused) {
    return `
      <header class="site-header on-dark">
        <div class="site-header__inner container">
          ${logo()}
          <a class="btn btn--on-dark-ghost site-header__exit" href="#/">${icon('x')}<span>Exit to home</span></a>
        </div>
      </header>`;
  }
  return `
    ${topbar()}
    <header class="site-header on-dark">
      <div class="site-header__inner container">
        ${logo()}
        <nav class="site-nav" aria-label="Main"><ul>${navLinks(ctx.path)}</ul></nav>
        <div class="site-header__actions">${actions(ctx.persona)}</div>
        <button type="button" class="btn btn--on-dark btn--icon site-header__menu-btn" data-disclosure
          aria-expanded="false" aria-controls="site-menu" aria-label="Menu">${icon('menu')}</button>
      </div>
      <div class="site-menu" id="site-menu" hidden>
        <nav class="container" aria-label="Main, mobile">
          <ul class="site-menu__links">${navLinks(ctx.path)}</ul>
          <div class="site-menu__actions">${actions(ctx.persona)}</div>
        </nav>
      </div>
    </header>`;
}

const endorse = () => {
  const e = HOME.hero.endorsement;
  return `<p class="endorse">${esc(e.text)} <img src="${esc(e.logo)}" alt="${esc(e.alt)}" width="162" height="20"></p>`;
};

function footer(ctx) {
  const year = ctx.today.slice(0, 4);
  if (ctx.route.focused) {
    return `
      <footer class="site-footer site-footer--slim on-dark">
        <div class="container site-footer__bottom">
          <p>© ${year} Business Vitality Tracker</p>
          ${endorse()}
          <p class="text-3">${PROTOTYPE_NOTE}</p>
        </div>
      </footer>`;
  }
  return `
    <footer class="site-footer on-dark">
      <div class="container site-footer__grid">
        <div class="stack stack-sm">
          ${logo()}
          <p class="text-2">Pre-qualified. Accredited. Connected.</p>
          <p class="footer-aus">${australiaOutline({ className: 'footer-aus__map' })}<span><strong>Proudly Australian.</strong> ${esc(HOME.australia.title.replace(/\*/g, ''))}.</span></p>
          ${endorse()}
        </div>
        <nav aria-label="Footer: organisations">
          <h2 class="site-footer__heading">For organisations</h2>
          <ul>
            <li><a href="#/sign-up">Start free check</a></li>
            <li><a href="#/how-it-works">How it works</a></li>
            <li><a href="#/checks">Free Checks</a></li>
            <li><a href="#/academy">The Academy</a></li>
          </ul>
        </nav>
        <nav aria-label="Footer: institutions">
          <h2 class="site-footer__heading">For institutions</h2>
          <ul>
            <li><a href="#/institutions">Send my clients through BVT</a></li>
            <li><a href="#/connect">Find pre-qualified businesses</a></li>
            <li><a href="#/verify">Verify a certificate</a></li>
          </ul>
        </nav>
      </div>
      <div class="container site-footer__bottom">
        <p>© ${year} Business Vitality Tracker. BVT Academy is the platform name.</p>
        <p class="text-3">${PROTOTYPE_NOTE}</p>
      </div>
    </footer>`;
}

export function renderPublic(ctx, content) {
  return `
    <div class="public${ctx.route.focused ? ' public--focused' : ''}">
      ${header(ctx)}
      <main id="main" class="site-main" tabindex="-1">${content}</main>
      ${footer(ctx)}
    </div>`;
}
