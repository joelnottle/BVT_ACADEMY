// Hash router: "#/app/req/FM-04/upload?from=board" → { path: '/app/req/FM-04/upload', query: { from: 'board' } }.
// Works on any static host — no server rewrites.

export function parseHash(hash = window.location.hash) {
  const raw = hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart = ''] = raw.split('?');
  const path = `/${pathPart.split('/').filter(Boolean).join('/')}`;
  return { path, query: Object.fromEntries(new URLSearchParams(queryPart)) };
}

const decode = (s) => {
  try { return decodeURIComponent(s); } catch { return s; }
};

/** First route whose pattern ("/app/req/:reqId") matches the path segment for segment. */
export function matchRoute(routes, path) {
  const segs = path.split('/').filter(Boolean);
  for (const route of routes) {
    const parts = route.path.split('/').filter(Boolean);
    if (parts.length !== segs.length) continue;
    const params = {};
    const ok = parts.every((part, i) => {
      if (part.startsWith(':')) { params[part.slice(1)] = decode(segs[i]); return true; }
      return part === segs[i];
    });
    if (ok) return { route, params };
  }
  return null;
}

export const href = (path) => `#${path}`;

export function navigate(path) {
  window.location.hash = path;
}

/** Change the URL without a route change (e.g. lens filters): the page re-renders in place,
 *  keeping scroll and focus, and no history entry is added. */
export function replaceHash(path) {
  window.history.replaceState(window.history.state, '', `#${path}`);
  window.dispatchEvent(new Event('hashreplace'));
}

/** Calls onChange({ routeChange: true }) now and on every hash change. */
export function startRouter(onChange) {
  window.addEventListener('hashchange', () => onChange({ routeChange: true }));
  window.addEventListener('hashreplace', () => onChange({ routeChange: false }));
  onChange({ routeChange: true, initial: true });
}
