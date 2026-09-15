import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/public/CaseStudy";
import { coverOf, getProjectBySlug, getPublishedProjects, techsOf } from "@/lib/db/public";
import { mediaUrl } from "@/lib/supabase/env";
import { SITE_URL } from "@/lib/utils/site";

export const revalidate = 3600;
export const dynamicParams = true;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  if (!result) return { title: "Not found" };
  const { project } = result;
  const description = project.one_liner || project.summary.slice(0, 155);
  return {
    title: project.name,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/work/${project.slug}`,
      title: `${project.name} · Levi Gatimu`,
      description,
      publishedTime: project.published_at ?? undefined,
      modifiedTime: project.updated_at,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  if (!result) notFound();
  const { project, next, position } = result;
  const cover = coverOf(project);
  const repo = project.links.find((l) => l.kind === "repo");
  const languages = techsOf(project).filter((t) => t.group === "language").map((t) => t.name);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": repo ? "SoftwareSourceCode" : "CreativeWork",
    name: project.name,
    description: project.one_liner || project.summary,
    url: `${SITE_URL}/work/${project.slug}`,
    ...(cover ? { image: mediaUrl(cover.storage_path) } : {}),
    author: { "@type": "Person", name: "Levi Gatimu", url: SITE_URL },
    dateCreated: String(project.year),
    ...(repo ? { codeRepository: repo.url } : {}),
    ...(languages.length ? { programmingLanguage: languages } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <CaseStudy project={project} next={next} position={position} />
    </>
  );
}
