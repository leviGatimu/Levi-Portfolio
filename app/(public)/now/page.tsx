import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Radio } from "lucide-react";
import { ProjectCard } from "@/components/public/ProjectCard";
import ScrollReveal from "@/components/public/ScrollReveal";
import { LocalTime } from "@/components/shared/LocalTime";
import { Prose } from "@/components/shared/Prose";
import { getPublishedProjects, getSiteSettings } from "@/lib/db/public";
import { formatDate, formatLocalTime } from "@/lib/utils/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Now",
  description: "What Levi Gatimu is working on right now.",
  alternates: { canonical: "/now" },
  openGraph: { type: "website", url: "/now", title: "Now · Levi Gatimu" },
};

export default async function NowPage() {
  const [settings, projects] = await Promise.all([getSiteSettings(), getPublishedProjects()]);
  const active = projects.filter((p) => p.status === "active").slice(0, 3);
  return (
    <div className="relative">
      <div className="grain" />
      <section className="px-6 pb-16 pt-40">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-blue-400">
              <Radio size={13} /> Now
            </span>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-[0.9] tracking-tight text-slate-900 md:text-8xl dark:text-slate-50">
              What I&apos;m on <br /> <span className="text-blue-600 dark:text-blue-400">right now.</span>
            </h1>
            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              {settings.now_updated_at ? `Updated ${formatDate(settings.now_updated_at)}` : "A living page"} · {settings.location} · <LocalTime timezone={settings.timezone} initial={formatLocalTime(settings.timezone)} /> local
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-12">
          <ScrollReveal className="lg:col-span-7">
            <div className="rounded-[2rem] border border-black/[0.06] bg-white p-8 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-slate-900 md:p-10">
              <span className="eyebrow">Focus</span>
              <Prose markdown={settings.now_md || "Year 2 at NGA Coding Academy, shipping projects and writing up how they were built."} className="mt-5 !max-w-none text-lg" />
            </div>
          </ScrollReveal>
          <ScrollReveal className="lg:col-span-5" delay={0.1}>
            <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 to-[#0a1020] p-8 text-white md:p-10">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-300">Also</span>
              <ul className="mt-5 space-y-4 text-slate-200">
                {settings.highlights.map((h) => (
                  <li key={h.title}>
                    <p className="font-display text-lg font-semibold">{h.title}</p>
                    <p className="text-sm text-slate-400">{h.description}</p>
                  </li>
                ))}
              </ul>
              <Link href="/journey" className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-white">
                The whole journey <ArrowUpRight size={14} className="transition-transform group-hover:rotate-45" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {active.length > 0 ? (
        <section className="px-6 pb-28">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="mb-8">
              <span className="eyebrow">Active projects</span>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl dark:text-slate-50">Currently being built</h2>
            </ScrollReveal>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {active.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 0.08} className="h-full">
                  <ProjectCard project={p} index={i} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <div className="pb-20" />
      )}
    </div>
  );
}
