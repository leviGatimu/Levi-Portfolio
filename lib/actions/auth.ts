"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ActionResult } from "./types";

const credentials = z.object({ email: z.string().trim().email(), password: z.string().min(1) });

// Best-effort brute-force slowdown; Supabase Auth has its own rate limits as the real control.
const attempts = new Map<string, { count: number; until: number }>();

export async function signIn(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const parsed = credentials.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { ok: false, message: "Email or password is incorrect." };

  const key = parsed.data.email.toLowerCase();
  const now = Date.now();
  const entry = attempts.get(key);
  if (entry && entry.until > now) return { ok: false, message: "Too many attempts. Try again in a few minutes." };

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    const count = (entry?.count ?? 0) + 1;
    attempts.set(key, { count, until: count >= 5 ? now + 15 * 60_000 : 0 });
    return { ok: false, message: "Email or password is incorrect." };
  }
  attempts.delete(key);
  redirect("/admin/projects");
}

export async function signOut(): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
