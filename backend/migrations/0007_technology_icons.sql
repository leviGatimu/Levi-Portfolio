-- 0007_technology_icons.sql
-- Logos for technologies. `icon` is either a Simple Icons slug (https://simpleicons.org,
-- e.g. "nextdotjs") or a full https:// image URL. Editable in Admin -> Technologies.
-- Safe to run more than once.

alter table public.technologies
  add column if not exists icon text;

update public.technologies set icon = v.icon
from (values
  ('typescript',   'typescript'),
  ('javascript',   'javascript'),
  ('php',          'php'),
  ('python',       'python'),
  ('csharp',       'dotnet'),
  ('c',            'c'),
  ('sql',          'postgresql'),
  ('react',        'react'),
  ('nextjs',       'nextdotjs'),
  ('tailwind',     'tailwindcss'),
  ('framer-motion','framer'),
  ('gsap',         'gsap'),
  ('three',        'threedotjs'),
  ('nodejs',       'nodedotjs'),
  ('express',      'express'),
  ('fastapi',      'fastapi'),
  ('laravel',      'laravel'),
  ('dotnet',       'dotnet'),
  ('postgresql',   'postgresql'),
  ('supabase',     'supabase'),
  ('prisma',       'prisma'),
  ('sqlite',       'sqlite'),
  ('mysql',        'mysql'),
  ('llm-apis',     'anthropic'),
  ('opencv',       'opencv'),
  ('raspberry-pi', 'raspberrypi'),
  ('ros',          'ros'),
  ('arduino',      'arduino'),
  ('electron',     'electron'),
  ('git',          'github'),
  ('vercel',       'vercel'),
  ('docker',       'docker'),
  ('figma',        'figma')
) as v(slug, icon)
where public.technologies.slug = v.slug and public.technologies.icon is null;
