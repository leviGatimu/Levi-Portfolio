import Link from "next/link";
import { signOut } from "@/lib/actions/auth";
import { AdminNav } from "./AdminNav";

export function AdminShell({ children, email }: { children: React.ReactNode; email: string | null }) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="flex w-full shrink-0 flex-col gap-6 border-b border-rule bg-bg-raised px-5 py-5 lg:sticky lg:top-0 lg:h-dvh lg:w-60 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
        <div>
          <Link href="/admin/projects" className="font-mono text-[0.9375rem] text-fg">
            <span className="font-semibold">Levi</span> <span className="text-fg-muted">Gatimu</span>
          </Link>
          <p className="meta mt-1 text-fg-subtle">Admin</p>
        </div>
        <AdminNav />
        <div className="mt-auto flex flex-col gap-3 border-t border-rule pt-5">
          <a href="/" target="_blank" rel="noopener noreferrer" className="meta w-fit text-fg-muted hover:text-fg">
            View site <span aria-hidden="true">↗</span>
          </a>
          {email ? <p className="truncate text-xs text-fg-subtle" title={email}>{email}</p> : null}
          <form action={signOut}>
            <button type="submit" className="meta text-fg-muted hover:text-fg">Log out</button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="mx-auto w-full max-w-[960px]">{children}</div>
      </main>
    </div>
  );
}
