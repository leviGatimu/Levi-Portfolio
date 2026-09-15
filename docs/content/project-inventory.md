# Project Inventory

Verified on 2026-09-15 against github.com/leviGatimu (78 repositories, 5 private; authenticated `gh` access) and live URLs (HTTP checks). Everything below is either **observed** (repository contents, README, commit history, HTTP status) or marked `NEEDS USER INPUT` / `NEEDS VERIFICATION`. Descriptions are paraphrased from each project's own README; they are *drafts* for Levi to approve.

## Reconciliation with the brief

| Name in brief | Found as | Status |
|---------------|----------|--------|
| Tembera | **Not found** in any repository (public or private). Appears only in the GitHub profile README ("A digital guide to real places across Rwanda", Next.js/React/PostgreSQL, links are `#`). | **NEEDS USER INPUT** — repo location, live URL, status, screenshots |
| Study Flow | `study-flow-app` (main, 86 commits), `Study-Flow` (releases + earlier build), `study-flow-website` (marketing site) | Verified |
| Wixy | `Wixy` (private) | Verified |
| Trace | `Trace` (public) | Verified |
| Sentinel Signals | **Not found by name.** `Rwasim` matches the README description ("traffic-system simulation exploring adaptive traffic control", Python/AI/Simulation) and contains `data/kigali_signals.geojson`. | **NEEDS VERIFICATION** — is Sentinel Signals the public name of Rwasim, or a different project? |
| Forge | `forge` (public, no README; has HANDOFF.md) | Verified — but built for "the founder" (someone else); permission needed |
| Zibrah Code | `zibrahcode` (public); live at zibrahcode.com | Verified — client project; permission needed |
| RwaSport | **Not found** | **NEEDS USER INPUT** |
| School Finder | **Not found** (`Scour` is an empty repo created 2026-09-14 — possibly the intended home?) | **NEEDS USER INPUT** |
| Robotics / embedded | `Space-robot` ("Planetary Scout") — README, photos, materials PDF; no code | Verified as a design/prototyping-phase team project |

## Classification

| Class | Meaning | Projects |
|-------|---------|----------|
| **Featured** (homepage plates, 3–5) | Strongest, most complete, best documented, real screenshots | Study Flow, Trace, Rwasim (as Sentinel Signals?), Wixy — *Tembera if it exists and is strong* |
| **Active / Published** (on /work) | Real, presentable, may be smaller | Planetary Scout (experiment), Forge (if permitted), Zibrah Code (if permitted), SoW!se Africa (if permitted), Loader, Fire Extinguisher Management System, New Generation Academy site |
| **Experiment** | Prototypes, hardware, simulations, unusual things | Planetary Scout, Rwasim V2 (living city), Journey (only if anonymised and Levi agrees) |
| **Archive** (listed under "Archive" on /work, low emphasis, only if Levi wants) | Coursework and learning projects that show the Year 1 journey | NGA-MIS / V2, Vault, Library system, Simba supermarket, Khomes, K-finance, Flux (PHP), markup, Inkingi Art Space, Homework to-do list, New Generation Academic System |
| **Do not publish** | Personal, private data, empty, or duplicate repos | journey (personal gift — unless anonymised), Portfolioz/Portfolio/cinematic-portfolio (old portfolios), exam/homework repos, learning repos, empty repos (Scour, WC26, FWN, Corexx…), duplicate repos (bestbuy-fontend, Fire-…-Blade vs TS) |

Featured order is Levi's decision (see TODO). Proposed: **01 Study Flow · 02 Trace · 03 Rwasim · 04 Wixy**.

---

## Featured candidates (full inventory)

### Study Flow

| Field | Value | Source |
|-------|-------|--------|
| Slug | `study-flow` | |
| One-liner (draft) | A study workstation that plans your day, times your focus, and scores the term honestly. | README tagline |
| Description (draft) | Turns a school timetable into a working day: knows which lesson is on now, what was planned next, and how much was actually finished. Runs as a web app on Postgres and as an offline Windows desktop app with its own SQLite database. | README |
| Problem | Students plan badly and study tools congratulate them for opening the app. | README (paraphrase) |
| Solution | Timetable-aware dashboard, full-screen focus sessions with a floating widget mode, homework/exam tracking with proof-of-work uploads, an AI tutor (Gemini/OpenAI/Anthropic/Groq/Ollama), insights and an honest end-of-term report, XP ledger with idempotency keys. | README |
| Role | **NEEDS VERIFICATION** — commits are by leviGatimu; assumed solo | commits |
| Team | Assumed solo — **NEEDS VERIFICATION** | |
| Year | 2026 (Study-Flow created May 2026; study-flow-app active to Sept 2026) | repo dates |
| Status | Active (v1.0.4 desktop release 2026-09-09) | releases |
| Category | Project · Full-stack + Desktop + AI | |
| Technologies (observed) | Next.js 16, React 19, TypeScript, Prisma 5, PostgreSQL (Supabase), SQLite (desktop), Electron 42, Supabase Storage, JWT auth cookie | README badges, package |
| Repository | https://github.com/leviGatimu/study-flow-app (public); releases at https://github.com/leviGatimu/Study-Flow/releases | verified |
| Live URL | https://study-flow-app-ashen.vercel.app (redirects to `/welcome`, 307 — live) | HTTP |
| Marketing site | https://study-flow-website-beta.vercel.app (200) | HTTP |
| Screenshots | `docs/images/hero.jpg`, `focus-session.jpg`, `ai-tutor.jpg`, `levels.jpg` in repo | repo — **must be re-captured at 2× for the portfolio** |
| Architecture (observed) | Two build targets share one Prisma client path (Postgres for web, SQLite for desktop); the desktop build ships the Next.js server on a local port; uploads to Supabase Storage on Vercel, local disk otherwise; transaction-pooler vs session-pooler distinction documented. | README |
| Interesting decisions | Timer lives in app state not the page (survives window close); XP ledger idempotency keys; desktop is not a browser wrapper; update check on launch and every six hours. | README |
| Challenges / lessons | Half-finished desktop builds left the web app querying Postgres through a SQLite client — fixed by restoring the client in `build:desktop` even on failure. | README |
| Outcome | Shipped installer; live web app. **No user numbers — do not invent.** | |
| Case-study depth | Strong — README already contains most of the narrative | |
| Publish | Yes | |

### Trace

| Field | Value | Source |
|-------|-------|--------|
| Slug | `trace` | |
| One-liner (draft) | A private, local activity history for Windows. Nothing leaves your machine. | README |
| Description (draft) | Records which applications you use and when, and gives you a searchable, reconstructable history of your day. No account, no server, no telemetry. | README |
| Problem | Screen-time tools give totals ("two hours in Chrome"); the real question is "what was I doing at seven last night?" | README |
| Solution | Session-level history with start/end/window title, day ribbon, timeline, per-app detail, search; pause, per-app exclusions, retention, JSON export, deletion. | README |
| Role | **NEEDS VERIFICATION** — assumed solo | |
| Year | 2026 (active to Aug 2026) | repo |
| Status | **NEEDS VERIFICATION** — README has install instructions but no GitHub release exists | releases (none) |
| Category | Project · Desktop / systems | |
| Technologies (observed) | C# / .NET 10 (tracker), Electron + React + TypeScript (dashboard), SQLite, NSIS installer, PowerShell scripts | languages, README |
| Repository | https://github.com/leviGatimu/Trace (public) | verified |
| Live / download | **None found** — installer not published as a release | |
| Screenshots | `brand/screenshots/overview.png`, `application.png` in repo | repo |
| Architecture (observed) | Two processes: `TraceTracker.exe` (background, tray, watchers → queue → engine → `PrivacyGate` → SQLite) and `Trace.exe` (Electron dashboard) communicating over a per-user-ACL named pipe (NDJSON). Tracker is the only DB writer; interface never opens the database. | README |
| Interesting decisions | Privacy enforced structurally (filtering before persistence; no soft-delete column; pause persists across reboot); named pipe instead of local HTTP port; interrupted sessions closed at last heartbeat (undercount, never guess); per-user install with no admin prompt. | README |
| Case-study depth | Very strong — the README is already a case study | |
| Publish | Yes | |

### Rwasim (possibly "Sentinel Signals")

| Field | Value | Source |
|-------|-------|--------|
| Slug | `rwasim` or `sentinel-signals` — **NEEDS USER INPUT** | |
| One-liner (draft) | An agent-based traffic simulation of Kigali built on real OpenStreetMap data. | README |
| Description (draft) | V1: realistic agent-based traffic simulation of Kigali (vehicles, A* routing, traffic lights, scenarios) on real OSM roads, signals and district boundaries. V2 (in progress): 20,000 synthetic citizens with census-weighted homes and ~1,900 real places, so rush hour emerges from schedules instead of scripts. | README |
| Role | Solo (all 4 commits by leviGatimu) — **NEEDS VERIFICATION** | commits |
| Year | 2026 (July) | repo |
| Status | Paused / in progress — **NEEDS VERIFICATION** | |
| Category | Experiment or Project · Simulation / AI | |
| Technologies (observed) | Python (engine, headless; pytest), FastAPI (REST + WebSocket tick streaming), Next.js + TypeScript + Tailwind, MapLibre GL, deck.gl, OpenStreetMap data (ODbL) | README |
| Repository | https://github.com/leviGatimu/Rwasim (public) | |
| Live | None found | |
| Screenshots | **TODO — none in repo; capture from local run** | |
| Architecture | Three independent layers: headless engine / API / frontend; modules pluggable; "AI built in-house, no external APIs" (extent **NEEDS VERIFICATION**). | README |
| Publish | Yes (name and status to confirm) | |

### Wixy

| Field | Value | Source |
|-------|-------|--------|
| Slug | `wixy` | |
| One-liner (draft) | Bite-sized communication lessons with AI practice conversations and transcript-grounded feedback. | README |
| Description (draft) | "The Duolingo for communication": lesson path, realistic AI practice sessions, a feedback engine grounded in the transcript, XP/streaks with a 7-day freeze, and a character with outfits and moods. Runs fully offline on a deterministic stub when no API key is present. | README |
| Role / team | **NEEDS VERIFICATION** — assumed solo | |
| Year | 2026 (June) | repo (created 2026-06-28) |
| Status | **NEEDS VERIFICATION** (13 commits, last push June 2026) | |
| Category | Project · Full-stack + AI | |
| Technologies (observed) | Next.js 14, TypeScript, Supabase (auth, DB), Anthropic API | README |
| Repository | https://github.com/leviGatimu/Wixy — **private**. Case study can say "private repository". | |
| Live | None found | |
| Screenshots | **TODO — capture** | |
| Publish | Yes, if Levi agrees to show a private-repo project | |

---

## Other verified projects (candidates for /work, experiments, archive)

| Project | Repo | Observed | Class (proposed) | Blockers |
|---------|------|----------|------------------|----------|
| **Planetary Scout** (Space-robot) | public | Semi-autonomous sample-collection rover; Phase 1 design & prototyping; Raspberry Pi 4, OpenCV, ROS Noetic planned; photos of build iterations; materials PDF; README-only (no code). Team ("we"). | Experiment | Team members and Levi's role **NEEDS USER INPUT**; photos need permission if others are visible |
| **Forge** | public, no README | AI "board" that deliberates without the founder at model speed, records the session, generates documents. Next.js 15, Supabase (8 tables, RLS), stage-checkpointed job runner designed around Vercel timeouts. Built with/for "the founder". | Project (client/collab) | **Permission / confidentiality NEEDS USER INPUT**; owner of the product |
| **Zibrah Code** | public | Author platform: book, framework, blog (Quill), podcast, events, inquire/contact with spam guard, admin, auto-migrations; PHP custom framework; cPanel deploy; live at zibrahcode.com | Project (client) | **Client permission NEEDS USER INPUT**; scope of Levi's role vs. others |
| **SoW!se Africa** | public | Official website for an NGO empowering African youth (PHP, CSS, GSAP) | Project (client) | Client permission; live URL |
| **Fire Extinguisher Management System** | public (TS + Blade variants, fire_frontend/backend) | Live at fire-extinguisher-management-system.vercel.app / fire-frontend-seven.vercel.app; Dockerfile in backend | Project (coursework?) | Team/role **NEEDS VERIFICATION**; likely group coursework |
| **Loader** (loader, Loader-backend, loader-frontend) | public | Python backend (Procfile) + TS frontend at loader-frontend-six.vercel.app; purpose **NEEDS USER INPUT** | Unknown | Description |
| **New Generation Academy** | private, live at new-generation-academy.vercel.app | Next.js site for the academy (611 KB TS) | Project | Is it official? Permission |
| **NGA-MIS / NGA-MIS-V2** | public | School management information system in PHP (2 MB); 513-line README | Archive / coursework | |
| **Journey** | public, live | Interactive birthday experience (Next.js 15, R3F, GSAP, Lenis) for a named person | Do not publish as-is | Personal; could be anonymised as an experiment in creative web |
| **Vault** | public; live URL 404 | E2E-encrypted file storage (per old site copy) | Archive | Live is down; verify claims |
| **Discipline and attendance** | public | TS + Python; 106-line README | Unknown | Read README; role |
| **Magerwa VMS** | public | Laravel/Blade vehicle management system | Archive / coursework | |
| **Khomes, K-finance, Flux (PHP), markup, Smart-saver, Joyous kitchen, Inkingi Art Space, Library system, Simba supermarket, Homework to-do list** | public | PHP/JS learning and small client-style projects from Jan–May 2026 | Archive | Only if Levi wants a visible Year 1 trail |

## Old-site projects that need re-examination

The current site lists **Flux** as "a state management library" (repo is PHP), **Corex** as "enterprise-grade web architecture framework" (repo is HTML, 1 commit), **BestBuy** with "Stripe payments" (not verified). These descriptions appear inflated relative to the repositories. **They will not be reused.** Each project's description must be rewritten from what the repo actually contains.

## Data still needed from Levi (per project)

For every project to be published: confirmation of role/team, status, exact year/months, the live URL if any, permission (client/team projects), 3–6 fresh screenshots at 2×, and 2–4 sentences each on the hardest problem and what he learned. Tracked in [content-status.md](content-status.md).
