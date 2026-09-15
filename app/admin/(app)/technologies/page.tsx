import { TechnologiesAdmin } from "@/components/admin/TechnologiesAdmin";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import type { TechnologyRow } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function TechnologiesPage() {
  const { supabase } = await requireAdmin();
  const [{ data: techs, error }, { data: links }] = await Promise.all([
    supabase.from("technologies").select("*").order("group").order("sort_order").order("name"),
    supabase.from("project_technologies").select("technology_id"),
  ]);
  if (error) throw new Error(error.message);
  const usage: Record<string, number> = {};
  for (const l of links ?? []) usage[l.technology_id] = (usage[l.technology_id] ?? 0) + 1;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Content" title="Technologies" description="The shared list used by the project picker and the Skills page. Rate honestly, or leave the level blank to keep a technology off the public skills list." />
      <TechnologiesAdmin technologies={(techs ?? []) as TechnologyRow[]} usage={usage} />
    </div>
  );
}
