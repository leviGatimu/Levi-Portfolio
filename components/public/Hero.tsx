import Image from "next/image";
import Link from "next/link";
import type { SiteSettingsRow } from "@/types/database";
import { CountUp } from "@/components/shared/CountUp";
import { mediaUrl } from "@/lib/supabase/env";
import { cn } from "@/lib/utils/cn";

type Props = { settings: SiteSettingsRow; publishedCount: number; technologyCount: number };

/** The static cutout portrait shipped with the site; an uploaded portrait (Admin > Site) replaces it. */
const STATIC_PORTRAIT = { src: "/portrait.png", width: 332, height: 457 };

export function Hero({ settings, publishedCount, technologyCount }: Props) {
  const chip = settings.meta_line.split("·")[0]?.trim() || settings.tagline;
  const floating = settings.focus_areas.slice(0, 3).map((f) => f.title);
  const words = settings.opening_statement.split(/\s+/).filter(Boolean);
  const uploaded = settings.portrait_home_path ? mediaUrl(settings.portrait_home_path) : null;

  const facts = [
    { value: 2, pad: 1, prefix: "Y", label: "Year at NGA Coding Academy" },
    { value: publishedCount, pad: 2, prefix: "", label: publishedCount === 1 ? "Project published" : "Projects published" },
    { value: technologyCount, pad: 2, prefix: "", label: "Technologies I work with" },
  ];

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="container-site grid items-center gap-14 pt-12 pb-16 sm:pt-16 lg:grid-cols-12 lg:gap-8 lg:pt-20 lg:pb-24">
        {/* Text column */}
        <div className="lg:col-span-7 lg:pr-10">
          <span className="chip-accent anim-fade-in">{chip}</span>

          <h1 id="hero-heading" className="mt-7 font-mono text-display-xl font-medium text-fg">
            {words.map((w, i) => (
              <span key={`${w}-${i}`}>
                <span className="word-mask">
                  <span className="word-rise" style={{ "--i": i } as React.CSSProperties}>
                    {w}
                  </span>
                </span>
                {i < words.length - 1 ? " " : null}
              </span>
            ))}
          </h1>

          {settings.intro_line ? (
            <p className="anim-fade-up mt-7 max-w-[46ch] font-mono text-small leading-relaxed text-fg-muted" style={{ "--delay": "700ms" } as React.CSSProperties}>
              {settings.intro_line}
            </p>
          ) : null}

          <div className="anim-fade-up mt-9 flex flex-wrap items-center gap-8" style={{ "--delay": "850ms" } as React.CSSProperties}>
            <Link href="/work" className="link-accent meta">
              See the work <span aria-hidden="true">→</span>
            </Link>
            <Link href="/#contact" className="meta link-underline text-fg-muted hover:text-fg">
              Let&apos;s talk <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <dl className="anim-fade-up mt-14 grid grid-cols-3 gap-6 border-t border-rule pt-8 sm:max-w-lg" style={{ "--delay": "1000ms" } as React.CSSProperties}>
            {facts.map((f) => (
              <div key={f.label}>
                <dd className="font-mono text-display-md font-medium leading-none text-fg">
                  {f.prefix}
                  <CountUp value={f.value} pad={f.pad} />
                </dd>
                <dt className="meta mt-2 text-fg-subtle">{f.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Portrait column */}
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-[500px]">
            {/* backing circle */}
            <div className="anim-scale-in absolute inset-0 rounded-full bg-bg-raised" aria-hidden="true" />
            <div className="absolute right-[7%] top-[9%] h-3 w-3 rounded-full bg-bg-sunken" aria-hidden="true" />
            <div className="pulse-dot absolute right-[11%] top-[60%] h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />

            {/* the person: a cutout rising from the circle, cropped by the section bottom like the reference */}
            <div className="anim-fade-up absolute inset-x-0 -top-[6%] bottom-0 overflow-hidden rounded-b-full" style={{ "--delay": "250ms" } as React.CSSProperties}>
              {uploaded ? (
                <Image src={uploaded} alt={settings.portrait_alt} fill priority sizes="(min-width: 1024px) 500px, 90vw" className="object-cover object-top" />
              ) : (
                <Image
                  src={STATIC_PORTRAIT.src}
                  alt={settings.portrait_alt}
                  width={STATIC_PORTRAIT.width}
                  height={STATIC_PORTRAIT.height}
                  priority
                  sizes="(min-width: 1024px) 420px, 70vw"
                  className="absolute bottom-0 left-1/2 h-[94%] w-auto -translate-x-1/2 object-contain object-bottom drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
                />
              )}
            </div>

            {/* floating focus chips (the reference's orbiting icons, in words) */}
            {floating.map((label, i) => (
              <span
                key={label}
                className={cn(
                  "anim-float absolute flex items-center justify-center rounded-full bg-bg-sunken px-4 py-3 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-muted shadow-[0_0_0_1px_var(--color-rule)]",
                  i === 0 && "left-0 top-[44%] sm:left-[-4%]",
                  i === 1 && "right-0 top-[20%] sm:right-[-5%]",
                  i === 2 && "bottom-[8%] right-[2%] sm:right-[-2%]",
                )}
                style={{ "--delay": `${i * 900}ms` } as React.CSSProperties}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
