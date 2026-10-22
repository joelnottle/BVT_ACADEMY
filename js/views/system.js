// System views: placeholder (route exists, page arrives in a later phase), 404, and "switch view"
// (the current persona can't see this page). Each always offers a way onward — no dead ends.
import { PERSONAS, PERSONA_ORDER, ROLE_LABELS } from '../../data/users.js';
import { esc } from '../util.js';
import { icon } from '../components/icon.js';

function pageHeader(ctx, title, lead) {
  const section = ctx.route?.section;
  return `
    <header class="page-header">
      ${section ? `<p class="eyebrow">${esc(section)}</p>` : ''}
      <h1>${esc(title)}</h1>
      ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
    </header>`;
}

const homeFor = (persona) => persona.landing ?? '/';

// ---- Placeholder ----
export const placeholderView = {
  render(ctx) {
    const { route, params, query } = ctx;
    const entries = [...Object.entries(params), ...Object.entries(query)];
    return `
      <div class="page">
        ${pageHeader(ctx, route.title, route.summary)}
        <section class="card card--flat placeholder-card" aria-label="Build status">
          <p class="placeholder-flag">${icon('construction')}Placeholder — this page is built in Phase ${esc(route.phase)}</p>
          ${entries.length ? `
            <dl class="params">
              ${entries.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd><code>${esc(v)}</code></dd></div>`).join('')}
            </dl>` : ''}
          <p class="text-2">Route <code>#${esc(ctx.path)}</code>. Navigation around it works now.</p>
          <p><a class="btn btn--outline" href="#${esc(homeFor(ctx.persona))}">${icon('arrow-left')}Back to ${ctx.persona.role === 'visitor' ? 'home' : 'your home page'}</a></p>
        </section>
      </div>`;
  },
};

// ---- 404 ----
export const notFoundView = {
  render(ctx) {
    return `
      <div class="page">
        ${pageHeader(ctx, "We couldn't find that page", 'The link may be out of date, or the address mistyped.')}
        <div class="cluster">
          <a class="btn btn--action" href="#${esc(homeFor(ctx.persona))}">Go to ${ctx.persona.role === 'visitor' ? 'the home page' : 'your home page'}</a>
          <a class="btn btn--outline" href="#/">BVT Academy home</a>
        </div>
        <p class="text-3">Requested: <code>#${esc(ctx.path)}</code></p>
      </div>`;
  },
};

// ---- Wrong persona for this route ----
export const wrongRoleView = {
  render(ctx) {
    const roles = ctx.route.roles;
    const who = roles.map((r) => ROLE_LABELS[r]).join(' or ');
    const options = PERSONA_ORDER.map((id) => PERSONAS[id]).filter((p) => roles.includes(p.role));
    return `
      <div class="page">
        ${pageHeader(ctx, ctx.route.title, `This page is for ${who}. You're currently viewing as ${ctx.persona.name}.`)}
        <section class="card card--flat stack" aria-labelledby="switch-h">
          <h2 class="h4" id="switch-h">View this page as</h2>
          <div class="cluster">
            ${options.map((p) => `
              <button type="button" class="btn btn--outline" data-switch-persona="${p.id}">
                ${icon('user')}${esc(p.name)}${p.title ? `, ${esc(p.title)}` : ''}
              </button>`).join('')}
          </div>
          <p class="text-3">Prototype only: the Demo panel (bottom left) switches who you are.</p>
        </section>
        <p><a href="#${esc(homeFor(ctx.persona))}">Or go back to ${ctx.persona.role === 'visitor' ? 'the home page' : 'your home page'}</a></p>
      </div>`;
  },
};
