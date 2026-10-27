# BVT Academy wireframes: revision brief

**For:** Claude Design
**About:** the 8-screen wireframe set "BVT Academy Wireframes": Home (2 pages), Check runner, Check results, Dashboard, Academy by area, Requirement + Ask Ali, Verifier review.
**Brand reference:** the Vital Consult website (staging3.mercyme.com.au).

---

## 1. What to keep, what to change

**Keep** the layouts and the overall direction. They are right:
- a dark hero on the homepage
- after sign-in, a **portal**: dark left sidebar for tools, slim dark header, and **light, clear work surfaces** for reading, learning and evidence
- the information structure on every screen

**Change** two things:
1. **Bring in more of Vital Consult's plum, crimson and cream.** The current set uses one pink and grey. It needs the warm VC accents as highlights. This is not a re-skin: the navy frame stays.
2. **Remove the "generic AI" feel.** At the moment every section is the same white card grid with a centred eyebrow and heading. Give each screen rhythm and one clear focal point (section 3).

BVT Academy is its own brand. Borrow the palette and motifs, and show Vital Consult only as an endorsement: "A product of Vital Consult" with the logo, in the hero and footer. No Vital Consult or Vital Money services.

---

## 2. Brand tokens

| Token | Hex | Use |
|---|---|---|
| Navy 950 / 900 | `#0B0E16` / `#0F131D` | Hero, sidebar, header (unchanged) |
| Navy 800 / 700 | `#1B202B` / `#242A3B` | Dark cards, active nav item, CTA bands |
| **Plum** | `#942878` | Eyebrows, gradient start, line icons, selected controls |
| Plum dark | `#82277C` | Hover/pressed plum |
| **Crimson** (VC) | `#E62F5C` | Accent words in large headings, the rule under headings, decorative only |
| **Crimson (text-safe)** | `#D22D63` | Crimson feature strip and any crimson behind white text |
| Peach | `#F8B29C` | Gradient end, warm wash |
| **Cream** | `#FFECB9` | Bands, certificate background |
| Cream light | `#FFF6E9` | Highlight cards: "Resume where you left off", milestones, callouts |
| Warm white | `#FFFBF3` | Optional warm page tint behind cream cards |
| Work surface | `#FFFFFF` / `#F6F6F8` | Cards / app canvas (unchanged, keep it clear) |
| Text | `#1B202B` / `#3D4456` / `#656B78` | Primary / secondary / meta |

**Gradients**
- **Action buttons** (white text): plum → crimson-safe, `linear-gradient(90deg, #942878, #D22D63)`
- **Brand line** (light backgrounds): `#942878 → #E62F5C → #F8B29C`
- **On navy** (rings, active bars, logo mark): `#E62F5C → #F8B29C`. Plum disappears on navy.
- **Top bar:** `#942878 → #E62F5C → #F8B29C → #FFECB9`, 3–4px, across the very top of every screen (VC signature)
- **Warm wash:** `240deg, #FFFFFF → #FFECB9 → #F8B29C`

**Type:** **Montserrat** throughout, as on the VC site: 300 for headings and running text, 500/600 for labels and buttons, on a 15px base. Heading colour on light is navy text `#1B202B`, never pure black.

---

## 3. Vital Consult motifs to use

1. **Gradient top bar** on every screen (public and portal).
2. **Two-tone headings:** one word in crimson, e.g. "Have you **pre-qualified** your business?" or "Start anywhere. Close every **requirement**." Add a **short 40px crimson rule** under section headings. Use sparingly: one accent word per heading, not every heading.
3. **Crimson feature strip:** the 4-step Check → Academy → Accreditation → Connect strip becomes a **solid crimson (`#D22D63`) rounded panel** overlapping the bottom of the hero, with white line icons and white text, as on the VC homepage.
4. **Gradient line icons** (plum → crimson stroke), **large (about 52px) with no tile behind them**, in place of the empty grey squares.
5. **Cream bands:** alternate some public-site sections onto cream (`#FFF6E9`/`#FFECB9`) instead of white-on-grey every time.
6. **V-masked photo** in the hero: the photo shown through the Vital Consult V mask (`assets/img/vital-v-mask.svg`), as on the VC homepage.
7. **No resting shadows on cards.** A hairline border defines a card; a soft plum-tinted shadow appears only on hover and on floating layers (menus, dialogs).

**One warm focal point per screen.** Cream and crimson are highlights. If everything is cream, nothing is.

---

## 4. What makes it look generic, and the fix

| Generic tell in the current set | Fix |
|---|---|
| Every section is a centred eyebrow + H2 + row of identical white cards | Vary the rhythm: crimson strip, cream band, navy CTA band, left-aligned two-tone headings |
| Empty grey icon squares | Real line icons, gradient-stroked, large, with no tile behind them |
| Browser-default blue radio buttons (Check runner) | Plum selected state: plum border, plum dot, faint cream fill |
| All progress bars in charcoal | Plum or plum → crimson fills on light; crimson → peach on navy |
| Same visual weight everywhere | One focal element per screen (see section 5) |
| `[XX]`, `[Answer]`, `[Sub-heading]` placeholders | Realistic placeholder copy (examples below), clearly fictional |
| Status shown by coloured dots | Status is always **icon + label**, never colour alone |
| Flat pink pill buttons | Plum → crimson gradient buttons with slightly rounded (6px) corners, not pills, and a → arrow on primary actions |

**Placeholder copy to use**
- Hero sub-heading: "Independent pre-qualification for tenders, funding, loans and procurement. Start free, close every requirement, get accredited."
- Check times: Core Micro–Small ~25 min · Core Medium–Large ~35 min · ORIC ~40 min · Debt Management ~15 min
- FAQ, "Who should complete the check?": "Your nominated authorised lead, for example the public officer, bank-account holder, founder, CEO, ED or CFO. Your organisation decides."
- FAQ, "What if we don't finish in time?": "You can re-plan your remaining time without losing work, or extend by one month or three. Nothing you've done is lost."
- FAQ, "How is my data used by Ask Ali?": "Ali works in a closed environment, only with your consent, and isn't used to train public models. [Final wording pending]"

---

## 5. Screen-by-screen fixes

### Home (pages 1–2)
- **Focal point:** the hero.
- Hero stays navy with a soft magenta/plum radial glow. H1: "Have you **pre-qualified** your business?", with "pre-qualified" in crimson. Eyebrow "PREQUALIFIED. ACCREDITED. CONNECTED." in a lighter pink.
- **Full-width hero, a little shorter** (about 600px): copy on the left; on the right, the supplied photo (`assets/img/hero-bvt.jpg`) through the **Vital Consult V mask**, running to the right edge of the screen.
- Above the eyebrow: **"A product of" + the Vital Consult logo** (reversed, white text). Repeat it in the footer.
- **More breathing room everywhere**: about 96px between sections, 32px inside cards, 32px between cards.
- The 4-step strip becomes the **solid crimson strip** (section 3, item 3), with white line icons.
- "Start with a free check" goes on a **cream band**. Heading left-aligned with the crimson rule. Each Check card gets a gradient line icon and a time ("45 questions · ~25 min").
- **Learning loop:** draw it as a **connected flow** (numbered nodes on a line), not 7 separate boxes. Show a branch arc from the start labelled "Already in place? Skip straight to evidence →" landing on step 05 Upload.
- **Tier cards:** colour-key each one (Foundation grey, Core blue, Advanced violet, Ready green) with a small coloured top border, and keep the months large.
- Support trio: large gradient line icons, no tiles.
- **Credential** card: mock a real certificate on **cream**. "BVT Academy · Accredited", org name "Harbourline Civil Pty Ltd", "BVT-2027-000123", issued 28 Jun 2027, renewal 28 Jun 2028, a QR square, and "Verify at bvtacademy.com.au/verify".
- Connect teaser: fill the 3 listings with fictional orgs, e.g. "Harbourline Civil · Construction · Sydney NSW · BVT Accredited".
- **Add the missing testimonial** (placeholder quote from a fictional CEO) between Connect and FAQ.
- FAQ: draft the answers (section 4).
- Final CTA band: navy with the brand-gradient top edge, and a crimson accent word, "Ready to **pre-qualify**?"
- Footer: dark. Remove "Privacy · Terms" unless they are needed as placeholders.

### Check runner (page 3)
- **Focal point:** the question card.
- Header: gradient top bar, then the dark slim header (as now).
- Progress bar: plum → crimson fill.
- **Answer options:** plum selected state (no browser blue). Keep the bold-label + plain-explanation pattern; it's good.
- Section rail: completed sections show a **check icon + "6/6"**; the current section has a plum left bar.
- "Why we ask" expander: cream background when open.

### Check results (page 4)
- **Focal point:** the score ring.
- Navy top band stays; the score ring uses the crimson → peach gradient on navy.
- **"18 Already in place"** and **"27 To build"** cards go **cream**, with a gradient line icon each. "18" is the hero number (quick wins).
- Area bars: plum fill on a light track.
- "After you enrol, you choose where to start": the Recommended card gets a plum border and a cream tint.
- Enrol band: **plum → crimson gradient** with white text. Price shown as "[Price — Doc 3]".

### Dashboard (page 5)
- **Focal point:** "Resume where you left off".
- **Resume card on cream** (`#FFF6E9`), with the Continue button in the action gradient.
- **"Needs your attention":** replace the coloured dots with **icon + label** rows. Changes requested reads **"Almost there: GC-02 needs one more thing"** (pencil icon); Evidence needed uses an upload icon; Mentor session uses a calendar icon.
- Bell: show the count as a small badge with an accessible label ("3 unread").
- Readiness ring: solid plum → crimson arc for verified, **plum hatched** arc for "in place, evidence to upload". Legend: icon + label.
- Tier ladder: the current tier pill is navy with a crimson ring; Accredited is a dashed pill with a gradient outline.
- **Add the missing "Recent" row:** "✓ FM-02 verified · First requirement verified (milestone) · Ali tip saved".
- Recognition: earned seals are navy discs with a thin gradient ring; unearned are dashed outlines. Show labels under the seals.
- The Ask Ali bar can stay dark. Put a sparkle icon in plum/peach.

### Academy, by area (page 6)
- **Bug:** the area sub-list in the sidebar sits under "By topic". It belongs **under "By area"**, with **full area names** ("Governance & Constitution", not "Governance").
- Expanded domain: module header row on a faint cream tint; module progress text in plum.
- Status chips: use the full label **"Learning & implementing"** (not "Learning"). Every chip is icon + label.
- Progress bars: plum fill.

### Requirement + Ask Ali (page 7)
- **Focal point:** the current step panel.
- **Stepper:** draw it as a **connected stepper** (numbered circles joined by a line), not separate pills. Steps 1–4 show a small "Optional" label. Completed steps show a check. The current step is filled with the action gradient, with "You are here" beneath. "I know this — go to evidence" sits to the right as a text link with an arrow.
- At ≥1280px, the "What's required / Why it matters / Shared learning" panel sits **beside** the step panel as a right rail, not below it. When the Ali slide-over is open it may drop below.
- Sidebar: show the **full nav** (Connect profile, Enterprise hub, Help, Settings are missing here).
- Ask Ali panel: the context chip gets a cream background. The user message bubble is navy, the Ali bubble is cream. Keep the footer: "Ali offers guidance — it doesn't verify evidence."

### Verifier (page 8)
- Header badge "BVT TEAM · VERIFIER": plum, not orange.
- Remove the "Organisations" and "Settings" nav items (not in scope). Nav is "Review queue (9)" and "Decision history".
- "Ali pre-check · a suggestion, you decide": keep the dashed border, and add a sparkle icon in plum.
- **Show the conflict-guard state as well:** a second small frame where the verifier *has* mentored the org. The banner reads "You've mentored this organisation, so another verifier must decide", and the Verify / Request changes buttons are disabled.
- Comment template dropdown: include "Almost there — please add…" as the first changes-requested template.

---

## 6. Missing screens to add

1. **Dashboard, mobile (375px).** Hamburger, logo, Ali chip (icon + "7.5") and avatar in the header. The sidebar becomes a slide-out drawer. Cards stack: Resume (cream), Needs your attention, Readiness, Recommended next. No horizontal scroll, 16px gutters.
2. **Academy, by next action (board + list).** Columns: To start · Learning & implementing · Evidence needed · In review · Changes requested · Verified. Cards show code, title, area, reason tag (Quick win / Unblocks 3 / Biggest gap / Due soon) and last activity. There's a [Board | List] toggle; List is the default on mobile. No drag-and-drop.
3. **Enrolment + onboarding "Where to start".**
   - Enrolment: Core package card (9 months, Ali credits, mentor credits, verification included, "[Price — Doc 3]"), and a **"Pay (demo)" button with no card fields**.
   - Onboarding step 3 of 4: three choice cards: Quick wins (recommended, cream), Biggest gaps, Choose an area. Progress dots, with Skip available.
4. **Accreditation certificate.** Full certificate on cream with the V motif, using the details from the Home credential mock. Buttons: [Download certificate PDF] and [Copy verification link]. Add a quiet "Need deeper expert support?" link.
5. **Enterprise: enrol a team in a Leadership Micro-Unit.**
   - Finance Micro-Unit card: 2–4 weeks · online · 8 Ask Ali credits per participant.
   - Select 3 team members, then show a price summary: **$1,500 (first) + $1,000 + $1,000 = $3,500**.
   - Badge: "First release · July 2027". Note: "No subscription. Pay only for what you use."

---

## 7. Rules not to break

- **No forced linear path.** Everything is visible and unlocked (except Core items for Start-up/Recovery orgs before their pathway is done; show a lock icon + reason).
- **Mentors never verify.** No verify controls in any mentor view.
- **VC Vault** appears as a small dismissible "From our partners" card near evidence upload or in the evidence locker, and as one labelled "From our partners" highlight near the bottom of the homepage. Never a step.
- **No** confetti, celebratory animation, leaderboards or red countdowns. Pace reads "Ahead / On pace / Needs a catch-up".
- Feedback copy is specific: "FM-04 verified — Financial Management is now 5 of 9". Changes requested reads "Almost there".
- Status = icon + label, everywhere.
- Australian English (organisation, enrol, colour). Dates as "8 Dec 2027".
- People and organisations are fictional: Sam Rivera (Kestrel Community Services Ltd), Priya Desai (verifier), Tom Okafor (Harbourline Civil Pty Ltd).
- Touch targets at least 44px. Visible focus rings: plum on light, peach/orange on navy.

---

## 8. Approved colour pairings (WCAG 2.2 AA, measured)

| Foreground | Background | Ratio | Use |
|---|---|---|---|
| White | Plum `#942878` | 7.4:1 | Buttons, badges |
| White | Crimson-safe `#D22D63` | 4.9:1 | Crimson strip, button end |
| Plum `#942878` | White | 7.4:1 | Eyebrows, small accent text |
| Plum `#942878` | Cream `#FFECB9` | 6.3:1 | Text on cream bands |
| Crimson-safe `#D22D63` | White | 4.9:1 | Accent words at any size |
| Navy text `#1B202B` | Cream `#FFECB9` | 13.9:1 | Body text on cream |
| Crimson `#E62F5C` | Navy `#0F131D` | 4.35:1 | **Large** accent words in the dark hero only |
| Peach `#F8B29C` | Navy `#0F131D` | 10.5:1 | Highlights on navy |

**Do not use:**
- white text on VC crimson `#E62F5C` at body size (4.26:1)
- white on peach or cream
- plum on navy (2.5:1)
