"use client";

import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import { deleteProjectImage, moveProjectImage, setCoverImage, updateProjectImage, uploadProjectImages } from "@/lib/actions/images";
import { mediaUrl } from "@/lib/supabase/env";
import { prepareFormFiles } from "@/lib/utils/client-image";
import type { ProjectImageRow } from "@/types/database";
import { ActionButton } from "./ActionButton";
import { Badge, Button, Field, Fieldset, Input, Notice, Textarea } from "./ui";

type Props = { projectId: string; images: ProjectImageRow[] };

export function GalleryManager({ projectId, images }: Props) {
  const [state, action, pending] = useActionState(uploadProjectImages.bind(null, projectId), undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [preparing, setPreparing] = useState(false);

  return (
    <Fieldset legend="Images" description="Real screenshots at 2× (PNG for UI, JPEG for photos). Any size: large files are shrunk in the browser before upload. The first upload becomes the cover; alt text is required.">
      <form
        ref={formRef}
        action={async (fd) => {
          setPreparing(true);
          try {
            action(await prepareFormFiles(fd, "files"));
          } finally {
            setPreparing(false);
          }
          setFileNames([]);
          formRef.current?.reset();
        }}
        className="flex flex-col gap-4 rounded-[4px] border border-dashed border-rule-strong p-5"
      >
        {state ? <Notice tone={state.ok ? "success" : "danger"}>{state.ok ? (state.message ?? "Uploaded") : state.message}</Notice> : null}
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="Files" htmlFor="files" required>
            <input
              id="files"
              name="files"
              type="file"
              multiple
              required
              accept="image/png,image/jpeg,image/webp,image/avif"
              onChange={(e) => setFileNames(Array.from(e.target.files ?? []).map((f) => f.name))}
              className="block w-full text-small text-fg-muted file:mr-3 file:rounded-[4px] file:border file:border-rule-strong file:bg-transparent file:px-3 file:py-2 file:font-mono file:text-[0.625rem] file:uppercase file:tracking-[0.08em] file:text-fg hover:file:bg-bg-raised"
            />
          </Field>
          <Field label="Alt text" htmlFor="upload-alt" required help="Describe what the screenshot shows. Numbered automatically when uploading several." error={state && !state.ok ? state.fieldErrors?.alt : undefined}>
            <Input id="upload-alt" name="alt" required minLength={3} maxLength={300} placeholder="Study Flow dashboard showing today's timetable" />
          </Field>
          <Button type="submit" variant="primary" disabled={pending || preparing} aria-busy={pending || preparing}>
            {preparing ? "Preparing" : pending ? "Uploading" : "Upload"}
          </Button>
        </div>
        {fileNames.length ? <p className="meta text-fg-subtle">{fileNames.join(" · ")}</p> : null}
      </form>

      {images.length === 0 ? (
        <p className="meta text-fg-subtle">No images yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {images.map((img, i) => (
            <ImageRow key={img.id} image={img} isFirst={i === 0} isLast={i === images.length - 1} />
          ))}
        </ul>
      )}
    </Fieldset>
  );
}

function ImageRow({ image, isFirst, isLast }: { image: ProjectImageRow; isFirst: boolean; isLast: boolean }) {
  const [state, action, pending] = useActionState(updateProjectImage.bind(null, image.id), undefined);
  const [copied, setCopied] = useState(false);
  const url = mediaUrl(image.storage_path);
  const markdown = image.caption ? `![${image.alt}](${url} "${image.caption.replace(/"/g, "'")}")` : `![${image.alt}](${url})`;

  return (
    <li className="grid gap-4 rounded-[4px] bg-bg-raised p-4 md:grid-cols-[200px_1fr]">
      <div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[3px] bg-bg-sunken">
          <Image src={url} alt={image.alt} fill sizes="200px" className="object-cover object-top" />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {image.is_cover ? <Badge tone="accent">Cover</Badge> : <ActionButton action={() => setCoverImage(image.id)} size="sm" variant="ghost">Set as cover</ActionButton>}
          <span className="meta text-fg-subtle">{image.width}×{image.height} · {(image.bytes / 1024).toFixed(0)} KB</span>
        </div>
      </div>
      <form action={action} className="flex flex-col gap-3">
        {state ? <p role="status" className={`meta ${state.ok ? "text-success" : "text-danger"}`}>{state.ok ? (state.message ?? "Saved") : state.message}</p> : null}
        <Field label="Alt text" htmlFor={`alt-${image.id}`} required>
          <Input id={`alt-${image.id}`} name="alt" defaultValue={image.alt} minLength={3} maxLength={300} required />
        </Field>
        <Field label="Caption" htmlFor={`caption-${image.id}`}>
          <Textarea id={`caption-${image.id}`} name="caption" defaultValue={image.caption ?? ""} maxLength={300} className="min-h-14" />
        </Field>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <label className="flex items-center gap-2 text-small text-fg">
            <input type="checkbox" name="is_wide" defaultChecked={image.is_wide} className="accent-[var(--color-accent)]" />
            Wide (full width on desktop)
          </label>
          <Button type="submit" size="sm" disabled={pending} aria-busy={pending}>{pending ? "Saving…" : "Save"}</Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={async () => {
              await navigator.clipboard.writeText(markdown);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Copied" : "Copy Markdown"}
          </Button>
          <span className="ml-auto flex items-center gap-1">
            <ActionButton action={() => moveProjectImage(image.id, "up")} disabled={isFirst} size="sm" variant="ghost" aria-label="Move image up">↑</ActionButton>
            <ActionButton action={() => moveProjectImage(image.id, "down")} disabled={isLast} size="sm" variant="ghost" aria-label="Move image down">↓</ActionButton>
            <ActionButton action={() => deleteProjectImage(image.id)} size="sm" variant="danger" confirm={`Remove this image${image.is_cover ? " (it is the cover)" : ""}? This cannot be undone.`}>
              Remove
            </ActionButton>
          </span>
        </div>
      </form>
    </li>
  );
}
