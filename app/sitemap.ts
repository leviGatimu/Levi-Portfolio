import type { MetadataRoute } from "next";
import { getPublishedProjects, getSiteSettings } from "@/lib/db/public";
import { SITE_URL } from "@/lib/utils/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, settings] = await Promise.all([getPublishedProjects(), getSiteSettings()]);
  const newest = projects.map((p) => p.updated_at).sort().at(-1) ?? settings.updated_at;
  return [
    { url: `${SITE_URL}/`, lastModified: newest },
    { url: `${SITE_URL}/work`, lastModified: newest },
    { url: `${SITE_URL}/about`, lastModified: settings.updated_at },
    ...projects.map((p) => ({ url: `${SITE_URL}/work/${p.slug}`, lastModified: p.updated_at })),
  ];
}
