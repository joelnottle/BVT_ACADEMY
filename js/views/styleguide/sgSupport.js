// Styleguide: Ask Ali and mentoring components (Phase 9) — context chip, message bubbles, typing indicator,
// low-credit notice, credit meter, slot picker (free · chosen · booked) and a mentor card.
import { ALI } from '../../../data/copy.js';
import { ALI_UI as U } from '../../../data/ali.js';
import { MENTORING as M } from '../../../data/mentoring.js';
import { icon } from '../../components/icon.js';
import { section, example } from './layout.js';

export const supportSection = () => section('support', 'Ask Ali & mentoring', 'User bubbles are navy, Ali’s are cream. Ali offers guidance; it never verifies.', `
  <div class="stack stack-lg">
    <div class="sg-grid-2">
      ${example('Context chip and conversation', `<div class="ali">
        <span class="ali-context">${icon('file-text')}<span>${U.context('FM-04', 'Monthly cash flow forecast')}</span><button type="button" class="ali-context__x" aria-label="Remove example context">${icon('x')}</button></span>
        <div class="ali-msg ali-msg--user"><p class="ali-msg__who">${U.you}</p><div class="ali-msg__body"><p>How far ahead should our forecast go?</p></div></div>
        <div class="ali-msg ali-msg--ali"><p class="ali-msg__who">${U.ali}</p><div class="ali-msg__body"><p>Most lenders and funders expect a rolling 12-month forecast, updated monthly.</p></div></div>
        <p class="ali-typing">${U.typing}<span class="ali-typing__dots" aria-hidden="true"><span></span><span></span><span></span></span></p></div>`)}
      ${example('Credits: meter and low-credit notice', `<div class="stack">
        <p class="ali__notice">${icon('info')}<span>${U.low('0.5')}</span></p>
        <div class="ali__meter"><span>${icon('sparkles')}${ALI.creditLine(7.25)}</span><button type="button" class="btn btn--ghost">${icon('plus')}${U.topUp}</button></div></div>`)}
    </div>
    <div class="sg-grid-2">
      ${example('Slot picker: free · chosen · booked', `<div class="slot-day"><p class="slot-day__name">Tue 4 May</p>
        <label class="slot"><input type="radio" name="sg-slot"><span>09:00</span></label>
        <label class="slot"><input type="radio" name="sg-slot" checked><span>10:00</span></label>
        <label class="slot is-taken"><input type="radio" name="sg-slot" disabled><span>11:30</span></label></div>`)}
      ${example('Mentor card', `<div class="card mentor-card"><div class="mentor-card__head"><span class="avatar avatar--lg" aria-hidden="true">MH</span><div><p class="card__title">Marcus Hale</p><p class="text-3">Senior mentor</p></div></div>
        <span class="chip chip--reason">${icon('badge-check')}${M.badge}</span><ul class="pill-list mentor-card__skills"><li>Cash flow &amp; budgeting</li><li>Financial controls</li></ul></div>`)}
    </div>
    ${example('Mentors don’t verify (shown on every mentoring screen)', `<p class="callout callout--cream">${icon('shield-check')}<span><strong>${M.note}</strong></span></p>`)}
  </div>`);
