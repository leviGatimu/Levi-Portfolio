import Link from "next/link";
import type { ProjectWithRelations, SiteSettingsRow } from "@/types/database";
import { Prose } from "@/components/shared/Prose";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { LocalTime } from "@/components/shared/LocalTime";
import { formatDate, formatLocalTime } from "@/lib/utils/format";
import { ProjectPanel } from "./ProjectPanel";
import { Tilt } from "./Tilt";

/* ---------------- Technology marquee ---------------- */

export function TechMarquee({ names }: { names: string[] }) {
  if (names.length === 0) return null;
  const items = [...names, ...names];
  return (
    <div className="border-y border-rule bg-bg-sunken/60 py-4" aria-label="Technologies">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <ul className="marquee gap-10 px-5">
          {items.map((n, i) => (
            <li key={`${n}-${i}`} className="meta flex items-center gap-10 whitespace-nowrap text-fg-muted" aria-hidden={i >= names.length}>
              {n}
              <span className="h-1 w-1 rounded-full bg-accent/70" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- Latest works ---------------- */

export function LatestWorks({ featured, others }: { featured: ProjectWithRelations[]; others: ProjectWithRelations[] }) {
  const [lead, ...restFeatured] = featured;
  const grid = [...restFeatured, ...others];
  const empty = featured.length === 0 && others.length === 0;

  return (
    <section className="container-site py-20 lg:py-28" aria-labelledby="works-heading">
      <Reveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader id="works-heading" index="01 / Selected work" title="Latest works" subtitle="Real projects, real screenshots. Click one to read how it was built." />
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
              <Tilt>
                <ProjectPanel project={lead} accentTitle size="large" priority />
              </Tilt>
            </Reveal>
          ) : null}
          {grid.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {grid.map((p, i) => (
                <Reveal key={p.id} delay={(i % 2) * 90}>
                  <Tilt className="h-full">
                    <ProjectPanel project={p} className="h-full" />
                  </Tilt>
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
  return (
    <section className="container-site py-20 lg:py-28" aria-labelledby="intro-heading">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="reveal-stagger lg:col-span-5">
          {settings.focus_areas.map((f, i) => (
            <div key={f.title} className="panel mb-4 flex items-start justify-between gap-6 p-6 transition-colors duration-300 hover:bg-[#2e2f35] sm:p-7" style={{ "--n": i } as React.CSSProperties}>
              <div>
                <h3 className={`font-mono text-heading font-medium ${i === 0 ? "text-accent" : "text-fg"}`}>{f.title}</h3>
                <p className="mt-2 text-small text-fg-muted">{f.description}</p>
              </div>
              <span className="meta shrink-0 pt-1 text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
            </div>
          ))}
        </Reveal>

        <Reveal className="lg:col-span-6 lg:col-start-7" delay={120}>
          <span className="meta text-fg-subtle">02 / Introduce</span>
          <h2 id="intro-heading" className="grow-line mt-4 font-mono text-display-md font-medium text-fg">
            Hello! I&apos;m {settings.display_name}
          </h2>
          {settings.tagline ? <p className="mt-8 font-mono text-lead italic text-fg">{settings.tagline}</p> : null}
          {settings.bio_short_md ? <Prose markdown={settings.bio_short_md} className="mt-6 font-mono text-small" /> : null}
          {settings.now_md ? (
            <div className="mt-8 border-t border-rule pt-6">
              <p className="meta flex items-center gap-2 text-fg-subtle">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
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

/* ---------------- How I work ---------------- */

const STEPS = [
  {
    n: "01",
    title: "Concept",
    text: "Start from a real problem, usually one I have myself or see around me at school. Write down what done looks like before touching code.",
  },
  {
    n: "02",
    title: "Prototype",
    text: "Build the smallest thing that proves the idea works, learning whatever the project needs on the way: a new language, a framework, a sensor.",
  },
  {
    n: "03",
    title: "Product",
    text: "Turn it into something other people can use: deploy it, ship the installer, write the docs, and be honest about what works and what doesn't.",
  },
];

export function HowIWork() {
  return (
    <section className="border-y border-rule bg-bg-sunken/50" aria-labelledby="process-heading">
      <div className="container-site py-20 lg:py-28">
        <Reveal>
          <SectionHeader id="process-heading" index="03 / How I work" title="From concept to prototype to product" subtitle="The same loop, whether it is a web app, a desktop tool or a rover." />
        </Reveal>
        <Reveal className="reveal-stagger mt-12 grid gap-px overflow-hidden rounded-[4px] bg-rule md:grid-cols-3" delay={100}>
          {STEPS.map((s, i) => (
            <div key={s.n} className="group relative bg-bg p-7 transition-colors duration-300 hover:bg-bg-raised sm:p-9" style={{ "--n": i } as React.CSSProperties}>
              <span className="font-mono text-display-md font-medium text-accent/80 transition-colors group-hover:text-accent">{s.n}</span>
              <h3 className="mt-6 font-mono text-heading font-medium text-fg">{s.title}</h3>
              <p className="mt-3 text-small leading-relaxed text-fg-muted">{s.text}</p>
              <span aria-hidden="true" className="absolute right-7 top-8 text-fg-subtle transition-transform duration-500 group-hover:translate-x-1">→</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Beyond software ---------------- */

export function Beyond({ settings }: { settings: SiteSettingsRow }) {
  const items = settings.highlights ?? [];
  if (items.length === 0) return null;
  return (
    <section className="container-site py-20 lg:py-28" aria-labelledby="beyond-heading">
      <Reveal>
        <SectionHeader id="beyond-heading" index="04 / Beyond software" title="Leadership, hardware and the sky" subtitle="The parts of me that don't fit in a repository." />
      </Reveal>
      <Reveal className="reveal-stagger mt-12 grid gap-4 md:grid-cols-3" delay={100}>
        {items.map((h, i) => (
          <div key={h.title} className="panel flex flex-col p-7 transition-colors duration-300 hover:bg-[#2e2f35]" style={{ "--n": i } as React.CSSProperties}>
            <span className="meta text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-5 font-mono text-heading font-medium text-fg">{h.title}</h3>
            <p className="mt-3 text-small leading-relaxed text-fg-muted">{h.description}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

/* ---------------- Contact ---------------- */

export function Contact({ settings, index = "05" }: { settings: SiteSettingsRow; index?: string }) {
  return (
    <section id="contact" className="container-site scroll-mt-20 py-20 lg:py-28" aria-labelledby="contact-heading">
      <Reveal>
        <div className="grid gap-10 border-t border-rule pt-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="meta text-fg-subtle">{index} / Contact</span>
            <h2 id="contact-heading" className="mt-4 font-mono text-display-lg font-medium text-fg">Say hello.</h2>
            <p className="mt-4 max-w-[46ch] text-small text-fg-muted">Projects, collaborations, internships, or just a question about how something was built. I reply.</p>
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
