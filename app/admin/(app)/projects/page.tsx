import Link from "next/link";
import { ProjectRowActions } from "@/components/admin/ProjectRowActions";
import { Badge, Button } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { cn } from "@/lib/utils/cn";
import { STATUS_LABEL, TYPE_LABEL, formatDate } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

type Search = { q?: string; state?: string; featured?: string; type?: string };

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("projects")
    .select("id, name, slug, type, status, year, is_featured, is_published, sort_order, updated_at, project_images(id, bytes)")
    .order("sort_order")
    .order("created_at");
  if (sp.q) query = query.or(`name.ilike.%${sp.q.replace(/[%,]/g, "")}%,slug.ilike.%${sp.q.replace(/[%,]/g, "")}%`);
  if (sp.state === "draft") query = query.eq("is_published", false);
  if (sp.state === "published") query = query.eq("is_published", true);
  if (sp.featured === "1") query = query.eq("is_featured", true);
  if (sp.type === "project" || sp.type === "experiment" || sp.type === "client") query = query.eq("type", sp.type);

  const { data: projects, error } = await query;
  if (error) throw new Error(error.message);

  const { data: allForStats } = await supabase.from("projects").select("is_published, is_featured, project_images(bytes)");
  const stats = {
    total: allForStats?.length ?? 0,
    published: allForStats?.filter((p) => p.is_published).length ?? 0,
    featured: allForStats?.filter((p) => p.is_featured).length ?? 0,
    bytes: allForStats?.reduce((sum, p) => sum + p.project_images.reduce((s, i) => s + (i.bytes ?? 0), 0), 0) ?? 0,
  };

  const filterLink = (label: string, params: Record<string, string | undefined>, active: boolean) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, ...params })) if (v) qs.set(k, v);
    const href = qs.toString() ? `/admin/projects?${qs}` : "/admin/projects";
    return (
      <Link key={label} href={href} className={cn("meta", active ? "text-accent" : "text-fg-muted hover:text-fg")} aria-current={active ? "page" : undefined}>
        {label}
      </Link>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-mono text-display-md font-medium text-fg">Projects</h1>
          <p className="meta mt-2 text-fg-subtle">
            {stats.total} total · {stats.published} published · {stats.featured} featured · {(stats.bytes / 1024 / 1024).toFixed(1)} MB media
          </p>
        </div>
        <Link href="/admin/projects/new"><Button variant="primary">+ New project</Button></Link>
      </div>

      <form className="mt-8 flex flex-col gap-4 border-y border-rule py-4 sm:flex-row sm:items-center sm:justify-between" role="search">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {filterLink("All", { state: undefined, featured: undefined, type: undefined }, !sp.state && !sp.featured && !sp.type)}
          {filterLink("Drafts", { state: "draft" }, sp.state === "draft")}
          {filterLink("Published", { state: "published" }, sp.state === "published")}
          {filterLink("Featured", { featured: "1" }, sp.featured === "1")}
          {filterLink("Experiments", { type: "experiment" }, sp.type === "experiment")}
          {filterLink("Client work", { type: "client" }, sp.type === "client")}
        </div>
        <div className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Search name or slug"
            aria-label="Search projects"
            className="h-9 w-full rounded-[4px] border border-rule-strong bg-bg-sunken px-3 text-small text-fg placeholder:text-fg-subtle/70 focus:border-accent focus:outline-none sm:w-64"
          />
          <Button type="submit" size="sm" className="h-9">Search</Button>
        </div>
      </form>

      {projects.length === 0 ? (
        <p className="mt-10 font-mono text-small text-fg-subtle">
          {stats.total === 0 ? "No projects yet. Create the first one." : "No projects match these filters."}
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-rule">
          {projects.map((p, i) => (
            <li key={p.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:gap-6">
              <ProjectRowActions id={p.id} isFirst={i === 0} isLast={i === projects.length - 1} isFeatured={p.is_featured} isPublished={p.is_published} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/projects/${p.id}`} className="font-mono text-body font-medium text-fg hover:text-accent">{p.name}</Link>
                  {p.is_published ? <Badge tone="accent">Published</Badge> : <Badge>Draft</Badge>}
                  {p.is_featured ? <Badge tone="accent">Featured</Badge> : null}
                </div>
                <p className="meta mt-1.5 text-fg-subtle">
                  /work/{p.slug} · {TYPE_LABEL[p.type]} · {p.year} · {STATUS_LABEL[p.status]} · {p.project_images.length} img · edited {formatDate(p.updated_at)}
                </p>
              </div>
              <div className="flex gap-4">
                <Link href={`/admin/preview/${p.id}`} className="meta text-fg-muted hover:text-fg" target="_blank">Preview <span aria-hidden="true">↗</span></Link>
                <Link href={`/admin/projects/${p.id}`} className="meta text-fg-muted hover:text-fg">Edit <span aria-hidden="true">→</span></Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
