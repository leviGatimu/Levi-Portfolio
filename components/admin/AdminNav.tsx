"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Compass,
  FolderKanban,
  Home,
  Images,
  LayoutDashboard,
  Mail,
  Menu,
  Radio,
  Route,
  Settings2,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/skills", label: "Skills", icon: Wrench },
      { href: "/admin/journey", label: "Journey", icon: Route },
      { href: "/admin/media", label: "Media", icon: Images },
    ],
  },
  {
    label: "Pages",
    items: [
      { href: "/admin/pages/home", label: "Home", icon: Home },
      { href: "/admin/pages/about", label: "About", icon: BookOpen },
      { href: "/admin/pages/now", label: "Now", icon: Radio },
      { href: "/admin/pages/contact", label: "Contact", icon: Mail },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/profile", label: "Profile", icon: UserRound },
      { href: "/admin/settings", label: "Site settings", icon: Settings2 },
    ],
  },
];

export function findNavLabel(pathname: string): string {
  for (const g of NAV_GROUPS) for (const i of g.items) if (i.exact ? pathname === i.href : pathname.startsWith(i.href)) return i.label;
  return "Admin";
}

function useActive() {
  const pathname = usePathname();
  return (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));
}

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const isActive = useActive();
  return (
    <nav aria-label="Admin" className="flex flex-col gap-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-3 text-[12px] font-medium text-[#8a8a8a]">{group.label}</p>
          <ul className="mt-2 flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-full px-3 py-2.5 text-[14px] transition-colors",
                      active ? "bg-[#111] font-medium text-white" : "text-[#333] hover:bg-[#f2f2f4]",
                    )}
                  >
                    <Icon size={18} strokeWidth={1.8} className={active ? "text-white" : "text-[#333]"} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div>
        <p className="px-3 text-[12px] font-medium text-[#8a8a8a]">Help</p>
        <ul className="mt-2">
          <li>
            <a href="https://github.com/leviGatimu/Levi-Portfolio/blob/main/README.md" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-full px-3 py-2.5 text-[14px] text-[#333] hover:bg-[#f2f2f4]">
              <Compass size={18} strokeWidth={1.8} /> Documentation
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.1] bg-white text-[#333]">
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-40 max-h-[80vh] w-full overflow-y-auto border-b border-black/[0.07] bg-white p-4 shadow-xl lg:hidden">
          <AdminNav onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </>
  );
}
