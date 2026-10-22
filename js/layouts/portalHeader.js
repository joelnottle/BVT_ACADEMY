// Slim 56px navy header (§7.3). Below 1024px chips condense into "More"; below 768px the header
// keeps the menu button, logo, Ali chip and avatar, and the rest moves into the avatar menu (§11).
import { PACE } from '../../data/copy.js';
import { PARTNERS } from '../../data/partners.js';
import { esc } from '../util.js';
import { icon } from '../components/icon.js';
import { logo } from '../components/brand.js';
import { isAccredited, daysLeft, paceStatus } from '../store.js';
import { searchForm } from './sidebar.js';

const TOGGLE = {
  full: { label: 'Collapse navigation', icon: 'panel-left-close', expanded: true },
  rail: { label: 'Expand navigation', icon: 'panel-left-open', expanded: false },
  hidden: { label: 'Open navigation', icon: 'menu', expanded: false },
};

export const toggleState = (mode, isDesktop) => (mode === 'rail' && !isDesktop
  ? { ...TOGGLE.rail, label: 'Open navigation' }
  : TOGGLE[mode] ?? TOGGLE.hidden);

const credits = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function menuItem(href, iconName, label, cls = '') {
  return `<li class="${cls}"><a class="menu__item" href="#${href}">${icon(iconName)}${esc(label)}</a></li>`;
}

function accountMenu(ctx) {
  const { persona, org } = ctx;
  const org_ = org?.name ?? PARTNERS[persona.partnerId]?.name ?? (persona.role === 'verifier' || persona.role === 'mentor' ? 'BVT Academy team' : '');
  const lead = persona.role === 'lead' && org;
  return `
    <div class="menu-wrap">
      <button type="button" class="avatar-btn" data-disclosure aria-expanded="false" aria-controls="account-menu"
        aria-label="Account menu, ${esc(persona.name)}">
        <span class="avatar" aria-hidden="true">${esc(persona.initials)}</span>${icon('chevron-down')}
      </button>
      <div class="menu" id="account-menu" hidden>
        <div class="menu__head">
          <strong>${esc(persona.name)}</strong>
          <span>${esc([persona.title, org_].filter(Boolean).join(' · '))}</span>
        </div>
        <ul class="menu__list">
          ${lead ? `
            ${menuItem('/app/recognition', 'award', 'Profile & recognition')}
            ${menuItem('/app/settings', 'building', 'Organisation')}
            ${menuItem('/app/settings/billing', 'banknote', 'Billing & credits')}
            ${menuItem('/app/mentoring', 'users', `Mentoring · ${plural(org.credits.mentor, 'session', 'sessions')}`, 'hide-md hide-lg')}
            ${menuItem(isAccredited(org) ? '/app/accreditation' : '/app/plan', 'gauge', isAccredited(org) ? 'Accreditation' : 'Plan & pace', 'hide-md hide-lg')}
            ${menuItem('/app/notifications', 'bell', 'Notifications', 'hide-md hide-lg')}
            ${menuItem('/app/help', 'life-buoy', 'Help & resources', 'hide-md hide-lg')}` : ''}
          <li class="menu__sep"><button type="button" class="menu__item" data-sign-out>${icon('log-out')}Sign out</button></li>
        </ul>
      </div>
    </div>`;
}

function moreMenu(org) {
  return `
    <div class="menu-wrap hide-sm hide-lg">
      <button type="button" class="btn btn--on-dark-ghost btn--icon" data-disclosure aria-expanded="false"
        aria-controls="more-menu" aria-label="More">${icon('ellipsis')}</button>
      <div class="menu" id="more-menu" hidden>
        <ul class="menu__list">
          ${menuItem('/app/mentoring', 'users', `Mentoring · ${plural(org.credits.mentor, 'session', 'sessions')}`)}
          ${menuItem('/app/notifications', 'bell', 'Notifications')}
          ${menuItem('/app/help', 'life-buoy', 'Help & resources')}
        </ul>
      </div>
    </div>`;
}

function leadActions(ctx) {
  const { org, today } = ctx;
  const ali = credits(org.credits.ali);
  const pace = PACE[paceStatus(org)];
  const paceChip = isAccredited(org)
    ? `<a class="header-chip hide-sm" href="#/app/accreditation">${icon('award')}<span>Accredited</span></a>`
    : `<a class="header-chip hide-sm" href="#/app/plan">${icon(pace.icon)}<span>${daysLeft(org, today)} days · ${pace.label}</span></a>`;
  return `
    <button type="button" class="header-chip" data-open-ali aria-label="Ask Ali, ${ali} credits">
      ${icon('sparkles')}<span aria-hidden="true"><span class="hide-sm">Ali · </span>${ali}<span class="hide-sm"> credits</span></span>
    </button>
    <a class="header-chip hide-sm hide-md" href="#/app/mentoring">${icon('users')}<span>${plural(org.credits.mentor, 'mentor session', 'mentor sessions')}</span></a>
    ${paceChip}
    <a class="btn btn--on-dark-ghost btn--icon hide-sm hide-md" href="#/app/notifications" aria-label="Notifications">${icon('bell')}</a>
    <a class="btn btn--on-dark-ghost btn--icon hide-sm hide-md" href="#/app/help" aria-label="Help & resources">${icon('circle-question-mark')}</a>
    ${moreMenu(org)}`;
}

export function renderHeader(ctx, variant, toggle) {
  const role = ctx.persona.role;
  let middle = '<div class="portal-header__spacer"></div>';
  if (role === 'lead' && ctx.org) middle = searchForm('header');
  else if (variant === 'backoffice') middle = '<span class="team-badge">BVT Team</span><div class="portal-header__spacer"></div>';
  else if (role === 'partner') middle = '<span class="team-badge">Partner portal</span><div class="portal-header__spacer"></div>';

  return `
    <header class="portal-header on-dark">
      <button type="button" class="btn btn--on-dark-ghost btn--icon" data-sidebar-toggle data-focus-key="sidebar-toggle" aria-controls="sidebar"
        aria-expanded="${toggle.expanded}" aria-label="${toggle.label}">${icon(toggle.icon)}</button>
      <div class="portal-header__brand">${logo({ href: `#${ctx.persona.landing}` })}</div>
      ${middle}
      <div class="portal-header__actions">
        ${role === 'lead' && ctx.org ? leadActions(ctx) : ''}
        ${accountMenu(ctx)}
      </div>
    </header>`;
}
