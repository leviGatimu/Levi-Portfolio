import type { SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_SETTINGS } from "@/lib/db/public";
import type { Database, SiteSettingsRow } from "@/types/database";

/** Settings row for the admin, with defaults filled for columns older migrations lack. */
export async function getAdminSettings(supabase: SupabaseClient<Database>): Promise<SiteSettingsRow> {
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", true).single();
  if (error) throw new Error(`site_settings: ${error.message}. Did you run backend/migrations/0001_init.sql?`);
  const row = data as Partial<SiteSettingsRow>;
  return {
    ...DEFAULT_SETTINGS,
    ...row,
    focus_areas: Array.isArray(row.focus_areas) ? row.focus_areas : [],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    journey: Array.isArray(row.journey) ? row.journey : [],
  };
}
