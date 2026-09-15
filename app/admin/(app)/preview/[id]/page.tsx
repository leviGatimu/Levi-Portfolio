import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/public/CaseStudy";
import { PROJECT_SELECT, normalizeProject } from "@/lib/db/public";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import type { ProjectWithRelations } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("projects").select(PROJECT_SELECT).eq("id", id).maybeSingle();
  if (!data) notFound();
  const project = normalizeProject(data as unknown as ProjectWithRelations);
  return (
    <div className="-mx-5 -my-8 sm:-mx-8 lg:-mx-12 lg:-my-12">
      <CaseStudy project={project} next={null} preview />
    </div>
  );
}
