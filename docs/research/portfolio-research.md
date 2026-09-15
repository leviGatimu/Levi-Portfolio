# Portfolio Research — patterns by category

What each category of personal site does well, where it fails, and what we take. Complements [design-references.md](design-references.md).

## Category 1 — Generic developer portfolio (template/tutorial-derived)

**Typical anatomy:** centred hero with "Hi, I'm X, a Full-Stack Developer" + typewriter effect + two buttons; skills section with logo grid or percentage bars; projects as a 3-column card grid (thumbnail, title, sentence, "Live"/"Code" buttons); contact form; dark navy + gradient accents; particles or blob backgrounds.

- **Works:** covers the expected information; quick to build.
- **Fails:** interchangeable — the design carries no information about the person; cards force every project to the same tiny size; fake-looking stats and "trusted by" sections; performance often poor (animation libraries, unoptimised images).
- **Take:** nothing structural. It defines the *negative space* of our design (see the anti-checklist).

## Category 2 — Designer portfolio (editorial)

**Typical anatomy:** name + one-line positioning; large project images with minimal captions; case studies with process imagery; strong typography; monochrome or restrained colour; asymmetry.

- **Works:** work-first; imagery large; every page composed.
- **Fails (for a developer):** case studies often thin on technical substance; can be image-heavy and slow; sometimes so minimal that the person disappears.
- **Take:** plates, whitespace, hairlines, editorial hierarchy — married to engineering-depth case studies.

## Category 3 — Editorial personal site (writer/engineer hybrid)

**Typical anatomy:** small masthead, essays/notes, a "now" page, minimal decoration, text-first.

- **Works:** authenticity; speed; voice.
- **Fails (for us):** relies on a body of writing we don't have yet; imagery absent.
- **Take:** voice rules; "now" note; footer "last updated" honesty.

## Category 4 — Creative developer portfolio (Awwwards style)

**Typical anatomy:** preloader, smooth scroll, WebGL or heavy transitions, giant type, cursor effects, marquee, "selected works" with hover distortions.

- **Works:** memorability; demonstrates front-end craft; big type.
- **Fails:** accessibility (scroll-jacking, motion), performance, template-ness (the Snellenberg clone effect), the spectacle overshadows the projects.
- **Take:** giant type; index rows with hover previews; the confidence. Reject the rest.

## Category 5 — Engineering portfolio (systems/backend people)

**Typical anatomy:** plain HTML, a list of projects with links, a résumé PDF, maybe a blog with deep technical posts.

- **Works:** substance; zero pretence; fast.
- **Fails:** no design; imagery absent; hard to scan; doesn't communicate range or care for UX.
- **Take:** the substance standard for case studies (architecture diagrams, decisions, what broke) — Levi's READMEs already meet it.

## Category 6 — Student portfolios

**Typical anatomy:** the generic template + coursework projects + "aspiring developer" language + inflated claims.

- **Works:** shows enthusiasm.
- **Fails:** "aspiring" undersells; inflated numbers undermine trust; coursework presented as products; no curation (everything listed).
- **Take:** the opposite stance — a *curated* set of real projects, honest scope statements, coursework acknowledged as an archive trail rather than hidden or inflated.

## Cross-cutting observations

1. **Curation beats volume.** The sites that impress show 3–6 things well. Levi has 78 repos; the homepage will show 4.
2. **Real screenshots beat mockups.** Device frames and tilted 3D mockups signal "template"; plain cropped screenshots signal "real".
3. **Honest metadata is a differentiator.** "Solo · Year 2 · Paused" is more credible than "Enterprise-grade".
4. **Navigation is nearly irrelevant** on good portfolios — 3 links. Ours: Work, About, Contact.
5. **The about page is where personality lives**; the homepage is where the work lives.
6. **Speed is felt.** Editorial sites that load instantly feel premium; heavy creative sites feel like waiting rooms.
7. **Mobile is where most first impressions happen** and where most portfolios collapse into a stack of cards. Designing mobile compositions is a visible quality signal.

## Implications recorded elsewhere

- Anti-checklist → design-direction.
- Plates + index + case-study template → information-architecture, layout-and-grid, project-content-model.
- Voice → content-strategy.
- Motion restraint → motion.
- Curation → project-inventory (Featured vs Archive).
