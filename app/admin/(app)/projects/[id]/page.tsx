import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { ProgressMeter } from "@/components/admin/ProgressMeter";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { PublishPanel } from "@/components/admin/PublishPanel";
import { Badge, PageHeader } from "@/components/admin/ui";
import { PROJECT_SELECT, normalizeProject } from "@/lib/db/public";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { formatDate } from "@/lib/utils/format";
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

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/admin/projects" className="text-sm font-semibold text-slate-500 hover:text-slate-900">← Projects</Link>
        <div className="mt-3">
          <PageHeader
            eyebrow={`/work/${project.slug}`}
            title={project.name}
            description={`Edited ${formatDate(project.updated_at)}${project.published_at ? ` · first published ${formatDate(project.published_at)}` : ""}`}
            action={
              <div className="flex items-center gap-2">
                {project.is_published ? <Badge tone="success">Published</Badge> : <Badge>Draft</Badge>}
                {project.is_featured ? <Badge tone="accent">Featured</Badge> : null}
                <Link href={`/admin/preview/${project.id}`} target="_blank" className="rounded-xl border border-black/[0.08] bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">Preview</Link>
              </div>
            }
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="flex min-w-0 flex-col gap-8">
          <ProjectForm project={project} technologies={(techs ?? []) as TechnologyRow[]} />
          <div id="images" className="scroll-mt-28">
            <GalleryManager projectId={project.id} images={project.project_images} />
          </div>
          <div id="publish" className="scroll-mt-28">
            <PublishPanel project={project} />
          </div>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ProgressMeter project={project} />
        </aside>
      </div>
    </div>
  );
}
