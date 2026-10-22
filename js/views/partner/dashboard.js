// #/partner/dashboard (§8.15): referred clients, the stage funnel, and clients who may need a nudge.
import { PARTNER as P } from '../../../data/connectPage.js';
import { PARTNERS } from '../../../data/partners.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { partnerRows, needsAttention, stageCounts } from '../../connectSelectors.js';

export function render(ctx) {
  const partner = PARTNERS[ctx.persona.partnerId];
  const rows = partnerRows(ctx.state, partner.id, ctx.today);
  const counts = stageCounts(rows);
  const max = Math.max(1, ...counts.map((c) => c.n));
  const attn = needsAttention(rows, ctx.today);
  return `
    <div class="page partner-page">
      <header class="page-header"><p class="eyebrow">${esc(partner.type)} · ${esc(partner.city)} ${esc(partner.state)}</p><h1>${esc(partner.name)}</h1><p class="lead">${esc(P.lead)}</p></header>
      <div class="partner-top">
        <section class="card stack" aria-labelledby="pd-n-h">
          <h2 class="dash-title" id="pd-n-h">Clients</h2>
          <p class="dash-big">${icon('users')}${esc(P.referred(rows.length))}</p>
          <div class="cluster"><a class="btn btn--action" href="#/partner/refer">${icon('user-plus')}${esc(P.refer)}</a><a class="btn btn--outline" href="#/partner/clients">All clients</a></div>
        </section>
        <section class="card stack" aria-labelledby="pd-f-h">
          <h2 class="h3" id="pd-f-h">${esc(P.funnel)}</h2>
          <ol class="funnel">${counts.map((c) => `
            <li class="funnel__row"><span class="funnel__label">${esc(c.label)}</span>
              <span class="funnel__bar" aria-hidden="true"><span style="width:${Math.round((c.n / max) * 100)}%"></span></span>
              <span class="funnel__n">${c.n}<span class="sr-only"> ${c.n === 1 ? 'client' : 'clients'}</span></span></li>`).join('')}</ol>
        </section>
      </div>
      <section class="card stack" aria-labelledby="pd-a-h">
        <h2 class="h3" id="pd-a-h">${esc(P.attention)}</h2>
        ${attn.length ? `<ul class="attn-list">${attn.map((a) => `
          <li><a class="attn-row" data-tone="${a.why === 'catch-up' ? 'changes' : a.why === 'referred' ? 'neutral' : 'evidence'}" href="#/partner/clients/${esc(a.row.orgId ?? a.row.id)}">
            <span class="attn-row__icon">${icon(a.why === 'referred' ? 'mail' : a.why === 'catch-up' ? 'footprints' : 'clock')}</span>
            <span class="attn-row__text">${esc(a.row.name)}<span class="attn-row__meta">${esc(a.why === 'quiet' ? P.why.quiet(a.days) : P.why[a.why])}</span></span>${icon('chevron-right')}</a></li>`).join('')}</ul>`
          : `<p class="text-2">${esc(P.attentionNone)}</p>`}
      </section>
      <p class="text-3">${icon('shield-check')} ${esc(P.consentNote)}</p>
    </div>`;
}
