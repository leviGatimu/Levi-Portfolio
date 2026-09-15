"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import ScrollReveal from "./ScrollReveal";

export type GalleryImage = { id: string; src: string; alt: string; caption: string | null; width: number; height: number };

/** Thumbnail grid; click opens a full-screen viewer with left/right arrows, keyboard and swipe. */
export function Gallery({ images, title = "Gallery" }: { images: GalleryImage[]; title?: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;
  const current = open ? images[index] : undefined;

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? null : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  if (images.length === 0) return null;

  return (
    <section className="px-6 pb-16" aria-label={title}>
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">{title}</span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl dark:text-slate-50">
              {images.length} {images.length === 1 ? "screenshot" : "screenshots"}
            </h2>
          </div>
          <p className="hidden text-sm text-slate-500 sm:block dark:text-slate-400">Click any image to view it full screen.</p>
        </ScrollReveal>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <li key={img.id}>
              <ScrollReveal delay={(i % 3) * 0.06}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className="group relative block w-full overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white p-2 text-left shadow-[0_28px_60px_-34px_rgba(15,23,42,0.3)] transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-slate-900"
                  aria-label={`Open image ${i + 1} of ${images.length}: ${img.alt}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[1.1rem] bg-slate-100 dark:bg-slate-800">
                    <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
                    <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                      <Maximize2 size={15} />
                    </span>
                  </div>
                  {img.caption ? <p className="px-2 pb-1 pt-3 text-sm text-slate-500 dark:text-slate-400">{img.caption}</p> : null}
                </button>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {open && current ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex flex-col bg-slate-950/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`${title}, image ${index + 1} of ${images.length}`}
            onClick={close}
          >
            <div className="flex items-center justify-between px-5 py-4 text-white/80" onClick={(e) => e.stopPropagation()}>
              <span className="text-sm font-medium tabular-nums">{index + 1} / {images.length}</span>
              <button type="button" onClick={close} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20">
                <X size={18} />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-20">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft size={22} />
              </button>
              <motion.figure
                key={current.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) step(1);
                  else if (info.offset.x > 80) step(-1);
                }}
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full max-w-full flex-col items-center"
              >
                <Image
                  src={current.src}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                  sizes="100vw"
                  priority
                  className="max-h-[78vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
                />
                <figcaption className="mt-4 max-w-2xl text-center text-sm text-white/70">{current.caption ?? current.alt}</figcaption>
              </motion.figure>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20 sm:right-6"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
