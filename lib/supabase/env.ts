// NEXT_PUBLIC_ variables must be read with a literal property access so Next.js
// can inline them into browser bundles. Dynamic access (process.env[name]) is
// undefined on the client.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url) throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL (see .env.example)");
if (!key) throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (see .env.example)");

export const SUPABASE_URL: string = url;
export const SUPABASE_KEY: string = key;
export const MEDIA_BUCKET = "media";

/** Public CDN URL for an object in the media bucket. */
export function mediaUrl(storagePath: string): string {
  // Absolute paths/URLs pass through (static assets, external media).
  if (storagePath.startsWith("/") || /^https?:\/\//.test(storagePath)) return storagePath;
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${storagePath}`;
}
