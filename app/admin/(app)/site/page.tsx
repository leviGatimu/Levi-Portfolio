import { ExportButton, PortraitSection, SiteForm } from "@/components/admin/SiteForm";
import { Fieldset } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import type { SiteSettingsRow } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function SitePage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", true).single();
  if (error) throw new Error(`site_settings: ${error.message} — did you run backend/migrations/0001_init.sql?`);
  const settings = data as SiteSettingsRow;

  return (
    <div>
      <h1 className="font-mono text-display-md font-medium text-fg">Site</h1>
      <p className="mt-2 max-w-[60ch] text-small text-fg-muted">Everything on the site that is not a project: the hero, bio, now, links and portrait.</p>
      <div className="mt-10 flex flex-col gap-12">
        <SiteForm settings={settings} />
        <PortraitSection settings={settings} />
        <Fieldset legend="Maintenance" description="Download a JSON snapshot of all content before risky changes. Images are not included — they stay in Supabase Storage.">
          <ExportButton />
        </Fieldset>
      </div>
    </div>
  );
}
