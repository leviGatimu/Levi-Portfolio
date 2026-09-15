# Project Content Model

How a project is represented in the CMS and rendered as a case study. The model is deliberately split into **structured summary fields** (queried, shown in lists and headers) and **one Markdown narrative** (rendered only on the case-study page).

## Why structured + Markdown (not a block editor, not all-Markdown)

- Lists, plates, headers, OG images, and the ledger need *fields* (name, one-liner, year, status, stack). Parsing those out of Markdown is fragile.
- The narrative needs prose with headings, images, code, and lists. Markdown is portable, diff-able, and Levi already writes excellent READMEs in it (Trace, Study Flow).
- A block editor (Tiptap/Editor.js) adds a heavy dependency, a JSON schema, and a custom renderer for marginal gain on a single-author site.

## Summary fields (structured)

| Field | Type | Required to publish | Shown on |
|-------|------|---------------------|----------|
| `name` | text ≤ 60 | yes | everywhere |
| `slug` | kebab-case, unique | yes | URL |
| `one_liner` | text ≤ 120 | yes | home plates, /work, case-study header, OG |
| `summary` | text ≤ 400 | yes | case-study "Overview" opener, meta description |
| `type` | enum `project` · `experiment` · `client` | yes | filters, header meta |
| `status` | enum `active` · `paused` · `completed` · `archived` | yes | header meta, ledger |
| `year` | int | yes | everywhere |
| `timeline` | text ≤ 60 (e.g. "May–Sep 2026") | no | header meta |
| `role` | text ≤ 120 (e.g. "Solo — design, frontend, backend, desktop build") | yes | header meta |
| `team` | text ≤ 200 (e.g. "Solo" or "With two classmates (robotics build)") | yes | header meta |
| `collaborators` | JSON array `{name, role, url?}` | no | header meta (when present) |
| `technologies` | relation → `technologies` | yes (≥ 1) | everywhere |
| `links` | JSON array `{label, url, kind: repo·live·download·video·other}` | no — but publishing with zero links shows a warning | header, end of case study |
| `repo_visibility` | enum `public` · `private` · `none` | yes | if `private`, header shows "Private repository" honestly |
| `cover_image` | relation → `project_images` (one flagged `is_cover`) | yes | plates, /work, hero, OG |
| `cover_aspect` | enum `16:10` · `4:5` | yes | plate layout |
| `video_url` | URL | no | case study (embedded after hero) |
| `is_featured` | bool | — | homepage |
| `sort_order` | int | — | ordering everywhere |
| `is_published` | bool | — | visibility |
| `published_at` | timestamp | — | sitemap, "last updated" |

## Narrative (`body_md`, Markdown)

One Markdown document. The admin editor shows a **template** of second-level headings in the canonical order; empty sections are simply deleted by Levi. The renderer does not require any particular heading — it renders what is there — but the *style guide* below defines what each section is for.

| # | Heading | Required? | What goes here |
|---|---------|-----------|----------------|
| 1 | `## Overview` | **Required** (or the `summary` field is used as the opener) | What it is, who it is for, in 2–5 sentences. |
| 2 | `## Problem` | Recommended | The real problem, stated concretely. Why existing things fall short. |
| 3 | `## Context` | Optional | Coursework? Personal? Client? Constraints (time, hardware, team). |
| 4 | `## Approach` | Recommended | How the problem was attacked. Key product decisions. |
| 5 | `## Architecture` | Recommended for software | Components, data flow, boundaries. ASCII diagrams in fenced code blocks are encouraged (Trace's README is the model). |
| 6 | `## Decisions` | Recommended | 3–6 bullet decisions with the *why* ("Named pipe instead of local HTTP because…"). |
| 7 | `## Challenges` | Optional | What broke, what was hard. |
| 8 | `## Outcome` | Optional — **only real outcomes** | Shipped installer, live URL, what works today, what doesn't. No invented metrics. |
| 9 | `## Lessons` | Recommended | 2–4 honest lessons. |
| — | Images | Anywhere | `![alt](url)` referencing gallery images (the editor offers "copy Markdown" per uploaded image); a trailing line `*Caption text*` directly after an image is rendered as its caption. |
| — | Links | Not in body | Links are structured (`links` field) and rendered by the page; the body may still contain inline links. |

Which sections are optional **depends on type**:

| Type | Typically present |
|------|-------------------|
| `project` | Overview, Problem, Approach, Architecture, Decisions, Outcome, Lessons |
| `experiment` | Overview, Context, Approach, Challenges, Lessons (Architecture optional; Outcome often "where it stopped") |
| `client` | Overview, Context (who the client is — with permission), Role, Approach, Decisions, Outcome (what was delivered) |

## Rendering rules for `body_md`

- Renderer: `react-markdown` + `remark-gfm`; **no raw HTML** (`skipHtml`), so the body cannot inject markup. Allowed elements: h2, h3, p, ul, ol, li, strong, em, a, code, pre, blockquote, img, table, hr.
- `h1` in the body is demoted to `h2` (the page owns the h1).
- Images render through `next/image` with dimensions looked up from `project_images` when the URL matches a gallery image; otherwise a plain `<img>` with `loading="lazy"` (external images discouraged; admin warns).
- Code blocks: mono, `bg-sunken`, horizontal scroll, no syntax highlighting library in V1 (adds weight; ASCII diagrams and short snippets don't need it). Revisit if real code samples become common.
- Links in prose: same underline treatment as the site; external get `↗`.
- Section headings render inside the label-left / prose-right layout: each `## Heading` starts a new `ProjectSection` with the heading as the sticky label.

## Gallery (`project_images`)

| Field | Type | Notes |
|-------|------|-------|
| `id`, `project_id` | | |
| `storage_path` | text | `projects/{slug}/{uuid}.{ext}` |
| `alt` | text, required | Cannot save an image without alt |
| `caption` | text | optional, shown under the image |
| `width`, `height` | int | Read at upload (server-side `sharp` metadata) for `next/image` |
| `is_cover` | bool | exactly one per project when published |
| `is_wide` | bool | spans 12 cols and bleeds on desktop |
| `sort_order` | int | |

Gallery images not referenced in the body are rendered after the narrative in a "Gallery" section in `sort_order`. Images referenced in the body are rendered inline where referenced and **not** repeated below.

## Validation that blocks publishing

- Any required field missing.
- No cover image, or cover image without alt.
- `body_md` contains `TODO`, `lorem`, or is shorter than 200 characters.
- Slug collides with an existing project or a reserved route (`new`, `admin`, `work`, `about`).
- `links` contains a URL that fails a basic URL parse (no live HTTP check — offline sites happen).

Warnings (do not block): no links; no gallery beyond the cover; `outcome` section absent on a `completed` project.

## Example: Trace as data

```yaml
name: Trace
slug: trace
one_liner: A private, local activity history for Windows. Nothing leaves your machine.
summary: Trace records which applications you use and when, and turns it into a searchable history of your day. No account, no server, no telemetry.
type: project
status: active            # NEEDS VERIFICATION
year: 2026
timeline: "2026"          # NEEDS VERIFICATION
role: "Solo — Windows tracker (C#), Electron dashboard, installer"   # NEEDS VERIFICATION
team: Solo
repo_visibility: public
links:
  - { label: Repository, url: https://github.com/leviGatimu/Trace, kind: repo }
technologies: [C#, .NET, Electron, React, TypeScript, SQLite]
cover_aspect: "16:10"
body_md: |
  ## Overview
  …
  ## Architecture
  ```
  Windows APIs → TraceTracker.exe (watchers → queue → engine → PrivacyGate → SQLite)
                     │ named pipe (per-user ACL, NDJSON)
                 Trace.exe (Electron · React)
  ```
  ## Decisions
  - The tracker is the only writer…
```
