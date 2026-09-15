# HANDOFF

## Current Task
Planning phase (Phase 0) for Levi Gatimu's portfolio rebuild: research, design direction, architecture, content inventory, CMS design, and full `/docs` documentation before any code is written.

## Status
Solved — Phase 0 complete on 2026-09-15. All planning documents written under `docs/`. **No implementation has started; the project directory contains only `docs/` and this file.** Waiting on Levi's answers to `docs/TODO.md` → "Decisions needed from Levi" (Q1–Q15) before Phase 1/2 choices that depend on them (accent, statement, featured set, portrait, domain).

## Progress
- [x] Inspected current site (portfolioz-blue.vercel.app) — content extracted, inflated claims and phone number identified for removal
- [x] Analysed the Dribbble reference at pixel level (colours sampled, composition, type, accent usage)
- [x] Verified GitHub: 78 repos via authenticated `gh`; READMEs, languages, commits, live URLs checked for key projects
- [x] Wrote all docs: product (5), design (8), content (4), architecture (9), admin (4), research (3), implementation (4), DECISIONS, TODO, README
- [x] Levi confirmed: free Vercel domain, Supabase backend, he supplies the repo (D23)
- [ ] Levi answers TODO Q1–Q15 (Q7 domain now resolved and removed)
- [ ] Phase 1 — Foundation (see docs/implementation/implementation-plan.md T1.01–T1.15)

## Working Notes
- Read `docs/README.md` first; it gives the reading order and the source-of-truth hierarchy.
- Key findings a new session must not re-derive:
  - Tembera, RwaSport, School Finder: **no repositories exist** anywhere on the account. Sentinel Signals ≈ `Rwasim` (unconfirmed).
  - Strongest verified projects: `study-flow-app` (+ `Study-Flow` releases, `study-flow-website`), `Trace`, `Rwasim`, `Wixy` (private), `Space-robot` (Planetary Scout, README only), `forge`, `zibrahcode` (client, live at zibrahcode.com), `SoW-se-Africa`.
  - Hosting decision from Levi (2026-09-15): free `*.vercel.app` domain, Supabase backend, he provides the GitHub repo to push to — keep it simple (D23). `levigatimu.com` is not used.
  - Design decisions: dark warm charcoal + off-white + one accent + one paper section; Bricolage Grotesque + Geist Mono (validate vs Archivo in Phase 2); CSS-only motion; no theme toggle; no contact form.
  - Stack: Next.js App Router, Tailwind v4, Supabase (Postgres/Auth/Storage, RLS, single admin allow-list), Vercel; Markdown case studies with structured summary fields; 5 tables + 1 join.
- Tooling notes: Chrome extension was not connected this session (used curl + Python/PIL for the reference image); `gh` is authenticated as `leviGatimu`; long multi-file bash heredocs failed once — write docs with the Write tool.
- Next step on resume: if TODO answers exist, record them in `docs/DECISIONS.md`/`docs/TODO.md`, then start **T1.01** (`create-next-app`) following `docs/implementation/coding-conventions.md`. Do not seed any project data — the only dev data is a hand-entered *draft* of Trace from its README (T3.02).

## Recently Completed
- 2026-09-15: Phase 0 planning and documentation (this task).
