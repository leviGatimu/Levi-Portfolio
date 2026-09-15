import Image from "next/image";
import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";
import { ProjectRowActions } from "@/components/admin/ProjectRowActions";
import { Badge, Breadcrumbs, Card, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { mediaUrl } from "@/lib/supabase/env";
import { cn } from "@/lib/utils/cn";
import { STATUS_LABEL, TYPE_LABEL, formatDate } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

type Search = { q?: string; state?: string; featured?: string; type?: string };

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("projects")
    .select("id, name, slug, type, status, year, is_featured, is_published, sort_order, updated_at, project_images(id, storage_path, is_cover, alt)")
    .order("sort_order")
    .order("created_at");
  const q = sp.q?.replace(/[%,]/g, "") ?? "";
  if (q) query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%`);
  if (sp.state === "draft") query = query.eq("is_published", false);
  if (sp.state === "published") query = query.eq("is_published", true);
  if (sp.featured === "1") query = query.eq("is_featured", true);
  if (sp.type === "project" || sp.type === "experiment" || sp.type === "client") query = query.eq("type", sp.type);

  const { data: projects, error } = await query;
  if (error) throw new Error(error.message);
  const { data: all } = await supabase.from("projects").select("is_published, is_featured");
  const stats = { total: all?.length ?? 0, published: all?.filter((p) => p.is_published).length ?? 0, featured: all?.filter((p) => p.is_featured).length ?? 0 };

  const filterLink = (label: string, params: Record<string, string | undefined>, active: boolean) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, ...params })) if (v) qs.set(k, v);
    const href = qs.toString() ? `/admin/projects?${qs}` : "/admin/projects";
    return (
      <Link key={label} href={href} aria-current={active ? "page" : undefined} className={cn("rounded-full px-3.5 py-1.5 text-[13px] font-medium", active ? "bg-[#111] text-white" : "border border-black/[0.1] bg-white text-[#555] hover:bg-[#f2f2f4]")}>
        {label}
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs items={[{ label: "Content" }, { label: "Projects" }]} />
      <PageHeader
        title="Projects"
        description={`${stats.total} total, ${stats.published} published, ${stats.featured} featured. Use the arrows to order; featured projects lead the home page.`}
        action={<Link href="/admin/projects/new" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#111] px-5 text-[14px] font-medium text-white hover:bg-black"><Plus size={16} /> New project</Link>}
      />

      <Card title="All projects" icon={<FolderKanban size={18} />} subtitle={q ? `Search: "${q}"` : undefined} bodyClassName="p-0 sm:p-0">
        <div className="flex flex-wrap gap-2 border-b border-black/[0.06] px-5 py-3.5">
          {filterLink("All", { state: undefined, featured: undefined, type: undefined }, !sp.state && !sp.featured && !sp.type)}
          {filterLink("Drafts", { state: "draft" }, sp.state === "draft")}
          {filterLink("Published", { state: "published" }, sp.state === "published")}
          {filterLink("Featured", { featured: "1" }, sp.featured === "1")}
          {filterLink("Experiments", { type: "experiment" }, sp.type === "experiment")}
          {filterLink("Client work", { type: "client" }, sp.type === "client")}
        </div>

        {projects.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-[15px] font-semibold text-[#111]">{stats.total === 0 ? "No projects yet" : "Nothing matches these filters"}</p>
            <p className="mt-1 text-[13px] text-[#777]">{stats.total === 0 ? "Create the first one. It starts as a draft; nothing is public until you publish." : "Try clearing the filters."}</p>
          </div>
        ) : (
          <ul className="divide-y divide-black/[0.06]">
            {projects.map((p, i) => {
              const cover = p.project_images.find((img) => img.is_cover) ?? p.project_images[0];
              return (
                <li key={p.id} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f2f2f4]">
                    {cover ? <Image src={mediaUrl(cover.storage_path)} alt={cover.alt} fill sizes="80px" className="object-cover object-top" /> : <span className="flex h-full items-center justify-center text-[10px] font-medium text-[#9a9a9a]">No cover</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/admin/projects/${p.id}`} className="text-[15px] font-semibold text-[#111] hover:underline">{p.name}</Link>
                      {p.is_published ? <Badge tone="success">Published</Badge> : <Badge>Draft</Badge>}
                      {p.is_featured ? <Badge tone="accent">Featured</Badge> : null}
                    </div>
                    <p className="mt-1 text-[12px] text-[#8a8a8a]">/work/{p.slug} · {TYPE_LABEL[p.type]} · {p.year} · {STATUS_LABEL[p.status]} · {p.project_images.length} image{p.project_images.length === 1 ? "" : "s"} · edited {formatDate(p.updated_at)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <ProjectRowActions id={p.id} isFirst={i === 0} isLast={i === projects.length - 1} isFeatured={p.is_featured} isPublished={p.is_published} />
                    <Link href={`/admin/projects/${p.id}`} className="inline-flex h-9 items-center rounded-full border border-black/[0.1] bg-white px-4 text-[13px] font-medium text-[#111] hover:bg-[#f2f2f4]">Edit</Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
