-- 0003_seed_technologies.sql
-- Starter technology list (edit freely in Admin -> Technologies).
-- Proficiency is left NULL where it has not been confirmed. Safe to run more than once.

insert into public.technologies (slug, name, "group", proficiency, sort_order) values
  ('typescript',  'TypeScript',   'language', 'strong',      10),
  ('javascript',  'JavaScript',   'language', 'strong',      20),
  ('php',         'PHP',          'language', 'strong',      30),
  ('python',      'Python',       'language', 'comfortable', 40),
  ('csharp',      'C#',           'language', 'comfortable', 50),
  ('c',           'C',            'language', 'learning',    60),
  ('sql',         'SQL',          'language', 'comfortable', 70),

  ('react',       'React',        'frontend', 'strong',      10),
  ('nextjs',      'Next.js',      'frontend', 'strong',      20),
  ('tailwind',    'Tailwind CSS', 'frontend', 'strong',      30),
  ('framer-motion','Framer Motion','frontend','comfortable', 40),
  ('gsap',        'GSAP',         'frontend', 'comfortable', 50),
  ('three',       'Three.js',     'frontend', 'experimental',60),

  ('nodejs',      'Node.js',      'backend',  'comfortable', 10),
  ('express',     'Express',      'backend',  'comfortable', 20),
  ('fastapi',     'FastAPI',      'backend',  'comfortable', 30),
  ('laravel',     'Laravel',      'backend',  'learning',    40),
  ('dotnet',      '.NET',         'backend',  'comfortable', 50),

  ('postgresql',  'PostgreSQL',   'database', 'strong',      10),
  ('supabase',    'Supabase',     'database', 'strong',      20),
  ('prisma',      'Prisma',       'database', 'comfortable', 30),
  ('sqlite',      'SQLite',       'database', 'comfortable', 40),
  ('mysql',       'MySQL',        'database', 'comfortable', 50),

  ('llm-apis',    'LLM APIs (Anthropic, OpenAI, Gemini)', 'ai', 'comfortable', 10),
  ('opencv',      'OpenCV',       'ai',       'experimental',20),
  ('simulation',  'Agent-based simulation', 'ai', 'comfortable', 30),

  ('raspberry-pi','Raspberry Pi', 'robotics', 'learning',    10),
  ('ros',         'ROS',          'robotics', 'experimental',20),
  ('arduino',     'Arduino',      'embedded', null,          10),

  ('electron',    'Electron',     'desktop',  'comfortable', 10),

  ('git',         'Git & GitHub', 'devops',   'strong',      10),
  ('vercel',      'Vercel',       'devops',   'strong',      20),
  ('docker',      'Docker',       'devops',   'learning',    30),

  ('figma',       'Figma',        'design',   null,          10)
on conflict (slug) do nothing;
