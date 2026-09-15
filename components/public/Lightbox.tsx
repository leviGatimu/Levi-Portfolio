"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type LightboxImage = { id: string; src: string; alt: string; caption: string | null; width: number; height: number };

const Ctx = createContext<{ open: (index: number) => void; images: LightboxImage[] } | null>(null);

export function useLightbox() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLightbox must be used inside LightboxProvider");
  return ctx;
}

/** Holds the full-screen viewer for a page; triggers anywhere inside can open any image by index. */
export function LightboxProvider({ images, children }: { images: LightboxImage[]; children: React.ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const isOpen = index !== null;
  const current = isOpen ? images[index] : undefined;

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((dir: 1 | -1) => setIndex((i) => (i === null ? null : (i + dir + images.length) % images.length)), [images.length]);
  const open = useCallback((i: number) => setIndex(Math.max(0, Math.min(i, images.length - 1))), [images.length]);
  const value = useMemo(() => ({ open, images }), [open, images]);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, close, step]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen && current ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex flex-col bg-slate-950/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`Image ${index + 1} of ${images.length}`}
            onClick={close}
          >
            <div className="flex items-center justify-between px-5 py-4 text-white/80" onClick={(e) => e.stopPropagation()}>
              <span className="text-sm font-medium tabular-nums">{index + 1} / {images.length}</span>
              <button type="button" onClick={close} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20">
                <X size={18} />
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-20">
              {images.length > 1 ? (
                <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous image" className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20 sm:left-6">
                  <ChevronLeft size={22} />
                </button>
              ) : null}
              <motion.figure
                key={current.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                drag={images.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) step(1);
                  else if (info.offset.x > 80) step(-1);
                }}
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full max-w-full flex-col items-center"
              >
                <Image src={current.src} alt={current.alt} width={current.width} height={current.height} sizes="100vw" priority className="max-h-[78vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl" />
                <figcaption className="mt-4 max-w-2xl text-center text-sm text-white/70">{current.caption ?? current.alt}</figcaption>
              </motion.figure>
              {images.length > 1 ? (
                <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next image" className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20 sm:right-6">
                  <ChevronRight size={22} />
                </button>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

/** The project cover: a browser-style frame, the whole screenshot visible, click to enlarge. */
export function CoverFrame({ image, index = 0 }: { image: LightboxImage; index?: number }) {
  const { open } = useLightbox();
  const portrait = image.height > image.width;
  return (
    <button
      type="button"
      onClick={() => open(index)}
      className={`group block w-full cursor-zoom-in text-left ${portrait ? "mx-auto max-w-[440px]" : ""}`}
      aria-label={`Enlarge cover image: ${image.alt}`}
    >
      <div className="overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-white shadow-[0_40px_80px_-40px_rgba(15,23,42,0.5)] dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-slate-50 px-4 py-2.5 dark:border-white/10 dark:bg-slate-800">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="ml-3 hidden flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-slate-400 sm:block dark:bg-slate-900">{image.alt}</span>
          <span className="ml-auto text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">Click to enlarge</span>
        </div>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} priority sizes="(min-width: 1024px) 1024px, 100vw" className="h-auto w-full" />
      </div>
    </button>
  );
}

/** Gallery thumbnails that open the shared lightbox at the right index. */
export function GalleryGrid({ images, startIndex = 0 }: { images: LightboxImage[]; startIndex?: number }) {
  const { open } = useLightbox();
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((img, i) => (
        <li key={img.id}>
          <button
            type="button"
            onClick={() => open(startIndex + i)}
            className="group block w-full cursor-zoom-in overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white p-2 text-left shadow-[0_28px_60px_-34px_rgba(15,23,42,0.3)] transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-slate-900"
            aria-label={`Open image ${startIndex + i + 1}: ${img.alt}`}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.1rem] bg-slate-100 dark:bg-slate-800">
              <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" className="object-contain transition-transform duration-500 group-hover:scale-[1.02]" />
            </div>
            {img.caption ? <p className="px-2 pb-1 pt-3 text-sm text-slate-500 dark:text-slate-400">{img.caption}</p> : null}
          </button>
        </li>
      ))}
    </ul>
  );
}
