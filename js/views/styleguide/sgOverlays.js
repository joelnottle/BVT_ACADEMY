// Styleguide: toast, confirmation modal, slide-over.
import { FEEDBACK, PROTOTYPE_NOTE } from '../../../data/copy.js';
import { icon } from '../../components/icon.js';
import { showToast } from '../../components/toast.js';
import { openModal } from '../../components/modal.js';
import { openSlideOver } from '../../components/slideOver.js';
import { section, example } from './layout.js';

const content = `
  <div class="sg-panel stack">
    ${example('Toasts (polite live region; pause on hover or focus)', `<div class="cluster">
      <button type="button" class="btn btn--outline" data-sg="toast-submit">Show submit toast</button>
      <button type="button" class="btn btn--outline" data-sg="toast-milestone">Show milestone toast</button></div>`)}
    ${example('Modal (focus trap, Esc closes, focus returns here)', `<div class="cluster">
      <button type="button" class="btn btn--action" data-sg="modal">Submit for verification…</button></div>`)}
    ${example('Slide-over (420px; full width on small screens)', `<div class="cluster">
      <button type="button" class="btn btn--outline" data-sg="slideover">${icon('panel-right')} Open slide-over</button></div>`)}
  </div>`;

export const overlaysSections = () =>
  section('overlays', 'Toast, modal & slide-over', 'Motion is a 200ms fade or slide, removed under <code>prefers-reduced-motion</code>.', content);

function openDemoSlideOver() {
  openSlideOver({
    title: 'Ask Ali',
    iconName: 'sparkles',
    body: `
      <div class="stack">
        <div class="cluster"><span class="chip chip--type">${icon('file-text')}About FM-04 · Monthly cash flow forecast</span></div>
        <p class="text-2">Slide-over shell only. The Ask Ali conversation arrives in Phase 9.</p>
        <div class="field">
          <label class="field__label" for="sg-ali-q">Your question</label>
          <textarea class="textarea" id="sg-ali-q" placeholder="What does a good cash flow forecast include?"></textarea>
        </div>
        <button type="button" class="btn btn--action" data-sg-inner="modal">Open a modal on top</button>
      </div>`,
    footer: `Ali offers guidance — it doesn't verify your evidence. ${PROTOTYPE_NOTE}.`,
  }).dialog.addEventListener('click', (e) => {
    if (e.target.closest('[data-sg-inner="modal"]')) openDemoModal();
  });
}

function openDemoModal() {
  openModal({
    title: 'Submit FM-04 for verification?',
    body: `<p>You're submitting 2 files with your declaration. You can still add notes while it's in review.</p>
           <p class="text-3" style="margin-top:var(--sp-3)">${FEEDBACK.reviewEstimate}.</p>`,
    actions: [
      { label: 'Cancel', value: 'cancel', variant: 'outline' },
      { label: 'Submit for verification', value: 'submit', variant: 'action' },
    ],
    onAction: (value) => {
      if (value === 'submit') showToast(FEEDBACK.submittedTitle('FM-04'), { text: FEEDBACK.submittedText });
    },
  });
}

export function bindOverlays(root) {
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-sg]');
    if (!btn) return;
    const action = btn.dataset.sg;
    if (action === 'toast-submit') showToast(FEEDBACK.submittedTitle('FM-04'), { text: FEEDBACK.submittedText });
    if (action === 'toast-milestone') {
      showToast('Milestone: Financial Management complete', { text: 'All 9 requirements verified. Next: Operations & HR, 1 of 8.', iconName: 'award' });
    }
    if (action === 'modal') openDemoModal();
    if (action === 'slideover') openDemoSlideOver();
  });
}
