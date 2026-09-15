"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const BLOBS = [
  "42% 58% 63% 37% / 41% 44% 56% 59%",
  "63% 37% 47% 53% / 38% 63% 37% 62%",
  "39% 61% 38% 62% / 58% 39% 61% 42%",
  "58% 42% 64% 36% / 49% 56% 44% 51%",
  "47% 53% 35% 65% / 64% 47% 53% 36%",
  "61% 39% 56% 44% / 36% 58% 42% 64%",
];

type Props = { icon: ReactNode; chip: string; blob: string; title: string; desc: string; blobIndex?: number };

/** The reference's feature card: white panel, splash blob, coloured icon chip, hover lift. */
export function FeatureCard({ icon, chip, blob, title, desc, blobIndex = 0 }: Props) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="relative h-full overflow-hidden rounded-[1.9rem] border border-black/[0.06] bg-white p-8 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-slate-900"
    >
      <div className={`absolute -right-8 -top-10 h-44 w-44 opacity-70 ${blob}`} style={{ borderRadius: BLOBS[blobIndex % BLOBS.length] }} />
      <div className="relative">
        <div className={`mb-7 flex h-16 w-16 items-center justify-center rounded-[1.3rem] text-white shadow-[0_14px_30px_-10px_rgba(15,23,42,0.5)] ${chip}`}>{icon}</div>
        <h3 className="mb-2 font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{title}</h3>
        <p className="leading-relaxed text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
    </motion.div>
  );
}
