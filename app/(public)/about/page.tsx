import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Bot, Compass, Plane, Rocket, Sparkles, Users, Wrench } from "lucide-react";
import { FeatureCard } from "@/components/public/FeatureCard";
import { ClosingCta } from "@/components/public/HomeSections";
import ScrollReveal from "@/components/public/ScrollReveal";
import { Prose } from "@/components/shared/Prose";
import { getPublishedProjects, getSiteSettings, getTechnologiesForAbout } from "@/lib/db/public";
import { mediaUrl } from "@/lib/supabase/env";
import { GROUP_LABEL, PROFICIENCY_LABEL, formatDate } from "@/lib/utils/format";
import type { TechGroup, TechnologyRow } from "@/types/database";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description: "Levi Gatimu: Year 2 student at NGA Coding Academy in Kigali, building software, AI systems and robotics, heading for a career in aviation.",
  alternates: { canonical: "/about" },
  openGraph: { type: "profile", url: "/about", title: "About · Levi Gatimu" },
};

const GROUP_ORDER: TechGroup[] = ["language", "frontend", "backend", "database", "ai", "robotics", "embedded", "desktop", "devops", "design", "hardware"];

const PRINCIPLES = [
  { icon: <Compass size={20} />, chip: "bg-blue-600", blob: "bg-blue-200 dark:bg-blue-500/20", title: "Start from a real problem", desc: "Usually one I have myself or see around me at school. Write down what done looks like before touching code." },
  { icon: <Wrench size={20} />, chip: "bg-emerald-500", blob: "bg-emerald-200 dark:bg-emerald-500/20", title: "Prototype fast, learn on the way", desc: "The smallest thing that proves the idea works. A new language, a framework or a sensor if the project needs it." },
  { icon: <Rocket size={20} />, chip: "bg-slate-900", blob: "bg-slate-200 dark:bg-slate-500/20", title: "Finish it", desc: "Deploy it, ship the installer, write the docs. A project is done when someone else can use it." },
  { icon: <Sparkles size={20} />, chip: "bg-amber-500", blob: "bg-amber-200 dark:bg-amber-500/20", title: "Be honest about it", desc: "Real screenshots, real status, real scope. What works, what is paused, and what I would do differently." },
];

const HIGHLIGHT_ICONS = [<Users key="u" size={18} />, <Bot key="b" size={18} />, <Plane key="p" size={18} />];

export default async function AboutPage() {
  const [settings, techs, projects] = await Promise.all([getSiteSettings(), getTechnologiesForAbout(), getPublishedProjects()]);
  const portrait = settings.portrait_about_path ? mediaUrl(settings.portrait_about_path) : settings.portrait_home_path ? mediaUrl(settings.portrait_home_path) : "/portrait.png";
  const [firstName] = settings.display_name.split(" ");
  const grouped = new Map<TechGroup, TechnologyRow[]>();
  for (const t of techs) grouped.set(t.group, [...(grouped.get(t.group) ?? []), t]);
  const stats = [
    { v: "Y2", l: "NGA Coding Academy" },
    { v: String(projects.length).padStart(2, "0"), l: "Published projects" },
    { v: String(techs.length).padStart(2, "0"), l: "Technologies rated" },
    { v: "KGL", l: "Kigali, Rwanda" },
  ];

  return (
    <div className="relative">
      <div className="grain" />

      {/* Hero */}
      <section className="px-6 pb-16 pt-40">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-blue-400">
              <Sparkles size={13} /> About {firstName}
            </span>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-[0.9] tracking-tight text-slate-900 md:text-8xl dark:text-slate-50">
              Student developer, <br />
              future <span className="text-blue-600 dark:text-blue-400">pilot.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-relaxed text-slate-500 md:text-2xl dark:text-slate-400">{settings.opening_statement} {settings.intro_line}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Story + portrait card */}
      <section className="px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-16 lg:grid-cols-2 lg:gap-24">
          <ScrollReveal direction="right">
            <span className="eyebrow">The story</span>
            <Prose markdown={settings.bio_long_md || settings.bio_short_md} className="mt-6 !max-w-none text-lg" />
            <a
              href={`mailto:${settings.email}`}
              className="group mt-9 inline-flex items-center gap-3 rounded-2xl bg-slate-900 py-4 pl-8 pr-5 font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Get in touch
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 transition-transform group-hover:rotate-45">
                <ArrowUpRight size={16} />
              </span>
            </a>
          </ScrollReveal>

          <ScrollReveal direction="left" className="relative lg:sticky lg:top-28">
            <div className="absolute -inset-5 -z-10 bg-blue-300/30 dark:bg-blue-600/20" style={{ borderRadius: "63% 37% 47% 53% / 38% 63% 37% 62%" }} />
            <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white shadow-[0_40px_80px_-40px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-slate-900">
              <Image src={portrait} alt={settings.portrait_alt} width={920} height={920} priority className="aspect-square w-full object-cover" />
              <div className="p-8">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((s) => (
                    <div key={s.l}>
                      <p className="font-display text-3xl font-semibold text-slate-900 dark:text-slate-50">{s.v}</p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">{s.l}</p>
                    </div>
                  ))}
                </div>
                {settings.now_md ? (
                  <div className="mt-7 border-t border-black/[0.06] pt-6 dark:border-white/10">
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" /> Now{settings.now_updated_at ? ` · ${formatDate(settings.now_updated_at)}` : ""}
                    </p>
                    <Prose markdown={settings.now_md} className="mt-3 text-base" />
                  </div>
                ) : null}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Principles */}
      <section className="px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-14 max-w-2xl">
            <span className="eyebrow">How I work</span>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-tight text-slate-900 md:text-6xl dark:text-slate-50">
              Concept, prototype, <span className="text-blue-600 dark:text-blue-400">product.</span>
            </h2>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {PRINCIPLES.map((v, i) => (
              <ScrollReveal key={v.title} delay={(i % 2) * 0.08}>
                <FeatureCard icon={v.icon} chip={v.chip} blob={v.blob} title={v.title} desc={v.desc} blobIndex={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Beyond software */}
      {settings.highlights.length > 0 ? (
        <section className="px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="mb-14 max-w-2xl">
              <span className="eyebrow">Beyond software</span>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-tight text-slate-900 md:text-6xl dark:text-slate-50">
                The parts that don&apos;t fit <span className="text-blue-600 dark:text-blue-400">in a repository.</span>
              </h2>
            </ScrollReveal>
            <div className="grid gap-6 md:grid-cols-3">
              {settings.highlights.map((h, i) => (
                <ScrollReveal key={h.title} delay={i * 0.08}>
                  <div className="h-full rounded-[1.9rem] border border-black/[0.06] bg-white p-8 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-slate-900">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">{HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length]}</div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{h.title}</h3>
                    <p className="mt-2 leading-relaxed text-slate-500 dark:text-slate-400">{h.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Skills */}
      {grouped.size > 0 ? (
        <section className="px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="mb-14 max-w-2xl">
              <span className="eyebrow">Skills, honestly rated</span>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-tight text-slate-900 md:text-6xl dark:text-slate-50">
                What I <span className="text-blue-600 dark:text-blue-400">actually</span> use.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-500 dark:text-slate-400">
                Strong: shipped it more than once. Comfortable: used it in a real project. Learning: coursework or partial use. Experimental: touched, not shipped.
              </p>
            </ScrollReveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {GROUP_ORDER.filter((g) => grouped.has(g)).map((g, i) => (
                <ScrollReveal key={g} delay={(i % 3) * 0.06}>
                  <div className="h-full rounded-[1.9rem] border border-black/[0.06] bg-white p-7 dark:border-white/10 dark:bg-slate-900">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">{GROUP_LABEL[g]}</h3>
                    <ul className="mt-5 divide-y divide-black/[0.06] dark:divide-white/10">
                      {(grouped.get(g) ?? []).map((t) => (
                        <li key={t.id} className="flex items-baseline justify-between gap-4 py-2.5">
                          <span className="font-medium text-slate-800 dark:text-slate-100">{t.name}</span>
                          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">{t.proficiency ? PROFICIENCY_LABEL[t.proficiency] : ""}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ClosingCta settings={settings} />
    </div>
  );
}
