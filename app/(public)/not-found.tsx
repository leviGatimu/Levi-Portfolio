import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative px-6 pb-32 pt-48">
      <div className="grain" />
      <div className="mx-auto max-w-3xl text-center">
        <span className="eyebrow">404</span>
        <h1 className="mt-5 font-display text-6xl font-semibold leading-[0.9] tracking-tight text-slate-900 md:text-8xl dark:text-slate-50">
          Nothing <span className="text-blue-600 dark:text-blue-400">here.</span>
        </h1>
        <p className="mx-auto mt-7 max-w-md text-xl leading-relaxed text-slate-500 dark:text-slate-400">That page doesn&apos;t exist, or the project isn&apos;t published yet.</p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/work" className="btn-dark"><span className="relative z-10">See the work</span></Link>
          <Link href="/" className="btn-light"><ArrowLeft size={18} /> Home</Link>
        </div>
      </div>
    </div>
  );
}
