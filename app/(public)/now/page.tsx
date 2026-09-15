import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock, GraduationCap, MapPin, Plane, Radio, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/public/ScrollReveal";
import { LocalTime } from "@/components/shared/LocalTime";
import { Prose } from "@/components/shared/Prose";
import { TechLogo } from "@/components/shared/TechLogo";
import { coverOf, getAllTechnologies, getPublishedProjects, getSiteSettings } from "@/lib/db/public";
import { mediaUrl } from "@/lib/supabase/env";
import { STATUS_LABEL, formatDate, formatLocalTime } from "@/lib/utils/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Now",
  description: "What Levi Gatimu is building, learning and aiming for right now.",
  alternates: { canonical: "/now" },
  openGraph: { type: "website", url: "/now", title: "Now · Levi Gatimu" },
};

export default async function NowPage() {
  const [settings, projects, techs] = await Promise.all([getSiteSettings(), getPublishedProjects(), getAllTechnologies()]);
  const building = projects.filter((p) => p.status === "active").slice(0, 4);
  const learning = techs.filter((t) => t.show_on_about && (t.proficiency === "learning" || t.proficiency === "experimental")).slice(0, 10);
  const strong = techs.filter((t) => t.proficiency === "strong").slice(0, 8);
  const next = settings.journey.at(-1);
  const portrait = settings.portrait_home_path ? mediaUrl(settings.portrait_home_path) : "/portrait.png";
  const [firstName] = settings.display_name.split(" ");
  const updated = settings.now_updated_at ? formatDate(settings.now_updated_at) : formatDate(settings.updated_at);

  return (
    <div className="relative">
      <div className="grain" />

      {/* Header */}
      <section className="px-6 pb-12 pt-40">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-blue-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Now · updated {updated}
            </span>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-[0.9] tracking-tight text-slate-900 md:text-8xl dark:text-slate-50">
              Right now, <br /> I&apos;m <span className="text-blue-600 dark:text-blue-400">building.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-relaxed text-slate-500 md:text-2xl dark:text-slate-400">
              A living page: what has my attention this month, what I am learning, and where I am. It changes; the projects page is the record.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Board */}
      <section className="px-6 pb-28">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-12">
          {/* Focus */}
          <ScrollReveal className="lg:col-span-8">
            <div className="relative h-full overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white p-8 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-slate-900 md:p-10">
              <div className="pointer-events-none absolute -right-10 -top-12 h-52 w-52 bg-blue-200 opacity-60 dark:bg-blue-500/20" style={{ borderRadius: "42% 58% 63% 37% / 41% 44% 56% 59%" }} />
              <div className="relative flex h-full flex-col">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400"><Radio size={14} /> Focus</span>
                <Prose markdown={settings.now_md || "Year 2 at NGA Coding Academy, shipping projects and writing up how they were built."} className="mt-5 !max-w-none [&_p]:font-display [&_p]:text-2xl [&_p]:font-medium [&_p]:leading-snug [&_p]:text-slate-900 md:[&_p]:text-3xl dark:[&_p]:text-slate-50" />
                <dl className="mt-auto grid grid-cols-3 gap-4 border-t border-black/[0.06] pt-6 dark:border-white/10">
                  {[
                    { v: String(building.length).padStart(2, "0"), l: building.length === 1 ? "Active project" : "Active projects" },
                    { v: String(learning.length).padStart(2, "0"), l: "Skills in progress" },
                    { v: String(projects.length).padStart(2, "0"), l: "Published in total" },
                  ].map((f) => (
                    <div key={f.l}>
                      <dd className="font-display text-3xl font-semibold text-slate-900 dark:text-slate-50">{f.v}</dd>
                      <dt className="mt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">{f.l}</dt>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </ScrollReveal>

          {/* Where */}
          <ScrollReveal className="lg:col-span-4" delay={0.06}>
            <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white shadow-[0_28px_60px_-34px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-slate-900">
              <div className="relative aspect-[4/3]">
                <Image src={portrait} alt={settings.portrait_alt} fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover object-top" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-50"><MapPin size={16} className="text-blue-600" /> {settings.location}</p>
                <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Clock size={16} className="text-blue-600" /> <LocalTime timezone={settings.timezone} initial={formatLocalTime(settings.timezone)} /> local time</p>
                <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><GraduationCap size={16} className="text-blue-600" /> Year 2, NGA Coding Academy</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Building */}
          <ScrollReveal className="lg:col-span-7" delay={0.1}>
            <div className="h-full rounded-[2rem] border border-black/[0.06] bg-white p-8 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400"><Sparkles size={14} /> Building</span>
                  <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Active projects</h2>
                </div>
                <Link href="/work" className="text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400">All projects →</Link>
              </div>
              {building.length === 0 ? (
                <p className="mt-6 text-slate-500 dark:text-slate-400">Nothing marked active right now. See the projects page for finished work.</p>
              ) : (
                <ul className="mt-6 divide-y divide-black/[0.06] dark:divide-white/10">
                  {building.map((p) => {
                    const cover = coverOf(p);
                    return (
                      <li key={p.id}>
                        <Link href={`/work/${p.slug}`} className="group flex items-center gap-4 py-4">
                          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                            {cover ? <Image src={mediaUrl(cover.storage_path)} alt={cover.alt} fill sizes="80px" className="object-cover object-top" /> : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-display text-lg font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-50">{p.name}</p>
                            <p className="truncate text-sm text-slate-500 dark:text-slate-400">{p.one_liner}</p>
                          </div>
                          <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700 sm:inline-flex dark:bg-emerald-500/15 dark:text-emerald-300">{STATUS_LABEL[p.status]}</span>
                          <ArrowUpRight size={18} className="text-slate-400 transition-transform group-hover:rotate-45 group-hover:text-blue-600" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </ScrollReveal>

          {/* Learning */}
          <ScrollReveal className="lg:col-span-5" delay={0.14}>
            <div className="h-full rounded-[2rem] border border-black/[0.06] bg-white p-8 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-slate-900">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400"><BookOpen size={14} /> Learning</span>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">On the bench</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Things rated learning or experimental on the skills page.</p>
              {learning.length === 0 ? (
                <p className="mt-6 text-slate-500 dark:text-slate-400">Nothing flagged as learning right now.</p>
              ) : (
                <ul className="mt-6 flex flex-wrap gap-2.5">
                  {learning.map((t) => (
                    <li key={t.id} className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-2 text-sm font-medium text-slate-800 dark:border-white/15 dark:bg-slate-800 dark:text-slate-100">
                      <TechLogo name={t.name} icon={t.icon} size={16} /> {t.name}
                    </li>
                  ))}
                </ul>
              )}
              {strong.length > 0 ? (
                <div className="mt-7 border-t border-black/[0.06] pt-6 dark:border-white/10">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Daily drivers</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {strong.map((t) => (
                      <span key={t.id} className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.06] bg-white dark:border-white/10 dark:bg-slate-800" title={t.name}>
                        <TechLogo name={t.name} icon={t.icon} size={18} />
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </ScrollReveal>

          {/* Next up */}
          <ScrollReveal className="lg:col-span-12" delay={0.18}>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-[#0a1020] p-8 text-white md:p-10">
              <div className="pointer-events-none absolute -top-28 right-10 h-[380px] w-[380px] rounded-full bg-blue-600/25 blur-[120px]" />
              <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-blue-300"><Plane size={14} /> Where it is heading</span>
                  <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl">{next?.title ?? "Commercial aviation"}</h2>
                  <p className="mt-4 max-w-2xl text-lg text-slate-300">{next?.description ?? "The long-term destination. Software stays a serious second path alongside it."}</p>
                </div>
                <div className="flex flex-wrap gap-3 md:flex-col">
                  <Link href="/journey" className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-slate-900 transition-colors hover:bg-blue-50">The whole journey <ArrowUpRight size={16} /></Link>
                  <Link href="/contact" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-white/10">Say hello to {firstName}</Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
