import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site py-24 lg:py-40">
      <span className="meta text-fg-subtle">404</span>
      <h1 className="mt-4 font-mono text-display-lg font-medium text-fg">Nothing here.</h1>
      <p className="mt-4 max-w-[40ch] text-fg-muted">That page doesn&apos;t exist, or the project isn&apos;t published.</p>
      <div className="mt-10 flex gap-8">
        <Link href="/work" className="link-accent meta">Work <span aria-hidden="true">→</span></Link>
        <Link href="/" className="meta link-underline text-fg-muted hover:text-fg">Home <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  );
}
