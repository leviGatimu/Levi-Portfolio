# Authentication and Authorization

## Model

- **One admin.** Exactly one user (Levi) may access `/admin`. There are no roles, no invitations, no public sign-up.
- **Supabase Auth, email + password.** Sign-ups disabled in the Supabase dashboard (`Enable email signups: off`); the single user is created manually in the dashboard once.
- **Authorization is an allow-list**, not "any authenticated user": the `admins` table holds the admin's `auth.users.id`, and `is_admin()` is the only check used by RLS and the app.

Why not magic links / OAuth: magic links depend on email deliverability every login; GitHub OAuth is fine but adds a provider configuration and a public "sign in with GitHub" affordance to a page that should be invisible. Email + password with a long random password in a password manager is the simplest secure option for one user. Can switch later without schema change.

## Session handling

- `@supabase/ssr` manages the session as **httpOnly cookies**; the browser never sees a token in JS.
- Access token lifetime: default (1 hour); refresh tokens rotate. The proxy/middleware refreshes on each request under `/admin`.
- "Remember me" is not offered; sessions last as long as the refresh token is valid (default 1 week of inactivity — configurable in Supabase; set to 7 days).
- Logout: server action calls `supabase.auth.signOut()` and redirects to `/admin/login`.

## Request flow

```
GET /admin/projects
  ├─ proxy.ts (edge): createServerClient with cookies → getUser()
  │     no user → redirect /admin/login?next=/admin/projects
  ├─ app/admin/layout.tsx (server): getUser() again; select from admins where user_id = uid
  │     not admin → signOut + redirect /admin/login (an authenticated non-admin can only exist if someone
  │     created a user in the dashboard; still handled)
  └─ page renders with the user's session; RLS enforces is_admin() on every query
```

Server actions repeat the check (`requireAdmin()` helper) as their first line. Middleware is a UX convenience; the **layout check + RLS** are the security boundary.

## Login page

- `/admin/login`: email + password form, server action `signIn`. Generic error message ("Email or password is incorrect") regardless of which failed.
- Rate limiting: Supabase Auth applies its own rate limits to `/token`; additionally the action enforces a small in-memory backoff (per-IP, 5 attempts / 15 min) — best-effort on serverless, documented as such. Vercel's WAF/attack-challenge mode is the real control if abuse ever appears.
- No "forgot password" link in the UI; password resets are done from the Supabase dashboard (one user).
- The login page is `noindex, nofollow` and excluded from the sitemap.

## Protecting the public site from the admin

- Public pages use the anon client and never call auth. No admin UI, links, or hints render on public pages (not even a hidden `/admin` link — Levi types the URL).
- Server actions for writes exist only under `lib/actions/*` and all begin with `requireAdmin()`.

## Security considerations

| Threat | Mitigation |
|--------|------------|
| Credential stuffing on the login form | Strong unique password; Supabase rate limits; backoff; consider enabling Supabase MFA (TOTP) in V2 — supported natively |
| Session theft via XSS | httpOnly cookies; no raw HTML rendering; CSP (see security doc) |
| CSRF on server actions | Next.js server actions enforce same-origin (Origin/Host check) by default; `allowedOrigins` configured for the production domain |
| Privilege escalation via a second user | `admins` allow-list; a stray user has no rights |
| Leaked anon key | Public by design; RLS limits it to published rows and no writes |
| Leaked service role key | Never deployed to Vercel; kept only in the developer's local `.env` for CLI use; rotate if exposed |
| Admin route discovery | Not secret by design (security through obscurity is not relied on); the route is simply useless without credentials |

## Bootstrap procedure (once)

1. Supabase dashboard → Authentication → disable sign-ups; create user with Levi's email and a generated password.
2. Run migration `0002_admins.sql` and then `insert into admins (user_id) values ('<uid>')` via the SQL editor.
3. Log in at `/admin/login`. Verify that `/admin/projects` loads and that the anon client (`curl` with the anon key) cannot read a draft project.
