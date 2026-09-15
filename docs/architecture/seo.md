# SEO

Goal: when someone searches "Levi Gatimu" they find this site first, with a correct title, description and preview image; project pages are indexable with accurate metadata; social shares look intentional. No keyword stuffing, no spammy copy.

## Metadata per route

| Route | `<title>` | Description | Canonical |
|-------|-----------|-------------|-----------|
| `/` | `Levi Gatimu — Student developer · Full-stack, AI & robotics` | The opening statement + location (≤ 155 chars), from `site_settings` | `https://<domain>/` |
| `/work` | `Work — Levi Gatimu` | "Selected software, AI and robotics projects by Levi Gatimu, student developer in Kigali." | `/work` |
| `/work/[slug]` | `{name} — Levi Gatimu` | `one_liner` (or `summary` truncated to 155) | `/work/{slug}` |
| `/about` | `About — Levi Gatimu` | First sentence(s) of `bio_short` | `/about` |
| `/admin/*`, previews | — | — | `noindex, nofollow` via `robots` metadata |

Implemented with the App Router `metadata` / `generateMetadata` APIs; `metadataBase` = `NEXT_PUBLIC_SITE_URL` (the production `*.vercel.app` URL in V1 — D23). Titles use an em dash, not a pipe.

## Open Graph and Twitter/X

- `og:type` `website` (home, work, about) / `article` (case study, with `article:published_time` from `published_at`, `article:modified_time` from `updated_at`).
- `og:image` 1200×630, generated with `ImageResponse`:
  - **Default** (`/opengraph-image`): dark canvas, name in the display face, metadata line in mono, accent index mark. Text only — fonts loaded from the same font files.
  - **Project** (`/work/[slug]/opengraph-image`): project name large, one-liner, mono stack line, and the cover image cropped at right (fetched from storage at generation time). Generated per slug and cached with the page.
- `twitter:card` `summary_large_image`; no Twitter handle (none verified).
- `og:site_name` "Levi Gatimu".

## Sitemap and robots

- `app/sitemap.ts`: `/`, `/work`, `/about`, and every published `/work/[slug]` with `lastModified` from `updated_at`; `changeFrequency` omitted (ignored by Google); `priority` omitted.
- `app/robots.ts`: allow all; `Disallow: /admin`; sitemap URL. Preview deployments additionally send `X-Robots-Tag: noindex`.

## Structured data (JSON-LD)

- Home and About: `Person` — `name`, `url`, `jobTitle: "Student developer"`, `affiliation: { "@type": "EducationalOrganization", name: "NGA Coding Academy" }`, `address: { addressLocality: "Kigali", addressCountry: "RW" }`, `sameAs: [github, linkedin]`, `image` (portrait URL). Only fields that are true.
- Case study: `CreativeWork` (or `SoftwareSourceCode` when a public repo exists) — `name`, `description`, `url`, `image`, `author: Person`, `dateCreated` (year), `codeRepository` (public repo), `programmingLanguage` (from technologies of group `language`).
- Emitted via a `<script type="application/ld+json">` with escaped JSON.

## On-page

- One `h1`; headings mirror the case-study section names — they *are* the semantic outline.
- Image `alt` from the admin (required).
- Internal linking: home → work → case studies → next project; about ↔ home; footer links on every page.
- Descriptive link text ("Read the case study: Trace").
- `lang="en"`; page titles unique; no duplicate content (drafts and previews are noindex).

## What we are not doing

- No keyword-targeting copy ("best developer in Rwanda"). The audience is people who already know the name.
- No blog for SEO's sake.
- No third-party SEO plugins; the App Router metadata API covers everything.
- No Google Analytics; Search Console is optional and free (verification via DNS TXT, not a meta tag, to keep `<head>` clean).

## Verification

- `curl -s <url> | grep -E "og:|twitter:|canonical|application/ld\+json"` on each route type.
- Validate OG rendering with a share-preview tool (opengraph.xyz or LinkedIn Post Inspector) before launch.
- Rich Results Test on `/` and one case study.
- Lighthouse SEO = 100.
