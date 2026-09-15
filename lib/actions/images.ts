"use server";

import { randomUUID } from "node:crypto";
import sharp, { type Metadata as SharpMetadata } from "sharp";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { MEDIA_BUCKET } from "@/lib/supabase/env";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, imageMetaSchema } from "@/lib/validation/schemas";
import { revalidatePublic } from "./revalidate";
import { fail, type ActionResult } from "./types";

type Processed = { buffer: Buffer; ext: string; contentType: string; width: number; height: number };

const FORMAT_TO_EXT: Record<string, { ext: string; contentType: string }> = {
  png: { ext: "png", contentType: "image/png" },
  jpeg: { ext: "jpg", contentType: "image/jpeg" },
  webp: { ext: "webp", contentType: "image/webp" },
  avif: { ext: "avif", contentType: "image/avif" },
  heif: { ext: "avif", contentType: "image/avif" },
};

/**
 * Validates by sniffing the real format (not the declared MIME type), checks
 * size and dimensions, applies EXIF rotation and strips all metadata (GPS etc).
 */
async function processImage(file: File): Promise<Processed | { error: string }> {
  if (file.size === 0) return { error: "Empty file" };
  if (file.size > MAX_IMAGE_BYTES) return { error: `Too large: ${(file.size / 1024 / 1024).toFixed(1)} MB (max 5 MB)` };
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) return { error: "Only PNG, JPEG, WebP or AVIF" };

  const input = Buffer.from(await file.arrayBuffer());
  let meta: SharpMetadata;
  try {
    meta = await sharp(input).metadata();
  } catch {
    return { error: "Not a valid image" };
  }
  const fmt = meta.format ? FORMAT_TO_EXT[meta.format] : undefined;
  if (!fmt) return { error: "Unsupported image format" };

  // Strip metadata by re-encoding without withMetadata(); rotate() bakes in EXIF orientation first.
  const buffer = await sharp(input).rotate().toBuffer();
  const out = await sharp(buffer).metadata();
  const width = out.width ?? 0;
  const height = out.height ?? 0;
  if (Math.min(width, height) < 320) return { error: "Image is too small (short side must be ≥ 320px)" };
  if (Math.max(width, height) > 8000) return { error: "Image is too large (long side must be ≤ 8000px)" };
  return { buffer, ext: fmt.ext, contentType: fmt.contentType, width, height };
}

export async function uploadProjectImages(projectId: string, _prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data: project } = await supabase.from("projects").select("slug, is_published").eq("id", projectId).single();
  if (!project) return fail("Project not found.");

  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  const alt = String(formData.get("alt") ?? "").trim();
  if (files.length === 0) return fail("Choose at least one image.");
  if (alt.length < 3) return fail("Write alt text (at least 3 characters) before uploading.", { alt: "Required" });

  const { data: maxRow } = await supabase.from("project_images").select("sort_order").eq("project_id", projectId).order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const { count } = await supabase.from("project_images").select("id", { count: "exact", head: true }).eq("project_id", projectId);
  let sortOrder = maxRow?.sort_order ?? 0;
  const errors: string[] = [];
  let uploaded = 0;

  for (const file of files) {
    const processed = await processImage(file);
    if ("error" in processed) {
      errors.push(`${file.name}: ${processed.error}`);
      continue;
    }
    const path = `projects/${project.slug}/${randomUUID()}.${processed.ext}`;
    const { error: upErr } = await supabase.storage.from(MEDIA_BUCKET).upload(path, processed.buffer, {
      contentType: processed.contentType,
      cacheControl: "31536000",
      upsert: false,
    });
    if (upErr) {
      errors.push(`${file.name}: ${upErr.message}`);
      continue;
    }
    sortOrder += 10;
    const { error: insErr } = await supabase.from("project_images").insert({
      project_id: projectId,
      storage_path: path,
      alt: files.length > 1 ? `${alt} (${uploaded + 1})` : alt,
      width: processed.width,
      height: processed.height,
      bytes: processed.buffer.byteLength,
      is_cover: (count ?? 0) === 0 && uploaded === 0,
      sort_order: sortOrder,
    });
    if (insErr) {
      await supabase.storage.from(MEDIA_BUCKET).remove([path]);
      errors.push(`${file.name}: ${insErr.message}`);
      continue;
    }
    uploaded += 1;
  }

  if (project.is_published) revalidatePublic([project.slug]);
  if (uploaded === 0) return fail(errors.join(" · ") || "Upload failed.");
  return { ok: true, data: undefined, message: errors.length ? `Uploaded ${uploaded}; skipped: ${errors.join(" · ")}` : `Uploaded ${uploaded} image${uploaded > 1 ? "s" : ""}` };
}

export async function updateProjectImage(imageId: string, _prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const parsed = imageMetaSchema.safeParse({
    alt: formData.get("alt") ?? "",
    caption: formData.get("caption") ?? "",
    is_wide: formData.get("is_wide") === "on",
  });
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid image details");
  const { error, data } = await supabase
    .from("project_images")
    .update({ alt: parsed.data.alt, caption: parsed.data.caption || null, is_wide: parsed.data.is_wide })
    .eq("id", imageId)
    .select("project_id, projects(slug, is_published)")
    .single();
  if (error) return fail(error.message);
  const p = data.projects as unknown as { slug: string; is_published: boolean } | null;
  if (p?.is_published) revalidatePublic([p.slug]);
  return { ok: true, data: undefined, message: "Image updated" };
}

export async function setCoverImage(imageId: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data: img } = await supabase.from("project_images").select("project_id").eq("id", imageId).single();
  if (!img) return fail("Image not found.");
  // Clear first so the unique partial index never sees two covers.
  const { error: clearErr } = await supabase.from("project_images").update({ is_cover: false }).eq("project_id", img.project_id);
  if (clearErr) return fail(clearErr.message);
  const { error } = await supabase.from("project_images").update({ is_cover: true }).eq("id", imageId);
  if (error) return fail(error.message);
  await revalidateForProject(img.project_id);
  return { ok: true, data: undefined, message: "Cover updated" };
}

export async function moveProjectImage(imageId: string, direction: "up" | "down"): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data: img } = await supabase.from("project_images").select("project_id").eq("id", imageId).single();
  if (!img) return fail("Image not found.");
  const { data: all } = await supabase.from("project_images").select("id, sort_order").eq("project_id", img.project_id).order("sort_order");
  if (!all) return fail("Could not load images.");
  const i = all.findIndex((x) => x.id === imageId);
  const a = all[i];
  const b = all[direction === "up" ? i - 1 : i + 1];
  if (!a || !b) return { ok: true, data: undefined };
  const aOrder = a.sort_order === b.sort_order ? b.sort_order + (direction === "up" ? -1 : 1) : b.sort_order;
  await Promise.all([
    supabase.from("project_images").update({ sort_order: aOrder }).eq("id", a.id),
    supabase.from("project_images").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);
  await revalidateForProject(img.project_id);
  return { ok: true, data: undefined };
}

export async function deleteProjectImage(imageId: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data: img } = await supabase.from("project_images").select("project_id, storage_path").eq("id", imageId).single();
  if (!img) return fail("Image not found.");
  const { error } = await supabase.from("project_images").delete().eq("id", imageId);
  if (error) return fail(error.message);
  const { error: rmErr } = await supabase.storage.from(MEDIA_BUCKET).remove([img.storage_path]);
  if (rmErr) console.error("orphaned storage object", img.storage_path, rmErr.message);
  await revalidateForProject(img.project_id);
  return { ok: true, data: undefined, message: "Image removed" };
}

async function revalidateForProject(projectId: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("projects").select("slug, is_published").eq("id", projectId).single();
  if (data?.is_published) revalidatePublic([data.slug]);
}

/** Portrait upload for the Site page. Replaces the previous object. */
export async function uploadPortrait(slot: "home" | "about", _prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return fail("Choose an image.");
  const processed = await processImage(file);
  if ("error" in processed) return fail(processed.error);

  const column = slot === "home" ? "portrait_home_path" : "portrait_about_path";
  const { data: current } = await supabase.from("site_settings").select(column).eq("id", true).single();
  const path = `site/portrait-${slot}-${randomUUID()}.${processed.ext}`;
  const { error: upErr } = await supabase.storage.from(MEDIA_BUCKET).upload(path, processed.buffer, {
    contentType: processed.contentType,
    cacheControl: "31536000",
  });
  if (upErr) return fail(upErr.message);
  const update = slot === "home" ? { portrait_home_path: path } : { portrait_about_path: path };
  const { error } = await supabase.from("site_settings").update(update).eq("id", true);
  if (error) return fail(error.message);
  const old = (current as Record<string, string | null> | null)?.[column];
  if (old) await supabase.storage.from(MEDIA_BUCKET).remove([old]);
  revalidatePublic();
  return { ok: true, data: undefined, message: "Portrait updated" };
}

export async function removePortrait(slot: "home" | "about"): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const column = slot === "home" ? "portrait_home_path" : "portrait_about_path";
  const { data: current } = await supabase.from("site_settings").select(column).eq("id", true).single();
  const old = (current as Record<string, string | null> | null)?.[column];
  const update = slot === "home" ? { portrait_home_path: null } : { portrait_about_path: null };
  const { error } = await supabase.from("site_settings").update(update).eq("id", true);
  if (error) return fail(error.message);
  if (old) await supabase.storage.from(MEDIA_BUCKET).remove([old]);
  revalidatePublic();
  return { ok: true, data: undefined, message: "Portrait removed" };
}
