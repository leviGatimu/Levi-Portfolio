import Image from "next/image";
import Link from "next/link";
import { Badge, Card, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { mediaUrl } from "@/lib/supabase/env";
import { formatDate } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const { supabase } = await requireAdmin();
  const [{ data: images }, { data: settings }] = await Promise.all([
    supabase.from("project_images").select("*, projects(id, name, slug)").order("created_at", { ascending: false }),
    supabase.from("site_settings").select("portrait_home_path, portrait_about_path, portrait_alt").eq("id", true).maybeSingle(),
  ]);
  const rows = (images ?? []) as Array<{ id: string; storage_path: string; alt: string; width: number; height: number; bytes: number; is_cover: boolean; created_at: string; projects: { id: string; name: string; slug: string } | null }>;
  const totalBytes = rows.reduce((s, r) => s + (r.bytes ?? 0), 0);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Library" title="Media" description={`${rows.length} project image${rows.length === 1 ? "" : "s"} · ${(totalBytes / 1024 / 1024).toFixed(1)} MB. Images are uploaded and edited inside each project; this is the overview.`} />

      <Card title="Portraits" description="Managed under Site settings.">
        <div className="flex flex-wrap gap-4">
          {[settings?.portrait_home_path, settings?.portrait_about_path].map((p, i) =>
            p ? (
              <div key={p} className="w-40">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
                  <Image src={mediaUrl(p)} alt={settings?.portrait_alt ?? ""} fill sizes="160px" className="object-cover" />
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-600">{i === 0 ? "Home" : "About"}</p>
              </div>
            ) : (
              <div key={i} className="flex h-40 w-40 items-center justify-center rounded-2xl border border-dashed border-black/[0.12] text-center text-xs text-slate-500">
                {i === 0 ? "Home portrait" : "About portrait"}<br />not uploaded
              </div>
            ),
          )}
        </div>
      </Card>

      <Card title="Project images">
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">No images yet. Open a project and upload screenshots there.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {rows.map((img) => (
              <li key={img.id} className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
                <div className="relative aspect-[16/10] bg-slate-100">
                  <Image src={mediaUrl(img.storage_path)} alt={img.alt} fill sizes="320px" className="object-cover object-top" />
                  {img.is_cover ? <span className="absolute left-2 top-2"><Badge tone="accent">Cover</Badge></span> : null}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-semibold text-slate-900" title={img.alt}>{img.alt}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{img.width}×{img.height} · {(img.bytes / 1024).toFixed(0)} KB · {formatDate(img.created_at)}</p>
                  {img.projects ? (
                    <Link href={`/admin/projects/${img.projects.id}`} className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:underline">{img.projects.name} →</Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
