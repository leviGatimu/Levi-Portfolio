"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ExternalLink, LogOut, Plus, Search, Settings2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/lib/actions/auth";
import { AdminMobileNav } from "./AdminNav";

type Props = { name: string; email: string | null };

function useOutsideClose(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  return ref;
}

export function AdminHeader({ name, email }: Props) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const addRef = useOutsideClose(() => setAddOpen(false));
  const userRef = useOutsideClose(() => setUserOpen(false));
  const initials = name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <header className="relative z-30 flex h-[72px] items-center gap-4 border-b border-black/[0.06] bg-white px-4 sm:px-6">
      <div className="lg:hidden">
        <AdminMobileNav />
      </div>

      <form
        role="search"
        className="relative w-full max-w-[360px]"
        onSubmit={(e) => {
          e.preventDefault();
          const q = new FormData(e.currentTarget).get("q");
          router.push(q ? `/admin/projects?q=${encodeURIComponent(String(q))}` : "/admin/projects");
        }}
      >
        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9a9a9a]" />
        <input name="q" type="search" placeholder="Search projects" aria-label="Search projects" className="h-11 w-full rounded-full border border-black/[0.1] bg-white pl-11 pr-4 text-[14px] text-[#111] placeholder:text-[#9a9a9a] focus:border-[#111] focus:outline-none" />
      </form>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div ref={addRef} className="relative">
          <div className="flex overflow-hidden rounded-full bg-[#111] text-white">
            <Link href="/admin/projects/new" className="flex h-11 items-center gap-2 pl-4 pr-3 text-[14px] font-medium hover:bg-black">
              <Plus size={16} /> <span className="hidden sm:inline">Add</span>
            </Link>
            <button type="button" aria-label="More add options" aria-expanded={addOpen} onClick={() => setAddOpen((v) => !v)} className="flex h-11 items-center border-l border-white/20 px-2.5 hover:bg-black">
              <ChevronDown size={16} />
            </button>
          </div>
          {addOpen ? (
            <div role="menu" className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-black/[0.08] bg-white py-1.5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.3)]">
              {[
                { href: "/admin/projects/new", label: "New project" },
                { href: "/admin/skills#add", label: "New skill" },
                { href: "/admin/journey#add", label: "New journey entry" },
              ].map((i) => (
                <Link key={i.href} href={i.href} role="menuitem" onClick={() => setAddOpen(false)} className="block px-4 py-2.5 text-[14px] text-[#111] hover:bg-[#f2f2f4]">{i.label}</Link>
              ))}
            </div>
          ) : null}
        </div>

        <span className="mx-1 hidden h-8 w-px bg-black/[0.08] sm:block" />

        <a href="/" target="_blank" rel="noopener noreferrer" aria-label="View site" title="View site" className="hidden h-11 w-11 items-center justify-center rounded-full border border-black/[0.1] text-[#333] hover:bg-[#f2f2f4] sm:flex">
          <ExternalLink size={17} />
        </a>
        <Link href="/admin/settings" aria-label="Site settings" title="Site settings" className="hidden h-11 w-11 items-center justify-center rounded-full border border-black/[0.1] text-[#333] hover:bg-[#f2f2f4] sm:flex">
          <Settings2 size={17} />
        </Link>

        <span className="mx-1 hidden h-8 w-px bg-black/[0.08] sm:block" />

        <div ref={userRef} className="relative">
          <button type="button" aria-expanded={userOpen} onClick={() => setUserOpen((v) => !v)} className="flex items-center gap-3 rounded-full py-1 pl-1 pr-2 hover:bg-[#f2f2f4]">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111] text-[13px] font-semibold text-white">{initials}</span>
            <span className="hidden text-left sm:block">
              <span className="block text-[14px] font-medium leading-tight text-[#111]">{name}</span>
              <span className="block text-[12px] text-[#8a8a8a]">Admin</span>
            </span>
            <ChevronDown size={16} className="text-[#777]" />
          </button>
          {userOpen ? (
            <div role="menu" className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.3)]">
              <div className="border-b border-black/[0.06] px-4 py-3">
                <p className="text-[13px] font-medium text-[#111]">{name}</p>
                <p className="truncate text-[12px] text-[#8a8a8a]">{email ?? "Signed in"}</p>
              </div>
              <Link href="/admin/profile" role="menuitem" onClick={() => setUserOpen(false)} className="block px-4 py-2.5 text-[14px] text-[#111] hover:bg-[#f2f2f4]">Profile</Link>
              <form action={signOut}>
                <button type="submit" role="menuitem" className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] text-[#111] hover:bg-[#f2f2f4]">
                  <LogOut size={15} /> Log out
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
