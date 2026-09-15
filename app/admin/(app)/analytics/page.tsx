import Link from "next/link";
import { BarChart3, Eye, Globe, MonitorSmartphone } from "lucide-react";
import { AreaChart, BarList, StatTile } from "@/components/admin/charts";
import { Breadcrumbs, Card, PageHeader } from "@/components/admin/ui";
import { getAnalytics } from "@/lib/db/admin";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { cn } from "@/lib/utils/cn";

export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90] as const;

function pct(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range } = await searchParams;
  const days = (RANGES as readonly number[]).includes(Number(range)) ? Number(range) : 30;
  const { supabase } = await requireAdmin();
  const a = await getAnalytics(supabase, days);
  const avg = a.daily.length ? Math.round(a.totalViews / a.daily.length) : 0;
  const best = a.daily.reduce((m, d) => (d.views > m.views ? d : m), { day: "", views: 0 });

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs items={[{ label: "Analytics" }]} />
      <PageHeader
        title="Analytics"
        description="Page views collected by the site itself: path, referring site, country and device class. No cookies, no IP addresses."
        action={
          <nav aria-label="Range" className="flex rounded-full border border-slate-200 bg-white p-1">
            {RANGES.map((r) => (
              <Link key={r} href={`/admin/analytics?range=${r}`} aria-current={days === r ? "page" : undefined} className={cn("rounded-full px-4 py-2 text-[13px] font-medium", days === r ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50")}>
                {r} days
              </Link>
            ))}
          </nav>
        }
      />

      {!a.available ? <Card><p className="text-[13px] text-slate-600">Run backend/migrations/0006_analytics_and_journey.sql to enable analytics.</p></Card> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label={`Views, ${days} days`} value={a.totalViews} delta={pct(a.totalViews, a.previousViews)} icon={<Eye size={17} />} />
        <StatTile label="Average per day" value={avg} hint={`Previous period: ${a.previousViews.toLocaleString()}`} icon={<BarChart3 size={17} />} />
        <StatTile label="Best day" value={best.views} hint={best.day || "No views yet"} icon={<BarChart3 size={17} />} />
        <StatTile label="Today" value={a.todayViews} hint="UTC day" icon={<Eye size={17} />} />
      </div>

      <Card title="Views per day" icon={<BarChart3 size={18} />}><AreaChart data={a.daily} /></Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Pages" subtitle="Most viewed paths" icon={<Eye size={18} />}><BarList items={a.topPages} total={a.totalViews} empty="No visits recorded yet." /></Card>
        <Card title="Referrers" subtitle="Where visitors arrived from" icon={<Globe size={18} />}><BarList items={a.referrers} total={a.totalViews} empty="No referrers yet." /></Card>
        <Card title="Countries" subtitle="From the Vercel edge header" icon={<Globe size={18} />}><BarList items={a.countries} total={a.totalViews} empty="No countries yet (only on Vercel)." /></Card>
        <Card title="Devices" icon={<MonitorSmartphone size={18} />}><BarList items={a.devices} total={a.totalViews} empty="No devices yet." /></Card>
      </div>
    </div>
  );
}
