import { TechnologiesAdmin } from "@/components/admin/TechnologiesAdmin";
import { Breadcrumbs, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import type { TechnologyRow } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function SkillsAdmin() {
  const { supabase } = await requireAdmin();
  const [{ data: techs, error }, { data: links }] = await Promise.all([
    supabase.from("technologies").select("*").order("group").order("sort_order").order("name"),
    supabase.from("project_technologies").select("technology_id"),
  ]);
  if (error) throw new Error(error.message);
  const usage: Record<string, number> = {};
  for (const l of links ?? []) usage[l.technology_id] = (usage[l.technology_id] ?? 0) + 1;
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs items={[{ label: "Content", href: "/admin/projects" }, { label: "Skills" }]} />
      <PageHeader title="Skills" description="Every technology with its logo, group and honest level. Shown on the Skills page, the home Toolbox, and picked per project." />
      <TechnologiesAdmin technologies={(techs ?? []) as TechnologyRow[]} usage={usage} />
    </div>
  );
}
