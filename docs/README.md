# Portfolio Documentation

Planning and source-of-truth documentation for **Levi Gatimu's personal portfolio** — a dynamic, editorial developer portfolio with a private CMS.

Nothing in this repository is implementation yet. These documents were produced in the planning phase (2026-09-15) and are the contract that implementation must follow. If code later disagrees with a document, **raise the conflict** — do not silently change either side.

## Reading order

| # | Read | To learn |
|---|------|----------|
| 1 | [product/product-vision.md](product/product-vision.md) | What we are building and why |
| 2 | [design/design-direction.md](design/design-direction.md) | What it looks and feels like |
| 3 | [product/information-architecture.md](product/information-architecture.md) | Every page and what is on it |
| 4 | [content/project-inventory.md](content/project-inventory.md) | What real work exists to show |
| 5 | [architecture/technical-architecture.md](architecture/technical-architecture.md) | How it is built |
| 6 | [architecture/database-schema.md](architecture/database-schema.md) | What data it stores |
| 7 | [admin/cms-overview.md](admin/cms-overview.md) | How Levi maintains it |
| 8 | [implementation/implementation-plan.md](implementation/implementation-plan.md) | The task list |
| 9 | [TODO.md](TODO.md) | What is still undecided |
| 10 | [DECISIONS.md](DECISIONS.md) | Why decisions were made |

## Source-of-truth hierarchy

When documents conflict, the higher one wins:

```
product/          (what and why)
   ↓
design/           (how it looks, feels, moves)
   ↓
architecture/     (how it is built)
   ↓
content/          (what data and copy exist, content model)
   ↓
admin/            (how it is maintained)
   ↓
implementation/   (task order, conventions, testing)
   ↓
code
```

## Directory map

```
docs/
  README.md                       this file
  DECISIONS.md                    decision log (ADR-style)
  TODO.md                         confirmed / to research / to verify / open decisions / future

  product/
    product-vision.md             the one-paragraph pitch, principles, success criteria
    goals-and-non-goals.md        explicit scope boundaries
    target-audience.md            who visits and what each visitor needs
    content-strategy.md           voice, copy rules, what content exists per page
    information-architecture.md   routes, navigation, section order, footer

  design/
    design-direction.md           art direction extracted from the reference + what NOT to copy
    design-system.md              tokens overview, component inventory
    typography.md                 families, scale, weights, responsive rules
    color.md                      palette, tokens, contrast, inverted section
    layout-and-grid.md            grid, spacing, section rhythm, image rules
    motion.md                     motion principles, catalogue, reduced-motion
    responsive-design.md          per-breakpoint behaviour of every section
    accessibility.md              requirements and acceptance checks

  content/
    personal-profile.md           verified identity, skills, education, leadership, aviation
    project-inventory.md          every project found, verified facts, classification
    project-content-model.md      case-study structure, required/optional sections
    content-status.md             what copy/media exists vs is missing

  architecture/
    technical-architecture.md     stack, rendering, data flow, folder structure
    database-schema.md            tables, columns, RLS, indexes, migrations
    storage-architecture.md       buckets, paths, upload pipeline, deletion
    authentication.md             admin login, authorization, session, middleware
    routing.md                    public + admin routes, caching/revalidation
    deployment.md                 GitHub → Vercel, env vars, previews, domain, backups
    security.md                   checklist and threat model
    performance.md                budgets and strategy
    seo.md                        metadata, OG, sitemap, structured data

  admin/
    cms-overview.md               what the admin is and is not
    admin-ux.md                   screens, states, navigation
    project-management.md         the add-a-project workflow, field by field
    media-management.md           uploads, cover/gallery, deletion

  research/
    design-references.md          reference-by-reference analysis
    portfolio-research.md         patterns across portfolio categories
    inspiration-analysis.md       what makes this portfolio distinctive

  implementation/
    implementation-plan.md        ordered task list
    milestones.md                 phases with definitions of done
    coding-conventions.md         TypeScript, React, Tailwind, naming, folders
    testing-strategy.md           what gets tested and how
```

## Absolute rules (repeated because they matter)

1. **No fake content.** No invented stats, clients, testimonials, outcomes, repos, or URLs. Missing information is written as `TODO — NEEDS USER INPUT`.
2. **The work is the star.** Every design element must justify itself against "does this make the projects clearer?".
3. **Do not copy the reference.** Extract its principles; never its layout, copy, portrait treatment, or branding.
4. **Simple enough for Levi to maintain alone.** Every dependency and table must earn its place.
