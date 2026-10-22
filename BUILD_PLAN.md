# BVT Academy — Clickable Prototype Build Plan

**Project:** BVT Academy (bvtacademy.com.au) — public site + learning & pre-qualification portal
**Deliverable:** A clickable HTML/CSS/JS prototype with "pretend" functionality, used for client sign-off and as the UX spec handed to the production build (Hami, AWS Sydney)
**Source brief:** BVT Doc 2 — Product & Platform Brief, v9, October 2026
**Prepared:** 22 October 2026 · Mercy Me Marketing (Joel)

> Pair this file with `CLAUDE.md` (standing rules for Claude Code) and `PHASE_PROMPTS.md` (copy-paste prompts, one per build phase).

---

## Contents

1. Decisions locked in
2. What the brief requires (rules the UI must respect)
3. Research → design principles
4. Brand & design tokens
5. Tech approach & folder structure
6. Roles, personas & demo controls
7. Information architecture & route map
8. Screen specs
9. The motivation & feedback system
10. Data model (mock)
11. Accessibility & responsive rules
12. Build phases & acceptance criteria
13. Click-through demo scripts
14. Open questions for Vital Consult / BVT
15. Out of scope
16. Research sources

---

## 1. Decisions locked in

| Decision | Choice |
|---|---|
| Branding | **BVT Academy** as its own identity, borrowing the Vital Consult palette (navy frame with plum, crimson and cream accents, §4.1a). Vital Consult appears only as an endorsement: "A product of Vital Consult" with the logo, in the public hero and footer. No bundled ecosystem marketing. |
| Look | Public site follows the VC homepage flow. Signed-in = **portal**: dark navy L-frame (left sidebar + slim header), **light work surface** for all reading and doing. |
| Discovery | **Three lenses on the same requirements**: *By area* (domain → module → requirement), *By next action* (status board), *By topic* (learning library). One requirement record, three ways in. |
| Scope | Public site + free Check · enrolment & onboarding · full Academy portal · Ask Ali · mentoring · evidence & verification · accreditation · Connect · Enterprise hub (Jul 2027) · institutions/agents · verifier & mentor back-office. |
| Motivation | Primarily **professional milestones**. Plus understated credential-style **badges** and a light **weekly momentum streak**. **No celebratory animations, no leaderboards, no confetti.** |
| Fidelity | Branded, clickable mockup (not grey boxes). Placeholder content clearly marked where the real question bank is needed. |

---

## 2. What the brief requires

These are hard rules. Every screen must respect them.

**Ecosystem boundaries (§1)**
- BVT Academy is a standalone product. Vital Consult, Vital Money and VC Vault are **not** marketed as a bundle.
- **VC Vault** appears only as a targeted, dismissible prompt during evidence upload. It is **never a step** in the journey and never required.
- Graduates needing deeper expert help *may* be referred to Vital Consult — as a quiet referral link only, post-accreditation.

**Master site (§2)**
- Domain: bvtacademy.com.au (businessvitalitytracker.com redirects). "Business Vitality Tracker" is the registered name; **"BVT Academy"** is the platform name.
- Homepage hero asks **"Have you pre-qualified your business?"** with three buttons:
  1. *Pre-qualify my business* → organisation journey
  2. *Send my clients through BVT* → institutions & agents
  3. *Find pre-qualified businesses* → BVT Connect directory

**Free Checks (§3)** — available at sign-up, no payment
| Check | For | Questions |
|---|---|---|
| BVT Core Pre-Qualification — Micro to Small | < 20 staff | 45 |
| BVT Core Pre-Qualification — Medium to Large | 20+ staff | 60 |
| ORIC Governance Check | ORIC-registered orgs | 76 |
| Debt Management Check | Orgs managing debt / recovery | 25 |

**Tailored pathways (§3, §4)** — Start-up and Recovery. Unlocked at enrolment for eligible orgs, and **must be completed before Core requirements unlock**.

**How the Academy works (§4)**
- All requirements **visible from day one** and, for most orgs, **unlocked**. The org **chooses where to start**. **No forced linear path.** Self-paced within the time limit.
- Two requirement types:
  - **Already in place** → evidence upload only (no training video required).
  - **Not yet in place** → training, resources, Ask Ali and mentor credits → implement → upload evidence.
- **Learning loop:** Watch → Learn → Download → Do it → Upload evidence → BVT verifies → Requirement closes.
- **Learn** = three supports: pre-recorded topic sessions, **Ask Ali AI** (credit allowance), **bookable mentor credits**.
- **Download** step may later promote third-party tools (VC Vault, Weel) — **Phase 2**; reserve a slot, do not build it out.
- Learning is built as **topic modules**, each serving **2–5 related questions**. Learning is shared; **implementation steps and evidence are tailored per question**.
- Learning is **optional** in the Prequalification Stage — controllers can **fast-track to implementation and evidence**. Verification still confirms understanding.
- **Mentors never verify.** Verification is a separate, independent, AI-assisted team.

**Ask Ali AI (§4.2)**
- Included in every package as a **credit allowance** (1 credit ≈ 1 hour of typical use). Top-ups purchasable.
- Scoped to BVT Academy learning and evidence preparation.
- Privacy messaging: closed environment, de-identified, used with consent, not used to train public models. AI provider's data processing location is **still being confirmed** — keep copy generic and flagged.

**Who completes the Check (§4.3)** — the nominated **authorised lead** (public officer, bank-account holder, founder/CEO/ED/CFO). BVT does not prescribe.

**Stages (§5)**
- **Prequalification Stage** (from Jan 2027): one person, one organisation, one journey. → Accreditation → listed as contact on BVT Connect.
- **Enterprise Stage** (first release 1 July 2027): invite board/leaders/staff, **Leadership Micro-Units** (finance, governance, HR, operations; $1,500 first participant, $1,000 each additional; 2–4 weeks; online; 8 Ask Ali credits per participant), annual accreditation maintenance, keep Connect profile current, add Growth and ESG checks.
- Hub access after accreditation: **no subscription**. Pay-as-needed: re-assessment, further checks, Micro-Units, mentoring, Ali top-ups. Re-assessment due **12 months after accreditation**.
- Enterprise Ask Ali becomes a results assistant (draft tenders, explain financials, draft contracts/HR docs) — show as "coming" only.
- **One login portal for both stages** is proposed (to be confirmed by Hami). The prototype assumes one portal.

**Timeframes (§6)** — clock starts at **Academy enrolment**, not the free Check.
| Tier | Pre-qualification met | Time limit |
|---|---|---|
| Foundation (incl. Start-up & Recovery) | 0–25% | 12 months |
| Core | 26–50% | 9 months |
| Advanced | 51–75% | 6 months |
| Ready | 76–100% | 3 months |

Extensions monthly or in 3-month blocks; re-enrolment at current tier available. Pricing lives in Doc 3 — **use placeholders**.

---

## 3. Research → design principles

Research summary (sources in §16):

- **Compliance platforms are the closest analogue, not course platforms.** The job is "close requirements with evidence". B Lab's B Impact platform organises into *Home (next steps) / Measure / Improve / Certify*, which maps almost 1:1 onto *Check / Academy / Accreditation / Connect*. Vanta and Drata lead with a **readiness %**, a **"needs attention"** list, and widgets that **click through to pre-filtered lists**.
- **Self-paced + deadline is where people drop off.** Coursera found "life gets in the way": removing deadlines lifted enrolment but people forgot and never came back. What helped was **milestones, salient reminders, and resetting a schedule without losing work**. edX added **weekly learning goals with reminder emails**, citing ~50% higher completion from personalised schedules in earlier work.
- **Let people skip what they know.** Khan Academy's course challenges and unit tests let learners test out. This maps directly onto the brief's fast-track.
- **LMS UX basics.** Keep the outline and "you are here" always visible. Use consistent, minimal progress indicators. Offer **resume where you left off**. Keep help one click away. Remove distractions during lessons. Meet WCAG.
- **Motivation (self-determination theory).** People persist when they feel **autonomy** (choosing where to start), **competence** (visible progress, quick wins, specific feedback) and **relatedness** (mentor, Ali, a human verifier who responds).

**Design principles for this build**

1. **Readiness first, courses second.** The home screen answers "how close am I to accreditation, and what's next?", not "which video?".
2. **Choice with a recommendation.** Everything is open, and the system still suggests the next three moves and says *why*.
3. **Three lenses, one truth.** By area / By next action / By topic all open the same requirement page, and state is shared.
4. **Pace, not pressure.** Show days left as a pace status (*Ahead / On pace / Needs a catch-up*), never a red countdown. Extensions read as a normal option, not a failure.
5. **Skip what you know.** "Already in place" goes straight to upload. "Not yet in place" offers *I know this — go to evidence*.
6. **Feedback at every step.** Each action produces a visible state change and a clear "what happens next". Verifier comments are framed constructively.
7. **Help is one click away.** Ask Ali slides over any page with the current requirement as context. Mentor booking is one click from any requirement.
8. **Dark frame, light work.** Navy chrome for orientation. White and near-white surfaces for reading, forms and evidence.
9. **Clean boundaries.** Mentor ≠ verifier. VC Vault = optional prompt. No ecosystem bundling.

---

## 4. Brand & design tokens

Colours were sampled from the new Vital Consult homepage design and contrast-checked against WCAG 2.2. **Direction:** dark tones (navy frame, dark hero) for orientation, light clear work surfaces for reading, and Vital Consult's **plum, crimson and cream** as highlights (§4.1a). `css/tokens.css` is the source of truth; this section summarises it.

### 4.1 Palette

```css
:root {
  /* Navy — chrome, dark sections */
  --navy-950: #0b0e16;
  --navy-900: #0f131d;   /* sidebar, header */
  --navy-800: #1b202b;   /* dark cards, hover in sidebar */
  --navy-700: #242a3b;   /* CTA bands, active nav item bg */
  --navy-600: #3d4456;   /* secondary text on light (9.0:1 on --surface-1) */

  /* Brand highlight */
  --pink-500:   #ea466c;   /* brand pink — decorative/large only on light */
  --orange-400: #f39759;   /* brand orange — decorative, or text on navy (7.3:1) */
  --magenta-500:#da3475;   /* eyebrows on dark */
  /* Gradients are defined with the VC accents in §4.1a */

  /* Text-safe accents on light surfaces */
  --accent-text: #b81f55;  /* links/eyebrows on light (5.8:1 on --surface-1) */

  /* Light work surface */
  --surface-0: #ffffff;    /* cards, panels */
  --surface-1: #f6f6f8;    /* app canvas */
  --surface-2: #ececf1;    /* subtle fills, table stripes */
  --border:    #dfe0e7;
  --text-1:    #1b202b;    /* 15.1:1 */
  --text-2:    #3d4456;    /* 9.0:1 */
  --text-3:    #656b78;    /* meta only (#6b7280 was 4.48:1 on canvas; darkened to pass) */

  /* On-dark text */
  --on-dark-1: #f0f0f2;
  --on-dark-2: #aab0c0;    /* 7.5:1 on navy-800 */
  --on-dark-3: #8b92a5;    /* 5.2:1 on navy-800 */

  /* Status — always paired with an icon + label, never colour alone */
  --st-not-started:  #6b7280;
  --st-learning:     #2f6fd6;   /* Learning & implementing */
  --st-evidence:     #9a5b00;   /* Evidence needed */
  --st-review:       #5b4bd6;   /* In review */
  --st-changes:      #c8264f;   /* Changes requested */
  --st-verified:     #17784e;   /* Verified / closed */
  --st-locked:       #6b7280;   /* + lock icon */
  /* Each status also gets a tint bg: same hue at ~10% on white */

  /* Tier ladder */
  --tier-foundation: #8b92a5;
  --tier-core:       #2f6fd6;
  --tier-advanced:   #5b4bd6;
  --tier-ready:      #17784e;
  --tier-accredited: var(--grad-brand);
}
```

### 4.1a Vital Consult accents

Taken from the `--vcp-*` variables on staging3.mercyme.com.au. They are highlights, not a re-skin: the dark frame and light work surfaces stay.

```css
  --plum-600:    #942878;  /* eyebrows, icons, gradient start (7.4:1 on white, 6.3:1 on cream) */
  --plum-700:    #82277c;
  --crimson-500: #e62f5c;  /* VC crimson: decorative and large text only (white on it is 4.26:1) */
  --crimson-600: #d22d63;  /* white text on it 4.9:1; small text on white 4.9:1 */
  --peach-300:   #f8b29c;
  --cream-200:   #ffecb9;  /* bands, certificate */
  --cream-100:   #fff6e9;  /* highlight cards: Resume, milestones, callouts */
  --cream-50:    #fffbf3;

  --grad-brand:      linear-gradient(90deg, #942878, #e62f5c 55%, #f8b29c);  /* light contexts */
  --grad-brand-dark: linear-gradient(90deg, #e62f5c, #f8b29c);               /* on navy (plum is 2.5:1 there) */
  --grad-action:     linear-gradient(90deg, #942878, #d22d63);               /* buttons with white text: 7.4 → 4.9:1 */
  --grad-warm:       linear-gradient(240deg, #fff, #ffecb9 65%, #f8b29c);    /* cream/peach wash */
  --grad-vc-bar:     linear-gradient(90deg, #942878, #e62f5c 35%, #f8b29c 70%, #ffecb9); /* thin top bar */
```

**Where accents go (one warm focal point per screen):**
- Thin `--grad-vc-bar` across the top of the public header and the portal frame.
- Two-tone headings: one crimson word (`.accent`) plus a short crimson rule (`.rule`). Eyebrows in plum.
- Cream for highlight surfaces: "Resume where you left off", milestone cards, callouts, the certificate, the Check results summary, and alternating bands on the public site.
- A solid crimson-600 feature strip (the 4-step Check → Connect strip), as on the VC homepage.
- Line icons stroked in the plum → crimson gradient (`.icon-grad`, cream `.icon-tile`).
- Plum-tinted soft shadows.

**Contrast rules (measured):**
- White text only on `--grad-action` or `--crimson-600`, never on `--grad-brand`, `--crimson-500` or peach.
- On navy, use `--grad-brand-dark`, not plum.
- `--pink-500` on white is 3.8:1, so use it for large/decorative elements only. Use `--accent-text` for links and small text on light surfaces.
- On navy, `--orange-400` (7.3:1) and `--pink-500` (4.3:1, large text only) are fine for highlights.

### 4.2 Typography

The Vital Consult staging site uses Montserrat throughout.
- `--font-display: "Montserrat", system-ui, sans-serif;` at weights 300/400 for H1–H3 and hero copy (Google Fonts).
- `--font-body: "Inter", system-ui, sans-serif;` at weights 400/500/600 for UI and long-form learning text. It is more legible at small sizes on dense screens.
- Scale: 12 / 14 / 16 (body) / 18 / 20 / 24 / 32 / 40 / 56. Learning content body is 17px with 1.6 line-height and a max line length of 72ch.

### 4.3 Shape, depth, motion

- Radius: 10px (inputs, chips), 16px (cards), 24px (hero panels), 999px (pills/buttons, matching the VC pill buttons).
- Shadows: soft, low and diffuse on light, plum-tinted like the VC site (`0 1px 2px rgb(15 19 29 / .06), 0 8px 24px rgb(148 40 120 / .07)`). On dark, use a 1px `rgb(255 255 255 / .06)` border instead of shadows.
- Signature motif: the **V shape**, used sparingly (hero image mask, empty states, accreditation certificate). Plus a soft magenta radial glow behind dark hero sections, as in the VC hero.
- Motion: 150–200ms ease-out for hover, focus and panel slide only. **No celebratory animation.** Honour `prefers-reduced-motion`.

### 4.4 Iconography

Lucide icons, thin 1.5px stroke, matching the VC line icons. Feature icons are stroked in the plum → crimson gradient and sit in a cream rounded square (as in the VC service cards).

### 4.5 Logo

Placeholder wordmark "**BVT** Academy" (BVT in 600 weight, Academy in 300) with a small gradient tick or V mark. **⚠ Needs the real BVT logo.** The current businessvitalitytracker.com has one, so confirm whether it carries over.

---

## 5. Tech approach & folder structure

**Stack:** vanilla HTML + CSS + JavaScript (ES modules). No framework and no build step. It runs from VS Code with the **Live Server** extension (ES modules need a local server; `file://` will not work).

**Why:** zero setup, easy to hand over, easy to publish to a staging folder, and the markup and CSS stay readable as a spec for the production team.

**Architecture**
- **Single-page app with hash routing** (`#/app/dashboard`), so it works on any static host with no server rewrites.
- **Three layouts** chosen by route prefix:
  - `public`: marketing header and footer
  - `portal`: dark sidebar, slim header, light canvas
  - `backoffice`: same shell with a different nav and a "BVT Team" badge
- **Store:** one state object seeded from `/data`, persisted to `localStorage` under `bvt-demo-v1` and wrapped in try/catch. It falls back to in-memory if storage is unavailable. Includes a simple pub/sub so views re-render on change.
- **Views** are functions that return template-string HTML and bind events after render. No virtual DOM.
- **Pretend actions** (upload, pay, book, submit, verify) always produce visible feedback: a state change, a toast, or a timeline entry. **Nothing is sent anywhere.**
- **Icons:** Lucide from unpkg at a pinned version, or a local SVG sprite.
- **Charts:** hand-built SVG (readiness ring, progress bars, tier ladder). No chart library.

```
bvt-academy-prototype/
├─ index.html                  # single entry; loads app.js
├─ CLAUDE.md
├─ BUILD_PLAN.md
├─ PHASE_PROMPTS.md
├─ assets/
│  ├─ img/                     # placeholder photos, logo, V-mask svg
│  └─ icons/                   # optional local sprite
├─ css/
│  ├─ tokens.css               # §4 — the only place raw colour values live
│  ├─ base.css                 # reset, typography, focus, utilities
│  ├─ layout-public.css
│  ├─ layout-portal.css        # sidebar, header, canvas, drawer
│  ├─ components.css           # buttons, chips, cards, tabs, stepper, table, toast, modal, slide-over
│  └─ pages/*.css              # page-specific only when unavoidable
├─ js/
│  ├─ app.js                   # boot, router, layout switch
│  ├─ router.js
│  ├─ store.js                 # state, persistence, selectors, actions, resetDemo()
│  ├─ demo-panel.js            # role/persona switcher, time travel, reset
│  ├─ components/*.js          # stepper, statusChip, readinessRing, tierLadder, reqCard, aliPanel, toast, modal…
│  └─ views/
│     ├─ public/*.js
│     ├─ check/*.js
│     ├─ portal/*.js
│     ├─ enterprise/*.js
│     ├─ partner/*.js
│     └─ backoffice/*.js
└─ data/
   ├─ domains.js  modules.js  requirements.js   # question bank (placeholder)
   ├─ orgs.js  users.js  mentors.js  sessions.js
   ├─ evidence.js  reviews.js  notifications.js
   ├─ connect.js  partners.js  microunits.js  badges.js
   └─ copy.js                  # shared microcopy, status labels, feedback phrasing
```

---

## 6. Roles, personas & demo controls

### 6.1 Roles

| Role | Where | Can |
|---|---|---|
| Visitor | Public site | Browse, start free Check, search Connect, verify a certificate |
| **Authorised lead** (primary user) | Portal | Complete Check, enrol, work requirements, use Ali and mentors, submit evidence, manage Connect profile |
| Team member (Enterprise only) | Portal (reduced nav) | Take assigned Micro-Units, use own Ali credits |
| Institution / agent | Partner portal | Refer clients, see consented client progress, search Connect |
| Mentor | Back-office | Calendar, mentees, session notes, Ask Ali for mentors. **Cannot verify.** |
| Verifier | Back-office | Review queue, evidence review, verify / request changes. **Cannot be the org's mentor.** |

### 6.2 Demo personas (all fictional)

| Persona | Org | Situation | Shows |
|---|---|---|---|
| **A — Sam Rivera, CEO** | *Kestrel Community Services Ltd*, 14 staff, SA | Core Micro–Small Check score **41% → Core tier** (9 months). Enrolled 8 weeks ago (demo date Mon 3 May 2027; ends 8 Dec 2027). 45 requirements: 18 in place, 27 to build. 10 verified (22%), 9 in-place awaiting evidence. One item *changes requested*. One mentor session booked. | Main portal journey |
| **B — Ana Kowalski, Founder** | *Brightfield Start-up Co*, 3 staff | Identified **Start-up** at enrolment. **Foundation tier** (12 months). Core requirements **locked** until the Start-up pathway is done. | Gated pathway |
| **C — Tom Okafor, CFO** | *Harbourline Civil Pty Ltd*, 48 staff | **Accredited** (Medium–Large). Demo date set to Aug 2027. | Enterprise hub, team, Micro-Units, re-assessment |
| **D — Lena Ng, Lending Partner** | *Southern Community Lenders* (fictional) | Referred 6 clients | Partner portal |
| **E — Priya Desai, Verifier** | BVT verification team | 9 items in queue | Back-office review |
| **F — Marcus Hale, Mentor** | BVT mentor | 5 mentees, 3 sessions this week | Mentor view |

### 6.3 Demo panel

A floating button bottom-left labelled "Demo". It opens a small panel with:
- **View as:** Visitor · Persona A–F (switches role, persona and landing route)
- **Time travel:** +1 week / +1 month / jump to "accredited" (moves pace, deadlines, review outcomes and the streak)
- **Simulate:**
  - verifier approves next item
  - verifier requests changes
  - mentor session completed
- **Reset demo** (re-seeds the store)
- A "Prototype — no data is sent" note

---

## 7. Information architecture & route map

### 7.1 Public (`layout: public`)

| Route | Page |
|---|---|
| `#/` | Home |
| `#/how-it-works` | Check → Academy → Accreditation → Connect |
| `#/checks` | The four free Checks + tailored pathways |
| `#/academy` | What's inside: learning loop, Ask Ali, mentors, tiers & timeframes |
| `#/institutions` | "Send my clients through BVT" |
| `#/connect` | Directory search |
| `#/connect/:orgId` | Public profile |
| `#/verify` · `#/verify/:certNo` | Public certificate verification |
| `#/sign-in` · `#/sign-up` | Auth (pretend) |

Public header: Logo · How it works · Checks · Academy · For institutions · BVT Connect · Sign in · **[Start free check]** (gradient pill).

### 7.2 Free Check & enrolment (`layout: public`, focused, minimal header)

| Route | Page |
|---|---|
| `#/check/start` | Authorised-lead declaration + org details |
| `#/check/choose` | Recommend a Check from staff count / ORIC / debt answers |
| `#/check/run/:checkId` | Question runner |
| `#/check/results` | Score, tier, domain breakdown, next step |
| `#/enrol` | Package & tier, pretend payment |
| `#/onboarding` | 4-step welcome wizard |

### 7.3 Portal (`layout: portal`)

**Slim header (56px, navy-900):**
- Left: collapse toggle, page title / breadcrumb on narrow screens.
- Centre: **search** (⌘K / Ctrl+K: requirements, modules, evidence).
- Right:
  - **Ask Ali chip** ("Ali · 7.5 credits", opens slide-over)
  - **Mentor credits chip** ("2 mentor sessions")
  - **Pace pill** ("219 days · On pace")
  - Notifications bell
  - Help
  - Avatar menu (Profile & recognition, Organisation, Billing & credits, Sign out)

**Dark sidebar (264px; 72px icon rail at 768–1023px; off-canvas drawer < 768px — see §11):**

```
[BVT Academy logo]
┌ Mini status ────────────┐
│ ◔ 22% verified · Core    │
│ ▬▬▬▬▭▭▭▭▭▭  On pace      │
└──────────────────────────┘
  Dashboard
  My Check & Score
  ACADEMY
  ▾ By area                   ← expandable tree
      Governance & Constitution   3/6
      Board & Directors           1/5
      Financial Management        4/9
      Operations & HR             1/8
      Risk & Continuity           0/7
      Reporting & Compliance      1/10
    By next action              ← status board
    By topic                    ← learning library
  Evidence locker
  Ask Ali
  Mentoring
  Accreditation
  Connect profile        🔒 (until accredited)
  Enterprise hub         🔒 From July 2027
  ─────────
  Help & resources
  Settings
```

Active item: `--navy-700` background, 3px gradient bar on the left edge, `aria-current="page"`.

| Route | Page |
|---|---|
| `#/app/dashboard` | Dashboard |
| `#/app/score` | My Check & Score (read-only answers, domain breakdown, re-take info) |
| `#/app/academy/area` · `/area/:domainId` | By area lens |
| `#/app/academy/action` | By next action lens (board / list) |
| `#/app/academy/topic` | By topic lens (library) |
| `#/app/module/:moduleId` | Module page |
| `#/app/req/:reqId` · `/req/:reqId/:step` | **Requirement page** (the heart) |
| `#/app/pathway` | Start-up / Recovery pathway (persona B) |
| `#/app/evidence` | Evidence locker |
| `#/app/ali` | Ask Ali full page |
| `#/app/mentoring` · `/mentoring/book` | Mentoring |
| `#/app/accreditation` | Accreditation |
| `#/app/connect-profile` | Connect profile editor |
| `#/app/recognition` | Badges, milestones, momentum |
| `#/app/notifications` | Notification centre + mock email previews |
| `#/app/plan` | Pace plan, weekly goal, extensions |
| `#/app/enterprise/*` | Enterprise hub (overview, team, micro-units, checks, purchases) |

### 7.4 Partner portal (`layout: portal`, partner nav)

`#/partner/dashboard` · `/partner/clients` · `/partner/clients/:orgId` · `/partner/refer` · `/partner/connect`

### 7.5 Back-office (`layout: backoffice`)

- Verifier: `#/team/queue` · `/team/review/:reviewId` · `/team/history`
- Mentor: `#/team/mentor` · `/team/mentor/sessions/:id` · `/team/mentor/mentees`

---

## 8. Screen specs

> Wireframes are indicative. `[ ]` = button, `( )` = chip, `▬` = progress.

### 8.1 Public home

Follows the VC homepage rhythm: dark hero → overlapping dark feature strip → light sections → dark testimonial → dark CTA band → footer.

1. **Hero (dark, magenta glow, V-masked photo right):**
   - Eyebrow "PREQUALIFIED. ACCREDITED. CONNECTED."
   - H1 "Have you pre-qualified your business?"
   - Short sub
   - **Three buttons**: [Pre-qualify my business] (gradient) · [Send my clients through BVT] (outline) · [Find pre-qualified businesses] (outline)
2. **Overlapping strip, 4 steps:** Check · Academy · Accreditation · Connect.
3. **Free Checks:** 4 cards (name, who it's for, question count, ~time) + a note on Start-up and Recovery pathways.
4. **How the Academy works:** the learning loop as a horizontal 7-step diagram, plus "Already in place? Skip straight to evidence."
5. **Tiers & timeframes:** 4 tier cards with % bands and time limits. "Your clock starts when you enrol, not when you take the free Check."
6. **Support:** Ask Ali (24/7, credits included) · Mentors (bookable 1:1) · Independent verification (mentors never verify).
7. **The credential:** certificate preview with number + QR. "Anyone can verify it."
8. **Connect teaser:** search bar + 3 sample listings.
9. **For institutions:** short band linking to `#/institutions`.
10. Testimonial (placeholder) · FAQ accordion · CTA band "Start your free check" · Footer.

### 8.2 Free Check

- **Start:**
  - Authorised-lead declaration with examples (public officer, bank-account holder, founder/CEO/ED/CFO) and "Your organisation decides who completes this."
  - Org name, ABN (pretend validate), staff count, ORIC-registered? Managing debt?
- **Choose:** recommends the right Check; the others remain selectable.
- **Runner:**
  - Section rail by domain on the left, with per-section progress.
  - One question per card, with a "Why we ask" expander.
  - Answers: **In place · Partly · Not yet · Not sure · N/A**. Optional note.
  - Autosave indicator. [Save & exit]. "Question 12 of 45".
  - Demo: [Skip to results] button.
  - Prototype holds ~12 real-feeling sample questions; counters show the true total.
- **Results:**
  - Score ring (41%) and tier badge (**Core — 9 months**).
  - Domain bars.
  - "**18 already in place** — you'll upload evidence for these" / "**27 to build** — training, Ali and mentors will help."
  - [Download results PDF] (pretend).
  - Primary CTA [Enrol in the Academy].
  - Reassurance: "Your enrolment clock only starts when you enrol."

### 8.3 Enrolment & onboarding

- **Enrol:**
  - Tier auto-set from score.
  - Package card: time limit, Ali credit allowance, mentor credits, verification.
  - Price placeholder (Doc 3).
  - [Pay (demo)] button. **No card fields**; it just advances.
  - Start-up/Recovery screening questions appear here when relevant.
- **Onboarding (4 steps, skippable, progress dots):**
  1. **Your timeline:** start/end dates, requirement count, suggested pace (e.g., "about 3 requirements a fortnight").
  2. **Your weekly goal:** pick a weekly time budget (1–2h / 3–4h / 5h+) and a reminder day. Editable later in `#/app/plan`.
  3. **Where to start:** three cards.
     - **Quick wins:** "18 requirements are already in place. Upload evidence and watch your readiness climb."
     - **Biggest gaps:** "Financial Management needs the most work. Start with the learning there."
     - **Choose an area:** pick a domain.
     - Persona B instead sees "Your Start-up pathway comes first. Here's why."
  4. **Your support:** Ask Ali (credit explainer, 1 credit ≈ 1 hour) and mentor credits, with a note that **mentors help, independent verifiers decide**.

### 8.4 Dashboard

```
┌ Header ─────────────────────────────────────────────────────────────────────────┐
│ ☰  🔍 Search…                (Ali · 7.5) (2 mentor) (219 days · On pace) 🔔 ⓘ (SR)│
├────────┬────────────────────────────────────────────────────────────────────────┤
│Sidebar │ Good morning, Sam                                                       │
│        │ ┌ Resume where you left off ───────────────────────────────┐ ┌ Readiness ┐│
│        │ │ FM-04 Monthly cash flow forecast · Step: Do it           │ │   ◕ 22%   ││
│        │ │ [Continue →]                                             │ │ verified  ││
│        │ └──────────────────────────────────────────────────────────┘ │ +9 in     ││
│        │ ┌ Needs your attention ────────────┐ ┌ Your pace ──────────┐│ place,    ││
│        │ │ ● GC-02 changes requested        │ │ 219 days left       ││ awaiting  ││
│        │ │ ● 9 in-place items need evidence │ │ 35 to go · On pace  ││ evidence  ││
│        │ │ ● Mentor session Thu 10:00       │ │ [Adjust plan]       │└───────────┘│
│        │ └──────────────────────────────────┘ └─────────────────────┘             │
│        │ Tier ladder: Foundation ─ Core ●─ Advanced ─ Ready ─ Accredited           │
│        │ ┌ Recommended next ───────────────────────────────────────────────────┐ │
│        │ │ [Quick win] GC-01 Constitution on file — upload only, ~15 min        │ │
│        │ │ [Unblocks 3] FM module: Cash flow & budgeting — shared learning      │ │
│        │ │ [Biggest gap] RC-01 Risk register — start with a 6-min video        │ │
│        │ └─────────────────────────────────────────────────────────────────────┘ │
│        │ Areas  ▬▬▬▭▭ Governance 3/6   ▬▭▭▭▭ Board 1/5   ▬▬▭▭▭ Finance 4/9 …     │
│        │ This week: goal 2h · 1h 20m done   Momentum: 6 active weeks             │
│        │ Recent: ✓ FM-02 verified · 🏅 First requirement verified · Ali tip …    │
│        │ ┌ Ask Ali ─ "What does a good risk register look like?"   [Ask] ┐       │
└────────┴────────────────────────────────────────────────────────────────────────┘
```

- **Readiness ring is two-layer:**
  - **Solid** arc = verified requirements (the real measure).
  - **Hatched** arc = claimed "in place" from the Check but not yet evidenced.
  - This makes quick wins visible: "upload these and the hatched becomes solid".
- **Every widget clicks through to a pre-filtered lens.** Example: "9 in-place items need evidence" opens By next action filtered to *Evidence needed* and *In place*.
- **Recommended next** always shows a **reason tag**: Quick win · Unblocks N · Biggest gap · Continue module · Due soon.

### 8.5 Academy — the three lenses

The page header is shared across lenses:
- Segmented control **[By area] [By next action] [By topic]**
- A search box
- Filter chips: Type (In place / Not yet) · Status · Effort · Area

The chosen lens is remembered per user.

**By area** (the map):
- Domain accordions, each showing a progress bar and an "x/y verified" count.
- Inside each domain: module rows, then requirement rows.
- Each requirement row shows: code, title, type chip, status chip, effort, and a chevron.
- The sidebar tree mirrors this view.

**By next action** (the to-do view):
- Board columns: **To start · Learning & implementing · Evidence needed · In review · Changes requested · Verified**.
- Cards show: code, title, area, reason tag, and a "last activity" note.
- A **[Board | List]** toggle; List is the accessible default on small screens.
- No drag-and-drop. Status changes come from real actions on the requirement page, so the board can't drift from the truth.

**By topic** (the learning library):
- Row: "Continue learning". Row: "Recommended for your gaps".
- Then a module grid. Each card shows: thumbnail, title, area, video count and duration, "Serves 3 requirements", learning progress and evidence progress.
- Filters: area, format (video / session / template).

### 8.6 Module page

- Header: area, title, short intro, a **two-progress summary** ("Learning 60% · Evidence 1 of 3 verified").
- Left column:
  - video playlist (Watch)
  - topic sessions (Learn)
  - templates (Download)
- Right column: **"Requirements this module serves"** list. Each row has its status and opens that requirement's tailored implementation and evidence.
- Callout: "Learning is shared. What you implement and upload is specific to each requirement."
- [Ask Ali about this module] · [Book a mentor for this topic]

### 8.7 Requirement page (the core screen)

```
Academy › Financial Management › Cash flow & budgeting › FM-04
FM-04  Monthly cash flow forecast            (Not yet in place) (Learning & implementing)  ~3h
──────────────────────────────────────────────────────────────────────────────────────────────
 ① Watch ─ ② Learn ─ ③ Download ─ ④ Do it ─ ⑤ Upload ─ ⑥ Verify ─ ⑦ Closed
                                     ▲ you are here           [I know this — go to evidence]
┌ Step panel ───────────────────────────────────────────┐ ┌ About this requirement ───────────┐
│ ④ Do it                                                 │ │ What's required                    │
│ Implement in your organisation:                         │ │ Why it matters (funders/tenders)   │
│ ☑ Choose a forecast template                            │ │ What good evidence looks like      │
│ ☑ Load 12 months of actuals                             │ │ Shared learning with: FM-03, FM-05 │
│ ☐ Project 12 months forward                             │ │ Your notes  [ … ]                  │
│ ☐ Have it reviewed by the board / owner                 │ │ ─────────────────                  │
│ Notes for your verifier (optional) [ …        ]         │ │ [Ask Ali about FM-04]              │
│                          [Back]  [Mark done → Upload]   │ │ [Book a mentor]  2 credits left    │
└─────────────────────────────────────────────────────────┘ └────────────────────────────────────┘
```

**Stepper behaviour:**
- **Not yet in place:** all 7 steps are shown. Steps 1–4 are **optional and freely clickable**. Completed steps get a tick. The current step is highlighted. **[I know this — go to evidence]** jumps to Upload and records a "fast-track" flag the verifier can see.
- **Already in place:** a compact stepper shows **Upload → Verify → Closed**. A link reads "Need a refresher? Open the learning" and expands the full stepper.
- **Locked** (persona B, Core requirements): the page is readable but steps are disabled. Banner: "Unlocks when your Start-up pathway is complete — 4 of 7 done. [Go to pathway]".

**Step panels:**

1. **Watch**
   - 16:9 video placeholder (poster + play), duration, captions toggle, transcript expander.
   - [Mark as watched].
2. **Learn** — three cards:
   - *Topic sessions:* list of pre-recorded sessions.
   - *Ask Ali:* opens the slide-over seeded with the requirement context and three suggested prompts.
   - *Book a mentor:* credits remaining, next available slot.
3. **Download**
   - Template cards ("Cash flow forecast template · XLSX") with a pretend download that shows a toast.
   - A **dashed placeholder** block "Partner tools — coming in Phase 2" (reserved for VC Vault / Weel; no content yet).
4. **Do it**
   - The implementation checklist **tailored to this requirement** (persisted).
   - Optional notes for the verifier.
5. **Upload evidence**
   - "What good evidence looks like": 3 examples, plus "Common reasons evidence is returned".
   - Dropzone (pretend: reads the file name/size locally only, nothing uploaded) or **[Link existing evidence]** from the locker.
   - File list with remove.
   - Declaration checkbox ("This evidence is accurate and current").
   - [Submit for verification].
   - **VC Vault prompt:** a small dismissible card *below* the dropzone, labelled "From our partners": "Keeping track of compliance documents? VC Vault stores and organises them. [Learn more]". It is never inside the stepper, never blocks anything, and dismissal is remembered.
6. **Verify** — status timeline: Submitted → In review (est. 5 business days ⚠ confirm SLA) → outcome.
   - **Verified:** green state.
   - **Changes requested:** headed "Almost there — one thing to add". Shows the verifier's comment, what to add, a reply box, and [Upload revised evidence].
7. **Closed**
   - A calm confirmation panel: "FM-04 verified. Financial Management is now 5 of 9."
   - If a milestone was earned, a static badge card appears (no animation).
   - **Next recommended** requirement, with its reason.

**Right rail:** What's required · Why it matters · What good evidence looks like · Shared learning with (sibling requirements in the module) · Your notes · Ali and mentor shortcuts.

### 8.8 Start-up / Recovery pathway (persona B)

- A dedicated `#/app/pathway` page with a short ordered list of pathway requirements (the one place a sequence is recommended, still visibly progress-based).
- Progress "4 of 7".
- Each item opens the standard requirement page.
- The Academy lenses show Core items with a lock chip, and a banner explains why.
- On completion: milestone "Pathway complete — Core requirements unlocked". The dashboard switches to the standard state.

### 8.9 Evidence locker

- Table: file · linked requirement(s) · uploaded · status · verifier note · actions (view, link to another requirement, replace).
- Filters by status and area.
- **Reuse:** one document can support several requirements, which saves busy operators re-uploading.
- The VC Vault prompt may also appear here as a slim, dismissible banner.

### 8.10 Ask Ali

**Slide-over (from the header chip or any "Ask Ali" button):**
- 420px right panel.
- Context chip ("About FM-04 · Monthly cash flow forecast", removable).
- Suggested prompts.
- Scripted responses: keyword-matched canned answers, with a "typing" indicator only, no flourish.
- Credit meter: "7.5 credits · about 7 hours of typical use". [Top up] (pretend).
- Footer note: "Ali offers guidance — it doesn't verify your evidence." Plus a privacy line, kept generic until the provider's data location is confirmed.

**Full page `#/app/ali`:** conversation history list grouped by requirement, and saved answers (pin an answer to a requirement's notes).

### 8.11 Mentoring

- Credits remaining and how credits work.
- Mentor cards: name, specialties, "BVT accredited specialist". Led by the General Manager, so show a "Mentor team" header.
- **Book:**
  - pick a topic or requirement
  - pick a slot from the week grid
  - add prep notes
  - confirm (pretend; deducts a credit; adds to upcoming)
- Upcoming and past sessions, with mentor notes after completion.
- Persistent note: "Mentors help you implement. Verification is done by a separate, independent team."

### 8.12 Accreditation

- Progress to accreditation: all requirements verified, plus any final checks.
- Checklist of what's left, linking to a filtered lens.
- When complete: [Request accreditation review] → pending → **Accredited**.
- Certificate preview: org, certificate no. `BVT-2027-000123`, QR, issue and renewal dates. Includes [Download certificate PDF] (pretend) and a public verification link.
- Post-accreditation: Connect profile unlocks. Enterprise hub unlocks (from the July 2027 demo date). A quiet "Need deeper expert support?" referral link appears.

### 8.13 Connect profile (portal) & directory (public)

- **Profile editor:**
  - org name, ABN, industry, location, size, tier/accreditation, contact (the authorised lead), capabilities, short description
  - visibility toggle
  - live preview card
  - locked with a preview banner until accredited
- **Directory:** search plus filters (accreditation status, industry, location, size). Result cards show name, location, industry, "BVT Accredited" badge and certificate number.
- **Profile page:** a public view with a "Verify this certificate" link.
- **Verify page:** enter a certificate number → valid / expired / not found states.

### 8.14 Enterprise hub (persona C; unlocked after accreditation, demo date ≥ 1 Jul 2027)

- Badge "First release · July 2027".
- **Overview:**
  - accreditation status
  - **re-assessment due** date (12 months after accreditation) with [Purchase re-assessment]
  - score and answers review
  - "No subscription. Pay only for what you use."
- **Team:**
  - invite board members, leaders and staff (name, email, role)
  - pending / active states (pretend invites)
  - per-person Micro-Unit progress
- **Leadership Micro-Units:**
  - catalogue by area: Finance, Governance, HR, Operations
  - each card: 2–4 weeks · online · training videos · 8 Ali credits per participant · **$1,500 first participant, $1,000 each additional**
  - enrol participants: select team members → price summary → pretend checkout
- **Further checks:** Growth, ESG ("Coming soon"). Debt Management / ORIC if not done.
- **Purchases:** re-assessment, mentoring, Ali top-ups, extension (placeholders).
- **Ask Ali (Enterprise):** "Results assistant — coming soon" card listing draft tenders, financial report explanations, contract/HR drafts.
- **Team-member view:**
  - reduced sidebar (My learning, Ask Ali, Profile)
  - Micro-Unit page that reuses the module layout with a simple linear unit list and progress
  - the team member gets their own Ali credit meter

### 8.15 Partner portal (persona D)

- **Public `#/institutions` page:**
  - why pre-qualified clients matter to lenders and funders
  - how referral works
  - [Become a referral partner] (pretend form)
- **Partner dashboard:**
  - referred clients count
  - stage funnel (Checked → Enrolled → In progress → Accredited)
  - clients needing attention
- **Clients table:** org, Check type, tier, verified readiness %, pace status, last activity.
  - Only shown **where the client has consented to share progress** (consent chip; non-consented rows show stage only).
- **Refer a client:** name, email, optional note → creates a pretend referral link and email preview.
- **Connect search:** the same directory, embedded.

### 8.16 Back-office — Verifier (persona E)

- **Queue:**
  - table: requirement, org, submitted, age (SLA chip), type (in place / implemented), fast-tracked flag, AI pre-check result
  - filters
  - "assigned to me"
- **Review screen (split view):**
  - Left: requirement criteria checklist, org's notes, history of previous submissions.
  - Right: evidence preview (placeholder doc image / PDF mock).
  - **AI pre-check card:** "Ali pre-check: dated within 12 months ✓ · covers full year ✓ · approval/signature not found ✗". Labelled as an assistive suggestion; the human decides.
  - Decision: **[Verify]** or **[Request changes]**, with comment templates written in constructive language ("Almost there — please add…").
  - **Conflict guard:** if the verifier has been this org's mentor, the decision buttons are disabled with an explanation.
- **History:** decisions log.

### 8.17 Back-office — Mentor (persona F)

- This week's sessions, mentee list (org, tier, readiness, areas booked), session page (prep notes from the client, the requirement context, notes field, [Mark complete]).
- "Ask Ali (mentor)" slide-over.
- **No verify controls anywhere** in mentor views.

### 8.18 Notifications & reminders

- Bell dropdown plus a full page.
- Types:
  - verifier outcome
  - mentor reminder
  - weekly goal nudge
  - deadline milestones (60 / 30 / 14 days)
  - milestone earned
  - credit low (≤ 1)
- A **"Mock emails"** tab previews reminder emails as rendered cards. This shows the client the nudge strategy without sending anything.

### 8.19 Plan & extensions

- Pace plan: remaining requirements spread across the remaining weeks, with weekly goal and reminder day settings.
- "Life got in the way?" section:
  - [Re-plan my remaining time] redistributes the plan, nothing lost
  - [Extend by 1 month] / [Extend by 3 months] (pretend, price placeholder)
  - re-enrolment info
- Tone: practical and judgement-free.

### 8.20 Global states to design

Empty, loading (skeletons), error (friendly with retry), locked, offline note, first-run tooltips (max 3, dismissible), toasts (polite `aria-live`), confirmation modals only for irreversible pretend actions (submit for verification, pay).

---

## 9. The motivation & feedback system

**Primary: professional milestones** (stored in `badges.js`; earned via store actions)

| Milestone | Trigger |
|---|---|
| Check complete | Finish the free Check |
| Enrolled | Complete enrolment |
| First evidence submitted | First submission |
| First requirement verified | First verified |
| All in-place evidence submitted | Every "already in place" item submitted |
| Area complete (×6) | All requirements in a domain verified |
| Tier crossed | Verified readiness passes 25% / 50% / 75% |
| Pathway complete | Start-up / Recovery pathway done |
| Accredited | Accreditation issued |
| Enterprise: Micro-Unit complete | Team member completes a unit |

**Badges: credential style, understated**
- Flat circular seal, navy with a thin gradient ring and a line icon. Muted (outlined) until earned.
- On earning: a **static** card on the Closed step or a toast ("Milestone: Financial Management complete"). **No animation, no sound.**
- Shown on `#/app/recognition` and as a small row on the dashboard. Optional "Share to LinkedIn" (pretend) for Accredited only.

**Momentum streak: light touch**
- Counts **active weeks**, not days, to suit busy operators. A week is active if the org does one meaningful action: watch a video, complete a checklist, submit evidence, attend a mentor session, or ask Ali about a requirement.
- Shown small on the dashboard ("6 active weeks"). **One grace week per month** keeps the streak.
- **No negative copy.** A broken streak simply restarts quietly.

**Pace feedback**
- States: **Ahead · On pace · Needs a catch-up**, calculated from verified + submitted against the plan.
- "Needs a catch-up" always comes with a concrete suggestion ("2 quick wins would put you back on pace") and the re-plan option.

**Feedback microcopy rules** (in `copy.js`)
- Specific > generic: "FM-04 verified — Financial Management is now 5 of 9", not "Great job!".
- Forward-looking: every completion names the next sensible step.
- Changes requested = "Almost there". Name exactly what's missing.
- Never shame on time or streaks. Never use exclamation-mark hype.

**Never:** leaderboards, peer comparison, confetti, sound, celebratory animations, countdown timers in red.

---

## 10. Data model (mock)

```js
// domains.js
{ id: 'FM', name: 'Financial Management', order: 3, icon: 'banknote' }

// modules.js — topic modules shared across 2–5 requirements
{ id: 'mod-cashflow', domainId: 'FM', title: 'Cash flow & budgeting',
  intro: '…', videos: [{ id, title, mins }], sessions: [{ id, title, mins }],
  templates: [{ id, title, format: 'XLSX' }], requirementIds: ['FM-03','FM-04','FM-05'] }

// requirements.js — one per Check question
{ id: 'FM-04', domainId: 'FM', moduleId: 'mod-cashflow', title: 'Monthly cash flow forecast',
  required: '…', why: '…', goodEvidence: ['…','…','…'], commonReturns: ['…'],
  checklist: ['…','…','…','…'], effortHrs: 3, checks: ['core-ms','core-ml'],
  pathway: null /* or 'startup' | 'recovery' */ }

// orgs.js — per persona
{ id: 'org-kestrel', name: 'Kestrel Community Services Ltd', staff: 14, checkId: 'core-ms',
  checkScore: 41, tier: 'core', enrolledOn: '2027-03-08', endsOn: '2027-12-08',
  pathway: null, accreditedOn: null, certNo: null,
  credits: { ali: 7.5, mentor: 2 }, weeklyGoalHrs: 2, reminderDay: 'Mon',
  consentToPartners: ['partner-scl'] }

// progress (in store, per org)
reqProgress: { 'FM-04': { type: 'not-yet' | 'in-place', status: 'not-started' | 'learning' |
  'evidence-needed' | 'in-review' | 'changes' | 'verified', steps: { watch: true, learn: false,
  download: true, doIt: [true,true,false,false] }, fastTracked: false, evidenceIds: [], notes: '' } }

// evidence.js
{ id, orgId, fileName, sizeKb, uploadedOn, requirementIds: [], status }

// reviews.js
{ id, orgId, reqId, submittedOn, status, aiPrecheck: [{ label, pass }], verifierId, comment, history: [] }

// also: users, mentors, sessions, notifications, connect listings, partners, referrals,
// microunits ({ id, area, title, weeks: '2–4', aliCredits: 8, priceFirst: 1500, priceAdditional: 1000 }),
// badges, aliScripts (keyword → canned answer)
```

**Derived selectors** (in `store.js`):
- `verifiedReadiness(org)`
- `claimedInPlace(org)`
- `paceStatus(org, today)`
- `recommendedNext(org)`, which returns `[{ reqId, reason }]` using these rules:
  1. changes requested
  2. in-place items with no evidence (quick wins)
  3. the next requirement in the module currently being learned
  4. the biggest-gap domain's first requirement
  5. anything due by the pace plan
- `domainProgress(org)`
- `isLocked(req, org)`

**Content volume for the prototype:**
- 6 domains, ~16 modules, **45 requirements** (Core Micro–Small).
- **3 hero requirements** fully written:
  - FM-04 (not yet in place, full loop)
  - GC-01 (already in place, upload only)
  - GC-02 (changes requested)
- 7 Start-up pathway items.
- All others use templated placeholder text tagged `/* PLACEHOLDER — replace with BVT question bank */`.

---

## 11. Accessibility & responsive rules

**Accessibility**
- **WCAG 2.2 AA** throughout. Contrast as measured in §4.1. Visible focus ring: 2px `--orange-400` on dark, 2px `--accent-text` on light, with 2px offset.
- Skip link to main content. Landmarks: `header`, `nav[aria-label="Main"]`, `main`, `aside`.
- Sidebar: real links, `aria-current`, tree uses `aria-expanded`. Collapsed rail keeps tooltips and labels for screen readers.
- Status is **never colour-only**: icon + text label on every chip.
- Stepper: `<ol>` with `aria-current="step"`. Steps are buttons, keyboard navigable.
- Slide-over and modals: focus trap, Esc to close, focus returns to the trigger. Toasts use `aria-live="polite"`.
- Video placeholders carry captions and transcript affordances. Target size ≥ 44px. Respect `prefers-reduced-motion`.
- Board view has an equivalent List view (default for screen readers / small screens).

**Responsive breakpoints**
- **≥ 1280:** sidebar expanded, requirement page two-column with right rail.
- **1024–1279:** sidebar expanded, right rail collapses under the step panel.
- **768–1023:** sidebar becomes a 72px icon rail (expand on demand). Header chips condense: Ali and pace remain, others go into a "More" menu.
- **< 768:**
  - Sidebar becomes an off-canvas drawer behind a hamburger.
  - The header keeps the logo, Ali chip and avatar.
  - Stepper becomes "Step 4 of 7 · Do it" with prev/next.
  - The board becomes status tabs.
  - Tables become stacked cards.
- 16px side gutters on mobile. No horizontal scroll.

---

## 12. Build phases & acceptance criteria

Each phase is one Claude Code session (prompts in `PHASE_PROMPTS.md`). At the end of each phase Claude suggests a commit message, and Joel commits.

| # | Phase | Acceptance criteria |
|---|---|---|
| 0 | **Scaffold & tokens** | Folder structure in place. `tokens.css` and `base.css` done. `#/styleguide` shows the colour tokens, type scale, buttons (gradient, outline, ghost, on-dark), chips (all statuses), cards, inputs, tabs, stepper, toasts, modal, slide-over, badges. All pairs pass contrast. |
| 1 | **Router, layouts, store, demo panel** | Hash router with 404. Three layouts switch by prefix. Store persists and resets. Demo panel switches persona and route. Sidebar collapse/drawer works at all breakpoints. |
| 2 | **Mock data** | All `/data` files populated (6 domains, ~16 modules, 45 requirements, 3 hero requirements fully written, personas A–F, mentors, reviews, Connect listings, micro-units, badges, Ali scripts). Selectors return correct values for every persona. |
| 3 | **Public site** | Home with the 3-button hero and all sections from §8.1, plus How it works, Checks, Academy, Institutions. Responsive. Matches the VC look. |
| 4 | **Free Check → results** | Start → choose → runner (save/exit, sections, Why we ask, skip-to-results) → results with ring, tier, domain bars, in-place vs to-build counts. |
| 5 | **Enrolment & onboarding** | Tier auto-set. Pretend pay (no card fields). Start-up screening routes persona B. 4-step onboarding saves weekly goal and starting choice. |
| 6 | **Portal shell & dashboard** | Header chips live from store. Sidebar tree with counts. Dashboard widgets per §8.4, all clicking through to filtered lenses. Two-layer readiness ring. |
| 7 | **Academy lenses & module page** | By area / By next action (board + list) / By topic, shared filters, lens remembered. Module page with dual progress and serves-requirements list. |
| 8 | **Requirement page** | Both requirement types. All 7 step panels. Fast-track. Locked state. Upload (pretend), link existing evidence, declaration, submit → In review. Changes-requested and verified states driven by demo panel simulate. Closed state with next recommendation and milestone card. VC Vault prompt dismissible and remembered. |
| 9 | **Ask Ali & mentoring** | Slide-over from anywhere with context chip, scripted answers, credit deduction, top-up. Full-page history. Mentor booking flow deducts credit and lists upcoming. |
| 10 | **Evidence, accreditation, Connect profile, recognition, notifications, plan** | Evidence locker with reuse. Accreditation flow to certificate. Connect profile editor with live preview. Recognition page. Notification centre and mock emails. Plan page with re-plan and extend. |
| 11 | **Start-up pathway** | Persona B end-to-end: locked Core, pathway page, completion unlocks Core and updates dashboard. |
| 12 | **Enterprise hub** | Persona C: overview, re-assessment due, team invites, Micro-Unit catalogue with correct pricing maths, enrol participants, team-member view, coming-soon cards. |
| 13 | **Partner portal & public Connect** | Persona D dashboard, consent-aware client table, refer flow with email preview. Public directory, profile, verify-certificate states. |
| 14 | **Back-office** | Verifier queue and split review with AI pre-check and conflict guard. Decisions flow back to persona A. Mentor schedule, mentees, session notes, no verify controls. |
| 15 | **QA & polish** | Every route reachable without dead ends. Demo scripts (§13) run clean. Keyboard-only run-through. Axe/Lighthouse a11y ≥ 95 on key pages. 375 / 768 / 1280 / 1440 checks. Placeholder content flagged. README with run instructions. |

**Suggested order for the first client review:** phases 0–8 deliver demo scripts A and B. Show that before building 9–15.

---

## 13. Click-through demo scripts

- **A — New organisation**
  - Home → [Pre-qualify my business] → sign up → declaration → Check recommended → runner (answer 3, skip to results) → 41% Core → enrol → onboarding (choose Quick wins) → dashboard.
- **B — Working the Academy (persona A)**
  - Dashboard → Resume FM-04 → Watch → Learn → Ask Ali (context chip, credit drops) → Download template → Do it checklist → Upload (VC Vault prompt visible, dismiss) → Submit → demo "approve next" → Verified → Closed with "Financial Management 5 of 9" and the next recommendation.
  - Then By next action → GC-01 quick win → upload-only flow.
  - Then GC-02 → changes requested → reply + revised upload.
- **C — Verifier loop**
  - Switch to E → queue → GC-02 resubmission → AI pre-check → Verify → switch back to A → notification and milestone.
- **D — Start-up gate**
  - Switch to B → dashboard explains pathway first → locked Core in lenses → complete pathway (demo) → Core unlocks.
- **E — Enterprise**
  - Switch to C → Enterprise hub → invite 3 team members → enrol 3 in Finance Micro-Unit ($1,500 + $1,000 + $1,000 = $3,500) → team-member view → re-assessment due date.
- **F — Institutions & Connect**
  - Visitor → [Send my clients through BVT] → partner view (D) → refer a client → consent-aware table.
  - Visitor → [Find pre-qualified businesses] → filter → profile → verify certificate.

---

## 14. Open questions for Vital Consult / BVT

1. **Question bank:** the real domains, modules, question wording and module ↔ question mapping (Ali). The prototype uses the six domains listed on businessvitalitytracker.com as placeholders.
2. **Logo and brand:** final BVT Academy logo. Confirm the staging site's display font.
3. **Readiness measure:** is progress shown as **% verified**, and does the tier stay fixed at enrolment even as readiness rises? (The prototype assumes the tier is fixed at enrolment and progress = % verified.)
4. **Check answer scale:** In place / Partly / Not yet / Not sure / N/A, or a different scale? How does "Partly" classify (in place vs not yet)?
5. **Verification SLA** to show users (prototype says ~5 business days).
6. **Commercials (Doc 3):** package prices, Ali credit allowances per tier, mentor credits per tier, extension and top-up prices.
7. **Partner consent:** what referred-client data institutions can see, and how consent is captured.
8. **One login for both stages:** to be confirmed by Hami. The prototype assumes yes.
9. **Ask Ali privacy copy:** final wording once the provider's data location is confirmed.
10. **Prequalification Stage single user:** confirm no co-users (e.g. an accountant) before Enterprise.
11. **Recovery pathway:** content and sensitivity of copy for distressed organisations.
12. **Doc 1 and Doc 3:** please share. This brief is Doc 2 of a set.
13. **ORIC and Debt Management Checks:** do they feed into the Academy with their own requirement sets, or does enrolment always run from a Core Check? (The prototype enrols from Core only.)
14. **Recovery vs Start-up:** can an organisation be both, and do the two pathways share any requirements?

---

## 15. Out of scope (prototype)

Real authentication, payments, file storage, AI calls, emails, CMS or admin content management, analytics, WordPress integration, and production hosting. Production architecture belongs to Hami (AWS Sydney). This prototype's screens, states, data shapes and microcopy are the UX spec handed over.

---

## 16. Research sources

- [B Impact — Navigating the new B Impact experience](https://kb.bimpactassessment.net/en/support/solutions/articles/43000745964)
- [B Impact — Uploading and managing documents](https://kb.bimpactassessment.net/en/support/solutions/articles/43000754313-how-to-upload-and-manage-documents-in-b-impact)
- [Drata — Dashboard overview (new experience)](https://help.drata.com/en/articles/13259515-dashboard-overview-new-experience)
- [Vanta — Framework details page](https://help.vanta.com/en/articles/11345369-framework-details-page)
- [Coursera — Life gets in the way: solving the biggest challenge in online learning](https://blog.coursera.org/life-gets-way-coursera-solving-biggest-challenge-online-learning)
- [Open edX — Course Goal Setting](https://openedx.atlassian.net/wiki/spaces/OEPM/blog/2021/12/07/3266805795/Course+Goal+Setting)
- [Khan Academy — Course challenges and unit tests](https://support.khanacademy.org/hc/en-us/articles/360030753412)
- [Lazarev — LMS UX: designing learning platforms people want to use](https://www.lazarev.agency/articles/lms-ux)
- [Business Vitality Tracker — current site](https://businessvitalitytracker.com/)
