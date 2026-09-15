# CMS Overview

## What it is

A private area at `/admin` where Levi manages **projects**, the **technology list**, and **site-wide content**. It is a small, calm set of forms — not a dashboard, not a page builder.

## What it is not

- Not a general CMS: it cannot create new page types, sections, or layouts. The public design is code; the admin supplies content that the design renders.
- Not multi-user. One admin.
- Not a media library. Images are managed inside the project they belong to (plus two portrait slots on the Site page).
- Not a WYSIWYG editor. Case studies are Markdown with a live preview.

## Sections (evaluated)

| Candidate (brief) | Verdict | Reason |
|-------------------|---------|--------|
| Dashboard | **Rejected** — `/admin` redirects to Projects | A dashboard with "stats" for a one-person site is decoration. The projects list *is* the overview (it shows draft/published/featured and last edited). |
| Projects | **Keep** | Core. |
| Experiments | **Merged into Projects** (type filter) | Same entity. |
| Technologies | **Keep** | Shared list with proficiency; small CRUD. |
| Collaborators | **Merged into the project editor** (repeating field) | No shared entity. |
| Timeline | **Rejected** | No timeline feature. |
| About | **Merged into Site** | One page holds all site-wide copy. |
| Now | **Merged into Site** | One field. |
| Media | **Rejected as a section**; orphan cleanup lives on Site | Managed inline. |
| Settings | **Renamed "Site"** | Copy + links + portrait + export + storage stats. |

Final admin navigation: **Projects · Technologies · Site** — plus the login page and the project preview.

## The core workflow ("Levi finishes a project tonight")

1. Open `/admin` → Projects list. Click **New project**.
2. Type the **name**; the **slug** fills itself. Choose **type** and **status**, enter **year**. Save → the project exists as a **draft**.
3. **Cover**: drop the screenshot; write the alt text; pick the aspect (16:10 / 4:5).
4. **One-liner** and **summary** (two short fields with character counters).
5. **Role**, **team**, **timeline**; **technologies** (pick from the list; add a new one inline if missing); **links** (Repository, Live…); **repo visibility**.
6. **Case study**: the Markdown field opens pre-filled with the section template (Overview, Problem, Approach, Architecture, Decisions, Challenges, Outcome, Lessons). Delete what doesn't apply, write the rest. Upload **gallery** images on the same page; each one offers "Copy Markdown" to paste into the body.
7. **Preview** (opens `/admin/preview/[id]` in a new tab) — the real page, from the draft.
8. The **Publish** panel lists anything that blocks publishing (missing alt text, body too short, no cover). When the list is empty: **Publish**. Optionally tick **Featured** and use **Move up/down** on the list to position it.
9. The public site updates within seconds (tag revalidation). No deploy.

Target: under 15 minutes for a project whose screenshots and notes are ready.

## Design principles for the admin

- **Draft by default; nothing goes public by accident.** Publishing is an explicit, validated action.
- **The form tells you what's missing** before you hit publish — not after.
- **Same tokens, calmer layout.** Dark canvas, mono labels, conventional forms; no editorial tricks.
- **No destructive action without a named confirmation** ("Delete *Trace* and its 6 images?").
- **Everything keyboard-operable**; every field labelled; errors linked to fields.
- **Fast.** Server-rendered pages; forms post to server actions; no client state library.

## Data the admin owns

| Section | Tables |
|---------|--------|
| Projects | `projects`, `project_images`, `project_technologies` |
| Technologies | `technologies` |
| Site | `site_settings` (+ portrait objects in storage) |

Details: [admin-ux.md](admin-ux.md), [project-management.md](project-management.md), [media-management.md](media-management.md).
