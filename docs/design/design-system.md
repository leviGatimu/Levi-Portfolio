# Design System

This is the index of the system. Details live in the linked documents; this file lists the **tokens** and the **component inventory** so implementation knows exactly what to build and nothing more.

## Token sources

| Token group | Document | Implementation |
|-------------|----------|----------------|
| Colour | [color.md](color.md) | CSS custom properties on `:root`, mapped into Tailwind v4 `@theme` |
| Type | [typography.md](typography.md) | `next/font` + `@theme` font families; fluid sizes as `--text-*` |
| Spacing, grid, breakpoints | [layout-and-grid.md](layout-and-grid.md) | Tailwind spacing scale + `.grid-editorial` utility |
| Motion | [motion.md](motion.md) | `--ease-*`, `--dur-*` custom properties |
| Radius | This doc | `--radius-0: 0` (public), `--radius-sm: 4px` (admin inputs only) |
| Z-index | layout doc | `--z-masthead: 10`, `--z-menu: 20`, `--z-dialog: 30` |

Rule: components consume tokens only. A hex, px font-size, or raw easing in a component file fails review.

## Component inventory — public site

Small on purpose. Each is a server component unless marked (client).

| Component | Purpose | Props (essential) | Notes |
|-----------|---------|-------------------|-------|
| `Masthead` | Site header | `currentPath` | Sticky; contains `MobileMenu` (client) |
| `MobileMenu` (client) | Full-screen nav on < lg | links | Focus trap, Escape, `inert` |
| `Footer` | Site footer | `settings`, `lastUpdated` | |
| `SectionHeader` | Mono index + h2 | `index`, `title`, `as` | The `02 SELECTED WORK` pattern |
| `Meta` | Mono uppercase label text | children | Tiny; used everywhere |
| `MetaList` | `<dl>` label/value block | `items[]` | Two-column ≥ md |
| `Rule` | Hairline | `tone` | `<hr>` styled |
| `Prose` | Markdown-rendered narrative | `markdown` | Wraps `react-markdown`; constrained element set; measure 65ch |
| `ProjectPlate` | Featured project on homepage | `project`, `align` | Alternating; image bleeds |
| `ProjectRow` | Index/ledger row | `project`, `showThumb` | Table row on desktop |
| `ProjectHeader` | Case-study top | `project`, `position` | Name, one-liner, `MetaList` |
| `ProjectSection` | Label-left / prose-right block | `label`, children | Sticky label ≥ lg |
| `Gallery` | Case-study images | `images[]` | Offsets, `wide` flag, captions |
| `NextProject` | Footer of case study | `project` | |
| `ExperimentTile` | Experiments strip item | `project` | 4:3 |
| `Portrait` | The portrait with crop variants | `variant: "home" \| "about"` | `next/image`, priority on home |
| `Bleed` | Layout helper allowing a child to extend into the margin | `side: "left" \| "right" \| "both"` | CSS only |
| `Reveal` (client) | Below-fold reveal wrapper | children | IntersectionObserver; visible without JS |
| `LocalTime` (client) | Kigali local time in the contact block | — | Updates every minute; renders server time first |
| `ExternalLink` | Link with `↗` and rel | `href`, children | |
| `TechList` | Mono inline list `NEXT.JS · ELECTRON` | `techs[]` | Uses `·` separators, not chips |
| `StatusBadge` | Text status `ACTIVE` | `status` | Text only, mono, no colour fill |

Deliberately **not** in the inventory: Card, Button (public site has no buttons — links only), Badge/Chip with fill, Avatar, Modal, Carousel, Tabs, Accordion, Tooltip, Skeleton loaders (pages are server-rendered), Toast (public).

## Component inventory — admin

Conventional, calm, built from the same tokens. Hand-written with Tailwind; no component library in V1 (the admin has ~8 screens; a UI library is more surface than it saves — see DECISIONS).

| Component | Purpose |
|-----------|---------|
| `AdminShell` | Sidebar + content area, current section |
| `Button` | `primary` (accent fill), `secondary` (rule border), `danger` (danger border) |
| `Field` | Label + input/textarea/select + help + error, wired with `aria-describedby` |
| `SlugField` | Auto-generates from name, editable, uniqueness check on blur |
| `MarkdownField` | Textarea with monospace, live preview toggle (server-rendered preview via the same `Prose`) |
| `ImageUpload` | Drop zone + file input; validation; progress; alt text field; remove |
| `GalleryManager` | List of `ImageUpload` items with move up/down, caption, `wide` toggle |
| `TechPicker` | Multi-select from `technologies` with inline "add new" |
| `LinksEditor` | Repeating rows: label, URL, kind |
| `CollaboratorsEditor` | Repeating rows: name, role, URL |
| `StatusControl` | Draft/Published toggle + Featured toggle + validation summary of what blocks publishing |
| `Toast` / `Dialog` | Feedback and confirmations (`role="status"`, `role="alertdialog"`) |
| `Table` | Project list with search and filters |

## Iconography

Lucide, tree-shaken, **admin only** (upload, trash, arrow-up/down, external-link, check, x, search). The public site uses text glyphs: `↗` external, `→` internal call to action, `·` separator, `●` now-dot. This keeps the public bundle icon-free and on-brand.

## Radius, shadow, border

- Public: radius `0` everywhere; no shadows; borders are 1px `rule` hairlines.
- Admin: radius `4px` on inputs and buttons; one shadow token for dialogs only (`0 8px 24px rgba(0,0,0,.4)`).

## States to design for every component

Loading (admin only — public pages are fully server-rendered), empty, error, partial (draft with missing fields), success, overflow (long names, long stacks, many gallery images). Each component's task in the implementation plan lists these states as acceptance criteria.
