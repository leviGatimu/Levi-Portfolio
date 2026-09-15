import Link from "next/link";
import type { SiteSettingsRow } from "@/types/database";
import { formatDate } from "@/lib/utils/format";

export function Footer({ settings, lastUpdated }: { settings: SiteSettingsRow; lastUpdated: string | null }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-bg-deep">
      <div className="container-site py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-mono text-[0.9375rem] text-fg">
              <span className="font-semibold">{settings.display_name}</span>
            </p>
            <p className="meta-lg mt-2 text-fg-subtle">{settings.tagline}</p>
            <p className="meta-lg mt-1 text-fg-subtle">{settings.location}</p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-3">
            <Link href="/work" className="meta w-fit text-fg-muted hover:text-fg">Work</Link>
            <Link href="/about" className="meta w-fit text-fg-muted hover:text-fg">About</Link>
            <Link href="/#contact" className="meta w-fit text-fg-muted hover:text-fg">Contact</Link>
          </nav>
          <div className="flex flex-col gap-3">
            <a href={`mailto:${settings.email}`} className="meta-lg w-fit text-fg link-underline">{settings.email}</a>
            {settings.github_url ? <a href={settings.github_url} target="_blank" rel="noopener noreferrer" className="meta w-fit text-fg-muted hover:text-fg">GitHub <span aria-hidden="true">↗</span></a> : null}
            {settings.linkedin_url ? <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="meta w-fit text-fg-muted hover:text-fg">LinkedIn <span aria-hidden="true">↗</span></a> : null}
            {settings.instagram_url ? <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="meta w-fit text-fg-muted hover:text-fg">Instagram <span aria-hidden="true">↗</span></a> : null}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-rule pt-6 md:flex-row md:items-center md:justify-between">
          <p className="meta text-fg-subtle">© {year} {settings.display_name}</p>
          <p className="meta text-fg-subtle">
            {lastUpdated ? <>Last updated {formatDate(lastUpdated)} · </> : null}Built with Next.js &amp; Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
