-- 0006_analytics_and_journey.sql
-- 1) Cookieless page-view analytics for the admin dashboard.
-- 2) A "journey" timeline on site_settings for the /journey page.
-- Safe to run more than once.

-- ---------- page_views ----------
create table if not exists public.page_views (
  id          bigint generated always as identity primary key,
  path        text not null,
  referrer    text,                       -- host only, e.g. "linkedin.com"
  country     text,                       -- ISO 3166-1 alpha-2 from the edge, e.g. "RW"
  device      text not null default 'desktop',  -- desktop | mobile | tablet
  viewed_at   timestamptz not null default now(),
  constraint page_views_path_len check (char_length(path) between 1 and 200),
  constraint page_views_referrer_len check (referrer is null or char_length(referrer) <= 120),
  constraint page_views_country_len check (country is null or char_length(country) <= 2),
  constraint page_views_device check (device in ('desktop', 'mobile', 'tablet'))
);

create index if not exists page_views_viewed_at_idx on public.page_views (viewed_at desc);
create index if not exists page_views_path_idx on public.page_views (path);

alter table public.page_views enable row level security;

-- Only the admin can read. Nobody inserts directly: the site calls record_page_view().
drop policy if exists page_views_select on public.page_views;
create policy page_views_select on public.page_views for select using (public.is_admin());

-- Validated insert path for anonymous visitors (no personal data is stored).
create or replace function public.record_page_view(p_path text, p_referrer text, p_country text, p_device text)
returns void
language plpgsql security definer
set search_path = public
as $$
begin
  if p_path is null or char_length(p_path) = 0 or char_length(p_path) > 200 then return; end if;
  if p_path like '/admin%' then return; end if;
  insert into public.page_views (path, referrer, country, device)
  values (
    p_path,
    nullif(left(p_referrer, 120), ''),
    nullif(upper(left(p_country, 2)), ''),
    case when p_device in ('desktop', 'mobile', 'tablet') then p_device else 'desktop' end
  );
end $$;

revoke all on function public.record_page_view(text, text, text, text) from public;
grant execute on function public.record_page_view(text, text, text, text) to anon, authenticated;

-- Daily rollup used by the dashboard (admin only via RLS on the base table).
create or replace view public.page_views_daily as
  select date_trunc('day', viewed_at)::date as day, count(*)::int as views
  from public.page_views
  group by 1;

-- ---------- journey ----------
alter table public.site_settings
  add column if not exists journey jsonb not null default '[]'::jsonb;

do $$ begin
  alter table public.site_settings
    add constraint site_settings_journey_array check (jsonb_typeof(journey) = 'array');
exception when duplicate_object then null; end $$;

update public.site_settings
set journey = '[
  {"period": "Year 1", "title": "Started at NGA Coding Academy", "description": "Web fundamentals, PHP and MySQL, the first CRUD apps and a school management system. Learned to finish and deploy things, not just start them."},
  {"period": "Year 1", "title": "First real products", "description": "Websites for real people and small organisations, built in PHP and later Next.js, deployed and maintained."},
  {"period": "Year 2", "title": "Full-stack, desktop and AI", "description": "TypeScript, React and Next.js on Supabase and PostgreSQL; a Windows desktop app in C# and Electron; LLM-powered features and an agent-based traffic simulation of Kigali."},
  {"period": "Year 2", "title": "Robotics and embedded", "description": "Raspberry Pi, sensors and computer vision on a semi-autonomous rover prototype with classmates."},
  {"period": "Next", "title": "Commercial aviation", "description": "The long-term destination. Software stays a serious second path alongside it."}
]'::jsonb
where id and journey = '[]'::jsonb;
