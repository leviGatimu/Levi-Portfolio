"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { MEDIA_BUCKET } from "@/lib/supabase/env";
import { PROJECT_SELECT, normalizeProject } from "@/lib/db/public";
import { getPublishBlockers, projectCreateSchema, projectUpdateSchema } from "@/lib/validation/schemas";
import type { ProjectWithRelations } from "@/types/database";
import { revalidatePublic } from "./revalidate";
import { fail, type ActionResult } from "./types";

function zodErrors(issues: { path: PropertyKey[]; message: string }[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const key = i.path.map(String).join(".");
    if (!(key in out)) out[key] = i.message;
  }
  return out;
}

function parseJsonField(formData: FormData, name: string): unknown {
  const raw = formData.get(name);
  if (typeof raw !== "string" || raw.trim() === "") return [];
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export async function createProject(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const parsed = projectCreateSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    type: formData.get("type"),
    status: formData.get("status"),
    year: formData.get("year"),
    one_liner: formData.get("one_liner") ?? "",
    summary: formData.get("summary") ?? "",
  });
  if (!parsed.success) return fail("Please fix the highlighted fields.", zodErrors(parsed.error.issues));

  const { data: max } = await supabase.from("projects").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const { data, error } = await supabase
    .from("projects")
    .insert({ ...parsed.data, sort_order: (max?.sort_order ?? 0) + 10 })
    .select("id")
    .single();
  if (error) {
    if (error.code === "23505") return fail("That slug is already used by another project.", { slug: "Already in use" });
    return fail(error.message);
  }
  redirect(`/admin/projects/${data.id}`);
}

export async function updateProject(id: string, _prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const parsed = projectUpdateSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    type: formData.get("type"),
    status: formData.get("status"),
    year: formData.get("year"),
    one_liner: formData.get("one_liner") ?? "",
    summary: formData.get("summary") ?? "",
    body_md: formData.get("body_md") ?? "",
    timeline: formData.get("timeline") ?? "",
    role: formData.get("role") ?? "",
    team: formData.get("team") ?? "",
    collaborators: parseJsonField(formData, "collaborators"),
    links: parseJsonField(formData, "links"),
    repo_visibility: formData.get("repo_visibility"),
    video_url: formData.get("video_url") ?? "",
    cover_aspect: formData.get("cover_aspect"),
    technology_ids: formData.getAll("technology_ids").map(String),
  });
  if (!parsed.success) return fail("Please fix the highlighted fields.", zodErrors(parsed.error.issues));

  const { technology_ids, video_url, timeline, ...rest } = parsed.data;
  const { data: before } = await supabase.from("projects").select("slug, is_published").eq("id", id).single();

  const { error } = await supabase
    .from("projects")
    .update({ ...rest, video_url: video_url || null, timeline: timeline || null })
    .eq("id", id);
  if (error) {
    if (error.code === "23505") return fail("That slug is already used by another project.", { slug: "Already in use" });
    return fail(error.message);
  }

  // Replace the technology set (small list; delete + insert is simplest and correct).
  const { error: delError } = await supabase.from("project_technologies").delete().eq("project_id", id);
  if (delError) return fail(delError.message);
  if (technology_ids.length > 0) {
    const { error: insError } = await supabase
      .from("project_technologies")
      .insert(technology_ids.map((technology_id, i) => ({ project_id: id, technology_id, sort_order: (i + 1) * 10 })));
    if (insError) return fail(insError.message);
  }

  if (before?.is_published) revalidatePublic([before.slug, parsed.data.slug]);
  return { ok: true, data: undefined, message: "Saved" };
}

export async function publishProject(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("projects").select(PROJECT_SELECT).eq("id", id).single();
  if (error || !data) return fail("Project not found.");
  const project = normalizeProject(data as unknown as ProjectWithRelations);
  const blockers = getPublishBlockers(project, project.project_images, project.project_technologies.length);
  if (blockers.length > 0) return fail(`Cannot publish yet: ${blockers.join("; ")}`);

  const { error: upErr } = await supabase.from("projects").update({ is_published: true }).eq("id", id);
  if (upErr) return fail(upErr.message);
  revalidatePublic([project.slug]);
  return { ok: true, data: undefined, message: "Published" };
}

export async function unpublishProject(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("projects").update({ is_published: false }).eq("id", id).select("slug").single();
  revalidatePublic(data ? [data.slug] : []);
  return { ok: true, data: undefined, message: "Unpublished" };
}

export async function setFeatured(id: string, featured: boolean): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("projects").update({ is_featured: featured }).eq("id", id).select("slug, is_published").single();
  if (error) return fail(error.message);
  if (data.is_published) revalidatePublic([data.slug]);
  return { ok: true, data: undefined };
}

export async function moveProject(id: string, direction: "up" | "down"): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data: all, error } = await supabase.from("projects").select("id, sort_order, slug, is_published").order("sort_order").order("created_at");
  if (error || !all) return fail("Could not load projects.");
  const index = all.findIndex((p) => p.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  const a = all[index];
  const b = all[swapIndex];
  if (!a || !b) return { ok: true, data: undefined };

  // Guarantee distinct values even if two rows share a sort_order.
  const aOrder = a.sort_order === b.sort_order ? b.sort_order + (direction === "up" ? -1 : 1) : b.sort_order;
  const [r1, r2] = await Promise.all([
    supabase.from("projects").update({ sort_order: aOrder }).eq("id", a.id),
    supabase.from("projects").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);
  if (r1.error || r2.error) return fail(r1.error?.message ?? r2.error?.message ?? "Reorder failed");
  if (a.is_published || b.is_published) revalidatePublic([a.slug, b.slug]);
  return { ok: true, data: undefined };
}

export async function deleteProject(id: string, confirmName: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data: project } = await supabase.from("projects").select("name, slug, is_published").eq("id", id).single();
  if (!project) return fail("Project not found.");
  if (project.is_published) return fail("Unpublish the project before deleting it.");
  if (confirmName.trim() !== project.name) return fail("Type the project name exactly to confirm.");

  const { data: images } = await supabase.from("project_images").select("storage_path").eq("project_id", id);
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return fail(error.message);
  const paths = (images ?? []).map((i) => i.storage_path);
  if (paths.length > 0) await supabase.storage.from(MEDIA_BUCKET).remove(paths);
  redirect("/admin/projects");
}
