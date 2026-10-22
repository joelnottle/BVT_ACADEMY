// #/styleguide/data — debug page: assertions against §6.2, then each persona's selector outputs.
import { PERSONAS } from '../../../data/users.js';
import { STATUS, REASONS, PACE, TIERS, PROTOTYPE_NOTE } from '../../../data/copy.js';
import { REQ_BY_ID } from '../../../data/requirements.js';
import { MODULE_BY_ID } from '../../../data/modules.js';
import { esc, formatDate } from '../../util.js';
import { icon } from '../../components/icon.js';
import { logo } from '../../components/brand.js';
import { todayFor } from '../../store.js';
import * as S from '../../selectors.js';
import { runDataChecks } from './dataChecks.js';

const result = (pass) => (pass
  ? `<span class="chip chip--st-verified">${icon('circle-check')}Pass</span>`
  : `<span class="chip chip--st-changes">${icon('circle-alert')}Fails</span>`);
const show = (v) => esc(typeof v === 'string' ? v : JSON.stringify(v));
const dl = (pairs) => `<dl class="dv-dl">${pairs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
const table = (head, rows) => `
  <div class="sg-table-wrap"><table class="sg-table">
    <thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td data-label="${esc(head[i])}"><span>${c}</span></td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;

function checksTable(state) {
  const rows = runDataChecks(state);
  const passed = rows.filter((r) => r.pass).length;
  return `
    <p class="lead">${passed} of ${rows.length} checks pass.${state.dayOffset ? ` Time travel is on (+${state.dayOffset} days), so date-based checks are skipped.` : ''}</p>
    ${table(['Group', 'Check', 'Expected', 'Actual', 'Result'],
      rows.map((r) => [esc(r.group), esc(r.label), `<code>${show(r.expected)}</code>`, `<code>${show(r.actual)}</code>`, result(r.pass)]))}`;
}

function recLabel(item) {
  const reason = REASONS[item.reason]?.label.replace('{n}', item.n ?? '') ?? item.reason;
  const what = item.moduleId ? `${MODULE_BY_ID[item.moduleId].title} module` : `${item.reqId} · ${REQ_BY_ID[item.reqId].title}`;
  return `<strong>${esc(reason)}</strong> — ${esc(what)}`;
}

function leadSection(state, personaId) {
  const persona = PERSONAS[personaId];
  const org = state.orgs[persona.orgId];
  const today = todayFor(persona, state);
  const r = S.verifiedReadiness(state, org);
  const pace = S.paceStatus(state, org, today);
  const pw = S.pathwayProgress(state, org);
  const counts = S.statusCounts(state, org);
  const sessions = S.upcomingSessions(state, org.id, today);
  const badges = S.earnedBadges(state, org).filter((b) => b.earnedOn);
  return `
    <section class="sg-section" aria-labelledby="dv-${personaId}">
      <h2 class="h3" id="dv-${personaId}">${personaId} · ${esc(persona.name)} — ${esc(org.name)}</h2>
      ${dl([
        ['Demo date', formatDate(today, { weekday: true })],
        ['Tier · Check score', `${TIERS[org.tier].label} · ${S.checkScore(state.answers[org.id])}%`],
        ['Verified readiness', `${r.verified} of ${r.total} (${r.pct}%) · ${r.claimed} in place, awaiting evidence`],
        ['In place / to build', (() => { const t = S.typeCounts(state, org); return `${t.inPlace} / ${t.notYet}`; })()],
        ['Pace', pace.accredited ? 'Accredited' : `${PACE[pace.status].label} · ${pace.daysLeft} days left · ${pace.remaining} to go · about ${pace.perWeek} a week${pace.suggestion ? ` · ${esc(pace.suggestion)}` : ''}`],
        ['Pathway', pw.total ? `${pw.done} of ${pw.total}${S.coreLocked(state, org) ? ' · Core locked' : ''}` : 'None'],
        ['Accreditation', S.isAccredited(org) ? `${esc(org.certNo)} · ${formatDate(org.accreditedOn)}` : 'Not yet'],
        ['Enterprise hub', S.enterpriseOpen(org, today) ? 'Open' : 'Locked'],
        ['Upcoming sessions', sessions.map((s) => `${formatDate(s.date, { weekday: true })} ${s.time} · ${esc(s.topic)}`).join('<br>') || 'None'],
        ['Milestones earned', badges.map((b) => esc(b.name)).join(' · ') || 'None'],
      ])}
      <h3 class="h4">Recommended next</h3>
      <ol class="dv-list">${S.recommendedNext(state, org, today, { limit: 5 }).map((x) => `<li>${recLabel(x)}</li>`).join('')}</ol>
      <h3 class="h4">Status counts</h3>
      <p>${Object.entries(counts).filter(([, n]) => n).map(([k, n]) => `${esc(STATUS[k].label)}: <strong>${n}</strong>`).join(' · ')}</p>
      <h3 class="h4">By area</h3>
      ${table(['Area', 'Verified', 'In place (Check)'], S.domainProgress(state, org).map((d) => [esc(d.name), `${d.verified}/${d.total}`, String(d.inPlace)]))}
    </section>`;
}

function partnerSection(state) {
  const today = todayFor(PERSONAS.D, state);
  return `
    <section class="sg-section" aria-labelledby="dv-D">
      <h2 class="h3" id="dv-D">D · Lena Ng — Southern Community Lenders</h2>
      ${table(['Client', 'Stage', 'Consent', 'Tier', 'Readiness', 'Pace'], S.partnerClients(state, 'partner-scl', today).map((c) => [
        esc(c.name), esc(c.stage), c.consentShown ? 'Shared' : 'Stage only',
        c.consentShown ? esc(c.tier ?? '—') : '—', c.consentShown ? `${c.readiness}%` : '—', c.consentShown ? esc(c.pace ?? '—') : '—',
      ]))}
    </section>`;
}

function verifierSection(state) {
  const today = todayFor(PERSONAS.E, state);
  return `
    <section class="sg-section" aria-labelledby="dv-E">
      <h2 class="h3" id="dv-E">E · Priya Desai — review queue</h2>
      ${table(['Requirement', 'Organisation', 'Type', 'Age', 'Fast-tracked', 'Ali pre-check', 'Conflict'], S.reviewQueue(state, 'E', today).map((q) => [
        `${esc(q.reqId)} · ${esc(REQ_BY_ID[q.reqId].title)}`, esc(S.orgById(state, q.orgId).name), esc(q.type), `${q.ageDays} days`,
        q.fastTracked ? 'Yes' : '—', `${q.aiPrecheck.filter((p) => p.pass).length} of ${q.aiPrecheck.length}`,
        q.conflict ? `<span class="chip chip--st-locked">${icon('lock')}Mentored — blocked</span>` : '—',
      ]))}
    </section>`;
}

function mentorSection(state) {
  const today = todayFor(PERSONAS.F, state);
  const m = S.mentorFor('F');
  return `
    <section class="sg-section" aria-labelledby="dv-F">
      <h2 class="h3" id="dv-F">F · Marcus Hale — this week</h2>
      <p>Mentees: ${m.mentees.map((id) => esc(S.orgById(state, id).name)).join(' · ')}</p>
      ${table(['When', 'Organisation', 'Topic', 'Status'], S.mentorWeek(state, m.id, today).map((s) => [
        `${formatDate(s.date, { weekday: true })} ${s.time}`, esc(S.orgById(state, s.orgId).name), esc(s.topic), esc(s.status),
      ]))}
    </section>`;
}

export function render(ctx) {
  const { state } = ctx;
  return `
    <header class="sg-header on-dark">
      <div class="sg-header__inner">
        ${logo({ href: '#/styleguide' })}
        <span class="sg-header__tag">Data</span>
        <a class="sg-header__note" href="#/styleguide">Back to styleguide</a>
      </div>
    </header>
    <main id="main" class="sg-main dv-main" tabindex="-1">
      <div class="sg-intro">
        <p class="eyebrow">Phase 2 · Mock data</p>
        <h1>Selector outputs by persona</h1>
        <p class="lead">Live from the store, so the Demo panel's time travel and simulate actions change what you see here. ${PROTOTYPE_NOTE}.</p>
      </div>
      <section class="sg-section" aria-labelledby="dv-checks">
        <h2 class="h3" id="dv-checks">Checks against BUILD_PLAN §6.2</h2>
        ${checksTable(state)}
      </section>
      ${['A', 'B', 'C'].map((id) => leadSection(state, id)).join('')}
      ${partnerSection(state)}
      ${verifierSection(state)}
      ${mentorSection(state)}
    </main>`;
}
