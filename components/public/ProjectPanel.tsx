import Image from "next/image";
import Link from "next/link";
import type { ProjectWithRelations } from "@/types/database";
import { coverOf, techsOf } from "@/lib/db/public";
import { mediaUrl } from "@/lib/supabase/env";
import { cn } from "@/lib/utils/cn";
import { STATUS_LABEL, TYPE_LABEL } from "@/lib/utils/format";

type Props = {
  project: ProjectWithRelations;
  accentTitle?: boolean;
  size?: "large" | "default";
  priority?: boolean;
  className?: string;
};

/**
 * The project card: a raised panel with the name and stack at the top and the
 * real screenshot pinned to the bottom edge, cropped by the panel — the whole
 * panel is one link to the case study.
 */
export function ProjectPanel({ project, accentTitle = false, size = "default", priority = false, className }: Props) {
  const cover = coverOf(project);
  const techs = techsOf(project);
  const portrait = project.cover_aspect === "4:5";

  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn(
        "group panel relative flex flex-col overflow-hidden transition-colors duration-300 hover:bg-[#2e2f35]",
        size === "large" ? "p-7 sm:p-9 lg:p-11" : "p-6 sm:p-7",
        className,
      )}
      aria-label={`${project.name}: ${project.one_liner || "read the case study"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3
            className={cn(
              "font-mono font-medium tracking-tight",
              size === "large" ? "text-display-md" : "text-heading",
              accentTitle ? "text-accent" : "text-fg",
            )}
          >
            {project.name}
          </h3>
          {project.one_liner ? (
            <p className={cn("mt-2 max-w-[44ch] text-fg-muted", size === "large" ? "text-lead" : "text-small")}>{project.one_liner}</p>
          ) : null}
        </div>
        <ul className="hidden shrink-0 flex-wrap justify-end gap-1.5 sm:flex" aria-label="Technologies">
          {techs.slice(0, 3).map((t) => (
            <li key={t.id} className="chip">{t.name}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="meta text-fg-subtle">{TYPE_LABEL[project.type]}</span>
        <span aria-hidden="true" className="text-fg-subtle">·</span>
        <span className="meta text-fg-subtle">{project.year}</span>
        <span aria-hidden="true" className="text-fg-subtle">·</span>
        <span className="meta text-fg-subtle">{STATUS_LABEL[project.status]}</span>
      </div>

      <div
        className={cn(
          "relative mt-8 overflow-hidden rounded-tl-[4px] shadow-[inset_0_0_0_1px_var(--color-rule)] transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:-translate-y-1.5",
          portrait ? "-mb-10 ml-auto w-[62%] max-w-[360px] aspect-[4/5] sm:-mr-2" : "-mb-12 -mr-8 ml-2 aspect-[16/10] sm:-mr-12 sm:ml-6",
          size === "large" && !portrait && "lg:-mb-16 lg:-mr-16 lg:ml-10 lg:aspect-[2/1]",
        )}
      >
        {cover ? (
          <Image
            src={mediaUrl(cover.storage_path)}
            alt={cover.alt}
            fill
            sizes={size === "large" ? "(min-width: 1024px) 1200px, 100vw" : "(min-width: 1024px) 640px, 100vw"}
            className="object-cover object-left-top"
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-bg-sunken">
            <span className="meta text-fg-subtle">No image yet</span>
          </div>
        )}
      </div>
    </Link>
  );
}
