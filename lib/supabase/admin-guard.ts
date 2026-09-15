import { redirect } from "next/navigation";
import { createServerSupabase } from "./server";

export type AdminSession = {
  supabase: Awaited<ReturnType<typeof createServerSupabase>>;
  userId: string;
  email: string | null;
};

/**
 * The security boundary for everything under /admin and every write action.
 * proxy.ts only redirects for convenience; this check (plus RLS) is what matters.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=not-admin");
  }
  return { supabase, userId: user.id, email: user.email ?? null };
}
