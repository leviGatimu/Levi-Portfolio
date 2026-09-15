import { ImageIcon, UserRound } from "lucide-react";
import { PortraitSection } from "@/components/admin/PortraitSection";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Breadcrumbs, PageHeader } from "@/components/admin/ui";
import { getAdminSettings } from "@/lib/db/admin-settings";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export const dynamic = "force-dynamic";

export default async function ProfileAdmin() {
  const { supabase } = await requireAdmin();
  const settings = await getAdminSettings(supabase);
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs items={[{ label: "Settings", href: "/admin/settings" }, { label: "Profile" }]} />
      <PageHeader title="Profile" description="Your name, tagline and portrait. Used in the navbar, footer, hero and About." />
      <SettingsForm
        settings={settings}
        sections={[
          {
            legend: "Identity",
            icon: <UserRound size={18} />,
            fields: [
              { key: "display_name", label: "Display name", kind: "input", required: true, maxLength: 60 },
              { key: "tagline", label: "Tagline", kind: "input", maxLength: 120, help: "e.g. Student Developer · Full-Stack · AI · Robotics" },
              { key: "meta_line_secondary", label: "Secondary line", kind: "input", maxLength: 120, help: "Optional. Shown on About under the headline." },
              { key: "portrait_alt", label: "Portrait alt text", kind: "input", required: true, maxLength: 200, help: "Describes the photo for screen readers." },
            ],
          },
        ]}
      />
      <PortraitSection settings={settings} icon={<ImageIcon size={18} />} />
    </div>
  );
}
