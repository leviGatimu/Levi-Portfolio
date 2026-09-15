import Image from "next/image";
import Link from "next/link";
import type { ProjectWithRelations } from "@/types/database";
import { Prose, type ImageDimensions } from "@/components/shared/Prose";
import { Reveal } from "@/components/shared/Reveal";
import { coverOf, techsOf } from "@/lib/db/public";
import { mediaUrl } from "@/lib/supabase/env";
import { cn } from "@/lib/utils/cn";
import { STATUS_LABEL, TYPE_LABEL, formatIndex } from "@/lib/utils/format";
import { ProjectPanel } from "./ProjectPanel";

type Props = {
  project: ProjectWithRelations;
  next: ProjectWithRelations | null;
  position?: { index: number; total: number };
  preview?: boolean;
};

const VIDEO_HOSTS = ["www.youtube.com", "youtube.com", "youtu.be", "www.youtube-nocookie.com", "vimeo.com", "player.vimeo.com"];

function embedUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    if (!VIDEO_HOSTS.includes(u.hostname)) return null;
    if (u.hostname === "youtu.be") return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("youtube")) {
      const id = u.searchParams.get("v") ?? u.pathname.split("/embed/")[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    const vimeoId = u.pathname.split("/").filter(Boolean).pop();
    return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : null;
  } catch {
    return null;
  }
}

export function CaseStudy({ project, next, position, preview = false }: Props) {
  const cover = coverOf(project);
  const techs = techsOf(project);
  const gallery = project.project_images.filter((i) => !i.is_cover);
  const bodyImages: ImageDimensions = Object.fromEntries(
    project.project_images.map((i) => [mediaUrl(i.storage_path), { width: i.width, height: i.height, alt: i.alt }]),
  );
  const referenced = new Set(project.project_images.filter((i) => project.body_md.includes(mediaUrl(i.storage_path))).map((i) => i.id));
  const trailingGallery = gallery.filter((i) => !referenced.has(i.id));
  const video = project.video_url ? embedUrl(project.video_url) : null;

  const meta: { label: string; value: React.ReactNode }[] = [
    { label: "Role", value: project.role || "Not specified" },
    { label: "Team", value: project.team || "Not specified" },
    { label: "Timeline", value: project.timeline || String(project.year) },
    { label: "Status", value: STATUS_LABEL[project.status] },
    {
      label: "Stack",
      value: techs.length ? techs.map((t) => t.name).join(" · ") : "Not specified",
    },
  ];

  return (
    <article className="container-site py-12 lg:py-20">
      {preview ? (
        <div className="no-print mb-8 flex items-center justify-between rounded-[3px] bg-accent px-4 py-2 font-mono text-xs text-accent-ink">
          <span>Preview: this is a draft, visible only to you</span>
          <Link href={`/admin/projects/${project.id}`} className="underline">Back to editor</Link>
        </div>
      ) : null}

      {/* Header */}
      <header className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="meta flex flex-wrap items-center gap-x-3 text-fg-subtle">
            {position ? <span className="text-accent">{formatIndex(position.index)} / {formatIndex(position.total)}</span> : null}
            <span>{TYPE_LABEL[project.type]}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
            <span aria-hidden="true">·</span>
            <span>{STATUS_LABEL[project.status]}</span>
          </p>
          <h1 className="mt-5 font-mono text-display-lg font-medium text-fg">{project.name}</h1>
          {project.one_liner ? <p className="mt-5 max-w-[52ch] text-lead text-fg-muted">{project.one_liner}</p> : null}
        </div>
        <ul className="flex flex-wrap gap-1.5 self-end lg:col-span-4 lg:justify-end" aria-label="Technologies">
          {techs.map((t) => (
            <li key={t.id} className="chip">{t.name}</li>
          ))}
        </ul>
      </header>

      {/* Metadata */}
      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-rule py-6 md:grid-cols-3 lg:grid-cols-6">
        {meta.map((m) => (
          <div key={m.label} className={cn(m.label === "Stack" && "col-span-2 md:col-span-3 lg:col-span-2")}>
            <dt className="meta text-fg-subtle">{m.label}</dt>
            <dd className="meta-lg mt-2 text-fg">{m.value}</dd>
          </div>
        ))}
        {project.links.length > 0 || project.repo_visibility === "private" ? (
          <div className="col-span-2 md:col-span-3 lg:col-span-6 lg:border-t lg:border-rule lg:pt-6">
            <dt className="meta text-fg-subtle">Links</dt>
            <dd className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
              {project.links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="meta-lg link-underline text-fg">
                  {l.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
              {project.repo_visibility === "private" ? <span className="meta-lg text-fg-subtle">Private repository</span> : null}
            </dd>
          </div>
        ) : null}
      </dl>

      {/* Hero image */}
      {cover ? (
        <figure className="mt-10 lg:mt-14">
          <div
            className={cn(
              "relative overflow-hidden rounded-[4px] shadow-[inset_0_0_0_1px_var(--color-rule)]",
              project.cover_aspect === "4:5" ? "mx-auto max-w-[520px] aspect-[4/5]" : "aspect-[16/10]",
            )}
          >
            <Image src={mediaUrl(cover.storage_path)} alt={cover.alt} fill priority sizes="(min-width: 1440px) 1312px, 100vw" className="object-cover object-top" />
          </div>
          {cover.caption ? <figcaption className="meta-lg mt-3 text-fg-subtle">{cover.caption}</figcaption> : null}
        </figure>
      ) : null}

      {video ? (
        <div className="mt-8 aspect-video overflow-hidden rounded-[4px] bg-bg-sunken">
          <iframe src={video} title={`${project.name} video`} className="h-full w-full" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />
        </div>
      ) : project.video_url ? (
        <p className="mt-6">
          <a href={project.video_url} target="_blank" rel="noopener noreferrer" className="meta-lg link-underline text-fg">Watch the video <span aria-hidden="true">↗</span></a>
        </p>
      ) : null}

      {/* Narrative */}
      <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-24">
            <span className="meta text-fg-subtle">Case study</span>
            {project.summary ? <p className="mt-3 text-small text-fg-muted">{project.summary}</p> : null}
          </div>
        </aside>
        <div className="lg:col-span-8 lg:col-start-5">
          {project.body_md.trim() ? (
            <Prose markdown={project.body_md} images={bodyImages} />
          ) : (
            <p className="font-mono text-small text-fg-subtle">The write-up for this project is coming.</p>
          )}
        </div>
      </div>

      {/* Trailing gallery */}
      {trailingGallery.length > 0 ? (
        <section className="mt-16 lg:mt-24" aria-label="Gallery">
          <div className="grid gap-8 lg:grid-cols-12">
            {trailingGallery.map((img, i) => (
              <Reveal
                key={img.id}
                as="div"
                className={cn(
                  img.is_wide ? "lg:col-span-12" : "lg:col-span-8",
                  !img.is_wide && i % 2 === 1 && "lg:col-start-5",
                )}
              >
                <figure>
                  <div className="overflow-hidden rounded-[4px] shadow-[inset_0_0_0_1px_var(--color-rule)]">
                    <Image
                      src={mediaUrl(img.storage_path)}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      sizes={img.is_wide ? "(min-width: 1440px) 1312px, 100vw" : "(min-width: 1024px) 860px, 100vw"}
                      className="h-auto w-full"
                    />
                  </div>
                  {img.caption ? <figcaption className="meta-lg mt-3 text-fg-subtle">{img.caption}</figcaption> : null}
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* Next */}
      {next && next.id !== project.id ? (
        <nav className="mt-20 border-t border-rule pt-10 lg:mt-28" aria-label="Next project">
          <span className="meta text-fg-subtle">Next project</span>
          <div className="mt-6 md:max-w-[640px]">
            <ProjectPanel project={next} />
          </div>
        </nav>
      ) : null}
    </article>
  );
}
