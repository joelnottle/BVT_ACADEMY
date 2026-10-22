// Styleguide: stepper (full, compact, locked), progress bars, readiness ring, tier ladder.
import { STEPS } from '../../../data/copy.js';
import { renderIcons } from '../../components/icon.js';
import { stepper, bindStepper } from '../../components/stepper.js';
import { progressBar, readinessRing } from '../../components/progress.js';
import { tierLadder } from '../../components/tierLadder.js';
import { section, pair, example } from './layout.js';

// Sample figures: persona A (BUILD_PLAN §6.2) — 10 of 45 verified, 9 in place awaiting evidence.
const AREAS = [['Governance & Constitution', 3, 6, 2], ['Board & Directors', 1, 5, 1], ['Financial Management', 4, 9, 2]];

const fullState = { current: 'doIt', done: ['watch', 'learn', 'download'] };

const fullStepper = () => stepper({ ...fullState, label: 'FM-04 steps' });

const steppers = () => `
  <div class="sg-panel stack">
    ${example('Full — not yet in place (click any step; resize below 768px for the compact summary)', `<div data-sg-stepper>${fullStepper()}</div>`)}
    ${example('Compact — already in place', stepper({ current: 'upload', variant: 'compact', label: 'GC-01 steps' }))}
    ${example('Locked — Start-up pathway first', stepper({ current: 'watch', locked: true, label: 'Locked requirement steps' }))}
  </div>`;

const barsLight = AREAS.map(([l, v, m, c]) => progressBar({ label: l, value: v, max: m, claimed: c })).join('');
const barsDark = AREAS.map(([l, v, m]) => progressBar({ label: l, value: v, max: m })).join('');

const progress = `
  ${pair(
    `<div class="stack">${example('Domain progress (solid = verified, hatched = in place awaiting evidence)', `<div class="stack">${barsLight}</div>`)}</div>`,
    `<div class="stack">${example('Sidebar mini status', `<div class="stack">${barsDark}</div>`)}</div>`,
  )}
  ${pair(
    `<div class="sg-rings">${readinessRing({ verified: 10, claimed: 9, total: 45 })}${readinessRing({ verified: 10, total: 45, size: 'sm' })}</div>`,
    `<div class="sg-rings">${readinessRing({ verified: 10, claimed: 9, total: 45 })}${readinessRing({ verified: 45, total: 45, legend: false })}</div>`,
  )}
  <div class="sg-panel stack">
    ${example('Tier ladder — Core (persona A)', tierLadder('core'))}
    ${example('Tier ladder — Accredited (persona C)', tierLadder('accredited'))}
  </div>`;

export const progressSections = () => [
  section('stepper', 'Stepper', 'An ordered list of buttons with <code>aria-current="step"</code>. Steps 1–4 are optional and always clickable.', steppers()),
  section('progress', 'Progress, readiness ring & tier ladder', 'The ring has two layers: solid for verified, hatched for claimed "in place" from the Check but not yet evidenced.', progress),
].join('');

export function bindProgress(root) {
  const host = root.querySelector('[data-sg-stepper]');
  if (!host) return;
  bindStepper(host, (stepId) => {
    const ids = STEPS.map((s) => s.id);
    fullState.current = stepId;
    // Demo only: mark everything before the chosen step as done
    fullState.done = ids.slice(0, ids.indexOf(stepId));
    const mobileBtns = () => [...host.querySelectorAll('.stepper__mobile button')];
    const mobileIdx = mobileBtns().indexOf(document.activeElement);
    host.innerHTML = fullStepper();
    renderIcons(host);
    // Keep focus where the user was: the current list step, or the same prev/next button on mobile
    if (mobileIdx >= 0) {
      const [prev, next] = mobileBtns();
      const same = mobileIdx === 0 ? prev : next;
      (same.disabled ? (mobileIdx === 0 ? next : prev) : same).focus();
    } else {
      host.querySelector('.stepper__list [aria-current="step"]')?.focus();
    }
  });
}
