# Admin UX

## Shell

```
┌──────────────┬─────────────────────────────────────────────────────────┐
│ LEVI GATIMU  │  Projects                                    + New project │
│ ADMIN        │  ─────────────────────────────────────────────────────── │
│              │  [Search…]   All · Drafts · Published · Featured · Type ▾  │
│ Projects  ●  │                                                           │
│ Technologies │  ↑↓  01  Study Flow      project  2026  Published Featured │
│ Site         │  ↑↓  02  Trace           project  2026  Published Featured │
│              │  ↑↓  03  Rwasim          experiment 2026  Draft            │
│ View site ↗  │  …                                                        │
│ Log out      │                                                           │
└──────────────┴─────────────────────────────────────────────────────────┘
```

- Sidebar 240px, `bg-raised`, collapses to a top bar with a "Menu" button under 1024px.
- Content max width 960px; forms in a single column with grouped sections.
- "View site ↗" opens the public site; "Log out" is a form button (POST).

## Screens

### Login (`/admin/login`)

Email, password, "Sign in". Generic error. No links. Same tokens; the name mark at top.

### Projects list (`/admin/projects`)

- Search (name/slug, server-side `ilike`), filters as links (`?state=draft|published&featured=1&type=…`).
- Rows: order handle (Move up / Move down buttons, keyboard-operable), `sort_order` index, name (link to editor), type, year, status chip **as text**, Published/Draft, Featured mark, last edited (relative), "Preview" link.
- Ordering buttons are disabled at the ends. Reorder is immediate (server action + refresh).
- Empty state: "No projects yet. Create the first one." with the New project button.
- Header stats (truthful, small): `12 projects · 7 published · 4 featured · 38 MB media`.

### Project editor (`/admin/projects/[id]`, `/new`)

One page, grouped into sections with sticky in-page navigation on desktop (Basics · Cover · Details · Technologies · Links · Case study · Gallery · Publish). Each section is a `<fieldset>` with a `<legend>`.

| Section | Fields |
|---------|--------|
| Basics | Name, Slug (auto, editable, uniqueness check on blur), Type, Status, Year, Timeline |
| Cover | Cover image upload (drop zone), Alt text, Aspect (16:10 / 4:5), Video URL (optional) |
| Details | One-liner (counter /120), Summary (counter /400), Role, Team, Collaborators (repeating: name, role, URL) |
| Technologies | Multi-select picker with search; "Add new technology" inline (name + group); selected shown as an ordered list with move up/down |
| Links | Repeating rows: Label, URL, Kind (repo/live/download/video/other); Repo visibility select |
| Case study | Markdown textarea (mono, auto-grow, min 20 rows), "Insert section template" button (only when empty), Preview toggle renders `Prose` server-side via a small action; character count |
| Gallery | List of uploaded images: thumbnail, alt (required, inline editable), caption, Wide toggle, Move up/down, "Copy Markdown", Remove |
| Publish | Validation summary (blockers in danger colour, warnings in muted); Featured toggle; **Save draft** / **Publish** / **Unpublish**; Delete project (danger, confirm dialog) |

Behaviour:

- **Save draft** is always available and saves everything (validation only enforces types/lengths, not completeness).
- **Publish** runs the completeness rules (content model doc) and refuses with a list if any fail; on success sets `is_published`, `published_at`, revalidates.
- Unsaved-changes guard: `beforeunload` prompt when the form is dirty (progressive enhancement; forms work without JS except uploads' progress).
- Autosave: **no** (explicit saves are predictable; drafts are cheap). Revisit if lost work happens.
- After save, a toast (`role="status"`): "Saved · 21:14". Errors appear inline per field and in a summary at the top with links to the fields.

### Preview (`/admin/preview/[id]`)

The real case-study template rendered from the draft, with a fixed top bar: "Preview — draft · Back to editor". `noindex`.

### Technologies (`/admin/technologies`)

Table grouped by `group`: name, slug, proficiency (select), show on About (checkbox), usage count (projects), Move up/down within group, Edit inline, Delete (blocked with a message if in use). "Add technology" form at the top (name, group, proficiency).

### Site (`/admin/site`)

Sections: Identity (display name, tagline, meta lines, opening statement), Bio (short md, long md with preview), Now (md + "updated" auto-stamp), Contact & links (email, GitHub, LinkedIn, Instagram — empty = not shown), Portrait (two upload slots: home 4:5, about 3:4, shared alt text), Maintenance (Export JSON, Storage: total bytes, orphan count, "Remove orphans").

## States (every screen)

| State | Treatment |
|-------|-----------|
| Loading | Server-rendered; navigation shows the browser's loading indicator. Upload in progress: filename + "Uploading…" + disabled controls in that row. |
| Empty | One sentence + the primary action. |
| Error (field) | Danger text under the field, `aria-invalid`, summary at top. |
| Error (action) | Toast in danger tone with the message; form values retained. |
| Success | Toast in success tone; "View" link where relevant. |
| Destructive confirm | `alertdialog` naming the thing; Cancel focused by default. |
| Offline / failed upload | Row shows "Upload failed — Retry / Remove". |

## Keyboard and accessibility

- All controls native (`<button>`, `<input>`, `<select>`), labelled, focus-visible.
- Reorder via buttons; the list announces "Moved Trace to position 2" through a live region.
- Dialogs trap focus and restore it on close.
- Preview toggle for Markdown is a real button with `aria-pressed`.

## Why no component library

Eight screens, ~15 components, one user. A library (shadcn/Radix) would add ~10 dependencies and its own visual language to reskin. Hand-written components over the same tokens keep the admin consistent with the site and the bundle small. If the admin grows past ~25 components, revisit (DECISIONS).
