# Backend (Supabase)

Everything the site needs on the Supabase side, as plain SQL you run yourself. No CLI, no MCP.

## One-time setup (about 5 minutes)

### 1. Run the migrations, in order

Supabase Dashboard → **SQL Editor** → **New query** → paste the file → **Run**.

| Order | File | What it does |
|-------|------|--------------|
| 1 | `migrations/0001_init.sql` | Tables, enums, triggers, indexes, the single `site_settings` row, `admins` table, `is_admin()` and all Row Level Security policies |
| 2 | `migrations/0002_storage.sql` | Creates the public `media` bucket (5 MB per file, images only) and its policies |
| 3 | `migrations/0003_seed_technologies.sql` | Starter technology list for the picker (optional; edit later in the admin) |
| 4 | `migrations/0004_admin_user.sql` | Makes the dashboard user the admin (UID already filled in) |
| 5 | `migrations/0005_site_copy.sql` | Adds the "Beyond software" highlights and fills in the descriptive bio, intro and now text (all editable in Admin > Site) |
| 6 | `migrations/0006_analytics_and_journey.sql` | Cookieless page-view analytics for the admin dashboard, and the Journey timeline column |

All three are safe to run again if something goes wrong halfway.

### 2. Create your admin login

Dashboard → **Authentication** → **Users** → **Add user** → *Create new user*:
- Email: your email
- Password: a long random one from your password manager
- Tick **Auto Confirm User**

Then Dashboard → **Authentication** → **Sign In / Providers** → Email → turn **off** "Allow new users to sign up". Only you should ever be able to log in.

### 3. Make that user the admin

Run `migrations/0004_admin_user.sql` in the SQL editor (the UID is already in it). If you ever create a different user, replace the UID in that file and run it again.

### 4. Check it worked

- Log in at `/admin/login` on the site.
- In a private window (logged out) open `/work` — you should see nothing until you publish a project. Drafts are hidden **by the database**, not just by the app.

## Adding a migration later

Create `migrations/0004_something.sql`, write idempotent SQL (`create table if not exists`, `drop policy if exists` …), run it in the SQL editor, commit it. Keep this table updated:

| File | Applied on |
|------|------------|
| 0001_init.sql | 2026-09-15 |
| 0002_storage.sql | 2026-09-15 |
| 0003_seed_technologies.sql | 2026-09-15 |
| 0004_admin_user.sql | |
| 0005_site_copy.sql | |
| 0006_analytics_and_journey.sql | |

## Keys

The app uses only the **publishable** key (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). It is safe in the browser because every table has RLS. **Never** put the service-role/secret key in `.env.local` or Vercel — nothing here needs it.

## Backups

Content is small. Before any risky change: Dashboard → **Database** → **Backups** (if available on your plan), or use **Admin → Site → Export** in the app to download a JSON snapshot.
