// Academy lens links (BUILD_PLAN §8.4–8.5). Dashboard widgets link to a pre-filtered lens, and the
// lenses (Phase 7) read the same query, so a link always lands on exactly what it promised.
//   #/app/academy/action?status=evidence-needed&type=in-place
// Keys: status (comma list of STATUS ids), type ('in-place' | 'not-yet'), area (domain id), effort ('short' | 'medium' | 'long'),
//       format ('video' | 'session' | 'template', By topic only), q (search).

const LENS_PATH = { area: '/app/academy/area', action: '/app/academy/action', topic: '/app/academy/topic' };
const KEYS = ['status', 'type', 'area', 'effort', 'format', 'q'];

/** lensHref('action', { status: ['evidence-needed'], type: 'in-place' }) → '#/app/academy/action?status=evidence-needed&type=in-place' */
export function lensHref(lens, filters = {}) {
  const params = new URLSearchParams();
  KEYS.forEach((k) => {
    const v = filters[k];
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) return;
    params.set(k, Array.isArray(v) ? v.join(',') : v);
  });
  const qs = params.toString();
  return `#${LENS_PATH[lens]}${qs ? `?${qs.replace(/%2C/g, ',')}` : ''}`;
}

/** The filters in a route query: { status: string[], type, area, effort, format, q }. */
export function parseLensFilters(query = {}) {
  return {
    status: query.status ? query.status.split(',').filter(Boolean) : [],
    type: query.type ?? null,
    area: query.area ?? null,
    effort: query.effort ?? null,
    format: query.format ?? null,
    q: query.q ?? '',
  };
}

/** The path + query for a lens with these filters (no leading '#'), for navigate()/replaceHash(). */
export const lensPath = (lens, filters) => lensHref(lens, filters).slice(1);

export const LENSES = ['area', 'action', 'topic'];

/** A requirement page link, optionally at a step slug (STEPS[].slug). */
export const reqHref = (reqId, slug) => `#/app/req/${reqId}${slug ? `/${slug}` : ''}`;
