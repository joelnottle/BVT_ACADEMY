// #/styleguide — every token and component, on light and on dark. Keep updated with each new component.
import { PROTOTYPE_NOTE } from '../../../data/copy.js';
import { logo } from '../../components/brand.js';
import { tokensSections, bindTokens } from './sgTokens.js';
import { controlsSections, bindControls } from './sgControls.js';
import { statusSections } from './sgStatus.js';
import { progressSections, bindProgress } from './sgProgress.js';
import { overlaysSections, bindOverlays } from './sgOverlays.js';
import { contrastSection, bindContrast } from './sgContrast.js';
import { shellSection } from './sgShell.js';
import { accentsSection } from './sgAccents.js';
import { marketingSection } from './sgMarketing.js';
import { checkFlowSection } from './sgCheckFlow.js';
import { dashboardSection } from './sgDashboard.js';
import { academySection } from './sgAcademy.js';
import { requirementSection } from './sgRequirement.js';
import { supportSection } from './sgSupport.js';
import { accountSection } from './sgAccount.js';
import { enterpriseSection } from './sgEnterprise.js';
import { connectSection } from './sgConnect.js';
import { backofficeSection } from './sgBackoffice.js';

const TOC = [
  ['colours', 'Colour tokens'], ['type', 'Typography'], ['accents', 'Brand accents'], ['shape', 'Spacing, radius & depth'],
  ['buttons', 'Buttons'], ['forms', 'Form controls'], ['nav', 'Segmented, filters & tabs'],
  ['chips', 'Chips & tier badges'], ['cards', 'Cards & empty states'], ['seals', 'Badge seals'],
  ['stepper', 'Stepper'], ['progress', 'Progress, ring & ladder'], ['overlays', 'Toast, modal & slide-over'], ['shell', 'Portal shell'], ['marketing', 'Public site components'], ['checkflow', 'Check & enrolment'], ['dashboard', 'Dashboard widgets'], ['academy', 'Academy components'], ['requirement', 'Requirement page'], ['support', 'Ask Ali & mentoring'], ['account', 'Locker & notifications'], ['enterprise', 'Enterprise hub'], ['connect', 'Connect & partners'], ['backoffice', 'Back-office'],
  ['contrast', 'Contrast results'],
];

export function renderStyleguide() {
  return `
    <header class="sg-header on-dark">
      <div class="sg-header__inner">
        ${logo({ href: '#/styleguide' })}
        <span class="sg-header__tag">Styleguide</span>
        <span class="sg-header__note text-3">${PROTOTYPE_NOTE}</span>
      </div>
    </header>
    <div class="sg-body">
      <nav class="sg-toc" aria-label="Styleguide sections">
        <ul>
          ${TOC.map(([id, label]) => `<li><a href="#/styleguide/${id}" data-sg-toc="${id}">${label}</a></li>`).join('')}
          <li><a href="#/styleguide/data">Mock data &amp; selectors →</a></li>
        </ul>
      </nav>
      <main id="main" class="sg-main" tabindex="-1">
        <div class="sg-intro">
          <p class="eyebrow">Phase 0 · Design system</p>
          <h1>BVT Academy styleguide</h1>
          <p class="lead">Tokens and components for the clickable prototype. Signed-in pages use a dark navy frame with a light work surface.</p>
        </div>
        ${tokensSections()}
        ${accentsSection()}
        ${controlsSections()}
        ${statusSections()}
        ${progressSections()}
        ${overlaysSections()}
        ${shellSection()}
        ${marketingSection()}
        ${checkFlowSection()}
        ${dashboardSection()}
        ${academySection()}
        ${requirementSection()}
        ${supportSection()}
        ${accountSection()}
        ${enterpriseSection()}
        ${connectSection()}
        ${backofficeSection()}
        ${contrastSection()}
      </main>
    </div>`;
}

function scrollToSection(id, { focus = true } = {}) {
  const heading = document.getElementById(`sg-${id}-h`);
  if (!heading) return;
  heading.scrollIntoView({ block: 'start' });
  if (focus) heading.focus({ preventScroll: true });
}

/** @param {HTMLElement} root  @param {string} [sectionId] from #/styleguide/:section */
export function bindStyleguide(root, sectionId) {
  bindTokens(root);
  bindControls(root);
  bindProgress(root);
  bindOverlays(root);
  bindContrast(root);

  // In-page section links: scroll without re-rendering, and keep the URL shareable.
  root.querySelector('.sg-toc').addEventListener('click', (e) => {
    const link = e.target.closest('[data-sg-toc]');
    if (!link) return;
    e.preventDefault();
    history.replaceState(null, '', link.getAttribute('href'));
    scrollToSection(link.dataset.sgToc);
  });

  if (sectionId) requestAnimationFrame(() => scrollToSection(sectionId, { focus: false }));
}
