import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, PageViewRow } from "@/types/database";

type Client = SupabaseClient<Database>;

export type DailyPoint = { day: string; views: number };
export type Ranked = { label: string; value: number };

export type Analytics = {
  rangeDays: number;
  totalViews: number;
  previousViews: number;
  todayViews: number;
  daily: DailyPoint[];
  topPages: Ranked[];
  referrers: Ranked[];
  countries: Ranked[];
  devices: Ranked[];
  available: boolean; // false when migration 0006 has not been run yet
};

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

function rank(rows: PageViewRow[], key: (r: PageViewRow) => string | null, limit = 8): Ranked[] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const k = key(r);
    if (!k) continue;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/** Views for the last `days` days plus the same window before it, aggregated in memory (small tables). */
export async function getAnalytics(supabase: Client, days = 30): Promise<Analytics> {
  const now = new Date();
  const since = new Date(now);
  since.setUTCDate(since.getUTCDate() - (days - 1));
  since.setUTCHours(0, 0, 0, 0);
  const previousSince = new Date(since);
  previousSince.setUTCDate(previousSince.getUTCDate() - days);

  const { data, error } = await supabase
    .from("page_views")
    .select("*")
    .gte("viewed_at", previousSince.toISOString())
    .order("viewed_at", { ascending: false })
    .limit(20000);

  if (error) {
    return { rangeDays: days, totalViews: 0, previousViews: 0, todayViews: 0, daily: [], topPages: [], referrers: [], countries: [], devices: [], available: false };
  }

  const rows = (data ?? []) as PageViewRow[];
  const current = rows.filter((r) => new Date(r.viewed_at) >= since);
  const previous = rows.filter((r) => new Date(r.viewed_at) < since);

  const byDay = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setUTCDate(d.getUTCDate() + i);
    byDay.set(isoDay(d), 0);
  }
  for (const r of current) {
    const k = isoDay(new Date(r.viewed_at));
    if (byDay.has(k)) byDay.set(k, (byDay.get(k) ?? 0) + 1);
  }
  const today = isoDay(now);

  return {
    rangeDays: days,
    totalViews: current.length,
    previousViews: previous.length,
    todayViews: byDay.get(today) ?? 0,
    daily: [...byDay.entries()].map(([day, views]) => ({ day, views })),
    topPages: rank(current, (r) => r.path),
    referrers: rank(current, (r) => r.referrer ?? "Direct / none"),
    countries: rank(current, (r) => r.country),
    devices: rank(current, (r) => r.device, 3),
    available: true,
  };
}

export type ContentStats = {
  projects: { total: number; published: number; drafts: number; featured: number; byType: Ranked[]; byStatus: Ranked[]; byYear: Ranked[] };
  images: { count: number; bytes: number };
  technologies: { total: number; rated: number; usage: Ranked[] };
  recent: { id: string; name: string; slug: string; is_published: boolean; updated_at: string }[];
};

export async function getContentStats(supabase: Client): Promise<ContentStats> {
  const [{ data: projects }, { data: images }, { data: techs }, { data: links }] = await Promise.all([
    supabase.from("projects").select("id, name, slug, type, status, year, is_published, is_featured, updated_at").order("updated_at", { ascending: false }),
    supabase.from("project_images").select("bytes"),
    supabase.from("technologies").select("id, name, proficiency"),
    supabase.from("project_technologies").select("technology_id"),
  ]);
  const ps = projects ?? [];
  const count = <T,>(items: T[], key: (i: T) => string): Ranked[] => {
    const m = new Map<string, number>();
    for (const i of items) m.set(key(i), (m.get(key(i)) ?? 0) + 1);
    return [...m.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  };
  const usageMap = new Map<string, number>();
  for (const l of links ?? []) usageMap.set(l.technology_id, (usageMap.get(l.technology_id) ?? 0) + 1);
  const usage = (techs ?? [])
    .map((t) => ({ label: t.name, value: usageMap.get(t.id) ?? 0 }))
    .filter((t) => t.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return {
    projects: {
      total: ps.length,
      published: ps.filter((p) => p.is_published).length,
      drafts: ps.filter((p) => !p.is_published).length,
      featured: ps.filter((p) => p.is_featured).length,
      byType: count(ps, (p) => p.type),
      byStatus: count(ps, (p) => p.status),
      byYear: count(ps, (p) => String(p.year)).sort((a, b) => a.label.localeCompare(b.label)),
    },
    images: { count: (images ?? []).length, bytes: (images ?? []).reduce((s, i) => s + (i.bytes ?? 0), 0) },
    technologies: { total: (techs ?? []).length, rated: (techs ?? []).filter((t) => t.proficiency).length, usage },
    recent: ps.slice(0, 6).map((p) => ({ id: p.id, name: p.name, slug: p.slug, is_published: p.is_published, updated_at: p.updated_at })),
  };
}
