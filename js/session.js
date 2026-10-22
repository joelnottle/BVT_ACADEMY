// Pretend sign-in: switch who you are and land in the right place.
// The hash is changed before the store notifies, so the app renders once, on the new route.
import { PERSONAS } from '../data/users.js';
import { setPersona } from './store.js';
import { parseHash, navigate } from './router.js';

/** Switch persona and go to `to` (default: that persona's landing route). */
export function switchPersona(id, { to } = {}) {
  const persona = PERSONAS[id];
  if (!persona) return;
  const target = to ?? persona.landing;
  if (parseHash().path !== target) navigate(target);
  setPersona(id);
}

export const signOut = () => switchPersona('visitor', { to: '/' });
