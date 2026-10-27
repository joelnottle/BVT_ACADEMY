// Styleguide: public-site components (Phase 3) — section heading, feature/check/tier cards, learning loop,
// certificate, listing card, FAQ, testimonial, CTA band.
import { HOME } from '../../../data/site.js';
import { CHECKS } from '../../../data/checks.js';
import { CONNECT_LISTINGS } from '../../../data/connect.js';
import { accentText, sectionHead, featureCard, checkCard, tierCards, faq, testimonial, ctaBand } from '../../components/marketing.js';
import { learningLoop, miniFlow } from '../../components/learningLoop.js';
import { certificate } from '../../components/certificate.js';
import { listingCard } from '../../components/listingCard.js';
import { australiaOutline } from '../../components/australia.js';
import { areaWheel } from '../../components/areaWheel.js';
import { DOMAINS } from '../../../data/domains.js';
import { section, example } from './layout.js';

export const marketingSection = () => section('marketing', 'Public site components',
  'Built from data/site.js. Headings mark the accent word with *asterisks* in the copy.', `
  <div class="sg-panel stack stack-lg">
    ${example('Australia outline (decorative, aria-hidden): gradient · currentColor', `<div class="cluster"><span class="sg-aus sg-aus--lg">${australiaOutline({ gradient: true, id: 'sg-aus' })}</span><span class="sg-aus sg-aus--sm">${australiaOutline()}</span></div>`)}
    ${example('Area wheel (role="img"; the list beside it carries the detail)', `<div class="sg-wheel">${areaWheel({ areas: DOMAINS, centre: HOME.areas.centre, label: 'Example: the six areas BVT checks' })}</div>`)}
    ${example('Statement band', `<div class="standards-band"><div class="standards-band__inner"><p class="standards-band__title">${accentText(HOME.standards.title)}</p></div></div>`)}
    ${example('Section heading', sectionHead({ eyebrow: 'Free checks', title: 'Start with a *free* check', lead: 'No payment required.', level: 3 }))}
    ${example('Feature cards', `<div class="grid-3">${HOME.support.items.map((it) => featureCard(it)).join('')}</div>`)}
    ${example('Check cards', `<div class="grid-4">${Object.values(CHECKS).map((c) => checkCard(c)).join('')}</div>`)}
    ${example('Tier cards', tierCards({ foundationNote: HOME.tiers.foundationNote }))}
    ${example('Learning loop (connected flow; vertical below 1024px)', learningLoop({ skipLabel: HOME.loop.skip, optionalLabel: HOME.loop.optional }))}
    ${example('Mini flow', miniFlow(['Upload', 'Verify', 'Closed']))}
    <div class="grid-2">
      ${example('Certificate', certificate({ orgName: 'Harbourline Civil Pty Ltd', certNo: 'BVT-2027-000123', issuedOn: '2027-04-26', renewsOn: '2028-04-26' }))}
      ${example('Connect listing cards', `<div class="stack stack-sm">${listingCard({ ...CONNECT_LISTINGS[1], status: 'accredited' })}${listingCard({ ...CONNECT_LISTINGS[11], status: 'expired' })}</div>`)}
    </div>
    <div class="grid-2">
      ${example('Testimonial', testimonial(HOME.testimonial))}
      ${example('FAQ (native details)', faq(HOME.faq.items.slice(0, 3)))}
    </div>
  </div>
  ${ctaBand(HOME.cta)}`);
