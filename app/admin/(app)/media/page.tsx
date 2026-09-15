import Image from "next/image";
import Link from "next/link";
import { Images, UserRound } from "lucide-react";
import { Badge, Breadcrumbs, Card, PageHeader } from "@/components/admin/ui";
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
    <div className="flex flex-col gap-5">
      <Breadcrumbs items={[{ label: "Content", href: "/admin/projects" }, { label: "Media" }]} />
      <PageHeader title="Media" description={`${rows.length} project image${rows.length === 1 ? "" : "s"}, ${(totalBytes / 1024 / 1024).toFixed(1)} MB. Upload and edit images inside each project; this is the overview.`} />

      <Card title="Portraits" subtitle="Managed under Profile" icon={<UserRound size={18} />}>
        <div className="flex flex-wrap gap-4">
          {[settings?.portrait_home_path, settings?.portrait_about_path].map((p, i) => (
            <div key={i} className="w-36">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f2f2f4]">
                <Image src={p ? mediaUrl(p) : "/portrait.png"} alt={settings?.portrait_alt ?? ""} fill sizes="144px" className="object-cover" />
              </div>
              <p className="mt-2 text-[12px] font-medium text-[#555]">{i === 0 ? "Home" : "About"}{p ? "" : " (bundled)"}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Project images" icon={<Images size={18} />}>
        {rows.length === 0 ? (
          <p className="text-[13px] text-[#555]">No images yet. Open a project and upload screenshots there.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {rows.map((img) => (
              <li key={img.id} className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
                <div className="relative aspect-[16/10] bg-[#f2f2f4]">
                  <Image src={mediaUrl(img.storage_path)} alt={img.alt} fill sizes="320px" className="object-cover object-top" />
                  {img.is_cover ? <span className="absolute left-2 top-2"><Badge tone="accent">Cover</Badge></span> : null}
                </div>
                <div className="p-3">
                  <p className="truncate text-[13px] font-medium text-[#111]" title={img.alt}>{img.alt}</p>
                  <p className="mt-0.5 text-[12px] text-[#8a8a8a]">{img.width}x{img.height} · {(img.bytes / 1024).toFixed(0)} KB · {formatDate(img.created_at)}</p>
                  {img.projects ? <Link href={`/admin/projects/${img.projects.id}`} className="mt-2 inline-block text-[12px] font-medium text-[#111] underline-offset-2 hover:underline">{img.projects.name}</Link> : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
