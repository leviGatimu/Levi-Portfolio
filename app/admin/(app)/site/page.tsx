import { ExportButton, PortraitSection, SiteForm } from "@/components/admin/SiteForm";
import { Fieldset, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { DEFAULT_SETTINGS } from "@/lib/db/public";
import type { SiteSettingsRow } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function SitePage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", true).single();
  if (error) throw new Error(`site_settings: ${error.message}. Did you run backend/migrations/0001_init.sql?`);
  const settings = { ...DEFAULT_SETTINGS, ...(data as Partial<SiteSettingsRow>) } as SiteSettingsRow;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Content" title="Site settings" description="Everything on the site that is not a project: hero text, bio, journey, highlights, links and the portrait." />
      <SiteForm settings={settings} />
      <PortraitSection settings={settings} />
      <Fieldset legend="Maintenance" description="Download a JSON snapshot of all content before risky changes. Images stay in Supabase Storage.">
        <ExportButton />
      </Fieldset>
    </div>
  );
}
