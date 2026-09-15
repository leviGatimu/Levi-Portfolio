import Link from "next/link";
import { ArrowUpRight, BarChart3, Eye, FolderKanban, Globe, Images, MonitorSmartphone, Plus, Wrench } from "lucide-react";
import { AreaChart, BarList, StatTile } from "@/components/admin/charts";
import { Badge, Breadcrumbs, Card, IconLink, InfoRow, PageHeader } from "@/components/admin/ui";
import { getAnalytics, getContentStats } from "@/lib/db/admin";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { formatDate } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

function pct(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const [analytics, content] = await Promise.all([getAnalytics(supabase, 30), getContentStats(supabase)]);

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs items={[{ label: "Dashboard" }]} />
      <PageHeader
        title="Dashboard"
        description="Last 30 days of traffic and the state of the content."
        action={<Link href="/admin/projects/new" className="inline-flex h-11 items-center gap-2 rounded-full bg-blue-600 px-5 text-[14px] font-medium text-white hover:bg-blue-700"><Plus size={16} /> New project</Link>}
      />

      {!analytics.available ? (
        <Card>
          <p className="text-[13px] text-slate-600">Analytics are not enabled yet. Run <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[12px]">backend/migrations/0006_analytics_and_journey.sql</code> in the Supabase SQL editor and visits will start appearing here.</p>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Views, 30 days" value={analytics.totalViews} delta={pct(analytics.totalViews, analytics.previousViews)} icon={<Eye size={17} />} />
        <StatTile label="Views today" value={analytics.todayViews} hint="Cookieless" icon={<BarChart3 size={17} />} />
        <StatTile label="Published projects" value={content.projects.published} hint={`${content.projects.drafts} draft${content.projects.drafts === 1 ? "" : "s"}, ${content.projects.featured} featured`} icon={<FolderKanban size={17} />} />
        <StatTile label="Media" value={`${(content.images.bytes / 1024 / 1024).toFixed(1)} MB`} hint={`${content.images.count} image${content.images.count === 1 ? "" : "s"}`} icon={<Images size={17} />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card title="Views per day" subtitle="Last 30 days" icon={<BarChart3 size={18} />} className="xl:col-span-2" actions={<IconLink href="/admin/analytics" label="Full analytics"><ArrowUpRight size={16} /></IconLink>}>
          <AreaChart data={analytics.daily} />
        </Card>
        <Card title="Top pages" subtitle="Most viewed" icon={<Eye size={18} />}>
          <BarList items={analytics.topPages} total={analytics.totalViews} empty="No visits recorded yet." />
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Referrers" subtitle="Where visitors come from" icon={<Globe size={18} />}><BarList items={analytics.referrers} total={analytics.totalViews} empty="No referrers yet." /></Card>
        <Card title="Countries" subtitle="From the edge, no IP stored" icon={<Globe size={18} />}><BarList items={analytics.countries} total={analytics.totalViews} empty="No countries yet." /></Card>
        <Card title="Devices" icon={<MonitorSmartphone size={18} />}><BarList items={analytics.devices} total={analytics.totalViews} empty="No devices yet." /></Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Recently edited" subtitle="Projects" icon={<FolderKanban size={18} />} className="lg:col-span-2" actions={<IconLink href="/admin/projects" label="All projects"><ArrowUpRight size={16} /></IconLink>} bodyClassName="p-0 sm:p-0">
          {content.recent.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-[13px] text-slate-600">No projects yet.</p>
              <Link href="/admin/projects/new" className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-blue-600 px-4 text-[13px] font-medium text-white">Create the first one</Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {content.recent.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <Link href={`/admin/projects/${p.id}`} className="text-[14px] font-medium text-slate-900 hover:underline">{p.name}</Link>
                    <p className="text-[12px] text-slate-400">/work/{p.slug} · edited {formatDate(p.updated_at)}</p>
                  </div>
                  {p.is_published ? <Badge tone="success">Published</Badge> : <Badge>Draft</Badge>}
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Content" icon={<Wrench size={18} />} bodyClassName="pt-1">
          <InfoRow icon={<FolderKanban size={16} />} label="Projects">{content.projects.total} total, {content.projects.published} published</InfoRow>
          <InfoRow icon={<Images size={16} />} label="Images">{content.images.count} in storage</InfoRow>
          <InfoRow icon={<Wrench size={16} />} label="Skills">{content.technologies.rated} of {content.technologies.total} rated</InfoRow>
          {content.technologies.usage.length > 0 ? (
            <div className="pt-4">
              <p className="mb-3 text-[12px] font-medium text-slate-400">Most used in projects</p>
              <BarList items={content.technologies.usage.slice(0, 5)} />
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
