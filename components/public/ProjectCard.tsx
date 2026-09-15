import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProjectWithRelations } from "@/types/database";
import { coverOf, techsOf } from "@/lib/db/public";
import { mediaUrl } from "@/lib/supabase/env";
import { STATUS_LABEL, TYPE_LABEL } from "@/lib/utils/format";
import { TechLogo } from "@/components/shared/TechLogo";

const BLOBS = [
  "42% 58% 63% 37% / 41% 44% 56% 59%",
  "63% 37% 47% 53% / 38% 63% 37% 62%",
  "39% 61% 38% 62% / 58% 39% 61% 42%",
  "58% 42% 64% 36% / 49% 56% 44% 51%",
];
const BLOB_COLORS = ["bg-blue-200 dark:bg-blue-500/20", "bg-emerald-200 dark:bg-emerald-500/20", "bg-amber-200 dark:bg-amber-500/20", "bg-violet-200 dark:bg-violet-500/20"];

type Props = { project: ProjectWithRelations; index?: number; priority?: boolean };

/** White floating card with the real screenshot, name, one-liner and stack. */
export function ProjectCard({ project, index = 0, priority = false }: Props) {
  const cover = coverOf(project);
  const techs = techsOf(project);
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.9rem] border border-black/[0.06] bg-white shadow-[0_28px_60px_-34px_rgba(15,23,42,0.3)] transition-transform duration-300 hover:-translate-y-2 dark:border-white/10 dark:bg-slate-900"
    >
      <div className={`pointer-events-none absolute -right-8 -top-10 h-44 w-44 opacity-70 ${BLOB_COLORS[index % BLOB_COLORS.length]}`} style={{ borderRadius: BLOBS[index % BLOBS.length] }} />

      <div className="relative m-4 mb-0 overflow-hidden rounded-[1.3rem] border border-black/[0.06] bg-slate-100 dark:border-white/10 dark:bg-slate-800">
        <div className={project.cover_aspect === "4:5" ? "relative aspect-[4/5] max-h-[360px]" : "relative aspect-[16/10]"}>
          {cover ? (
            <Image src={mediaUrl(cover.storage_path)} alt={cover.alt} fill priority={priority} sizes="(min-width: 1024px) 560px, 100vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">No image yet</div>
          )}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{project.name}</h3>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition-transform group-hover:rotate-45 dark:bg-blue-600">
            <ArrowUpRight size={16} />
          </span>
        </div>
        {project.one_liner ? <p className="mt-2 leading-relaxed text-slate-500 dark:text-slate-400">{project.one_liner}</p> : null}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">{TYPE_LABEL[project.type]}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:bg-white/10 dark:text-slate-300">{project.year} · {STATUS_LABEL[project.status]}</span>
          <span className="ml-auto flex items-center gap-1.5" aria-label={`Built with ${techs.map((t) => t.name).join(", ")}`}>
            {techs.slice(0, 5).map((t) => (
              <span key={t.id} className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.06] bg-white dark:border-white/10 dark:bg-slate-800">
                <TechLogo name={t.name} icon={t.icon} size={18} />
              </span>
            ))}
            {techs.length > 5 ? <span className="text-[11px] font-semibold text-slate-400">+{techs.length - 5}</span> : null}
          </span>
        </div>
      </div>
    </Link>
  );
}
