// #/sign-in — pretend sign-in. In the prototype you choose who you are; nothing is checked or sent.
import { PERSONAS, PERSONA_ORDER } from '../../../data/users.js';
import { PROTOTYPE_NOTE } from '../../../data/copy.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { field, validateForm, isEmail } from '../../components/form.js';
import { showToast } from '../../components/toast.js';
import { switchPersona } from '../../session.js';

export function render() {
  const people = PERSONA_ORDER.filter((id) => id !== 'visitor').map((id) => PERSONAS[id]);
  return `
    <div class="container auth">
      <div class="auth__intro stack">
        <p class="eyebrow">Welcome back</p>
        <h1 class="h2 rule">Sign in to <span class="accent">BVT Academy</span></h1>
        <form class="stack" data-signin novalidate aria-label="Sign in with email">
          ${field({ id: 'si-email', label: 'Work email', hint: 'We’ll email you a sign-in link.', control: '<input class="input" id="si-email" name="email" type="email" autocomplete="email">' })}
          <button class="btn btn--action" type="submit">Send sign-in link${icon('mail')}</button>
        </form>
        <p class="text-3">New here? <a href="#/sign-up">Start your free check</a></p>
      </div>
      <section class="card stack auth__form" aria-labelledby="signin-demo-h">
        <h2 class="h3" id="signin-demo-h">Prototype: choose who you are</h2>
        <p class="text-2">Each person opens the prototype in a different situation.</p>
        <ul class="persona-list">
          ${people.map((p) => `
            <li><button type="button" class="persona-btn" data-sign-in-as="${p.id}">
              <span class="avatar" aria-hidden="true">${esc(p.initials)}</span>
              <span class="persona-btn__text"><strong>${esc(p.name)}, ${esc(p.title)}</strong><span>${esc(p.summary)}</span></span>
              ${icon('arrow-right')}
            </button></li>`).join('')}
        </ul>
        <p class="text-3">${icon('shield-check')} ${PROTOTYPE_NOTE}.</p>
      </section>
    </div>`;
}

export function bind(root) {
  root.querySelectorAll('[data-sign-in-as]').forEach((b) => b.addEventListener('click', () => {
    const p = PERSONAS[b.dataset.signInAs];
    switchPersona(p.id);
    showToast(`Signed in as ${p.name}`, { text: 'Pretend sign-in — nothing was checked.', iconName: 'user' });
  }));
  const form = root.querySelector('[data-signin]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const invalid = validateForm(form, { email: (v) => (isEmail(v) ? '' : 'Enter your work email.') }, 'si');
    if (invalid) { invalid.focus(); return; }
    showToast('Sign-in link sent (pretend)', { text: 'Nothing was sent. Use “choose who you are” to sign in.', iconName: 'mail' });
  });
}
