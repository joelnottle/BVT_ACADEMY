// Styleguide: Enterprise hub components (Phase 12) — team status chips, the Micro-Unit price summary
// ($1,500 first + $1,000 each additional) and the linear lesson list.
import { MICRO } from '../../../data/enterprise.js';
import { icon } from '../../components/icon.js';
import { section, example } from './layout.js';

export const enterpriseSection = () => section('enterprise', 'Enterprise hub', 'Pricing maths is shown line by line. Team status is icon + label.', `
  <div class="sg-grid-2">
    ${example('Team status', `<div class="cluster"><span class="chip chip--st-verified">${icon('user-check')}Active</span><span class="chip chip--st-evidence">${icon('mail')}Invited</span></div>`)}
    ${example('Price summary (3 participants)', `<dl class="price-lines">
      <div><dt>${MICRO.first}</dt><dd>$1,500</dd></div><div><dt>${MICRO.additional}</dt><dd>$1,000</dd></div><div><dt>${MICRO.additional}</dt><dd>$1,000</dd></div>
      <div class="price-lines__total"><dt>${MICRO.total}</dt><dd>$3,500</dd></div></dl><p class="text-3">${icon('sparkles')} ${MICRO.credits(24)}</p>`)}
  </div>
  ${example('Linear lesson list (done · next · later)', `<ol class="pw-list">
    <li class="pw-item is-done"><span class="pw-item__n" aria-hidden="true">${icon('check')}</span><div class="pw-item__main"><p class="pw-item__title">Budget vs forecast</p></div><span class="chip chip--st-verified">${icon('check')}Done</span></li>
    <li class="pw-item is-next"><span class="pw-item__n" aria-hidden="true">2</span><div class="pw-item__main"><p class="pw-item__title">Reading variances</p></div><button type="button" class="btn btn--action pw-item__go">Mark lesson complete</button></li>
    <li class="pw-item"><span class="pw-item__n" aria-hidden="true">3</span><div class="pw-item__main"><p class="pw-item__title">Making decisions from the numbers</p><p class="pw-item__meta">${icon('lock')}<span>Opens after the previous lesson</span></p></div></li>
  </ol>`)}`);
