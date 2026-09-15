# Goals and Non-Goals

## Goals (V1)

| Goal | Why it matters | How we know it's met |
|------|----------------|----------------------|
| Editorial, art-directed public site | Differentiation; communicates design sense as well as engineering | Passes the anti-checklist review in [design-direction.md](../design/design-direction.md) |
| Real projects as case studies | Proof of work is the whole point | Every featured project has a filled case study with real images |
| Private CMS for projects, technologies, and site copy | Levi must not edit code to publish | Add-a-project workflow completes without a deploy |
| Image upload from the admin | Screenshots are the core media | Cover + gallery upload works with validation |
| Manual ordering and featuring | Curation is editorial control | Admin reorder changes homepage order after revalidation |
| Responsive, designed at every breakpoint | Most first visits are on a phone | Per-breakpoint spec in [responsive-design.md](../design/responsive-design.md) is met |
| Accessible (WCAG 2.2 AA) | Requirement, not polish | axe clean, keyboard walkthrough passes, reduced-motion honoured |
| Fast | Performance is UX and SEO | Budgets in [performance.md](../architecture/performance.md) |
| Deployed on a real domain with SEO basics | Discoverability | Sitemap, OG images, metadata per page |

## Non-goals (V1)

These are deliberately excluded. Reintroducing any of them requires a new entry in [DECISIONS.md](../DECISIONS.md).

| Non-goal | Reason |
|----------|--------|
| Blog / articles | No verified content to seed it; an empty blog damages credibility. Revisit in V2 if Levi is writing regularly. |
| Contact form | Adds spam handling, an email provider, and a persistence path for no benefit over `mailto:` + LinkedIn at this scale. |
| Comments, likes, view counters | Vanity signals unrelated to proof of work. |
| Light/dark theme toggle | The art direction is a dark editorial canvas. A toggle doubles the design surface and dilutes identity. One inverted "paper" section is used deliberately instead. |
| Multi-user CMS, roles, approval workflows | One author. A single admin account is the correct scale. |
| Rich block editor (Notion-style) | Heavy dependency and complex data model. Markdown + structured fields is enough and portable. |
| Separate media library page | Media belongs to projects and is managed inline. A library only becomes necessary when media is reused across projects. |
| Video hosting | Large files, transcoding, cost. V1 supports a video *URL* on a project (YouTube etc.), not uploads. |
| Timeline / CV page | A résumé dumped on a website is what we are avoiding. Education and leadership live inside About as prose. |
| 3D / WebGL scenes | Spectacle over work; heavy; hurts Core Web Vitals. |
| Localisation | Single language (English). |
| Custom analytics dashboards | Cookieless Vercel Web Analytics only — see DECISIONS. |
| Public phone number | Privacy. The current site publishes one; the new site will not. |
| Fake anything | Absolute rule. |

## Explicitly deferred to V2 (candidates)

Kept in [TODO.md](../TODO.md) under *Future ideas*. Nothing there may block V1.
