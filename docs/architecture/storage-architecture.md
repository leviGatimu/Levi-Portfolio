# Storage Architecture

## Choice

**Supabase Storage**, one **public** bucket named `media`. Same project as the database and auth; public read via CDN URL; writes restricted to the admin by storage policies.

Alternatives: Vercel Blob (second vendor for no gain), Cloudinary/Imgix (transformations we get from `next/image`), S3 + CloudFront (setup weight). Rejected.

## Bucket and paths

```
media/                                   public bucket
  projects/{project-slug}/{uuid}.{ext}   gallery + cover images (uuid filename: no collisions, no leaking original names)
  site/portrait-home.{ext}               portrait crops
  site/portrait-about.{ext}
  site/og-fallback.png                   (optional static fallback)
```

- The **database row is the source of truth**; the object is an artefact. A file with no `project_images` row is an orphan and is cleaned up (see deletion).
- Slug renames do **not** move files (paths are immutable once uploaded); the folder name is a convenience for browsing the bucket, not a lookup key.

## Public vs private

- All V1 media is public by design (it is displayed on a public site). Unpublished projects' images are technically fetchable by URL if the UUID is known — acceptable for a portfolio (no sensitive media). If this ever matters, switch the bucket to private and serve through signed URLs; the code path is isolated in `lib/storage`.
- Bucket policies:
  - `SELECT`: public (anon) — needed for CDN delivery.
  - `INSERT`, `UPDATE`, `DELETE`: `is_admin()` only.

## Upload pipeline

```
Admin form ──(multipart)──► server action `uploadProjectImage`
   1. auth: getUser() + is_admin()
   2. validate: MIME in {image/png, image/jpeg, image/webp, image/avif}; size ≤ 5 MB;
      sniff magic bytes (not just the declared type); alt text present (≥ 3 chars)
   3. sharp(file).metadata() → width, height; reject if < 320px on the short side
      or > 8000px on the long side; strip EXIF (sharp rotate() + withMetadata(false)) — removes GPS/location data from photos
   4. upload to `media/projects/{slug}/{uuid}.{ext}` with contentType, cacheControl: 'public, max-age=31536000, immutable'
   5. insert project_images row (path, alt, width, height, bytes, sort_order = max+10)
   6. revalidateTag('projects')
```

- Files are stored **as uploaded** (after EXIF strip); no resizing at upload. `next/image` produces responsive AVIF/WebP variants on demand and caches them at Vercel's edge. Storing the original preserves quality for future re-crops.
- Immutable cache headers are safe because filenames are UUIDs — a replaced image is a new object.
- Progress: server actions do not stream progress; the admin shows an indeterminate state with the filename. Acceptable for ≤ 5 MB files. (V2: direct-to-storage signed upload with progress if needed.)

## Delivery

- `next.config` `images.remotePatterns` allows `https://<project-ref>.supabase.co/storage/v1/object/public/media/**`.
- Every render uses `next/image` with `width`/`height` from the row and the correct `sizes`. Never a raw `<img>` for project media.
- Supabase's own image transformation API is **not** used (Pro plan feature and redundant with `next/image`).

## Deletion behaviour

| Action | Effect |
|--------|--------|
| Remove an image in the admin | Delete the `project_images` row, then delete the storage object. If object deletion fails, log and continue (orphan; cleaned later). Row first so the site never references a missing file. |
| Delete a project | `ON DELETE CASCADE` removes image rows; the server action then deletes `projects/{slug}/*` objects (list + remove). |
| Replace the portrait | Upload new object, update `site_settings` path, delete old object. |
| Orphan cleanup | Admin "Site → Storage" shows a count of objects without rows and a "Remove orphans" button (lists objects, diffs against rows, deletes). Manual, not scheduled. |

Deletes are confirmed with a dialog that names the file and its project. No soft-delete for media.

## Limits and quotas

- Per file: 5 MB. Per project: soft warning above 12 images (design guidance: 3–6).
- Free tier storage (1 GB at time of writing) comfortably holds hundreds of 2× screenshots. The admin shows total bytes used (sum of `project_images.bytes`) on the projects list.

## Security notes

- Never trust the client's MIME type or filename; sniff bytes, generate UUID names, whitelist extensions.
- SVG is **not** an accepted upload type (script injection vector when served inline).
- EXIF stripped on every upload (privacy: photos from phones carry GPS coordinates).
- Bucket write policies rely on `is_admin()`; the anon key cannot write even if the app has a bug.
- Path is built server-side from the project's slug and a server-generated UUID; user input never forms a path.
