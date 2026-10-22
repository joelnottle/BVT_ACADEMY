// #/app/connect-profile (§8.13): profile editor with a live preview. Before accreditation it's a preview:
// you can prepare it, but listing on BVT Connect opens only once accredited.
import { CONNECT_PROFILE as C } from '../../../data/account.js';
import { esc } from '../../util.js';
import { icon, renderIcons } from '../../components/icon.js';
import { showToast } from '../../components/toast.js';
import { isAccredited } from '../../selectors.js';
import { connectProfileOf, saveConnectProfile } from '../../accountStore.js';

const F = C.fields;

function preview(org, p, accredited, lead) {
  const chip = accredited
    ? `<span class="chip chip--st-verified">${icon('badge-check')}BVT Accredited</span>`
    : `<span class="chip chip--st-locked">${icon('lock')}Preview — not yet accredited</span>`;
  return `
    <article class="listing listing--profile">
      <div class="listing__main">
        <p class="listing__name">${esc(org.name)}</p>
        <p class="listing__meta">${esc([p.industry, `${p.city} ${p.state}`.trim(), p.size].filter(Boolean).join(' · '))}</p>
      </div>
      <div class="listing__status">${chip}${accredited ? `<span class="listing__cert">${esc(org.certNo)}</span>` : ''}</div>
    </article>
    ${p.description ? `<p class="text-2">${esc(p.description)}</p>` : ''}
    ${p.capabilities.length ? `<ul class="pill-list">${p.capabilities.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
    ${p.showContact ? `<p class="text-3">${icon('user')} Contact: ${esc(lead)}</p>` : ''}
    <p class="text-3">${icon(p.visible && accredited ? 'eye' : 'eye-off')} ${p.visible && accredited ? 'Listed on BVT Connect' : 'Not listed on BVT Connect'}</p>`;
}

const read = (form) => ({
  industry: form.elements.industry.value.trim(),
  city: form.elements.city.value.trim(),
  state: form.elements.state.value,
  size: form.elements.size.value,
  capabilities: form.elements.capabilities.value.split(',').map((x) => x.trim()).filter(Boolean),
  description: form.elements.description.value.trim(),
  showContact: form.elements.showContact.checked,
  visible: form.elements.visible.checked,
});

export function render(ctx) {
  const { org, persona } = ctx;
  const p = connectProfileOf(org);
  const acc = isAccredited(org);
  const lead = org.lead?.name ?? persona.name;
  return `
    <div class="page connect-page">
      <header class="page-header"><h1>Connect profile</h1><p class="lead">${esc(C.lead)}</p></header>
      ${acc ? '' : `<p class="callout callout--cream">${icon('lock')}<span>${esc(C.locked)} <a href="#/app/accreditation">See what’s left</a></span></p>`}
      <div class="connect-grid">
        <form class="card stack connect-form" data-connect novalidate>
          <dl class="connect-fixed">
            <div><dt>${esc(F.name)}</dt><dd>${esc(org.name)}</dd></div>
            <div><dt>${esc(F.abn)}</dt><dd>${esc(org.abn ?? '—')}</dd></div>
            <div><dt>${esc(F.status)}</dt><dd>${acc ? `Accredited · ${esc(org.certNo)}` : 'Not yet accredited'}</dd></div>
            <div><dt>${esc(F.contact)}</dt><dd>${esc(lead)}</dd></div>
          </dl>
          <p class="field__hint">${esc(C.fromCheck)}</p>
          <div class="field"><label class="field__label" for="cp-industry">${esc(F.industry)}</label><input class="input" id="cp-industry" name="industry" value="${esc(p.industry)}"></div>
          <div class="grid-2 connect-loc">
            <div class="field"><label class="field__label" for="cp-city">${esc(F.city)}</label><input class="input" id="cp-city" name="city" value="${esc(p.city)}"></div>
            <div class="field"><label class="field__label" for="cp-state">${esc(F.state)}</label><select class="select" id="cp-state" name="state"><option value="">—</option>${C.states.map((s) => `<option${p.state === s ? ' selected' : ''}>${s}</option>`).join('')}</select></div>
          </div>
          <div class="field"><label class="field__label" for="cp-size">${esc(F.size)}</label><select class="select" id="cp-size" name="size">${C.sizes.map((s) => `<option${p.size === s ? ' selected' : ''}>${s}</option>`).join('')}</select></div>
          <div class="field"><label class="field__label" for="cp-cap">${esc(F.capabilities)}</label><input class="input" id="cp-cap" name="capabilities" value="${esc(p.capabilities.join(', '))}" aria-describedby="cp-cap-hint"><p class="field__hint" id="cp-cap-hint">${esc(F.capabilitiesHint)}</p></div>
          <div class="field"><label class="field__label" for="cp-desc">${esc(F.description)}</label>
            <textarea class="textarea" id="cp-desc" name="description" rows="3" maxlength="${C.maxDescription}" aria-describedby="cp-desc-count">${esc(p.description)}</textarea>
            <p class="field__hint" id="cp-desc-count" data-count>${p.description.length} of ${C.maxDescription} characters</p></div>
          <label class="check"><input type="checkbox" name="showContact"${p.showContact ? ' checked' : ''}><span class="check__text">${esc(F.showContact)}</span></label>
          <label class="check"><input type="checkbox" name="visible"${p.visible && acc ? ' checked' : ''}${acc ? '' : ' disabled'}><span class="check__text">${esc(F.visible)}${acc ? '' : `<span class="check__hint">${esc(F.visibleLocked)}</span>`}</span></label>
          <div class="step-actions"><button type="submit" class="btn btn--action">${icon('save')}${esc(C.save)}</button></div>
        </form>
        <aside class="card connect-preview" aria-labelledby="cp-preview-h">
          <h2 class="dash-title" id="cp-preview-h">${esc(C.preview)}</h2>
          <div data-preview>${preview(org, p, acc, lead)}</div>
        </aside>
      </div>
    </div>`;
}

export function bind(root, ctx) {
  const form = root.querySelector('[data-connect]');
  const box = root.querySelector('[data-preview]');
  const acc = isAccredited(ctx.org);
  let t;
  form.addEventListener('input', () => {
    root.querySelector('[data-count]').textContent = `${form.elements.description.value.length} of ${C.maxDescription} characters`;
    clearTimeout(t);
    t = setTimeout(() => { box.innerHTML = preview(ctx.org, read(form), acc, ctx.org.lead?.name ?? ctx.persona.name); renderIcons(box); }, 150);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const p = read(form);
    saveConnectProfile({ ...p, visible: acc && p.visible });
    showToast(C.saved, { text: acc && p.visible ? C.savedListed : C.savedHidden, iconName: 'circle-check' });
  });
}
