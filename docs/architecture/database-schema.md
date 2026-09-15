# Database Schema

Supabase Postgres. Schema lives in `supabase/migrations/*.sql` (source of truth); TypeScript types are generated from it (`supabase gen types typescript`).

## Entity decisions

| Candidate entity (brief) | Decision | Reason |
|--------------------------|----------|--------|
| `projects` | **Table** | Core entity |
| `technologies` + `project_technologies` | **Tables** | Technologies are shared across projects, filterable, and carry a proficiency level for the About page; a join table is the correct model |
| `project_images` | **Table** | Ordered, with metadata (alt, dimensions, cover flag) — needs rows |
| `collaborators` + `project_collaborators` | **Rejected → JSONB column `projects.collaborators`** | Collaborators are display-only, never queried across projects, and rarely repeat. Two tables and an admin screen for ~5 names is over-engineering. Shape validated by zod. |
| `experiments` | **Rejected → `projects.type = 'experiment'`** | Same shape as a project; a separate table duplicates everything |
| `timeline` | **Rejected** | No timeline page in V1; About is prose |
| `about_content` | **Merged into `site_settings`** | A single-row settings table holds all site-wide copy |
| `site_settings` | **Table (single row)** | Opening statement, bios, now, links, portrait paths |
| `admins` | **Table** | Explicit allow-list of admin user ids for RLS |

Five tables + one join table. That is the whole schema.

## Tables

### `projects`

| Column | Type | Null | Default | Notes |
|--------|------|------|---------|-------|
| `id` | `uuid` | no | `gen_random_uuid()` | PK |
| `slug` | `text` | no | | `UNIQUE`; `CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')` |
| `name` | `text` | no | | `CHECK (char_length(name) BETWEEN 1 AND 60)` |
| `one_liner` | `text` | no | `''` | ≤ 120 |
| `summary` | `text` | no | `''` | ≤ 400 |
| `body_md` | `text` | no | `''` | Markdown narrative |
| `type` | `project_type` enum | no | `'project'` | `project` · `experiment` · `client` |
| `status` | `project_status` enum | no | `'active'` | `active` · `paused` · `completed` · `archived` |
| `year` | `smallint` | no | | `CHECK (year BETWEEN 2020 AND 2100)` |
| `timeline` | `text` | yes | | free text, ≤ 60 |
| `role` | `text` | no | `''` | ≤ 120 |
| `team` | `text` | no | `''` | ≤ 200 |
| `collaborators` | `jsonb` | no | `'[]'` | array of `{name, role, url?}`; `CHECK (jsonb_typeof(collaborators) = 'array')` |
| `links` | `jsonb` | no | `'[]'` | array of `{label, url, kind}`; same check |
| `repo_visibility` | `repo_visibility` enum | no | `'none'` | `public` · `private` · `none` |
| `video_url` | `text` | yes | | |
| `cover_aspect` | `cover_aspect` enum | no | `'16:10'` | `16:10` · `4:5` |
| `is_featured` | `boolean` | no | `false` | |
| `is_published` | `boolean` | no | `false` | |
| `sort_order` | `integer` | no | `0` | lower first; admin assigns gaps of 10 |
| `published_at` | `timestamptz` | yes | | set on first publish |
| `created_at` | `timestamptz` | no | `now()` | |
| `updated_at` | `timestamptz` | no | `now()` | trigger `set_updated_at` |

Indexes:

- `projects_slug_key` (unique, from constraint)
- `projects_published_sort_idx ON (is_published, sort_order)` — every public list query
- `projects_featured_idx ON (sort_order) WHERE is_featured AND is_published` — homepage plates (partial)
- `projects_type_idx ON (type) WHERE is_published` — /work filter

### `technologies`

| Column | Type | Null | Default | Notes |
|--------|------|------|---------|-------|
| `id` | `uuid` | no | `gen_random_uuid()` | PK |
| `slug` | `text` | no | | `UNIQUE` |
| `name` | `text` | no | | e.g. `Next.js`, display form |
| `group` | `tech_group` enum | no | | `language` · `frontend` · `backend` · `database` · `ai` · `robotics` · `embedded` · `desktop` · `devops` · `design` · `hardware` |
| `proficiency` | `proficiency` enum | yes | | `strong` · `comfortable` · `learning` · `experimental`; null = not shown on About |
| `show_on_about` | `boolean` | no | `true` | |
| `sort_order` | `integer` | no | `0` | within group |
| `created_at`, `updated_at` | `timestamptz` | no | | |

Index: `technologies_group_sort_idx ON (group, sort_order)`.

### `project_technologies`

| Column | Type | Notes |
|--------|------|-------|
| `project_id` | `uuid` | FK → `projects(id) ON DELETE CASCADE` |
| `technology_id` | `uuid` | FK → `technologies(id) ON DELETE RESTRICT` (can't delete a tech in use) |
| `sort_order` | `integer` | order of the stack list on the project |
| PK | `(project_id, technology_id)` | |

Index: `project_technologies_tech_idx ON (technology_id)`.

### `project_images`

| Column | Type | Null | Default | Notes |
|--------|------|------|---------|-------|
| `id` | `uuid` | no | `gen_random_uuid()` | PK |
| `project_id` | `uuid` | no | | FK → `projects(id) ON DELETE CASCADE` |
| `storage_path` | `text` | no | | `UNIQUE`; path inside bucket `media` |
| `alt` | `text` | no | | `CHECK (char_length(alt) >= 3)` |
| `caption` | `text` | yes | | |
| `width` | `integer` | no | | `CHECK (width > 0)` |
| `height` | `integer` | no | | |
| `bytes` | `integer` | no | | for admin display and quotas |
| `is_cover` | `boolean` | no | `false` | |
| `is_wide` | `boolean` | no | `false` | |
| `sort_order` | `integer` | no | `0` | |
| `created_at` | `timestamptz` | no | `now()` | |

Indexes and constraints:

- `project_images_project_sort_idx ON (project_id, sort_order)`
- `project_images_one_cover_idx UNIQUE (project_id) WHERE is_cover` — at most one cover per project, enforced by the database

### `site_settings` (single row)

| Column | Type | Notes |
|--------|------|-------|
| `id` | `boolean` | PK, `DEFAULT true`, `CHECK (id)` — the classic single-row trick |
| `display_name` | `text` | `Levi Gatimu` |
| `tagline` | `text` | `Student Developer · Full-Stack · AI · Robotics` |
| `meta_line` | `text` | the mono line under the name |
| `meta_line_secondary` | `text` | optional second line (aviation) |
| `opening_statement` | `text` | |
| `bio_short_md` | `text` | ≤ 80 words, Markdown (inline only) |
| `bio_long_md` | `text` | About page body (Markdown; may contain `##` sections: Education, Leadership, Aviation…) |
| `now_md` | `text` | |
| `now_updated_at` | `timestamptz` | shown as "Updated 14 Sep 2026" |
| `email` | `text` | |
| `github_url`, `linkedin_url`, `instagram_url` | `text` null | only rendered when present |
| `portrait_home_path`, `portrait_about_path` | `text` null | storage paths |
| `portrait_alt` | `text` | |
| `location` | `text` | `Kigali, Rwanda` |
| `timezone` | `text` | `Africa/Kigali` for the local-time display |
| `updated_at` | `timestamptz` | |

### `admins`

| Column | Type | Notes |
|--------|------|-------|
| `user_id` | `uuid` | PK, FK → `auth.users(id) ON DELETE CASCADE` |
| `created_at` | `timestamptz` | |

Seeded once with the admin's auth user id (via SQL after creating the user in the Supabase dashboard).

## Enums

```sql
create type project_type    as enum ('project','experiment','client');
create type project_status  as enum ('active','paused','completed','archived');
create type repo_visibility as enum ('public','private','none');
create type cover_aspect    as enum ('16:10','4:5');
create type tech_group      as enum ('language','frontend','backend','database','ai','robotics','embedded','desktop','devops','design','hardware');
create type proficiency     as enum ('strong','comfortable','learning','experimental');
```

## Functions and triggers

```sql
-- updated_at maintenance
create function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
-- applied to projects, technologies, site_settings

-- admin check used by every RLS policy
create function is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- published_at set on first publish
create function set_published_at() returns trigger language plpgsql as $$
begin
  if new.is_published and old.is_published is distinct from true and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end $$;
```

## Row Level Security

RLS is **enabled on every table**. Policies:

| Table | SELECT (anon + authenticated) | INSERT / UPDATE / DELETE |
|-------|-------------------------------|--------------------------|
| `projects` | `is_published = true` **or** `is_admin()` | `is_admin()` |
| `project_technologies` | project is published or `is_admin()` (via `exists` subquery) | `is_admin()` |
| `project_images` | project is published or `is_admin()` | `is_admin()` |
| `technologies` | `true` (harmless public list) | `is_admin()` |
| `site_settings` | `true` | UPDATE only, `is_admin()`; no INSERT/DELETE policies (row is created by migration) |
| `admins` | `is_admin()` (a user may see the list only if they are one) | none via API (managed by migration/SQL) |

Draft projects are therefore invisible to the anon key **at the database level**, regardless of application bugs.

## Ordering model

- One integer `sort_order` on `projects` drives *all* orderings (homepage featured plates, /work list, next-project links, ledger). Featured plates are `is_featured = true` rows in `sort_order`.
- Admin "move up/down" swaps `sort_order` with the neighbour in a single transaction (server action). Gaps of 10 are assigned on create (`max + 10`) so inserts don't require renumbering.
- No `featured_order` column: featured ordering is the global ordering filtered. Simpler and consistent with the /work page.

## Public read queries (the whole surface)

| Query | Used by |
|-------|---------|
| `getFeaturedProjects()` — published & featured, with cover image + technologies, by `sort_order` | Home plates |
| `getPublishedProjects({ type? })` — published, with cover + technologies, by `sort_order` | Home ledger, /work, sitemap |
| `getProjectBySlug(slug)` — published, with all images + technologies + prev/next by `sort_order` | Case study, OG |
| `getSiteSettings()` | Layout, home, about, footer |
| `getTechnologiesForAbout()` — `show_on_about`, grouped | About |
| `getLastUpdated()` — `greatest(max(projects.updated_at), site_settings.updated_at)` | Footer |

Each returns typed rows via one query with embedded relations (Supabase `select('*, project_images(*), project_technologies(sort_order, technologies(*))')`), so no N+1.

## Migrations

- Numbered SQL files `supabase/migrations/0001_init.sql`, … applied via Supabase CLI (`supabase db push`) or the dashboard SQL editor. Every migration is idempotent where practical (`create ... if not exists`, `do $$ ... $$` guards).
- Reversibility: each migration file ends with a commented `-- down:` section describing the reverse; destructive migrations (dropping columns) are never applied to production without a backup (see deployment).
- Seed: `supabase/seed.sql` inserts the `site_settings` row (placeholders clearly marked, publish gate prevents them from rendering) and the initial `technologies` list. **No project rows are seeded** — projects are created through the admin, from real content.

## Sizing reality check

Tens of projects, hundreds of images, one settings row. Every query is index-covered; the free tier is orders of magnitude beyond need. No partitioning, no caching layer, no read replicas — ever, for this site.
