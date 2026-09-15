# Routing, Caching and Revalidation

## Route table

| Route | Kind | Rendering | Cache | Auth |
|-------|------|-----------|-------|------|
| `/` | page | RSC | ISR, tag `projects` + `settings` | public |
| `/work` | page | RSC | ISR, tag `projects` | public |
| `/work/[slug]` | page | RSC, `generateStaticParams` from published slugs | ISR per slug, tag `projects`; unknown slug → `notFound()` | public |
| `/work/[slug]/opengraph-image` | image route | edge/node `ImageResponse` | same as page | public |
| `/about` | page | RSC | ISR, tag `settings` + `technologies` | public |
| `/opengraph-image` | image route | | tag `settings` | public |
| `/sitemap.xml` | `sitemap.ts` | | tag `projects` | public |
| `/robots.txt` | `robots.ts` | static | | public |
| `/admin/login` | page | RSC + server action | dynamic, no cache | public (noindex) |
| `/admin` | redirect → `/admin/projects` | | | admin |
| `/admin/projects` | page | RSC, `dynamic = 'force-dynamic'` | none | admin |
| `/admin/projects/new` | page | RSC | none | admin |
| `/admin/projects/[id]` | page | RSC | none | admin |
| `/admin/technologies` | page | RSC | none | admin |
| `/admin/site` | page | RSC | none | admin |
| `/admin/preview/[id]` | page | RSC renders the case study **from the draft row** using the admin session | none, `noindex` | admin |

No API routes for reads. One route handler only if needed for large uploads (see storage doc); otherwise server actions.

## Caching strategy

- Public data functions in `lib/db` are wrapped so they participate in the Next.js data cache with tags: `projects`, `settings`, `technologies`. Route segments declare `revalidate = 3600` as a safety net.
- **Publish/unpublish/reorder/edit** server actions call `revalidateTag('projects')` (and `revalidatePath('/work/[slug]', 'page')` for the slug in question). **Site settings** actions call `revalidateTag('settings')`. **Technologies** actions call `revalidateTag('technologies')` and `revalidateTag('projects')` (names appear in stacks).
- Result: public pages are served from cache (fast, cheap), and an admin change is visible within a few seconds without a deploy.

## Redirects and errors

- `not-found.tsx` at root: editorial 404 ("Nothing here. → Work / → Home") in the same design language; no illustration.
- `error.tsx` at root and admin: plain message, "Try again" action; errors logged (see deployment).
- Trailing slashes off (`trailingSlash: false`); `www` → apex redirect configured at Vercel domain level.
- Old portfolio URLs (`portfolioz-blue.vercel.app`) are on a different project; no redirects needed. If the old Vercel project is kept, set it to redirect to the new domain (Vercel project settings) — a one-line decision at launch.
- Slug change on a published project (rare): V1 admin warns that old links break; no redirect table. Recorded as a future idea.

## `generateStaticParams`

Published slugs are pre-rendered at build; new projects published later are rendered on first request (`dynamicParams = true`) and cached. Unpublished slugs 404 for the public because the anon query only returns published rows.

## Preview

`/admin/preview/[id]` renders the same `CaseStudy` component as `/work/[slug]` but from the admin query (drafts visible). It carries a fixed "Preview — draft" bar at the top. This gives a true preview with zero duplicate templates.
