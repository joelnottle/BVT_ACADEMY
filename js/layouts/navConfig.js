// Sidebar navigation per role (§7.3 portal, §7.4 partner, §7.5 back-office).
// Item: { href, label, icon, meta?, metaLabel?, lock?, children? }
import { DOMAINS } from '../../data/domains.js';
import { isAccredited, enterpriseOpen, ENTERPRISE_OPENS, domainProgress, coreLocked } from '../store.js';

function leadNav({ org, today }) {
  const locked = coreLocked(org);
  const areas = DOMAINS.map((d) => {
    const [done, total] = domainProgress(org, d.id);
    return {
      href: `/app/academy/area/${d.id}`, label: d.name,
      ...(locked
        ? { lock: 'Unlocks after the Start-up pathway' }
        : { meta: `${done}/${total}`, metaLabel: `${done} of ${total} verified` }),
    };
  });

  const accredited = isAccredited(org);
  const enterpriseLock = enterpriseOpen(org, today)
    ? null
    : today < ENTERPRISE_OPENS ? 'From July 2027' : 'After accreditation';

  return [
    {
      items: [
        { href: '/app/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { href: '/app/score', label: 'My Check & Score', icon: 'clipboard-check' },
        ...(org.pathway ? [{ href: '/app/pathway', label: org.pathway === 'recovery' ? 'Recovery pathway' : 'Start-up pathway', icon: 'route' }] : []),
      ],
    },
    {
      label: 'Academy',
      items: [
        { href: '/app/academy/area', label: 'By area', icon: 'map', children: areas },
        { href: '/app/academy/action', label: 'By next action', icon: 'list-checks' },
        { href: '/app/academy/topic', label: 'By topic', icon: 'book-open' },
      ],
    },
    {
      items: [
        { href: '/app/evidence', label: 'Evidence locker', icon: 'folder-open' },
        { href: '/app/ali', label: 'Ask Ali', icon: 'sparkles' },
        { href: '/app/mentoring', label: 'Mentoring', icon: 'users' },
        { href: '/app/accreditation', label: 'Accreditation', icon: 'award' },
        { href: '/app/connect-profile', label: 'Connect profile', icon: 'building', lock: accredited ? null : 'Until accredited' },
        { href: '/app/enterprise', label: 'Enterprise hub', icon: 'briefcase', lock: enterpriseLock },
      ],
    },
    {
      divider: true,
      items: [
        { href: '/app/help', label: 'Help & resources', icon: 'life-buoy' },
        { href: '/app/settings', label: 'Settings', icon: 'settings' },
      ],
    },
  ];
}

const PARTNER_NAV = [{
  items: [
    { href: '/partner/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { href: '/partner/clients', label: 'Clients', icon: 'users' },
    { href: '/partner/refer', label: 'Refer a client', icon: 'user-plus' },
    { href: '/partner/connect', label: 'Connect search', icon: 'search' },
  ],
}];

const VERIFIER_NAV = [{
  label: 'Verification',
  items: [
    { href: '/team/queue', label: 'Review queue', icon: 'inbox' },
    { href: '/team/history', label: 'Decision history', icon: 'clock' },
  ],
}];

// Mentor views never include verify controls or verifier routes.
const MENTOR_NAV = [{
  label: 'Mentoring',
  items: [
    { href: '/team/mentor', label: 'This week', icon: 'calendar-days' },
    { href: '/team/mentor/mentees', label: 'Mentees', icon: 'users' },
  ],
}];

export function navFor(ctx) {
  switch (ctx.persona.role) {
    case 'lead': return ctx.org ? leadNav(ctx) : [];
    case 'partner': return PARTNER_NAV;
    case 'verifier': return VERIFIER_NAV;
    case 'mentor': return MENTOR_NAV;
    default: return [];
  }
}

/** The href to mark current: exact match, else the route's `nav`, else the longest matching prefix. */
export function currentHref(groups, ctx) {
  const all = groups.flatMap((g) => g.items.flatMap((i) => [i, ...(i.children ?? [])])).map((i) => i.href);
  if (all.includes(ctx.path)) return { href: ctx.path, exact: true };
  if (ctx.route.nav) return { href: ctx.route.nav, exact: false };
  const prefix = all.filter((h) => ctx.path.startsWith(`${h}/`)).sort((a, b) => b.length - a.length)[0];
  return prefix ? { href: prefix, exact: false } : { href: null, exact: false };
}
