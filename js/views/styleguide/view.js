// Route module for #/styleguide and #/styleguide/:section (bare layout: the page has its own header).
import { renderStyleguide, bindStyleguide } from './index.js';

export const render = () => renderStyleguide();
export const bind = (root, ctx) => bindStyleguide(root, ctx.params.section);
