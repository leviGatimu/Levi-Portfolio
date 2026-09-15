import Link from "next/link";
import { AreaChart, BarList, StatTile } from "@/components/admin/charts";
import { Card, PageHeader } from "@/components/admin/ui";
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
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Traffic"
        title="Analytics"
        description="Page views collected by the site itself: path, referring site, country and device class. No cookies, no IP addresses, no identifiers."
        action={
          <nav aria-label="Range" className="flex rounded-xl border border-black/[0.08] bg-white p-1">
            {RANGES.map((r) => (
              <Link key={r} href={`/admin/analytics?range=${r}`} aria-current={days === r ? "page" : undefined} className={cn("rounded-lg px-3.5 py-1.5 text-sm font-semibold", days === r ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100")}>
                {r} days
              </Link>
            ))}
          </nav>
        }
      />

      {!a.available ? (
        <Card>
          <p className="text-sm text-slate-600">Run <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">backend/migrations/0006_analytics_and_journey.sql</code> to enable analytics.</p>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label={`Views, ${days} days`} value={a.totalViews} delta={pct(a.totalViews, a.previousViews)} />
        <StatTile label="Average per day" value={avg} hint={`Previous period: ${a.previousViews.toLocaleString()} views`} />
        <StatTile label="Best day" value={best.views} hint={best.day ? best.day : "No views yet"} />
        <StatTile label="Today" value={a.todayViews} hint="UTC day" />
      </div>

      <Card title="Views per day">
        <AreaChart data={a.daily} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Pages" description="Most viewed paths"><BarList items={a.topPages} total={a.totalViews} empty="No visits recorded yet." /></Card>
        <Card title="Referrers" description="Where visitors arrived from"><BarList items={a.referrers} total={a.totalViews} empty="No referrers yet." /></Card>
        <Card title="Countries" description="From the Vercel edge header"><BarList items={a.countries} total={a.totalViews} empty="No countries yet (only populated on Vercel)." /></Card>
        <Card title="Devices"><BarList items={a.devices} total={a.totalViews} empty="No devices yet." /></Card>
      </div>
    </div>
  );
}
