import { Radio } from "lucide-react";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Breadcrumbs, PageHeader } from "@/components/admin/ui";
import { getAdminSettings } from "@/lib/db/admin-settings";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { formatDate } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function NowPageAdmin() {
  const { supabase } = await requireAdmin();
  const settings = await getAdminSettings(supabase);
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs items={[{ label: "Pages", href: "/admin/pages/home" }, { label: "Now" }]} />
      <PageHeader title="Now page" description={settings.now_updated_at ? `Last changed ${formatDate(settings.now_updated_at)}. The date updates automatically when you save a change.` : "The date updates automatically when you save a change."} />
      <SettingsForm
        settings={settings}
        sections={[
          {
            legend: "What I am on right now",
            description: "Markdown. Keep it current; it is also shown on the home page and About.",
            icon: <Radio size={18} />,
            fields: [{ key: "now_md", label: "Now", kind: "markdown", maxLength: 2000 }],
          },
        ]}
      />
    </div>
  );
}
