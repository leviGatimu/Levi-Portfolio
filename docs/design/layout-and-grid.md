# Layout and Grid

## Container

| Property | Value |
|----------|-------|
| Max content width | `1440px` |
| Outer margin (page gutter) | mobile `16px` · tablet `32px` · desktop `48px` · ≥1440 `64px` |
| Beyond 1440px | The container centres; **images and the paper section are allowed to extend to the viewport edge** ("bleed") while text stays inside the container |

Full-width bleeds are the primary way wide screens feel composed rather than stretched.

## Columns

| Breakpoint | Name | Columns | Gutter |
|------------|------|---------|--------|
| < 640 | `base` (mobile) | 4 | 16px |
| 640–1023 | `md` (tablet) | 8 | 24px |
| 1024–1439 | `lg` (laptop) | 12 | 24px |
| ≥ 1440 | `xl` (desktop) | 12 | 32px |

Implemented as a single CSS grid utility (`.grid-editorial`) with `grid-template-columns: repeat(var(--cols), minmax(0, 1fr))` and `--cols` set per breakpoint. Children place themselves with `col-start / col-span` utilities. No nested grids deeper than two levels.

## Spacing scale

4-based, exposed as Tailwind spacing (`--spacing-*`):

```
1   4px     6   32px     11  128px
2   8px     7   40px     12  160px
3   12px    8   48px     13  192px
4   16px    9   64px     14  256px
5   24px    10  96px
```

### Section rhythm

| Context | Mobile | Desktop |
|---------|--------|---------|
| Between top-level sections | 96px (10) | 192px (13) |
| Section title → content | 32px (6) | 64px (9) |
| Between items in a list (work rows, gallery) | 48px (8) | 96px (10) |
| Inside metadata blocks | 16px (4) | 16px (4) |
| Paragraph spacing | 1em | 1em |

Rule: sections are separated by **space + one hairline**, never by background colour changes (the single exception is the paper section).

## Text measure

- Prose (`body`, `lead`): max `65ch`; on the 12-col grid this is columns 1–7 or 5–11 (never centred).
- One-liners under project names: max `48ch`.
- Metadata blocks: label column `7rem` fixed, value column fills.

## Image sizing rules

| Image role | Aspect | Desktop placement | Notes |
|------------|--------|-------------------|-------|
| Featured project cover (homepage) | 16:10 (web/desktop apps), 4:5 (mobile apps/photos) — per project, set in admin | Spans 7–8 of 12 columns, alternating left/right; **extends into the outer margin on its outer side** | `sizes="(min-width:1024px) 60vw, 100vw"` |
| Case-study hero | as uploaded, min 16:10 | Full container width; bleeds to viewport edge ≥1440 | Priority load |
| Gallery image | as uploaded | Default 8 of 12 cols, offset alternating 0 / 4; a gallery image may be flagged `wide` in admin to span 12 and bleed | Captions in `small` mono below, left-aligned to the image |
| Work-index thumbnail | 16:10 | 4 of 12 cols, revealed on row hover/focus | Lazy |
| Experiment image | 4:3 | 4 of 12 cols each, three across, staggered vertical offsets (0 / 48px / 96px) | Lazy |
| Portrait (homepage) | 4:5 crop | Columns 8–12, top aligned with the name's cap height, extends into the right margin; the surname's last letters overlap its left edge by ~0.5 columns on `xl` | Priority load |
| Portrait (about) | 3:4 crop | Columns 9–12, offset upward into the header | |

All images: `object-fit: cover`, an inset 1px `rule` edge (see color doc), `border-radius: 0`. No rounded corners on imagery anywhere on the public site.

## Homepage composition (desktop, 12 columns)

```
col:  1  2  3  4  5  6  7  8  9  10 11 12
      ┌──────────────────────────────────┐ masthead (hairline below)
      01 STUDENT DEVELOPER · ...            ← meta, cols 1–6
      L E V I                     ┌────────┐
      G A T I M U ─────────────── │portrait│ ← name cols 1–9 (display-xl), overlaps portrait edge
      I build software, AI        │ 4:5    │
      systems and robots —        │        │ ← statement cols 1–6 (display-lg)
      and finish them.            └────────┘ portrait cols 8–12 + bleeds right
      ROLE  Year 2, NGA …          ← small metadata fact list cols 1–4
      ─────────────────────────────────────── hairline
      02 SELECTED WORK                           ← meta
      ┌──────────────────┐   01
      │  cover 16:10     │   Study Flow         ← plate A: image cols 1–8 (bleeds left), text cols 9–12
      │  bleeds left     │   one-liner
      └──────────────────┘   NEXT.JS · ELECTRON · PRISMA
                             2026 · ACTIVE      → Read the case study
                     02                     ┌──────────────────┐
                     Trace                  │  cover            │ ← plate B mirrored: text cols 1–4, image 5–12 bleeds right
                     …                      └──────────────────┘
      ─────────────────────────────────────── hairline
      03 INDEX                                       ← dense ledger: name | type | year | stack, hairline rows
      ─────────────────────────────────────── hairline
      04 EXPERIMENTS & HARDWARE   ┌────┐ ┌────┐  ┌────┐   ← three 4:3 images, staggered offsets
      ═══════════════════════════════════════ PAPER SECTION (bleeds full width)
      05 ABOUT      ≤80-word bio in lead type, cols 1–7   ● Now: …   → More about me
      ═══════════════════════════════════════
      06 CONTACT    Say hello.  (display-lg)
                    getmorelev@gmail.com (heading, mono)   GitHub ↗  LinkedIn ↗   KIGALI 21:14
      ─────────────────────────────────────── footer
```

Asymmetry rules applied: the name is left-heavy; the portrait is right and bleeds; plates alternate; the index is full width; experiments are staggered; the paper section is the only full-bleed background.

## Case-study composition (desktop)

```
      02 / 07 · PROJECT · 2026 · ACTIVE            ← meta cols 1–6
      Study Flow                                   ← display-lg cols 1–9
      one-liner (lead) cols 1–7
      ROLE ……  TEAM ……  TIMELINE ……  STACK ……  LINKS ……   ← metadata block cols 1–12 as 5 columns (stacked mobile)
      ┌────────────────────────────────────────┐
      │ hero cover, full container, bleeds ≥1440│
      └────────────────────────────────────────┘
      Overview (heading) cols 1–3 | prose cols 5–11        ← sticky section label on the left column (desktop)
      Problem            …
      Approach           …
      ┌──────── gallery image 8 cols, offset 0 ─┐
                  ┌──── gallery image 8 cols, offset 4 ──┐
      Architecture       … (may contain a code block or ASCII diagram, mono, bg-sunken)
      Decisions          …
      Challenges         …
      Outcome            …
      Lessons            …
      LINKS   Repository ↗   Live ↗
      ───────────────────────────────────────────
      NEXT   03 / 07  Trace  ┌ cover ┐
```

The two-column "label left, prose right" layout is the editorial signature of the case study and is used consistently for every narrative section.

## Admin layout

The admin uses the same tokens but a conventional, calm layout: left sidebar (`bg-raised`, 240px) with the four sections, content area max `960px`. Standard form layout, not editorial. See [admin-ux.md](../admin/admin-ux.md).

## Z-index scale

```
0    content
10   sticky masthead
20   mobile menu overlay
30   admin dialogs/toasts
```

No other z-indices are permitted.
