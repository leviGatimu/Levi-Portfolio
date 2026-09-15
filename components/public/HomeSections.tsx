import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bot, Check, Code2, Cpu, Database, Mail, MapPin, Plane, Sparkles, Users } from "lucide-react";
import { GithubIcon } from "./BrandIcons";
import type { ProjectWithRelations, SiteSettingsRow } from "@/types/database";
import { Prose } from "@/components/shared/Prose";
import { LocalTime } from "@/components/shared/LocalTime";
import { coverOf } from "@/lib/db/public";
import { mediaUrl } from "@/lib/supabase/env";
import { formatLocalTime } from "@/lib/utils/format";
import LaptopMockup from "./LaptopMockup";
import { ProjectCard } from "./ProjectCard";
import ScrollReveal from "./ScrollReveal";
import { FeatureCard } from "./FeatureCard";

const BLOBS = [
  "42% 58% 63% 37% / 41% 44% 56% 59%",
  "63% 37% 47% 53% / 38% 63% 37% 62%",
  "39% 61% 38% 62% / 58% 39% 61% 42%",
];

/* ---------------- Meet Levi ---------------- */

type MeetProps = { settings: SiteSettingsRow; portraitSrc: string; publishedCount: number; technologyCount: number };

export function Meet({ settings, portraitSrc, publishedCount, technologyCount }: MeetProps) {
  const [firstName] = settings.display_name.split(" ");
  const stats = [
    { v: "Y2", l: "NGA Coding Academy" },
    { v: String(publishedCount).padStart(2, "0"), l: publishedCount === 1 ? "Project published" : "Projects published" },
    { v: String(technologyCount).padStart(2, "0"), l: "Technologies" },
  ];
  return (
    <section id="meet" className="px-6 pt-20 lg:pt-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <ScrollReveal direction="right" className="relative">
          <div className="absolute -inset-6 -z-10 bg-blue-300/30 dark:bg-blue-600/20" style={{ borderRadius: BLOBS[1] }} />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-black/[0.06] bg-white shadow-[0_40px_80px_-40px_rgba(15,23,42,0.4)] dark:border-white/10">
            <Image src={portraitSrc} alt={settings.portrait_alt} width={920} height={920} priority className="aspect-square w-full object-cover" />
          </div>
          <div className="absolute -bottom-5 left-6 inline-flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xl dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">
            <MapPin size={14} className="text-blue-600" /> {settings.location}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="left">
          <span className="eyebrow">Meet {firstName}</span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-tight text-slate-900 md:text-6xl dark:text-slate-50">
            Hello, I&apos;m <span className="text-blue-600 dark:text-blue-400">{firstName}.</span>
          </h2>
          <Prose markdown={settings.bio_short_md} className="mt-7 !max-w-xl text-lg" />
          <div className="mt-9 grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.l} className="rounded-2xl border border-black/[0.06] bg-white p-4 dark:border-white/10 dark:bg-slate-900">
                <p className="font-display text-3xl font-semibold text-slate-900 dark:text-slate-50">{s.v}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">{s.l}</p>
              </div>
            ))}
          </div>
          <Link href="/about" className="group mt-9 inline-flex items-center gap-3 rounded-2xl bg-slate-900 py-4 pl-8 pr-5 font-semibold text-white transition-colors hover:bg-slate-800">
            The full story
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 transition-transform group-hover:rotate-45">
              <ArrowUpRight size={16} />
            </span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ---------------- What I do ---------------- */

const AREAS = [
  { icon: <Code2 />, chip: "bg-blue-600", blob: "bg-blue-200 dark:bg-blue-500/20", title: "Full-stack web", desc: "Next.js, TypeScript, PostgreSQL and Supabase. Auth, uploads, dashboards and the boring parts that make an app real." },
  { icon: <Sparkles />, chip: "bg-violet-500", blob: "bg-violet-200 dark:bg-violet-500/20", title: "AI systems", desc: "LLM-powered tutors, feedback engines and agent-based simulations. Built to do a job, not to demo." },
  { icon: <Cpu />, chip: "bg-slate-900", blob: "bg-slate-200 dark:bg-slate-500/20", title: "Desktop apps", desc: "Windows software with C#, .NET and Electron: background services, installers, local databases, privacy by design." },
  { icon: <Bot />, chip: "bg-emerald-500", blob: "bg-emerald-200 dark:bg-emerald-500/20", title: "Robotics & embedded", desc: "Microcontrollers, sensors, Raspberry Pi and computer vision. Physical systems that move." },
  { icon: <Database />, chip: "bg-amber-500", blob: "bg-amber-200 dark:bg-amber-500/20", title: "Databases & APIs", desc: "Schemas with real constraints, row-level security, REST and realtime endpoints, migrations that survive." },
  { icon: <Plane />, chip: "bg-sky-500", blob: "bg-sky-200 dark:bg-sky-500/20", title: "Aviation", desc: "Aircraft systems, flight operations and navigation. The long-term career, and the discipline behind everything else." },
];

export function WhatIDo() {
  return (
    <section id="what-i-do" className="scroll-mt-24 px-6 py-28 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="max-w-3xl">
          <span className="eyebrow">What I do</span>
          <h2 className="mt-5 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-slate-900 md:text-7xl dark:text-slate-50">
            Built across the <br />
            whole <span className="text-blue-600 dark:text-blue-400">stack, and beyond.</span>
          </h2>
          <p className="mt-6 text-xl leading-relaxed text-slate-500 dark:text-slate-400">
            From a database schema to a rover chassis. I take ideas from concept to prototype to a product other people can use, learning whatever the project needs on the way.
          </p>
        </ScrollReveal>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a, i) => (
            <ScrollReveal key={a.title} delay={(i % 3) * 0.08}>
              <FeatureCard icon={a.icon} chip={a.chip} blob={a.blob} title={a.title} desc={a.desc} blobIndex={i} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Selected work ---------------- */

export function SelectedWork({ projects }: { projects: ProjectWithRelations[] }) {
  const lead = projects[0];
  const cover = lead ? coverOf(lead) : null;
  const points = projects.slice(0, 3);
  return (
    <section id="work" className="scroll-mt-24 px-6 py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <ScrollReveal direction="right">
          <span className="eyebrow">Selected work</span>
          <h2 className="mb-8 mt-5 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-slate-900 md:text-6xl dark:text-slate-50">
            Real projects, <span className="text-blue-600 dark:text-blue-400">really shipped.</span>
          </h2>
          {points.length === 0 ? (
            <p className="text-lg text-slate-500 dark:text-slate-400">The first case studies are being written. Check back soon.</p>
          ) : (
            <div className="space-y-7">
              {points.map((p) => (
                <Link key={p.id} href={`/work/${p.slug}`} className="group flex gap-4">
                  <span className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.7)]">
                    <Check size={16} strokeWidth={3} />
                  </span>
                  <div>
                    <h3 className="mb-1 font-display text-xl font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-50 dark:group-hover:text-blue-400">{p.name}</h3>
                    <p className="leading-relaxed text-slate-500 dark:text-slate-400">{p.one_liner}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link href="/work" className="group mt-10 inline-flex items-center gap-3 rounded-2xl bg-slate-900 py-4 pl-8 pr-5 font-semibold text-white transition-colors hover:bg-slate-800">
            All projects
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 transition-transform group-hover:rotate-45">
              <ArrowUpRight size={16} />
            </span>
          </Link>
        </ScrollReveal>

        <ScrollReveal direction="left" className="relative">
          <div className="absolute -inset-6 -z-10 bg-blue-300/30 dark:bg-blue-600/20" style={{ borderRadius: BLOBS[2] }} />
          <LaptopMockup src={cover ? mediaUrl(cover.storage_path) : null} alt={cover?.alt ?? "Project screenshot"} label={lead?.name} />
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ---------------- Project grid ---------------- */

export function ProjectGrid({ projects }: { projects: ProjectWithRelations[] }) {
  if (projects.length === 0) return null;
  return (
    <section className="px-6 py-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Latest</span>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl dark:text-slate-50">Click one to see how it was built.</h2>
          </div>
          <Link href="/work" className="btn-light self-start sm:self-auto">Browse all</Link>
        </ScrollReveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ScrollReveal key={p.id} delay={(i % 3) * 0.08} className="h-full">
              <ProjectCard project={p} index={i} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Beyond software (dark panel) ---------------- */

const HIGHLIGHT_ICONS = [<Users key="u" size={15} />, <Bot key="b" size={15} />, <Plane key="p" size={15} />];

export function Beyond({ settings }: { settings: SiteSettingsRow }) {
  const items = settings.highlights ?? [];
  return (
    <section id="beyond" className="scroll-mt-24 px-6 py-20 lg:py-28">
      <ScrollReveal className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900 to-[#0a1020] px-8 py-16 text-white md:p-16 lg:p-20">
          <div className="pointer-events-none absolute -top-28 right-10 h-[440px] w-[440px] rounded-full bg-blue-600/25 blur-[130px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-[440px] w-[440px] rounded-full bg-indigo-500/15 blur-[130px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:22px_22px]" />

          <div className="relative z-10 grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-blue-300">
                <Plane size={14} /> Beyond software
              </span>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-[0.98] tracking-tight md:text-6xl">
                Heading for the sky, <br /> building on the ground.
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-300">
                Commercial aviation is the long-term destination. Software is the serious second path, and the discipline of one feeds the other: checklists, systems thinking, and finishing what you start.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {items.map((h, i) => (
                  <span key={h.title} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-semibold text-slate-200">
                    <span className="text-blue-300">{HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length]}</span>
                    {h.title}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm lg:ml-auto">
              <div className="rounded-[1.9rem] border border-white/15 bg-white/[0.05] p-7 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                <div className="mb-7 flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                </div>
                <div className="space-y-4">
                  {items.map((h, i) => (
                    <div key={h.title} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">{HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length]}</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-100">{h.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{h.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><MapPin size={12} className="text-blue-300" /> {settings.location}</span>
                  <span className="font-semibold text-slate-200"><LocalTime timezone={settings.timezone} initial={formatLocalTime(settings.timezone)} /> local</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ---------------- Closing CTA ---------------- */

export function ClosingCta({ settings }: { settings: SiteSettingsRow }) {
  return (
    <section id="contact" className="scroll-mt-24 px-6 pb-32 pt-10 text-center">
      <ScrollReveal className="mx-auto max-w-3xl">
        <h2 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight text-slate-900 md:text-7xl dark:text-slate-50">
          Let&apos;s build <span className="text-blue-600 dark:text-blue-400">something.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-xl leading-relaxed text-slate-500 dark:text-slate-400">
          Projects, collaborations, internships, or a question about how something was built. I reply.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <a href={`mailto:${settings.email}`} className="btn-dark px-12 py-5 text-lg">
            <span className="relative z-10 inline-flex items-center gap-2"><Mail size={20} /> {settings.email}</span>
          </a>
          {settings.github_url ? (
            <a href={settings.github_url} target="_blank" rel="noopener noreferrer" className="btn-light px-10 py-5 text-lg">
              <GithubIcon size={20} /> GitHub
            </a>
          ) : null}
        </div>
      </ScrollReveal>
    </section>
  );
}
