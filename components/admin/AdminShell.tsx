import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/actions/auth";
import { AdminNav, AdminMobileNav } from "./AdminNav";

type Props = { children: React.ReactNode; email: string | null; name: string };

export function AdminShell({ children, email, name }: Props) {
  const initials = name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-dvh">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-black/[0.06] bg-white px-4 py-6 lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-display text-sm font-bold text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,0.7)]">{initials}</span>
          <span>
            <span className="block font-display text-base font-semibold leading-tight text-slate-900">{name}</span>
            <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Admin</span>
          </span>
        </Link>
        <div className="mt-8 flex-1">
          <AdminNav />
        </div>
        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Signed in</p>
          <p className="mt-1 truncate text-sm font-medium text-slate-700" title={email ?? ""}>{email ?? "Admin"}</p>
          <form action={signOut} className="mt-3">
            <button type="submit" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
              <LogOut size={15} /> Log out
            </button>
          </form>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-black/[0.06] bg-white/80 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
          <div className="flex items-center gap-3 lg:hidden">
            <Link href="/admin" className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-display text-xs font-bold text-white">{initials}</Link>
            <AdminMobileNav />
          </div>
          <p className="hidden text-sm text-slate-500 lg:block">
            Manage the portfolio. Changes appear on the site within seconds of saving.
          </p>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              View site <ExternalLink size={14} />
            </a>
            <Link href="/admin/projects/new" className="inline-flex h-9 items-center gap-2 rounded-xl bg-blue-600 px-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,0.6)] hover:bg-blue-500">
              + New project
            </Link>
          </div>
        </header>
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-[1180px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
