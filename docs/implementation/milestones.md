# Milestones / Roadmap

Each phase leaves the system demonstrable. Dependencies flow downward. Durations are ranges for one developer working part-time alongside coursework; they are estimates, not commitments.

## Phase 0 — Research & Planning ✅ (2026-09-15)

- Inspect existing site and repositories; study the reference; write `/docs`.
- **Done when:** all docs exist; decisions and open questions listed; Levi has reviewed and answered the blocking questions in TODO.

## Phase 1 — Foundation (1–2 days)

- Initialise Next.js + TypeScript + Tailwind v4; repo, CI (typecheck, lint, test, build); folder structure; `.env.example`.
- Supabase project; migrations `0001_init` (enums, tables, triggers, RLS), `0002_admins`, `0003_storage`; seed (settings placeholders, technologies); generated types.
- Vercel project linked; first deploy of an empty shell with security headers.
- **Depends on:** the GitHub repository from Levi (D23).
- **Done when:** `npm run build` passes in CI; the empty site deploys; RLS test passes against the hosted project; admin user can log in to a placeholder `/admin`.

## Phase 2 — Design System (2–3 days)

- Fonts via `next/font`; tokens in `globals.css` `@theme`; fluid type scale; grid utility; spacing; motion tokens; reduced-motion block; print styles.
- Shared components: `Meta`, `MetaList`, `Rule`, `SectionHeader`, `ExternalLink`, `TechList`, `StatusBadge`, `Bleed`, `Prose`, `Reveal`.
- A private `/dev/tokens` page (removed before launch or gated) rendering every token and component state for review.
- **Font validation:** render the name in Bricolage vs Archivo; lock the choice (DECISIONS update).
- **Accent validation:** render both accent candidates in context; Levi decides.
- **Done when:** tokens page reviewed by Levi on phone and desktop; typography and colour docs updated with any changes; axe clean on the tokens page.

## Phase 3 — Public Website (4–6 days)

- Masthead + MobileMenu + Footer (root layout).
- Home: Opening (with a placeholder portrait box until the photo arrives), Selected Work plates, Index ledger, Experiments strip, About paper section, Contact.
- `/work` with filters and hover thumbnails; `/work/[slug]` case study with all sections, gallery, next project; `/about`.
- `not-found`, `error`, sitemap, robots, metadata, OG images, JSON-LD.
- Data layer `lib/db` with tagged caching.
- **Depends on:** Phase 2; database with at least one *real* draft project entered by hand via SQL/Supabase UI for development (using verified Trace/Study Flow content — no fake data).
- **Done when:** all public routes render real data; responsive spec met at 360/768/1024/1440/1920; Lighthouse mobile ≥ 90/100/95/100 on preview; axe clean; keyboard walkthrough passes.

## Phase 4 — Project CMS (4–6 days)

- Auth: login page, proxy/middleware, `requireAdmin`, logout.
- AdminShell; Projects list (search, filters, reorder); Project editor (all sections); server actions with zod; publish validation; preview route.
- Media: upload action with validation/EXIF strip/`sharp` metadata; gallery manager; cover; copy-Markdown.
- Technologies page; Site page (identity, bios, now, links, portraits, export, storage maintenance).
- **Depends on:** Phase 1 schema; Phase 3 case-study template (for preview).
- **Done when:** the "finish a project tonight" workflow completes end-to-end in < 15 minutes with a real project; RLS and upload security tests pass; axe clean on admin pages; e2e test for create → upload → publish → visible on `/work` passes.

## Phase 5 — Content (Levi, 3–7 days elapsed; parallel with 4)

- Answer all `NEEDS USER INPUT` items; confirm skills levels; write bios, now, aviation paragraph.
- Capture screenshots (checklist in content-status); write four featured case studies; decide archive set; obtain permissions.
- Provide the portrait; integrate crops.
- **Done when:** the launch gate in content-status is met.

## Phase 6 — Polish (2–3 days)

- Fresh-eyes review against the anti-checklist and the 60-second reviewer test; composition tuning at each breakpoint; copy edit; OG images verified in share tools; 404/error pages styled.
- Performance pass: bundle analysis, image `sizes` audit, font file sizes, Lighthouse CI thresholds locked.
- **Done when:** Levi signs off the design on real content; budgets green.

## Phase 7 — Testing (1–2 days; continuous before this)

- Full e2e suite green on preview; manual screen-reader pass (NVDA); 200% zoom; reduced-motion; slow-network run; security checklist walked item by item.
- **Done when:** every checklist in accessibility.md and security.md is ticked with evidence (screenshots or test output linked in HANDOFF).

## Phase 8 — Deployment (½ day)

- Env vars finalised; `NEXT_PUBLIC_SITE_URL` = production `*.vercel.app` URL (no custom domain — D23); old Vercel project redirect (if kept); Search Console sitemap (optional); backup workflow enabled; first export taken.
- Update GitHub profile README links to the Vercel URL.
- **Done when:** production URL live, smoke test green, HANDOFF updated with the operational runbook.

## Critical path

`1 → 2 → 3 → 4 → 6 → 7 → 8`, with `5` running alongside 3–4 and gating 6. The biggest risk is **content readiness (Phase 5)**, not code; start Levi's content tasks immediately after Phase 0 approval.
