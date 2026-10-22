// Form helpers: labelled fields with hint and error slots, and validation that sets aria-invalid,
// links the error with aria-describedby, and returns the first invalid control to focus.
import { esc } from '../util.js';
import { icon, renderIcons } from './icon.js';

/** field({ id, name, label, control, hint, optional }) — `control` is trusted HTML using id `${prefix}-${name}`. */
export function field({ id, label, control, hint = '', optional = false }) {
  return `
    <div class="field">
      <label class="field__label" for="${id}">${esc(label)}${optional ? ' <span class="field__optional">(optional)</span>' : ''}</label>
      ${control}
      ${hint ? `<p class="field__hint" id="${id}-hint">${esc(hint)}</p>` : ''}
      <p class="field__error" id="${id}-err" hidden></p>
    </div>`;
}

/** Yes/No radio pair as a fieldset. */
export function yesNo({ name, legend, value = 'no', idPrefix }) {
  return `
    <fieldset class="fieldset yes-no">
      <legend>${esc(legend)}</legend>
      <div class="cluster">
        ${['yes', 'no'].map((v) => `
          <label class="option option--inline"><input type="radio" name="${name}" id="${idPrefix}-${name}-${v}" value="${v}"${value === v ? ' checked' : ''}><span>${v === 'yes' ? 'Yes' : 'No'}</span></label>`).join('')}
      </div>
    </fieldset>`;
}

/**
 * validateForm(form, { fieldName: (value, form) => 'error message' | '' }, idPrefix)
 * @returns {HTMLElement|null} the first invalid control
 */
export function validateForm(form, rules, idPrefix) {
  let first = null;
  Object.entries(rules).forEach(([name, rule]) => {
    const control = form.elements[name];
    const value = control.type === 'checkbox' ? control.checked : String(control.value ?? '').trim();
    const msg = rule(value, form);
    const err = form.querySelector(`#${idPrefix}-${name}-err`);
    const hint = form.querySelector(`#${idPrefix}-${name}-hint`);
    control.setAttribute('aria-invalid', msg ? 'true' : 'false');
    const describedBy = [hint?.id, msg ? err?.id : null].filter(Boolean).join(' ');
    if (describedBy) control.setAttribute('aria-describedby', describedBy);
    else control.removeAttribute('aria-describedby');
    if (err) {
      err.hidden = !msg;
      err.innerHTML = msg ? `${icon('circle-alert')}${esc(msg)}` : '';
    }
    if (msg && !first) first = control;
  });
  renderIcons(form);
  return first;
}

export const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v);
