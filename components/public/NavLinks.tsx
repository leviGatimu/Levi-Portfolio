"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { NavLink } from "./Masthead";

export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
      {links.map((item) => {
        const active = !item.href.includes("#") && pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn("meta transition-colors duration-150", active ? "text-accent" : "text-fg-muted hover:text-fg")}
          >
            {active ? <span aria-hidden="true">‹ </span> : null}
            {item.label}
            {active ? <span aria-hidden="true"> ›</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
