import { Home, LayoutList, Sparkles } from "lucide-react";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Breadcrumbs, PageHeader } from "@/components/admin/ui";
import { getAdminSettings } from "@/lib/db/admin-settings";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export const dynamic = "force-dynamic";

export default async function HomePageAdmin() {
  const { supabase } = await requireAdmin();
  const settings = await getAdminSettings(supabase);
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs items={[{ label: "Pages", href: "/admin/pages/home" }, { label: "Home" }]} />
      <PageHeader title="Home page" description="The text under the poster headline, the focus panels next to the intro, and the Beyond software panel." />
      <SettingsForm
        settings={settings}
        sections={[
          {
            legend: "Hero",
            description: "The poster headline is fixed by design; these lines sit under it.",
            icon: <Home size={18} />,
            fields: [
              { key: "opening_statement", label: "Statement under the headline", kind: "input", maxLength: 160, help: "One sentence." },
              { key: "meta_line", label: "Badge line", kind: "input", maxLength: 120, help: "The part before the first · becomes the small badge." },
            ],
          },
          {
            legend: "Focus areas",
            description: "The three cards beside the intro.",
            icon: <LayoutList size={18} />,
            fields: [{ key: "focus_areas", label: "Cards", kind: "pairs", max: 4, help: "Title and one sentence each" }],
          },
          {
            legend: "Beyond software",
            description: "The dark panel near the bottom of the home page, also shown on About and Now.",
            icon: <Sparkles size={18} />,
            fields: [{ key: "highlights", label: "Highlights", kind: "pairs", max: 4, help: "Leadership, robotics, aviation" }],
          },
        ]}
      />
    </div>
  );
}
