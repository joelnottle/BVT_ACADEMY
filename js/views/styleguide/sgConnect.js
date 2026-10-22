// Styleguide: Connect and partner components (Phase 13) — directory listing, consent chips, stage funnel and
// the three certificate-check results (valid, expired, not found).
import { icon } from '../../components/icon.js';
import { listingCard } from '../../components/listingCard.js';
import { section, example } from './layout.js';

const L = { id: 'cx-harbourline', name: 'Harbourline Civil Pty Ltd', industry: 'Civil construction', city: 'Newcastle', state: 'NSW', size: 'Medium', certNo: 'BVT-2027-000123', status: 'valid' };
const FUNNEL = [['Referred', 1], ['Checked', 1], ['Enrolled', 0], ['In progress', 3], ['Accredited', 1]];

export const connectSection = () => section('connect', 'Connect & partner portal', 'Partners see progress only where a client has consented; otherwise stage only.', `
  <div class="stack stack-lg">
    <div class="sg-grid-2">
      ${example('Directory listing (valid · expired)', `<div class="stack stack-sm">${listingCard(L)}${listingCard({ ...L, id: 'cx-quandong', name: 'Quandong Training Services', status: 'expired', certNo: 'BVT-2026-000041' })}</div>`)}
      ${example('Consent', `<div class="cluster"><span class="chip chip--st-verified">${icon('eye')}Sharing progress</span><span class="chip chip--st-locked">${icon('eye-off')}Progress not shared</span></div>`)}
    </div>
    ${example('Stage funnel', `<ol class="funnel">${FUNNEL.map(([l, n]) => `<li class="funnel__row"><span class="funnel__label">${l}</span><span class="funnel__bar" aria-hidden="true"><span style="width:${Math.round((n / 3) * 100)}%"></span></span><span class="funnel__n">${n}</span></li>`).join('')}</ol>`)}
    <div class="sg-grid-2">
      ${example('Certificate: valid', `<section class="verify-result verify-result--valid" aria-label="Example"><p class="h3">${icon('badge-check')}Valid certificate</p><p>Valid until 26 Apr 2028.</p></section>`)}
      ${example('Certificate: expired', `<section class="verify-result verify-result--expired" aria-label="Example"><p class="h3">${icon('clock')}This certificate has expired</p><p>Expired 2 Mar 2027.</p></section>`)}
    </div>
    ${example('Certificate: not found', `<section class="verify-result verify-result--none" aria-label="Example"><p class="h3">${icon('search-x')}We couldn’t find that certificate</p><p>Check the number and try again.</p></section>`)}
  </div>`);
