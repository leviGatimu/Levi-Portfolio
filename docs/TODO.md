# TODO / Open Questions

Updated 2026-09-15. Items move between sections as they resolve; resolved items are deleted (history is in git).

## Confirmed (known, no action)

- Identity: Levi Gatimu, student developer, Year 2 at NGA Coding Academy, Kigali, Rwanda.
- Email getmorelev@gmail.com; GitHub `leviGatimu`; LinkedIn URL known (personal-profile).
- Hosting: free `*.vercel.app` domain (no custom domain in V1); Supabase for the backend; Levi provides the GitHub repository to push to (D23).
- Verified strong projects with repos: Study Flow, Trace, Rwasim, Wixy (private), Planetary Scout (README/photos), Forge, Zibrah Code, SoW!se Africa.
- Stack: Next.js + TS + Tailwind v4 + Supabase (Postgres/Auth/Storage) + Vercel; CSS-only motion; Markdown case studies.
- IA: `/`, `/work`, `/work/[slug]`, `/about`, `/admin/*`.
- Schema, RLS, storage, auth, routing, deployment, security, performance, SEO, accessibility plans written.
- No fake content; no phone/age; no contact form; no theme toggle; no blog in V1.

## Decisions needed from Levi (blocking or near-blocking)

| # | Decision | Options | Recommendation | Blocks |
|---|----------|---------|----------------|--------|
| Q1 | **Accent colour** | A International Orange · B Signal Amber · (other) | A | Phase 2 tokens |
| Q2 | **Opening statement** | A "I build software, AI systems and robots — and finish them." · B "Software, AI systems and robotics. Built, not listed." · C plain descriptive · your own | A | Home copy |
| Q3 | **Featured projects and order** | From: Study Flow, Trace, Rwasim, Wixy, Tembera (if it exists), Planetary Scout | 01 Study Flow · 02 Trace · 03 Rwasim · 04 Wixy | Home |
| Q4 | **Tembera, RwaSport, School Finder** — do they exist? Where? | Provide repo/URL/status or drop | — | Inventory |
| Q5 | **Sentinel Signals** — is it Rwasim's public name, or a different project? | — | — | Inventory |
| Q6 | **Portrait** — provide the photo (≥ 1600px short side, calm background, headroom); OK with a rectangular editorial crop? | — | Yes | Home/About composition |
| Q8 | **Aviation wording** in the meta line | "FUTURE COMMERCIAL PILOT" · "ASPIRING COMMERCIAL PILOT" · "AVIATION-BOUND" · none in the opening | "FUTURE COMMERCIAL PILOT" | Home copy |
| Q9 | **Client/collab work permissions** — Zibrah Code (Ibrahim), SoW!se Africa, Forge (the founder), New Generation Academy site | Publish with permission / publish anonymised / exclude | Ask each; exclude until yes | /work content |
| Q10 | **Planetary Scout team** — who, and are team members OK being named/pictured? | — | Name roles, not people, unless they agree | Experiments |
| Q11 | **Archive trail** — show Year 1 coursework projects under "Archive" on /work? | Yes (curated ~6) · No | Yes, curated: NGA-MIS, Library system, Simba, Khomes, Inkingi Art Space, Homework to-do | /work |
| Q12 | **Instagram** — publish a link? | Yes + URL · No | No (keep contact professional) | Footer |
| Q13 | **Journey** (birthday experience) — publish as an anonymised creative-web experiment? | Yes anonymised · No | No (personal) | Experiments |
| Q14 | **Hobbies line** on About | Keep · Drop | Keep as one sentence | About |
| Q15 | Personal line "Build for fun not for money." | Keep on About · Drop | Drop (reads as a slogan) | About |

## To verify (facts about Levi and projects)

- Age in GitHub bio (15) — confirm; regardless, not published (D18).
- NGA programme name, enrolment date, what Year 1 covered.
- Class leadership title and period.
- Skills levels table in personal-profile — confirm/downgrade each; confirm or remove README-only claims (Java, Rust, Go, Kotlin, Swift, Dart, Flutter, Vite, MongoDB, Linux, Figma, Blender, Photoshop, Premiere, Arduino/C++).
- Per featured project: role, team, months, status (Trace has no release — is it "active" or "paused"?), live URLs (Study Flow live confirmed; Wixy/Trace/Rwasim none found).
- Rwasim: extent of "AI built in-house"; whether V2 is active.
- Any competitions, pitches, research, community work — only if real.

## To research (during implementation)

- Bricolage Grotesque variable file size after `latin` subsetting with all three axes (target ≤ 80 KB); fallback: restrict axes or use Archivo.
- Nonce-based CSP with the installed Next.js version; fall back to hash-based if brittle.
- Exact Next.js cache API names in the installed version (`unstable_cache` vs `cacheTag`/`'use cache'`) — write `lib/db` against whichever is stable.
- Supabase free-tier limits at build time (storage GB, egress) — confirm still sufficient.
- Whether `sharp` EXIF stripping keeps ICC colour profiles (we want colour preserved, GPS removed).
- LinkedIn/WhatsApp OG image caching behaviour for re-shares after content edits.

## Design decisions still open (non-blocking; resolved in Phase 2/6 with Levi)

- Lock Bricolage vs Archivo after rendering the name (T2.09).
- Exact overlap amount of surname over portrait at `xl`.
- Whether the home ledger shows *all* non-featured published projects or caps at ~12 with "All work →".
- Whether the Contact section shows local time (nice, tiny JS) — default yes.
- 404 page copy.

## Technical decisions still open (non-blocking)

- Server action vs route handler for uploads > 4.5 MB (Vercel body limit for server actions/functions is ~4.5 MB on some plans — **verify**; if binding, lower the file cap to 4 MB or use direct-to-storage signed uploads).
- Whether previews use a separate Supabase project later (D21).
- Add TOTP MFA for the admin (V2 candidate; cheap).

## Future ideas (V2+ — must NOT block V1)

- Writing/notes section (only once there is real writing).
- Slug-change redirect table.
- Content versioning / revision history in the admin.
- Direct-to-storage uploads with progress; server-side crop tool for the portrait.
- `/experiments` page when ≥ 6 experiments exist.
- Video uploads (currently URL only).
- Syntax highlighting for code blocks if real code samples become common.
- Sentry (or similar) if production errors become hard to diagnose.
- Layout animations via `motion` if a feature needs them.
- Search Console integration and a tiny "visits" note in the admin (from Vercel API) — only if useful.
- Downloadable one-page CV (PDF generated from settings) — only if reviewers ask for it.
