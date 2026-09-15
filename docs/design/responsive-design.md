# Responsive Design

Breakpoints follow the grid: `base` < 640 · `md` 640–1023 · `lg` 1024–1439 · `xl` ≥ 1440. The design is specified **per section per breakpoint**; mobile is a composition of its own, not a squeezed desktop.

## Global behaviour

| Concern | base (mobile) | md (tablet) | lg (laptop) | xl (desktop) |
|---------|---------------|-------------|-------------|--------------|
| Page gutter | 16px | 32px | 48px | 64px |
| Columns | 4 | 8 | 12 | 12 |
| Masthead | Name + "Menu" | Name + "Menu" | Full row | Full row |
| Section gap | 96px | 128px | 160px | 192px |
| Bleeds | Images may bleed to both viewport edges (full width) | Outer-side bleed | Outer-side bleed | Outer-side bleed + container centred |
| Metadata blocks | Stacked label/value | Two-column | Two-column | Two-column |
| Hover-only reveals (work index thumbnails) | Replaced by always-visible small thumbnails | Always visible | Hover/focus | Hover/focus |

## Section by section

### Opening

| | base | md | lg / xl |
|-|------|----|---------|
| Order | meta line → name (two lines) → portrait (full width, 4:5) → statement → fact list | meta → name → portrait right (cols 5–8) with name overlapping its top edge → statement cols 1–5 → facts | As the desktop composition diagram in layout doc |
| Name size | 60–72px, breaks `LEVI` / `GATIMU` | 96–120px, two lines | fluid to 176px, may sit on one line ≥ 1280 if it fits 9 columns; otherwise two lines |
| Portrait | Full container width, bleeds both edges, 4:5, placed *after* the name so the name is LCP and paints first | 4:5, cols 5–8, bleeds right | 4:5, cols 8–12, bleeds right; surname overlaps by ~0.5 col at xl only |
| Statement | display-lg at 40px, full width | 48px, cols 1–6 | fluid to 88px, cols 1–6 |
| Fact list | Stacked | Two columns | Cols 1–4 |

The overlap of name and portrait is a desktop-only device. On mobile the two are stacked and the portrait is large; that is its own strong composition.

### Selected Work (plates)

| | base | md | lg / xl |
|-|------|----|---------|
| Plate | Image full width (bleeds both edges), then index + name + one-liner + stack + status, then link | Image 8/8 cols, text below in two columns | Alternating: image 7–8 cols + text 4 cols beside it |
| Image aspect | Admin-chosen (16:10 or 4:5) — a 4:5 cover shows at 4:5 on mobile without cropping to 16:10 | same | same |
| Spacing between plates | 64px | 96px | 128px |

### Index (ledger)

| | base | md | lg / xl |
|-|------|----|---------|
| Row | Name (heading) on one line, meta (type · year) beneath, stack beneath in mono; hairline | Name | type/year | stack in three columns | name (5 cols) | type (2) | year (1) | stack (4) — a real table with visible column alignment |
| Thumbnail | None (keeps the ledger dense) | None | Revealed at right on hover/focus, 4 cols, does not shift layout (absolutely positioned within the row) |

### Experiments & Hardware

| | base | md | lg / xl |
|-|------|----|---------|
| Layout | Vertical stack, images 4:3 full width, no stagger | 2 across, third below left | 3 across with vertical offsets 0 / 48 / 96px |

### About (paper)

| | base | md | lg / xl |
|-|------|----|---------|
| Bleed | Full viewport width | Full | Full |
| Bio | lead at 18px, full width | cols 1–6 of 8 | cols 1–7 of 12 |
| Now line | Beneath bio | Beneath bio | cols 9–12, vertically aligned to the bio's first line |

### Contact

| | base | md | lg / xl |
|-|------|----|---------|
| "Say hello." | 40px | 56px | fluid to 88px |
| Email | heading size, wraps if needed (`overflow-wrap: anywhere`) | | One line |
| Links + local time | Stacked | Row | Right column |

### Case study

| | base | md | lg / xl |
|-|------|----|---------|
| Header metadata block | Stacked pairs | 2×3 grid | 5 columns in a row |
| Hero | Full width, bleeds | Full width | Container width; bleeds at xl |
| Narrative sections | Section label above prose (mono, uppercase) | Label above | Label in cols 1–3, sticky (`position: sticky; top: 96px`), prose cols 5–11 |
| Gallery | Full width images, captions below | 8/8 | 8/12 with alternating offsets; `wide` images 12/12 + bleed |
| Code/architecture blocks | Horizontal scroll inside the block, never page-wide overflow | | |
| Next project | Name + small cover stacked | Row | Row |

### /work

| | base | md | lg / xl |
|-|------|----|---------|
| Filter row | Horizontal scroll if needed, text links | Row | Row |
| Rows | Small thumbnail (16:10, full width) above name + meta | Thumbnail left 3/8 cols | Text row with hover-revealed thumbnail |

### /about

| | base | md | lg / xl |
|-|------|----|---------|
| Portrait | Full width 3:4 after the h1 | cols 5–8 | cols 9–12, offset up into the header by 64px |
| Prose | full width, 65ch cap | cols 1–6 | cols 1–7 |
| Skills | Single column, each group with a mono heading | Two columns | Three columns of groups |

## Typography and images across sizes

- Display sizes are fluid (`clamp`), never stepped; see [typography.md](typography.md). Test the name at 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920 widths.
- Long project names (> 14 characters) must be tested at `display-md`; enable `overflow-wrap: anywhere` on names.
- `next/image` `sizes` attributes must be accurate per breakpoint (documented per image role in the layout doc) so mobile does not download desktop-sized images.

## Touch

- Tap targets ≥ 44×44 CSS px for all interactive elements on `base`/`md` (nav links, footer links, filter links, admin controls).
- No hover-dependent information: anything revealed on hover (index thumbnails) is available another way on touch (visible thumbnails on `/work`; on the homepage index the thumbnail is omitted and the row links to the case study).

## Landscape phones and short viewports

- The opening section does not use `100vh`. Its height is content-driven; nothing is pinned to the fold.
- The mobile menu overlay scrolls internally if the viewport is shorter than its content.

## Wide screens (≥ 1920)

- Container stays 1440 and centres. Bleed images extend to the viewport edge on their outer side, so the composition still reaches the edges.
- Display type does not grow beyond its `xl` ceiling.

## Print

- A minimal print stylesheet: paper white, ink text, hide masthead/menu/footer links, show URLs after links in case studies. Cheap and useful for reviewers who print.
