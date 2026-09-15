import { TechnologiesAdmin } from "@/components/admin/TechnologiesAdmin";
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
    <div>
      <h1 className="font-mono text-display-md font-medium text-fg">Technologies</h1>
      <p className="mt-2 max-w-[60ch] text-small text-fg-muted">
        The shared list used by the project picker. Levels appear on the About page — rate honestly, or leave blank to keep a technology off About.
      </p>
      <div className="mt-8">
        <TechnologiesAdmin technologies={(techs ?? []) as TechnologyRow[]} usage={usage} />
      </div>
    </div>
  );
}
