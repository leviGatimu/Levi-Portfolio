import { ImageResponse } from "next/og";
import { coverOf, getProjectBySlug, techsOf } from "@/lib/db/public";
import { mediaUrl } from "@/lib/supabase/env";

export const alt = "Project by Levi Gatimu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  const project = result?.project;
  const cover = project ? coverOf(project) : null;
  const stack = project ? techsOf(project).slice(0, 4).map((t) => t.name).join(" · ") : "";
  const titleSize = project && project.name.length > 14 ? 56 : 72;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ececec", color: "#0f172a", fontFamily: "sans-serif", position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: cover ? "58%" : "100%" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 20, letterSpacing: 3, color: "#2563eb" }}>LEVI GATIMU · WORK</div>
            <div style={{ fontSize: titleSize, fontWeight: 600, marginTop: 28, lineHeight: 1.05 }}>{project?.name ?? "Work"}</div>
            <div style={{ fontSize: 26, color: "#475569", marginTop: 24, lineHeight: 1.35 }}>{project?.one_liner ?? ""}</div>
          </div>
          <div style={{ fontSize: 18, letterSpacing: 2, color: "#64748b" }}>{stack.toUpperCase()}</div>
        </div>
        {cover ? (
          <div style={{ position: "absolute", right: -40, top: 90, width: 560, height: 600, display: "flex", borderRadius: 28, overflow: "hidden", background: "#ffffff", border: "1px solid rgba(0,0,0,0.06)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
            <img src={mediaUrl(cover.storage_path)} alt="" width={560} height={600} style={{ objectFit: "cover", objectPosition: "left top" }} />
          </div>
        ) : null}
      </div>
    ),
    size,
  );
}
