# Performance

## Budgets (mobile, Slow 4G throttling, mid-tier Android — Lighthouse "Moto G Power" profile)

| Metric | Budget | Notes |
|--------|--------|-------|
| LCP | ≤ 2.0 s (home), ≤ 2.5 s (case study) | LCP element is the name (text) on home; the hero image on case studies |
| CLS | ≤ 0.02 | Fonts via `next/font` with fallback metrics; all images sized |
| INP | ≤ 150 ms | Almost no JS; menu and reveal are trivial |
| TTFB | ≤ 400 ms (cached ISR) | Vercel edge cache |
| JS transferred (public pages) | ≤ 90 KB gzip total (Next runtime + 3 tiny client components) | Measured on `/` |
| CSS | ≤ 20 KB gzip | Tailwind v4 output |
| Fonts | ≤ 120 KB total (2 variable woff2, latin subset) | |
| Images above the fold (home, mobile) | ≤ 250 KB total | Portrait at mobile width AVIF ~60–90 KB; first plate cover lazy if below the fold |
| Full page weight (home, mobile, first load) | ≤ 1.0 MB | Plates lazy-load as they approach the viewport |
| Lighthouse Performance | ≥ 90 mobile, ≥ 95 desktop | On `/`, `/work`, one case study |

Budgets are enforced in CI with Lighthouse CI (`lhci autorun` against the preview URL) with assertions on the metrics above; a regression fails the check.

## Strategy

### Rendering

- Server components everywhere on the public site; only three client components. No data fetching in the browser.
- ISR with tag revalidation: pages are static-fast and update on publish.
- No layout shift from hydration: client components render identical markup on server and client (`LocalTime` renders the server time first, then ticks).

### Images (the main cost)

- `next/image` for every project image and the portrait; `priority` only on the LCP candidate (portrait on home, hero on case study); `loading="lazy"` for all others.
- Accurate `sizes` per role (layout doc), so a 390px-wide phone downloads a ~800px image, not a 2880px one.
- Store originals; let Vercel serve AVIF/WebP at the requested widths; `deviceSizes` tuned to `[390, 640, 768, 1024, 1280, 1440, 1920]` and `imageSizes` to `[240, 400, 600]`.
- Cover images have DB-known dimensions → fixed aspect boxes → no CLS.
- The work index thumbnails (desktop hover) load lazily and only on `lg+` via `sizes` + CSS (image element present but `loading="lazy"`; not fetched until near viewport — on mobile the element is `display:none` and `next/image` still may fetch; therefore render it conditionally using a container query approach: the thumbnail markup is included only on `/work` for mobile as a visible image and on the home ledger not at all — see responsive doc).

### Fonts

- Two variable fonts, `latin` subset, `display: swap`, preloaded by `next/font`, `adjustFontFallback` on. Bricolage's variable file is larger than a static cut — verify the subset file size at Phase 2; if > 80 KB, restrict axes (`wght` 400–700, `opsz`) or use static instances for display.

### JavaScript

- No animation library, no smooth scroll, no icon set on public pages.
- `@vercel/analytics` is ~1 KB and loaded `afterInteractive`.
- Markdown is rendered on the server; `react-markdown` never ships to the browser on public pages.
- Admin bundle may be larger (forms, uploads) — it is not on the public budget but must stay reasonable (≤ 250 KB gzip).

### CSS

- Tailwind v4 with tokens; no runtime CSS-in-JS. Global stylesheet ≤ 20 KB gzip.
- `content-visibility: auto` on below-fold sections (`Index`, `Experiments`, `About`, `Contact`) with `contain-intrinsic-size` hints to skip off-screen layout work on long pages.

### Network

- Vercel edge caching for ISR pages; immutable cache headers on storage objects and Next static assets.
- No third-party requests except Vercel Analytics. No Google Fonts runtime, no CDN scripts.
- Preconnect to the Supabase storage origin from the root layout (`<link rel="preconnect">`), since images are cross-origin.

### Database

- One query per page with embedded relations; indexes cover every filter/sort (schema doc). No N+1.
- Supabase region matched to Vercel function region.

## Measurement

- Local: `next build` bundle analysis (`@next/bundle-analyzer` as a dev dependency only) once per milestone.
- CI: Lighthouse CI on preview URLs (mobile config).
- Production: Vercel Speed Insights (real-user CWV) reviewed weekly during the first month, monthly after.

## Trade-offs made in favour of performance

- No Framer Motion; CSS motion only.
- No custom cursor, no smooth scroll, no parallax, no WebGL.
- No syntax highlighter for code blocks.
- Real screenshots stored as originals but delivered resized — quality retained, weight controlled.
