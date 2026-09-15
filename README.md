# Levi Gatimu — Portfolio

Editorial developer portfolio with a private admin. Next.js 16 (App Router) · TypeScript · Tailwind v4 · Supabase (Postgres, Auth, Storage) · Vercel.

## Run it locally

```bash
npm install
cp .env.example .env.local      # fill in the Supabase URL + publishable key
npm run dev                     # http://localhost:3000
```

## First-time setup (once)

1. **Database** — run the SQL files in `backend/migrations/` in the Supabase SQL editor, in order. Full steps in [`backend/README.md`](backend/README.md).
2. **Admin login** — create your user in Supabase Auth, disable sign-ups, add the user id to `public.admins` (also in `backend/README.md`).
3. **Deploy** — import the repo in Vercel, add the three env vars from `.env.example` (`NEXT_PUBLIC_SITE_URL` = your `https://<project>.vercel.app`), deploy.

## Adding a project

Open `/admin` → **New project** → name, type, status, year → **Create draft** → upload a cover + screenshots (alt text required) → fill one-liner, summary, role, team, technologies, links → write the case study in Markdown (insert the section template) → **Preview** → **Publish**. Star it to feature it on the homepage; use ↑↓ to order. No deploy needed.

## Commands

```bash
npm run dev         # dev server
npm run build       # production build
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
node scripts/screenshot.mjs http://localhost:3000/ 390 shot.png   # full-page screenshot via the system Edge (playwright-core)
```

## Where things are

```
app/(public)/     home, /work, /work/[slug], /about, OG images, sitemap, robots
app/admin/        login + the admin (projects, technologies, site)
components/       public/ admin/ shared/
lib/              supabase clients, db reads, server actions (writes), validation, utils
backend/          SQL migrations you run yourself
types/database.ts hand-maintained mirror of the schema
docs/             planning docs, decisions (DECISIONS.md) and open questions (TODO.md)
HANDOFF.md        current state for the next working session
```

Only the Supabase **publishable** key is used anywhere. Row Level Security keeps drafts private and blocks writes from anyone but the admin — never add the service-role key to `.env.local` or Vercel.
