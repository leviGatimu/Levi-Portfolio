import { BookOpen, FileText } from "lucide-react";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Breadcrumbs, PageHeader } from "@/components/admin/ui";
import { getAdminSettings } from "@/lib/db/admin-settings";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export const dynamic = "force-dynamic";

export default async function AboutPageAdmin() {
  const { supabase } = await requireAdmin();
  const settings = await getAdminSettings(supabase);
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs items={[{ label: "Pages", href: "/admin/pages/home" }, { label: "About" }]} />
      <PageHeader title="About page" description="The short bio appears on the home page; the long story on /about. Both are Markdown." />
      <SettingsForm
        settings={settings}
        sections={[
          {
            legend: "Short bio",
            description: "Two or three sentences. Shown on the home page next to the portrait.",
            icon: <FileText size={18} />,
            fields: [{ key: "bio_short_md", label: "Short bio", kind: "markdown", maxLength: 1000 }],
          },
          {
            legend: "The story",
            description: "Use ## headings: Who I am, What I build, Leadership, Aviation, Where I am going.",
            icon: <BookOpen size={18} />,
            fields: [
              { key: "intro_line", label: "Intro line", kind: "input", maxLength: 200, help: "Shown under the About headline." },
              { key: "bio_long_md", label: "Long bio", kind: "markdown", maxLength: 20000 },
            ],
          },
        ]}
      />
    </div>
  );
}
