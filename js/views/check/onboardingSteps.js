// The four onboarding step bodies (§8.3): timeline, weekly goal, where to start, support.
// Pure render functions; onboarding.js binds them.
import { ONBOARDING } from '../../../data/enrolment.js';
import { TIERS } from '../../../data/copy.js';
import { PATHWAYS } from '../../../data/pathways.js';
import { DOMAINS } from '../../../data/domains.js';
import { esc, formatDate } from '../../util.js';
import { icon } from '../../components/icon.js';
import { suggestedPace, biggestGapArea, typeCounts, pathwayReqs, domainProgress } from '../../selectors.js';

const O = ONBOARDING;

export const goalFor = (hrs) => (hrs == null ? O.goals[0] : hrs <= 2 ? O.goals[0] : hrs < 5 ? O.goals[1] : O.goals[2]);

/** The default start choice: the pathway if there is one, else quick wins when anything is already in place. */
export const defaultStart = (state, org) => (org.pathway ? 'pathway' : typeCounts(state, org).inPlace ? 'quick-wins' : 'biggest-gaps');

function timeline(ctx) {
  const { org, state } = ctx;
  const pace = suggestedPace(org);
  const { inPlace } = typeCounts(state, org);
  const pathwayN = pathwayReqs(org).length;
  const t = TIERS[org.tier];
  return `
    <p class="lead">${esc(O.timeline.lead)}</p>
    <dl class="timeline">
      <div class="timeline__end"><dt>Started</dt><dd>${esc(formatDate(org.enrolledOn))}</dd></div>
      <div class="timeline__track" aria-hidden="true"><span>${esc(t.label)} · ${t.months} months</span></div>
      <div class="timeline__end timeline__end--finish"><dt>Finish by</dt><dd>${esc(formatDate(org.endsOn))}</dd></div>
    </dl>
    <ul class="facts">
      ${pathwayN ? `<li class="fact"><span class="fact__n">${pathwayN}</span><span>pathway foundations first</span></li>` : ''}
      <li class="fact"><span class="fact__n">${pace.units - pathwayN}</span><span>Core requirements</span></li>
      <li class="fact"><span class="fact__n">${inPlace}</span><span>already in place</span></li>
      <li class="fact"><span class="fact__n">~${pace.perFortnight}</span><span>a fortnight</span></li>
    </ul>
    <p class="callout">${icon('gauge')}<span>Suggested pace: <strong>${esc(O.timeline.pace(pace.perFortnight))}</strong>.
      ${esc(pathwayN ? O.timeline.pathway(pathwayN) : O.timeline.inPlace(inPlace))}</span></p>
    <p class="text-3">${esc(O.timeline.clock)}</p>`;
}

function goal(ctx) {
  const { org } = ctx;
  const current = goalFor(org.weeklyGoalHrs).id;
  const day = org.reminderDay ?? 'Mon';
  return `
    <p class="lead">${esc(O.goalLead)}</p>
    <p class="callout callout--cream">${icon('trending-up')}<span><strong>${esc(O.standards)}</strong></span></p>
    <fieldset class="fieldset">
      <legend class="h3">Weekly time budget</legend>
      <div class="choice-grid">
        ${O.goals.map((g) => `
          <label class="option choice-card">
            <input type="radio" name="goal" value="${g.id}"${g.id === current ? ' checked' : ''}>
            <span class="choice-card__body"><strong>${esc(g.label)}</strong><span class="text-2">${esc(g.text)}</span></span>
          </label>`).join('')}
      </div>
    </fieldset>
    <fieldset class="fieldset">
      <legend class="h3">Reminder day</legend>
      <div class="day-picker">
        ${O.days.map(([id, name]) => `
          <label class="option day-picker__day">
            <input type="radio" name="reminderDay" value="${id}"${id === day ? ' checked' : ''} aria-describedby="ob-day-hint">
            <span aria-hidden="true">${id}</span><span class="sr-only">${name}</span>
          </label>`).join('')}
      </div>
      <p class="field__hint" id="ob-day-hint">${esc(O.reminderHint)}</p>
    </fieldset>`;
}

function start(ctx) {
  const { org, state } = ctx;
  if (org.pathway) {
    const p = PATHWAYS[org.pathway];
    const n = p.requirementIds.length;
    return `
      <p class="lead">${esc(p.intro)}</p>
      <section class="card card--highlight stack" aria-labelledby="ob-path-h">
        <span class="icon-tile">${icon('route')}</span>
        <h2 class="h3" id="ob-path-h">${esc(O.start.pathwayTitle(p.title))}. ${esc(O.start.pathwayWhy)}:</h2>
        <ul class="ticks">${n
          ? O.start.pathwayPoints(n).map((t) => `<li>${icon('check')}<span>${esc(t)}</span></li>`).join('')
          : `<li>${icon('info')}<span>The Recovery pathway content is still being written. In this prototype, your Core requirements stay open.</span></li>`}</ul>
      </section>`;
  }
  const choice = org.startChoice ?? defaultStart(state, org);
  const { inPlace } = typeCounts(state, org);
  const gap = biggestGapArea(state, org);
  const areas = domainProgress(state, org).filter((d) => d.total);
  const areaId = org.startDomainId ?? gap.id;
  const text = (card) => (card.id === 'quick-wins' ? card.text(inPlace) : card.id === 'biggest-gaps' ? card.text(gap.name) : card.text());
  return `
    <p class="lead">${esc(O.start.lead)}</p>
    <fieldset class="fieldset">
      <legend class="sr-only">Where to start</legend>
      <div class="choice-grid choice-grid--3">
        ${O.start.cards.filter((c) => c.id !== 'quick-wins' || inPlace).map((card) => `
          <label class="option choice-card">
            <input type="radio" name="startChoice" value="${card.id}"${card.id === choice ? ' checked' : ''}>
            <span class="choice-card__body">
              ${card.id === defaultStart(state, org) ? `<span class="chip chip--reason">${icon('sparkles')}Recommended</span>` : ''}
              <strong>${esc(card.title)}</strong>
              <span class="text-2">${esc(text(card))}</span>
            </span>
          </label>`).join('')}
      </div>
    </fieldset>
    <div class="field" data-area-field${choice === 'choose-area' ? '' : ' hidden'}>
      <label class="field__label" for="ob-area">${esc(O.start.areaLabel)}</label>
      <select class="select" id="ob-area" name="startDomainId">
        ${areas.map((d) => `<option value="${d.id}"${d.id === areaId ? ' selected' : ''}>${esc(d.name)} · ${d.total - d.inPlace} to build</option>`).join('')}
      </select>
    </div>`;
}

function support(ctx) {
  const { org } = ctx;
  const s = O.support;
  return `
    <p class="lead">${esc(s.lead)}</p>
    <div class="grid-2">
      <section class="card card--flat" aria-labelledby="ob-ali-h">
        <span class="icon-tile">${icon('sparkles')}</span>
        <h2 class="h3" id="ob-ali-h">${esc(s.ali.title)}</h2>
        <p class="text-2">${esc(s.ali.text)}</p>
        <p><strong>${esc(s.ali.credits(org.credits.ali))}</strong> · <span class="text-3">${esc(s.ali.note)}</span></p>
      </section>
      <section class="card card--flat" aria-labelledby="ob-mentor-h">
        <span class="icon-tile">${icon('users')}</span>
        <h2 class="h3" id="ob-mentor-h">${esc(s.mentor.title)}</h2>
        <p class="text-2">${esc(s.mentor.text)}</p>
        <p><strong>${esc(s.mentor.credits(org.credits.mentor))}</strong></p>
      </section>
    </div>
    <section class="roles" aria-labelledby="ob-roles-h">
      <h2 class="h3" id="ob-roles-h">${esc(s.roles.title)}</h2>
      <div class="roles__grid">
        <div class="roles__col">${icon('hand-helping')}<div><strong>${esc(s.roles.help.title)}</strong><p>${esc(s.roles.help.text)}</p></div></div>
        <div class="roles__col">${icon('shield-check')}<div><strong>${esc(s.roles.decide.title)}</strong><p>${esc(s.roles.decide.text)}</p></div></div>
      </div>
    </section>`;
}

export const STEP_BODIES = { timeline, goal, start, support };

/** One-line summary for the "all set" toast. */
export function choiceSummary(state, org) {
  const day = O.days.find(([id]) => id === org.reminderDay)?.[1] ?? 'Monday';
  const startText = org.startChoice === 'pathway' ? `your ${PATHWAYS[org.pathway].title}`
    : org.startChoice === 'choose-area' ? (DOMAINS.find((d) => d.id === org.startDomainId)?.name ?? 'your chosen area')
    : org.startChoice === 'biggest-gaps' ? biggestGapArea(state, org).name
    : 'quick wins';
  return `${goalFor(org.weeklyGoalHrs).label} · reminders on ${day}s · starting with ${startText}`;
}
