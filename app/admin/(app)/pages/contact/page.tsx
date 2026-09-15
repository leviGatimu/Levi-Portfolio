import { AtSign, Link2, MapPin } from "lucide-react";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Breadcrumbs, PageHeader } from "@/components/admin/ui";
import { getAdminSettings } from "@/lib/db/admin-settings";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export const dynamic = "force-dynamic";

export default async function ContactPageAdmin() {
  const { supabase } = await requireAdmin();
  const settings = await getAdminSettings(supabase);
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs items={[{ label: "Pages", href: "/admin/pages/home" }, { label: "Contact" }]} />
      <PageHeader title="Contact and links" description="Email, social links and location. Empty links are simply not shown anywhere." />
      <SettingsForm
        settings={settings}
        sections={[
          { legend: "Email", icon: <AtSign size={18} />, fields: [{ key: "email", label: "Email address", kind: "input", required: true }] },
          {
            legend: "Links",
            icon: <Link2 size={18} />,
            fields: [
              { key: "github_url", label: "GitHub", kind: "input", placeholder: "https://github.com/" },
              { key: "linkedin_url", label: "LinkedIn", kind: "input", placeholder: "https://www.linkedin.com/in/" },
              { key: "instagram_url", label: "Instagram", kind: "input", placeholder: "https://instagram.com/" },
            ],
          },
          {
            legend: "Location",
            icon: <MapPin size={18} />,
            fields: [
              { key: "location", label: "Location", kind: "input", maxLength: 80 },
              { key: "timezone", label: "Timezone", kind: "input", maxLength: 60, help: "IANA name, e.g. Africa/Kigali. Drives the local time shown on the site." },
            ],
          },
        ]}
      />
    </div>
  );
}
