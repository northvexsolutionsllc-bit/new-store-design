# GLOEUS.COM — Redesign Delivery Report
**Premium animation-heavy Shopify theme · Dawn 15.5.0 fork**
Date: 2026-07-18 · Branch: `claude/gloeus-premium-redesign-ln3a1w`

Locked with the owner in Phase 0: **Fraunces** display · **Jost** body · motion = **Snap everywhere + Cinematic hero/How-It-Works** · delivery = **code in this repo** · content = **extraction copy**.

---

## 1. Delivery status & the one honest caveat
The theme is **built, validated, and committed** to this branch. It is **not yet on a Shopify store**, because:
- This session's Shopify connection points at an unrelated **trial store** (`iq1rda-r1.myshopify.com`, PKR), not gloeus. I will not push a theme to the wrong store.
- The org egress proxy blocks Shopify hosts, so I can't `shopify theme dev` / `theme push` to gloeus from here.

**So there is no live preview link yet — by environment limitation, not omission.** §8 gives you two one-command ways to get one. Nothing was ever pushed live; your live theme is untouched.

---

## 2. What changed vs stock Dawn 15.5.0
**Added (all new, `gloeus-` namespaced — nothing stock was rewritten):**
| File | Purpose |
|---|---|
| `assets/gloeus-tokens.css` | Brand palette, type ramp, utility layer; repoints Dawn's `--font-heading/body-family` to Fraunces/Jost |
| `assets/gloeus-motion.css` | Entrance-gate states, Snap/Cinematic character, marquee, scrub, sticky ATC, cart polish, reduced-motion, touch parity |
| `assets/gloeus-motion.js` | One entrance authority + IO reveals + scroll-scrub + parallax + petals + magnetic + sticky ATC + editor re-arm |
| `assets/gloeus-fraunces-*.woff2`, `gloeus-jost-*.woff2` | Self-hosted brand fonts (Fraunces 400/400i/600/700, Jost 400/500/600) |
| `assets/gloeus-favicon-*.png` | Favicon generated from the logo's G monogram |
| `snippets/gloeus-fonts.liquid` | `@font-face` (fingerprinted via `asset_url`) + preload of the 2 critical faces |
| `sections/gloeus-*.liquid` (9) | Hero, Benefits, How-It-Works, Feature-Product, Testimonials, Offer-Band, FAQ, Newsletter, Sticky-ATC |
| `templates/index.json`, `templates/product.json` | Rewired homepage + product page to the new sections |

**Modified (surgical):**
- `layout/theme.liquid` — pre-paint `gloeus-js` class; render fonts + brand CSS after `base.css`; defer `gloeus-motion.js`; 1600 ms entrance fallback; favicon fallback; homepage meta-description fallback (store had none).
- `config/settings_data.json` — the 5 color schemes recolored to the brand palette.

**Untouched (commerce logic intact):** `main-product`, `buy-buttons`, `cart-drawer`, cart/checkout JS, product form, variant picker, localization, AED currency. The sticky ATC **clicks the real add-to-cart button** — it duplicates no logic.

---

## 3. Sections & their editor settings
Every section is OS 2.0, has a **preset**, `color_scheme`, padding controls, and re-renders safely in the Theme Editor.

| Section | Key settings |
|---|---|
| **Gloeus Hero** | motion (snap/cinematic), eyebrow, multi-line masked heading, subheading, product image (falls back to product shot), parallax depth %, 2 buttons, note, petal toggle + count, scroll hint |
| **Gloeus Benefits** | eyebrow/heading/subheading; benefit blocks (icon, title, text) — staggered reveal + magnetic hover |
| **Gloeus How It Works** | eyebrow/heading; up to 3 step blocks (title, text, glyph, optional image) — scroll-scrubbed pinned filmstrip |
| **Gloeus Feature Product** | product picker, eyebrow/heading/text, benefit chips; native `<product-form>` add-to-cart + price/compare/save |
| **Gloeus Testimonials** | eyebrow/heading, marquee speed; quote blocks (quote, name, city) |
| **Gloeus Offer Band** | eyebrow, heading, price, save badge, subtext, button; shimmer sweep on reveal |
| **Gloeus FAQ** | eyebrow/heading, open-first toggle; Q&A blocks (question + richtext answer) — smooth grid-rows accordion |
| **Gloeus Newsletter** | eyebrow/heading/subheading, placeholder, button, success text, note, petals; native customer form |
| **Gloeus Sticky ATC** | button label; mobile-only fixed bar, safe-area-inset, clicks real product form |

---

## 4. Animation system — rule compliance (all 8 honored)
1. **No `@view-transition`** — grep-verified **0** occurrences.
2. **One entrance authority** — single `.gloeus-in` class; `window.__boot` first statement; double-rAF + ≤350 ms font grace; 1600 ms inline fallback; re-armed on `shopify:section:load`/`select`.
3. **`:where(html.gloeus-js)` scoping** — every hidden state; **0** unscoped `html.js` in code.
4. **Viewport math** = `documentElement.clientHeight`; **0** `innerHeight` / `"vh"`-string usage in JS; CSS carries `svh` heights.
5. **Blur discipline** — glows are radial-gradients; `backdrop-filter` only on the sticky bar, `@media (hover:hover)` + `@supports`, solid fallback; no filter transitions; entrance/scroll = opacity+transform only.
6. **Touch parity** — `@media (hover:none)` neutralizes hover-only effects; `touch-action: manipulation`; identical entrance every visit.
7. **`prefers-reduced-motion`** — content fully visible, motion collapsed (verified in QA).
8. **Perf budget** — transform/opacity only (no animation CLS); below-fold images `loading="lazy"`; fonts preloaded + `display:swap`; JS deferred; no heavy libraries; Shopify fingerprinting preserved.

---

## 5. QA — measured numbers (honest about what ran)
**Static analysis**
- `shopify theme check` (CLI 4.5.2, 179 files): **0 errors, 8 warnings** — every warning pre-exists in stock Dawn 15.5.0 (e.g. `main-product` `seo_media`, `offset: continue`, `scheme_classes`); **0 offenses in any Gloeus file.**
- Grep-gates: `@view-transition` **0** · `window.innerHeight`/`"vh"` in JS **0** · unscoped `html.js` **0**.
- All 11 section `{% schema %}` blocks + both JSON templates parse valid.

**Browser (Playwright 1.61.1, Chromium 1194) — `docs/qa/` harness loading the real `gloeus-motion.css/js`**
- **66 / 66 checks passed** across 6 profiles: desktop, desktop +400 ms engine delay, desktop +1800 ms delay, **iPhone-13 touch**, iPhone +1800 ms, **reduced-motion**.
- Entrance released once per load — desktop **89 ms**, iPhone **64 ms**, reduced-motion **58 ms**; single-act confirmed (opacity-transition count ≤ element count in every profile → **zero same-element re-runs**), including the delayed-engine cases where the 1600 ms fallback carries the reveal.
- **Stuck-reveal guard: 0 stuck** (no `.g-reveal`/`.g-enter` left < 0.9 in viewport) — after fixing the eyebrow/note/scroll to mute via color-alpha instead of box-opacity.
- How-It-Works scrub drives `--p` 0→1 with dot/progress updates; FAQ accordion animates open; sticky ATC reveals past the anchor and its button **delegates to the real product form**.
- Console-error / pageerror / failed-request sweeps with full scroll: **0 / 0 / 0**.

**Honestly NOT run here (need the live preview):**
- **WebKit/Safari engine** — not installable (Playwright browser CDN blocked); only Chromium ran. iPhone profile is Chromium's touch emulation, not real iOS Safari.
- **Lighthouse mobile ≥ 85** — requires the served store; a `file://` harness score would be meaningless. Run it on the preview once pushed. The budget measures in §4 are built for it, but the number is unverified until then.
- **Real cart → checkout hand-off** — needs a live store with the product; the add-to-cart path uses Dawn's unmodified `<product-form>`, so it inherits Dawn's proven flow.

---

## 6. Design tokens
**Palette:** blush `#F2A7BC` · rose `#E4859B` · rose-deep `#C96F86` · petal `#FBE9EE`/`#FDF4F6` · champagne `#E8C9A0` · warm ink `#1A1416` · paper `#FBF8F7`.
**Type:** Fraunces (display, self-hosted 400/400i/600/700) · Jost (body/UI, 400/500/600). Fluid `clamp()` ramp; radii 18–28 px; pill buttons; warm diffuse shadows.

---

## 7. Imagery
`docs/IMAGERY.md` maps a prioritized shot-list to named section slots — future photos drop in via the Theme Editor with no code change. Until then, slots fall back to the existing product shot (hero) and typography/gradient/petal art direction. Favicon already generated from the logo monogram.

---

## 8. How to get your preview link (pick one)
**Option A — Shopify CLI (fastest):** from this repo, with the CLI logged into the **gloeus** store:
```
shopify theme push --unpublished --path .
```
This uploads an **unpublished** copy and prints a preview URL. Nothing goes live until you publish from Shopify admin.

**Option B — GitHub integration:** connect this repo to the gloeus store via Shopify's GitHub integration and pull the branch as a new **unpublished** theme.

Then run **Lighthouse mobile** on the preview's home + product URLs and confirm ≥ 85.

---

## 9. Owner's 3-minute phone checklist (do this on the preview, on an iPhone)
1. Open the home preview — the hero should play its reveal **once, smoothly** (headline wipes up, bottle floats, petals drift). Reload — it should behave the same, never restart mid-scroll.
2. Scroll home end-to-end — benefits stagger in, **How-It-Works scrubs Apply → Wait → Wipe** as you scroll, testimonials glide, offer band shimmers once, FAQ opens smoothly.
3. Tap **Add to cart** on the best-seller → cart drawer slides in → close it.
4. Open the product page — scroll down; the **sticky Add-to-cart bar** appears at the bottom (above the home bar / safe area) and adds to cart.
5. Nothing should flash, freeze, or double-animate; text is readable throughout.

If anything feels off on a real device, tell me what and where — that's exactly the kind of fix I can turn around quickly.
