# Color

## Direction

A **warm charcoal canvas** with warm off-white type, two neutral greys, hairline rules, **one accent**, and **one inverted "paper" section**. This reconciles the brief's starting palette (warm off-white / near-black / neutral grey / one electric accent) with the reference's dark canvas: the off-white becomes the *type colour* and the *paper section*; the near-black becomes the *canvas*.

Dark-only. No theme toggle (see [DECISIONS.md](../DECISIONS.md)). The site respects `prefers-color-scheme` only in the sense that it is always dark; it does not render a light variant.

## Tokens

All colours are CSS custom properties on `:root`, consumed by Tailwind via `@theme`. Never hardcode a hex in a component.

### Surfaces (dark canvas)

| Token | Value | Use |
|-------|-------|-----|
| `--color-bg` | `#161618` | Page canvas |
| `--color-bg-raised` | `#1E1E21` | Slightly lifted areas: masthead when stuck, admin panels, image placeholders |
| `--color-bg-sunken` | `#0F0F10` | Footer, code blocks, the deepest step |

Three steps within a narrow band, as in the reference. Depth is expressed by these steps and hairlines — never by shadows.

### Text on dark

| Token | Value | Contrast on `bg` / `bg-raised` | Use |
|-------|-------|-------------------------------|-----|
| `--color-fg` | `#F1EDE6` | 15.5 / 14.3 | Primary text, the name, headings |
| `--color-fg-muted` | `#A8A59E` | 7.4 / 6.8 | Secondary prose, one-liners, captions |
| `--color-fg-subtle` | `#8A8781` | 5.1 / 4.6 | Mono labels, footer, disabled — the smallest text uses this and still passes AA |

### Rules and borders

| Token | Value | Use |
|-------|-------|-----|
| `--color-rule` | `#2A2A2E` | Hairlines (1px) between sections, rows, metadata groups |
| `--color-rule-strong` | `#3A3A40` | Input borders in admin, hover state of rules, image edges where needed |

Rules are decorative structure and do not need text contrast. Interactive borders (admin inputs) get `rule-strong` plus a visible focus ring.

### Accent

**Decision required from Levi** — see TODO. Two finalists, both tested for contrast:

| Option | Fill | As text on dark | Contrast (text on `bg`) | Character |
|--------|------|-----------------|-------------------------|-----------|
| **A — International Orange** (recommended) | `#FF4F00` | `#FF6A2B` | 6.3 | Aerospace lineage (test aircraft, flight-data recorders are painted in it). Warm against warm charcoal. Rare on developer sites. A quiet, real aviation reference without a single plane icon. |
| B — Signal Amber | `#FFB020` | `#FFB020` | 9.9 | Instrument-panel warmth; very high contrast; more common in "terminal" dark sites. |

Rejected: mint (`#5EE0A0`, it is the reference's colour), electric blue (`#6AA4FF`, generic tech), lime (`#C8FF3D`, reads Web3/startup).

Tokens (values shown for Option A):

| Token | Value | Use |
|-------|-------|-----|
| `--color-accent` | `#FF4F00` | Fills: focus ring, the "now" dot, selection background, small marks |
| `--color-accent-text` | `#FF6A2B` | Accent used as text or hairline on dark (passes AA at 6.3:1) |
| `--color-accent-on-paper` | `#B83800` | The only accent allowed on the paper section (5.0:1 on paper) |

Where the accent may appear (exhaustive):

1. Focus rings (all pages, all elements) — accessibility first.
2. `::selection` background with `fg`-coloured text on dark; on paper `::selection` uses ink.
3. The index number of the current/featured project.
4. Link underline on hover/focus (text stays `fg`).
5. The small "now" dot beside the now-line.
6. Active nav marker (a 1ch mono glyph or short rule).
7. Admin: primary action button fill, destructive actions use `--color-danger` instead.

Where it may never appear: backgrounds of sections, large fills, gradients, glows, headings, body text, icons at rest.

### Paper (inverted section)

| Token | Value | Use |
|-------|-------|-----|
| `--color-paper` | `#F1EDE6` | Background of the inverted section (same value as `fg` — the palette literally flips) |
| `--color-ink` | `#161618` | Text on paper (same as `bg`) |
| `--color-ink-muted` | `#5C5A55` | Secondary text on paper (5.9:1) |
| `--color-paper-rule` | `#D9D4CB` | Hairlines on paper |

The inverted section is implemented as a scoped token swap (`[data-surface="paper"]` redefines `--color-bg`, `--color-fg`, etc.), so components inside it need no special styling.

### Feedback (admin only)

| Token | Value | Use |
|-------|-------|-----|
| `--color-danger` | `#FF5C5C` | Delete/unpublish confirmations, validation errors (5.9:1 on bg) |
| `--color-success` | `#5EE0A0` | Saved/published confirmation toasts (10.9:1) — admin only, never on the public site |

Note: success intentionally reuses a mint; it is confined to the admin so it never competes with the public accent.

## Images on dark

- Screenshots of light UIs will glow against charcoal. Give every project image a 1px `rule` border *inside* its box (`box-shadow: inset 0 0 0 1px var(--color-rule)`) so the edge reads as intentional.
- No image filters, no duotone, no tinting. Real screenshots stay real.
- Portrait: colour, untreated. If the photo has a light background, the crop should let it sit on the canvas as a rectangle, never a cutout with a halo.

## Contrast summary (WCAG 2.2 AA)

| Pair | Ratio | Result |
|------|-------|--------|
| fg on bg | 15.5 | AAA |
| fg-muted on bg | 7.4 | AAA |
| fg-subtle on bg-raised (worst case for smallest text) | 4.6 | AA |
| accent-text on bg | 6.3 | AA (AAA for large) |
| ink on paper | 15.5 | AAA |
| ink-muted on paper | 5.9 | AA |
| accent-on-paper on paper | 5.0 | AA |
| Focus ring (accent fill) vs bg | 5.5 | ≥ 3:1 non-text ✓ |
| Focus ring vs paper | 2.8 | ✗ → on paper the focus ring is `ink`, 2px |

## Hover, active, focus

| State | Treatment |
|-------|-----------|
| Link hover | Underline appears (accent, 1px, offset 0.2em); text colour unchanged |
| Link focus-visible | 2px accent outline, 3px offset, `border-radius: 2px` |
| Project plate hover | Image scale 1.02 over 600ms (motion doc); name gains accent underline |
| Nav active | Accent marker; not a colour change of the text |
| Button (admin) hover | Fill lightens one step; never a colour change to a second hue |
| Disabled (admin) | `fg-subtle` text, `rule` border, cursor not-allowed |
