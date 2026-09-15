# Inspiration Analysis — what makes this portfolio distinctive

## Comparison matrix

| Dimension | Generic dev | Designer editorial | Creative dev | Engineering plain | **This portfolio** |
|-----------|-------------|--------------------|--------------|-------------------|--------------------|
| First impression | Template | Composed | Spectacle | Bare | **Composed, dark, typographic** |
| Work presentation | Card grid | Large plates | Hover rows / WebGL | Link list | **Large plates + a mono ledger index** |
| Case-study depth | One sentence | Process visuals | Little | Deep text | **Deep + designed (label-left / prose-right, ASCII diagrams, decisions)** |
| Honesty signals | Inflated stats | Neutral | Neutral | High | **Explicit: role, team, status, private-repo notice, "last updated"** |
| Person | Circular avatar | Sometimes absent | Absent | Absent | **Portrait as composition element; voice in copy; aviation as a quiet line** |
| Typography | Inter/Poppins | Grotesk/serif | Giant display | System | **Bricolage Grotesque display/body + Geist Mono metadata** |
| Colour | Navy + gradient | Mono/neutral | Black + neon | Default | **Warm charcoal + off-white + one accent + one paper section** |
| Motion | Library defaults | Subtle | Heavy | None | **CSS only; few; reduced-motion first** |
| Mobile | Stacked cards | Reflowed | Broken/heavy | Fine | **Designed per breakpoint** |
| Performance | Poor | Good | Poor | Excellent | **Budgeted; ISR; ~90 KB JS** |
| Maintenance | Edit code | Edit code / CMS | Edit code | Edit HTML | **Private CMS, publish in minutes** |

## The distinctive combination

No single element is unique; the **combination** is:

1. **Editorial dark canvas + engineering substance.** Designer-grade composition wrapping README-grade case studies. Most sites have one or the other.
2. **Instrument-readout metadata.** A consistent mono label language (`ROLE`, `STATUS`, `STACK`, `02 / 07`) that quietly connects to aviation without a single aviation image.
3. **Honesty as design.** Real facts in small type instead of fake numbers in big type. For a Year 2 student, this is the strongest possible positioning: *this person tells the truth and still ships*.
4. **One paper section.** A single inverted moment on the page — memorable, editorial, cheap.
5. **The ledger.** A dense, typographic index of everything else (type · year · stack) shows breadth without a wall of cards.
6. **A portfolio that is itself a well-built product** (CMS, RLS, budgets, accessibility) — evidence of the engineering it claims.

## Risks to distinctiveness (and mitigations)

| Risk | Mitigation |
|------|------------|
| Dark + mono drifts toward "terminal/hacker" cliché | Body in a humanist grotesk, warm charcoal not black, no green-on-black, no cursor blink, no typewriter |
| Bricolage becomes "the 2025 font" | Validate against Archivo at Phase 2; the composition matters more than the family |
| Editorial layout reads as a designer site, hiding the engineering | Case studies lead with architecture and decisions; ledger and metadata are technical |
| Aviation reference invisible or, conversely, gimmicky | Exactly two touchpoints (meta line, About section); review with Levi |
| Over-restraint → boring | The name at 176px, plates that bleed, the paper flip, and real screenshots carry energy; test with fresh eyes at Phase 6 |

## What a reviewer should say after 60 seconds

"Clean. Real projects. He explains how he built them. He's in Year 2 in Kigali and he's already shipping desktop apps and simulations. I'd talk to him."

That sentence is the acceptance test for the design.
