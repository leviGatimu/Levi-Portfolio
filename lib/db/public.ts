import { createPublicClient } from "@/lib/supabase/public";
import type { ProjectType, ProjectWithRelations, SiteSettingsRow, TechnologyRow } from "@/types/database";

export const PROJECT_SELECT =
  "*, project_images(*), project_technologies(sort_order, technologies(*))" as const;

/** PostgREST "table not found": the migrations in backend/ have not been run yet. */
function schemaMissing(error: { code?: string } | null): boolean {
  return error?.code === "PGRST205" || error?.code === "42P01";
}

function warnSchema(what: string) {
  console.warn(`[db] ${what}: schema not found. Run backend/migrations/*.sql in the Supabase SQL editor.`);
}

export const DEFAULT_SETTINGS: SiteSettingsRow = {
  id: true,
  display_name: "Levi Gatimu",
  tagline: "Student Developer · Full-Stack · AI · Robotics",
  meta_line: "STUDENT DEVELOPER · NGA CODING ACADEMY, YEAR 2 · KIGALI, RWANDA",
  meta_line_secondary: "",
  opening_statement: "I build software, AI systems and robots, and I finish them.",
  intro_line: "Year 2 at NGA Coding Academy in Kigali. Full-stack web, desktop apps, AI systems, simulations, and a growing pile of robotics parts. I take ideas from concept to prototype to a product people can actually use.",
  bio_short_md: [
    "I'm Levi, a Year 2 student at NGA Coding Academy in Kigali, Rwanda. I build full-stack web applications, desktop software, AI-powered tools and simulations, and I'm getting hands-on with robotics and embedded systems.",
    "",
    "What I enjoy most is the whole journey: an idea, a rough prototype, then a real product that works, learning whatever is necessary along the way. Long term I'm heading for a career in commercial aviation, and I intend to keep building software seriously alongside it.",
  ].join("\n"),
  bio_long_md: "",
  now_md: "",
  now_updated_at: null,
  focus_areas: [
    { title: "Full-stack", description: "Web apps end to end: Next.js, TypeScript, PostgreSQL, Supabase." },
    { title: "AI systems", description: "LLM-powered features, simulations and agents that do real work." },
    { title: "Robotics & embedded", description: "Microcontrollers, sensors and physical systems that move." },
  ],
  highlights: [
    { title: "Leadership", description: "Class leadership and student collaboration at NGA Coding Academy." },
    { title: "Robotics & embedded", description: "Microcontrollers, sensors, electronics and physical systems that move." },
    { title: "Aviation", description: "Aircraft systems, flight operations, navigation and aviation technology. The long-term destination." },
  ],
  journey: [
    { period: "Year 1", title: "Started at NGA Coding Academy", description: "Web fundamentals, PHP and MySQL, the first CRUD apps and a school management system. Learned to finish and deploy things, not just start them." },
    { period: "Year 1", title: "First real products", description: "Websites for real people and small organisations, built in PHP and later Next.js, deployed and maintained." },
    { period: "Year 2", title: "Full-stack, desktop and AI", description: "TypeScript, React and Next.js on Supabase and PostgreSQL; a Windows desktop app in C# and Electron; LLM-powered features and an agent-based traffic simulation of Kigali." },
    { period: "Year 2", title: "Robotics and embedded", description: "Raspberry Pi, sensors and computer vision on a semi-autonomous rover prototype with classmates." },
    { period: "Next", title: "Commercial aviation", description: "The long-term destination. Software stays a serious second path alongside it." },
  ],
  email: "getmorelev@gmail.com",
  github_url: "https://github.com/leviGatimu",
  linkedin_url: null,
  instagram_url: null,
  portrait_home_path: null,
  portrait_about_path: null,
  portrait_alt: "Levi Gatimu",
  location: "Kigali, Rwanda",
  timezone: "Africa/Kigali",
  updated_at: new Date(0).toISOString(),
};

/** Sort relations in place (Supabase does not order embedded rows). */
export function normalizeProject<T extends ProjectWithRelations>(p: T): T {
  p.project_images.sort((a, b) => a.sort_order - b.sort_order);
  p.project_technologies.sort((a, b) => a.sort_order - b.sort_order);
  return p;
}

export function coverOf(p: ProjectWithRelations) {
  return p.project_images.find((i) => i.is_cover) ?? p.project_images[0] ?? null;
}

export function techsOf(p: ProjectWithRelations): TechnologyRow[] {
  return p.project_technologies.map((pt) => pt.technologies).filter((t): t is TechnologyRow => t !== null);
}

export async function getSiteSettings(): Promise<SiteSettingsRow> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle();
  if (error) {
    if (schemaMissing(error)) {
      warnSchema("site_settings");
      return DEFAULT_SETTINGS;
    }
    throw new Error(`site_settings: ${error.message}`);
  }
  return withDefaults((data as Partial<SiteSettingsRow> | null) ?? {});
}

/** Fills columns that older migrations do not have and descriptive fields left empty. */
function withDefaults(row: Partial<SiteSettingsRow>): SiteSettingsRow {
  const merged: SiteSettingsRow = { ...DEFAULT_SETTINGS, ...row };
  if (!merged.intro_line?.trim()) merged.intro_line = DEFAULT_SETTINGS.intro_line;
  if (!merged.bio_short_md?.trim()) merged.bio_short_md = DEFAULT_SETTINGS.bio_short_md;
  if (!Array.isArray(merged.focus_areas) || merged.focus_areas.length === 0) merged.focus_areas = DEFAULT_SETTINGS.focus_areas;
  if (!Array.isArray(merged.highlights) || merged.highlights.length === 0) merged.highlights = DEFAULT_SETTINGS.highlights;
  if (!Array.isArray(merged.journey) || merged.journey.length === 0) merged.journey = DEFAULT_SETTINGS.journey;
  return merged;
}

export async function getPublishedProjects(type?: ProjectType): Promise<ProjectWithRelations[]> {
  const supabase = createPublicClient();
  let query = supabase.from("projects").select(PROJECT_SELECT).eq("is_published", true).order("sort_order");
  if (type) query = query.eq("type", type);
  const { data, error } = await query;
  if (error) {
    if (schemaMissing(error)) {
      warnSchema("projects");
      return [];
    }
    throw new Error(`projects: ${error.message}`);
  }
  return (data as unknown as ProjectWithRelations[]).map(normalizeProject);
}

export async function getFeaturedProjects(): Promise<ProjectWithRelations[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order");
  if (error) {
    if (schemaMissing(error)) return [];
    throw new Error(`featured: ${error.message}`);
  }
  return (data as unknown as ProjectWithRelations[]).map(normalizeProject);
}

export async function getProjectBySlug(slug: string): Promise<{
  project: ProjectWithRelations;
  next: ProjectWithRelations | null;
  position: { index: number; total: number };
} | null> {
  const all = await getPublishedProjects();
  const index = all.findIndex((p) => p.slug === slug);
  const project = all[index];
  if (index === -1 || !project) return null;
  const next = all.length > 1 ? (all[(index + 1) % all.length] ?? null) : null;
  return { project, next, position: { index: index + 1, total: all.length } };
}

export async function getTechnologiesForAbout(): Promise<TechnologyRow[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("technologies")
    .select("*")
    .eq("show_on_about", true)
    .not("proficiency", "is", null)
    .order("group")
    .order("sort_order");
  if (error) {
    if (schemaMissing(error)) return [];
    throw new Error(`technologies: ${error.message}`);
  }
  return data as TechnologyRow[];
}

export async function getAllTechnologies(): Promise<TechnologyRow[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("technologies").select("*").order("group").order("sort_order");
  if (error) {
    if (schemaMissing(error)) return [];
    throw new Error(`technologies: ${error.message}`);
  }
  return data as TechnologyRow[];
}

export async function getLastUpdated(): Promise<string | null> {
  const supabase = createPublicClient();
  const [{ data: p }, { data: s }] = await Promise.all([
    supabase.from("projects").select("updated_at").eq("is_published", true).order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("site_settings").select("updated_at").eq("id", true).maybeSingle(),
  ]);
  const dates = [p?.updated_at, s?.updated_at].filter((d): d is string => Boolean(d));
  if (dates.length === 0) return null;
  return dates.sort().at(-1) ?? null;
}
