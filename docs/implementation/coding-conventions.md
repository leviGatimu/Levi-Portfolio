# Coding Conventions

## Language and typing

- TypeScript `strict` plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`.
- `any` is forbidden (`@typescript-eslint/no-explicit-any: error`). Use `unknown` and narrow.
- Database types come from `types/database.ts` (generated). Domain types in `lib/db/types.ts` are derived from them (`Pick`, `&`), never hand-duplicated.
- Zod schemas are the single source for form shapes; infer types with `z.infer`.
- Prefer `type` aliases over `interface` except when declaration merging is needed (never here).

## React / Next.js

- Server components by default. A file gets `'use client'` only if it uses state, effects, refs, or browser APIs — and then it is as small as possible (leaf).
- No data fetching in client components. No `useEffect` for data.
- Server actions live in `lib/actions/*.ts` with `'use server'` at the top; each exported function: `requireAdmin()` → parse → do → revalidate → return `ActionResult`.
- Components never import Supabase; they receive data as props from pages or call `lib/db` (server) functions.
- Pages are thin: fetch → compose sections. Sections are components under `components/public/`.
- No default exports except where Next.js requires them (`page.tsx`, `layout.tsx`, `error.tsx`, etc.).
- Props typed inline for small components; `type XProps` for larger ones. No `React.FC`.
- Key lists by database id, never by index.

## Styling

- Tailwind utilities with tokens. No arbitrary values (`text-[17px]`) except in a documented one-off with a comment.
- No inline `style` except for values that come from data (e.g. `aspect-ratio` from image dimensions, `--cols`).
- Class composition with a tiny `cn()` (`clsx`-like, hand-written ~6 lines) — no `tailwind-merge` dependency unless conflicts prove real.
- Component-local CSS (Tailwind `@layer components`) only for patterns used ≥ 3 times (e.g. `.link-underline`, `.grid-editorial`).
- Public site: `rounded-none` everywhere; no shadows; no gradients — enforced by a lint rule banning `bg-gradient-*`, `shadow-*`, `backdrop-blur*` in `components/public/**`.

## Naming

- Files: `kebab-case.ts` for modules, `PascalCase.tsx` for components.
- Components: nouns (`ProjectPlate`), hooks `useX`, actions verbs (`publishProject`), queries `getX`.
- Database: `snake_case`; booleans `is_*`; timestamps `*_at`.
- CSS tokens: `--color-*`, `--text-*`, `--spacing-*`, `--ease-*`, `--dur-*`.
- No abbreviations in names except `id`, `url`, `md`, `og`.

## Folder rules

- `app/` contains routing only; no shared components inside route folders except a route-private `_components/` when truly private.
- `components/public`, `components/admin`, `components/shared` — a public component never imports from admin and vice versa.
- `lib/db` = reads; `lib/actions` = writes; `lib/validation` = zod; `lib/storage` = bucket helpers; `lib/seo` = metadata builders.

## Errors and results

- Actions return `{ ok: true; data } | { ok: false; message; fieldErrors? }`. They never throw to the client.
- Reads throw on unexpected DB errors (surfaced by `error.tsx`); `notFound()` for missing rows.
- Log with `console.error(context, error)`; never log secrets or full request bodies.

## Accessibility in code

- Native elements first. `button` for actions, `a` for navigation. No `div onClick`.
- Every image: `alt` from data. Every form control: `<label htmlFor>`.
- Visually hidden text via a `.sr-only` utility for link context.
- `aria-*` only when native semantics are insufficient.

## Comments and docs

- Comments explain *why* (a constraint, a trade-off, a gotcha), never *what*. Reference docs by path when a decision is documented (`// see docs/architecture/storage-architecture.md — EXIF strip`).
- No commented-out code. No TODO comments in `main` — put them in `docs/TODO.md`.

## Git

- Conventional-ish messages: `feat(admin): publish validation panel`, `fix(home): plate bleed on xl`, `docs: …`, `chore: …`. Body explains why. Reference task ids (`T4.11`).
- One logical change per commit; PRs small; CI must pass; squash-merge to `main`.
- Never commit `.env*`, dumps, screenshots with personal data, or generated types without the migration that produced them.

## Dependencies

- Adding a production dependency requires a DECISIONS entry. Dev dependencies need a one-line justification in the PR.
- Pin exact versions in `package.json`; update deliberately.

## Content rules enforced in code

- No hardcoded project data in components. The only static text is UI chrome ("Work", "About", "Menu", "Skip to content", 404 copy).
- No fake placeholders that could ship: seed placeholders contain the literal `TODO` so the publish gate blocks them.
