// Slim 56px navy header (§7.3). Below 1280px the mentor chip and help fold into "More"; below 768px the header
// keeps the menu button, logo, Ali chip and avatar, and the rest moves into the avatar menu (§11).
import { PACE, fmtCredits } from '../../data/copy.js';
import { PARTNERS } from '../../data/partners.js';
import { esc } from '../util.js';
import { icon } from '../components/icon.js';
import { logo } from '../components/brand.js';
import { isAccredited, daysLeft, paceStatus } from '../selectors.js';
import { unreadCount } from '../dashboardSelectors.js';
import { aliBalance } from '../supportStore.js';
import { derivedReminders } from '../accountSelectors.js';
import { noteRow } from '../components/noteRow.js';
import { NOTIFICATIONS_PAGE } from '../../data/account.js';
import { searchForm } from './sidebar.js';

const TOGGLE = {
  full: { label: 'Collapse navigation', icon: 'panel-left-close', expanded: true },
  rail: { label: 'Expand navigation', icon: 'panel-left-open', expanded: false },
  hidden: { label: 'Open navigation', icon: 'menu', expanded: false },
};

export const toggleState = (mode, isDesktop) => (mode === 'rail' && !isDesktop
  ? { ...TOGGLE.rail, label: 'Open navigation' }
  : TOGGLE[mode] ?? TOGGLE.hidden);

const credits = (n) => fmtCredits(n);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const bellLabel = (n) => (n ? `Notifications, ${n} unread` : 'Notifications');

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
            ${menuItem('/app/notifications', 'bell', withCount('Notifications', unreadCount(ctx.state, org.id)), 'hide-md hide-lg')}
            ${menuItem('/app/help', 'life-buoy', 'Help & resources', 'hide-md hide-lg')}` : ''}
          ${persona.role === 'member' ? `<li><button type="button" class="menu__item" data-back-to-lead>${icon('undo-2')}Back to the lead’s view (demo)</button></li>` : ''}
          <li class="menu__sep"><button type="button" class="menu__item" data-sign-out>${icon('log-out')}Sign out</button></li>
        </ul>
      </div>
    </div>`;
}

const withCount = (label, n) => (n ? `${label} · ${n} unread` : label);

function moreMenu(org, unread) {
  return `
    <div class="menu-wrap hide-sm hide-xl">
      <button type="button" class="btn btn--on-dark-ghost btn--icon" data-disclosure aria-expanded="false"
        aria-controls="more-menu" aria-label="More">${icon('ellipsis')}</button>
      <div class="menu" id="more-menu" hidden>
        <ul class="menu__list">
          ${menuItem('/app/mentoring', 'users', `Mentoring · ${plural(org.credits.mentor, 'session', 'sessions')}`)}
          ${menuItem('/app/notifications', 'bell', withCount('Notifications', unread))}
          ${menuItem('/app/help', 'life-buoy', 'Help & resources')}
        </ul>
      </div>
    </div>`;
}

/** Bell dropdown (§8.18): the latest five, plus links to everything. */
function bellMenu(ctx, unread) {
  const { state, org, today } = ctx;
  const latest = [...derivedReminders(state, org, today).map((r) => ({ ...r, derived: true })),
    ...state.notifications.filter((n) => n.orgId === org.id).sort((a, b) => b.on.localeCompare(a.on))].slice(0, 5);
  return `
    <div class="menu-wrap hide-sm hide-md">
      <button type="button" class="btn btn--on-dark-ghost btn--icon bell" data-disclosure aria-expanded="false" aria-controls="bell-menu"
        aria-label="${bellLabel(unread)}">${icon('bell')}${unread ? `<span class="bell__count" aria-hidden="true">${unread}</span>` : ''}</button>
      <div class="menu bell-menu" id="bell-menu" hidden>
        <p class="bell-menu__title">${NOTIFICATIONS_PAGE.bellTitle}</p>
        <ul class="note-list">${latest.map((n) => noteRow(n, { compact: true })).join('')}</ul>
        <a class="menu__item" href="#/app/notifications">${icon('bell')}${NOTIFICATIONS_PAGE.bellAll}</a>
      </div>
    </div>`;
}

/** A team member's own Ali meter (§8.14). */
function memberActions() {
  const ali = credits(aliBalance());
  return `<button type="button" class="header-chip" data-open-ali aria-label="Ask Ali, ${ali} credits">
    ${icon('sparkles')}<span aria-hidden="true"><span class="hide-sm">Ali · </span>${ali}<span class="hide-sm"> credits</span></span></button>`;
}

function leadActions(ctx) {
  const { state, org, today } = ctx;
  const ali = credits(org.credits.ali);
  const unread = unreadCount(state, org.id);
  const pace = PACE[paceStatus(state, org, today).status];
  const paceChip = isAccredited(org)
    ? `<a class="header-chip hide-sm" href="#/app/accreditation">${icon('award')}<span>Accredited</span></a>`
    : `<a class="header-chip hide-sm" href="#/app/plan">${icon(pace.icon)}<span>${daysLeft(org, today)} days · ${pace.label}</span></a>`;
  return `
    <button type="button" class="header-chip" data-open-ali aria-label="Ask Ali, ${ali} credits">
      ${icon('sparkles')}<span aria-hidden="true"><span class="hide-sm">Ali · </span>${ali}<span class="hide-sm"> credits</span></span>
    </button>
    <a class="header-chip hide-below-xl" href="#/app/mentoring">${icon('users')}<span>${plural(org.credits.mentor, 'mentor session', 'mentor sessions')}</span></a>
    ${paceChip}
    ${bellMenu(ctx, unread)}
    <a class="btn btn--on-dark-ghost btn--icon hide-below-xl" href="#/app/help" aria-label="Help & resources">${icon('circle-question-mark')}</a>
    ${moreMenu(org, unread)}`;
}

export function renderHeader(ctx, variant, toggle) {
  const role = ctx.persona.role;
  let middle = '<div class="portal-header__spacer"></div>';
  if (role === 'lead' && ctx.org) middle = searchForm('header');
  else if (variant === 'backoffice') middle = `<span class="team-badge team-badge--bvt">BVT Team · ${role === 'verifier' ? 'Verifier' : 'Mentor'}</span><div class="portal-header__spacer"></div>`;
  else if (role === 'partner') middle = '<span class="team-badge">Partner portal</span><div class="portal-header__spacer"></div>';

  return `
    <header class="portal-header on-dark">
      <button type="button" class="btn btn--on-dark-ghost btn--icon" data-sidebar-toggle data-focus-key="sidebar-toggle" aria-controls="sidebar"
        aria-expanded="${toggle.expanded}" aria-label="${toggle.label}">${icon(toggle.icon)}</button>
      <div class="portal-header__brand">${logo({ href: `#${ctx.persona.landing}` })}</div>
      ${middle}
      <div class="portal-header__actions">
        ${role === 'lead' && ctx.org ? leadActions(ctx) : ''}
        ${role === 'member' ? memberActions() : ''}
        ${accountMenu(ctx)}
      </div>
    </header>`;
}
