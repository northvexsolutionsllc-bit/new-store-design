# GLOEUS.COM — Phase 0 Report
**Premium animation-heavy Shopify redesign · Dawn 15.5.0 fork**
Prepared for: Abida / Northvex · Date: 2026-07-18
Status: **APPROVAL GATE — read §0 first. Two decisions block the build.**

---

## 0. Environment reality check (read this first — it changes delivery, not the design)

The brief assumed this build environment has open network access ("your sandbox is not IP-limited"). It does not. This session runs behind an **organization egress proxy that denies all outbound web hosts except a short dev allowlist** (npm, pypi, github). I verified this directly:

| Target | Method | Result |
|---|---|---|
| `gloeus.com/products.json` | curl + WebFetch | **403** (policy denial at proxy) |
| `gloeus.com/` homepage | curl + WebFetch | **403** |
| `wonder-theme-petit-demo.myshopify.com` | curl + WebFetch | **403** |
| `shopify.dev`, `example.com` (control) | WebFetch | **403** — confirms a blanket block, not a gloeus-specific one |
| `github.com/Shopify/dawn` (git) | git ls-remote / clone | **✅ works** |
| Web search | WebSearch tool | **✅ works** (returns descriptions, not raw DOM/CSS/JS) |

**What this means, honestly:**
1. **I could not "study both live sites myself" via live DOM/CSS/JS inspection.** I will not pretend otherwise. Instead:
   - **gloeus.com** current-state below is built from your **extraction doc** (declared the copy source of truth), the **2 brand images**, and Dawn 15.5.0's known structure. `products.json` and the live FAQ/About/Contact page bodies could **not** be pulled here — they remain the one gap (see §1, flagged 🔴).
   - **Petit** animation inventory below is compiled from **public documentation, the Shopify Theme Store listing, an Awwwards feature page, and independent reviews** — not from stepping through its live DOM. It's labeled as such. It's directionally reliable but not a line-by-line teardown.
2. **The connected Shopify store is NOT gloeus.** The Shopify tool is authenticated to `iq1rda-r1.myshopify.com` ("My Store", **trial plan, PKR, Pakistan**, haseebullah4273@gmail.com) — an unrelated store. I therefore **cannot push an unpublished theme to gloeus.com or generate a preview link on your store from here.** No commerce data was touched.

Neither blocker stops the *design and build* — Dawn is cloneable, and the theme is authored as code in this repo. They only change **how Phase 0 research and final delivery happen.** Decisions needed are in §8.

---

## 1. gloeus.com — current state

**Store:** Gloeus (gloeus.com) · UAE market · single-product beauty · Shopify **Dawn 15.5.0** (theme_store_id 887), owner-customized.
**Product:** OUHOE Hair Removal Spray — "Smooth Skin in Minutes" · `/products/ouhoe-hair-removal-spray` · **AED 39.99** ("Save AED 25", compare-at ≈ AED 64.99) · 120 ML / 4 FL.OZ · single collection `all`.
**Tagline:** "Experience smooth, pain-free skin in just 3–5 minutes."

**Homepage section order (verbatim from extraction):**
1. Hero H1 — product name + tagline
2. *Why Women Love OUHOE* — "Trusted by thousands of women across the UAE" + 4 benefit cards
3. *How It Works* — Apply → Wait 3–5 min → Wipe
4. *✨ Best Selling Hair Removal Spray* — product feature card
5. *What Our Customers Say* — Sarah M. (Dubai) / Fatima A. (Abu Dhabi) / Layla K. (Sharjah) — 3 testimonials
6. *⏰ Limited Time Offer* — AED 39.99, Save AED 25
7. *Frequently Asked Questions* — 🔴 rendered client-side; **Q&A bodies not capturable here** (needs live pull)
8. *Join The Gloeus Beauty Club* — newsletter + "🔒 No spam. Unsubscribe anytime."
9. *We're Here to Help* + footer brand line

**4 benefits:** Pain-Free Formula · Fast Results (3–5 min) · Skin-Safe (all skin types) · Long-Lasting (weeks, not days).

**Weaknesses to fix:** no meta description; favicon is a WhatsApp-named upload (needs proper favicon from the logo mark); no animation system; FAQ content trapped client-side; imagery limited to 2 files.

**🔴 Outstanding data gaps (need a live pull — see §8 option A, or you paste them):**
- `gloeus.com/products.json?limit=250` — exact variant IDs, inventory, any product-page-only images, options.
- Live FAQ Q&A text, About Us body, Contact Us body, Shipping / Returns / Privacy / Terms copy.

---

## 2. Brand assets on hand (the whole store runs on these 2 files)

- **`assets/gloeus-product-hero.jpg`** (1024×1024) — pink OUHOE bottle + retail box on marble with rose petals, gold sparkle, blush tones. → hero product object (needs background cutout for floating/parallax) and reused in varied crops.
- **`assets/gloeus-logo.jpg`** (1254×1254) — black high-contrast **serif "Gloeus"** wordmark + pink **G monogram** (woman's-face silhouette + leaf). Genuinely strong mark; it *is* the design system's source of truth.

Design constraint accepted: **premium look from minimal photography** — typography-led sections, gradient fields, cut-out bottle in motion, petal/particle motifs, product shot re-cropped. Shot-list for future photos → `docs/IMAGERY.md`.

---

## 3. Petit animation inventory (compiled from public sources — labeled, not a live teardown)

Sources: Shopify Theme Store (Wonder/Petit preset), wonder-theme.com/features, support.wonder-theme.com docs, Awwwards (Petit — Honorable Mention), theme-hub & bsscommerce reviews.

**What Petit/Wonder does (the floor we must beat):**
- **Parallax scroll sections** — layered content moving at different speeds for depth/drama.
- **Products Slider** — each item paired with its own animated background; smooth slide transitions.
- **Scroll-driven text + imagery** — "flowing text" reveals synced to scroll; storytelling sections.
- **Image interactions** — before/after slider, image rollover/hover swap, zoom, hotspots, galleries.
- **Sticky conversion chrome** — sticky cart + sticky Buy button that follows on the product page; variant pick inline.
- **One-page conversion layout** — multi-tab feature blocks, comparison tables, press-logo strip, countdown timer, stock counter, trust badges, promo popups — all built around a single hero product.
- **Character:** mobile-first, high-polish, smooth easings, confident but not frantic. Motion serves conversion.

**Reading between the lines (typical of this tier, to match then exceed):** entrance stagger on load, marquee/ticker strips, easing in the cubic-bezier "soft-overshoot" family (~0.16, 1, 0.3, 1 expo-out), 400–800ms hero timings, hover lifts on cards/buttons.

**Verdict:** Petit's motion is *tasteful and scroll-reactive but restrained*. The owner's brief is **match, then go heavier** — so Petit is the floor. Our plan in §5 adds a masked cinematic hero, a scrubbed/pinned How-It-Works sequence, petal-particle art direction, and magnetic micro-interactions on top of everything Petit does.

---

## 4. Design system tokens (derived from the logo + product shot)

### Palette
| Token | Hex | Role |
|---|---|---|
| `--blush` | **#F2A7BC** | Primary brand pink (brief-anchored) |
| `--rose` | **#E4859B** | Deeper rose — CTAs, accents, gradient stop |
| `--rose-deep` | **#C96F86** | Pressed/active, headings-on-blush |
| `--petal-50` | **#FDF4F6** | Lightest blush field (section backgrounds) |
| `--petal-100` | **#FBE9EE** | Soft blush field |
| `--ink` | **#1A1416** | Warm near-black (body + display type) |
| `--ink-60` | **#5A5052** | Muted body text |
| `--paper` | **#FBF8F7** | Warm off-white page base |
| `--white` | **#FFFFFF** | Cards, chrome |
| `--champagne` | **#E8C9A0** | Sparkle/particle accent (from product shot glitter) — used *sparingly* |

Gradient fields: soft radial blush glows (`--petal-100 → paper`) — **built with radial-gradients, never animated blur** (Rule 5).

### Typography (Shopify font library — hosted, `font-display:swap`)
- **Display / headlines:** high-contrast elegant serif, logo-adjacent → **Cormorant Garamond** (primary proposal) or **Fraunces** (more distinctive alt). Big, airy, editorial.
- **Body / UI:** clean humanist sans → **Jost** (geometric, fashion-forward) or **Inter** (safe, legible). Proposal: **Jost**.
- Scale: fluid `clamp()` type ramp; generous line-height on body (1.6), tight on display (1.02–1.1).

### Space / form
- Radii: cards 18px, chips/pills 999px, buttons 999px (soft, feminine).
- Spacing: 8px base, generous section padding (`clamp(64px, 10vw, 140px)`).
- Shadows: low, warm, diffuse (`0 20px 60px rgba(201,111,134,.12)`) — no harsh drop shadows.
- Motifs: rose-petal SVG + champagne particle field, used at low density.

*(Swatches rendered in the HTML version of this report.)*

---

## 5. Motion plan — "heavier than Petit," engineered on the 8 non-negotiable rules

### The heavier-than-Petit motion set
| # | Moment | Motion |
|---|---|---|
| 1 | **Hero entrance** | Masked serif headline reveal (clip-path/translate wipe, per-line stagger) + **floating cut-out bottle** that parallaxes & gently rotates on scroll + **petal drift** particle field. One cinematic act. |
| 2 | **Benefits (4 cards)** | Staggered rise+fade on first scroll-in, magnetic hover lift, icon draw-on. |
| 3 | **How It Works** | **Scroll-scrubbed, pinned sequence** — Apply → Wait 3–5 min → Wipe scrubs as you scroll (the signature "heavier" moment Petit doesn't have). |
| 4 | **Best-seller feature** | Sticky product context with add-to-cart; bottle re-crop with subtle float. |
| 5 | **Testimonials** | Marquee/auto-advancing quote strip, city tags, soft card transitions. |
| 6 | **Limited offer band** | Tasteful urgency motion — price emphasis, shimmer sweep (opacity/transform only). **No fake countdown/scarcity counters.** |
| 7 | **FAQ** | Smooth height accordion (grid-rows transition, no blur). |
| 8 | **Newsletter / footer** | Gentle reveal; petal accent. |
| 9 | **Product page** | Gallery treatment for thin imagery, benefit chips, **sticky mobile ATC bar with `safe-area-inset`**, buy buttons functionally untouched. |
| 10 | **Cart drawer** | Slide + item micro-transitions layered on Dawn's existing drawer — **logic untouched**. |

### The engineering spine (the 8 scars, honored)
1. **No `@view-transition{navigation:auto}`** anywhere — grep-gated to zero. (iOS re-fire bug.)
2. **One entrance gate, one authority** — all entrance elements key on a single class set in ONE place: double-rAF after theme JS, font grace ≤350ms, fonts `display:swap`. First statement sets `window.__boot=true`; inline fallback fires at **1600ms only if `!window.__boot`**. No sibling released by a different trigger. **Re-armed on `shopify:section:load` / `:select`** so the Theme Editor never shows dead/double animation.
3. **Every JS-gated hidden state scoped `:where(html.js)`** — never plain `html.js .x` (specificity trap).
4. **Viewport:** JS heights in `svh` (feature-detected); scroll math on `document.documentElement.clientHeight`; **never** `window.innerHeight` / "vh" strings in JS. Grep-gated.
5. **Blur discipline:** no animated `filter:blur()`/`backdrop-filter`; glows via radial-gradients; backdrop-filter only on small fixed chrome with solid `@media (hover:none)` fallback; no filter transitions on text; entrance/scroll = opacity+transform only.
6. **Touch parity:** `@media (hover:none)` neutralizes hover-only effects; `touch-action:manipulation`; identical entrance every visit/platform (no seen-skips, no ios-skips).
7. **`prefers-reduced-motion`:** full content readable, motion collapsed to fades/none.
8. **Perf budget:** Lighthouse mobile ≥85 home + product; zero layout shift (transform/opacity only); lazy/async below-fold imagery; respect Shopify asset fingerprinting.

Delivery: one `gloeus-motion.js` + `gloeus-motion.css` + `gloeus-tokens.css` layered onto Dawn; each new section is OS 2.0 with full schema settings and editor-safe.

---

## 6. Page architecture (single-product conversion flow)

- **Home** (JSON template + section group): load-choreography hero → benefits (4, staggered) → How It Works (scrubbed/pinned) → best-seller feature (sticky ATC context) → testimonials (3 verbatim) → limited-offer band → FAQ accordion → Gloeus Beauty Club newsletter → footer.
- **Product**: gallery for thin imagery, benefit chips, sticky mobile ATC (safe-area), qty + buy buttons untouched, testimonial strip, cross-sell-ready structure.
- **Cart drawer**: motion polish only.
- **About / Contact / FAQ**: styled to match.

**Copy rules honored:** extraction copy is the base; phrasing may be polished; **product facts/claims only from owner copy + products.json**. Cosmetic product — **no invented efficacy/safety/medical/"dermatologist/clinically" claims, no fake reviews, no fake scarcity.**

---

## 7. New sections & editor settings (planned)
`gloeus-hero`, `gloeus-benefits`, `gloeus-how-it-works`, `gloeus-feature-product`, `gloeus-testimonials`, `gloeus-offer-band`, `gloeus-faq`, `gloeus-newsletter` — each with schema settings (headings, toggles for motion intensity, color-scheme, image pickers pre-mapped to future shots per IMAGERY.md), presets, and re-render safety.

---

## 8. DECISIONS NEEDED before I build (approval gate)

**A. Live-data gap (gloeus FAQ / About / Contact / products.json).** This environment can't reach gloeus.com. Choose:
   - **A1 (recommended):** you paste the live FAQ Q&As + About/Contact bodies + `products.json` here, and I build with real content.
   - **A2:** I build with the extraction copy + clearly-marked placeholder blocks you fill in the Theme Editor later.

**B. Final delivery target (the connected store is not gloeus).** Choose:
   - **B1 (recommended):** deliver the finished theme as **code in this repo + a draft PR**; you (or I, if you connect the *gloeus* store to this session / provide Shopify CLI access) then push it to gloeus as an **unpublished** theme and I hand you the preview link. Nothing goes live without you.
   - **B2:** I push the theme to the currently-connected trial store as an unpublished theme for a *look-and-feel* preview only (wrong currency/market, but you can see the motion), while final gloeus delivery still goes via B1.

**C. Direction sign-off:** approve the palette, the Cormorant+Jost type pairing, and the motion set in §5 — or veto/redirect now, before I build.

---

## 9. Status & what's already done
- ✅ Dawn **15.5.0** forked into this repo (matches your live theme version) — 55 sections, 39 snippets, 191 assets.
- ✅ Brand assets placed (`assets/gloeus-logo.jpg`, `assets/gloeus-product-hero.jpg`).
- ✅ Extraction doc archived to `docs/`.
- ⏸ Build paused at this approval gate per the brief ("owner can veto direction early").

On approval, I proceed to the animation layer + sections, run `shopify theme check` + Playwright/grep QA, and deliver per §8.
