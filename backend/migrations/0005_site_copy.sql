-- 0005_site_copy.sql
-- Adds the "Beyond software" highlights column and fills in descriptive default
-- copy where the settings row is still empty. Everything here is editable later
-- in Admin -> Site. Safe to run more than once.

alter table public.site_settings
  add column if not exists highlights jsonb not null default '[]'::jsonb;

do $$ begin
  alter table public.site_settings
    add constraint site_settings_highlights_array check (jsonb_typeof(highlights) = 'array');
exception when duplicate_object then null; end $$;

alter table public.site_settings
  alter column opening_statement set default 'I build software, AI systems and robots, and I finish them.';

update public.site_settings
set opening_statement = 'I build software, AI systems and robots, and I finish them.'
where id and opening_statement = 'I build software, AI systems and robots — and finish them.';

update public.site_settings
set intro_line = 'Year 2 at NGA Coding Academy in Kigali. Full-stack web, desktop apps, AI systems, simulations, and a growing pile of robotics parts. I take ideas from concept to prototype to a product people can actually use.'
where id and (intro_line = '' or intro_line = 'I design and build things that actually work, and I like the whole journey from idea to shipped.');

update public.site_settings
set bio_short_md = $md$I'm Levi, a Year 2 student at NGA Coding Academy in Kigali, Rwanda. I build full-stack web applications, desktop software, AI-powered tools and simulations, and I'm getting hands-on with robotics and embedded systems.

What I enjoy most is the whole journey: an idea, a rough prototype, then a real product that works, learning whatever is necessary along the way. Long term I'm heading for a career in commercial aviation, and I intend to keep building software seriously alongside it.$md$
where id and bio_short_md = '';

update public.site_settings
set bio_long_md = $md$## Who I am

I'm Levi Gatimu, a Year 2 student developer at NGA Coding Academy in Kigali, Rwanda. I started with web fundamentals and PHP, moved quickly into TypeScript, React and Next.js, and now build across the full stack: databases and APIs, interfaces, desktop applications, and systems that use AI to do real work.

## What I build

Full-stack web apps on Next.js, Supabase and PostgreSQL. Windows desktop software with C#, .NET and Electron. AI features built on large language models, and agent-based simulations. On the hardware side I work with microcontrollers, sensors and electronics, and I'm learning my way around Raspberry Pi and ROS for robotics.

I care about finishing things. A project is done when someone else can use it, so I ship installers, deploy the web apps, and write documentation that explains how a thing actually works.

## Leadership

Class leadership and student collaboration at NGA Coding Academy, working with classmates on group projects and shared systems.

## Aviation

My long-term goal is a career in commercial aviation. I'm exploring aircraft systems, flight operations, navigation and aviation technology. Software stays a serious second path.

## Where I'm going

Becoming a stronger engineer by building real things, and documenting the decisions behind them.$md$
where id and bio_long_md = '';

update public.site_settings
set highlights = '[
  {"title": "Leadership", "description": "Class leadership and student collaboration at NGA Coding Academy."},
  {"title": "Robotics & embedded", "description": "Microcontrollers, sensors, electronics and physical systems that move."},
  {"title": "Aviation", "description": "Aircraft systems, flight operations, navigation and aviation technology. The long-term destination."}
]'::jsonb
where id and highlights = '[]'::jsonb;

update public.site_settings
set focus_areas = '[
  {"title": "Full-stack", "description": "Web apps end to end: Next.js, TypeScript, PostgreSQL, Supabase."},
  {"title": "AI systems", "description": "LLM-powered features, simulations and agents that do real work."},
  {"title": "Robotics & embedded", "description": "Microcontrollers, sensors and physical systems that move."}
]'::jsonb
where id and focus_areas = '[]'::jsonb;

update public.site_settings
set now_md = 'Year 2 at NGA Coding Academy, shipping projects and writing up how they were built.'
where id and now_md = '';
