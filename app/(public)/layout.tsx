import { Footer } from "@/components/public/Footer";
import { Masthead } from "@/components/public/Masthead";
import { getLastUpdated, getSiteSettings } from "@/lib/db/public";

export const revalidate = 3600;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, lastUpdated] = await Promise.all([getSiteSettings(), getLastUpdated()]);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-30 focus:bg-accent focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:text-accent-ink">
        Skip to content
      </a>
      <Masthead displayName={settings.display_name} email={settings.email} githubUrl={settings.github_url} linkedinUrl={settings.linkedin_url} />
      <main id="main" className="flex-1">{children}</main>
      <Footer settings={settings} lastUpdated={lastUpdated} />
    </>
  );
}
