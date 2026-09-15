"use server";

import { requireAdmin } from "@/lib/supabase/admin-guard";
import { siteSettingsSchema } from "@/lib/validation/schemas";
import type { SiteSettingsRow } from "@/types/database";
import { revalidatePublic } from "./revalidate";
import { fail, type ActionResult } from "./types";

export async function updateSiteSettings(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  let focus_areas: unknown = [];
  let highlights: unknown = [];
  let journey: unknown = [];
  try {
    focus_areas = JSON.parse(String(formData.get("focus_areas") ?? "[]"));
    highlights = JSON.parse(String(formData.get("highlights") ?? "[]"));
    journey = JSON.parse(String(formData.get("journey") ?? "[]"));
  } catch {
    return fail("Focus areas or highlights are malformed.");
  }

  const fields = [
    "display_name", "tagline", "meta_line", "meta_line_secondary", "opening_statement", "intro_line",
    "bio_short_md", "bio_long_md", "now_md", "email", "github_url", "linkedin_url", "instagram_url",
    "portrait_alt", "location", "timezone",
  ] as const;
  const raw: Record<string, unknown> = { focus_areas, highlights, journey };
  for (const f of fields) raw[f] = formData.get(f) ?? "";

  const parsed = siteSettingsSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return fail(`${first?.path.join(".") ?? "field"}: ${first?.message ?? "invalid"}`);
  }

  const { data: current } = await supabase.from("site_settings").select("now_md").eq("id", true).single();
  const nowChanged = current?.now_md !== parsed.data.now_md;
  const d = parsed.data;
  const { error } = await supabase
    .from("site_settings")
    .update({
      ...d,
      github_url: d.github_url || null,
      linkedin_url: d.linkedin_url || null,
      instagram_url: d.instagram_url || null,
      ...(nowChanged ? { now_updated_at: new Date().toISOString() } : {}),
    })
    .eq("id", true);
  if (error) return fail(error.message);
  revalidatePublic();
  return { ok: true, data: undefined, message: "Site settings saved" };
}

/** JSON snapshot of all content tables for manual backups. */
export async function exportContent(): Promise<ActionResult<string>> {
  const { supabase } = await requireAdmin();
  const [projects, images, techs, links, settings] = await Promise.all([
    supabase.from("projects").select("*").order("sort_order"),
    supabase.from("project_images").select("*"),
    supabase.from("technologies").select("*"),
    supabase.from("project_technologies").select("*"),
    supabase.from("site_settings").select("*"),
  ]);
  const err = projects.error ?? images.error ?? techs.error ?? links.error ?? settings.error;
  if (err) return fail(err.message);
  const snapshot = {
    exported_at: new Date().toISOString(),
    projects: projects.data,
    project_images: images.data,
    technologies: techs.data,
    project_technologies: links.data,
    site_settings: settings.data,
  };
  return { ok: true, data: JSON.stringify(snapshot, null, 2) };
}

type SettingsKey = keyof typeof siteSettingsSchema.shape;
const JSON_KEYS: SettingsKey[] = ["focus_areas", "highlights", "journey"];
const NULLABLE_KEYS: SettingsKey[] = ["github_url", "linkedin_url", "instagram_url"];

/**
 * Updates only the listed site_settings fields. Each admin page binds its own
 * key list, so saving the Home page cannot clobber the About page and so on.
 */
export async function updateSiteFields(keys: SettingsKey[], _prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const raw: Record<string, unknown> = {};
  for (const key of keys) {
    const value = formData.get(key);
    if (JSON_KEYS.includes(key)) {
      try {
        raw[key] = JSON.parse(typeof value === "string" && value ? value : "[]");
      } catch {
        return fail(`${key} is malformed.`);
      }
    } else {
      raw[key] = typeof value === "string" ? value : "";
    }
  }
  const picked = Object.fromEntries(keys.map((k) => [k, true])) as Record<SettingsKey, true>;
  const parsed = siteSettingsSchema.pick(picked).safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return fail(`${first?.path.join(".") ?? "field"}: ${first?.message ?? "invalid"}`);
  }
  const update: Record<string, unknown> = { ...parsed.data };
  for (const k of NULLABLE_KEYS) if (k in update && !update[k]) update[k] = null;
  if ("now_md" in update) {
    const { data: current } = await supabase.from("site_settings").select("now_md").eq("id", true).single();
    if (current?.now_md !== update.now_md) update.now_updated_at = new Date().toISOString();
  }
  const { error } = await supabase.from("site_settings").update(update as Partial<SiteSettingsRow>).eq("id", true);
  if (error) return fail(error.message);
  revalidatePublic();
  return { ok: true, data: undefined, message: "Saved" };
}
