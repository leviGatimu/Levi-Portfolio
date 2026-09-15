"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";

type Props = { children: React.ReactNode; className?: string; delay?: number; as?: "div" | "section" | "li" };

/**
 * Below-fold reveal. Server-renders visible; only after hydration (and only if
 * motion is allowed) does it hide and then reveal on intersection. No JS = visible.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return; // already on screen: never hide it
    el.dataset.reveal = "pending";
    el.style.transitionDelay = `${delay}ms`;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            delete el.dataset.reveal;
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    // Safety net: never leave content hidden if the observer does not fire.
    const fallback = setTimeout(() => {
      delete el.dataset.reveal;
      io.disconnect();
    }, 2000);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, [delay]);

  return (
    // @ts-expect-error dynamic tag with a shared ref
    <Tag ref={ref} className={cn("reveal", className)}>
      {children}
    </Tag>
  );
}
