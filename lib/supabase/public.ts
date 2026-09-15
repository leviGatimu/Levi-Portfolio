import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

/**
 * Cookie-less client for public pages. Reads only what RLS exposes to anonymous
 * visitors (published rows). Never used for writes.
 */
export function createPublicClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
