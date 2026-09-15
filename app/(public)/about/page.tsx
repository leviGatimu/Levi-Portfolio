import type { Metadata } from "next";
import Image from "next/image";
import { Contact } from "@/components/public/HomeSections";
import { Prose } from "@/components/shared/Prose";
import { Reveal } from "@/components/shared/Reveal";
import { getSiteSettings, getTechnologiesForAbout } from "@/lib/db/public";
import { mediaUrl } from "@/lib/supabase/env";
import { GROUP_LABEL, PROFICIENCY_LABEL, formatDate } from "@/lib/utils/format";
import type { TechGroup, TechnologyRow } from "@/types/database";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description: "Who Levi Gatimu is: Year 2 student at NGA Coding Academy in Kigali, building software, AI systems and robotics, heading for a career in aviation.",
  alternates: { canonical: "/about" },
  openGraph: { type: "profile", url: "/about", title: "About — Levi Gatimu" },
};

const GROUP_ORDER: TechGroup[] = ["language", "frontend", "backend", "database", "ai", "robotics", "embedded", "desktop", "devops", "design", "hardware"];

export default async function AboutPage() {
  const [settings, techs] = await Promise.all([getSiteSettings(), getTechnologiesForAbout()]);
  const portrait = settings.portrait_about_path ?? settings.portrait_home_path;
  const grouped = new Map<TechGroup, TechnologyRow[]>();
  for (const t of techs) grouped.set(t.group, [...(grouped.get(t.group) ?? []), t]);

  return (
    <>
      <div className="container-site py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <span className="meta text-fg-subtle">About</span>
            <h1 className="mt-4 font-mono text-display-lg font-medium text-fg">Hello! I&apos;m {settings.display_name}</h1>
            <p className="mt-5 font-mono text-lead italic text-fg">{settings.tagline}</p>
            <p className="meta mt-6 text-fg-subtle">{settings.meta_line}</p>
            {settings.meta_line_secondary ? <p className="meta mt-1 text-fg-subtle">{settings.meta_line_secondary}</p> : null}

            {settings.bio_long_md ? (
              <Prose markdown={settings.bio_long_md} className="mt-12" />
            ) : settings.bio_short_md ? (
              <Prose markdown={settings.bio_short_md} className="mt-12" />
            ) : (
              <p className="mt-12 font-mono text-small text-fg-subtle">The long version is being written.</p>
            )}
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            {portrait ? (
              <div className="relative aspect-[3/4] overflow-hidden rounded-[4px] shadow-[inset_0_0_0_1px_var(--color-rule)] lg:-mt-6">
                <Image src={mediaUrl(portrait)} alt={settings.portrait_alt} fill priority sizes="(min-width: 1024px) 420px, 100vw" className="object-cover object-top" />
              </div>
            ) : null}
            {settings.now_md ? (
              <div className="panel mt-6 p-6">
                <p className="meta flex items-center gap-2 text-fg-subtle">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  Now{settings.now_updated_at ? ` · ${formatDate(settings.now_updated_at)}` : ""}
                </p>
                <Prose markdown={settings.now_md} className="mt-3 text-small" />
              </div>
            ) : null}
          </div>
        </div>

        {settings.focus_areas.length > 0 ? (
          <Reveal className="mt-20 lg:mt-28">
            <span className="meta text-fg-subtle">What I work on</span>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {settings.focus_areas.map((f, i) => (
                <li key={f.title} className="panel p-6">
                  <span className="meta text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="mt-3 font-mono text-heading font-medium text-fg">{f.title}</h2>
                  <p className="mt-2 text-small text-fg-muted">{f.description}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {grouped.size > 0 ? (
          <Reveal className="mt-20 lg:mt-28">
            <div className="border-t border-rule pt-8">
              <span className="meta text-fg-subtle">Skills — honestly rated</span>
              <p className="mt-3 max-w-[60ch] text-small text-fg-muted">
                Strong: shipped it more than once. Comfortable: used it in a real project. Learning: coursework or partial use. Experimental: touched, not shipped.
              </p>
            </div>
            <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {GROUP_ORDER.filter((g) => grouped.has(g)).map((g) => (
                <div key={g}>
                  <h2 className="meta text-fg">{GROUP_LABEL[g]}</h2>
                  <dl className="mt-4 divide-y divide-rule border-y border-rule">
                    {(grouped.get(g) ?? []).map((t) => (
                      <div key={t.id} className="flex items-baseline justify-between gap-4 py-2.5">
                        <dt className="text-small text-fg">{t.name}</dt>
                        <dd className="meta text-fg-subtle">{t.proficiency ? PROFICIENCY_LABEL[t.proficiency] : ""}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>
      <Contact settings={settings} index="—" />
    </>
  );
}
