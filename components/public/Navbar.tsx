"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

type Props = { name: string };

export default function Navbar({ name }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Work", href: "/work" },
    { label: "Experiments", href: "/experiments" },
    { label: "About", href: "/about" },
    { label: "Journey", href: "/journey" },
    { label: "Skills", href: "/skills" },
    { label: "Now", href: "/now" },
  ];

  return (
    <nav className={`fixed top-0 z-[100] w-full transition-all duration-300 ${scrolled ? "nav-blur py-3" : "bg-transparent py-6"}`} aria-label="Primary">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Logo size={34} name={name} />

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = !link.href.includes("#") && pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-medium transition-all hover:text-slate-900 dark:hover:text-white ${active ? "text-slate-900 dark:text-slate-50" : "text-slate-600 dark:text-slate-300"}`}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
          <Link
            href="/contact"
            className="group flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,0.7)] transition-all hover:bg-blue-500"
          >
            Contact
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button className="p-1 text-slate-900 dark:text-slate-50" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-0 top-full flex w-full flex-col gap-6 border-b border-black/5 bg-white px-6 py-6 shadow-2xl md:hidden dark:border-white/10 dark:bg-slate-900"
          >
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-lg font-semibold text-slate-900 dark:text-slate-50" onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="rounded-2xl bg-blue-600 py-4 text-center font-semibold text-white">
              Contact
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
