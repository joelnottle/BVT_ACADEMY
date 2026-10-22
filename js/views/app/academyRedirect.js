// #/app/academy — opens the lens you used last (§8.5: "the chosen lens is remembered").
import { lensHref, LENSES } from '../../lens.js';

export const render = () => '<div class="page"><h1 class="sr-only">Academy</h1></div>';

export function bind(root, ctx) {
  const lens = LENSES.includes(ctx.state.ui.lens) ? ctx.state.ui.lens : 'area';
  window.location.replace(lensHref(lens)); // replace: Back skips this hop
}
