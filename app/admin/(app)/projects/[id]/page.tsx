import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { PublishPanel } from "@/components/admin/PublishPanel";
import { Badge } from "@/components/admin/ui";
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
    <div>
      <Link href="/admin/projects" className="meta text-fg-muted hover:text-fg">← Projects</Link>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-display-md font-medium text-fg">{project.name}</h1>
        {project.is_published ? <Badge tone="accent">Published</Badge> : <Badge>Draft</Badge>}
        {project.is_featured ? <Badge tone="accent">Featured</Badge> : null}
      </div>
      <p className="meta mt-2 text-fg-subtle">
        /work/{project.slug} · edited {formatDate(project.updated_at)}
        {project.published_at ? ` · first published ${formatDate(project.published_at)}` : ""}
      </p>

      <div className="mt-10 flex flex-col gap-12">
        <ProjectForm project={project} technologies={(techs ?? []) as TechnologyRow[]} />
        <GalleryManager projectId={project.id} images={project.project_images} />
        <PublishPanel project={project} />
      </div>
    </div>
  );
}
