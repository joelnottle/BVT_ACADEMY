# BVT Academy: clickable prototype

A clickable HTML/CSS/JS prototype of **BVT Academy**. It has three parts:
- the public site and free Check
- the learning and pre-qualification portal
- the BVT back-office

**Everything is pretend.** There is no real sign-in, payment, file storage, AI or email, and nothing leaves your browser. All people and organisations are fictional.

- **Spec:** [BUILD_PLAN.md](BUILD_PLAN.md)
- **Build rules:** [CLAUDE.md](CLAUDE.md)
- **Open items for the client:** [REVIEW_NOTES.md](REVIEW_NOTES.md)

---

## Run it

The prototype uses ES modules, so it must be served over HTTP. Opening `index.html` from Finder (`file://`) will not work.

**VS Code (recommended)**
1. Install the **Live Server** extension.
2. Open this folder, right-click `index.html` and choose **Open with Live Server**.

**Any static server**
```sh
python3 -m http.server 5510
# then open http://localhost:5510
```

No build step and no `npm install`. The only external requests are:
- Google Fonts (Montserrat)
- Lucide icons from unpkg, at a pinned version

**Browsers:** current Chrome, Edge, Safari and Firefox.

**Hosting (e.g. GitHub Pages):** it works as-is from any static host, including a sub-path like `username.github.io/repo/`. All paths are relative, and hash routing needs no server rules.
- `index.html` carries `<meta name="robots" content="noindex, nofollow, noarchive">`, so search engines are asked not to list it.
- That is a request, not a lock. Anyone with the link can still open it.

**Useful URLs**

| URL | What |
|---|---|
| `#/` | Public home page |
| `#/styleguide` | Every component and state, the colour tokens and a contrast check |
| `#/styleguide/data` | The mock data, and the selector checks that keep it consistent |

---

## The demo panel

The **Demo** button, bottom left on every page, opens the demo controls.

- **View as:** switch persona. You land on that persona's home page.
- **Time travel:**
  - **+1 week** and **+1 month** move the demo date, so pace, streaks and due dates change.
  - **Jump to accredited** (personas A–C) runs the accreditation step instantly.
  - **Complete the pathway** appears for persona B while Core is locked.
- **Simulate:**
  - *Verifier approves next item* and *Verifier requests changes* decide the oldest item in review.
  - *Mentor session completed* completes the next booked session.
- **Reset demo:** puts every persona back to the seeded data.

Progress is saved in your browser's `localStorage`, so a refresh keeps where you are up to. If storage is blocked (for example, some private windows), the demo still works but forgets on refresh.

---

## Personas

| | Who | Organisation | Lands on | Shows |
|---|---|---|---|---|
| **Visitor** | Not signed in | — | Home | Public site, free Check, Connect directory, certificate check |
| **A** | Sam Rivera, CEO | Kestrel Community Services Ltd (Core) | Dashboard | Working the Academy: 22% verified, on pace, one item "Almost there" |
| **B** | Ana Kowalski, Founder | Brightfield Start-up Co (Foundation) | Dashboard | Start-up pathway first; Core requirements locked until it's done |
| **C** | Tom Okafor, CFO | Harbourline Civil Pty Ltd (Accredited) | Enterprise hub | Re-assessment, team invites, Leadership Micro-Units |
| **D** | Lena Ng, Lending Partner | Southern Community Lenders | Partner dashboard | Referred clients (consent-aware), refer a client |
| **E** | Priya Desai, Verifier | BVT verification team | Review queue | Split review, Ali pre-check, conflict guard, decision history |
| **F** | Marcus Hale, Mentor | BVT mentor team | This week | Sessions, mentees, notes. **No verify controls** |

Two more appear as you use the demo:
- **N, New organisation:** created when you enrol from the free Check (script A).
- **Team member:** opened from Tom’s Enterprise hub with **View as (demo)** on a team row. "Back to the lead's view (demo)" returns to Tom.

The demo date is **Mon 3 May 2027** (Tom's is **Mon 2 Aug 2027**, after the Enterprise hub opens on 1 July 2027).

---

## Demo scripts

These follow BUILD_PLAN §13. Start each from **Demo → Reset demo** for a clean run. Every pretend action gives visible feedback: a status change, a toast or a timeline entry.

### A: New organisation (about 5 min)
1. As **Visitor**, on Home, choose **Pre-qualify my business**.
2. Fill in the sign-up form, tick the authorised-lead declaration and continue.
3. **Choose your check:** the Core Check is recommended. Start it.
4. Answer three questions, then **Skip to results (demo)**.
5. **Results:** score, tier and time limit, in place vs to build, and area bars. Choose **Enrol now**.
6. **Enrol:** the tier is set from your score. Answer the screening questions and choose **Pay and enrol (demo)**. There are no card fields.
7. **Onboarding:** timeline, weekly goal, **Where to start → Quick wins**, your support.
8. You land on the **dashboard** as the new organisation (persona N).

### B: Working the Academy (persona A, about 8 min)
1. On the dashboard, choose **Continue** on "Resume where you left off" (FM-04 Monthly cash flow forecast).
2. Step through **Watch → Learn** using the stepper.
   - On Learn, choose an Ask Ali prompt: the panel opens with FM-04 as context, and credits drop by 0.25.
3. **Download** a template, tick the **Do it** checklist, then **Upload** a file.
   - The "From our partners" card appears. Dismiss it, and it stays dismissed.
4. Tick "This evidence is accurate and current" and choose **Submit for verification**. The status becomes In review.
5. **Demo → Simulate → Verifier approves next item.**
   - The toast reads "FM-04 verified — Financial Management is now 5 of 9".
   - The Closed step recommends what to do next.
6. Go to **By next action** and open **GC-01** (quick win). It's upload-only: upload → submit.
7. Open **GC-02** ("Almost there"). Read the verifier's comment, reply, upload a revised file and choose **Resubmit for verification**.

### C: Verifier loop (about 3 min)
1. After script B step 7, switch to **E (Priya)**. In the review queue, GC-02 shows as a resubmission.
2. Open it. Read the criteria and the dashed **Ali pre-check** ("A suggestion — you decide").
3. Choose a comment template, **Verify**, and confirm. You move to the next item.
4. Optional: open **Coastline**. The conflict guard blocks a decision because Priya mentored them.
5. Switch back to **A (Sam)**. The bell shows "GC-02 verified — Governance & Constitution is now 4 of 6", and a milestone appears.

### D: Start-up gate (about 2 min)
1. Switch to **B (Ana)**. The dashboard explains that the Start-up pathway comes first.
2. Open **Academy → By area**: Core requirements show as Locked.
3. **Demo → Complete the pathway.** Core unlocks and the dashboard updates.

### E: Enterprise (about 4 min)
1. Switch to **C (Tom)**. The Enterprise hub shows the re-assessment due date.
2. **Team:** use **Send invite** three times, then choose **Accept (demo)** on each new row.
3. **Micro-Units**: under Finance, choose **Enrol participants** on a unit. Tick three people. The summary shows $1,500 + $1,000 + $1,000 = **$3,500**. Choose **Pay and enrol (demo)**, then confirm.
4. On a team row, choose **View as (demo)**. You see My learning, can mark lessons complete, and have the member's own Ali credits.
5. **Profile → Back to the lead's view (demo)**.

### F: Institutions & Connect (about 4 min)
1. As **Visitor**, on Home, choose **Send my clients through BVT**. You can try **Request partner access** at the bottom of the page.
2. Open **Demo → View as → D (Lena)** to see the partner portal. **Refer a client**: fill it in and preview the email. The new client appears in the consent-aware table.
3. As **Visitor**, on Home, choose **Find pre-qualified businesses**. Filter, open a profile, and choose **Verify this certificate**.
4. On **Verify a certificate**, try each state:
   - valid: `BVT-2027-000123`
   - expired: `BVT-2026-000041`
   - not found: `BVT-2027-999999`

### Also worth showing
- **Marcus (F):** This week → open a session → add notes → **Mark complete**. The notes appear on Sam's Mentoring page. **Ask Ali (mentor)** uses no credits. There is no way to verify anything.
- **Help & resources** (sidebar, bottom): ways to get help, what each status means, keyboard shortcuts.
- **Search:** press ⌘K / Ctrl K in the portal.

---

## Project layout

```
index.html            single entry, hash routing (#/…)
css/tokens.css        the only place raw colours, spacing, radii, shadows and fonts live
css/                  base, layouts, components/, pages/
js/app.js             boots the router and renders layouts + views
js/routes.js          every route, its layout and who may see it
js/store.js           all state (localStorage key "bvt-demo-v1", versioned)
js/*Store.js          pretend actions (requirements, support, account, enterprise, partner)
js/*Selectors.js      derived values (readiness, pace, recommendations, lenses…)
js/components/        shared UI: chips, cards, modal, slide-over, toast, stepper…
js/views/             one file per page: public/, check/, app/, partner/, team/, styleguide/
data/                 all mock content and microcopy (data/copy.js)
assets/               logos and images
```

**Standards**
- WCAG 2.2 AA throughout.
- Status always shows as an icon plus a label.
- Tested at 375, 768, 1280 and 1440px wide, with no horizontal scroll.
- Australian English. Dates as "8 Dec 2027".
