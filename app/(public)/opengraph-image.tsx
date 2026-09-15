import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/db/public";

export const alt = "Levi Gatimu, student developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default async function Image() {
  const s = await getSiteSettings();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#ececec", color: "#0f172a", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 22, letterSpacing: 4, color: "#2563eb" }}>{s.meta_line.toUpperCase()}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 600, lineHeight: 1 }}>{s.display_name}</div>
          <div style={{ fontSize: 34, color: "#475569", marginTop: 28, lineHeight: 1.3, maxWidth: 900 }}>{s.opening_statement}</div>
        </div>
        <div style={{ fontSize: 20, letterSpacing: 3, color: "#64748b" }}>{s.tagline.toUpperCase()}</div>
      </div>
    ),
    size,
  );
}
