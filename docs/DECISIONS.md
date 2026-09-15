# Decision Log

Format: **Decision · Reason · Alternatives · Consequences · Date · Status.** Newest at the bottom. A decision is changed by adding a new entry that supersedes it, never by editing history.

---

### D01 — Rebuild from scratch; nothing from the current site is preserved

- **Reason:** The current site's direction is rejected by Levi; its content contains unverifiable claims (years of experience, project counts, inflated project descriptions) and a public phone number.
- **Alternatives:** Restyle the existing Next.js app.
- **Consequences:** Greenfield repository; content re-written from verified sources.
- **Date:** 2026-09-15 · **Status:** Accepted

### D02 — Dark warm-charcoal canvas, dark-only, with one inverted paper section

- **Reason:** The reference is a dark charcoal editorial layout and the brief asks to lean heavily on it. The brief's suggested off-white/near-black palette is honoured by making off-white the type colour and the paper section; a light/dark toggle would double the design surface and dilute identity.
- **Alternatives:** Light off-white canvas with dark sections; theme toggle.
- **Consequences:** Screenshots of light UIs need an inset hairline; one paper section gives the light moment.
- **Date:** 2026-09-15 · **Status:** Accepted (Levi may veto during Phase 2 review)

### D03 — Typography: Bricolage Grotesque (display + body) + Geist Mono (metadata)

- **Reason:** One variable family with an optical-size axis covers 176px display and 16px body with real character; mono reserved for the instrument-readout metadata language; neither is the reference's font nor the Next.js default.
- **Alternatives:** All-mono like the reference (tiring body, "terminal" cliché); Archivo (kept as fallback plan); Inter/Geist Sans (template feel).
- **Consequences:** Validate the name rendering in Phase 2 (T2.09) before locking; possible switch to Archivo recorded here if it happens.
- **Date:** 2026-09-15 · **Status:** Proposed — lock at T2.10

### D04 — One accent; International Orange recommended, Levi decides

- **Reason:** The reference uses a single accent at ~1% coverage; International Orange has a real aerospace lineage (the one quiet aviation reference) and is rare on developer sites. Signal Amber is the alternative.
- **Alternatives:** Mint (the reference's), electric blue, lime.
- **Consequences:** Token `--color-accent` with a separate `accent-text` tint for AA contrast and an `accent-on-paper` variant.
- **Date:** 2026-09-15 · **Status:** Open — Levi's decision (TODO)

### D05 — Public routes: `/`, `/work`, `/work/[slug]`, `/about` only

- **Reason:** `/experiments` is a project type (filter), `/now` is one paragraph (on About), `/contact` is an email and two links (home + footer), `/blog` has no content.
- **Alternatives:** The six-page structure in the brief.
- **Consequences:** Simpler nav (Work · About · Contact); fewer empty pages; revisit `/experiments` at ≥ 6 experiments.
- **Date:** 2026-09-15 · **Status:** Accepted

### D06 — Next.js App Router + TypeScript + Tailwind v4 on Vercel

- **Reason:** Server components for a zero-JS public site; `next/image`/`next/font`; ISR with tag revalidation; Levi already ships Next.js apps.
- **Alternatives:** Astro (admin would need a second framework), SvelteKit/Remix (unfamiliar or weaker on Vercel).
- **Consequences:** Eleven production dependencies; no ORM; SQL migrations.
- **Date:** 2026-09-15 · **Status:** Accepted

### D07 — Supabase for Postgres + Auth + Storage (one provider)

- **Reason:** Relational data with RLS as a real security boundary; auth and storage in the same project; free tier sufficient; Levi already uses it.
- **Alternatives:** Neon (Postgres only → separate auth/storage), headless CMS (Sanity/Payload — second data model and vendor), SQLite/Turso.
- **Consequences:** Service-role key never deployed; RLS tests mandatory; free-tier backups handled by a weekly export.
- **Date:** 2026-09-15 · **Status:** Accepted

### D08 — No animation library in V1; CSS motion only

- **Reason:** The motion catalogue (10 items) is fully expressible in CSS + one tiny IntersectionObserver component; saves ~30 KB JS on every page; simpler reduced-motion handling.
- **Alternatives:** `motion` (Framer Motion) as the brief suggested.
- **Consequences:** No layout animations or shared-element transitions; add `motion` only via a new decision if a V2 feature needs it.
- **Date:** 2026-09-15 · **Status:** Accepted

### D09 — Case study = structured summary fields + one Markdown body

- **Reason:** Lists and headers need fields; narrative needs prose; Levi already writes strong Markdown READMEs; portable and diff-able; no heavy editor.
- **Alternatives:** Block editor (Tiptap/Editor.js), all-Markdown with front matter, fully structured sections table.
- **Consequences:** `react-markdown` with `skipHtml`; a heading template in the admin; inline gallery images via copied Markdown.
- **Date:** 2026-09-15 · **Status:** Accepted

### D10 — Schema: 5 tables + 1 join table; collaborators and links as JSONB; no experiments/timeline/about tables

- **Reason:** Collaborators and links are display-only arrays; experiments are a project type; timeline has no page; site copy fits one settings row. Every extra table is an admin screen.
- **Alternatives:** Fully normalised model from the brief.
- **Consequences:** JSON shapes validated by zod; "all projects with collaborator X" is not a query (not needed).
- **Date:** 2026-09-15 · **Status:** Accepted

### D11 — One global `sort_order`; featured = filtered global order

- **Reason:** One ordering to reason about in the admin and on every page; no drift between homepage and /work.
- **Alternatives:** Separate `featured_order`; drag-and-drop with fractional indexes.
- **Consequences:** Up/down buttons (keyboard-accessible); gaps of 10; renumber utility.
- **Date:** 2026-09-15 · **Status:** Accepted

### D12 — Admin sections: Projects · Technologies · Site (no dashboard, no media library)

- **Reason:** The projects list is the overview; media belongs to projects; site-wide copy is one page.
- **Alternatives:** The nine-section admin in the brief.
- **Consequences:** Fewer screens to build and maintain; orphan cleanup lives on Site.
- **Date:** 2026-09-15 · **Status:** Accepted

### D13 — Supabase Auth email + password, single user, `admins` allow-list

- **Reason:** Simplest secure option for one person; no email deliverability dependency per login; no public OAuth affordance.
- **Alternatives:** Magic link; GitHub OAuth; Auth.js; Clerk.
- **Consequences:** Password in a manager; MFA as a V2 candidate.
- **Date:** 2026-09-15 · **Status:** Accepted

### D14 — Public storage bucket, originals stored, `next/image` delivers

- **Reason:** Media is public by nature; storing originals keeps quality; Vercel's optimiser handles formats/sizes and caching.
- **Alternatives:** Private bucket + signed URLs; resizing at upload; Cloudinary.
- **Consequences:** Draft images technically reachable by UUID URL (accepted); EXIF stripped at upload.
- **Date:** 2026-09-15 · **Status:** Accepted

### D15 — No contact form; no comments; no view counters

- **Reason:** `mailto:` + LinkedIn suffice; forms bring spam handling and an email vendor; counters are vanity.
- **Alternatives:** Form via Resend/Formspree.
- **Consequences:** Email address is public text (accepted; obfuscation harms accessibility).
- **Date:** 2026-09-15 · **Status:** Accepted

### D16 — Analytics: Vercel Web Analytics (cookieless) only

- **Reason:** Useful to know whether anyone visits and from where, at zero privacy cost and no banner; anything more is unjustified for a portfolio.
- **Alternatives:** None; Plausible/Umami (another vendor/host); Google Analytics (cookies, banner).
- **Consequences:** ~1 KB script; no dashboards built in the admin.
- **Date:** 2026-09-15 · **Status:** Accepted

### D17 — No component library for the admin

- **Reason:** ~15 components, one user; a library adds ~10 dependencies and a second visual language.
- **Alternatives:** shadcn/ui, Radix primitives.
- **Consequences:** Hand-written accessible primitives (Dialog focus trap etc.) must be tested; revisit above ~25 components.
- **Date:** 2026-09-15 · **Status:** Accepted

### D18 — Phone number and age are not published

- **Reason:** Privacy and safety of a young person; "Year 2 student" conveys stage without age.
- **Alternatives:** Keep what the old site had.
- **Consequences:** Contact = email + GitHub + LinkedIn.
- **Date:** 2026-09-15 · **Status:** Accepted

### D19 — Old-site project descriptions are discarded; every description is rewritten from the repository

- **Reason:** Several old descriptions do not match repository contents (e.g. "Flux — state management library" vs a PHP repo). Publishing inflated descriptions would violate the no-fake-content rule and undermine trust.
- **Consequences:** Content phase rewrites from READMEs and Levi's notes.
- **Date:** 2026-09-15 · **Status:** Accepted

### D20 — Portrait strategy: rectangular editorial crop, no circle, no cutout, no filters

- **Reason:** The reference integrates the person as a compositional element; a circle avatar reads as a résumé; a cutout requires a specific photo and reads as the reference. A rectangle crossing the grid and overlapped by the surname is editorial and works with almost any good photo.
- **Alternatives:** Cutout with a backing circle (the reference), circle avatar, no portrait.
- **Consequences:** Two crops (4:5 home, 3:4 about); the photo should have headroom and a calm background; guidance in media-management.
- **Date:** 2026-09-15 · **Status:** Accepted (final composition tuned when the photo arrives)

### D21 — Previews share the production Supabase project

- **Reason:** One author; content is read-mostly; a second project doubles setup. Accepted risk: admin writes from a preview are real.
- **Alternatives:** Separate preview project; Supabase Branching (paid).
- **Consequences:** Schema changes are applied before merging (expand → deploy → contract); revisit if breaking migrations become frequent.
- **Date:** 2026-09-15 · **Status:** Accepted

### D22 — Sentinel Signals / Rwasim naming is unresolved

- **Reason:** The brief names "Sentinel Signals"; the repository is `Rwasim` with a matching description. Which name is public is Levi's call.
- **Consequences:** Slug and name entered at content phase.
- **Date:** 2026-09-15 · **Status:** Open — TODO

### D23 — Free `*.vercel.app` domain; Levi supplies the GitHub repo; keep it simple

- **Reason:** Levi's instruction (2026-09-15): use the normal free Vercel domain, Supabase for the backend, and push to a repository he provides. No custom domain, DNS, or extra services in V1.
- **Alternatives:** Custom domain (`levigatimu.com`, which currently does not resolve).
- **Consequences:** `NEXT_PUBLIC_SITE_URL` is the production `*.vercel.app` URL; Phase 8 drops the DNS/domain tasks; the GitHub README link should point at the Vercel URL. A custom domain can be added later in Vercel with no code change.
- **Date:** 2026-09-15 · **Status:** Accepted
