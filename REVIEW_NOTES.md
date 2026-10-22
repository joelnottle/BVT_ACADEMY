# Review notes: placeholders and open questions

This lists everything in the prototype that stands in for content or decisions BVT / Vital Consult still needs to supply.

- Open questions are numbered as in [BUILD_PLAN.md §14](BUILD_PLAN.md).
- In the code they are marked `TODO(client)`. Placeholder content is marked `PLACEHOLDER`.
- On screen, placeholder content carries a small amber **"Placeholder content"** flag, so nothing can be mistaken for final copy.

Status at 23 Oct 2026 (end of Phase 15).

---

## 1. Decisions needed

| §14 | Question | What the prototype assumes | Where |
|---|---|---|---|
| Q1 | **Question bank:** real domains, modules, questions and the module ↔ question mapping | 6 domains taken from businessvitalitytracker.com, 18 modules and 45 requirements. Three are fully written (FM-04, GC-01, GC-02); the rest use templated text. | `data/domains.js`, `data/modules.js`, `data/requirements.js`, `data/requirements-hero.js` |
| Q2 | **Logo and brand:** final BVT Academy logo; staging display font | Supplied BVT Academy logo; Montserrat throughout; "A product of Vital Consult" in the public hero and footer only (Joel, 22 Oct 2026) | `assets/`, `css/tokens.css` |
| Q3 | **Readiness measure** | Progress = % verified. The tier is fixed at enrolment even as readiness rises. | `js/selectors.js` |
| Q4 | **Check answer scale** and how "Partly" counts | In place / Partly / Not yet / Not sure / N/A. Score = (in place + half of partly) ÷ applicable questions. | `data/checks.js`, `js/selectors.js` |
| Q5 | **Verification SLA** shown to users and staff | "Usually reviewed within 5 business days". The verifier queue treats this as about 7 calendar days (on track / due soon / over target). The final accreditation review time is not stated. | `data/copy.js`, `data/backoffice.js`, `data/help.js`, `data/account.js` |
| Q6 | **Commercials (Doc 3):** package prices, Ali and mentor credits per tier, top-ups, extensions, re-assessment | Prices show "Price to be confirmed". Placeholder credits: Foundation 10 Ali / 3 mentor, Core 8 / 2, Advanced 6 / 2, Ready 4 / 1. Ali top-ups 5 / 10 / 20 credits. Micro-Units use the brief's figures ($1,500 + $1,000 each, 8 Ali credits each). | `data/enrolment.js`, `data/ali.js`, `data/microunits.js`, `data/enterprise.js`, `data/mentoring.js`, `js/views/app/settings.js` |
| Q7 | **Partner consent:** what referred-client data institutions see, and how consent is captured | With consent: Check type, tier, verified readiness, pace, last activity. Without: stage only (referred / checked / enrolled / in progress / accredited). | `data/site-pages.js`, `data/connectPage.js` |
| Q8 | **One login for both stages** (Hami to confirm) | Yes: the same sign-in for the Check and the Academy. | `data/site-pages.js` |
| Q9 | **Ask Ali privacy wording** | "A closed environment, with your consent, using de-identified information. Not used to train public AI models." Flagged on the public Academy page. | `data/copy.js`, `data/site.js` |
| Q10 | **Single user in the Prequalification Stage** | Only the authorised lead signs in until the Enterprise hub; no co-users such as an accountant. | — |
| Q11 | **Recovery pathway** content and tone | The screening question exists. Until content arrives, Recovery organisations are **not** locked out of Core. Only Start-up has a pathway (7 items). | `data/pathways.js`, `data/enrolment.js`, `js/selectors.js` |
| Q12 | **Doc 1 and Doc 3** | Not yet received. Doc 3 drives every price and allowance above. | — |
| Q13 | **ORIC and Debt Management Checks:** do they feed the Academy? | You can take them, but enrolment always runs from a Core Check. Their question banks are samples. | `data/checkFlow.js` |
| Q14 | **Start-up and Recovery together** | If both apply, Start-up comes first. Both join at Foundation (12 months). | `js/checkSelectors.js`, `data/enrolment.js` |

### Also needed (not in §14)
- **Support contact details:** the email, phone and response time on Help & resources and in the public top bar (`hello@bvtacademy.com.au` is a placeholder). Real social profile links. → `data/site.js`, `data/help.js`
- **Hero photo rights:** confirm rights for the photo behind the V mask on Home. → `css/pages/public.css`
- **Testimonial:** a real quote and permission. The current one is fictional and flagged. → `data/site.js`

---

## 2. Placeholder content

| Content | Notes | Where |
|---|---|---|
| Requirements (42 of 45) | Titles are realistic; the "what's required", criteria and checklists are templated. Flagged on the requirement page. | `data/requirements.js` |
| Modules and learning items | Video titles, topic sessions and templates are illustrative. Flagged on module cards and pages. | `data/modules.js` |
| Free Check questions | The Core Checks sample the requirement bank. ORIC and Debt Management use short samples. The runner flags this. | `data/checkFlow.js` |
| Ask Ali answers | Scripted, matched by keyword. BVT should review the guidance before any production use. | `data/ali.js` |
| Mentor team and availability | Fictional mentors; a fixed pattern of booked slots. | `data/mentors.js`, `data/mentoring.js` |
| Leadership Micro-Units | Titles, summaries and lessons are illustrative. | `data/microunits.js` |
| Connect directory | Fictional organisations and certificate numbers. | `data/connect.js` |
| Organisations, people, reviews, notifications | All fictional (BUILD_PLAN §6.2). | `data/orgs.js`, `data/users.js`, `data/reviews.js`, `data/notifications.js` |

---

## 3. Shown as "coming soon" or Phase 2 (by design)

- **Download step → Partner tools:** a Phase 2 placeholder slot only. VC Vault appears only as the dismissible "From our partners" card.
- **Enterprise hub → Ask Ali Results assistant:** a "Coming soon" card.
- **Enterprise hub → Further checks:** the Growth Check and ESG Check are "Coming soon".

---

## 4. Pretend behaviour to replace in production

Out of scope for the prototype (BUILD_PLAN §15). Production architecture belongs to Hami (AWS Sydney).

- **Sign-in:** replaced by the Demo panel's persona switch.
- **Payments:** confirmation dialogs only. No card fields are ever rendered.
- **Uploads:** only the file name and size are read, locally. Nothing is stored.
- **Ask Ali:** scripted answers. There is no AI call.
- **Emails:** shown as on-screen previews (notifications, referral email).
- **Data:** everything lives in the browser's `localStorage` (`bvt-demo-v1`, data version 6). **Demo → Reset demo** restores the seed.
- **Certificate PDF, template downloads and evidence previews:** a toast or a mock page only.
