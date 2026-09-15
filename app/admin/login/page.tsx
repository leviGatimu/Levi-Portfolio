import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#f4f4f6] px-4">
      <div className="w-full max-w-sm rounded-[24px] border border-black/[0.07] bg-white p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)]">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111] text-[13px] font-semibold text-white">LG</span>
        <h1 className="mt-6 text-[22px] font-semibold tracking-tight text-[#111]">Admin</h1>
        <p className="mt-1 text-[13px] text-[#777]">Sign in to manage the portfolio.</p>
        <LoginForm notAdmin={error === "not-admin"} />
      </div>
    </div>
  );
}
