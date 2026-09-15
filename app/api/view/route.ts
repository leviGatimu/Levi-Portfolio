import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

export const runtime = "nodejs";

/**
 * Cookieless page-view beacon. Stores path, referrer host, country (from the
 * edge header) and device class. No IP, no user agent string, no identifiers.
 */
export async function POST(request: NextRequest) {
  let body: { path?: unknown; referrer?: unknown } = {};
  try {
    body = (await request.json()) as { path?: unknown; referrer?: unknown };
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const path = typeof body.path === "string" ? body.path.slice(0, 200) : "";
  if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) return NextResponse.json({ ok: false }, { status: 400 });

  let referrer: string | null = null;
  if (typeof body.referrer === "string" && body.referrer) {
    try {
      const host = new URL(body.referrer).hostname.replace(/^www\./, "");
      const self = request.nextUrl.hostname.replace(/^www\./, "");
      referrer = host && host !== self ? host : null;
    } catch {
      referrer = null;
    }
  }

  const ua = request.headers.get("user-agent") ?? "";
  const device = /ipad|tablet/i.test(ua) ? "tablet" : /mobi|android|iphone/i.test(ua) ? "mobile" : "desktop";
  const country = request.headers.get("x-vercel-ip-country");

  const supabase = createPublicClient();
  const { error } = await supabase.rpc("record_page_view", { p_path: path, p_referrer: referrer, p_country: country, p_device: device });
  if (error) return NextResponse.json({ ok: false }, { status: 202 });
  return NextResponse.json({ ok: true });
}
