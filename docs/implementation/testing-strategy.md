# Testing Strategy

Small, fast, trustworthy. Tests protect **behaviour and contracts** (what the site shows, what the admin allows, what the database permits) — not implementation details. A flaky test is deleted or fixed the same day.

## Layers

| Layer | Tool | Runs | Scope |
|-------|------|------|-------|
| Static | TypeScript, ESLint, Prettier | every commit (CI) | types, banned patterns (gradients/shadows in public components), unused code |
| Unit | Vitest | every commit | pure logic: zod schemas, `getPublishBlockers`, slugify, `Prose` rendering rules, markdown caption convention, date/`LocalTime` formatting, `sizes` helpers |
| Integration (DB) | Vitest + Supabase anon/admin clients against the hosted project (or local stack) | CI when env present; always locally | RLS contracts, unique cover index, cascade delete, `is_admin()` |
| Security | Vitest (unit) + Playwright (headers) | every commit | upload validation (sniff, size, SVG, EXIF), XSS inertness, CSP/HSTS present |
| E2E | Playwright | every PR (preview URL) | public routes render; keyboard menu; reduced motion; admin create→publish flow; 404 for drafts |
| Accessibility | `@axe-core/playwright` | inside E2E | zero violations on all public routes + 3 admin screens |
| Performance | Lighthouse CI | every PR (preview URL) | budgets in performance.md |
| Manual | Checklists | Phase 7 + before each release | NVDA pass, zoom 200%, cross-browser, slow network |

## What we deliberately don't test

- Visual snapshots (brittle across fonts/OS; design review is manual at Phase 6).
- Supabase's own behaviour (auth token refresh, storage CDN).
- Every component in isolation with a DOM library — pages are server-rendered; e2e covers them more truthfully.

## Key test cases

### Contracts (unit)

- `projectSchema`: rejects slug `New`, `work`, `a--b`; accepts `study-flow`; caps one-liner at 120; requires ≥ 1 technology on publish path.
- `getPublishBlockers`: returns exact blocker list for a draft missing cover/alt/body; empty for a complete project; warnings independent of blockers.
- `Prose`: `<script>` and `onerror` stripped; `javascript:` links removed; `![alt](url)` followed by `*caption*` renders `<figure><img alt><figcaption>`; `# H1` becomes `h2`.
- `slugify("Study Flow!")` → `study-flow`.
- `formatKigaliTime(date)` stable across timezones (uses `Intl` with `Africa/Kigali`).

### Database (integration)

- Anon client: `select * from projects` returns only published; `insert` fails; `update site_settings` fails; storage upload fails.
- Admin client: can read drafts; second `is_cover=true` insert for the same project fails (unique partial index); deleting a project cascades images; deleting a technology in use fails (RESTRICT).
- `set_published_at` trigger sets timestamp once.

### Upload (security)

- `.html` bytes renamed `.png` → rejected. 6 MB → rejected. SVG → rejected. 200×200 → rejected (min 320). JPEG with GPS EXIF → output has no EXIF.

### E2E (Playwright)

1. **Public smoke:** `/`, `/work`, `/about`, one `/work/[slug]`, `/sitemap.xml`, `/robots.txt` → 200, correct `<title>`, one `h1`, JSON-LD present.
2. **Menu:** at 390px, "Menu" opens overlay, focus moves in, Escape closes and returns focus, page behind is `inert`.
3. **Reduced motion:** with `prefers-reduced-motion: reduce`, no element has a transform transition (computed style check on a revealed block).
4. **Draft invisibility:** create a draft via admin, `GET /work/<slug>` → 404; publish → 200; unpublish → 404.
5. **Admin flow:** login → new project → upload cover (fixture PNG) → fill required → publish panel shows no blockers → publish → project appears on `/work` and `/` (if featured) within 10 s.
6. **Reorder:** move a project up → order changes on `/work`.
7. **Headers:** CSP, HSTS, `X-Content-Type-Options` present on `/`.
8. **axe:** zero violations on all pages above (public + `/admin/login`, `/admin/projects`, editor).

E2E runs against a preview deployment with a dedicated **test project record** that the test creates and deletes (name prefixed `zz-e2e-`), so no fake content persists. Admin credentials for CI come from GitHub Actions secrets (a separate test admin user in `admins`).

## Fixtures

- One small real PNG screenshot (from Trace's public repo, with permission implied by its public licence — confirm) and one JPEG with synthetic EXIF for the EXIF test. No fake project text beyond the `zz-e2e-` record that is deleted at the end of the run.

## Commands

```
npm run typecheck      tsc --noEmit
npm run lint           eslint . && prettier --check .
npm run test           vitest run
npm run test:db        vitest run --project db   (needs env)
npm run e2e            playwright test           (BASE_URL env)
npm run lhci           lhci autorun              (BASE_URL env)
```

## Definition of done (every task)

Typecheck, lint, unit tests green; relevant integration/e2e added or updated; axe clean on touched pages; docs updated if behaviour or a decision changed; HANDOFF.md updated.
