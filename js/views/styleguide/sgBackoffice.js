// Styleguide: back-office components (Phase 14) — the assistive Ali pre-check, the conflict guard,
// age chips and the document preview. Mentor views have no verify controls.
import { REVIEW as R, QUEUE as Q } from '../../../data/backoffice.js';
import { icon } from '../../components/icon.js';
import { section, example } from './layout.js';

const sla = (d) => { const s = Q.sla(d); const cls = { ok: 'chip--st-verified', soon: 'chip--st-evidence', over: 'chip--st-changes' }[s.tone]; return `<span class="chip ${cls}">${icon(s.icon)}${s.label}</span>`; };

export const backofficeSection = () => section('backoffice', 'Back-office', 'The pre-check is labelled as a suggestion. The conflict guard blocks decisions and says why.', `
  <div class="stack stack-lg">
    ${example('Waiting time against the target', `<div class="cluster">${sla(1)}${sla(5)}${sla(10)}</div>`)}
    <div class="sg-grid-2">
      ${example('Ali pre-check (assistive)', `<section class="card stack precheck" aria-label="Example"><div class="dash-row"><p class="h3">${icon('sparkles')}${R.precheck}</p><span class="chip chip--reason">${R.precheckTag}</span></div>
        <ul class="precheck__list"><li class="is-pass">${icon('circle-check')}<span>Dated within 12 months <span class="precheck__state">· found</span></span></li><li class="is-miss">${icon('circle-x')}<span>Signature found <span class="precheck__state">· not found</span></span></li></ul></section>`)}
      ${example('Conflict guard', `<p class="callout callout--changes">${icon('lock')}<span><strong>${R.conflictTitle}</strong> ${R.conflictText}</span></p>
        <div class="decision-actions"><button type="button" class="btn btn--outline" disabled>${icon('pencil-line')}${R.changes}</button><button type="button" class="btn btn--action" disabled>${icon('shield-check')}${R.verify}</button></div>`)}
    </div>
    ${example('Document preview (prototype)', `<div class="sg-board"><figure class="doc-mock"><div class="doc-mock__page" aria-hidden="true"><span class="doc-mock__title"></span><span class="doc-mock__line" style="width:90%"></span><span class="doc-mock__line" style="width:80%"></span><span class="doc-mock__line" style="width:70%"></span><span class="doc-mock__sign"></span></div><figcaption>${icon('file')} coi-register.pdf · 88 KB</figcaption></figure></div>`)}
  </div>`);
