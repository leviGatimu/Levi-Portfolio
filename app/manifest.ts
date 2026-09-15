import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Levi Gatimu",
    short_name: "Levi",
    description: "Student developer in Kigali building full-stack software, AI systems and robotics.",
    start_url: "/",
    display: "standalone",
    background_color: "#ececec",
    theme_color: "#2563eb",
    icons: [
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
