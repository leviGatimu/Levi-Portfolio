import Link from "next/link";
import type { ProjectWithRelations, SiteSettingsRow } from "@/types/database";
import { Prose } from "@/components/shared/Prose";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { LocalTime } from "@/components/shared/LocalTime";
import { formatDate, formatLocalTime } from "@/lib/utils/format";
import { ProjectPanel } from "./ProjectPanel";

/* ---------------- Latest works ---------------- */

export function LatestWorks({ featured, others }: { featured: ProjectWithRelations[]; others: ProjectWithRelations[] }) {
  const [lead, ...restFeatured] = featured;
  const grid = [...restFeatured, ...others];
  const empty = featured.length === 0 && others.length === 0;

  return (
    <section className="container-site py-20 lg:py-28" aria-labelledby="works-heading">
      <Reveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader index="01 — Selected work" title="Latest works" subtitle="Real projects, real screenshots. Click one to read how it was built." />
          <Link href="/work" className="meta link-underline self-start text-fg-muted hover:text-fg sm:self-auto">
            All work <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Reveal>

      {empty ? (
        <p className="mt-12 border-t border-rule pt-8 font-mono text-small text-fg-subtle">Projects are on their way.</p>
      ) : (
        <div className="mt-12 grid gap-6 lg:mt-16">
          {lead ? (
            <Reveal>
              <ProjectPanel project={lead} accentTitle size="large" priority />
            </Reveal>
          ) : null}
          {grid.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {grid.map((p, i) => (
                <Reveal key={p.id} delay={(i % 2) * 80}>
                  <ProjectPanel project={p} />
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

/* ---------------- Introduce ---------------- */

export function Introduce({ settings }: { settings: SiteSettingsRow }) {
  const [firstName] = settings.display_name.split(" ");
  return (
    <section className="container-site py-20 lg:py-28" aria-labelledby="intro-heading">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <ul className="flex flex-col gap-4">
            {settings.focus_areas.map((f, i) => (
              <li key={f.title} className="panel flex items-start justify-between gap-6 p-6 sm:p-7">
                <div>
                  <h3 className={`font-mono text-heading font-medium ${i === 0 ? "text-accent" : "text-fg"}`}>{f.title}</h3>
                  <p className="mt-2 text-small text-fg-muted">{f.description}</p>
                </div>
                <span className="meta shrink-0 pt-1 text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="lg:col-span-6 lg:col-start-7" delay={100}>
          <span className="meta text-fg-subtle">02 — Introduce</span>
          <h2 id="intro-heading" className="mt-4 font-mono text-display-md font-medium text-fg">
            Hello! I&apos;m {settings.display_name}
          </h2>
          {settings.tagline ? <p className="mt-5 font-mono text-lead italic text-fg">{settings.tagline}</p> : null}
          {settings.bio_short_md ? (
            <Prose markdown={settings.bio_short_md} className="mt-6 font-mono text-small" />
          ) : (
            <p className="mt-6 font-mono text-small text-fg-muted">{firstName} is writing this part.</p>
          )}
          {settings.now_md ? (
            <div className="mt-8 border-t border-rule pt-6">
              <p className="meta flex items-center gap-2 text-fg-subtle">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                Now{settings.now_updated_at ? ` · updated ${formatDate(settings.now_updated_at)}` : ""}
              </p>
              <Prose markdown={settings.now_md} className="mt-3 text-small" />
            </div>
          ) : null}
          <Link href="/about" className="link-accent meta mt-8 inline-block">
            More about me <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */

export function Contact({ settings, index = "03" }: { settings: SiteSettingsRow; index?: string }) {
  return (
    <section id="contact" className="container-site scroll-mt-20 py-20 lg:py-28" aria-labelledby="contact-heading">
      <Reveal>
        <div className="grid gap-10 border-t border-rule pt-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="meta text-fg-subtle">{index} — Contact</span>
            <h2 id="contact-heading" className="mt-4 font-mono text-display-lg font-medium text-fg">Say hello.</h2>
            <a href={`mailto:${settings.email}`} className="link-underline mt-8 inline-block break-all font-mono text-heading text-fg">
              {settings.email}
            </a>
          </div>
          <dl className="grid grid-cols-2 gap-6 self-end lg:col-span-5 lg:grid-cols-1">
            <div>
              <dt className="meta text-fg-subtle">Elsewhere</dt>
              <dd className="mt-2 flex flex-col gap-2">
                {settings.github_url ? <a href={settings.github_url} target="_blank" rel="noopener noreferrer" className="meta-lg link-underline w-fit text-fg">GitHub <span aria-hidden="true">↗</span></a> : null}
                {settings.linkedin_url ? <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="meta-lg link-underline w-fit text-fg">LinkedIn <span aria-hidden="true">↗</span></a> : null}
                {settings.instagram_url ? <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="meta-lg link-underline w-fit text-fg">Instagram <span aria-hidden="true">↗</span></a> : null}
              </dd>
            </div>
            <div>
              <dt className="meta text-fg-subtle">Local time · {settings.location}</dt>
              <dd className="meta-lg mt-2 text-fg">
                <LocalTime timezone={settings.timezone} initial={formatLocalTime(settings.timezone)} />
              </dd>
            </div>
          </dl>
        </div>
      </Reveal>
    </section>
  );
}
