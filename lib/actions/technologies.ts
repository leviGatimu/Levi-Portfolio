"use server";

import { requireAdmin } from "@/lib/supabase/admin-guard";
import { slugify } from "@/lib/utils/slugify";
import { technologySchema } from "@/lib/validation/schemas";
import { revalidatePublic } from "./revalidate";
import { fail, type ActionResult } from "./types";

function parse(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  return technologySchema.safeParse({
    name,
    slug: String(formData.get("slug") ?? "") || slugify(name),
    group: formData.get("group"),
    proficiency: formData.get("proficiency") ?? "",
    show_on_about: formData.get("show_on_about") === "on",
  });
}

export async function createTechnology(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid technology");
  const { proficiency, ...rest } = parsed.data;
  const { data: max } = await supabase.from("technologies").select("sort_order").eq("group", rest.group).order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const { error } = await supabase.from("technologies").insert({ ...rest, proficiency: proficiency || null, sort_order: (max?.sort_order ?? 0) + 10 });
  if (error) return fail(error.code === "23505" ? "A technology with that slug already exists." : error.message);
  revalidatePublic();
  return { ok: true, data: undefined, message: `Added ${rest.name}` };
}

/** Quick add from the project editor: name + group only. Returns the new id. */
export async function quickAddTechnology(name: string, group: string): Promise<ActionResult<{ id: string; name: string }>> {
  const { supabase } = await requireAdmin();
  const parsed = technologySchema.safeParse({ name, slug: slugify(name), group, proficiency: "", show_on_about: true });
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid technology");
  const { name: techName, slug, group: techGroup, show_on_about } = parsed.data;
  const { data, error } = await supabase
    .from("technologies")
    .insert({ name: techName, slug, group: techGroup, show_on_about, proficiency: null })
    .select("id, name")
    .single();
  if (error) return fail(error.code === "23505" ? "That technology already exists." : error.message);
  return { ok: true, data };
}

export async function updateTechnology(id: string, _prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid technology");
  const { proficiency, ...rest } = parsed.data;
  const { error } = await supabase.from("technologies").update({ ...rest, proficiency: proficiency || null }).eq("id", id);
  if (error) return fail(error.message);
  revalidatePublic();
  return { ok: true, data: undefined, message: "Saved" };
}

export async function deleteTechnology(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { count } = await supabase.from("project_technologies").select("project_id", { count: "exact", head: true }).eq("technology_id", id);
  if ((count ?? 0) > 0) return fail(`Used by ${count} project${count === 1 ? "" : "s"} — remove it from them first.`);
  const { error } = await supabase.from("technologies").delete().eq("id", id);
  if (error) return fail(error.message);
  revalidatePublic();
  return { ok: true, data: undefined, message: "Deleted" };
}

export async function moveTechnology(id: string, direction: "up" | "down"): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data: t } = await supabase.from("technologies").select("group").eq("id", id).single();
  if (!t) return fail("Not found");
  const { data: all } = await supabase.from("technologies").select("id, sort_order").eq("group", t.group).order("sort_order").order("name");
  if (!all) return fail("Could not load");
  const i = all.findIndex((x) => x.id === id);
  const a = all[i];
  const b = all[direction === "up" ? i - 1 : i + 1];
  if (!a || !b) return { ok: true, data: undefined };
  const aOrder = a.sort_order === b.sort_order ? b.sort_order + (direction === "up" ? -1 : 1) : b.sort_order;
  await Promise.all([
    supabase.from("technologies").update({ sort_order: aOrder }).eq("id", a.id),
    supabase.from("technologies").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);
  revalidatePublic();
  return { ok: true, data: undefined };
}
