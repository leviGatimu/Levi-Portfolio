import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "./BrandIcons";
import type { SiteSettingsRow } from "@/types/database";
import Logo from "./Logo";
import SandText from "./SandText";

const INK_GRAINS = ["#000000", "#070707", "#0d0d0d", "#050505", "#111111", "#030303"];
const LIGHT_GRAINS = ["#ffffff", "#e9eefb", "#cdd8f2", "#aebfe6", "#dde6fa", "#8fa6dd"];

export default function Footer({ settings }: { settings: SiteSettingsRow }) {
  const [first = "LEVI", last = "GATIMU"] = settings.display_name.toUpperCase().split(" ");
  const columns = [
    {
      title: "Explore",
      links: [
        { label: "Work", href: "/work" },
        { label: "Experiments", href: "/experiments" },
        { label: "About", href: "/about" },
        { label: "Journey", href: "/journey" },
        { label: "Skills", href: "/skills" },
        { label: "Toolbox", href: "/#toolbox" },
        { label: "Now", href: "/now" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "Contact page", href: "/contact" },
        { label: "Email", href: `mailto:${settings.email}`, external: true },
        ...(settings.github_url ? [{ label: "GitHub", href: settings.github_url, external: true }] : []),
        ...(settings.linkedin_url ? [{ label: "LinkedIn", href: settings.linkedin_url, external: true }] : []),
        ...(settings.instagram_url ? [{ label: "Instagram", href: settings.instagram_url, external: true }] : []),
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-black/10 bg-[#ececec] text-slate-600 dark:border-white/10 dark:bg-[#0a0e17] dark:text-slate-300">
      <div className="relative mx-auto max-w-7xl px-6 pt-28">
        <div className="grid gap-12 border-b border-black/10 pb-24 md:grid-cols-12 dark:border-white/10">
          <div className="space-y-8 md:col-span-5">
            <Logo size={40} name={settings.display_name} textClassName="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50" />
            <p className="max-w-sm text-lg leading-relaxed text-slate-500 dark:text-slate-400">{settings.tagline}. {settings.location}.</p>
            <a
              href={`mailto:${settings.email}`}
              className="group inline-flex items-center gap-3 rounded-2xl bg-slate-900 py-4 pl-7 pr-5 font-semibold text-white shadow-[0_18px_40px_-14px_rgba(15,23,42,0.6)] transition-colors hover:bg-slate-800"
            >
              Say hello
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 transition-transform group-hover:rotate-45">
                <ArrowUpRight size={16} />
              </span>
            </a>
            <div className="flex gap-5 pt-2">
              {settings.github_url ? (
                <a href={settings.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-white/10">
                  <GithubIcon size={18} />
                </a>
              ) : null}
              {settings.linkedin_url ? (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-white/10">
                  <LinkedinIcon size={18} />
                </a>
              ) : null}
              {settings.instagram_url ? (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 transition-colors hover:border-pink-500 hover:text-pink-500 dark:border-white/10">
                  <InstagramIcon size={18} />
                </a>
              ) : null}
              <a href={`mailto:${settings.email}`} aria-label="Email" className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-white/10">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 md:col-span-7 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">{col.title}</h3>
                <ul className="space-y-4 text-[15px]">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target={"external" in link && link.external && !link.href.startsWith("mailto:") ? "_blank" : undefined}
                        rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
                        className="group inline-flex items-center gap-1.5 text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      >
                        {link.label}
                        {"external" in link && link.external ? <ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" /> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">Currently</h3>
              <p className="text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">Year 2, NGA Coding Academy. Building software and heading for the sky.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-8 text-xs text-slate-400 md:flex-row dark:text-slate-500">
          <p>© {new Date().getFullYear()} {settings.display_name}. Built with Next.js and Supabase.</p>
          <div className="flex gap-8">
            <Link href="/work" className="transition-colors hover:text-slate-900 dark:hover:text-white">Work</Link>
            <Link href="/about" className="transition-colors hover:text-slate-900 dark:hover:text-white">About</Link>
            <span>Kigali, Rwanda</span>
          </div>
        </div>
      </div>

      {/* Giant interactive wordmark */}
      <div className="relative w-full select-none">
        <div className="h-[34vw] max-h-[520px] min-h-[260px] w-full">
          <SandText lines={[first, last]} colors={INK_GRAINS} darkColors={LIGHT_GRAINS} className="h-full w-full cursor-none touch-none" />
        </div>
        <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
          Drag your cursor through the grains
        </p>
      </div>
    </footer>
  );
}
