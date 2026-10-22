// Disclosure menus (avatar, More, public mobile menu).
// Markup: <button data-disclosure aria-expanded="false" aria-controls="panel-id"> + <div id="panel-id" hidden>.
// One open at a time. Esc closes and returns focus to the button; outside click or navigation closes.
// Listeners are registered once, on the document, so re-rendered markup needs no binding.

let openBtn = null;

function panelFor(btn) {
  return document.getElementById(btn.getAttribute('aria-controls'));
}

export function closeDisclosure({ returnFocus = false } = {}) {
  if (!openBtn) return;
  const btn = openBtn;
  openBtn = null;
  btn.setAttribute('aria-expanded', 'false');
  const panel = panelFor(btn);
  if (panel) panel.hidden = true;
  if (returnFocus && document.contains(btn)) btn.focus();
}

function openDisclosure(btn) {
  closeDisclosure();
  const panel = panelFor(btn);
  if (!panel) return;
  btn.setAttribute('aria-expanded', 'true');
  panel.hidden = false;
  openBtn = btn;
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-disclosure]');
  if (btn) {
    if (btn === openBtn) closeDisclosure();
    else openDisclosure(btn);
    return;
  }
  if (!openBtn) return;
  const panel = panelFor(openBtn);
  // Clicking a link or button inside the panel acts, then closes; clicking elsewhere just closes.
  if (!panel || !panel.contains(e.target) || e.target.closest('a, button')) closeDisclosure();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && openBtn) {
    e.preventDefault();
    closeDisclosure({ returnFocus: true });
  }
});

// Close when keyboard focus leaves both the button and its panel
document.addEventListener('focusin', (e) => {
  if (!openBtn) return;
  const panel = panelFor(openBtn);
  if (e.target !== openBtn && !panel?.contains(e.target)) closeDisclosure();
});

window.addEventListener('hashchange', () => closeDisclosure());
