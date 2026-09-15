import Image from "next/image";
import Link from "next/link";
import type { SiteSettingsRow } from "@/types/database";
import { mediaUrl } from "@/lib/supabase/env";
import { cn } from "@/lib/utils/cn";

type Props = { settings: SiteSettingsRow; publishedCount: number };

export function Hero({ settings, publishedCount }: Props) {
  const chip = settings.meta_line.split("·")[0]?.trim() || settings.tagline;
  const floating = settings.focus_areas.slice(0, 3).map((f) => f.title);
  const portrait = settings.portrait_home_path ? mediaUrl(settings.portrait_home_path) : null;

  const facts: { value: string; label: string }[] = [
    { value: "Y2", label: "NGA Coding Academy" },
    { value: String(publishedCount).padStart(2, "0"), label: publishedCount === 1 ? "Project published" : "Projects published" },
    { value: "KGL", label: settings.location },
  ];

  return (
    <section className="container-site pt-10 pb-16 sm:pt-14 lg:pt-16 lg:pb-24" aria-labelledby="hero-heading">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Text column */}
        <div className="lg:col-span-7 lg:pr-10">
          <span className="chip-accent">{chip}</span>
          <h1 id="hero-heading" className="mt-7 font-mono text-display-xl font-medium text-fg">
            {settings.opening_statement}
          </h1>
          {settings.intro_line ? (
            <p className="mt-6 max-w-[40ch] font-mono text-small leading-relaxed text-fg-muted">{settings.intro_line}</p>
          ) : null}
          <Link href="/#contact" className="link-accent meta mt-9 inline-block">
            Let&apos;s talk <span aria-hidden="true">↗</span>
          </Link>

          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-rule pt-8 sm:max-w-md">
            {facts.map((f) => (
              <div key={f.label}>
                <dd className="font-mono text-display-md font-medium leading-none text-fg">{f.value}</dd>
                <dt className="meta mt-2 text-fg-subtle">{f.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Portrait column */}
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-[480px]">
            {/* backing circle */}
            <div className="absolute inset-0 rounded-full bg-bg-raised" aria-hidden="true" />
            <div className="absolute right-[6%] top-[8%] h-3 w-3 rounded-full bg-bg-sunken" aria-hidden="true" />
            <div className="absolute right-[10%] top-[58%] h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />

            {portrait ? (
              <div className="absolute inset-x-[10%] bottom-0 top-[6%] overflow-hidden rounded-t-[200px]">
                <Image
                  src={portrait}
                  alt={settings.portrait_alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 520px, 90vw"
                  className="object-cover object-top"
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-display-lg font-medium text-fg-subtle/60">{initials(settings.display_name)}</span>
              </div>
            )}

            {/* floating focus chips (the reference's icon coins, without logos) */}
            {floating.map((label, i) => (
              <span
                key={label}
                className={cn(
                  "absolute flex items-center justify-center rounded-full bg-bg-sunken px-4 py-3 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-muted shadow-[0_0_0_1px_var(--color-rule)]",
                  i === 0 && "-left-1 top-[46%] sm:left-[-4%]",
                  i === 1 && "right-[-2%] top-[22%] sm:right-[-6%]",
                  i === 2 && "bottom-[6%] right-[2%] sm:right-[-2%]",
                )}
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

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase();
}
