import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Lock } from "lucide-react";
import type { ProjectWithRelations } from "@/types/database";
import { Prose, type ImageDimensions } from "@/components/shared/Prose";
import { coverOf, techsOf } from "@/lib/db/public";
import { mediaUrl } from "@/lib/supabase/env";
import { STATUS_LABEL, TYPE_LABEL } from "@/lib/utils/format";
import { TechLogo } from "@/components/shared/TechLogo";
import { Gallery } from "./Gallery";
import { ProjectCard } from "./ProjectCard";
import ScrollReveal from "./ScrollReveal";

type Props = { project: ProjectWithRelations; next: ProjectWithRelations | null; position?: { index: number; total: number }; preview?: boolean };

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
  const bodyImages: ImageDimensions = Object.fromEntries(project.project_images.map((i) => [mediaUrl(i.storage_path), { width: i.width, height: i.height, alt: i.alt }]));
  const gallery = project.project_images
    .filter((i) => !i.is_cover)
    .map((i) => ({ id: i.id, src: mediaUrl(i.storage_path), alt: i.alt, caption: i.caption, width: i.width, height: i.height }));
  const video = project.video_url ? embedUrl(project.video_url) : null;

  const meta = [
    { label: "Role", value: project.role || "Not specified" },
    { label: "Team", value: project.team || "Not specified" },
    { label: "Timeline", value: project.timeline || String(project.year) },
    { label: "Status", value: STATUS_LABEL[project.status] },
  ];

  return (
    <article className="relative">
      <div className="grain" />
      {preview ? (
        <div className="fixed inset-x-0 top-0 z-[110] flex items-center justify-between bg-blue-600 px-6 py-2 text-sm font-semibold text-white">
          <span>Preview: this is a draft, visible only to you</span>
          <Link href={`/admin/projects/${project.id}`} className="underline">Back to editor</Link>
        </div>
      ) : null}

      {/* Header */}
      <section className="px-6 pb-12 pt-40">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-4xl">
            <Link href="/work" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              <ArrowLeft size={16} /> All projects
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">{TYPE_LABEL[project.type]}</span>
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-300">{project.year} · {STATUS_LABEL[project.status]}</span>
              {position ? <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{position.index} of {position.total}</span> : null}
            </div>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-[0.9] tracking-tight text-slate-900 md:text-8xl dark:text-slate-50">{project.name}</h1>
            {project.one_liner ? <p className="mt-7 max-w-2xl text-xl leading-relaxed text-slate-500 md:text-2xl dark:text-slate-400">{project.one_liner}</p> : null}
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label} className="rounded-2xl border border-black/[0.06] bg-white p-5 dark:border-white/10 dark:bg-slate-900">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">{m.label}</p>
                <p className="mt-2 font-medium leading-snug text-slate-900 dark:text-slate-50">{m.value}</p>
              </div>
            ))}
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="mt-4 flex flex-wrap items-center gap-2">
            <ul className="flex flex-wrap items-center gap-2" aria-label="Technologies">
              {techs.map((t) => (
                <li key={t.id} className="group/tech relative flex h-11 w-11 items-center justify-center rounded-2xl border border-black/[0.08] bg-white shadow-sm dark:border-white/15 dark:bg-slate-900">
                  <TechLogo name={t.name} icon={t.icon} size={22} />
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover/tech:opacity-100 group-focus-within/tech:opacity-100">{t.name}</span>
                </li>
              ))}
            </ul>
            {project.links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500">
                {l.label} <ArrowUpRight size={14} className="transition-transform group-hover:rotate-45" />
              </a>
            ))}
            {project.repo_visibility === "private" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-black/15 px-3.5 py-1.5 text-sm font-semibold text-slate-500 dark:border-white/20 dark:text-slate-400"><Lock size={13} /> Private repository</span>
            ) : null}
          </ScrollReveal>
        </div>
      </section>

      {/* Hero image */}
      {cover ? (
        <section className="px-6 pb-8">
          <ScrollReveal className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-blue-300/30 blur-2xl dark:bg-blue-600/20" />
            <figure>
              <div className={`relative overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white shadow-[0_40px_80px_-40px_rgba(15,23,42,0.5)] dark:border-white/10 ${project.cover_aspect === "4:5" ? "mx-auto aspect-[4/5] max-w-[440px]" : "aspect-[16/9]"}`}>
                <Image src={mediaUrl(cover.storage_path)} alt={cover.alt} fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover object-top" />
              </div>
              {cover.caption ? <figcaption className="mt-4 text-center text-sm text-slate-400">{cover.caption}</figcaption> : null}
            </figure>
          </ScrollReveal>
        </section>
      ) : null}

      {video ? (
        <section className="px-6 pb-8">
          <div className="mx-auto aspect-video max-w-5xl overflow-hidden rounded-[2rem] border border-black/[0.06] bg-slate-900 shadow-2xl dark:border-white/10">
            <iframe src={video} title={`${project.name} video`} className="h-full w-full" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />
          </div>
        </section>
      ) : null}

      {/* Narrative */}
      <section className="px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-[1.9rem] border border-black/[0.06] bg-white p-8 dark:border-white/10 dark:bg-slate-900">
                <span className="eyebrow">In short</span>
                <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{project.summary || project.one_liner}</p>
                {project.collaborators.length > 0 ? (
                  <div className="mt-6 border-t border-black/[0.06] pt-5 dark:border-white/10">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Collaborators</p>
                    <ul className="mt-3 space-y-2 text-sm">
                      {project.collaborators.map((c) => (
                        <li key={c.name} className="text-slate-700 dark:text-slate-200">
                          {c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">{c.name}</a> : <span className="font-semibold">{c.name}</span>}
                          <span className="text-slate-400"> · {c.role}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </aside>
          <div className="lg:col-span-8">
            {project.body_md.trim() ? (
              <Prose markdown={project.body_md} images={bodyImages} className="!max-w-none lg:!max-w-[72ch]" />
            ) : (
              <p className="text-lg text-slate-500 dark:text-slate-400">The write-up for this project is coming.</p>
            )}
          </div>
        </div>
      </section>

      <Gallery images={gallery} />

      {/* Next */}
      {next && next.id !== project.id ? (
        <section className="px-6 pb-28 pt-8">
          <ScrollReveal className="mx-auto max-w-7xl">
            <span className="eyebrow">Next project</span>
            <div className="mt-6 grid md:grid-cols-2">
              <ProjectCard project={next} index={1} />
            </div>
          </ScrollReveal>
        </section>
      ) : null}
    </article>
  );
}
