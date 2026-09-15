import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCard } from "@/components/public/ProjectCard";
import ScrollReveal from "@/components/public/ScrollReveal";
import { getPublishedProjects } from "@/lib/db/public";
import type { ProjectType } from "@/types/database";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Work",
  description: "Software, AI and robotics projects by Levi Gatimu, student developer in Kigali.",
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

  return (
    <div className="relative">
      <div className="grain" />
      <section className="px-6 pb-16 pt-40">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-4xl">
            <span className="eyebrow">Work</span>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-[0.9] tracking-tight text-slate-900 md:text-8xl dark:text-slate-50">
              Things I <span className="text-blue-600 dark:text-blue-400">built.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-relaxed text-slate-500 md:text-2xl dark:text-slate-400">
              {all.length === 0 ? "The first case studies are on their way." : `${all.length} ${all.length === 1 ? "project" : "projects"}, each with the real screenshots and the story of how it was made.`}
            </p>
          </ScrollReveal>

          <nav aria-label="Filter" className="mt-12 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Link
                key={f.key}
                href={f.key === "all" ? "/work" : `/work?type=${f.key}`}
                aria-current={active === f.key ? "page" : undefined}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  active === f.key
                    ? "bg-slate-900 text-white shadow-[0_14px_30px_-12px_rgba(15,23,42,0.6)] dark:bg-blue-600"
                    : "border border-black/[0.08] bg-white text-slate-600 hover:text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-7xl">
          {current.length === 0 && archived.length === 0 ? (
            <p className="text-lg text-slate-500 dark:text-slate-400">Nothing here yet.</p>
          ) : null}
          {current.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {current.map((p, i) => (
                <ScrollReveal key={p.id} delay={(i % 3) * 0.08} className="h-full">
                  <ProjectCard project={p} index={i} priority={i < 3} />
                </ScrollReveal>
              ))}
            </div>
          ) : null}
          {archived.length > 0 ? (
            <ScrollReveal className="mt-24">
              <span className="eyebrow">Archive</span>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Earlier work</h2>
              <ul className="mt-8 divide-y divide-black/[0.06] overflow-hidden rounded-[1.9rem] border border-black/[0.06] bg-white dark:divide-white/10 dark:border-white/10 dark:bg-slate-900">
                {archived.map((p) => (
                  <li key={p.id}>
                    <Link href={`/work/${p.slug}`} className="group flex flex-col gap-1 px-7 py-5 sm:flex-row sm:items-baseline sm:justify-between">
                      <span className="font-display text-lg font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-50">{p.name}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{p.one_liner ? `${p.one_liner} · ` : ""}{p.year}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ) : null}
        </div>
      </section>
    </div>
  );
}
