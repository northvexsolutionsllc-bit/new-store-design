# GLOEUS.COM — Complete Store Extraction
**Source:** owner-provided homepage source (website_data.txt) + live CDN · Extracted July 18, 2026
**Purpose:** source material for the animation-heavy store redesign (owner: Abida / Northvex)

---

## 1. STORE IDENTITY

| Field | Value |
|---|---|
| Store | Gloeus — gloeus.com |
| Market | UAE (currency AED; testimonials from Dubai / Abu Dhabi / Sharjah) |
| Model | Single-product beauty store (conversion-focused) |
| Platform | Shopify · **Dawn theme 15.5.0** (theme_store_id 887, manually customized by owner) |
| Meta description | **none set** |
| Favicon | a WhatsApp-named image upload (needs a proper favicon from the logo) |
| Socials linked | Facebook · Instagram · TikTok (in nav drawer) |
| Footer pages | Home · Shop · All Products · About Us · Contact Us · FAQ · Privacy · Terms · Return & Refund · Shipping |

## 2. THE PRODUCT

| Field | Value |
|---|---|
| Name | **OUHOE Hair Removal Spray — Smooth Skin in Minutes** |
| Handle | `/products/ouhoe-hair-removal-spray` |
| Price | **AED 39.99** — "Save AED 25" (compare-at ≈ AED 64.99) |
| Size | 120ML / 4 FL.OZ (from product packaging photo) |
| Tagline | "Experience smooth, pain-free skin in just 3–5 minutes" |
| Collections | `all` only |

**Benefits (4):** Pain-Free Formula ("No waxing, no razors, no pain. Just smooth skin.") · Fast Results ("visible results in just 3–5 minutes") · Skin-Safe ("Gentle formula safe for all skin types") · Long-Lasting ("smooth skin for weeks, not days")
**How It Works (3 steps):** Apply ("Apply the spray evenly on the desired area") → Wait 3–5 min ("Let the formula work its magic") → Wipe ("Wipe away for smooth, hair-free skin")

## 3. FULL HOMEPAGE COPY (verbatim, section order)
1. **HERO / H1:** "OUHOE Hair Removal Spray — Smooth Skin in Minutes" + tagline above.
2. **Why Women Love OUHOE** — sub: "Trusted by thousands of women across the UAE" — 4 benefit cards (§2).
3. **How It Works** — 3 steps (§2).
4. **✨ Best Selling Hair Removal Spray** — product feature card ("OUHOE Hair Removal Spray").
5. **What Our Customers Say** — 3 testimonials:
   - **Sarah M., Dubai:** "This spray is a game changer! No more painful waxing sessions. My skin feels so smooth and it lasts for weeks!"
   - **Fatima A., Abu Dhabi:** "I was skeptical at first, but this product really works! It's gentle on my sensitive skin and the results are amazing."
   - **Layla K., Sharjah:** "Best purchase ever! Quick delivery, easy to use, and the results speak for themselves. Highly recommend!"
6. **⏰ Limited Time Offer — Don't Miss Out!** — "AED 39.99 — Save AED 25".
7. **Frequently Asked Questions** — section exists; individual Q&As are rendered client-side and were not fully capturable from the saved source (pull live).
8. **Join The Gloeus Beauty Club** — "Get exclusive deals and beauty tips delivered to your inbox" + "🔒 No spam. Unsubscribe anytime."
9. **We're Here to Help** (support block) + footer brand line: "Premium hair removal solutions designed to leave your skin smooth, soft, and confidently hair-free."

## 4. BRAND ASSETS (2 unique images total — see companion ZIP)
1. `gloeus-01-...jpg` (1024×1024) — **product shot:** pink OUHOE spray bottle + retail box (heart graphic, "REMOVAL HAIR"), styled on marble with rose petals, blush tones. Usable as the hero product image (needs background cutout for floating/parallax treatments).
2. `gloeus-02-...jpg` (1254×1254) — **the Gloeus logo:** black serif "Gloeus" wordmark + pink G monogram containing a woman's face silhouette and leaf. Genuinely good mark. **Brand palette derived from it: soft pink (≈#F2A7BC family) · near-black ink · white.**

**Imagery reality check:** the entire store runs on these 2 files. The redesign needs an art-direction strategy that looks premium with minimal photography (typography-led layouts, gradient fields, cut-out bottle with motion, petal/particle motifs) plus a shot-list for future photos: bottle 3-4 angles on clean bg, texture/mist macro, application on skin, before/after arm, lifestyle vanity scene, box+bottle flat lay.

## 5. CURRENT TECH / DESIGN STATE
Stock Dawn 15.5.0 with owner customizations; section stack as in §3; no custom animation system; no meta description; favicon unset properly; FAQ content client-side; only collection is `all`. The redesign replaces the *presentation layer* — commerce logic (cart, checkout, currency) must remain Shopify-native and untouched.

## 6. NOT CAPTURABLE FROM THIS SANDBOX (pull during the build)
`/products.json` (full variant/inventory data), product-page & About/Contact/FAQ page contents, and any additional product images uploaded to the product itself — the build environment must fetch `https://gloeus.com/products.json?limit=250` and crawl the live pages directly (this sandbox's IP is rate-limited by Shopify's edge; normal environments are not).
