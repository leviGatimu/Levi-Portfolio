import type { Metadata } from "next";
import Hero from "@/components/public/Hero";
import { Beyond, ClosingCta, Meet, ProjectGrid, SelectedWork, Toolbox, WhatIDo } from "@/components/public/HomeSections";
import { getAllTechnologies, getPublishedProjects, getSiteSettings } from "@/lib/db/public";
import { mediaUrl } from "@/lib/supabase/env";
import { SITE_URL } from "@/lib/utils/site";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: { absolute: `${s.display_name} · ${s.tagline}` },
    description: `${s.opening_statement} ${s.location}.`,
    alternates: { canonical: "/" },
    openGraph: { type: "website", url: "/", title: `${s.display_name} · ${s.tagline}`, description: s.opening_statement, siteName: s.display_name },
    twitter: { card: "summary_large_image" },
  };
}

/** The poster headline is a fixed design element; the statement under it comes from the admin. */
const HEADLINE = ["Software", "that actually", "ships."];

export default async function HomePage() {
  const [settings, projects, technologies] = await Promise.all([getSiteSettings(), getPublishedProjects(), getAllTechnologies()]);
  const featured = projects.filter((p) => p.is_featured);
  const ordered = [...featured, ...projects.filter((p) => !p.is_featured)];
  const usedTechIds = new Set(projects.flatMap((p) => p.project_technologies.map((pt) => pt.technologies?.id)));
  const techCount = usedTechIds.size > 0 ? usedTechIds.size : technologies.filter((t) => t.proficiency).length;
  const portrait = settings.portrait_home_path ? mediaUrl(settings.portrait_home_path) : "/portrait.png";
  const [firstName] = settings.display_name.split(" ");

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.display_name,
    url: SITE_URL,
    jobTitle: "Student developer",
    affiliation: { "@type": "EducationalOrganization", name: "NGA Coding Academy" },
    address: { "@type": "PostalAddress", addressLocality: "Kigali", addressCountry: "RW" },
    sameAs: [settings.github_url, settings.linkedin_url, settings.instagram_url].filter(Boolean),
    image: portrait.startsWith("/") ? `${SITE_URL}${portrait}` : portrait,
  };

  return (
    <div className="relative">
      <div className="grain" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\u003c") }} />
      <Hero firstName={firstName ?? "Levi"} headline={HEADLINE} intro={settings.opening_statement} portraitSrc={portrait} portraitAlt={settings.portrait_alt} />
      <Meet settings={settings} portraitSrc={portrait} publishedCount={projects.length} technologyCount={techCount} />
      <WhatIDo />
      <SelectedWork projects={ordered} />
      <ProjectGrid projects={ordered.slice(0, 6)} />
      <Toolbox technologies={technologies} />
      <Beyond settings={settings} />
      <ClosingCta settings={settings} />
    </div>
  );
}
