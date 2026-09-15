import Image from "next/image";
import Link from "next/link";
import { ProjectRowActions } from "@/components/admin/ProjectRowActions";
import { Badge, Card, PageHeader } from "@/components/admin/ui";
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
    .select("id, name, slug, type, status, year, is_featured, is_published, sort_order, updated_at, project_images(id, bytes, storage_path, is_cover, alt)")
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

  const { data: allForStats } = await supabase.from("projects").select("is_published, is_featured");
  const stats = {
    total: allForStats?.length ?? 0,
    published: allForStats?.filter((p) => p.is_published).length ?? 0,
    featured: allForStats?.filter((p) => p.is_featured).length ?? 0,
  };

  const filterLink = (label: string, params: Record<string, string | undefined>, active: boolean) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, ...params })) if (v) qs.set(k, v);
    const href = qs.toString() ? `/admin/projects?${qs}` : "/admin/projects";
    return (
      <Link key={label} href={href} aria-current={active ? "page" : undefined} className={cn("rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors", active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
        {label}
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Content"
        title="Projects"
        description={`${stats.total} total · ${stats.published} published · ${stats.featured} featured. Drag order with the arrows; featured projects lead the homepage.`}
        action={<Link href="/admin/projects/new" className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,0.6)] hover:bg-blue-500">+ New project</Link>}
      />

      <Card>
        <form className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between" role="search">
          <div className="flex flex-wrap gap-2">
            {filterLink("All", { state: undefined, featured: undefined, type: undefined }, !sp.state && !sp.featured && !sp.type)}
            {filterLink("Drafts", { state: "draft" }, sp.state === "draft")}
            {filterLink("Published", { state: "published" }, sp.state === "published")}
            {filterLink("Featured", { featured: "1" }, sp.featured === "1")}
            {filterLink("Experiments", { type: "experiment" }, sp.type === "experiment")}
            {filterLink("Client work", { type: "client" }, sp.type === "client")}
          </div>
          <div className="flex gap-2">
            <input type="search" name="q" defaultValue={sp.q ?? ""} placeholder="Search name or slug" aria-label="Search projects" className="h-10 w-full rounded-xl border border-black/[0.08] bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none md:w-64" />
            <button type="submit" className="h-10 rounded-xl border border-black/[0.08] bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Search</button>
          </div>
        </form>

        {projects.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-black/[0.1] p-10 text-center">
            <p className="font-display text-lg font-semibold text-slate-900">{stats.total === 0 ? "No projects yet" : "Nothing matches these filters"}</p>
            <p className="mt-1 text-sm text-slate-500">{stats.total === 0 ? "Create the first one. It starts as a draft; nothing is public until you publish." : "Try clearing the filters."}</p>
            {stats.total === 0 ? <Link href="/admin/projects/new" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Create a project</Link> : null}
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-black/[0.06]">
            {projects.map((p, i) => {
              const cover = p.project_images.find((img) => img.is_cover) ?? p.project_images[0];
              return (
                <li key={p.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {cover ? <Image src={mediaUrl(cover.storage_path)} alt={cover.alt} fill sizes="96px" className="object-cover object-top" /> : <span className="flex h-full items-center justify-center text-[10px] font-bold uppercase tracking-wider text-slate-400">No cover</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/admin/projects/${p.id}`} className="font-display text-lg font-semibold text-slate-900 hover:text-blue-600">{p.name}</Link>
                      {p.is_published ? <Badge tone="success">Published</Badge> : <Badge>Draft</Badge>}
                      {p.is_featured ? <Badge tone="accent">Featured</Badge> : null}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      /work/{p.slug} · {TYPE_LABEL[p.type]} · {p.year} · {STATUS_LABEL[p.status]} · {p.project_images.length} image{p.project_images.length === 1 ? "" : "s"} · edited {formatDate(p.updated_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <ProjectRowActions id={p.id} isFirst={i === 0} isLast={i === projects.length - 1} isFeatured={p.is_featured} isPublished={p.is_published} />
                    <Link href={`/admin/preview/${p.id}`} target="_blank" className="text-sm font-semibold text-slate-600 hover:text-slate-900">Preview</Link>
                    <Link href={`/admin/projects/${p.id}`} className="rounded-xl border border-black/[0.08] bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">Edit</Link>
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
