# HANDOFF

## Current Task
Project page cover image: was cropped by object-cover in a fixed 16:9 box and not clickable.

## Status
Solved. Cover now renders at natural aspect inside a browser-style frame (`CoverFrame`) and opens the shared lightbox as image 1; gallery thumbnails use object-contain and continue from index 1. Old `Gallery.tsx` deleted in favour of `components/public/Lightbox.tsx` (LightboxProvider + CoverFrame + GalleryGrid).

## Progress
- [x] Phase 0 planning docs (`docs/`)
- [x] Next.js 16 app scaffold, Tailwind v4 tokens, IBM Plex fonts, security headers
- [x] `backend/migrations` 0001 (schema + RLS), 0002 (storage bucket + policies), 0003 (technology seed); `backend/README.md` runbook
- [x] Public site: home (hero, latest works panels, introduce, contact), `/work` (+ filters, archive), `/work/[slug]` case study (metadata, hero, markdown narrative, gallery, video embed, next), `/about` (bio, focus, skills with levels, now), 404, sitemap, robots, OG images, JSON-LD
- [x] Admin: login (rate-limited), proxy + `requireAdmin` + RLS, projects list (search/filter/reorder/feature/publish), project editor (all fields, tech picker with quick-add, links, collaborators, markdown with template + preview), image upload (sniff/size/dimension checks, EXIF strip, UUID paths, cover/gallery/wide/caption/reorder/delete, copy Markdown), publish validation panel, delete with name confirmation, technologies CRUD, site settings + portraits + JSON export, draft preview route
- [x] Migrations 0001–0003 applied by Levi (verified via REST 2026-09-15); auth user getmorelev@gmail.com created
- [x] Levi logged in and published the first project (Tembera Rwanda)
- [ ] Levi: run `backend/migrations/0005_site_copy.sql` (if not yet) and `0006_analytics_and_journey.sql` (analytics + journey) and `0007_technology_icons.sql` (logos)
- [ ] Levi: connect the repo to Vercel with the three env vars (`NEXT_PUBLIC_SITE_URL` = the `*.vercel.app` URL)
- [ ] Nice-to-have later: e2e tests (Playwright is installed as `playwright-core`; `scripts/screenshot.mjs` drives the system Edge), Lighthouse pass with real content, TOTP MFA

## Working Notes
Verify with `node scripts/check-cover.mjs` (needs `npx next start -p 3123`): asserts scrollY 0, cover rendered at natural ratio, click opens viewer 1/N, arrows and Esc work. `cover_aspect` on projects is no longer used for layout (portrait detection is from image dimensions).

## Recently Completed
- Project cover: uncropped browser-frame hero, clickable into shared lightbox with gallery.
- Favicon: app/icon.svg + apple-icon.png (LG mark), manifest.ts, public/icon-512.png.
- Project cards + laptop mockup: object-contain, box follows image ratio; cover_aspect removed from admin form.
- Uploads: no size cap. Browser downsizes big files (lib/utils/client-image.ts), server resizes to 4000px max, migration 0008 drops bucket limit (USER MUST RUN).
- 2026-09-16: admin recoloured blue/white and de-framed; project page: Lenis scroll reset on route change (was landing at the footer), smaller 16:9 hero, Gallery with full-screen lightbox (arrows, keyboard, swipe).
- 2026-09-16: admin rebuilt in the monochrome reference style (D29): grouped sidebar, header with search/Add/user menu, breadcrumbs, icon-circle cards; new pages Skills, Journey, Home, About, Now, Contact, Profile, Site settings; field-scoped settings saves.
- 2026-09-15: technology logos everywhere (Simple Icons CDN via `TechLogo`, `technologies.icon` column, migration 0007), home Toolbox logo wall, logos on cards, case studies, Skills and About.
- 2026-09-15 (late night): admin rebuilt as a light dashboard (sidebar + header; Dashboard, Projects, Analytics, Media, Technologies, Site) with first-party cookieless analytics (migration 0006, `/api/view`, `lib/db/admin.ts`, SVG charts), guided project creation with a completeness meter; public site gained Experiments, Journey, Skills, Now and Contact pages.
- 2026-09-15 (night): public site rebuilt as a rebranded copy of the Study Tracker website design (D27); photo `public/portrait.png` used as rounded cards; dashes rule kept.
- 2026-09-15 (late): fixed client crash (NEXT_PUBLIC_ env read dynamically), cutout portrait from image.svg in the hero, word-reveal/count-up/marquee/tilt animations, richer home (intro bio, How I work, Beyond software), all em dashes removed, migration 0005 for descriptive copy.
- 2026-09-15: V1 implementation — public site, admin CMS, migrations, README.
- 2026-09-15: Phase 0 planning and documentation.
