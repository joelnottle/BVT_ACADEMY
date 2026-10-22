// BVT Connect directory (BUILD_PLAN §8.13). 12 fictional listings.
// status: 'accredited' | 'expired'. Certificates renew 12 months after issue.
// One expired certificate (from the earlier Business Vitality Tracker programme) shows the "expired" verify state.

const L = (id, name, industry, city, state, size, certNo, accreditedOn, renewsOn, capabilities, description, orgId = null) => ({
  id, orgId, name, industry, city, state, size, certNo, accreditedOn, renewsOn, capabilities, description,
});

export const CONNECT_LISTINGS = [
  L('cx-harbourline', 'Harbourline Civil Pty Ltd', 'Civil construction', 'Newcastle', 'NSW', 'Medium', 'BVT-2027-000123', '2027-04-26', '2028-04-26',
    ['Civil works', 'Drainage', 'Local government contracts'], 'Civil contractor delivering roads, drainage and site works across the Hunter.', 'org-harbourline'),
  L('cx-wattle', 'Wattle Grove Disability Services', 'Disability services', 'Wollongong', 'NSW', 'Medium', 'BVT-2027-000101', '2027-02-15', '2028-02-15',
    ['NDIS supports', 'Supported accommodation'], 'Registered NDIS provider supporting adults to live independently.'),
  L('cx-ironbark', 'Ironbark Facility Services', 'Facilities management', 'Brisbane', 'QLD', 'Medium', 'BVT-2027-000104', '2027-02-22', '2028-02-22',
    ['Cleaning', 'Grounds maintenance', 'Government facilities'], 'Facilities maintenance for schools, councils and community buildings.'),
  L('cx-lyrebird', 'Lyrebird Learning Ltd', 'Education and training', 'Hobart', 'TAS', 'Small', 'BVT-2027-000107', '2027-03-01', '2028-03-01',
    ['Adult literacy', 'Foundation skills'], 'Not-for-profit adult education provider in southern Tasmania.'),
  L('cx-redgum', 'Red Gum Aboriginal Corporation', 'Community services', 'Mildura', 'VIC', 'Small', 'BVT-2027-000110', '2027-03-08', '2028-03-08',
    ['Community programs', 'Youth engagement', 'Cultural services'], 'Community-controlled organisation delivering youth and family programs.'),
  L('cx-tidewater', 'Tidewater Marine Services', 'Marine services', 'Fremantle', 'WA', 'Small', 'BVT-2027-000112', '2027-03-15', '2028-03-15',
    ['Vessel maintenance', 'Port services'], 'Marine maintenance and port support services.'),
  L('cx-bluewren', 'Bluewren Health Collective', 'Health services', 'Launceston', 'TAS', 'Small', 'BVT-2027-000115', '2027-03-22', '2028-03-22',
    ['Allied health', 'Community health'], 'Allied health practitioners serving northern Tasmania.'),
  L('cx-sandstone', 'Sandstone Digital Pty Ltd', 'IT services', 'Sydney', 'NSW', 'Micro', 'BVT-2027-000117', '2027-03-29', '2028-03-29',
    ['Website development', 'Cyber security reviews'], 'Small digital agency working with community organisations.'),
  L('cx-desertpea', 'Desert Pea Catering Co', 'Hospitality', 'Alice Springs', 'NT', 'Micro', 'BVT-2027-000119', '2027-04-05', '2028-04-05',
    ['Event catering', 'Remote site catering'], 'Catering for events, conferences and remote work sites.'),
  L('cx-southerly', 'Southerly Transport Group', 'Transport and logistics', 'Adelaide', 'SA', 'Large', 'BVT-2027-000120', '2027-04-12', '2028-04-12',
    ['Freight', 'Fleet services'], 'Regional freight and logistics across South Australia.'),
  L('cx-paperbark', 'Paperbark Housing Association', 'Community housing', 'Darwin', 'NT', 'Medium', 'BVT-2027-000121', '2027-04-19', '2028-04-19',
    ['Tenancy management', 'Property maintenance'], 'Community housing provider in the Top End.'),
  L('cx-quandong', 'Quandong Training Services', 'Education and training', 'Broken Hill', 'NSW', 'Micro', 'BVT-2026-000041', '2026-03-02', '2027-03-02',
    ['First aid training', 'Workplace safety training'], 'Workplace training provider for western NSW.'),
];

export const INDUSTRIES = [...new Set(CONNECT_LISTINGS.map((l) => l.industry))].sort();
export const STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];
export const SIZES = ['Micro', 'Small', 'Medium', 'Large'];
