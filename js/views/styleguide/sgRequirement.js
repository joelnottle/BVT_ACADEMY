// Styleguide: requirement page components (Phase 8) — connected stepper with "You are here", dropzone,
// the dismissible "From our partners" prompt, file rows, verify timeline, "Almost there", Closed line.
import { FEEDBACK } from '../../../data/copy.js';
import { REQ } from '../../../data/reqPage.js';
import { icon } from '../../components/icon.js';
import { stepper } from '../../components/stepper.js';
import { milestoneCard } from '../../components/feedback.js';
import { section, example } from './layout.js';

const timeline = (rows) => `<ol class="timeline-v">${rows.map(([state, ic, title, meta]) => `
  <li class="timeline-v__item is-${state}"><span class="timeline-v__dot" aria-hidden="true">${icon(state === 'done' ? 'check' : ic)}</span>
  <span class="timeline-v__text"><strong>${title}</strong><span>${meta}</span></span></li>`).join('')}</ol>`;

export const requirementSection = () => section('requirement', 'Requirement page components', 'The step panel is the focal point. Partner prompts are labelled, dismissible and never a step.', `
  <div class="stack stack-lg">
    ${example('Stepper: full, at Do it (steps 1–3 done)', stepper({ current: 'doIt', done: ['watch', 'learn', 'download'], label: 'Example steps' }))}
    ${example('Stepper: compact (already in place)', stepper({ current: 'upload', variant: 'compact', label: 'Example compact steps' }))}
    <div class="sg-grid-2">
      ${example('Dropzone (pretend: name and size only)', `<div class="dropzone">${icon('upload-cloud')}<span class="dropzone__strong">${REQ.upload.drop}</span><p class="dropzone__hint">${REQ.upload.dropHint}</p></div>`)}
      ${example('From our partners (dismissible)', `<section class="vault" aria-label="Example partner prompt"><p class="vault__label">${REQ.vault.label}</p><p class="vault__text">${REQ.vault.text} <a href="#/styleguide/requirement">${REQ.vault.more}</a></p><button type="button" class="btn btn--ghost btn--icon" aria-label="Dismiss example">${icon('x')}</button></section>`)}
    </div>
    ${example('File rows', `<ul class="file-list"><li class="file-row">${icon('file')}<span class="file-row__name">cash-flow-forecast-2027.xlsx</span><span class="file-row__size">47 KB</span><button type="button" class="btn btn--ghost btn--icon" aria-label="Remove example file">${icon('trash-2')}</button></li><li class="file-row">${icon('link')}<span class="file-row__name">board-minutes-2027-02.pdf <span class="text-3">· from your locker</span></span><span class="file-row__size">158 KB</span></li></ul>`)}
    <div class="sg-grid-2">
      ${example('Verify timeline: in review', timeline([['done', 'send', 'Submitted', '3 May 2027'], ['current', 'hourglass', 'In review', FEEDBACK.reviewEstimate], ['todo', 'circle-dashed', 'Outcome', 'Waiting for the verifier']]))}
      ${example('Verify timeline: Almost there', timeline([['done', 'send', 'Submitted', '24 Apr 2027'], ['done', 'hourglass', 'In review', ''], ['changes', 'pencil-line', FEEDBACK.changesHeading, '29 Apr 2027']]))}
    </div>
    ${example('Almost there panel', `<section class="almost" aria-label="Example"><p class="almost__title">${icon('pencil-line')}${FEEDBACK.changesHeading}</p><blockquote class="almost__comment"><p>Almost there — please add a signed declaration from each director.</p><footer>BVT verifier · 29 Apr 2027</footer></blockquote></section>`)}
    ${example('Closed', `<div class="closed"><p class="closed__line">${icon('badge-check')}<span>${FEEDBACK.verified('FM-04', 'Financial Management', 5, 9)}</span></p>${milestoneCard({ title: 'Milestone: Passed 25% verified', text: 'Verified readiness passes 25%', iconName: 'trending-up' })}</div>`)}
  </div>`);
