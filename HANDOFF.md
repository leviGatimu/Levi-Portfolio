# HANDOFF

## Current Task
Build the portfolio (public site + private admin) on Next.js 16 + Supabase, based directly on the Dribbble reference, with SQL migrations Levi runs himself.

## Status
Solved (V1 code complete) — 2026-09-15. `npm run build`, `typecheck`, `lint` all pass. Public routes and admin auth redirects verified against the production build; homepage, project panels, case study and admin markup verified via headless screenshots. **The Supabase schema has not been applied yet** — Levi runs `backend/migrations/*.sql` (see `backend/README.md`), creates the admin user, and adds it to `public.admins`. Until then the public site renders its empty shell with a `[db] schema not found` console warning, and `/admin` login cannot succeed.

## Progress
- [x] Phase 0 planning docs (`docs/`)
- [x] Next.js 16 app scaffold, Tailwind v4 tokens, IBM Plex fonts, security headers
- [x] `backend/migrations` 0001 (schema + RLS), 0002 (storage bucket + policies), 0003 (technology seed); `backend/README.md` runbook
- [x] Public site: home (hero, latest works panels, introduce, contact), `/work` (+ filters, archive), `/work/[slug]` case study (metadata, hero, markdown narrative, gallery, video embed, next), `/about` (bio, focus, skills with levels, now), 404, sitemap, robots, OG images, JSON-LD
- [x] Admin: login (rate-limited), proxy + `requireAdmin` + RLS, projects list (search/filter/reorder/feature/publish), project editor (all fields, tech picker with quick-add, links, collaborators, markdown with template + preview), image upload (sniff/size/dimension checks, EXIF strip, UUID paths, cover/gallery/wide/caption/reorder/delete, copy Markdown), publish validation panel, delete with name confirmation, technologies CRUD, site settings + portraits + JSON export, draft preview route
- [x] Migrations 0001–0003 applied by Levi (verified via REST 2026-09-15); auth user getmorelev@gmail.com created
- [ ] Levi: run `backend/migrations/0004_admin_user.sql` (UID pre-filled) and `0005_site_copy.sql`, then log in and add projects
- [ ] Levi: connect the repo to Vercel with the three env vars (`NEXT_PUBLIC_SITE_URL` = the `*.vercel.app` URL)
- [ ] Nice-to-have later: e2e tests (Playwright is installed as `playwright-core`; `scripts/screenshot.mjs` drives the system Edge), Lighthouse pass with real content, TOTP MFA

## Working Notes
- Env: `.env.local` holds `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`. Only the publishable key is ever used.
- Design in code (D27): the public site is a port of Levi's Study Tracker landing design (light canvas, Clash fonts via Fontshare, blue accent, white blob cards, draggable hero cards, Lenis, custom cursor, dark-mode toggle, SandText footer). Components in `components/public/`. Admin keeps a dark palette via `.admin-scope`. Earlier design docs are historical.
- Data flow: public pages use the cookie-less client (`lib/supabase/public.ts`) and are ISR (1h); every admin write calls `revalidatePublic()` (`lib/actions/revalidate.ts`). Admin uses `@supabase/ssr` cookies; `proxy.ts` redirects, `requireAdmin()` + RLS enforce.
- `mediaUrl()` returns absolute paths/URLs unchanged (used by fixtures); storage paths become public bucket URLs.
- `types/database.ts` is hand-written — update it when a migration changes the schema (Relationships are needed for embedded selects to type-check).
- Verified: `next build` passes with the schema missing; routes `/`, `/work`, `/about`, `/work/[slug]` (404 for unknown), `/admin` → login redirect, sitemap, robots, OG image 1200×630. Headless checks showed no horizontal overflow at 390 and 1440.
- Known: `Reveal` hides below-fold blocks until intersection with a 2s fallback; full-page screenshot tools should scroll first (`scripts/screenshot.mjs` does).
- Tooling: multi-file bash heredocs sometimes fail to parse in this environment — write source files with the Write tool or one file per heredoc.
- Next step on resume: if migrations are applied, log in at `/admin/login`, create a real project end-to-end (upload → publish) and confirm it appears on `/`; then deploy to Vercel and run Lighthouse on the preview URL.

## Recently Completed
- 2026-09-15 (night): public site rebuilt as a rebranded copy of the Study Tracker website design (D27); photo `public/portrait.png` used as rounded cards; dashes rule kept.
- 2026-09-15 (late): fixed client crash (NEXT_PUBLIC_ env read dynamically), cutout portrait from image.svg in the hero, word-reveal/count-up/marquee/tilt animations, richer home (intro bio, How I work, Beyond software), all em dashes removed, migration 0005 for descriptive copy.
- 2026-09-15: V1 implementation — public site, admin CMS, migrations, README.
- 2026-09-15: Phase 0 planning and documentation.
