"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const ITEMS = [
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/technologies", label: "Technologies" },
  { href: "/admin/site", label: "Site" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 lg:flex-col">
      {ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-[4px] px-3 py-2 font-mono text-[0.8125rem] transition-colors",
              active ? "bg-bg-sunken text-fg" : "text-fg-muted hover:bg-bg-sunken/60 hover:text-fg",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
