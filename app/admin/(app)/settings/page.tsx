import { Database, Download, ShieldCheck } from "lucide-react";
import { ExportButton } from "@/components/admin/ExportButton";
import { Breadcrumbs, Card, InfoRow, PageHeader } from "@/components/admin/ui";
import { getAnalytics, getContentStats } from "@/lib/db/admin";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export const dynamic = "force-dynamic";

export default async function SettingsAdmin() {
  const { supabase, email } = await requireAdmin();
  const [content, analytics] = await Promise.all([getContentStats(supabase), getAnalytics(supabase, 7)]);
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs items={[{ label: "Settings" }]} />
      <PageHeader title="Site settings" description="System status, backups and the things that rarely change." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="System" icon={<ShieldCheck size={18} />}>
          <InfoRow icon={<ShieldCheck size={17} />} label="Admin account">{email ?? "Signed in"}</InfoRow>
          <InfoRow icon={<Database size={17} />} label="Database">Supabase Postgres with row-level security. Drafts are hidden at the database level.</InfoRow>
          <InfoRow icon={<Database size={17} />} label="Analytics">{analytics.available ? "Enabled. Cookieless page views, no personal data." : "Not enabled. Run backend/migrations/0006_analytics_and_journey.sql."}</InfoRow>
          <InfoRow icon={<Database size={17} />} label="Storage">{content.images.count} images, {(content.images.bytes / 1024 / 1024).toFixed(1)} MB in the media bucket.</InfoRow>
        </Card>
        <Card title="Backup" icon={<Download size={18} />} subtitle="Download a JSON snapshot of every table before risky changes. Images stay in Supabase Storage.">
          <ExportButton />
        </Card>
      </div>
    </div>
  );
}
