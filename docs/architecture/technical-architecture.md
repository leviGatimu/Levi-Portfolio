# Technical Architecture

## Summary

```
Browser ──► Vercel (Next.js App Router, React Server Components)
                 │
                 ├─ public pages: server-rendered, cached (ISR), revalidated on publish
                 ├─ /admin: server-rendered, auth-gated by proxy/middleware + server checks
                 │
                 └──► Supabase (one project)
                        ├─ Postgres (projects, technologies, images, settings) + RLS
                        ├─ Auth (one admin user, email + password)
                        └─ Storage (public bucket `media`)
```

One hosting provider, one backend provider, one repository. No custom server, no queues, no cron, no third-party CMS.

## Stack and justification

| Layer | Choice | Why | Alternatives considered | Complexity verdict |
|-------|--------|-----|-------------------------|--------------------|
| Framework | **Next.js (App Router, latest stable at init)** + React + TypeScript | Server components give zero-JS public pages by default; `next/image` and `next/font` solve the two biggest performance problems (images, fonts); ISR + tag revalidation makes a DB-backed site static-fast; Vercel deploy is zero-config. Levi already ships Next.js 14–16 apps (Study Flow, Wixy, Forge). | Astro (excellent for content sites, but the admin would need a separate island framework or API; two mental models), SvelteKit (Levi has no experience), Remix (fine, but weaker image/font story on Vercel) | Justified. Familiar to the maintainer. |
| Styling | **Tailwind CSS v4** with tokens in `@theme` | Design tokens as CSS variables, utility classes for layout, tiny CSS output. Levi uses it everywhere. | CSS Modules (fine, more files), vanilla-extract (build complexity) | Justified. |
| Animation | **None (CSS only)** for V1 | Motion catalogue is small and CSS-expressible; avoids ~30 KB JS on every page. | `motion` (Framer Motion) — the brief's default; deferred to V2 if layout animations appear | Removed deliberately. |
| Icons | **Lucide** (admin only) | Tree-shakeable, consistent. Public site uses text glyphs. | Heroicons, Radix icons | Minimal. |
| Markdown | `react-markdown` + `remark-gfm` | Small, sanitised by default (no raw HTML), renders in server components | MDX (compile step, overkill for DB content), `marked` + sanitizer (two deps) | Justified. |
| Validation | `zod` | One schema per form, shared by server action and client hints; typed inserts | valibot (smaller, fine — either works) | Justified. |
| Image metadata | `sharp` (server, upload path only) | Read width/height at upload for `next/image`; Vercel ships it | Client-side `Image` decode (unreliable for large files) | Justified. |
| Database | **Supabase Postgres** | Relational data with real constraints; RLS gives a defence-in-depth boundary; generous free tier; Levi already uses it in three projects. | Neon (excellent Postgres, but then auth + storage need separate services), PlanetScale (MySQL, no free tier), SQLite/Turso (no built-in storage/auth), a headless CMS like Sanity/Payload (adds a vendor and a second data model; Payload would need a Node server) | Justified — one provider covers DB + auth + storage. |
| Auth | **Supabase Auth** (email + password, single user, sign-ups disabled) | Built in; sessions via `@supabase/ssr` cookies; no extra vendor. | Auth.js (extra dependency, needs a provider anyway), Clerk (vendor, overkill), a hand-rolled password check (never) | Justified. |
| Storage | **Supabase Storage** (public bucket) | Same project; public CDN URLs; RLS-style policies on objects. | Vercel Blob (fine, second vendor for uploads), Cloudinary (transforms we don't need — `next/image` does them), S3 (setup weight) | Justified. |
| Hosting | **Vercel** | First-party Next.js; previews per PR; image optimisation; analytics. | Netlify, Cloudflare Pages (Next.js support is second-class) | Justified. |
| Source | **GitHub** (private repo recommended) | Existing account; Vercel integration. | — | — |
| Testing | Vitest (units), Playwright + axe (e2e/a11y) | See testing-strategy | — | Keep small. |

Total production dependencies (target): `next`, `react`, `react-dom`, `@supabase/supabase-js`, `@supabase/ssr`, `react-markdown`, `remark-gfm`, `zod`, `sharp`, `lucide-react`, `@vercel/analytics`. **Eleven.** Anything beyond this needs a DECISIONS entry.

## Rendering and data flow

### Public pages

- All public routes are **server components** that read from Supabase with the **anon key** (RLS restricts to published rows). No client fetching.
- Caching: route segments use `export const revalidate = 3600` *and* data reads are tagged (`unstable_cache` / `cacheTag('projects')` per the Next.js version in use). Publishing from the admin calls `revalidateTag('projects')` and `revalidatePath` for affected routes, so changes appear within seconds while pages otherwise serve from cache.
- Only client components: `MobileMenu`, `Reveal`, `LocalTime`. Everything else ships no JS.
- Images: `next/image` with `remotePatterns` for the Supabase Storage host; `sizes` per image role; AVIF/WebP negotiated by Vercel.

### Admin

- `/admin/*` server components read with the **user's session** (RLS permits the admin user full access). No service-role key is used anywhere in the app runtime — **the service role key is never set in Vercel**.
- Mutations are **server actions** (`'use server'`) that: verify the session and admin identity, validate with zod, write via Supabase, then revalidate tags. No public API routes for writes.
- Uploads: the browser posts the file to a server action / route handler which validates type/size, reads dimensions with `sharp`, uploads to Storage with the user's session, and inserts the `project_images` row. (Direct-to-storage signed uploads are a V2 optimisation if files grow.)

### Auth boundary

- Next.js `proxy.ts` (formerly `middleware.ts`; use whichever the installed version names) refreshes the Supabase session cookie and redirects unauthenticated requests under `/admin` (except `/admin/login`) to the login page.
- Every admin server component and action *also* checks `getUser()` and admin membership — middleware is convenience, not the security boundary. RLS is the last line.

## Folder structure

```
app/
  (public)/
    layout.tsx              masthead + footer
    page.tsx                home
    work/page.tsx
    work/[slug]/page.tsx
    work/[slug]/opengraph-image.tsx
    about/page.tsx
    opengraph-image.tsx
    sitemap.ts
    robots.ts
  admin/
    layout.tsx              AdminShell, auth check
    login/page.tsx
    page.tsx                redirect → projects
    projects/page.tsx
    projects/new/page.tsx
    projects/[id]/page.tsx
    technologies/page.tsx
    site/page.tsx
  globals.css               tokens (@theme), base, reduced-motion block, print
components/
  public/                   Masthead, Footer, ProjectPlate, … (see design-system)
  admin/                    AdminShell, Field, ImageUpload, …
  shared/                   Prose, Meta, Rule
lib/
  supabase/                 server.ts, client.ts, proxy.ts helpers (from @supabase/ssr)
  db/                       typed queries: projects.ts, technologies.ts, settings.ts
  actions/                  server actions: projects.ts, images.ts, technologies.ts, settings.ts, auth.ts
  validation/               zod schemas
  markdown/                 Prose renderer config
  seo/                      metadata helpers
  utils/                    slugify, dates, cn
types/
  database.ts               generated by `supabase gen types`
supabase/
  migrations/               SQL migrations (source of truth for schema)
  seed.sql                  technologies seed only (no fake projects)
docs/                       this documentation
public/                     favicon, static OG fallback
tests/
  e2e/                      Playwright
  unit/                     Vitest
```

Rules: no `pages/` directory; no API routes for public data; one query function per read shape in `lib/db`; components never import Supabase directly.

## Environment variables

| Name | Where | Exposed to browser? |
|------|-------|---------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + local | yes (by design) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or publishable key) | Vercel + local | yes (by design; RLS protects data) |
| `NEXT_PUBLIC_SITE_URL` | Vercel + local | yes (canonical URLs, OG) |
| `ADMIN_EMAIL` | Vercel + local | no — used at bootstrap to seed the `admins` row; runtime checks use the DB |
| Service role key | **nowhere in the app**; used only by the developer locally for migrations/seeding | no |

## Local development

- Node 20+, `npm`.
- Supabase: use the hosted project with a **separate development branch/project** for schema work (see deployment doc), or the Supabase CLI local stack (`supabase start`) — recommended for migration authoring.
- `npm run dev`, `npm run typecheck`, `npm run lint`, `npm run test`, `npm run e2e`.

## What is intentionally absent

- No ORM (Prisma/Drizzle). Supabase's typed client with generated types is enough for ~5 tables; migrations are plain SQL.
- No state library. No global client state exists.
- No i18n framework.
- No component library (shadcn etc.) — see DECISIONS; admin components are hand-written with tokens.
- No feature flags, no A/B, no CDN config beyond Vercel defaults.
