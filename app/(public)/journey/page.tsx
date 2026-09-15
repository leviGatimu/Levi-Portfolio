import type { Metadata } from "next";
import { GraduationCap, Plane } from "lucide-react";
import { ClosingCta } from "@/components/public/HomeSections";
import ScrollReveal from "@/components/public/ScrollReveal";
import { getSiteSettings } from "@/lib/db/public";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Journey",
  description: "How Levi Gatimu got from web fundamentals at NGA Coding Academy to full-stack, desktop, AI and robotics, and where it is heading.",
  alternates: { canonical: "/journey" },
  openGraph: { type: "website", url: "/journey", title: "Journey · Levi Gatimu" },
};

export default async function JourneyPage() {
  const settings = await getSiteSettings();
  const items = settings.journey;
  return (
    <div className="relative">
      <div className="grain" />
      <section className="px-6 pb-16 pt-40">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-blue-400">
              <GraduationCap size={13} /> Journey
            </span>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-[0.9] tracking-tight text-slate-900 md:text-8xl dark:text-slate-50">
              From first CRUD app <br /> to <span className="text-blue-600 dark:text-blue-400">the sky.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-relaxed text-slate-500 md:text-2xl dark:text-slate-400">
              Two years at NGA Coding Academy in Kigali, one project at a time. Here is the order it happened in.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <ol className="relative border-l-2 border-blue-200 pl-8 dark:border-blue-500/30">
            {items.map((item, i) => (
              <li key={`${item.period}-${item.title}`} className="relative mb-10 last:mb-0">
                <ScrollReveal delay={i * 0.06}>
                  <span className={`absolute -left-[45px] top-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-[#ececec] dark:border-[#0a0e17] ${i === items.length - 1 ? "bg-amber-400" : "bg-blue-600"}`} aria-hidden="true" />
                  <div className="rounded-[1.75rem] border border-black/[0.06] bg-white p-7 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-slate-900">
                    <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">{item.period}</span>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      {i === items.length - 1 ? <span className="inline-flex items-center gap-2"><Plane size={20} className="text-amber-500" /> {item.title}</span> : item.title}
                    </h2>
                    <p className="mt-2 leading-relaxed text-slate-500 dark:text-slate-400">{item.description}</p>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <ClosingCta settings={settings} />
    </div>
  );
}
