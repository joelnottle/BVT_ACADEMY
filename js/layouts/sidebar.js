// Dark sidebar (§7.3): logo, mini status, search (drawer only), nav with the By area tree.
// Active item: --navy-700 + gradient bar + aria-current. Locked items show a lock and say why.
import { TIERS, PACE } from '../../data/copy.js';
import { esc } from '../util.js';
import { icon } from '../components/icon.js';
import { logo } from '../components/brand.js';
import { readinessRing } from '../components/progress.js';
import { verifiedReadiness, paceStatus, isAccredited, coreLocked, pathwayProgress } from '../selectors.js';
import { navFor, currentHref } from './navConfig.js';

export function searchForm(where) {
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  return `
    <form class="portal-search portal-search--${where}" role="search" data-portal-search>
      <label class="sr-only" for="search-${where}">Search requirements, modules and evidence</label>
      ${icon('search')}
      <input class="portal-search__input" id="search-${where}" type="search" placeholder="Search the Academy" autocomplete="off">
      ${where === 'header' ? `<kbd class="portal-search__kbd" aria-hidden="true">${isMac ? '⌘K' : 'Ctrl K'}</kbd>` : ''}
    </form>`;
}

function miniStatus({ state, org, today }) {
  const r = verifiedReadiness(state, org);
  const tier = TIERS[org.tier]?.label ?? '';
  let title;
  let detail;
  if (isAccredited(org)) {
    title = 'Accredited';
    detail = `${icon('award')}<span>${esc(org.certNo)}</span>`;
  } else if (coreLocked(state, org)) {
    const p = pathwayProgress(state, org);
    title = `${tier} · Pathway first`;
    detail = `${icon('route')}<span>Start-up pathway ${p.done} of ${p.total}</span>`;
  } else {
    const pace = PACE[paceStatus(state, org, today).status];
    title = `${r.pct}% verified · ${tier}`;
    detail = `${icon(pace.icon)}<span>${pace.label}</span>`;
  }
  return `
    <div class="sidebar-status">
      ${readinessRing({ verified: r.verified, claimed: r.claimed, total: r.total, size: 'sm' })}
      <p class="sidebar-status__text">
        <span class="sidebar-status__title">${esc(title)}</span>
        <span class="sidebar-status__detail">${detail}</span>
      </p>
    </div>`;
}

function link(item, cur, { sub = false } = {}) {
  const isCur = cur.href === item.href;
  const aria = isCur ? ` aria-current="${cur.exact ? 'page' : 'true'}"` : '';
  let meta = '';
  if (item.lock) {
    meta = `<span class="nav-link__meta">${icon('lock')}<span class="sr-only">, locked: ${esc(item.lock)}</span></span>`;
  } else if (item.meta) {
    meta = `<span class="nav-link__meta"><span aria-hidden="true">${esc(item.meta)}</span><span class="sr-only">, ${esc(item.metaLabel)}</span></span>`;
  }
  const sublabel = item.lock && !sub ? `<span class="nav-link__sub" aria-hidden="true">${esc(item.lock)}</span>` : '';
  return `
    <a class="nav-link${sub ? ' nav-link--sub' : ''}" href="#${esc(item.href)}" data-label="${esc(item.label)}"${aria}>
      ${item.icon ? icon(item.icon) : ''}
      <span class="nav-link__text"><span class="nav-link__label">${esc(item.label)}</span>${sublabel}</span>
      ${meta}
    </a>`;
}

function treeItem(item, cur, open) {
  const childCurrent = item.children.some((c) => c.href === cur.href);
  const expanded = open || childCurrent;
  return `
    <li class="nav-tree">
      <div class="nav-tree__row">
        ${link(item, cur)}
        <button type="button" class="nav-tree__toggle" id="nav-areas-toggle" data-area-toggle
          aria-expanded="${expanded}" aria-controls="nav-areas" aria-label="Areas">${icon('chevron-down')}</button>
      </div>
      <ul class="nav-sublist" id="nav-areas"${expanded ? '' : ' hidden'}>
        ${item.children.map((c) => `<li>${link(c, cur, { sub: true })}</li>`).join('')}
      </ul>
    </li>`;
}

function group(g, i, cur, ui) {
  const labelId = g.label ? `nav-group-${i}` : '';
  return `
    <div class="nav-group${g.divider ? ' nav-group--divider' : ''}">
      ${g.label ? `<p class="nav-group__label" id="${labelId}">${esc(g.label)}</p>` : ''}
      <ul class="nav-list"${labelId ? ` aria-labelledby="${labelId}"` : ''}>
        ${g.items.map((item) => (item.children ? treeItem(item, cur, ui.areaTreeOpen) : `<li>${link(item, cur)}</li>`)).join('')}
      </ul>
    </div>`;
}

export function renderSidebar(ctx) {
  const groups = navFor(ctx);
  const cur = currentHref(groups, ctx);
  const isLead = ctx.persona.role === 'lead' && ctx.org;
  return `
    <aside class="sidebar on-dark" id="sidebar" aria-label="Sidebar">
      <div class="sidebar__brand">
        ${logo({ href: `#${ctx.persona.landing}`, withMark: true })}
        <button type="button" class="btn btn--on-dark-ghost btn--icon sidebar__close" data-sidebar-close aria-label="Close navigation">${icon('x')}</button>
      </div>
      ${isLead ? miniStatus(ctx) : ''}
      ${isLead ? searchForm('sidebar') : ''}
      <nav class="sidebar__nav" aria-label="Main">
        ${groups.map((g, i) => group(g, i, cur, ctx.state.ui)).join('')}
      </nav>
    </aside>`;
}
