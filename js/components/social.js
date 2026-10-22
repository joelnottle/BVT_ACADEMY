// Social brand icons. Lucide 1.x dropped brand marks, so these outlines are inlined
// (from Lucide's earlier ISC-licensed set). Decorative: the link carries the label.

const PATHS = {
  linkedin: '<rect x="2" y="2" width="20" height="20" rx="4"></rect><path d="M8 11v6M8 7.5v.01M12 17v-6M12 13.5a2.5 2.5 0 0 1 5 0V17"></path>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><path d="M17.5 6.5h.01"></path>',
};

export const socialIcon = (id) => `
  <svg class="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${PATHS[id] ?? ''}</svg>`;
