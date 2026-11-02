---
name: i18n-seo
description: Guidelines and procedures for international localization, localized slugs, hreflang tags, and SEO ranking for PDF tools.
---

# International SEO & Localization Guidelines

## 1. 90-Day Phased Rollout Roadmap

```
Phase 1 (Days 1–30): India First (English + Hindi) & Indian Exam/Govt Form Use Cases
Phase 2 (Days 31–60): Indonesia (Bahasa id) & Brazil (pt-BR) Top 10 Localizations
Phase 3 (Days 61–90): Vietnam (vi) & Spanish Latin America (es) + 6-8 Week GSC Audit
Phase 4 (Later): Turkey (tr), Japan (ja), MENA Arabic (ar RTL)
```

### Phase 1 (Days 1–30): India First Dominance
- **Why India First**: Largest PDF-tool traffic base in the world. High demand from students, job applicants, and government portal upload limits. Hindi and specific target-size queries face substantially lower competition than English global head terms.
- **Languages**: English (`en`) + Hindi (`hi`).
- **Slugs Strategy**: Clean Latin slugs (e.g. `/hi/compress-pdf`, `/hi/merge-pdf`) with native Devanagari text, headings, and FAQ schema to capture both Hinglish and Devanagari searches without percent-encoding bloat.
- **Top 10 Core Tools**: Merge, Compress, Split, JPG to PDF, PDF to JPG, Rotate, Sign, Protect, Unlock, Add Page Numbers.
- **Indian Use-Case Programmatic Pages**:
  - `/compress-pdf-to-200kb` — Specific quota for UPSC CSE, SSC CGL/CHSL, IBPS, and state PSC applications.
  - `/compress-pdf-for-online-form` — Multi-preset size selector (`< 200 KB`, `< 100 KB`, `< 50 KB`).
  - `/compress-pdf-to-100kb` — High-intent document/certificate target size.
- **Monetization**: Free ad-supported tier + affordable local micro-pricing (₹49/month or ₹299/year via UPI QR / Google Pay / PhonePe / Paytm).

### Phase 2 (Days 31–60): Indonesia (`id`) & Brazil (`pt-BR`)
- **Indonesia (`id`)**: Massive mobile-first population that queries almost exclusively in Bahasa Indonesia (`gabungkan pdf`, `kompres pdf`, `pisahkan pdf`, `ubah jpg ke pdf`). Very few quality local-language client-side tools exist.
- **Brazil (`pt-BR`)**: Huge legal/tax document volume with queries in Portuguese (`juntar pdf`, `comprimir pdf`, `dividir pdf`, `converter jpg em pdf`). Much lower keyword difficulty than English.
- **Monetization**: Pix QR payments (BRL) and QRIS / e-wallets (IDR).

### Phase 3 (Days 61–90): Vietnam (`vi`), Spanish LatAm (`es`), & 6–8 Week GSC Audit
- **Vietnam (`vi`)**: ~5% global traffic share (`gộp file pdf`, `nén file pdf`, `cắt file pdf`).
- **Spanish Latin America (`es`)**: Colombia, Mexico, Peru, Argentina, Chile (`unir pdf`, `comprimir pdf`, `dividir pdf`).
- **Search Console Audit Protocol**: Filter GSC data by Country and Query at week 6–8. Allocate development resources to high-CTR (>4%) countries; pause or iterate low-traction ones.

### Phase 4 (Later): Turkey (`tr`), Japan (`ja`), MENA Arabic (`ar`)
- Requires specialized localization: Arabic RTL layouts, Japanese CJK canvas rendering, and Turkish character encodings.

---

## 2. Programmatic Use-Case Landing Page Strategy
1. **Direct Intent Matching**: When users search for "compress pdf to 200 kb", landing them on a generic compressor with vague sliders results in high bounce rates. Dedicated pages must automatically enforce the exact file size constraint.
2. **Schema & Trust Elements**:
   - `SoftwareApplication` + `HowTo` + `FAQPage` JSON-LD schemas.
   - Trust badges: "100% Client-Side Private", "Compliant for UPSC/SSC/Govt Portals", "Guaranteed under 200 KB".
3. **Internal Linking**: Cross-link between the general tool (`/compress-pdf`) and specific use-case pages (`/compress-pdf-to-200kb`, `/compress-pdf-for-online-form`).

---

## 3. Slug & Keyword Strategy
1. **Never use raw machine translation for URLs.** Use verified search queries from native searchers (e.g. `unir-pdf`, `gabungkan-pdf`, `juntar-pdf`, `gop-file-pdf`).
2. **Define all localized slugs** in `lib/tools.ts` under each tool's `localized` dictionary.
3. **Include localized meta tags**, title, and descriptions reflecting native search phrasing.

---

## 4. Indexing & Domain Authority Gating (`reviewed: boolean`)
1. **Initial State**: All new localized entries must be created with `reviewed: false` unless verified.
2. **Robots Exclusion**: If `reviewed === false`, the page MUST emit `<meta name="robots" content="noindex, follow">`.
3. **Sitemap Protection**: `app/sitemap.ts` must omit all unreviewed locales from `sitemap.xml` to prevent Google indexing thin or unverified content.
4. **Promotion to Indexable**: Only mark `reviewed: true` after on-page text and localized headings are verified by a native speaker.

---

## 5. Canonical & Hreflang Matrix
1. Every page must emit a self-referencing canonical URL (`https://pdfpagenio.com/...`).
2. Every page must link to all reviewed locale versions with `<link rel="alternate" hreflang="..." href="...">`.
3. `x-default` must always point to the English version (`https://pdfpagenio.com/[slug]`).

---

## 6. Non-Latin Font & Complex Script Rules (Client-Side PDF Engine)
1. **WinAnsi Limitation**: The 14 standard PDF Type 1 fonts (`StandardFonts.Helvetica`, `TimesRoman`) only encode WinAnsi (Latin-1).
2. **Non-Latin Scripts**: Japanese Kanji/Kana, Vietnamese diacritics (`ơ`, `ư`, `ắ`), Russian Cyrillic, and Arabic throw `WinAnsi cannot encode` errors if drawn directly with standard fonts.
3. **Canvas Vector Stamping (`lib/pdf/unicode-stamping.ts`)**:
   - For non-Latin watermarks and custom page numbering labels, render the text to an offscreen Canvas at 300 DPI using browser-native typography.
   - Embed the resulting raster/vector as a PNG layer via `pdfDoc.embedPng()`.
   - **Advantage**: 0 KB network font payload, instant sub-10ms rendering, and 100% native ligature fidelity.

---

## 7. Right-to-Left (RTL) Layout Compliance
1. For Arabic (`ar`), Hebrew (`he`), Persian (`fa`), and Urdu (`ur`), set `dir="rtl"` on `<html>` or the tool container.
2. Use Tailwind CSS logical properties: `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `text-end`.
3. Mirror directional controls with `rtl:rotate-180`.
