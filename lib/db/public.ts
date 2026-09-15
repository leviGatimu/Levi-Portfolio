import { createPublicClient } from "@/lib/supabase/public";
import type { ProjectType, ProjectWithRelations, SiteSettingsRow, TechnologyRow } from "@/types/database";

export const PROJECT_SELECT =
  "*, project_images(*), project_technologies(sort_order, technologies(*))" as const;

/** PostgREST "table not found" — the migrations in backend/ have not been run yet. */
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
  opening_statement: "I build software, AI systems and robots — and finish them.",
  intro_line: "",
  bio_short_md: "",
  bio_long_md: "",
  now_md: "",
  now_updated_at: null,
  focus_areas: [],
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
  return (data as SiteSettingsRow | null) ?? DEFAULT_SETTINGS;
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
