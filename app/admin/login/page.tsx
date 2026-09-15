import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="font-mono text-[0.9375rem] text-fg">
          <span className="font-semibold">Levi</span> <span className="text-fg-muted">Gatimu</span>
        </p>
        <h1 className="mt-6 font-mono text-display-md font-medium text-fg">Admin</h1>
        <LoginForm notAdmin={error === "not-admin"} />
      </div>
    </div>
  );
}
