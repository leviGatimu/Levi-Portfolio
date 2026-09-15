/**
 * Browser-side image prep before upload. Big photos and screenshots are
 * downscaled and re-encoded so the request stays small (Vercel caps server
 * action bodies at about 4.5 MB) and uploads are fast. Small files pass
 * through untouched. Falls back to the original file if decoding fails.
 */

const MAX_SIDE = 2560;
const PASS_THROUGH_BYTES = 2.5 * 1024 * 1024;
const QUALITY = 0.9;

export async function prepareForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file;
  }
  const longSide = Math.max(bitmap.width, bitmap.height);
  if (file.size <= PASS_THROUGH_BYTES && longSide <= MAX_SIDE) {
    bitmap.close();
    return file;
  }

  const scale = Math.min(1, MAX_SIDE / longSide);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // WebP keeps transparency and compresses screenshots well; JPEG if the browser cannot encode it.
  const blob = (await toBlob(canvas, "image/webp")) ?? (await toBlob(canvas, "image/jpeg"));
  if (!blob) return file;
  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const base = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${base}.${ext}`, { type: blob.type, lastModified: file.lastModified });
}

function toBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b && b.type === type ? b : null), type, QUALITY));
}

/** Replaces every File under `field` in the form data with its prepared version. */
export async function prepareFormFiles(formData: FormData, field: string): Promise<FormData> {
  const files = formData.getAll(field).filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return formData;
  const prepared = await Promise.all(files.map(prepareForUpload));
  formData.delete(field);
  for (const f of prepared) formData.append(field, f);
  return formData;
}
