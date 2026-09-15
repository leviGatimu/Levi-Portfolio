import type { Metadata } from "next";
import { Hero } from "@/components/public/Hero";
import { Contact, Introduce, LatestWorks } from "@/components/public/HomeSections";
import { getPublishedProjects, getSiteSettings } from "@/lib/db/public";
import { mediaUrl } from "@/lib/supabase/env";
import { SITE_URL } from "@/lib/utils/site";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: { absolute: `${s.display_name} — ${s.tagline}` },
    description: `${s.opening_statement} ${s.location}.`,
    alternates: { canonical: "/" },
    openGraph: { type: "website", url: "/", title: `${s.display_name} — ${s.tagline}`, description: s.opening_statement, siteName: s.display_name },
    twitter: { card: "summary_large_image" },
  };
}

export default async function HomePage() {
  const [settings, projects] = await Promise.all([getSiteSettings(), getPublishedProjects()]);
  const featured = projects.filter((p) => p.is_featured);
  const others = projects.filter((p) => !p.is_featured).slice(0, Math.max(0, 6 - featured.length));

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.display_name,
    url: SITE_URL,
    jobTitle: "Student developer",
    affiliation: { "@type": "EducationalOrganization", name: "NGA Coding Academy" },
    address: { "@type": "PostalAddress", addressLocality: "Kigali", addressCountry: "RW" },
    sameAs: [settings.github_url, settings.linkedin_url, settings.instagram_url].filter(Boolean),
    ...(settings.portrait_home_path ? { image: mediaUrl(settings.portrait_home_path) } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\u003c") }} />
      <Hero settings={settings} publishedCount={projects.length} />
      <LatestWorks featured={featured} others={others} />
      <Introduce settings={settings} />
      <Contact settings={settings} />
    </>
  );
}
