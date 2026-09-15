"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

/** Best-effort default logo slugs for common technology names (Simple Icons). */
const GUESS: Record<string, string> = {
  typescript: "typescript", javascript: "javascript", php: "php", python: "python", "c#": "dotnet", csharp: "dotnet", c: "c", "c++": "cplusplus",
  react: "react", "next.js": "nextdotjs", nextjs: "nextdotjs", "tailwind css": "tailwindcss", tailwind: "tailwindcss", "framer motion": "framer",
  gsap: "gsap", "three.js": "threedotjs", "node.js": "nodedotjs", nodejs: "nodedotjs", express: "express", fastapi: "fastapi", laravel: "laravel",
  ".net": "dotnet", postgresql: "postgresql", postgres: "postgresql", supabase: "supabase", prisma: "prisma", sqlite: "sqlite", mysql: "mysql",
  mongodb: "mongodb", opencv: "opencv", "raspberry pi": "raspberrypi", ros: "ros", arduino: "arduino", electron: "electron", git: "git",
  "git & github": "github", github: "github", vercel: "vercel", docker: "docker", figma: "figma", flutter: "flutter", vite: "vite", firebase: "firebase",
  html: "html5", css: "css", sass: "sass", redis: "redis", linux: "linux", "maplibre gl": "maplibre", "deck.gl": "deckgl", stripe: "stripe",
};

export function logoUrl(name: string, icon: string | null | undefined): string | null {
  const key = (icon ?? "").trim() || GUESS[name.trim().toLowerCase()] || "";
  if (!key) return null;
  if (/^https?:\/\//.test(key)) return key;
  return `https://cdn.simpleicons.org/${encodeURIComponent(key)}`;
}

type Props = {
  name: string;
  icon?: string | null;
  size?: number;
  className?: string;
  /** Render the brand colour (default) or a single colour, e.g. "white" for dark panels. */
  color?: string;
  withLabel?: boolean;
};

/** A technology logo with an initials fallback when no logo can be loaded. */
export function TechLogo({ name, icon, size = 28, className, color, withLabel = false }: Props) {
  const [failed, setFailed] = useState(false);
  const base = logoUrl(name, icon);
  const src = base && color && base.includes("simpleicons.org") ? `${base}/${encodeURIComponent(color)}` : base;
  const initials = name
    .replace(/[^a-zA-Z0-9 .#+]/g, "")
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const mark =
    src && !failed ? (
      // eslint-disable-next-line @next/next/no-img-element -- third-party SVG marks, not optimisable
      <img src={src} alt={withLabel ? "" : name} title={name} width={size} height={size} loading="lazy" decoding="async" onError={() => setFailed(true)} style={{ width: size, height: size }} className="object-contain" />
    ) : (
      <span aria-label={withLabel ? undefined : name} title={name} style={{ width: size, height: size, fontSize: Math.max(9, size * 0.36) }} className="flex items-center justify-center rounded-lg bg-slate-900 font-display font-bold text-white">
        {initials}
      </span>
    );

  if (!withLabel) return <span className={cn("inline-flex items-center justify-center", className)}>{mark}</span>;
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {mark}
      <span>{name}</span>
    </span>
  );
}
