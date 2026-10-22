// Evidence locker (BUILD_PLAN §8.9). Pretend files: name and size only, nothing uploaded.
// One document can support several requirements (reuse) — see the February board minutes.
// status: 'uploaded' | 'in-review' | 'changes' | 'verified'

const E = (id, orgId, fileName, sizeKb, uploadedOn, requirementIds, status) => ({ id, orgId, fileName, sizeKb, uploadedOn, requirementIds, status });

export const EVIDENCE = [
  // ---- Kestrel (persona A) ----
  E('ev-k01', 'org-kestrel', 'accountant-engagement-letter-2027.pdf', 184, '2027-03-22', ['FM-01'], 'verified'),
  E('ev-k02', 'org-kestrel', 'acnc-register-extract.pdf', 96, '2027-03-26', ['GC-03'], 'verified'),
  E('ev-k03', 'org-kestrel', 'director-register.xlsx', 41, '2027-03-30', ['BD-01'], 'verified'),
  E('ev-k04', 'org-kestrel', 'employment-contract-template.docx', 58, '2027-04-02', ['OH-01'], 'verified'),
  E('ev-k05', 'org-kestrel', 'acnc-annual-information-statement-2026.pdf', 212, '2027-04-07', ['RP-01'], 'verified'),
  E('ev-k06', 'org-kestrel', 'code-of-conduct-2026.pdf', 133, '2027-04-09', ['GC-04'], 'verified'),
  E('ev-k07', 'org-kestrel', 'bank-signatory-authority.pdf', 77, '2027-04-14', ['FM-07'], 'verified'),
  E('ev-k08', 'org-kestrel', 'related-party-transactions-policy.pdf', 104, '2027-04-16', ['GC-05'], 'verified'),
  E('ev-k09', 'org-kestrel', 'budget-2027-28.xlsx', 66, '2027-04-21', ['FM-03'], 'verified'),
  E('ev-k10', 'org-kestrel', 'board-minutes-2027-02.pdf', 158, '2027-04-21', ['FM-03', 'FM-06'], 'verified'),
  E('ev-k11', 'org-kestrel', 'bank-reconciliations-q1-2027.pdf', 245, '2027-04-23', ['FM-02'], 'verified'),
  E('ev-k12', 'org-kestrel', 'coi-register.pdf', 88, '2027-04-24', ['GC-02'], 'changes'),
  E('ev-k13', 'org-kestrel', 'financial-statements-2026.pdf', 512, '2027-04-30', ['FM-06'], 'in-review'),
  // ---- Brightfield (persona B) ----
  E('ev-b01', 'org-brightfield', 'abn-and-business-name-registration.pdf', 72, '2027-04-08', ['SU-01'], 'verified'),
  E('ev-b02', 'org-brightfield', 'business-plan-2027.pdf', 340, '2027-04-14', ['SU-02'], 'verified'),
  E('ev-b03', 'org-brightfield', 'licences-checklist.pdf', 61, '2027-04-20', ['SU-03'], 'verified'),
  E('ev-b04', 'org-brightfield', 'business-account-statement.pdf', 49, '2027-04-26', ['SU-04'], 'verified'),
];
