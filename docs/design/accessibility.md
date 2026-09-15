# Accessibility

Target: **WCAG 2.2 AA** across the public site and the admin. Accessibility is an acceptance criterion for every task in the implementation plan, not a final phase.

## Requirements

### Structure and semantics

- One `<h1>` per page (`/`: the name; `/work`: "All work"; `/work/[slug]`: the project name; `/about`: "About").
- Heading order never skips levels. Mono section indices (`02 SELECTED WORK`) are rendered as the visible text of the `<h2>`, not as a separate decorative element, so the accessible name is meaningful ("Selected work"); the index number is wrapped in `aria-hidden` span *only if* it is purely decorative — decision: index is read (it is informative), so no hiding.
- Landmarks: `<header>` (masthead), `<nav aria-label="Primary">`, `<main>`, `<footer>`, `<nav aria-label="Project">` for prev/next.
- Lists are lists (`<ul>`/`<ol>`): stack lists, link lists, the work index (`<table>` on desktop with proper `<th scope="col">`, or a list on mobile — implement as a table always with responsive CSS to avoid two DOMs).
- Metadata blocks use `<dl>`/`<dt>`/`<dd>`.
- Skip link "Skip to content" as the first focusable element, visible on focus.

### Keyboard

- Everything interactive is reachable and operable by keyboard in DOM order that matches visual order (the alternating plates must keep image/text DOM order consistent: text first, then image — visual mirroring is CSS `order` within the plate only, and the whole plate is one link target region with a single focusable link, not multiple).
- Focus is always visible: 2px accent ring, 3px offset on dark; 2px ink ring on paper. Never `outline: none` without a replacement.
- Mobile menu: opening moves focus to the first item; Escape closes and returns focus to the "Menu" button; focus is trapped while open; `aria-expanded` on the button; `inert` on the page behind.
- Admin: all forms keyboard-operable; reorder controls are buttons ("Move up"/"Move down") — drag-and-drop, if ever added, must have this keyboard equivalent.

### Images and media

- Every image has alt text authored in the admin (required field; cannot publish without it). Decorative images (none planned on the public site) would use `alt=""`.
- Alt text guidance shown in the admin: describe what is on screen and what it shows about the project ("Study Flow dashboard showing the current lesson countdown and today's planned sessions").
- Portrait alt: "Levi Gatimu" plus a short description supplied by Levi.
- Video (URL only): embedded with `title`; captions are the responsibility of the hosting platform — noted in the admin help text.

### Colour and contrast

- All text ≥ 4.5:1; large text and UI components ≥ 3:1. Verified values in [color.md](color.md).
- Colour is never the only carrier of information: status is text (`ACTIVE`), links are underlined on hover *and* discernible by position/arrow glyph; the active nav item has a marker glyph.

### Motion

- `prefers-reduced-motion` honoured globally (see [motion.md](motion.md)); no autoplaying motion above the fold; no content depends on animation to appear.

### Text and zoom

- Text can be resized to 200% without loss of content; layouts reflow. No fixed heights around text.
- `clamp()` type has a rem floor so user font-size preferences scale the whole site.
- Language declared: `<html lang="en">`.
- Minimum body line-height 1.5, paragraph spacing ≥ 1em.

### Forms (admin)

- Every input has a visible `<label>`; helper text linked via `aria-describedby`; errors announced via a live region and associated with the field (`aria-invalid`, `aria-errormessage`).
- Required fields are marked in the label text, not only by an asterisk colour.
- Save/publish results announced in a polite live region (toast + `role="status"`).
- File inputs accept only allowed types and state limits in the helper text.

### Links

- Link text is meaningful out of context: "Read the case study: Study Flow" (visually "Read the case study →" with the project name in a visually-hidden span), never bare "View" or "Click here".
- External links carry an arrow glyph `↗` and `rel="noopener"`; the glyph is `aria-hidden` and the accessible name includes "(opens GitHub)" or similar via visually-hidden text where the destination is not obvious.

### Mobile

- Tap targets ≥ 44px; adequate spacing between adjacent links in the footer and filter rows.
- Viewport meta allows zoom (`user-scalable` not disabled).
- Orientation not locked.

## Verification (definition of done for every UI task)

1. `axe` (via `@axe-core/playwright`) reports zero violations on `/`, `/work`, one case study, `/about`, `/admin/login`, `/admin/projects`, one project editor.
2. Manual keyboard walkthrough of each page: Tab order, visible focus, Escape behaviours, skip link.
3. Screen reader smoke test (NVDA on Windows — available on the dev machine): landmarks navigable, headings list is sensible, images announce their alt, tables read correctly.
4. Reduced-motion toggle test in DevTools.
5. 200% zoom test at 1280px width.
6. Lighthouse Accessibility = 100 (necessary, not sufficient).
