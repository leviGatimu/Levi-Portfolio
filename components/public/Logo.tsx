import Link from "next/link";

type Props = { size?: number; withText?: boolean; textClassName?: string; href?: string; name?: string };

/** Brand mark: blue rounded square with the initials, plus the wordmark. */
export default function Logo({ size = 36, withText = true, textClassName, href = "/", name = "Levi Gatimu" }: Props) {
  const initials = name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase();
  const content = (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="flex items-center justify-center rounded-xl bg-blue-600 font-display font-bold text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,0.7)]"
        style={{ width: size, height: size, fontSize: size * 0.42 }}
        aria-hidden="true"
      >
        {initials}
      </span>
      {withText ? (
        <span className={textClassName ?? "font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"}>{name}</span>
      ) : null}
    </span>
  );
  if (!href) return content;
  return (
    <Link href={href} className="inline-flex items-center" aria-label={`${name}, home`}>
      {content}
    </Link>
  );
}
