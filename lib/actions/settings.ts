"use server";

import { requireAdmin } from "@/lib/supabase/admin-guard";
import { siteSettingsSchema } from "@/lib/validation/schemas";
import { revalidatePublic } from "./revalidate";
import { fail, type ActionResult } from "./types";

export async function updateSiteSettings(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  let focus_areas: unknown = [];
  try {
    focus_areas = JSON.parse(String(formData.get("focus_areas") ?? "[]"));
  } catch {
    return fail("Focus areas are malformed.");
  }

  const fields = [
    "display_name", "tagline", "meta_line", "meta_line_secondary", "opening_statement", "intro_line",
    "bio_short_md", "bio_long_md", "now_md", "email", "github_url", "linkedin_url", "instagram_url",
    "portrait_alt", "location", "timezone",
  ] as const;
  const raw: Record<string, unknown> = { focus_areas };
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
