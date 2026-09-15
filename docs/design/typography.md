# Typography

Typography carries this design. Get this right and the site works with no decoration at all.

## Families

| Role | Family | Why | Loading |
|------|--------|-----|---------|
| **Display + body** | **Bricolage Grotesque** (variable: `wght` 200–800, `wdth` 75–100, `opsz` 12–96) | One family with an *optical size* axis: at 96pt it becomes tight and characterful (editorial display), at 14pt it opens up for reading. Width axis gives condensed variants for the masthead mark without a second font. Distinctive without being decorative; looks nothing like the reference's mono-only system. | `next/font/google`, subset `latin`, `display: swap`, axes `[wght, wdth, opsz]` |
| **Mono (metadata, labels, indices, code, technical facts)** | **Geist Mono** (variable `wght` 100–900) | Clean, neutral, excellent at 11–13px uppercase with tracking; tabular figures for indices and dates; not a "code editor" look. Different from the reference's IBM Plex-style mono. | `next/font/google`, subset `latin`, weights 400 + 500 |

Fallback stacks (set explicitly so layout shift is controlled with `adjustFontFallback`):

- Display/body: `"Bricolage Grotesque", "Helvetica Neue", Arial, sans-serif`
- Mono: `"Geist Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`

Rejected alternatives and why:

| Candidate | Rejected because |
|-----------|------------------|
| IBM Plex Mono everywhere | It is (very likely) the reference's font; also body mono is tiring |
| Geist Sans | Ships with `create-next-app`; reads as Vercel/template |
| Inter | Default of the internet; no identity |
| Space Grotesk / Syne / Clash Display | Over-used in "creative developer" portfolios 2022–2025 |
| Archivo (width axis) | Strong second choice; slightly more neutral than Bricolage. Keep as fallback plan if Bricolage's quirks read badly in the actual name. |
| A serif display (Instrument Serif, Playfair) | Editorial, but pulls toward "designer/fashion", away from "engineer" |

**Decision status:** Bricolage Grotesque + Geist Mono is the recommendation. Validate by rendering `LEVI GATIMU` at display size in both Bricolage and Archivo during Phase 2 before locking (see [milestones.md](../implementation/milestones.md)).

## Scale (fluid)

All sizes are `clamp()` between a mobile floor and a desktop ceiling; the middle term is viewport-relative. Tokens live in CSS custom properties and are exposed to Tailwind as `text-*` utilities.

| Token | Use | Mobile (360) | Desktop (1440) | Line-height | Tracking | Weight | opsz |
|-------|-----|--------------|----------------|-------------|----------|--------|------|
| `display-xl` | The name on the homepage only | 3.75rem (60px) | 11rem (176px) | 0.9 | −0.04em | 700 | 96 |
| `display-lg` | Opening statement, project name on case study, "Say hello." | 2.5rem | 5.5rem (88px) | 0.95 | −0.03em | 600 | 96 |
| `display-md` | Section titles (h2), featured project names | 2rem | 3.5rem (56px) | 1.0 | −0.02em | 600 | 72 |
| `heading` | h3, case-study section titles, /work row names | 1.5rem | 2rem (32px) | 1.15 | −0.01em | 600 | 48 |
| `lead` | Short bio, project one-liner on case study, intro paragraphs | 1.125rem | 1.5rem (24px) | 1.4 | 0 | 400 | 24 |
| `body` | Case-study prose, about prose | 1rem | 1.125rem (18px) | 1.6 | 0 | 400 | 14 |
| `small` | Captions, secondary text | 0.875rem | 0.9375rem | 1.5 | 0 | 400 | 14 |
| `meta` | Mono labels, indices, chips, footer | 0.6875rem (11px) | 0.75rem (12px) | 1.4 | +0.08em | 500 mono | — |
| `meta-lg` | Mono metadata values, stack lists | 0.8125rem | 0.875rem | 1.5 | +0.02em | 400 mono | — |

Ratios: the name is ≥ 14× the metadata size on desktop. That gap *is* the hierarchy.

Implementation note: `font-variation-settings: "opsz" N` must be set explicitly per token because browsers auto-apply `opsz` only when `font-optical-sizing: auto` and the computed size matches — we want control, so set it.

## Rules

1. **All caps only in mono.** Bricolage is never set in all caps except the name mark (`display-xl`) which is set in caps by design. Everything else is sentence case.
2. **Tracking:** display sizes negative (tighter as they grow); mono uppercase always positive (+0.08em). Never track body text.
3. **Measure:** body and lead text max width `65ch`; never let prose span more than 8 of 12 columns.
4. **Numerals:** mono for all numeric metadata (dates, indices, counts) using `font-variant-numeric: tabular-nums`.
5. **Weights available:** Bricolage 400, 500, 600, 700 only (variable file, but design uses four stops). Mono 400, 500. No light weights on dark backgrounds (thin strokes on dark backgrounds smear).
6. **Italic:** Bricolage italic is used once, at most, per page — for a pull-quote or the "now" line. Not for emphasis in body (use 500 weight instead).
7. **Hyphenation:** off for headings; `text-wrap: balance` on headings ≤ 3 lines; `text-wrap: pretty` on prose.
8. **Name break:** on viewports narrower than ~900px the name breaks as `LEVI` / `GATIMU` on two lines, intentionally left-aligned, not centred.

## Mono metadata pattern

The single most reused typographic pattern. Specification:

```
LABEL        Value in body or meta-lg
```

- Label: `meta` token, uppercase, colour `fg-subtle`.
- Value: `meta-lg` (technical values: stack, dates) or `body` (prose values: role description).
- Label and value in two columns on desktop (label column fixed at 7rem), stacked on mobile with 4px gap.
- Groups separated by hairline rules, 16px padding.

Used for: project metadata block, About fact list, footer, admin read-only summaries.

## Index numbers

Sections and items carry indices: `01`, `02`, or `03 / 07` for position in a set. Mono, `meta` token, tabular. On the featured project the index takes the accent colour — the only accent text on the homepage above the fold besides focus rings.

## Loading and performance

- Two font files total (two variable fonts). Target ≤ 120 KB combined woff2 after `latin` subsetting.
- `next/font` self-hosts and preloads; `display: swap` with `adjustFontFallback: true` to minimise CLS.
- No third-party font CSS, no Google Fonts runtime requests.

## Accessibility

- Minimum rendered size for any text is 11px (mono meta) and only for uppercase tracked labels; all such labels have ≥ 4.5:1 contrast.
- Line-height ≥ 1.5 for body; headings may be tighter (allowed by WCAG 1.4.12 as it applies to user-overridable spacing, which we do not block).
- Users may zoom to 200%; layouts reflow (see responsive doc), no text is clipped by fixed-height containers.
