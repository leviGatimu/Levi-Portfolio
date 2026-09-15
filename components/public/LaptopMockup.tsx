"use client";

import Image from "next/image";
import { motion } from "motion/react";

type Props = { src: string | null; alt: string; ratio?: number; label?: string };

/** The reference's MacBook frame, showing a real project screenshot. */
export default function LaptopMockup({ src, alt, ratio, label }: Props) {
  // Screen follows the screenshot's ratio, within a believable laptop range, so nothing is cropped.
  const screenRatio = ratio ? Math.min(2, Math.max(1.5, ratio)) : 1.6;
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-[900px]"
    >
      <div className="relative rounded-t-2xl border-[4px] border-slate-700 bg-slate-800 p-2 pb-0 shadow-2xl">
        <div className="relative flex flex-col overflow-hidden rounded-t-lg border border-slate-800 bg-white" style={{ aspectRatio: screenRatio }}>
          {src ? (
            <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 900px, 100vw" className="object-contain object-top" />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-slate-50 text-slate-400 dark:bg-white/[0.06]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">LG</div>
              <p className="text-xs font-bold uppercase tracking-[0.25em]">First project coming soon</p>
            </div>
          )}
          {label ? (
            <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-900 shadow-md backdrop-blur">{label}</span>
          ) : null}
        </div>
      </div>
      <div className="h-4 rounded-b-2xl border-t border-slate-600 bg-slate-700 shadow-xl" />
      <div className="mx-auto h-1 w-32 rounded-b-full bg-slate-600 shadow-sm" />
    </motion.div>
  );
}
