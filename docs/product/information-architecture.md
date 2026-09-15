# Information Architecture

## Evaluation of candidate pages

| Candidate | Verdict | Reason |
|-----------|---------|--------|
| `/` | **Keep** | The art-directed front page. Carries identity, featured work, index, experiments, short about, contact. |
| `/work` | **Keep** | Levi has far more projects than the homepage should show. An index page with type filtering is the honest home for the long tail. |
| `/work/[slug]` | **Keep** | The case study. This is where "I want to see how he built it" is answered. |
| `/about` | **Keep** | Full story, education, leadership, aviation, skills with honesty levels. Too much for the homepage. |
| `/experiments` | **Reject for V1** | Experiments are a *type* of project, not a different entity. They get a homepage strip and a filter on `/work`. A separate page adds a route, a nav item, and maintenance for content that is currently 2–3 items. Revisit when there are ≥ 6 experiments. |
| `/now` | **Reject for V1** | A single "now" paragraph lives on About (and is echoed on the homepage). A dedicated page for one paragraph is a page for the sake of a page. |
| `/contact` | **Reject** | Contact is an email address and two links. It lives in the homepage closing section and the footer of every page. |
| `/blog` | **Reject for V1** | No content. See goals-and-non-goals. |
| `/admin/*` | **Keep (private)** | See [admin/cms-overview.md](../admin/cms-overview.md). |

## Final public routes

```
/                      Home
/work                  Work index (all published projects; ?type=experiment filter)
/work/[slug]           Project case study
/about                 About
/sitemap.xml           generated
/robots.txt            generated
/opengraph-image       generated default OG image
/work/[slug]/opengraph-image   generated per-project OG image
```

## Final private routes

```
/admin/login
/admin                          → redirects to /admin/projects
/admin/projects                 list, search, filter, reorder
/admin/projects/new
/admin/projects/[id]            edit (all tabs of one project)
/admin/technologies             manage the technology list
/admin/site                     site-wide content: bio, now, links, portrait, opening statement
```

## Navigation

### Desktop masthead

A single thin row, hairline rule beneath it. Left: name mark. Centre-right: three links. Far right: GitHub.

```
LEVI GATIMU                                   Work   About   Contact      GitHub ↗
──────────────────────────────────────────────────────────────────────────────────
```

- "Contact" is an anchor to the closing section on the homepage (`/#contact`); from other pages it links to `/#contact`.
- Active page indicated by a small mono index or a short underline — not a pill, not a background.
- The masthead is `position: sticky` with a solid background; no blur/glass effect.

### Mobile masthead

Name mark left; a single text button "Menu" right (mono, uppercase). Opening it reveals a full-screen list: Work, About, Contact, GitHub, LinkedIn, Email — large type, one per line, with the same hairline rules. No hamburger icon; the word is clearer and on-brand. Closing: "Close" in the same position, and Escape.

### Footer (every public page)

Three columns on desktop, stacked on mobile:

```
LEVI GATIMU                     Work            getmorelev@gmail.com
Student developer · Kigali      About           GitHub ↗
                                                LinkedIn ↗
──────────────────────────────────────────────────────────────────────────
© 2026 · Last updated 14 Sep 2026 · Built with Next.js & Supabase
```

"Last updated" is derived from the newest `projects.updated_at` / `site_settings.updated_at`. It is a truthful liveness signal. "Built with" is a factual statement, not a badge wall.

## Homepage section order

| # | Section | Purpose | Data |
|---|---------|---------|------|
| 0 | Masthead | Orientation | static + settings |
| 1 | **Opening** | Identity in two seconds: name, metadata line, statement, portrait | `site_settings` |
| 2 | **Selected Work** | Proof: 3–5 featured projects as large plates | `projects` where `is_featured` |
| 3 | **Index** | Breadth without noise: a dense mono ledger of all other published projects | `projects` where published, not featured |
| 4 | **Experiments & Hardware** | Range: robotics, simulation, prototypes | `projects` where `type = experiment` |
| 5 | **About (short)** | Person: ≤ 80-word bio on an inverted paper section, "now" line, link to /about | `site_settings` |
| 6 | **Contact** | Close: email as the largest element, two links, local time | `site_settings` |
| 7 | Footer | | |

Detailed composition of each section is in [design/layout-and-grid.md](../design/layout-and-grid.md); responsive behaviour in [design/responsive-design.md](../design/responsive-design.md).

## `/work` structure

1. Page header: mono index "WORK", h1 "All work", one line: count of projects and year range (derived, truthful).
2. Filter row: `All · Projects · Experiments · Client work` as text links (URL query `?type=`), not tabs with pills.
3. List: an editorial list — each row is a large type name + one-liner + mono metadata (type, year, stack) with the cover image revealed at right on hover/focus (desktop) or shown small above the text (mobile). Rows are separated by hairlines. No cards.
4. Archived projects are shown last under a hairline heading "Archive" with reduced emphasis, only if `is_published` (archive is a status, not a hiding mechanism).

## `/work/[slug]` structure

See [content/project-content-model.md](../content/project-content-model.md) for the section list and which are optional. Skeleton:

1. Header: mono index (`02 / 07`), type, year, status; project name as the largest element; one-liner; a metadata block (Role, Team, Timeline, Stack, Links).
2. Hero image: cover image full container width, crossing into the margin on wide screens.
3. Overview (required), then optional narrative sections in fixed order.
4. Gallery: images with captions, placed within or after the narrative.
5. Links repeated at the end.
6. Next project: name + cover of the next published project in `sort_order`.

## `/about` structure

1. Header: mono index, h1 (e.g. "About"), portrait alternate crop offset into the right margin.
2. Bio (long, markdown).
3. Education — NGA Coding Academy, Year 1 → Year 2, as prose with a short mono-labelled fact list (Programme, Year, Location).
4. Leadership and collaboration — prose.
5. Aviation — one section, prose. Placed after software, not before.
6. Skills — grouped list with honesty levels.
7. Now — one paragraph, dated (`site_settings.now_updated_at`).
8. Contact — same closing block as the homepage.

## URL and slug rules

- Slugs are lowercase kebab-case, generated from the project name in the admin, editable, unique, immutable after first publish (changing a published slug requires an explicit "change slug" action that records the old slug for a redirect — V2; in V1 the admin simply warns).
- No trailing slashes. Canonical URLs are absolute, on the production `*.vercel.app` URL (D23).
