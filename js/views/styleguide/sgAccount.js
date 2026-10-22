// Styleguide: Phase 10 components — data table (stacks into cards when narrow), notification rows,
// mock email card and the momentum week strip. Phase 15: Help page keycaps, step list and status key.
import { STEPS } from '../../../data/copy.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { statusChip } from '../../components/chips.js';
import { noteRow } from '../../components/noteRow.js';
import { section, example } from './layout.js';

const NOTES = [
  { id: 'sg-n1', type: 'outcome', on: '2027-05-03', title: 'FM-04 verified — Financial Management is now 5 of 9', text: 'See what to do next.', href: '/styleguide/account', read: false, derived: true },
  { id: 'sg-n2', type: 'milestone', on: '2027-03-29', title: 'Milestone: First requirement verified', text: 'FM-01 verified.', href: '/styleguide/account', read: true, derived: true },
];

export const accountSection = () => section('account', 'Locker, notifications & momentum', 'The table becomes stacked cards when its space is narrow. "New" is icon + label.', `
  <div class="stack stack-lg">
    ${example('Data table', `<div class="data-table-wrap"><table class="data-table"><caption class="sr-only">Example</caption>
      <thead><tr><th scope="col">File</th><th scope="col">Supports</th><th scope="col">Status</th></tr></thead>
      <tbody><tr><td data-label="File">board-minutes-2027-02.pdf</td><td data-label="Supports">FM-03, FM-06</td><td data-label="Status">${statusChip('verified')}</td></tr>
      <tr><td data-label="File">coi-register.pdf</td><td data-label="Supports">GC-02</td><td data-label="Status">${statusChip('changes')}</td></tr></tbody></table></div>`)}
    <div class="sg-grid-2">
      ${example('Notification rows (new · read)', `<ul class="note-list">${NOTES.map((n) => noteRow(n)).join('')}</ul>`)}
      ${example('Mock email', `<div class="email"><dl class="email__head"><div><dt>From</dt><dd>BVT Academy</dd></div><div><dt>Subject</dt><dd><strong>Two weeks left: your options</strong></dd></div></dl>
        <div class="email__body"><p>Hi Sam, you can extend by one month or three. Nothing you have done is lost.</p><p><span class="email__cta">Open BVT Academy</span></p></div></div>`)}
    </div>
    <div class="sg-grid-2">
      ${example('Help: keyboard shortcuts', `<dl class="settings-list"><div><dt><kbd class="kbd">⌘ K / Ctrl K</kbd></dt><dd>Search requirements</dd></div><div><dt><kbd class="kbd">Esc</kbd></dt><dd>Close panels and dialogs</dd></div></dl>`)}
      ${example('Help: status key', `<dl class="settings-list help-status"><div><dt>${statusChip('changes')}</dt><dd>Almost there. Reply and upload again.</dd></div><div><dt>${statusChip('verified')}</dt><dd>Independently verified.</dd></div></dl>`)}
    </div>
    ${example('Help: the seven steps', `<ol class="help-loop">${STEPS.map((s, i) => `<li><span class="help-loop__n" aria-hidden="true">${i + 1}</span>${icon(s.icon)}<span><strong>${esc(s.label)}</strong>${s.optional ? ' <span class="text-3">· Optional</span>' : ''}<br><span class="text-2">${esc(s.blurb)}</span></span></li>`).join('')}</ol>`)}
    ${example('Momentum: 6 active weeks of the last 12', `<ol class="week-strip" aria-label="Example weeks">${Array.from({ length: 12 }, (_, i) => `<li class="week-strip__wk${i >= 6 ? ' is-active' : ''}"><span class="sr-only">${i >= 6 ? 'active' : 'no activity'}</span></li>`).join('')}</ol>`)}
  </div>`);
