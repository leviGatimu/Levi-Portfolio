# Security

## Threat model (realistic for this site)

| Asset | Threat | Likelihood | Impact |
|-------|--------|------------|--------|
| Admin account | Credential guessing, phishing | Low–medium | Defacement, false content under Levi's name |
| Database | Unauthorised writes via leaked anon key or missing RLS | Low if RLS is correct | Defacement |
| Storage | Malicious upload (SVG script, oversized files) | Low (admin-only writes) | XSS, quota exhaustion |
| Visitors | XSS via Markdown or metadata rendered unsafely | Medium if careless | Session theft is impossible (no visitor sessions); reputational harm |
| Levi's privacy | Publishing phone, age, EXIF location, personal projects | Medium (the old site did) | Real-world harm to a minor |
| Availability | Bot traffic against server actions / login | Low | Cost/rate-limit noise |

The most important controls are, in order: **RLS correctness, no raw HTML rendering, upload validation, privacy of personal data, secrets hygiene.**

## Checklist (each item is an acceptance criterion in the implementation plan)

### Database

- [ ] RLS enabled on every table (verified by a test that queries each table with the anon key and expects only published rows / no writes).
- [ ] All write policies use `is_admin()`; no policy uses `auth.role() = 'authenticated'` alone.
- [ ] `is_admin()` is `security definer` with a fixed `search_path`.
- [ ] Constraints enforce shape (enums, checks, unique cover, unique slug).
- [ ] No service-role key in Vercel.

### Authentication

- [ ] Sign-ups disabled in Supabase; one user; long random password in a password manager.
- [ ] `admins` allow-list; layout + actions call `requireAdmin()`.
- [ ] Cookies httpOnly, `Secure`, `SameSite=Lax` (Supabase SSR defaults).
- [ ] Login errors are generic; login page `noindex`.
- [ ] Logout invalidates the session server-side.
- [ ] V2 candidate: TOTP MFA (Supabase supports it).

### Server actions and inputs

- [ ] Every action: `requireAdmin()` → `zod.parse` → DB → `revalidateTag`. No action trusts client-provided ids without an RLS-backed query.
- [ ] Zod schemas cap string lengths, validate URLs (`https?:` only), validate slug pattern, enums, and JSON shapes for `links`/`collaborators`.
- [ ] Reorder actions operate only on ids fetched server-side.
- [ ] Server actions' `allowedOrigins` set to the production host.

### Rendering / XSS

- [ ] Markdown rendered with `react-markdown`, `skipHtml: true`, `remark-gfm` only; link `href` protocols restricted to `http`, `https`, `mailto`.
- [ ] No `dangerouslySetInnerHTML` anywhere except JSON-LD (built from typed data, `JSON.stringify`, `<` escaped).
- [ ] All user-controlled strings (name, one-liner, alt, captions) rendered as React text (auto-escaped).
- [ ] CSP as in the deployment doc; `frame-ancestors 'none'`.
- [ ] Video embeds only from an allow-list (`youtube-nocookie.com`, `player.vimeo.com`); any other `video_url` renders as a plain link.

### Uploads

- [ ] Type whitelist (png/jpeg/webp/avif), byte sniffing, size cap 5 MB, dimension bounds, EXIF stripped.
- [ ] UUID filenames; paths built server-side; no SVG.
- [ ] Storage write policies `is_admin()`; bucket public read only.

### Privacy

- [ ] No phone number, no age, no home address, no school timetable/ID numbers anywhere on the site or in metadata.
- [ ] Photos: EXIF stripped; no images of other people without consent (Planetary Scout team photos need permission).
- [ ] Analytics cookieless (Vercel Web Analytics); no third-party trackers; no cookie banner needed.
- [ ] Email displayed as text and `mailto:` (accept that scrapers will find it; obfuscation harms accessibility).
- [ ] Private repos are stated as private, not linked.

### Secrets and configuration

- [ ] `.env*` git-ignored; `.env.example` has no real values.
- [ ] No secrets in `docs/`, `HANDOFF.md`, screenshots, or commit messages.
- [ ] Supabase keys rotated if ever pasted anywhere public.
- [ ] GitHub repo private; branch protection on `main`.

### Rate limiting and abuse

- [ ] Supabase Auth rate limits (default) on login; best-effort in-memory backoff in the action.
- [ ] Upload action limited to authenticated admin only — no anonymous write path exists, so no public rate-limit surface.
- [ ] If abuse appears: Vercel Firewall rules / attack challenge mode (no code change).

### Dependencies

- [ ] Eleven production dependencies (technical-architecture doc); `npm audit` in CI; Dependabot enabled for security updates only.

## Verification tests (automated)

1. **RLS test** (Vitest, uses anon key against a test project or local stack): draft project not readable; insert into `projects` rejected; update to `site_settings` rejected; storage upload rejected.
2. **Markdown XSS test**: body containing `<script>`, `<img onerror>`, `javascript:` links renders inert.
3. **Upload validation test**: renamed `.html` as `.png` rejected; 6 MB file rejected; SVG rejected; EXIF GPS removed from output.
4. **Headers test** (Playwright): production build responds with the CSP and HSTS headers.
