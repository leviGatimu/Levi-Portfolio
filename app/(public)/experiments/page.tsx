import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { ProjectCard } from "@/components/public/ProjectCard";
import ScrollReveal from "@/components/public/ScrollReveal";
import { getPublishedProjects } from "@/lib/db/public";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Experiments",
  description: "Prototypes, robotics builds and simulations by Levi Gatimu: the unfinished, the paused and the strange.",
  alternates: { canonical: "/experiments" },
  openGraph: { type: "website", url: "/experiments", title: "Experiments · Levi Gatimu" },
};

export default async function ExperimentsPage() {
  const projects = await getPublishedProjects("experiment");
  return (
    <div className="relative">
      <div className="grain" />
      <section className="px-6 pb-16 pt-40">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-blue-400">
              <FlaskConical size={13} /> Experiments
            </span>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-[0.9] tracking-tight text-slate-900 md:text-8xl dark:text-slate-50">
              Prototypes, rovers <br /> and <span className="text-blue-600 dark:text-blue-400">simulations.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-relaxed text-slate-500 md:text-2xl dark:text-slate-400">
              The things that are not products yet: hardware builds, a digital twin of Kigali traffic, and ideas I am still testing. Honest status on every one.
            </p>
          </ScrollReveal>
        </div>
      </section>
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-7xl">
          {projects.length === 0 ? (
            <div className="rounded-[2rem] border border-black/[0.06] bg-white p-10 text-center shadow-[0_28px_60px_-34px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-slate-900">
              <p className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-50">The lab is being written up.</p>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Experiments appear here as soon as they are published.</p>
              <Link href="/work" className="btn-light mt-6">See finished work</Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <ScrollReveal key={p.id} delay={(i % 3) * 0.08} className="h-full">
                  <ProjectCard project={p} index={i} priority={i < 3} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
