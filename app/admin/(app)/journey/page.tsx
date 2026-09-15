import { Route } from "lucide-react";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Breadcrumbs, PageHeader } from "@/components/admin/ui";
import { getAdminSettings } from "@/lib/db/admin-settings";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export const dynamic = "force-dynamic";

export default async function JourneyAdmin() {
  const { supabase } = await requireAdmin();
  const settings = await getAdminSettings(supabase);
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs items={[{ label: "Content", href: "/admin/projects" }, { label: "Journey" }]} />
      <PageHeader title="Journey" description="The timeline on /journey, top to bottom. The last entry is styled as the destination." />
      <SettingsForm
        settings={settings}
        sections={[{ legend: "Timeline", icon: <Route size={18} />, fields: [{ key: "journey", label: "Entries", kind: "journey", max: 12, help: "Period, title, one or two sentences" }] }]}
      />
    </div>
  );
}
