import type { Metadata } from "next";
import Link from "next/link";
import { ProjectPanel } from "@/components/public/ProjectPanel";
import { Reveal } from "@/components/shared/Reveal";
import { getPublishedProjects } from "@/lib/db/public";
import { cn } from "@/lib/utils/cn";
import type { ProjectType } from "@/types/database";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Work",
  description: "Selected software, AI and robotics projects by Levi Gatimu, student developer in Kigali.",
  alternates: { canonical: "/work" },
  openGraph: { type: "website", url: "/work", title: "Work · Levi Gatimu" },
};

const FILTERS: { key: ProjectType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "project", label: "Projects" },
  { key: "experiment", label: "Experiments" },
  { key: "client", label: "Client work" },
];

export default async function WorkPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const active = FILTERS.some((f) => f.key === type) ? (type as ProjectType | "all") : "all";
  const all = await getPublishedProjects();
  const filtered = active === "all" ? all : all.filter((p) => p.type === active);
  const current = filtered.filter((p) => p.status !== "archived");
  const archived = filtered.filter((p) => p.status === "archived");
  const years = all.map((p) => p.year);
  const range = years.length ? `${Math.min(...years)} to ${Math.max(...years)}` : "";

  return (
    <div className="container-site py-14 lg:py-20">
      <span className="meta text-fg-subtle">Work</span>
      <h1 className="mt-4 font-mono text-display-lg font-medium text-fg">All work</h1>
      <p className="meta-lg mt-4 text-fg-subtle">
        {all.length} {all.length === 1 ? "project" : "projects"}{range ? ` · ${range}` : ""}
      </p>

      <nav aria-label="Filter" className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-y border-rule py-4">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "all" ? "/work" : `/work?type=${f.key}`}
            aria-current={active === f.key ? "page" : undefined}
            className={cn("meta transition-colors", active === f.key ? "text-accent" : "text-fg-muted hover:text-fg")}
          >
            {active === f.key ? <span aria-hidden="true">‹ </span> : null}
            {f.label}
            {active === f.key ? <span aria-hidden="true"> ›</span> : null}
          </Link>
        ))}
      </nav>

      {current.length === 0 && archived.length === 0 ? (
        <p className="mt-12 font-mono text-small text-fg-subtle">Nothing here yet.</p>
      ) : null}

      {current.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {current.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 80}>
              <ProjectPanel project={p} accentTitle={i === 0 && p.is_featured} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      ) : null}

      {archived.length > 0 ? (
        <section className="mt-20" aria-labelledby="archive-heading">
          <div className="border-t border-rule pt-8">
            <span className="meta text-fg-subtle">Archive</span>
            <h2 id="archive-heading" className="mt-3 font-mono text-heading font-medium text-fg-muted">Earlier work</h2>
          </div>
          <ul className="mt-6 divide-y divide-rule border-y border-rule">
            {archived.map((p) => (
              <li key={p.id}>
                <Link href={`/work/${p.slug}`} className="group flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="font-mono text-body text-fg group-hover:text-accent">{p.name}</span>
                  <span className="meta-lg text-fg-subtle">
                    {p.one_liner ? `${p.one_liner} · ` : ""}{p.year}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
