import Link from "next/link";
import { Mail } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export type NavLink = { href: string; label: string; external?: boolean };

const NAV: NavLink[] = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

type Props = {
  displayName: string;
  email: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
};

export function Masthead({ displayName, email, githubUrl, linkedinUrl }: Props) {
  const [first, ...rest] = displayName.split(" ");
  const socials: NavLink[] = [
    ...(githubUrl ? [{ href: githubUrl, label: "GitHub", external: true }] : []),
    ...(linkedinUrl ? [{ href: linkedinUrl, label: "LinkedIn", external: true }] : []),
  ];

  return (
    <header className="sticky top-0 z-10 bg-bg/95 backdrop-blur-[2px]">
      <div className="container-site flex h-16 items-center justify-between gap-6">
        <Link href="/" className="font-mono text-[0.9375rem] tracking-tight text-fg" aria-label={`${displayName}, home`}>
          <span className="font-semibold">{first}</span>
          {rest.length ? <span className="font-normal text-fg-muted"> {rest.join(" ")}</span> : null}
        </Link>

        <NavLinks links={NAV} />

        <div className="hidden items-center gap-6 lg:flex">
          {socials.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="meta text-fg-muted transition-colors duration-150 hover:text-fg">
              {s.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
          <a
            href={`mailto:${email}`}
            className="flex h-8 w-8 items-center justify-center rounded-[3px] bg-accent text-accent-ink transition-opacity duration-150 hover:opacity-85"
            aria-label={`Email ${displayName}`}
          >
            <Mail size={14} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </div>

        <MobileMenu links={[...NAV, ...socials, { href: `mailto:${email}`, label: "Email", external: true }]} />
      </div>
      <div className="h-px w-full bg-rule" />
    </header>
  );
}
