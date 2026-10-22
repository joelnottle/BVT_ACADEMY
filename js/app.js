// Boot. Phase 0: renders #/styleguide only. Phase 1 replaces this with router.js, layouts and the store.
import { renderIcons } from './components/icon.js';
import { logo } from './components/brand.js';
import { renderStyleguide, bindStyleguide } from './views/styleguide/index.js';

const app = document.getElementById('app');

function placeholder() {
  return `
    <main id="main" class="container sg-placeholder" tabindex="-1">
      ${logo({ href: '#/styleguide' })}
      <h1 class="h2">The prototype is being built</h1>
      <p class="lead">Only the styleguide exists so far. Routes, layouts and pages arrive from Phase 1.</p>
      <p><a class="btn btn--action" href="#/styleguide">Open the styleguide</a></p>
    </main>`;
}

function render() {
  const path = location.hash.replace(/^#/, '') || '/';
  const [, first, second] = path.split('/');

  // Each render gets a fresh container, so listeners bound by the previous view are dropped with it.
  const view = document.createElement('div');
  if (first === 'styleguide') {
    view.innerHTML = renderStyleguide();
    app.replaceChildren(view);
    bindStyleguide(view, second);
  } else {
    view.innerHTML = placeholder();
    app.replaceChildren(view);
  }
  renderIcons(view);
  if (!second) window.scrollTo(0, 0);
}

// Skip link: focus <main> without touching the hash (the hash is the router's).
document.addEventListener('click', (e) => {
  if (!e.target.closest('.skip-link')) return;
  e.preventDefault();
  const main = document.getElementById('main');
  main?.focus();
  main?.scrollIntoView();
});

window.addEventListener('hashchange', render);
render();
