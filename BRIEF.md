# TriDan Electrical Contractors — static GitHub Pages preview brief

For a Cursor cloud agent. Write the site code only. Do not contact the business. Do not push this URL to Nate, or to the client, until Audit passes the L-103 gate. The parent launches this run; do not start further cloud agents.

Written 10 Nov 2026, ~23:45 AWST (Australia/Perth), from Production’s approved wireframe (`wireframe.html` md5 `88252376288d9119a22e60e7ce0d6173`) and Director’s job card (Nate GO 23:37 AWST). This is a **static noindex GitHub Pages** preview, not a Wix build, and nothing may touch the client’s WordPress site or account.

---

## 1. Route

Public repo `CromServices/tridan-electrical-preview`, branch `main`, GitHub Pages from `main` `/`. Expected URL:

https://cromservices.github.io/tridan-electrical-preview/

The repo already has `assets/`, `fonts/`, `robots.txt` (`User-agent: *` / `Disallow: /`), this `BRIEF.md`, and a placeholder `index.html` with `<meta name="robots" content="noindex">`. Replace the placeholder with the finished Home. Keep the noindex meta on every page. Keep `robots.txt` as disallow-all. Add an empty `.nojekyll` if it is not already there.

Commit as Crom Services `<cromservices@gmail.com>`. Do not add a custom domain. Do not edit any other CromServices repo. A read-only reference for the sun/moon toggle and booking widget shape (not for brand or copy) is the finished Pages preview at https://cromservices.github.io/ozzy-gyprock-preview/ — do not modify that repo.

Deliverable: a single Home page (`index.html` plus CSS/JS as needed) that matches the attached `wireframe.html` layout, with the colour, chrome, booking, and copy rules in this brief. Inner marketing pages are optional; Home is what Audit will gate.

---

## 2. Source files

Canonical production pack (do not overwrite): `/workspace/crom/projects/crom-desk/02-working/production/outbound-spec-sites-2026-11-10/tridan-electrical/`

A working copy (wireframe, notes, assets, fonts) sits in `/workspace/crom/projects/crom-desk/02-working/coder2/outbound-spec-sites-2026-11-10/tridan-electrical/`. The parent attaches `wireframe.html` and `wireframe.md` to the cloud run. Approved image and font files are already in this repo.

| File | md5 | Role |
|---|---|---|
| `wireframe.html` | `88252376288d9119a22e60e7ce0d6173` | Home layout, spacing, visible copy (upgrade booking and drop banned lines; see below) |
| `wireframe.md` | `e58263a34186d910c58409f3f09d35e1` | Facts, sourcing, structure |
| `assets/logo.png` / `assets/logo-400.webp` | `dc6368db62f965ad61a150233863e36a` / `100e36bc9d2b68b204f9e02d0025a725` | Refreshed logo (use on the site) |
| `assets/hero-480.webp` (plus `.jpg` / 768) | `2126d99e1b8814ead8d4157ace0c0a77` | First-view street photograph, once |
| `fonts/manrope-400.woff2` / `manrope-700.woff2` / `sourcesans3.woff2` | `700bdb48f816f3a1cfe09e57bbc4397e` / `f473cffa9febfb6c91827efb2cafdee7` / `9ef356ea553ac473c76cc863ff644c35` | Self-host |

**Logo refresh: yes.** Use the refreshed bulb-and-TRIDAN mark (`assets/logo.png` / `logo-400.webp` / `logo-800.webp`). It is a refresh of their existing logo, not a new brand. Do not put `assets/logo-original-crop.png` on the site (that file is the current mark, for the logo before/after proof only). After the build, the parent will publish `proofs/logo-before-after.png` and site before/after proofs at public URLs. Old-site shots already exist in the production pack as `proofs/current-desktop-1440.png` and `proofs/current-mobile-390.png` (there are no files named `current-desktop-1440-first.png` / `current-mobile-390-first.png`; `desktop-1440-first.png` / `mobile-390-first.png` are first-view crops of the new wireframe). Tridan’s live site is HTTP-only with an expired certificate — `proofs/current-browser-warning-http.png` and `current-browser-warning-https.png` record that, for the pitch, not for the page.

Do not use anything in `assets/source/` on the page. Do not commit `wireframe.md` walkthroughs or this brief’s internal notes as visible copy.

---

## 3. Hard rules

- `<meta name="robots" content="noindex">` on every page, and `robots.txt` disallow-all, before any URL is announced.
- No pricing on the page. Drop the wireframe line “There is no online price.”
- **No street address and no ABN** on the page, titles, metas, or JSON-LD (L-032 and this job card), even though they are published. Do not print “Shed 3, 31 Briggs Rd”. Contact and the hero proof row may say Raceview, Ipswich. In About, you may say they relocated the business back to Raceview in April, without the street number or shed.
- No invented reviews, testimonials, ratings, stats, opening hours, or licence numbers. Published licence 80460 and ARC AU40152 may appear, because they are on the live site. Do not invent hours (none are published). No reviews block (named Google quotes were not verified).
- No builder/demo/AI wording. No bots. Public copy uses only facts published on `http://www.tridanelectrical.com.au/` (and `/about/`), fetched 10 Nov 2026.
- Do not email info@tridanelectrical.com.au or anyone at the business. The quote and booking widgets are in-page only and must not send mail.
- Honour `prefers-reduced-motion`. Tap targets ≥ 44px.


## Shared build standards (write these into the page behaviour, not as on-page copy)

These come from locks.md, the 10 Nov Ozzy/Subzero job, Production research.md, and Director’s 23:37 job card. Do not print lock names, file paths, or “per the brief” on the rendered page.

### L-103 (locks.md, 10 Nov 2026 21:54 AWST)

Every preview is read as the client would read it. Scan rendered visible text for internal or builder notes. Ban-list: as listed, no invented, placeholder, TODO, per wireframe, brief, L-0, Crom meta-talk, “This form does not send.” Any hit is a BLOCK. The only allowed placeholder is a marked photo slot: **Your photo here**. Copy where the client site gives no detail is written in the client voice from facts on their site only. Sourcing notes live in `wireframe.md`, never on the page.

Also **L-101**: no sample, demo, template, concept, or “illustrative” wording on the pages, titles, metas, or alt text. Honesty that this is a Crom pitch preview belongs in `README.md` only.

### L-105 (locks.md, 10 Nov 2026 22:06 AWST)

Keep the business’s own photos, logo and brand colours, modernised. No stock that could pass as theirs. A marked photo slot only where no usable photograph exists. No empty panels. Real copy on every card. Each photograph is used once as a content image (a CSS lightbox of that same image is not a second use).

### L-072 sun/moon toggle (locks.md, amended 10 Nov 2026 22:59 AWST)

Every site ships light and dark themes. Default follows the device (`prefers-color-scheme`). A **single small sun/moon icon button** (about 36px) sits at the **right of the nav**, `aria-label="Switch light/dark"`, switches light/dark, and is remembered per device. **No visible System option.** Dark keeps the brand accents and headings with contrast ≥ 4.5:1 (3:1 for large text). Check both themes at 390 and 1440 (also 320 and 1920).

### Date chips and time pills (Ozzy/Subzero job card + this Director card; upgrades the wireframe widget)

The wireframe’s booking block is a static 10-day row that includes Saturday and Sunday as selectable, and time pills **Morning / Afternoon / Either**, plus walkthrough copy that promises emails and calendars and the banned line “This preview form does not send.” Do not copy that behaviour.

Required shape on Home:

1. **14 date chips** for the next 14 calendar days in the business’s local timezone (named in this brief). **Weekends disabled** (Saturday and Sunday may be visible or omitted, but must not be selectable). Do not invent clock opening hours.
2. Time-window pills: **Morning, Midday, Afternoon** (not “Either”).
3. Job-type chips from their real services only (listed below).
4. A summary line of the selected day, window, and job type (and, for RPL, the plant).
5. Name and phone fields (email and a customer site-address field are fine).
6. A **full-width Book** button.
7. A **success state** that only restates the saved summary. No step copy that promises emails or calendars, or says “you’ll stay on this page.” No “This form does not send.”

Safe help line, trimmed: “Pick a day that suits you. This holds a visit or a call. The job is confirmed once we reply.”

### Big-image lightbox (Production research.md + each pack’s wireframe)

**Definition**, from `/workspace/crom/projects/crom-desk/02-working/production/outbound-spec-sites-2026-11-10/research.md` (section “Masonry or bento job gallery, with a lightbox”): a bento / masonry gallery of the business’s own job photographs, with fixed aspect ratios, `srcset` in WebP (JPEG fallback), lazy-load below the fold, and a **CSS `:target` lightbox** so a visitor can open a shot without a heavy script. Captions stay short and factual. No shader or scroll libraries.

The pack wireframes already implement this as `.lightbox` panels (`display:none` until `:target { display:flex }`), a full-viewport dark veil, the larger derivative of the same photograph, and a close control with `aria-label="Close"` that returns to `#photos`. See `wireframe.html` in this folder. Where the gallery is marked “Your photo here” slots, still ship the lightbox CSS so it is ready once real photographs are supplied; do not lightbox an empty slot as if it were a photo.

### Sticky chrome the wireframe already asks for

- Sticky header on desktop and at 390.
- At 390: a sticky **Call | Request a quote** (or the site’s Book label) bar on **one line** at the bottom. Call uses the published `tel:` number. No hamburger that hides the phone number. Tap targets ≥ 44px. No horizontal scroll from 320px to 1440px (also check 1920). Honour `prefers-reduced-motion`.


---

## 4. Colours and type

Taken from the current lockup (cyan mark, orange bulb, dark header). White on the brand orange fails body-size AA, so buttons use dark ink `#1A1714` on `#E39A22`.

| Token | Hex | Role |
|---|---|---|
| `--header-bg` / `--dark` | `#1A2426` | Sticky header, hero field, footer |
| `--mark` | `#7EEDEB` (deeper `#39C4BC` if needed) | Cyan kickers, logo-related marks |
| `--accent` | `#E39A22` | Buttons and selected chips |
| `--accent-ink` | `#1A1714` | Ink on the orange |
| `--on-dark` | `#F7FFFE` | On-dark text |
| `--paper` | `#F4F7F7` | Page background |
| `--ink` | `#1A1F1F` | Body text |
| `--muted` | `#3E4A4A` | Secondary text |
| `--line` | `#C9D2D2` | Rules |
| `--wash` | `#E8EEEE` | Soft fills |

**Type:** Manrope 700 for headings, `clamp(30px, 7.7vw, 56px)` on the H1 so it fits in two to three lines at 1440 and 390; Manrope 400 and Source Sans 3 for body (18px desktop, 17px phone), self-hosted latin woff2, SIL OFL. A clean, normal-width bold sans — not Syne, and not an ultra-wide display face.

---

## 5. Copy and facts (published only)

- Name: TriDan Electrical Contractors / TriDan Electrical Contractors Pty Ltd
- Founders: Tristan Devantier and Daniel Mantell
- Established 2015. Bought the RT Edwards Electrical Contracting Division effective 24 March 2016, then moved the business back to Raceview in April.
- “35 years’ experience” / “over 35 years of experience in the electrical industry” (About / hero) — published, not invented.
- Area: Ipswich, Brisbane and surrounds. No invented suburb list.
- Phone: (07) 3281 8081 (`tel:+61732818081`)
- Email: info@tridanelectrical.com.au
- Licensing (published, may appear): Licence no. 80460; ARC no. AU40152
- Facebook: linked from the current site (use the same public Facebook destination they already publish; do not invent a handle)
- Voice: we / they as on the live About page.

**Home title:** `Electrical, data and air conditioning, Ipswich | TriDan Electrical` plus noindex.

**Meta:** `Electrical, data and air conditioning for homes, shops and industry in Ipswich. Call (07) 3281 8081.`

**Nav:** Work, About, Quote, Book a visit, Contact, (07) 3281 8081, Request a quote, then the theme button on the right.

**Hero eyebrow:** Ipswich, Brisbane and surrounds

**H1:** Electrical, data and air conditioning for homes, shops and industry.

**Hero lead (verbatim from the wireframe, itself from the live site):** TriDan Electrical Contractors was established in 2015, bringing together over 35 years of experience in the electrical industry.

**Hero proof row:** Licence no. 80460 · ARC no. AU40152 · Raceview, Ipswich

**Hero CTAs:** Call (07) 3281 8081 / Request a quote

**Services heading / lead:** High quality electrical, data and air-conditioning solutions / Residential, commercial and industrial applications, from new houses to pad-mount transformer sites.

**Service cards (job-type chips use these labels):** New houses and re-wires; Switchboard upgrades and safety switches; Air conditioning; Data, phone and AV cabling; Smoke alarms, test and tagging; Commercial work. Keep the short published blurbs from `wireframe.html`. Do not invent extra trades.

**About heading / copy:** Tristan Devantier and Daniel Mantell / The founders of TriDan Electrical Contractors Pty Ltd, Tristan Devantier and Daniel Mantell, bought the RT Edwards Electrical Contracting Division effective 24 March 2016. Both are long-serving members of the RT Edwards community. They relocated the business back to Raceview in April. / Our purpose is to offer careful project design and execution in electrical contracting. We specialise in quality electrical, data and air-conditioning solutions for residential, commercial and industrial work. We work with contractors, builders, electrical engineers, Energex and the general public, and we aim to keep those relationships going from planning through to completion.

**Contact:** Raceview, Ipswich · (07) 3281 8081 · info@tridanelectrical.com.au · Licence no. 80460 · ARC no. AU40152 · Facebook. No street address, no ABN, no hours, no map.

**Footer:** © 2026 TriDan Electrical Contractors Pty Ltd

No reviews block.

**Quote form** (in-page only, must not email the business): Name, Phone, Email, Suburb or address, Type of work (the real services above, plus Other), short description, preferred time to talk. Submit: Request a quote. Honest in-page success only. Rewrite the wireframe walkthrough so it does not promise emails, calendars, or “you stay on this page,” and drop “There is no online price” and “This preview form does not send.”

---

## 6. Photographs (each used once)

- `hero-480` / `hero-768` (webp + jpg): first view only. This is their own upload of a local Ipswich street (the old Bremer TAFE building), **not a job**. Caption / alt must say it is a street in Ipswich, not a TriDan job.
- Work gallery and the About photo: marked **Your photo here** slots only. No other photographs. Do not use the stock-looking or unused files in `assets/source/`.
- Logo files: header / footer mark only, not a gallery image.

---

## 7. Booking widget

Label: **Book a visit**. 14 date chips in **Australia/Brisbane**, weekends disabled, Morning / Midday / Afternoon, job-type chips from the six service labels in §5, summary line, full-width Book a visit button, success state. Follow the shared standard in this brief, not the wireframe’s 10-day / Either / email-promise widget.

---

## 8. Verification to return

Save 1440 and 390 shots, light and dark, plus a booking success state, under the parent’s proof folder when asked (`…/coder2/outbound-spec-sites-2026-11-10/tridan-electrical/`), and as cloud-agent artifacts, with MD5SUMS. Also compose `proofs/before-after-desktop.png` and `proofs/before-after-mobile.png` (old site `current-desktop-1440.png` / `current-mobile-390.png` beside the new preview) and keep the existing logo before/after ready for a public URL.

Return:

- [ ] Repo URL, branch, and head SHA. Pages URL, HTTP 200, logged-out curl shows `<meta name="robots" content="noindex">`.
- [ ] Theme button at the right of the nav, `aria-label="Switch light/dark"`, defaults to system. Shots of light and dark at 1440 and 390.
- [ ] Sticky header; at 390 the Call | Request a quote bar is one line.
- [ ] CSS `:target` lightbox ready on the gallery (empty slots are marked “Your photo here”, not faked photos).
- [ ] Booking: 14 day chips, weekends disabled, Morning/Midday/Afternoon, real service chips, summary line, full-width Book, success state. No email/calendar/“you’ll stay on this page” / “does not send” copy.
- [ ] Visible-text scan (L-103 / L-101): no builder notes, no sample/demo/template wording, no pricing, no street address, no ABN, no invented reviews or hours, no bots/AI.
- [ ] Refreshed logo in the header; street hero used once and captioned honestly; no stock.
- [ ] No email was sent to the business.
