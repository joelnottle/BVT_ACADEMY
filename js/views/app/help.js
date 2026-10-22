// #/app/help — Help & resources: three ways to get help (Ali, mentor, contact BVT), how the Academy works,
// what each status means, keyboard shortcuts and FAQs. Contact is pretend: a toast, nothing is sent.
import { HELP as H } from '../../../data/help.js';
import { STEPS, STATUS } from '../../../data/copy.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { statusChip, typeChip } from '../../components/chips.js';
import { faq } from '../../components/marketing.js';
import { showToast } from '../../components/toast.js';

function way(w) {
  const action = w.id === 'ali'
    ? `<button type="button" class="btn btn--action" data-open-ali>${icon('message-circle')}${esc(w.action)}</button>`
    : w.href ? `<a class="btn btn--outline" href="#${esc(w.href)}">${icon('calendar-plus')}${esc(w.action)}</a>`
      : `<button type="button" class="btn btn--outline" data-contact>${icon('send')}${esc(w.action)}</button>`;
  return `
    <li class="card stack">
      <span class="icon-tile">${icon(w.icon)}</span>
      <h2 class="card__title">${esc(w.title)}</h2>
      <p class="text-2">${esc(w.text)}</p>
      ${w.id === 'contact' ? `<p class="text-3">${esc(H.contactEmail)} · ${esc(H.contactNote)}</p>` : ''}
      <div class="help-way__go">${action}</div>
    </li>`;
}

export function render() {
  return `
    <div class="page help-page">
      <header class="page-header"><h1>Help &amp; resources</h1><p class="lead">${esc(H.lead)}</p></header>
      <ul class="hub-cards help-ways">${H.ways.map(way).join('')}</ul>

      <section class="card stack" aria-labelledby="help-how-h">
        <h2 class="h3" id="help-how-h">${esc(H.howTitle)}</h2>
        <p class="text-2">${esc(H.howLead)}</p>
        <dl class="help-types">${H.types.map((t) => `<div><dt>${typeChip(t.type)}</dt><dd>${esc(t.text)}</dd></div>`).join('')}</dl>
        <h3 class="card__title">${esc(H.loopTitle)}</h3>
        <ol class="help-loop">${STEPS.map((s, i) => `<li><span class="help-loop__n" aria-hidden="true">${i + 1}</span>${icon(s.icon)}<span><strong>${esc(s.label)}</strong>${s.optional ? ' <span class="text-3">· Optional</span>' : ''}<br><span class="text-2">${esc(s.blurb)}</span></span></li>`).join('')}</ol>
        <p class="text-3">${icon('info')} ${esc(H.loopNote)}</p>
      </section>

      <section class="card stack" aria-labelledby="help-st-h">
        <h2 class="h3" id="help-st-h">${esc(H.statusTitle)}</h2>
        <dl class="settings-list help-status">${Object.keys(STATUS).map((k) => `<div><dt>${statusChip(k)}</dt><dd>${esc(H.statuses[k])}</dd></div>`).join('')}</dl>
      </section>

      <section class="card stack" aria-labelledby="help-kb-h">
        <h2 class="h3" id="help-kb-h">${esc(H.shortcutsTitle)}</h2>
        <dl class="settings-list">${H.shortcuts.map(([k, v]) => `<div><dt><kbd class="kbd">${esc(k)}</kbd></dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      </section>

      <section class="stack" aria-labelledby="help-faq-h">
        <h2 class="h3" id="help-faq-h">${esc(H.faqTitle)}</h2>
        ${faq(H.faq)}
      </section>
    </div>`;
}

export function bind(root) {
  root.querySelector('[data-contact]')?.addEventListener('click', () => showToast(H.contactToast, { text: H.contactToastText, iconName: 'mail' }));
}
