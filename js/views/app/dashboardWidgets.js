// Dashboard widgets (BUILD_PLAN §8.4). Every widget links somewhere specific: a pre-filtered lens,
// a requirement step, or the page that owns that number.
import { DASHBOARD as D } from '../../../data/dashboard.js';
import { PATHWAYS } from '../../../data/pathways.js';
import { REQ_BY_ID } from '../../../data/requirements.js';
import { ALI_DEFAULT_PROMPTS, ALI_SCRIPTS } from '../../../data/ali.js';
import { esc, formatDate, clamp } from '../../util.js';
import { icon } from '../../components/icon.js';
import { readinessRing } from '../../components/progress.js';
import { reasonTag, pacePill } from '../../components/chips.js';
import { tierLadder } from '../../components/tierLadder.js';
import { lensHref } from '../../lens.js';
import { enterpriseOpen } from '../../selectors.js';

const title = (id, text) => `<h2 class="dash-title" id="${id}">${esc(text)}</h2>`;
const arrowLink = (href, text) => `<a class="dash-link" href="${esc(href)}">${esc(text)}${icon('arrow-right')}</a>`;

export function focusCard(f, ctx) {
  if (!f) {
    const open = enterpriseOpen(ctx.org, ctx.today);
    return `
      <section class="card card--highlight dash-focus" aria-labelledby="dash-focus-h">
        ${title('dash-focus-h', D.accredited.title)}
        <p class="dash-focus__req">${esc(ctx.org.name)} is accredited</p>
        <p class="text-2">${esc(D.accredited.text(ctx.org.certNo))} · ${esc(formatDate(ctx.org.accreditedOn))}</p>
        <div class="cluster">
          <a class="btn btn--action" href="#${open ? '/app/enterprise' : '/app/accreditation'}">${open ? 'Open the Enterprise hub' : D.accredited.action}${icon('arrow-right')}</a>
        </div>
      </section>`;
  }
  const step = `Step ${f.stepNumber} of 7: ${f.stepLabel}${f.checklist ? ` · checklist ${f.checklist.done} of ${f.checklist.total} done` : ''}`;
  const sub = f.mode === 'resume' && f.lastActivity
    ? `Last activity: ${f.lastActivity.text} · ${formatDate(f.lastActivity.on)}`
    : f.why ?? '';
  const t = f.mode === 'resume' ? D.resume : D.start;
  return `
    <section class="card card--highlight dash-focus" aria-labelledby="dash-focus-h">
      ${title('dash-focus-h', t.title)}
      <p class="dash-focus__req"><span class="dash-code">${esc(f.reqId)}</span> ${esc(f.title)}</p>
      <p class="dash-focus__step">${icon('map-pin')}<span>${esc(step)}</span></p>
      ${sub ? `<p class="text-3">${esc(sub)}</p>` : ''}
      <div><a class="btn btn--action" href="${esc(f.href)}">${esc(t.action)}<span class="sr-only"> ${esc(f.reqId)}</span>${icon('arrow-right')}</a></div>
    </section>`;
}

export function attentionCard(items) {
  return `
    <section class="card dash-attn" aria-labelledby="dash-attn-h">
      ${title('dash-attn-h', D.attention.title)}
      ${items.length ? `
        <ul class="attn-list">
          ${items.map((x) => `
            <li><a class="attn-row" data-tone="${x.tone}" href="${esc(x.href)}">
              <span class="attn-row__icon">${icon(x.icon)}</span>
              <span class="attn-row__text">${esc(x.text)}${x.meta ? `<span class="attn-row__meta">${esc(x.meta)}</span>` : ''}</span>
              ${icon('chevron-right')}
            </a></li>`).join('')}
        </ul>` : `<p class="text-2">${esc(D.attention.none)}</p>`}
    </section>`;
}

export function readinessCard(r, locked) {
  return `
    <section class="card dash-ready" aria-labelledby="dash-ready-h">
      ${title('dash-ready-h', D.readiness.title)}
      ${readinessRing({ verified: r.verified, claimed: r.claimed, total: r.total })}
      ${r.claimed && !locked ? `
        <p class="dash-ready__claimed"><a href="${esc(lensHref('action', { status: ['evidence-needed'], type: 'in-place' }))}">${esc(D.readiness.claimed(r.claimed))}</a></p>
        <p class="text-3">${esc(D.readiness.hint)}</p>` : ''}
      ${arrowLink(lensHref('area'), D.readiness.all)}
    </section>`;
}

export function paceCard(pace, org) {
  if (pace.accredited) {
    return `
      <section class="card dash-pace" aria-labelledby="dash-pace-h">
        ${title('dash-pace-h', D.accredited.title)}
        <p class="dash-big">${icon('award')}${esc(org.certNo)}</p>
        ${arrowLink('#/app/accreditation', D.accredited.action)}
      </section>`;
  }
  return `
    <section class="card dash-pace" aria-labelledby="dash-pace-h">
      ${title('dash-pace-h', D.pace.title)}
      <p class="dash-big">${esc(D.pace.days(pace.daysLeft))}</p>
      <div class="cluster">${pacePill(pace.status, { prefix: D.pace.toGo(pace.remaining) })}</div>
      ${pace.suggestion ? `<p class="text-2">${esc(pace.suggestion)}</p>` : ''}
      ${arrowLink('#/app/plan', D.pace.action)}
    </section>`;
}

export function ladderCard(tier) {
  return `
    <section class="card dash-ladder" aria-labelledby="dash-ladder-h">
      <div class="dash-row">${title('dash-ladder-h', D.ladder.title)}${arrowLink('#/app/score', 'My Check & Score')}</div>
      ${tierLadder(tier)}
      <p class="text-3">${esc(D.ladder.note)}</p>
    </section>`;
}

export function recommendedCard(rows) {
  return `
    <section class="card dash-rec" aria-labelledby="dash-rec-h">
      <div class="dash-row">${title('dash-rec-h', D.recommended.title)}${arrowLink(lensHref('action'), D.recommended.all)}</div>
      ${rows.length ? `
        <ul class="rec-list">
          ${rows.map((x) => `
            <li><a class="rec-row" href="${esc(x.href)}">
              ${reasonTag(x.reason, { n: x.n })}
              <span class="rec-row__main"><span class="rec-row__title"><span class="dash-code">${esc(x.code)}</span> ${esc(x.title)}</span>
              <span class="rec-row__meta">${esc(x.meta)}</span></span>
              ${icon('chevron-right')}
            </a></li>`).join('')}
        </ul>` : `<p class="text-2">${esc(D.recommended.done)}</p>`}
    </section>`;
}

export function areasCard(domains, locked) {
  return `
    <section class="card dash-areas" aria-labelledby="dash-areas-h">
      ${title('dash-areas-h', D.areas.title)}
      <ul class="area-grid">
        ${domains.map((d) => {
          const { claimed } = d;
          return `
            <li><a class="area-tile" href="#/app/academy/area/${esc(d.id)}">
              <span class="area-tile__head"><span class="area-tile__name">${esc(d.name)}</span>
                ${locked
                  ? `<span class="area-tile__count">${icon('lock')}<span>${esc(D.areas.locked)}</span></span>`
                  : `<span class="area-tile__count">${d.verified}/${d.total}<span class="sr-only"> verified</span></span>`}</span>
              <span class="progress" aria-hidden="true">
                <span class="progress__fill" style="width:${clamp((d.verified / d.total) * 100, 0, 100)}%"></span>
                ${claimed && !locked ? `<span class="progress__fill progress__fill--claimed" style="width:${clamp((claimed / d.total) * 100, 0, 100)}%"></span>` : ''}
              </span>
            </a></li>`;
        }).join('')}
      </ul>
    </section>`;
}

export function weekCard(org) {
  const goal = org.weeklyGoalHrs ?? 2;
  const mins = org.momentum?.thisWeekMins ?? 0;
  const weeks = org.momentum?.activeWeeks ?? 0;
  return `
    <section class="card dash-week" aria-labelledby="dash-week-h">
      ${title('dash-week-h', D.week.title)}
      <p class="dash-week__line">${icon('clock')}<span>${esc(D.week.goal(goal, mins))}</span></p>
      <span class="progress" aria-hidden="true"><span class="progress__fill" style="width:${clamp((mins / (goal * 60)) * 100, 0, 100)}%"></span></span>
      <p class="dash-week__line">${icon('calendar-check')}<span>${esc(D.week.momentum(weeks))}</span></p>
      ${arrowLink('#/app/plan', D.week.action)}
    </section>`;
}

export function recentCard(items) {
  return `
    <section class="card dash-recent" aria-labelledby="dash-recent-h">
      <div class="dash-row">${title('dash-recent-h', D.recent.title)}${arrowLink('#/app/notifications', D.recent.all)}</div>
      ${items.length ? `
        <ul class="recent-list">
          ${items.map((x) => `
            <li><a href="${esc(x.href)}">${icon(x.icon)}<span>${esc(x.text)}</span></a><span class="recent-list__date">${esc(formatDate(x.on))}</span></li>`).join('')}
        </ul>` : `<p class="text-2">${esc(D.recent.none)}</p>`}
    </section>`;
}

/** Dark Ask Ali bar with a prompt drawn from the biggest-gap recommendation. */
export function aliBar(recs) {
  const gap = recs.find((x) => x.reason === 'biggest-gap' && x.reqId);
  // A scripted topic reads naturally ("a good risk register"); otherwise ask where to start on the requirement.
  const req = gap && REQ_BY_ID[gap.reqId];
  const scripted = req && ALI_SCRIPTS.some((x) => x.reqIds?.includes(req.id));
  const prompt = !req ? ALI_DEFAULT_PROMPTS[0] : scripted ? D.ali.prompt(req.title.toLowerCase()) : D.ali.startPrompt(req.id, req.title);
  return `
    <section class="dash-ali on-dark" aria-labelledby="dash-ali-h">
      <span class="dash-ali__icon">${icon('sparkles')}</span>
      <div class="dash-ali__text"><h2 class="dash-title" id="dash-ali-h">${esc(D.ali.title)}</h2><p>“${esc(prompt)}”</p></div>
      <button type="button" class="btn btn--action" data-open-ali>${esc(D.ali.action)}<span class="sr-only"> Ali: ${esc(prompt)}</span></button>
    </section>`;
}

export function lockedBanner(org, pp) {
  const p = PATHWAYS[org.pathway];
  return `
    <section class="callout dash-locked" aria-labelledby="dash-locked-h">
      ${icon('route')}
      <div class="stack stack-sm">
        <h2 class="h3" id="dash-locked-h">${esc(D.locked.title(p.title))}</h2>
        <p>${esc(D.locked.text(pp.done, pp.total))}</p>
        <div><a class="btn btn--outline" href="#/app/pathway">${esc(D.locked.action)}${icon('arrow-right')}</a></div>
      </div>
    </section>`;
}
