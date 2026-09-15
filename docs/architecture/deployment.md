# Deployment

## Topology

```
GitHub repo (private)
   main ────────────► Vercel Production  ──► <project>.vercel.app (free domain, D23)
   feature/* PRs ───► Vercel Preview     ──► *.vercel.app (noindex)
                               │
                               └──► Supabase project "portfolio" (production)
Supabase CLI local stack (developer machine) ──► schema authoring, migrations
```

One Supabase project in V1. Previews point at production data (read-mostly; admin writes from a preview are real writes — acceptable for a single author, documented). If schema changes become frequent, add a second Supabase project for previews (Supabase Branching is the alternative but it is a paid feature).

## Environment variables

| Variable | Local `.env.local` | Vercel Preview | Vercel Production |
|----------|--------------------|----------------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✓ | ✓ | ✓ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓ | ✓ | ✓ |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://$VERCEL_URL` (set via Vercel system env) | `https://<project>.vercel.app` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✓ (CLI/seeding only; git-ignored) | ✗ | ✗ |
| `SUPABASE_DB_URL` | ✓ (migrations) | ✗ | ✗ |

`.env.example` documents every variable with a comment. `.env*` is git-ignored except `.env.example`.

## Steps (first deploy)

1. Use the GitHub repository Levi provides (D23). Push `main`.
2. Create the Supabase project (region: closest to the audience and Vercel function region — choose `eu-central` or `eu-west`; Kigali has no local region; Vercel functions region set to `fra1` to match).
3. Apply migrations: `supabase link --project-ref <ref>` then `supabase db push`. Run `seed.sql`.
4. Create the admin user; insert into `admins` (authentication doc).
5. Create bucket `media` (public) and apply storage policies (migration).
6. Import the repo in Vercel; set env vars; set Functions region `fra1`; enable Web Analytics.
7. Deploy. Verify `/`, `/work`, `/about`, `/admin/login`.
8. Set `NEXT_PUBLIC_SITE_URL` to the production `https://<project>.vercel.app` URL; redeploy. (No custom domain in V1 — D23. Adding one later is a Vercel setting plus this variable.)
9. Submit sitemap to Google Search Console (optional).

## Continuous deployment

- Push to `main` → production deploy. PRs → preview deploy with a unique URL.
- Pre-deploy checks run in CI (GitHub Actions): `typecheck`, `lint`, `test`, `build`, and Playwright e2e against the build (with axe). A failing check blocks merge (branch protection on `main`).
- Preview deployments send `X-Robots-Tag: noindex` (via `next.config` headers when `VERCEL_ENV !== 'production'`).

## Image domains

`images.remotePatterns` includes the Supabase Storage public URL of the project. No other remote hosts (external images in Markdown render as plain `<img>` and are discouraged).

## Security headers

Set in `next.config.ts` `headers()` for all routes:

```
Content-Security-Policy: default-src 'self'; img-src 'self' data: https://<ref>.supabase.co https://va.vercel-scripts.com; script-src 'self' 'nonce-…' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https://<ref>.supabase.co https://vitals.vercel-insights.com; frame-src https://www.youtube-nocookie.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
X-Frame-Options: DENY
```

Nonce-based CSP with Next.js requires generating the nonce in the proxy/middleware; if that proves brittle, fall back to `'self'` + hashes for the few inline scripts Next emits, and document the change in DECISIONS. `style-src 'unsafe-inline'` is needed for Next's inline style attributes; acceptable.

## Error handling and logging

- `error.tsx` boundaries render calm messages. Unexpected server errors are logged via `console.error` and appear in Vercel's function logs (retained per plan).
- No third-party error tracker in V1 (Sentry etc. adds a vendor and bundle weight). If errors become hard to diagnose, add Sentry as a V2 decision.
- Admin actions return `{ ok: false, message }` results rendered in the form; they never throw raw errors to the UI.

## Backups

- Supabase free tier has no automatic point-in-time backups. Mitigation:
  - Content is small: a weekly GitHub Action runs `pg_dump` (schema + data for the six tables) and commits the dump to a private `backups` branch, plus a storage listing. A restore is `psql < dump.sql` + re-upload from a local copy of media.
  - The admin "Site" page offers **Export** (JSON of all tables + list of storage paths) for a manual snapshot before risky edits.
  - Media originals are additionally kept by Levi locally (screenshots are regenerable from the projects).

## Database migrations in production

- Migrations are applied by the developer with `supabase db push` before merging code that depends on them (expand → deploy → contract). Never run migrations from the app at runtime.
- Destructive migrations require a fresh export first.

## Rollback

- Code: Vercel "Promote previous deployment" (instant).
- Schema: the `-- down` section of the migration, applied manually; data restored from the latest export if needed.
- Content: no versioning in V1; the export is the safety net. (Content versioning is a V2 idea.)

## Health

- After each production deploy: Vercel checks (build success) + a GitHub Action smoke test hitting `/`, `/work`, `/sitemap.xml` and asserting 200 + expected `<title>`.
- Vercel Web Analytics and Speed Insights (Core Web Vitals) observed weekly; budgets in performance doc.
