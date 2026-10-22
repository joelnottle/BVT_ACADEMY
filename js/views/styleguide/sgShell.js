// Styleguide: portal shell pieces — sidebar nav states, mini status, header menus, badges, page header.
import { icon } from '../../components/icon.js';
import { readinessRing } from '../../components/progress.js';
import { section, pair, example } from './layout.js';

const navLink = ({ label, iconName, current, meta, metaLabel, lock }) => `
  <a class="nav-link" href="#/styleguide/shell" data-label="${label}"${current ? ` aria-current="${current}"` : ''}>
    ${iconName ? icon(iconName) : ''}
    <span class="nav-link__text"><span class="nav-link__label">${label}</span>${lock ? `<span class="nav-link__sub" aria-hidden="true">${lock}</span>` : ''}</span>
    ${lock ? `<span class="nav-link__meta">${icon('lock')}<span class="sr-only">, locked: ${lock}</span></span>` : ''}
    ${meta ? `<span class="nav-link__meta"><span aria-hidden="true">${meta}</span><span class="sr-only">, ${metaLabel}</span></span>` : ''}
  </a>`;

const sidebarSample = `
  <div class="sg-sidebar">
    <div class="sidebar-status">
      ${readinessRing({ verified: 10, claimed: 9, total: 45, size: 'sm' })}
      <p class="sidebar-status__text">
        <span class="sidebar-status__title">22% verified · Core</span>
        <span class="sidebar-status__detail">${icon('gauge')}<span>On pace</span></span>
      </p>
    </div>
    <ul class="nav-list">
      <li>${navLink({ label: 'Dashboard', iconName: 'layout-dashboard', current: 'page' })}</li>
      <li>${navLink({ label: 'My Check & Score', iconName: 'clipboard-check' })}</li>
      <li>${navLink({ label: 'Financial Management', meta: '4/9', metaLabel: '4 of 9 verified' })}</li>
      <li>${navLink({ label: 'Enterprise hub', iconName: 'briefcase', lock: 'From July 2027' })}</li>
    </ul>
  </div>`;

const menuSample = `
  <div class="sg-menu-demo">
    <div class="menu sg-static-menu">
      <div class="menu__head"><strong>Sam Rivera</strong><span>CEO · Kestrel Community Services Ltd</span></div>
      <ul class="menu__list">
        <li><a class="menu__item" href="#/styleguide/shell">${icon('award')}Profile & recognition</a></li>
        <li><a class="menu__item" href="#/styleguide/shell">${icon('building')}Organisation</a></li>
        <li class="menu__sep"><button type="button" class="menu__item">${icon('log-out')}Sign out</button></li>
      </ul>
    </div>
  </div>`;

const headerBits = `
  <div class="stack">
    ${example('Avatar button (opens the account menu)', `<button type="button" class="avatar-btn" aria-label="Account menu, Sam Rivera"><span class="avatar" aria-hidden="true">SR</span>${icon('chevron-down')}</button>`)}
    ${example('Header badges', '<div class="cluster"><span class="team-badge">BVT Team</span><span class="team-badge">Partner portal</span></div>')}
    ${example('Header search', `<div class="portal-search" role="search">
      <label class="sr-only" for="sg-search">Search the Academy</label>${icon('search')}
      <input class="portal-search__input" id="sg-search" type="search" placeholder="Search the Academy"><kbd class="portal-search__kbd" aria-hidden="true">⌘K</kbd></div>`)}
  </div>`;

const pageSample = `
  <div class="sg-panel">
    <header class="page-header">
      <p class="eyebrow">Academy</p>
      <p class="h2">Page title</p>
      <p class="lead">One sentence on what this page is for.</p>
    </header>
    <div class="card card--flat placeholder-card" style="margin-top:var(--sp-5)">
      <p class="placeholder-flag">${icon('construction')}Placeholder — this page is built in Phase 6</p>
      <p class="text-2">Routes that exist before their page is built show this card, so navigation never dead-ends.</p>
    </div>
  </div>`;

export const shellSection = () => section('shell', 'Portal shell',
  'Sidebar links: default, current (gradient bar + <code>aria-current</code>), with a count, and locked (lock + reason). Menus are light panels even in the dark frame.',
  `${pair(menuSample, `<div class="stack stack-lg">${example("Sidebar", sidebarSample)}${headerBits}</div>`)}${pageSample}`);
