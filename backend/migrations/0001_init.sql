-- 0001_init.sql
-- Core schema: enums, tables, triggers, indexes.
-- Run in the Supabase SQL editor (Dashboard -> SQL Editor -> New query -> paste -> Run).
-- Safe to run more than once.

-- ---------- Enums ----------
do $$ begin
  create type project_type as enum ('project', 'experiment', 'client');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_status as enum ('active', 'paused', 'completed', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type repo_visibility as enum ('public', 'private', 'none');
exception when duplicate_object then null; end $$;

do $$ begin
  create type cover_aspect as enum ('16:10', '4:5');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tech_group as enum (
    'language', 'frontend', 'backend', 'database', 'ai', 'robotics',
    'embedded', 'desktop', 'devops', 'design', 'hardware'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type proficiency as enum ('strong', 'comfortable', 'learning', 'experimental');
exception when duplicate_object then null; end $$;

-- ---------- Helper: updated_at ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- projects ----------
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  one_liner       text not null default '',
  summary         text not null default '',
  body_md         text not null default '',
  type            project_type not null default 'project',
  status          project_status not null default 'active',
  year            smallint not null default extract(year from now())::smallint,
  timeline        text,
  role            text not null default '',
  team            text not null default '',
  collaborators   jsonb not null default '[]'::jsonb,
  links           jsonb not null default '[]'::jsonb,
  repo_visibility repo_visibility not null default 'none',
  video_url       text,
  cover_aspect    cover_aspect not null default '16:10',
  is_featured     boolean not null default false,
  is_published    boolean not null default false,
  sort_order      integer not null default 0,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint projects_name_len check (char_length(name) between 1 and 60),
  constraint projects_one_liner_len check (char_length(one_liner) <= 120),
  constraint projects_summary_len check (char_length(summary) <= 400),
  constraint projects_year_range check (year between 2020 and 2100),
  constraint projects_collaborators_array check (jsonb_typeof(collaborators) = 'array'),
  constraint projects_links_array check (jsonb_typeof(links) = 'array')
);

create index if not exists projects_published_sort_idx on public.projects (is_published, sort_order);
create index if not exists projects_featured_idx on public.projects (sort_order) where is_featured and is_published;
create index if not exists projects_type_idx on public.projects (type) where is_published;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

create or replace function public.set_published_at()
returns trigger language plpgsql as $$
begin
  if new.is_published and coalesce(old.is_published, false) = false and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end $$;

drop trigger if exists projects_set_published_at on public.projects;
create trigger projects_set_published_at before update on public.projects
  for each row execute function public.set_published_at();

-- ---------- technologies ----------
create table if not exists public.technologies (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  "group"       tech_group not null,
  proficiency   proficiency,
  show_on_about boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists technologies_group_sort_idx on public.technologies ("group", sort_order);

drop trigger if exists technologies_set_updated_at on public.technologies;
create trigger technologies_set_updated_at before update on public.technologies
  for each row execute function public.set_updated_at();

-- ---------- project_technologies ----------
create table if not exists public.project_technologies (
  project_id    uuid not null references public.projects (id) on delete cascade,
  technology_id uuid not null references public.technologies (id) on delete restrict,
  sort_order    integer not null default 0,
  primary key (project_id, technology_id)
);

create index if not exists project_technologies_tech_idx on public.project_technologies (technology_id);

-- ---------- project_images ----------
create table if not exists public.project_images (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects (id) on delete cascade,
  storage_path  text not null unique,
  alt           text not null,
  caption       text,
  width         integer not null,
  height        integer not null,
  bytes         integer not null default 0,
  is_cover      boolean not null default false,
  is_wide       boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  constraint project_images_alt_len check (char_length(alt) >= 3),
  constraint project_images_dims check (width > 0 and height > 0)
);

create index if not exists project_images_project_sort_idx on public.project_images (project_id, sort_order);
-- At most one cover per project, enforced by the database.
create unique index if not exists project_images_one_cover_idx on public.project_images (project_id) where is_cover;

-- ---------- site_settings (single row) ----------
create table if not exists public.site_settings (
  id                   boolean primary key default true check (id),
  display_name         text not null default 'Levi Gatimu',
  tagline              text not null default 'Student Developer · Full-Stack · AI · Robotics',
  meta_line            text not null default 'STUDENT DEVELOPER · NGA CODING ACADEMY, YEAR 2 · KIGALI, RWANDA',
  meta_line_secondary  text not null default '',
  opening_statement    text not null default 'I build software, AI systems and robots — and finish them.',
  intro_line           text not null default 'I design and build things that actually work, and I like the whole journey from idea to shipped.',
  bio_short_md         text not null default '',
  bio_long_md          text not null default '',
  now_md               text not null default '',
  now_updated_at       timestamptz,
  focus_areas          jsonb not null default '[]'::jsonb,
  email                text not null default 'getmorelev@gmail.com',
  github_url           text,
  linkedin_url         text,
  instagram_url        text,
  portrait_home_path   text,
  portrait_about_path  text,
  portrait_alt         text not null default 'Levi Gatimu',
  location             text not null default 'Kigali, Rwanda',
  timezone             text not null default 'Africa/Kigali',
  updated_at           timestamptz not null default now(),
  constraint site_settings_focus_array check (jsonb_typeof(focus_areas) = 'array')
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into public.site_settings (id, github_url, linkedin_url, focus_areas)
values (
  true,
  'https://github.com/leviGatimu',
  'https://www.linkedin.com/in/levi-gatimu-a0277836b',
  '[
    {"title": "Full-stack", "description": "Web apps end to end: Next.js, TypeScript, Postgres, Supabase."},
    {"title": "AI systems", "description": "LLM-powered features, simulations and agents that do real work."},
    {"title": "Robotics & embedded", "description": "Microcontrollers, sensors and physical systems that move."}
  ]'::jsonb
)
on conflict (id) do nothing;

-- ---------- admins ----------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Row Level Security ----------
alter table public.projects             enable row level security;
alter table public.technologies         enable row level security;
alter table public.project_technologies enable row level security;
alter table public.project_images       enable row level security;
alter table public.site_settings        enable row level security;
alter table public.admins               enable row level security;

-- projects
drop policy if exists projects_select on public.projects;
create policy projects_select on public.projects for select
  using (is_published or public.is_admin());
drop policy if exists projects_write on public.projects;
create policy projects_write on public.projects for all
  using (public.is_admin()) with check (public.is_admin());

-- technologies (public list is harmless)
drop policy if exists technologies_select on public.technologies;
create policy technologies_select on public.technologies for select using (true);
drop policy if exists technologies_write on public.technologies;
create policy technologies_write on public.technologies for all
  using (public.is_admin()) with check (public.is_admin());

-- project_technologies
drop policy if exists project_technologies_select on public.project_technologies;
create policy project_technologies_select on public.project_technologies for select
  using (
    public.is_admin()
    or exists (select 1 from public.projects p where p.id = project_id and p.is_published)
  );
drop policy if exists project_technologies_write on public.project_technologies;
create policy project_technologies_write on public.project_technologies for all
  using (public.is_admin()) with check (public.is_admin());

-- project_images
drop policy if exists project_images_select on public.project_images;
create policy project_images_select on public.project_images for select
  using (
    public.is_admin()
    or exists (select 1 from public.projects p where p.id = project_id and p.is_published)
  );
drop policy if exists project_images_write on public.project_images;
create policy project_images_write on public.project_images for all
  using (public.is_admin()) with check (public.is_admin());

-- site_settings
drop policy if exists site_settings_select on public.site_settings;
create policy site_settings_select on public.site_settings for select using (true);
drop policy if exists site_settings_update on public.site_settings;
create policy site_settings_update on public.site_settings for update
  using (public.is_admin()) with check (public.is_admin());

-- admins (readable only by admins; never written via the API)
drop policy if exists admins_select on public.admins;
create policy admins_select on public.admins for select using (public.is_admin());
