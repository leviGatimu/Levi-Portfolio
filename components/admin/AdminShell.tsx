import Link from "next/link";
import { AdminHeader } from "./AdminHeader";
import { AdminNav } from "./AdminNav";

type Props = { children: React.ReactNode; email: string | null; name: string };

export function AdminShell({ children, email, name }: Props) {
  return (
    <div className="min-h-dvh bg-[#f4f4f6] p-2 sm:p-4">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-[1600px] overflow-hidden rounded-[24px] border border-black/[0.06] bg-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)]">
        {/* Sidebar */}
        <aside className="hidden w-[248px] shrink-0 flex-col border-r border-black/[0.06] bg-white px-4 py-6 lg:flex">
          <Link href="/admin" className="px-3">
            <span className="block text-[20px] font-bold tracking-tight text-[#111]">{name.toUpperCase()}</span>
            <span className="block text-[13px] text-[#777]">Portfolio admin</span>
          </Link>
          <div className="mt-8 flex-1 overflow-y-auto">
            <AdminNav />
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col bg-[#f7f7f8]">
          <AdminHeader name={name} email={email} />
          <main className="flex-1 p-4 sm:p-6">
            <div className="mx-auto w-full max-w-[1240px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
