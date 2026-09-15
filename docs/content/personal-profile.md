# Personal Profile / Content Inventory

Everything here is tagged with its source. Anything not sourced is marked `TODO — NEEDS USER INPUT` or `NEEDS VERIFICATION`. **Nothing unverified may be published.**

Sources: `[brief]` the planning brief · `[gh-profile]` github.com/leviGatimu profile fields · `[gh-readme]` the profile README (leviGatimu/leviGatimu, updated 2026-09-15) · `[site]` the current portfolio at portfolioz-blue.vercel.app · `[repo]` a specific repository.

## Identity

| Field | Value | Source |
|-------|-------|--------|
| Name | Levi Gatimu | brief, gh-readme |
| Display name | LEVI GATIMU (masthead); Levi (prose) | brief |
| Tagline | Student Developer · Full-Stack · AI · Robotics | brief, gh-readme |
| Location | Kigali, Rwanda | gh-profile |
| Education | NGA Coding Academy (New Generation Coding Academy), Rwanda | brief, gh-profile ("company: NGA") |
| Current year | Year 2 | brief |
| Age | GitHub bio and current site say 15 (bio may be stale) | **NEEDS VERIFICATION — and a decision on whether age is published at all. Recommendation: do not publish age; "Year 2 student" is enough.** |
| Email | getmorelev@gmail.com | site, gh-readme |
| GitHub | https://github.com/leviGatimu | gh-profile |
| LinkedIn | https://www.linkedin.com/in/levi-gatimu-a0277836b | gh-readme |
| Instagram | Current site links to instagram.com root (placeholder) | **TODO — NEEDS USER INPUT (publish? URL?)** |
| Phone | Published on the current site | **Will NOT be published** (privacy; see goals-and-non-goals) |
| Domain | `levigatimu.com` is linked from the GitHub README but does not resolve | Not used: V1 ships on the free `*.vercel.app` domain (D23). Update the README link at launch. |
| Portrait | `/levi.jpg` exists on the current site | **TODO — new portrait to be provided by Levi** |

## Developer identity (verified against repositories)

The claim "full-stack, AI, robotics, embedded, desktop" is supported by real repositories:

| Area | Evidence |
|------|----------|
| Full-stack web | study-flow-app (Next.js 16, Prisma, Postgres), Wixy (Next.js 14, Supabase, Anthropic API), forge (Next.js 15, Supabase), zibrahcode (PHP), SoW-se-Africa (PHP) |
| Desktop | Trace (C#/.NET 10 tracker + Electron/React dashboard), study-flow-app desktop build (Electron + SQLite) |
| AI applications | Wixy (LLM practice conversations, feedback engine), Study Flow AI tutor (multi-provider: Gemini/OpenAI/Anthropic/Groq/Ollama), forge (AI board deliberation engine) |
| Simulation / systems | Rwasim (agent-based traffic simulation, A* routing, FastAPI + WebSocket, MapLibre/deck.gl) |
| Robotics / embedded | Space-robot "Planetary Scout" (Raspberry Pi 4, OpenCV, ROS Noetic — team project, Phase 1 design/prototyping); C-programming-Ubudehe-program (C) |
| Databases | PostgreSQL via Prisma and Supabase, SQLite (Trace, Study Flow desktop), MySQL (PHP projects) |
| Languages seen in repos | TypeScript, JavaScript, PHP, Python, C#, C, SQL (PLpgSQL), Blade (Laravel), HTML/CSS |

## Skills (grouped, with honesty levels)

Levels: **Strong** (multiple shipped projects), **Comfortable** (used in at least one real project), **Learning** (coursework or partial use), **Experimental** (touched, not shipped). Levels below are **proposed from repository evidence** and must be confirmed by Levi — he may downgrade any; upgrades require evidence.

| Group | Skill | Proposed level | Evidence |
|-------|-------|----------------|----------|
| Languages | TypeScript | Strong | study-flow-app, Trace UI, Wixy, forge, Vault, many others |
| | JavaScript | Strong | Many repos |
| | PHP | Strong | zibrahcode, NGA-MIS-V2, SoW-se-Africa, Khomes, K-finance, Flux |
| | Python | Comfortable | Rwasim engine, loader, Space-robot |
| | C# | Comfortable | Trace tracker (.NET 10) |
| | C | Learning | C-programming-Ubudehe-program |
| | Java, Rust, Go, Kotlin, Swift, Dart, Bash | **NEEDS VERIFICATION** | Listed in README skill icons; no repository evidence found. Recommendation: omit unless Levi confirms real use. |
| Frontend | React | Strong | Most TS projects |
| | Next.js (App Router) | Strong | study-flow-app (16), forge (15), Wixy (14), journey (15) |
| | Tailwind CSS | Strong | Widespread |
| | Framer Motion / GSAP / Lenis / Three.js | Comfortable | forge, journey |
| | Vite, Flutter | **NEEDS VERIFICATION** | README icons only |
| Backend | Node.js / Express | Comfortable | Express-js, students_api, Javascript-book-express-API-exam |
| | Next.js route handlers / server actions | Strong | Study Flow, Wixy, forge |
| | FastAPI | Comfortable | Rwasim backend |
| | Laravel | Learning | Magerwa VMS, FEMS (Blade) |
| | PHP (vanilla, custom framework) | Strong | zibrahcode (`framework.php`, migrations, spam guard) |
| Databases | PostgreSQL | Strong | Prisma + Supabase across several projects; PLpgSQL migrations in forge/study-flow-app |
| | SQLite | Comfortable | Trace, Study Flow desktop |
| | MySQL | Comfortable | PHP projects |
| | Prisma | Comfortable | study-flow-app |
| | MongoDB | **NEEDS VERIFICATION** | README icon only |
| AI | LLM API integration (Anthropic, OpenAI, Gemini, Groq, Ollama) | Comfortable | Study Flow AI tutor, Wixy |
| | Prompt/feedback pipeline design | Comfortable | Wixy feedback engine, forge deliberation stages |
| | Computer vision (OpenCV) | Experimental | Space-robot |
| | Agent-based simulation | Comfortable | Rwasim |
| | Model training | Experimental | Rwasim states "AI built in-house"; extent **NEEDS VERIFICATION** |
| Robotics / Embedded | Raspberry Pi | Learning | Space-robot |
| | Arduino / C++ | **NEEDS VERIFICATION** | Brief mentions Arduino/electronics; no repo found |
| | ROS | Experimental | Space-robot (planned) |
| | Electronics / sensors | **NEEDS VERIFICATION** | Brief mentions; no artefact |
| Desktop | Electron | Comfortable | Trace, Study Flow desktop |
| | .NET / Windows APIs (named pipes, tray, session events) | Comfortable | Trace |
| DevOps / tools | Git/GitHub | Strong | 78 repos |
| | Vercel | Strong | Many deployments |
| | Docker | Learning | fire_backend Dockerfile |
| | cPanel/Apache deployment | Comfortable | zibrahcode HANDOFF |
| | Linux | **NEEDS VERIFICATION** | |
| Design | UI/UX, Figma | **NEEDS VERIFICATION** | README icon; the portfolio brief itself demonstrates design literacy |
| | Blender, Photoshop, Premiere | **NEEDS VERIFICATION** | README icons only |

## Education

| Item | Value | Source |
|------|-------|--------|
| Institution | NGA Coding Academy, Rwanda | brief |
| Programme | **TODO — NEEDS USER INPUT** (name of programme/track) | |
| Year 1 | **TODO** — what was covered (repos from Jan–Mar 2026 suggest HTML/CSS/JS fundamentals, PHP, CRUD apps, school systems) | inferred from repo timeline; NEEDS VERIFICATION |
| Year 2 | Current | brief |
| Start date | GitHub account created 2025-10-14; first repos Jan 2026 | gh-profile — actual enrolment date **NEEDS USER INPUT** |
| Notable coursework artefacts | NGA-MIS / NGA-MIS-V2 (school MIS), New-generation-academic-system, Javascript-book-express-API-exam, WEB-UI-exam, C-programming-Ubudehe-program | repos |

## Leadership

| Item | Value | Source |
|------|-------|--------|
| Class leadership | "Class leadership and student collaboration at NGA Coding Academy" | gh-readme |
| Specific role/title | **TODO — NEEDS USER INPUT** (e.g. class representative? since when?) | |
| Team projects | Space-robot uses "we" — team; Fire-extinguisher system exists in two stacks (Blade + TS) suggesting group work | repos; **NEEDS VERIFICATION** on team composition |

## Aviation

| Item | Value | Source |
|------|-------|--------|
| Goal | Commercial aviation as primary long-term career; software as serious secondary path | brief |
| Interests | "Aircraft systems, flight operations, navigation and aviation technology"; "UAS · Flight Systems" | gh-readme |
| Any training, simulator hours, certificates, clubs | **TODO — NEEDS USER INPUT** (publish only what is real) | |

Presentation rule: one paragraph on About, one metadata line in the opening. See content-strategy.

## Client and collaborative work (verified from repos, permissions unknown)

| Work | What | Status | Publish? |
|------|------|--------|----------|
| Zibrah Code (zibrahcode) | Website for an author ("Ibrahim"): book, framework, blog, podcast, events, admin, spam guard, migrations; deployed to cPanel; active Sept 2026 | Live (URL **NEEDS USER INPUT**) | **NEEDS CLIENT PERMISSION** |
| SoW!se Africa | Official website for an NGO empowering African youth (PHP, GSAP) | Repo public | **NEEDS CLIENT PERMISSION** + live URL |
| Forge | AI "board of directors" deliberation product built with/for "the founder" | In development | **NEEDS PERMISSION / may be confidential** |
| Journey | Personal interactive birthday experience for a named person | Live | **Personal — recommend NOT publishing, or only as an anonymised experiment** |

## Other (competitions, pitches, research, community)

**TODO — NEEDS USER INPUT.** No verifiable artefacts found. Do not publish anything here until supplied.

## Hobbies (from current site)

Basketball, gaming, exercising, swimming, running `[site]`. Optional one line on About. **Levi decides whether to keep.**

## Things the current site claims that will NOT carry over

- "5 years+ of raw code" — unverifiable; contradicts a Year 2 timeline.
- "Over 20+ ongoing projects" — vanity number.
- "High end professionalism" — empty claim.
- Phone number — privacy.
- Placeholder social links to instagram.com / linkedin.com roots.
- "Build for fun not for money." — **Levi may keep as a personal line if he wants; flagged as a decision.**
