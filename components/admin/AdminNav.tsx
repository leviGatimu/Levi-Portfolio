"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FolderKanban, Images, LayoutDashboard, Menu, Settings, Wrench, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/technologies", label: "Technologies", icon: Wrench },
  { href: "/admin/site", label: "Site settings", icon: Settings },
];

function useActive() {
  const pathname = usePathname();
  return (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));
}

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const isActive = useActive();
  return (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {ITEMS.map((item) => {
        const active = isActive(item.href, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
              active ? "bg-blue-600 text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.7)]" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <Icon size={17} strokeWidth={2.2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.08] bg-white text-slate-700">
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      {open ? (
        <div className="absolute left-0 top-16 z-40 w-full border-b border-black/[0.06] bg-white p-4 shadow-2xl lg:hidden">
          <AdminNav onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </>
  );
}
