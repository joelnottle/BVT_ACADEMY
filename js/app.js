// Boot: router → layout → view. Re-renders on route change (focus moves to the page h1)
// and on store change (focus and scroll are kept where they were).
import { ROUTES } from './routes.js';
import { parseHash, matchRoute, startRouter } from './router.js';
import { getState, subscribe, currentPersona, currentOrg, today } from './store.js';
import { renderIcons } from './components/icon.js';
import { showToast } from './components/toast.js';
import './components/disclosure.js';
import { renderPublic } from './layouts/public.js';
import { renderPortal, bindPortal } from './layouts/portal.js';
import { placeholderView, notFoundView, wrongRoleView } from './views/system.js';
import { switchPersona } from './session.js';
import { mountDemoPanel } from './demo-panel.js';

const app = document.getElementById('app');

const LAYOUTS = {
  public: { render: renderPublic },
  portal: { render: (ctx, html) => renderPortal(ctx, html, 'portal'), bind: bindPortal },
  backoffice: { render: (ctx, html) => renderPortal(ctx, html, 'backoffice'), bind: bindPortal },
  bare: { render: (ctx, html) => html },
};

/** Where an unknown path should render its 404: inside the portal if the persona belongs there. */
function layoutForUnknown(path, persona) {
  if (path.startsWith('/app/') && ['lead', 'member'].includes(persona.role)) return 'portal';
  if (path.startsWith('/partner/') && persona.role === 'partner') return 'portal';
  if (path.startsWith('/team/') && ['verifier', 'mentor'].includes(persona.role)) return 'backoffice';
  return 'public';
}

async function resolve(path, persona) {
  const m = matchRoute(ROUTES, path);
  if (!m) {
    return { route: { path, layout: layoutForUnknown(path, persona), title: 'Page not found' }, params: {}, view: notFoundView };
  }
  if (m.route.roles && !m.route.roles.includes(persona.role)) {
    return { route: { ...m.route, layout: 'public' }, params: m.params, view: wrongRoleView };
  }
  const view = m.route.load ? await m.route.load() : placeholderView;
  return { route: m.route, params: m.params, view };
}

function focusHeading(root) {
  const h1 = root.querySelector('#main h1') ?? root.querySelector('#main');
  if (!h1) return;
  h1.tabIndex = -1;
  h1.focus({ preventScroll: true });
}

let renderToken = 0;
let renderedHash = null;

async function render({ routeChange = false, initial = false } = {}) {
  const token = ++renderToken;
  const hash = window.location.hash;
  const { path, query } = parseHash(hash);
  const state = getState();
  const persona = currentPersona(state);
  const { route, params, view } = await resolve(path, persona);
  if (token !== renderToken) return; // a newer render started while this one loaded its view

  const ctx = { path, query, params, route, state, persona, org: currentOrg(state), today: today(state) };
  const layout = LAYOUTS[route.layout] ?? LAYOUTS.public;

  // Keep focus and scroll on store-driven re-renders
  const active = document.activeElement;
  const hadFocus = app.contains(active) && active !== document.body;
  const focusSel = !routeChange && hadFocus
    ? (active.id && `#${CSS.escape(active.id)}`) || (active.dataset.focusKey && `[data-focus-key="${active.dataset.focusKey}"]`)
    : null;
  const scrollY = window.scrollY;

  const root = document.createElement('div');
  root.className = 'app-root';
  root.innerHTML = layout.render(ctx, view.render(ctx));
  app.replaceChildren(root);
  renderedHash = hash;

  layout.bind?.(root, ctx);
  view.bind?.(root, ctx);
  renderIcons(root);
  document.title = `${route.title} — BVT Academy`;

  if (routeChange) {
    window.scrollTo(0, 0);
    if (!initial) focusHeading(root);
  } else {
    window.scrollTo(0, scrollY);
    const target = focusSel && root.querySelector(focusSel);
    // If the focused control no longer exists (e.g. after "View this page as…"), start at the page heading
    if (target) {
      target.focus({ preventScroll: true });
      // A re-rendered text field gets its caret back at the end (live search)
      try { if (typeof target.value === 'string') target.setSelectionRange(target.value.length, target.value.length); } catch { /* not a text field */ }
    }
    else if (hadFocus) focusHeading(root);
  }
}

// "View this page as…" buttons on the switch-view page
app.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-switch-persona]');
  if (btn) switchPersona(btn.dataset.switchPersona, { to: parseHash().path });
});

// Placeholder links (social, email): explain instead of leaving the prototype
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-pretend]');
  if (!a) return;
  e.preventDefault();
  showToast('Placeholder link', { text: a.dataset.pretend, iconName: 'info' });
});

// Skip link: focus <main> without touching the hash (the hash belongs to the router)
document.addEventListener('click', (e) => {
  if (!e.target.closest('.skip-link')) return;
  e.preventDefault();
  const main = document.getElementById('main');
  main?.focus();
  main?.scrollIntoView();
});

// Store changes re-render the current route — unless the hash has just changed,
// in which case the pending hashchange will render the new route.
subscribe(() => {
  if (window.location.hash === renderedHash) render();
});

mountDemoPanel();
startRouter(render);
