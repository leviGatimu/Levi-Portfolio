# Motion

## Principles

1. **The static state is the design.** Motion only reveals or transitions the already-correct static state. If a section needs motion to look finished, the layout is wrong.
2. **Few, consistent, short.** One easing family, three durations, a small catalogue. Nothing bounces.
3. **Reveal, don't perform.** Elements arrive; they do not dance. No looping animations on the public site except the local-time clock digits changing.
4. **Reduced motion is a first-class mode**, not a fallback. With `prefers-reduced-motion: reduce`, all transforms and reveals are removed and only opacity transitions ≤ 150ms remain (or none).
5. **Never block content.** No preloaders, no intro screens, no scroll-jacking, no smooth-scroll libraries. Native scroll only.
6. **Motion never delays LCP.** The hero name, statement, portrait, and first cover image render immediately in their final position (server-rendered, no `opacity: 0` initial state that depends on JS). Reveal animations apply only below the fold.

## Tokens

```
--ease-out:     cubic-bezier(0.22, 1, 0.36, 1)     /* "quart-out": decisive arrival */
--ease-in-out:  cubic-bezier(0.65, 0, 0.35, 1)
--dur-fast:     150ms    hover, focus, underline
--dur-base:     350ms    reveals, small transitions
--dur-slow:     700ms    image scale, page section reveals
```

## Catalogue (exhaustive)

| # | Where | Motion | Duration | Reduced motion |
|---|-------|--------|----------|----------------|
| M1 | Links | Underline draws in from left (`background-size` 0→100%) | fast | Underline appears instantly |
| M2 | Project plate hover/focus | Cover image `scale(1.02)`; name underline (M1) | slow / fast | No scale; underline only |
| M3 | Below-fold sections | Once, on enter viewport (IntersectionObserver, 15% threshold): `translateY(16px)→0` + `opacity 0→1` | base | Opacity only, 150ms, or none |
| M4 | Case-study gallery images | Same as M3, staggered 60ms between siblings (max 3 siblings staggered) | base | As M3 |
| M5 | Work-index row hover | Thumbnail fades in at right (`opacity`) and translates 8px | base | Opacity only |
| M6 | Mobile menu | Overlay `opacity`; list items `translateY(8px)` staggered 30ms | base | Opacity only |
| M7 | Route change | None. Next.js App Router navigation; each page renders in its final state. The masthead persists via the root layout. | — | — |
| M8 | Masthead on scroll | Background becomes `bg-raised` and the hairline appears after 8px scroll (class toggle) | fast | Same (colour only) |
| M9 | Contact local time | Digits update once a minute; no animation | — | — |
| M10 | Admin | Toasts slide in from bottom-right 8px + fade; dialogs fade; no other motion | base | Opacity only |

Explicitly rejected (for this site):

| Rejected | Reason |
|----------|--------|
| Custom cursor / cursor follower | Novelty; hurts usability; breaks on touch |
| Smooth scroll (Lenis etc.) | Scroll-jacking; accessibility; adds JS to every page |
| Parallax on images | Motion sickness risk; masks real screenshots |
| Text split / letter-by-letter reveals on the name | LCP delay; the name must paint immediately |
| Page transition overlays / curtains | Delay content; template feel |
| Magnetic buttons, hover tilt, 3D | Novelty |
| Marquee / ticker | Noise |
| Loader with percentage | Delays content; the reference's era, not ours |

## Implementation

- **CSS first.** M1, M2, M5, M6, M8 are pure CSS (`transition`, `:hover`, `:focus-visible`, class toggles). No library.
- **M3/M4** use one small client component `<Reveal>` wrapping a server-rendered block: it adds `data-revealed` via IntersectionObserver; CSS does the transition. The block is visible by default (no JS = visible); the component adds the hidden initial state only after hydration *and* only if `prefers-reduced-motion` is not set. This guarantees no invisible content without JS.
- **Motion library:** none required for V1. `motion` (Framer Motion) is **not** installed unless a V2 feature needs layout animations. This is a deliberate reversal of the brief's "likely" stack — see [DECISIONS.md](../DECISIONS.md).
- All transitions declare `transition-property` explicitly (never `all`).
- `@media (prefers-reduced-motion: reduce)` block at the end of the global stylesheet zeroes transforms and caps durations at 150ms, plus the `<Reveal>` component checks `matchMedia` before adding hidden states.

## Acceptance checks

- With JS disabled, every section is visible and correctly laid out.
- With reduced motion on, no element translates or scales; opacity transitions ≤ 150ms.
- No animation runs above the fold on initial load.
- Lighthouse "Avoid non-composited animations" audit passes (only `transform`/`opacity` animate).
