import type { Metadata } from "next";
import { Wrench } from "lucide-react";
import { ClosingCta } from "@/components/public/HomeSections";
import ScrollReveal from "@/components/public/ScrollReveal";
import { TechLogo } from "@/components/shared/TechLogo";
import { getAllTechnologies, getPublishedProjects, getSiteSettings } from "@/lib/db/public";
import { GROUP_LABEL, PROFICIENCY_LABEL } from "@/lib/utils/format";
import type { Proficiency, TechGroup, TechnologyRow } from "@/types/database";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Skills",
  description: "The languages, frameworks, databases and hardware Levi Gatimu actually uses, rated honestly.",
  alternates: { canonical: "/skills" },
  openGraph: { type: "website", url: "/skills", title: "Skills · Levi Gatimu" },
};

const GROUP_ORDER: TechGroup[] = ["language", "frontend", "backend", "database", "ai", "robotics", "embedded", "desktop", "devops", "design", "hardware"];
const LEVEL_STYLE: Record<Proficiency, string> = {
  strong: "bg-blue-600 text-white",
  comfortable: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200",
  learning: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
  experimental: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300",
};

export default async function SkillsPage() {
  const [settings, techs, projects] = await Promise.all([getSiteSettings(), getAllTechnologies(), getPublishedProjects()]);
  const usage = new Map<string, number>();
  for (const p of projects) for (const pt of p.project_technologies) if (pt.technologies) usage.set(pt.technologies.id, (usage.get(pt.technologies.id) ?? 0) + 1);
  const visible = techs.filter((t) => t.show_on_about);
  const grouped = new Map<TechGroup, TechnologyRow[]>();
  for (const t of visible) grouped.set(t.group, [...(grouped.get(t.group) ?? []), t]);
  const strong = visible.filter((t) => t.proficiency === "strong");

  return (
    <div className="relative">
      <div className="grain" />
      <section className="px-6 pb-16 pt-40">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-blue-400">
              <Wrench size={13} /> Skills
            </span>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-[0.9] tracking-tight text-slate-900 md:text-8xl dark:text-slate-50">
              The toolbox, <br /> <span className="text-blue-600 dark:text-blue-400">honestly rated.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-relaxed text-slate-500 md:text-2xl dark:text-slate-400">
              Strong means shipped more than once. Comfortable means used in a real project. Learning means coursework or partial use. Experimental means touched, not shipped.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {strong.length > 0 ? (
        <section className="px-6 pb-16">
          <ScrollReveal className="mx-auto max-w-7xl">
            <div className="rounded-[2rem] border border-black/[0.06] bg-white p-8 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-slate-900 md:p-10">
              <span className="eyebrow">Core stack</span>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {strong.map((t) => (
                  <span key={t.id} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-[0_10px_24px_-14px_rgba(15,23,42,0.5)] ring-1 ring-black/[0.06] dark:bg-slate-800 dark:text-slate-100 dark:ring-white/10"><TechLogo name={t.name} icon={t.icon} size={18} />{t.name}</span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>
      ) : null}

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GROUP_ORDER.filter((g) => grouped.has(g)).map((g, i) => (
            <ScrollReveal key={g} delay={(i % 3) * 0.06}>
              <div className="h-full rounded-[1.9rem] border border-black/[0.06] bg-white p-7 dark:border-white/10 dark:bg-slate-900">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">{GROUP_LABEL[g]}</h2>
                <ul className="mt-5 divide-y divide-black/[0.06] dark:divide-white/10">
                  {(grouped.get(g) ?? []).map((t) => {
                    const n = usage.get(t.id) ?? 0;
                    return (
                      <li key={t.id} className="flex items-center justify-between gap-4 py-2.5">
                        <span className="inline-flex items-center gap-2.5">
                          <TechLogo name={t.name} icon={t.icon} size={20} />
                          <span className="font-medium text-slate-800 dark:text-slate-100">{t.name}</span>
                          {n > 0 ? <span className="ml-2 text-xs text-slate-400">{n} project{n === 1 ? "" : "s"}</span> : null}
                        </span>
                        {t.proficiency ? <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${LEVEL_STYLE[t.proficiency]}`}>{PROFICIENCY_LABEL[t.proficiency]}</span> : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
      <ClosingCta settings={settings} />
    </div>
  );
}
