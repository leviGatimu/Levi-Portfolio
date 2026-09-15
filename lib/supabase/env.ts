function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name} (see .env.example)`);
  return value;
}

export const SUPABASE_URL = required("NEXT_PUBLIC_SUPABASE_URL");
export const SUPABASE_KEY = required("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
export const MEDIA_BUCKET = "media";

/** Public CDN URL for an object in the media bucket. */
export function mediaUrl(storagePath: string): string {
  // Absolute paths/URLs pass through (used by local fixtures and any future non-bucket media).
  if (storagePath.startsWith("/") || /^https?:\/\//.test(storagePath)) return storagePath;
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${storagePath}`;
}
