import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ExternalLink, Eye, FolderKanban, Layers, Star } from "lucide-react";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { ProgressMeter } from "@/components/admin/ProgressMeter";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { PublishPanel } from "@/components/admin/PublishPanel";
import { Badge, Breadcrumbs, Card, IconLink, InfoRow } from "@/components/admin/ui";
import { PROJECT_SELECT, coverOf, normalizeProject, techsOf } from "@/lib/db/public";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { mediaUrl } from "@/lib/supabase/env";
import { STATUS_LABEL, TYPE_LABEL, formatDate } from "@/lib/utils/format";
import { TechLogo } from "@/components/shared/TechLogo";
import type { ProjectWithRelations, TechnologyRow } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const [{ data }, { data: techs }] = await Promise.all([
    supabase.from("projects").select(PROJECT_SELECT).eq("id", id).maybeSingle(),
    supabase.from("technologies").select("*").order("group").order("sort_order").order("name"),
  ]);
  if (!data) notFound();
  const project = normalizeProject(data as unknown as ProjectWithRelations);
  const cover = coverOf(project);
  const stack = techsOf(project);

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs items={[{ label: "Content" }, { label: "Projects", href: "/admin/projects" }, { label: project.name }]} />

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        {/* Left: summary, like the reference profile card */}
        <div className="flex flex-col gap-5 xl:sticky xl:top-6 xl:self-start">
          <Card
            title="Project"
            icon={<FolderKanban size={18} />}
            actions={
              <>
                <IconLink href={`/admin/preview/${project.id}`} label="Preview draft"><Eye size={16} /></IconLink>
                {project.is_published ? <IconLink href={`/work/${project.slug}`} label="View live" external><ExternalLink size={16} /></IconLink> : null}
              </>
            }
          >
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-[17px] font-semibold text-[#111]">{project.name}</h1>
              {project.is_published ? <Badge tone="success">Published</Badge> : <Badge>Draft</Badge>}
            </div>
            <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl bg-[#f2f2f4]">
              {cover ? <Image src={mediaUrl(cover.storage_path)} alt={cover.alt} fill sizes="360px" className="object-cover object-top" /> : <span className="flex h-full items-center justify-center text-[12px] text-[#9a9a9a]">No cover yet</span>}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f2f2f4] px-3 py-1.5 text-[12px] font-medium text-[#333]">{TYPE_LABEL[project.type]}</span>
              <span className="rounded-full bg-[#f2f2f4] px-3 py-1.5 text-[12px] font-medium text-[#333]">{STATUS_LABEL[project.status]}</span>
              <span className="rounded-full bg-[#f2f2f4] px-3 py-1.5 text-[12px] font-medium text-[#333]">{project.year}</span>
              {project.is_featured ? <span className="inline-flex items-center gap-1 rounded-full bg-[#f2f2f4] px-3 py-1.5 text-[12px] font-medium text-[#333]"><Star size={12} /> Featured</span> : null}
            </div>
            {stack.length > 0 ? (
              <div className="mt-4">
                <p className="text-[12px] font-medium text-[#8a8a8a]">Stack</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {stack.map((t) => (
                    <span key={t.id} className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] px-2.5 py-1 text-[12px] text-[#333]"><TechLogo name={t.name} icon={t.icon} size={14} /> {t.name}</span>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-2">
              <InfoRow icon={<Layers size={16} />} label="URL"><Link href={`/work/${project.slug}`} className="hover:underline">/work/{project.slug}</Link></InfoRow>
              <InfoRow icon={<CalendarDays size={16} />} label="Edited">{formatDate(project.updated_at)}{project.published_at ? ` · first published ${formatDate(project.published_at)}` : ""}</InfoRow>
            </div>
          </Card>
          <ProgressMeter project={project} />
        </div>

        {/* Right: editable sections */}
        <div className="flex min-w-0 flex-col gap-5">
          <ProjectForm project={project} technologies={(techs ?? []) as TechnologyRow[]} />
          <div id="images" className="scroll-mt-28"><GalleryManager projectId={project.id} images={project.project_images} /></div>
          <div id="publish" className="scroll-mt-28"><PublishPanel project={project} /></div>
        </div>
      </div>
    </div>
  );
}
