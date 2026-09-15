import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export const dynamic = "force-dynamic";

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const { email, supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("display_name").eq("id", true).maybeSingle();
  return <AdminShell email={email} name={data?.display_name ?? "Levi Gatimu"}>{children}</AdminShell>;
}
