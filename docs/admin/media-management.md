# Media Management (admin)

Media is managed **inside the thing it belongs to**: project images in the project editor, portraits on the Site page. There is no standalone media library in V1 (see cms-overview for the reasoning).

## Project images

### Upload

- Drop zone + file input (`accept="image/png,image/jpeg,image/webp,image/avif"`, `multiple`).
- Each file becomes a row in the gallery list immediately with an "Uploading…" state; the server action validates (type sniff, minimum dimensions), downsizes anything over 4000px, strips EXIF, stores, and inserts the `project_images` row.
- **Alt text is required before the row is considered complete.** An uploaded image without alt shows a danger marker and blocks publishing. The alt field sits directly under each thumbnail with help text: "Describe what the screenshot shows and why it matters. Example: 'Trace timeline for 12 June: VS Code sessions grouped by window title, with an idle gap at 10:30.'"
- Caption (optional) renders under the image on the public page.
- `Wide` toggle: on desktop the image spans all 12 columns and bleeds to the viewport edge.

### Cover

- "Set as cover" on any gallery image; exactly one cover per project (DB-enforced). The cover is also part of the gallery (it is not excluded from the case study — it becomes the hero).
- The cover aspect field on the project decides how the plate crops it (`object-fit: cover`); the admin shows a live crop preview box at 16:10 and 4:5 so Levi sees what will be cut.

### Ordering

- Move up / Move down buttons per row; order is the gallery order on the public page (for images not referenced inline in the body).

### Using images in the case study

- "Copy Markdown" per image copies `![alt text](https://…/media/projects/slug/uuid.png)` to the clipboard. Pasted into the body, the image renders inline at that position with its caption (if the next line is `*caption*`), and it is **not** repeated in the trailing gallery.

### Remove

- "Remove" → confirm dialog naming the file and warning if it is the cover or referenced in the body (simple string search of the body for the path). Deletes the row, then the object.

## Portraits (Site page)

Two slots: **Home (4:5)** and **About (3:4)**, plus one shared alt text. Upload replaces the previous object (old object deleted after the new path is saved). Image guidance shown inline:

- Minimum 1600px on the short side.
- Provide the crop already made, or upload a larger image and use the inline crop preview to check what is visible at 4:5 and 3:4 (V1 does not crop server-side; the CSS `object-position` is fixed to `center top` — so frame the photo accordingly).
- No filters. Colour. Neutral or environmental background is fine; avoid busy backgrounds behind the face.

## Maintenance (Site page → Storage)

- Total bytes used (sum of rows) and object count (from a storage listing).
- **Orphans**: objects in `media/projects/**` with no matching `project_images.storage_path`, and `media/site/*` objects not referenced by `site_settings`. Listed with size; "Remove orphans" deletes them after confirmation.
- No scheduled jobs.

## Limits

| Limit | Value | Where enforced |
|-------|-------|----------------|
| File types | png, jpeg, webp, avif | client `accept` + server sniff |
| File size | no cap; files over 2.5 MB or 2560px are downsized in the browser before upload (WebP q0.9), and the server caps the long side at 4000px | client + server |
| Dimensions | short side ≥ 320px, long side ≤ 8000px | server (`sharp`) |
| Images per project | soft warning > 12 | client |
| Alt text | ≥ 3 chars, ≤ 300 | server |
| Caption | ≤ 300 | server |

## Failure handling

- Validation failure → the row shows the reason ("Not a valid image") with Remove.
- Network failure → "Upload failed" with Retry (re-submits the same file) or Remove.
- Storage upload succeeds but row insert fails → the action deletes the object and returns an error (no orphan). Row insert succeeds but revalidation fails → logged; the next publish/save revalidates again.
