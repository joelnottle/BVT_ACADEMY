// Styleguide: buttons, form controls, segmented control, tabs, filter chips.
import { icon } from '../../components/icon.js';
import { filterChip } from '../../components/chips.js';
import { segmented, tabs, bindSegmented, bindTabs } from '../../components/tabs.js';
import { showToast } from '../../components/toast.js';
import { section, pair, example } from './layout.js';

const lightButtons = `
  <div class="stack">
    ${example('Action (--grad-action)', `<div class="cluster">
      <button type="button" class="btn btn--action">Pre-qualify my business</button>
      <button type="button" class="btn btn--action">Continue ${icon('arrow-right')}</button>
      <button type="button" class="btn btn--action" disabled>Disabled</button></div>`)}
    ${example('Outline', `<div class="cluster">
      <button type="button" class="btn btn--outline">Send my clients through BVT</button>
      <button type="button" class="btn btn--outline" disabled>Disabled</button></div>`)}
    ${example('Ghost', `<div class="cluster">
      <button type="button" class="btn btn--ghost">${icon('sparkles')} Ask Ali about FM-04</button>
      <button type="button" class="btn btn--ghost btn--icon" aria-label="Close">${icon('x')}</button></div>`)}
    ${example('Link button', '<button type="button" class="link-btn">I know this — go to evidence</button>')}
  </div>`;

const darkButtons = `
  <div class="stack">
    ${example('Action', '<div class="cluster"><button type="button" class="btn btn--action">Start free check</button></div>')}
    ${example('On-dark outline', `<div class="cluster">
      <button type="button" class="btn btn--on-dark">Find pre-qualified businesses</button>
      <button type="button" class="btn btn--on-dark" disabled>Disabled</button></div>`)}
    ${example('On-dark ghost', `<div class="cluster">
      <button type="button" class="btn btn--on-dark-ghost">${icon('bell')} Notifications</button>
      <button type="button" class="btn btn--on-dark-ghost btn--icon" aria-label="Menu">${icon('menu')}</button></div>`)}
    ${example('Link button', '<button type="button" class="link-btn">Need a refresher? Open the learning</button>')}
  </div>`;

const forms = `
  <div class="sg-grid-2">
    <div class="sg-panel stack">
      <div class="field">
        <label class="field__label" for="sg-org">Organisation name</label>
        <input class="input" id="sg-org" placeholder="e.g. Kestrel Community Services Ltd">
      </div>
      <div class="field">
        <label class="field__label" for="sg-abn">ABN</label>
        <input class="input" id="sg-abn" inputmode="numeric" aria-describedby="sg-abn-hint" value="12 345 678 901">
        <p class="field__hint" id="sg-abn-hint">11 digits. We check the format only — nothing is looked up.</p>
      </div>
      <div class="field is-invalid">
        <label class="field__label" for="sg-staff">Number of staff</label>
        <input class="input" id="sg-staff" aria-invalid="true" aria-describedby="sg-staff-err" value="">
        <p class="field__error" id="sg-staff-err">${icon('circle-alert')}Enter a number, for example 14.</p>
      </div>
      <div class="field">
        <label class="field__label" for="sg-day">Reminder day</label>
        <select class="select" id="sg-day"><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option></select>
      </div>
      <div class="field">
        <label class="field__label" for="sg-notes">Notes for your verifier <span class="field__optional">(optional)</span></label>
        <textarea class="textarea" id="sg-notes"></textarea>
      </div>
      <div class="field">
        <label class="field__label" for="sg-dis">Disabled</label>
        <input class="input" id="sg-dis" value="Read only for now" disabled>
      </div>
    </div>
    <div class="sg-panel stack">
      <fieldset class="fieldset">
        <legend>Checkbox</legend>
        <label class="check"><input type="checkbox" checked><span class="check__text">Load 12 months of actuals</span></label>
        <label class="check"><input type="checkbox"><span class="check__text">Project 12 months forward
          <span class="check__hint">Use the template from the Download step.</span></span></label>
        <label class="check"><input type="checkbox" disabled><span class="check__text">Disabled option</span></label>
      </fieldset>
      <fieldset class="fieldset">
        <legend>Radio</legend>
        <label class="check"><input type="radio" name="sg-goal" checked><span class="check__text">1–2 hours a week</span></label>
        <label class="check"><input type="radio" name="sg-goal"><span class="check__text">3–4 hours a week</span></label>
        <label class="check"><input type="radio" name="sg-goal"><span class="check__text">5+ hours a week</span></label>
      </fieldset>
      <fieldset class="fieldset">
        <legend>Option cards (Check answer scale)</legend>
        <div class="stack stack-sm">
          ${['In place', 'Partly', 'Not yet', 'Not sure', 'N/A'].map((o, i) =>
            `<label class="option"><input type="radio" name="sg-answer"${i === 0 ? ' checked' : ''}><span>${o}</span></label>`).join('')}
        </div>
      </fieldset>
    </div>
  </div>`;

const LENSES = [
  { id: 'area', label: 'By area', icon: 'layout-grid' },
  { id: 'action', label: 'By next action', icon: 'list-checks' },
  { id: 'topic', label: 'By topic', icon: 'book-open' },
];

const nav = () => `
  <div class="stack">
    ${example('Segmented control (Academy lenses)', segmented({ label: 'Academy view', items: LENSES, selected: 'area' }))}
    ${example('Filter chips (toggle)', `<div class="cluster" data-sg-filters>
      ${filterChip('Already in place', { pressed: true })}${filterChip('Not yet in place')}${filterChip('Evidence needed')}${filterChip('Under 1 hour')}</div>`)}
    ${example('Tabs (arrow keys move between tabs)', tabs({
      label: 'Notifications',
      items: [
        { id: 'all', label: 'All', count: 6, panel: '<p class="text-2">Every notification, newest first.</p>' },
        { id: 'outcomes', label: 'Verifier outcomes', count: 2, panel: '<p class="text-2">GC-02: Almost there — one thing to add.</p>' },
        { id: 'emails', label: 'Mock emails', panel: '<p class="text-2">Rendered previews of reminder emails. Nothing is sent.</p>' },
      ],
    }))}
  </div>`;

export const controlsSections = () => [
  section('buttons', 'Buttons', 'White text only ever sits on <code>--grad-action</code>. All buttons are at least 44px tall.', pair(lightButtons, darkButtons)),
  section('forms', 'Form controls', 'Native checkboxes and radios with the brand accent. Control edges use <code>--border-input</code> (3:1).', forms),
  section('nav', 'Segmented control, filters & tabs', '', `<div class="sg-panel">${nav()}</div>`),
].join('');

export function bindControls(root) {
  bindTabs(root);
  bindSegmented(root, (value) => showToast('Lens changed', { text: `Showing "${LENSES.find((l) => l.id === value).label}".`, iconName: 'layout-grid' }));
  root.querySelector('[data-sg-filters]')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip--filter');
    if (chip) chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') !== 'true');
  });
}
