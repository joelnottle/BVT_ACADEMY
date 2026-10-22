// Portal and back-office shell (§7.3–7.5, §11). Sidebar modes:
//   ≥1024 'full' or 'rail' (collapse toggle, remembered) · 768–1023 'rail', expands as an 'overlay'
//   <768 'hidden', opens as an off-canvas 'drawer'. Overlay/drawer: scrim, Esc, focus in and back out.
import { ALI } from '../../data/copy.js';
import { icon } from '../components/icon.js';
import { openSlideOver } from '../components/slideOver.js';
import { showToast } from '../components/toast.js';
import { getState, setUi, notify } from '../store.js';
import { signOut } from '../session.js';
import { renderSidebar } from './sidebar.js';
import { renderHeader, toggleState } from './portalHeader.js';

const mqLg = window.matchMedia('(min-width: 1024px)');
const mqMd = window.matchMedia('(min-width: 768px)');

export function sidebarMode(ui) {
  if (mqLg.matches) return ui.sidebarCollapsed ? 'rail' : 'full';
  return mqMd.matches ? 'rail' : 'hidden';
}

export function renderPortal(ctx, content, variant = 'portal') {
  const mode = sidebarMode(ctx.state.ui);
  return `
    <div class="portal portal--${variant}" data-sidebar="${mode}">
      ${renderHeader(ctx, variant, toggleState(mode, mqLg.matches))}
      ${renderSidebar(ctx)}
      <div class="portal__scrim" data-sidebar-close hidden></div>
      <main id="main" class="portal-main" tabindex="-1">${content}</main>
    </div>`;
}

// ---- Overlay / drawer ----
let lockedShell = null;

function openSidebar(shell) {
  shell.dataset.sidebar = mqMd.matches ? 'overlay' : 'drawer';
  shell.querySelector('.portal__scrim').hidden = false;
  shell.querySelector('.portal-header').inert = true;
  shell.querySelector('.portal-main').inert = true;
  shell.querySelector('[data-sidebar-toggle]').setAttribute('aria-expanded', 'true');
  document.body.classList.add('is-scroll-locked');
  lockedShell = shell;
  shell.querySelector('.sidebar [data-sidebar-close]').focus();
}

function closeSidebar(shell, { returnFocus = false } = {}) {
  shell.dataset.sidebar = sidebarMode(getState().ui);
  shell.querySelector('.portal__scrim').hidden = true;
  shell.querySelector('.portal-header').inert = false;
  shell.querySelector('.portal-main').inert = false;
  shell.querySelector('[data-sidebar-toggle]').setAttribute('aria-expanded', 'false');
  document.body.classList.remove('is-scroll-locked');
  lockedShell = null;
  if (returnFocus) shell.querySelector('[data-sidebar-toggle]').focus();
}

const isOpen = (shell) => ['overlay', 'drawer'].includes(shell.dataset.sidebar);

// Navigating from the drawer re-renders the shell closed; release the scroll lock.
window.addEventListener('hashchange', () => {
  if (lockedShell) { document.body.classList.remove('is-scroll-locked'); lockedShell = null; }
});

// Crossing a breakpoint changes the sidebar mode: re-render everything in the right shape.
const onBreakpoint = () => { if (document.querySelector('.portal')) notify(); };
mqLg.addEventListener('change', onBreakpoint);
mqMd.addEventListener('change', onBreakpoint);

// ⌘K / Ctrl+K focuses search (opening the drawer first on small screens)
document.addEventListener('keydown', (e) => {
  if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return;
  const shell = document.querySelector('.portal');
  const header = shell?.querySelector('#search-header');
  if (!header) return;
  e.preventDefault();
  if (header.getClientRects().length) { header.focus(); return; }
  if (!isOpen(shell)) openSidebar(shell);
  shell.querySelector('#search-sidebar')?.focus();
});

// ---- Rail tooltips (labels stay available to screen readers; this is the visual hint) ----
let tip = null;
function showTip(linkEl) {
  if (linkEl.closest('.portal')?.dataset.sidebar !== 'rail') return;
  tip ??= Object.assign(document.createElement('div'), { className: 'rail-tip' });
  tip.setAttribute('aria-hidden', 'true');
  tip.textContent = linkEl.dataset.label;
  const r = linkEl.getBoundingClientRect();
  tip.style.top = `${r.top + r.height / 2}px`;
  tip.style.left = `${r.right + 8}px`;
  document.body.append(tip);
}
const hideTip = () => tip?.remove();

function openAli(org) {
  openSlideOver({
    title: 'Ask Ali',
    iconName: 'sparkles',
    body: `
      <div class="stack">
        <p class="lead">${ALI.intro}</p>
        <p>${icon('sparkles')} ${ALI.creditLine(org.credits.ali)}</p>
        <p class="placeholder-flag">${icon('construction')}Placeholder — conversations with Ali arrive in Phase 9</p>
        <p><a class="btn btn--outline" href="#/app/ali">Open Ask Ali</a></p>
      </div>`,
    footer: ALI.footer,
  });
}

export function bindPortal(root, ctx) {
  const shell = root.querySelector('.portal');
  if (!shell) return;
  hideTip();

  shell.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-sidebar-toggle]')) {
      if (mqLg.matches) setUi({ sidebarCollapsed: !getState().ui.sidebarCollapsed });
      else openSidebar(shell);
    } else if (t.closest('[data-sidebar-close]')) {
      closeSidebar(shell, { returnFocus: true });
    } else if (t.closest('[data-area-toggle]')) {
      setUi({ areaTreeOpen: !getState().ui.areaTreeOpen });
    } else if (t.closest('[data-open-ali]')) {
      openAli(ctx.org);
    } else if (t.closest('[data-sign-out]')) {
      signOut();
    }
  });

  shell.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen(shell)) { e.preventDefault(); closeSidebar(shell, { returnFocus: true }); }
  });

  shell.querySelectorAll('[data-portal-search]').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = form.querySelector('input').value.trim();
    showToast(q ? `Searching for “${q}”` : 'Type something to search', {
      text: 'Search results arrive with the Academy lenses in Phase 7.', iconName: 'search',
    });
  }));

  const nav = shell.querySelector('.sidebar');
  nav.addEventListener('mouseover', (e) => { const a = e.target.closest('.nav-link'); if (a) showTip(a); });
  nav.addEventListener('mouseout', hideTip);
  nav.addEventListener('focusin', (e) => { const a = e.target.closest('.nav-link'); if (a) showTip(a); else hideTip(); });
  nav.addEventListener('focusout', hideTip);
  nav.addEventListener('scroll', hideTip);
}
