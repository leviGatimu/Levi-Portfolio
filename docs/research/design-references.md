# Design References

Reference-by-reference notes. Sites change; each entry describes the site **as known at planning time (Sept 2026)** and should be re-checked in the browser during Phase 2 before decisions are locked. The point is the *principles* extracted, not the pixels.

## R0 — The primary reference (Dribbble: "Daniel Stephan" dark portfolio)

Analysed pixel-by-pixel in [design-direction.md](../design/design-direction.md). Summary: warm charcoal surfaces in a narrow luminance band; mono typography; one accent used ~1% of the time; tiny uppercase metadata; asymmetric composition with overlaps; unframed portrait; large cropped screenshots; near-zero chrome.

- **Works:** hierarchy through scale contrast; calm dark canvas; metadata language; overlap composition.
- **Doesn't (for us):** fake stats, testimonials, service cards, tech-logo coins, all-mono body, tilted mockups.
- **Learn:** surface steps not shadows; one accent; small labels next to huge type.
- **Don't copy:** layout, portrait treatment, quote, colour, font.

## R1 — rauno.me (Rauno Freiberg, design engineer)

- **What it is:** a very quiet personal site: small type, generous space, work shown as short craft notes with precise interaction demos.
- **Works:** restraint; every interaction is tiny and perfect; nothing decorative; the *work* (interaction craft) is the design.
- **Doesn't (for us):** its scale is deliberately small — a student portfolio needs a stronger opening statement; no large imagery.
- **Learn:** motion as craft, never spectacle; reduced-motion respected; hover states that feel physical at 150ms.
- **Don't copy:** the near-invisible typographic scale.

## R2 — emilkowal.ski (Emil Kowalski, design engineer; animation course)

- **What it is:** minimal, text-first site with a few extremely well-tuned animations and easing choices.
- **Works:** demonstrates the "few, consistent, short" motion philosophy; easing tokens as a design decision.
- **Learn:** `cubic-bezier` families, durations under 400ms, no bounce; motion demos as content.
- **Don't copy:** it's a teacher's site; ours is proof-of-work with imagery.

## R3 — linusrogge.com (Linus Rogge, designer)

- **What it is:** editorial designer portfolio: big type, strong grid, generous whitespace, projects as large images with small captions.
- **Works:** the editorial rhythm — large image, small metadata, hairlines; confident asymmetry.
- **Doesn't (for us):** designer positioning; little technical depth in case studies.
- **Learn:** plates — one project per viewport with image + a handful of words; typographic hierarchy doing the work.
- **Don't copy:** layout specifics.

## R4 — dennissnellenberg.com (Dennis Snellenberg, freelance developer; Awwwards SOTD)

- **What it is:** the archetypal "creative developer" portfolio: preloader, smooth scroll, big rounded buttons, magnetic hover, project rows with hover previews.
- **Works:** the project *rows with image preview on hover* pattern is genuinely good for an index; strong typography.
- **Doesn't (for us):** it has been cloned thousands of times (there are YouTube tutorials rebuilding it), so the pattern reads as a template; preloader and scroll-jacking hurt performance and accessibility.
- **Learn:** the index-row-with-hover-thumbnail pattern (we use it on /work); confident large type.
- **Don't copy:** preloader, Lenis, magnetic buttons, curtain page transitions, rounded pill buttons.

## R5 — brittanychiang.com (Brittany Chiang, front-end engineer)

- **What it is:** the most-copied developer portfolio (dark navy, mint accent, numbered nav, "experience" list with tech chips).
- **Works:** clarity; well-structured content; honest.
- **Doesn't (for us):** its look *is* the default developer portfolio now; the numbered-nav + chips pattern instantly reads as a clone.
- **Learn:** honest, structured experience content; accessibility care.
- **Don't copy:** navy + mint, chips, side-by-side "about + photo" card, the sticky left column.

## R6 — paco.me (Paco Coursey) and leerob.com (Lee Robinson)

- **What they are:** text-first minimal sites of well-known engineers; few images; short lists of work and writing.
- **Works:** speed; zero decoration; strong sense of a person.
- **Doesn't (for us):** they rely on reputation; a student needs to *show* work with imagery.
- **Learn:** minimal JS; text hierarchy; "now"-style personal notes.

## R7 — joshwcomeau.com (Josh W. Comeau) and cassie.codes (Cassie Evans)

- **What they are:** personality-rich sites: playful illustration/animation, warm voice.
- **Works:** unmistakable identity; delightful micro-interactions; excellent accessibility on Josh's site (reduced-motion, "sound" toggles).
- **Doesn't (for us):** illustration-led identity needs illustration skills and time; can drift toward "fun" over "proof".
- **Learn:** personality can come from *voice* (copy) and small details rather than decoration; accessibility as a design value.

## R8 — bruno-simon.com (Bruno Simon) and henryheffernan.com (Henry Heffernan)

- **What they are:** spectacle portfolios (3D driving game; a retro desktop OS).
- **Works:** memorable; demonstrates the specific skill (WebGL) they sell.
- **Doesn't (for us):** heavy; the spectacle *is* the content; our content is the projects.
- **Learn:** memorability matters — ours comes from composition and content, not tech demos.
- **Don't copy:** anything.

## R9 — lynnandtonic.com (Lynn Fisher)

- **What it is:** an art-directed personal site redesigned yearly; famous responsive "transformations".
- **Works:** proves that responsive design can be *designed* per breakpoint, not just reflowed.
- **Learn:** treat mobile as its own composition (our responsive doc follows this).

## R10 — vercel.com and the Geist design system

- **What it is:** the reference "clean SaaS" aesthetic; Geist Sans/Mono; black/white; subtle borders.
- **Works:** polished, systematic.
- **Doesn't (for us):** it is the *template feel* the brief warns against; using Geist Sans makes any site read as a Next.js starter.
- **Learn:** border/rule discipline; mono for technical labels.
- **Don't copy:** Geist Sans as display; black/white flatness.

## R11 — Editorial print references (offline)

Magazine feature layouts — e.g. the way long-form technology magazines set an opening spread: a huge name, a small dateline, a full-bleed photograph, a two-column body with a narrow caption column. This is where "label-left / prose-right" and "small metadata next to huge type" come from.

- **Learn:** datelines (our meta line); pull structure from hairlines; captions as first-class content; rhythm of full-bleed → text → half-bleed.

## R12 — Trace's own README (leviGatimu/Trace)

Included deliberately: Levi's README is already a case study in the right voice — a "Why", a structural privacy argument, an ASCII architecture diagram, decisions with reasons. **The case-study format in the content model is modelled on it.** The portfolio should feel like these READMEs given an editorial design.

---

## Synthesis → principles adopted

| Principle | From |
|-----------|------|
| Dark warm canvas, surface steps, one accent | R0 |
| Mono metadata / instrument-readout labels | R0, R10 |
| Scale contrast as hierarchy; huge name, tiny dateline | R0, R3, R11 |
| Plates: one project per viewport, real image + few words | R3, R11 |
| Index rows with hover thumbnails | R4 |
| Motion: few, short, physical; reduced-motion first | R1, R2, R7 |
| Personality via voice, not decoration | R7, R12 |
| Responsive as composition | R9 |
| Case study = README with design | R12 |
| Avoid: preloader, smooth scroll, chips, navy+mint, Geist Sans, 3D | R4, R5, R8, R10 |
