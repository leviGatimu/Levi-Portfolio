import Link from "next/link";
import { ArrowUpRight, Eye, FolderKanban, Images, Wrench } from "lucide-react";
import { AreaChart, BarList, StatTile } from "@/components/admin/charts";
import { Badge, Card, PageHeader } from "@/components/admin/ui";
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
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Overview" title="Dashboard" description="Traffic for the last 30 days and the state of the portfolio content." />

      {!analytics.available ? (
        <Card>
          <p className="text-sm text-slate-600">
            Analytics are not set up yet. Run <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">backend/migrations/0006_analytics_and_journey.sql</code> in the Supabase SQL editor and visits will start appearing here.
          </p>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Views, 30 days" value={analytics.totalViews} delta={pct(analytics.totalViews, analytics.previousViews)} />
        <StatTile label="Views today" value={analytics.todayViews} hint="Cookieless, no personal data stored" />
        <StatTile label="Published projects" value={content.projects.published} hint={`${content.projects.drafts} draft${content.projects.drafts === 1 ? "" : "s"} · ${content.projects.featured} featured`} />
        <StatTile label="Media" value={`${(content.images.bytes / 1024 / 1024).toFixed(1)} MB`} hint={`${content.images.count} image${content.images.count === 1 ? "" : "s"} in storage`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Views per day" description="Last 30 days" className="xl:col-span-2" action={<Link href="/admin/analytics" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">Full analytics <ArrowUpRight size={14} /></Link>}>
          <AreaChart data={analytics.daily} />
        </Card>
        <Card title="Top pages" description="Most viewed, 30 days">
          <BarList items={analytics.topPages} total={analytics.totalViews} empty="No visits recorded yet." />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Where visitors come from" description="Referring sites">
          <BarList items={analytics.referrers} total={analytics.totalViews} empty="No referrers yet." />
        </Card>
        <Card title="Countries" description="From the edge, no IP stored">
          <BarList items={analytics.countries} total={analytics.totalViews} empty="No countries yet." />
        </Card>
        <Card title="Devices">
          <BarList items={analytics.devices} total={analytics.totalViews} empty="No devices yet." />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Recently edited" description="Projects" className="lg:col-span-2" action={<Link href="/admin/projects" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">All projects <ArrowUpRight size={14} /></Link>}>
          {content.recent.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/[0.1] p-8 text-center">
              <p className="text-sm text-slate-600">No projects yet.</p>
              <Link href="/admin/projects/new" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Create the first one</Link>
            </div>
          ) : (
            <ul className="divide-y divide-black/[0.06]">
              {content.recent.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <Link href={`/admin/projects/${p.id}`} className="font-semibold text-slate-900 hover:text-blue-600">{p.name}</Link>
                    <p className="text-xs text-slate-500">/work/{p.slug} · edited {formatDate(p.updated_at)}</p>
                  </div>
                  {p.is_published ? <Badge tone="success">Published</Badge> : <Badge>Draft</Badge>}
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Content at a glance">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-slate-600"><FolderKanban size={15} /> Projects</span><span className="font-semibold text-slate-900">{content.projects.total}</span></li>
            <li className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-slate-600"><Eye size={15} /> Published</span><span className="font-semibold text-slate-900">{content.projects.published}</span></li>
            <li className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-slate-600"><Images size={15} /> Images</span><span className="font-semibold text-slate-900">{content.images.count}</span></li>
            <li className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-slate-600"><Wrench size={15} /> Technologies rated</span><span className="font-semibold text-slate-900">{content.technologies.rated} / {content.technologies.total}</span></li>
          </ul>
          <div className="mt-6 border-t border-black/[0.06] pt-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Most used technologies</p>
            <div className="mt-3">
              <BarList items={content.technologies.usage} empty="Assign technologies to projects to see this." />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
