import Link from "next/link";
import { AdminHeader } from "./AdminHeader";
import { AdminNav } from "./AdminNav";

type Props = { children: React.ReactNode; email: string | null; name: string };

export function AdminShell({ children, email, name }: Props) {
  const initials = name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase();
  return (
    <div className="min-h-dvh bg-[#f5f7fb]">
      <div className="flex min-h-dvh">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-[256px] shrink-0 flex-col border-r border-slate-200/80 bg-white px-4 py-6 lg:flex">
          <Link href="/admin" className="px-3">
            <span className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-[12px] font-bold text-white">{initials}</span><span className="text-[17px] font-bold tracking-tight text-slate-900">{name}</span></span>
            <span className="mt-1 block pl-[46px] text-[12px] text-slate-400">Portfolio admin</span>
          </Link>
          <div className="mt-8 flex-1 overflow-y-auto">
            <AdminNav />
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader name={name} email={email} />
          <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto w-full max-w-[1200px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
