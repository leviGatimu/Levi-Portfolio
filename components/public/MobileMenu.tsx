"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { NavLink } from "./Masthead";

export function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const main = document.querySelector("main");
    main?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>("a, button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      main?.removeAttribute("inert");
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="meta text-fg-muted hover:text-fg"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>

      {open ? (
        <div
          id={id}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 top-16 z-20 flex flex-col overflow-y-auto bg-bg px-4 pb-10 pt-4 sm:px-6"
        >
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href} className="border-b border-rule">
                {l.external ? (
                  <a href={l.href} target={l.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" className="flex items-center justify-between py-5 font-mono text-display-md font-medium text-fg" onClick={() => setOpen(false)}>
                    {l.label}
                    <span aria-hidden="true" className="text-fg-subtle">↗</span>
                  </a>
                ) : (
                  <Link href={l.href} className="flex items-center justify-between py-5 font-mono text-display-md font-medium text-fg" onClick={() => setOpen(false)}>
                    {l.label}
                    <span aria-hidden="true" className="text-fg-subtle">→</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <button type="button" onClick={close} className="meta mt-8 self-start text-fg-muted hover:text-fg">
            Close
          </button>
        </div>
      ) : null}
    </div>
  );
}
