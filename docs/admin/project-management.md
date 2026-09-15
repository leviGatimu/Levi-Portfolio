# Project Management (admin)

Field-by-field specification of the project editor and its server actions. The content model is defined in [content/project-content-model.md](../content/project-content-model.md); this document is the *operational* view.

## Actions (server)

| Action | Input (zod) | Effect | Revalidates |
|--------|-------------|--------|-------------|
| `createProject` | name, slug?, type, status, year | Insert draft with `sort_order = max + 10`; redirect to editor | — (draft invisible) |
| `updateProject` | full editable shape (all sections except images) | Update row; replace `project_technologies` in a transaction (delete + insert with order) | `projects` if published |
| `publishProject` | id | Run completeness validation server-side; set `is_published = true` (trigger sets `published_at`) | `projects`, `/work/[slug]` |
| `unpublishProject` | id | `is_published = false` | `projects`, `/work/[slug]` |
| `setFeatured` | id, bool | Toggle | `projects` |
| `moveProject` | id, direction | Swap `sort_order` with neighbour (single SQL statement using a CTE) | `projects` |
| `deleteProject` | id, confirmName | Verify `confirmName === name`; delete row (cascade images rows); delete storage objects under `projects/{slug}/` | `projects` |
| `checkSlug` | slug, excludeId? | Returns availability (used on blur) | — |
| `uploadProjectImage` / `updateProjectImage` / `moveProjectImage` / `setCoverImage` / `deleteProjectImage` | see media doc | | `projects` if published |
| `renderMarkdownPreview` | markdown | Returns sanitised HTML string of `Prose` for the preview toggle | — |

All actions start with `requireAdmin()`; all inputs pass through zod; all return `{ ok: true, data } | { ok: false, message, fieldErrors? }`.

## Field rules

| Field | Rule | UI help text |
|-------|------|--------------|
| Name | 1–60 chars | "The project's name as it should appear everywhere." |
| Slug | `^[a-z0-9]+(-[a-z0-9]+)*$`, unique, not in reserved list (`new`, `admin`, `work`, `about`, `preview`) | "Part of the URL: /work/{slug}. Avoid changing after publishing — old links will break." |
| Type | enum | "Project: software you built. Experiment: prototypes, hardware, simulations. Client: built for someone else (with permission)." |
| Status | enum | "Be honest: Paused is fine." |
| Year | 2020–2100 | "Year the project mainly happened." |
| Timeline | ≤ 60 | "e.g. May–Sep 2026" |
| One-liner | 1–120 | "One plain sentence: what it is, for whom. No adjectives." |
| Summary | 1–400 | "2–3 sentences. Used as the meta description and the case-study opener." |
| Role | 1–120 | "What *you* did. e.g. Solo — design, frontend, backend." |
| Team | 1–200 | "Solo, or who you worked with. Real names only with their permission." |
| Collaborators | array ≤ 10 of {name 1–60, role 1–60, url? https} | |
| Technologies | ≥ 1 for publish | "Only what the project actually uses." |
| Links | array ≤ 8 of {label 1–30, url http(s), kind} | "Repository, Live, Download, Video…" |
| Repo visibility | enum | "If private, the site says so instead of linking." |
| Video URL | https, host in allow-list (youtube.com, youtu.be, youtube-nocookie.com, vimeo.com) else stored but rendered as a plain link | |
| Cover aspect | enum | "16:10 for desktop/web screenshots, 4:5 for phone screens and portraits." |
| Body (Markdown) | ≤ 60,000 chars; publish requires ≥ 200 chars and no `TODO`/`lorem` | Template inserted on first edit |

## Publish validation (server-side, authoritative)

Blockers → cannot publish:

1. Missing/invalid required fields (name, slug, one-liner, summary, role, team, year, type, status).
2. No cover image; cover without alt.
3. No technologies.
4. Body shorter than 200 characters or containing `TODO`, `lorem`, `ipsum` (case-insensitive).
5. Any gallery image without alt.

Warnings → publish allowed, shown in the panel:

- No links.
- Only one image.
- Status `completed` with no `## Outcome` section.
- Body has no `## ` headings (renders as one long section).

The same rules run in the UI (shared zod schema + a pure `getPublishBlockers(project)` function) so the panel is accurate before the click.

## Ordering

- `sort_order` integers with gaps of 10 on create; `moveProject` swaps with the adjacent row in the *same list the user is viewing* (all projects, ordered) — featured ordering is the same global ordering.
- A "Renumber" maintenance action on the Site page rewrites `sort_order` to 10, 20, 30… if gaps ever close (rare; only after manual SQL).

## Slug changes after publish (V1 behaviour)

Allowed with a warning dialog: "Changing the slug of a published project breaks existing links (search results, shares). Continue?". No redirect table in V1 (recorded in TODO future ideas). Storage paths keep the old slug folder (paths are immutable) — this is fine and documented in the storage doc.

## Deleting

- Delete requires typing the project name.
- Published projects must be unpublished first (the Delete button is disabled with the reason while published) — a two-step guard against accidents.
- Deletion removes images from storage; there is no undo. The confirmation says so.

## Drafts and preview

- A draft is any project with `is_published = false`. Drafts are listed with a "Draft" mark and are excluded from every public query by RLS.
- Preview renders the draft at `/admin/preview/[id]`; the link appears in the editor header and the list.

## Bulk operations

None in V1. With tens of projects, per-row actions suffice.
