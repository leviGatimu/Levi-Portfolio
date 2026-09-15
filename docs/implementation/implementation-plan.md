# Implementation Plan

Ordered, small tasks. Each has a completion check. IDs are stable so HANDOFF.md and commits can reference them (`T3.07`). Tasks within a phase may be reordered if dependencies allow; phases may not.

## Phase 1 — Foundation

| ID | Task | Done when |
|----|------|-----------|
| T1.01 | `npx create-next-app` (TypeScript, App Router, Tailwind, ESLint, `src/` **off**, import alias `@/*`); remove boilerplate, Geist fonts and default page | Clean `npm run build`; repo has only the intended files |
| T1.02 | Add `prettier`, strict TS (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), ESLint rules from coding-conventions | `npm run lint && npm run typecheck` pass |
| T1.03 | Create folder structure from technical-architecture (empty index files where needed) | Structure matches doc |
| T1.04 | `.env.example`, `.gitignore` for env files; README.md (run/dev/deploy in 20 lines pointing to `/docs`) | Fresh clone instructions work |
| T1.05 | Push to the GitHub repo Levi provides (D23); branch protection on `main`; GitHub Actions workflow: install, typecheck, lint, test, build | CI green on a PR |
| T1.06 | Create Supabase project (EU region); install Supabase CLI; `supabase init`, `supabase link` | CLI connects |
| T1.07 | Migration `0001_init.sql`: enums, `projects`, `technologies`, `project_technologies`, `project_images`, `site_settings`, triggers, indexes | `supabase db push` applies cleanly twice (idempotent) |
| T1.08 | Migration `0002_admins.sql`: `admins`, `is_admin()`, RLS enable + policies on all tables | Anon can read nothing unpublished; anon cannot write (manual `curl` check) |
| T1.09 | Migration `0003_storage.sql`: bucket `media` (public), storage policies | Anon cannot upload; public read works |
| T1.10 | `seed.sql`: `site_settings` row with clearly-marked placeholders; initial `technologies` from personal-profile (no proficiency for unverified ones) | Seed runs; no project rows |
| T1.11 | `supabase gen types` → `types/database.ts`; `lib/supabase/{server,client,proxy}.ts` from `@supabase/ssr` | Typed client compiles |
| T1.12 | Disable sign-ups; create admin user; insert into `admins` | Login works via Supabase JS in a scratch script |
| T1.13 | Vitest setup; **RLS test** using the anon key against the hosted project (skips if env missing) | Test passes |
| T1.14 | `next.config.ts`: `images.remotePatterns`, security headers (CSP without nonce first), `trailingSlash: false`, preview `noindex` header | Headers visible in `curl -I` on preview |
| T1.15 | Vercel project: import repo, env vars, region `fra1`, Web Analytics on; first deploy | Empty shell live on `*.vercel.app` |

## Phase 2 — Design System

| ID | Task | Done when |
|----|------|-----------|
| T2.01 | `next/font/google`: Bricolage Grotesque (axes wght/wdth/opsz) and Geist Mono; CSS variables `--font-display`, `--font-mono`; fallback metrics | Fonts self-hosted; no external font requests; CLS 0 on a text page |
| T2.02 | `globals.css` `@theme`: colour tokens (both accent candidates behind a `data-accent` attribute for review), spacing, breakpoints, radii, z-index, easing/duration | Tokens compile to utilities |
| T2.03 | Fluid type tokens (`--text-display-xl` … `--text-meta`) with `clamp()`, `opsz` per token; Tailwind utilities `text-display-xl` etc. | Renders at all spec sizes |
| T2.04 | `.grid-editorial` utility + `Bleed` component; container + gutters per breakpoint | Layout doc diagram reproducible |
| T2.05 | Base styles: body bg/fg, selection, focus-visible ring, link underline behaviour, `prefers-reduced-motion` block, print stylesheet | Focus visible on every element type |
| T2.06 | Shared components: `Meta`, `MetaList` (`dl`), `Rule`, `SectionHeader`, `ExternalLink`, `TechList`, `StatusBadge` | Each has all states; axe clean |
| T2.07 | `Prose` (react-markdown + remark-gfm, `skipHtml`, allowed elements, protocol filter, caption convention, h1→h2 demotion) | XSS test passes; renders Trace README sample correctly |
| T2.08 | `Reveal` client component (IO + `data-revealed`; no hidden state without JS; reduced-motion check) | Works with JS off; no layout shift |
| T2.09 | `/dev/tokens` page (gated to non-production) showing tokens, type scale, components, both accents, the name in Bricolage vs Archivo | Reviewed by Levi; decisions recorded |
| T2.10 | Update typography/color docs and DECISIONS with the locked choices | Docs match code |

## Phase 3 — Public Website

| ID | Task | Done when |
|----|------|-----------|
| T3.01 | `lib/db`: `getSiteSettings`, `getFeaturedProjects`, `getPublishedProjects`, `getProjectBySlug` (+prev/next), `getTechnologiesForAbout`, `getLastUpdated`, all tagged | Unit tests with a mocked client; one integration run against hosted data |
| T3.02 | Enter one real draft project (Trace) via SQL for development (verified content only, marked draft) | Visible via admin query only |
| T3.03 | Root public layout: `Masthead` (sticky, scroll class), `MobileMenu` (focus trap, `inert`, Escape), skip link, `Footer` with last-updated | Keyboard + screen reader pass |
| T3.04 | Home — Opening section (name, meta lines, statement, portrait slot with placeholder box, fact list); responsive per spec; LCP = name text | No JS needed; CLS 0 |
| T3.05 | `ProjectPlate` + Selected Work section (alternating, bleeds, `sizes`, cover aspect handling) | Renders 16:10 and 4:5 covers correctly at all breakpoints |
| T3.06 | `ProjectRow` + Index ledger (table semantics; no thumbnails on home) | Table reads correctly in NVDA |
| T3.07 | `ExperimentTile` + Experiments strip (staggered offsets desktop) | |
| T3.08 | About paper section (`data-surface="paper"` token swap), now line with dot, link to /about | Contrast checks pass on paper |
| T3.09 | Contact section + `LocalTime` (server time first; `Africa/Kigali`) | No hydration mismatch |
| T3.10 | `/work`: header with truthful counts, filter links, rows with hover/focus thumbnails (desktop) and visible thumbnails (mobile), Archive group | Filters via URL; back/forward works |
| T3.11 | `/work/[slug]`: `ProjectHeader`, hero, `ProjectSection` (sticky label), body via `Prose` with inline gallery images and captions, trailing `Gallery`, links, `NextProject`; `generateStaticParams`; `notFound` | Trace draft renders as a full case study (via preview route later; for now temporarily published in dev) |
| T3.12 | `/about`: portrait slot, long bio (Markdown with sections), skills grouped with levels, now, contact | |
| T3.13 | `not-found.tsx`, `error.tsx` in the design language | |
| T3.14 | Metadata: `metadataBase`, per-route `generateMetadata`, canonical, robots; `sitemap.ts`, `robots.ts` | `curl` checks per seo doc |
| T3.15 | OG images: default and per-project `ImageResponse` using the same fonts | Renders in share-preview tools |
| T3.16 | JSON-LD `Person` (home/about) and `CreativeWork`/`SoftwareSourceCode` (case study) | Rich Results Test passes |
| T3.17 | Playwright: smoke (routes 200 + titles), axe on all public routes, keyboard menu test, reduced-motion test | Green in CI |
| T3.18 | Lighthouse CI config with budgets; run on preview | ≥ 90/100/95/100 mobile |

## Phase 4 — Project CMS

| ID | Task | Done when |
|----|------|-----------|
| T4.01 | `proxy.ts`/middleware: session refresh + `/admin` redirect; `requireAdmin()` helper; admin layout check | Unauthenticated → login; non-admin → signed out |
| T4.02 | `/admin/login` page + `signIn`/`signOut` actions; generic errors; backoff; `noindex` | Login/logout works; wrong password gives generic error |
| T4.03 | `AdminShell` (sidebar, mobile top bar, View site, Log out) + admin components `Button`, `Field`, `Toast`, `Dialog` | axe clean |
| T4.04 | zod schemas: project (create/update), image, technology, settings, links/collaborators shapes; shared `getPublishBlockers()` | Unit tests for each rule |
| T4.05 | Projects list: query with search/filter params, table, `moveProject` buttons with live-region announcement, stats header | Reorder reflected on public page after publish |
| T4.06 | `createProject` + `/admin/projects/new` (Basics only) → redirect to editor | |
| T4.07 | Project editor — Basics, Details, Links, Technologies (`TechPicker` with inline add), `updateProject` (transactional tech replace) | Save draft round-trips every field |
| T4.08 | Media: `uploadProjectImage` (sniff, size, `sharp` metadata, EXIF strip, UUID path, row insert, rollback on failure), `ImageUpload` component with states | Upload security tests pass |
| T4.09 | `GalleryManager`: alt inline edit, caption, wide toggle, move, set cover (DB unique partial index), remove with confirm, Copy Markdown | Exactly one cover enforced; deletion removes object |
| T4.10 | Case-study section: `MarkdownField` with template insert and server-rendered preview toggle | Preview equals public rendering |
| T4.11 | Publish panel: blockers/warnings from `getPublishBlockers`, `publishProject`/`unpublishProject`/`setFeatured`; revalidation calls | Publishing a project makes it appear on `/work` within seconds without deploy |
| T4.12 | `/admin/preview/[id]` reusing the case-study component from the draft row; preview bar | Draft preview matches later published page |
| T4.13 | Delete project flow (unpublish-first guard, type-name confirm, storage cleanup) | No orphans after delete |
| T4.14 | `/admin/technologies`: grouped table, inline edit, add, proficiency, show-on-about, move, delete guard when in use | About page reflects changes |
| T4.15 | `/admin/site`: identity, bios, now (auto-stamp), links, portrait slots (replace + delete old), export JSON, storage stats + orphan cleanup | Portrait appears on home/about after save |
| T4.16 | Playwright e2e: login → create project → upload cover → fill required → publish → visible on `/work` and `/work/[slug]` → unpublish → 404 | Green in CI |
| T4.17 | Remove the T3.02/T3.11 dev-only publishing shortcuts; all content now via admin | Repo has no fixtures with real content |

## Phase 5 — Content (Levi + assistant)

| ID | Task | Done when |
|----|------|-----------|
| T5.01 | Answer TODO "To verify" and "Decisions" items | TODO updated |
| T5.02 | Screenshots for 4 featured projects per checklist; alt texts | Uploaded |
| T5.03 | Case studies written (from READMEs + Levi's notes) for Study Flow, Trace, Rwasim, Wixy | Published |
| T5.04 | Experiments (Planetary Scout) + permitted client work entered | Published or explicitly excluded |
| T5.05 | Site copy: statement, meta lines, bios, now, aviation, skills levels | Saved |
| T5.06 | Portrait crops uploaded; composition checked on desktop/mobile | Levi approves |

## Phase 6 — Polish

| ID | Task | Done when |
|----|------|-----------|
| T6.01 | Fresh-eyes design review against anti-checklist at 360/768/1024/1440/1920 with real content; fix compositions | Sign-off |
| T6.02 | Copy edit all public text (voice rules) | |
| T6.03 | Performance audit: bundle analyzer, `sizes`, font sizes, image weights; lock Lighthouse CI thresholds | Budgets green |
| T6.04 | OG images checked in LinkedIn/WhatsApp preview; favicon set (SVG + PNG + ICO); `manifest` minimal | |
| T6.05 | Remove `/dev/tokens` from production (or gate) | |

## Phase 7 — Testing

| ID | Task | Done when |
|----|------|-----------|
| T7.01 | Walk accessibility.md verification list; NVDA pass; zoom 200%; reduced motion | Evidence in HANDOFF |
| T7.02 | Walk security.md checklist; headers test; RLS/upload/XSS tests green | |
| T7.03 | Slow-network run (Slow 4G) of home and a case study; fix anything > budget | |
| T7.04 | Cross-browser: Chrome, Firefox, Safari (iOS), Edge; Android Chrome | |

## Phase 8 — Deployment

| ID | Task | Done when |
|----|------|-----------|
| T8.01 | Set production `NEXT_PUBLIC_SITE_URL` to the `*.vercel.app` URL; verify canonical/OG URLs (no custom domain — D23) | Live on the Vercel URL |
| T8.02 | Backup workflow (weekly `pg_dump` action) + first manual export | Artefact exists |
| T8.03 | Old Vercel project redirect (if kept); GitHub README links updated | |
| T8.04 | Search Console sitemap submission (optional) | |
| T8.05 | HANDOFF.md runbook: how to add a project, rotate keys, restore a backup, redeploy | Written |
