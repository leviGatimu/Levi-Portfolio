import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-[1.5rem] border border-black/[0.06] bg-white p-8 shadow-[0_28px_60px_-30px_rgba(15,23,42,0.35)]">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-display text-sm font-bold text-white">LG</span>
        <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight text-slate-900">Admin</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to manage the portfolio.</p>
        <LoginForm notAdmin={error === "not-admin"} />
      </div>
    </div>
  );
}
