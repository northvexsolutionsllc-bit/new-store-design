# IMAGERY.md — Gloeus shot-list & slot map

The store owns **2 images today**: the OUHOE product shot and the Gloeus logo. The redesign is art-directed to look premium with exactly that, but every section that would benefit from a real photo has a **named image slot** wired into its schema, so future photos drop straight in via the Theme Editor with **no code change**.

**Priority key:** 🟥 P1 (biggest lift) · 🟧 P2 · 🟨 P3.
**Specs:** shoot on clean blush/marble or seamless white; 2000px+ long edge; deliver both the styled frame and a **background-removed PNG** where noted (the floating-bottle treatments need transparency).

| # | Pri | Shot | Why | Section slot (schema setting) |
|---|---|---|---|---|
| 1 | 🟥 | **Bottle, background-removed PNG** (front, upright) | Powers the floating/parallax/rotating hero object | `gloeus-hero → hero_bottle_png` |
| 2 | 🟥 | **Bottle 3-quarter angle** on clean blush | Best-seller feature + product gallery variety | `gloeus-feature-product → feature_image`, `product gallery slot 2` |
| 3 | 🟥 | **Mist / spray macro** (nozzle mid-spray) | "Fast results" energy; How-It-Works step 1 | `gloeus-how-it-works → step1_image` |
| 4 | 🟧 | **Application on smooth skin** (leg/arm, tasteful) | Step 2/3 proof without medical claims | `gloeus-how-it-works → step2_image`, `step3_image` |
| 5 | 🟧 | **Flat lay: box + bottle** on marble with petals | Editorial texture; offer band + PDP | `gloeus-offer-band → band_image`, `product gallery slot 3` |
| 6 | 🟧 | **Vanity / lifestyle scene** (bottle on a dressing table) | Aspirational context; testimonials backdrop | `gloeus-testimonials → backdrop_image` |
| 7 | 🟨 | **Texture macro** (product on skin / droplet) | Section dividers, parallax fields | `gloeus-benefits → texture_accent` |
| 8 | 🟨 | **Before/after arm** (honest, no exaggerated claims) | Optional comparison block | `product → compare_image_a / _b` |
| 9 | 🟨 | **Bottle top-down** on blush | Marquee / favicon crops | reuse across marquee + `assets` |

**Until photos arrive:** slots 1–2 use the existing product shot (auto-cutout for slot 1); slots 3–9 fall back to typography-led layouts + gradient/petal art direction, so no section looks empty. A proper **favicon** will be generated from the logo's G monogram (replacing the current WhatsApp-named upload).

**Brand palette for any photographer/retoucher:** blush `#F2A7BC`, rose `#E4859B`, petal field `#FBE9EE`, warm ink `#1A1416`, champagne sparkle `#E8C9A0`. Keep backgrounds warm-neutral; avoid cool/blue casts.
