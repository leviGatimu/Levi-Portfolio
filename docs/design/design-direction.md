# Design Direction

## What the reference actually is

The Dribbble reference (Daniel Stephan, "Front-End Developer" portfolio shot) was studied at pixel level. Observed facts, not impressions:

| Property | Observation |
|----------|-------------|
| Canvas | Warm charcoal, **not black**. Dominant sampled colours: `#25262a` (base), `#2d2e32` (raised panels), `#1d1d20` (deepest). The three surfaces sit within ~10 luminance points of each other — depth comes from tiny steps, not from shadows or borders. |
| Typography | Almost everything is **monospace** (headline "Talk is cheap. Show me the code", subtitle in mono italic, body in small mono). Only the name mark in the masthead is a sans. Headline is medium weight, ~2 lines, tight leading. |
| Accent | One mint green. Used in five places on the whole page: a filled label chip, a link underline, the first service title, the first project title, one mail icon button, one 4px dot. **Roughly 1% of the pixels.** |
| Metadata | Tiny uppercase mono labels ("Introduce", "20 PROJECTS", "Front-End Developer") and small outlined chips for tags ("Gatsby.js", "React", "HTML"). |
| Composition | Asymmetric. Hero text occupies the left ~45%; the portrait sits right and **overlaps a large circle and the fold line**. Project panels on the right edge overlap the page frame. Nothing is centred. |
| Portrait | A **cutout** (no frame, no circle around the person). A large dark circle sits *behind* it as a compositional anchor. Floating "coin" icons of technologies orbit it. |
| Imagery | Project screenshots are large, cropped by their panel edges (bleed), one shown in perspective. |
| Chrome | Almost none. No visible buttons except one accent icon. Links are text. Panels have no borders — only a slightly lighter fill. |
| Rhythm | Generous vertical space between blocks; dense within blocks. |
| Personality | The hoodie portrait, the "Talk is cheap" quote, the big stats — personality through *content choices*, not decoration. |

## Principles we extract (keep)

1. **Dark, warm, low-contrast surfaces.** Depth via 2–3 surface steps within a narrow luminance band. No drop shadows, no glass, no gradients.
2. **Monospace as an identity carrier**, especially for metadata, labels, indices and technical facts.
3. **One accent, used like a highlighter** — a handful of places per page; never for large areas, never for backgrounds.
4. **Tiny metadata, big statements.** Contrast in scale is the primary hierarchy tool.
5. **Asymmetry and overlap.** Text and image occupy different columns; images cross container edges; the portrait crosses the fold.
6. **Portrait without a frame.** The person is a design element, integrated into the composition.
7. **Real screenshots, cropped large.** Images bleed past their container; the crop is part of the art direction.
8. **Almost no UI chrome.** Text links, hairline rules, no buttons unless they perform an action.

## What we deliberately do NOT copy

| Reference element | Why not | What we do instead |
|-------------------|---------|--------------------|
| Hoodie portrait, "Talk is cheap" quote | That is Daniel's persona and a famous Linus Torvalds quote — copying either makes it a clone | Levi's own portrait, editorial crop; Levi's own statement |
| "12 years experience / 165 projects" stats | Fake-stat pattern; also untrue for a Year 2 student | Real, small facts as metadata (year, school, status) — never a stats row |
| Service cards (Design / Front-End / SEO with "20 projects") | Freelancer-service framing; Levi is not selling services | Projects speak for range; skills live on About |
| Testimonials with big quote marks | No verified testimonials exist | Omitted entirely |
| Tech-logo "coins" orbiting the portrait | Cliché; decoration | Nothing orbits the portrait. Metadata sits beside it in type |
| Tilted 3D screenshot mockup | Mockup-frame look; reads as template | Flat, real screenshots cropped by the container edge |
| Mint green accent | It is the reference's colour | A different accent — see [color.md](color.md) |
| All-mono typography | Full mono at display size reads as a terminal, and body mono tires the reader | Mono for metadata/labels/technical facts; a grotesk with real character for display and body — see [typography.md](typography.md) |
| Nav with "Twitter / Github" icon+label pairs and an accent icon button | Fine, but it is their layout | Text-only masthead |

## The identity we are building

**"Editorial engineering notebook."** Imagine a well-designed technical magazine printing a feature about a young engineer's work: big name, precise metadata, large photographs of the work, captions that explain how things were built, plenty of dark paper.

Through-lines that make it *Levi's*:

- **Metadata as instrument readout.** The mono metadata style (uppercase, tracked, small) is the one quiet nod to aviation instrumentation — labels like `STATUS`, `YEAR`, `STACK`, `ROLE` read like a panel. This is never made literal (no gauges, no cockpit imagery).
- **Index numbers.** Sections and projects are numbered (`01`, `02 / 07`). Editorial and technical at once.
- **One inverted "paper" section.** The short About block on the homepage flips to warm off-white paper with near-black type. It is the visual equivalent of a magazine insert and the one moment of light on the page.
- **The accent as a tool, not a theme.** Reserved for: the current nav item marker, link underlines on hover, the index number of the featured project, focus rings, and the "now" dot.

## Anti-checklist (review gate)

Before any page is accepted, verify that it has **none** of these:

- [ ] Gradient backgrounds or gradient text
- [ ] Glow, blur, glassmorphism, backdrop-filter panels
- [ ] Rounded cards with shadows as the layout unit
- [ ] Skill bars, percentage rings, logo walls
- [ ] Stats rows (numbers with labels) of any kind
- [ ] Testimonials, client logos, "trusted by"
- [ ] Emoji as icons or bullets
- [ ] Icons doing decorative work (icons only where they replace a word, e.g. external-link arrow)
- [ ] Centred hero with a big button
- [ ] "Available for hire" badge / pulsing green dot
- [ ] Animated particle, blob, grid, or spotlight backgrounds
- [ ] Typewriter effect on the headline
- [ ] More than one accent colour
- [ ] Any copy that could appear on any other developer's site unchanged

And that it has **all** of these:

- [ ] At least one element that crosses a grid boundary or container edge
- [ ] A clear scale contrast between the largest and smallest type (≥ 8×)
- [ ] Mono metadata present and consistent
- [ ] Real imagery of real work
- [ ] Hairline rules doing the structural work, not boxes
- [ ] Whitespace that would look wrong if reduced

## Mood in words

Dark paper. Quiet. Precise. Large. Warm, not cold. Confident without shouting. Young, but the kind of young that reads manuals.
