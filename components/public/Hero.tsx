"use client";

import { motion } from "motion/react";
import { Bot, Code2, Cpu, MousePointer2, Plane, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode, type RefObject } from "react";

/* ------------------------------------------------------------------ */
/*  Floaty: idle bob + drag-to-throw                                  */
/* ------------------------------------------------------------------ */

function Floaty({
  className,
  rotate = 0,
  float = 12,
  duration = 7,
  delay = 0,
  z = 20,
  constraints,
  children,
}: {
  className?: string;
  rotate?: number;
  float?: number;
  duration?: number;
  delay?: number;
  z?: number;
  constraints?: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  return (
    <motion.div
      drag
      dragConstraints={constraints as RefObject<Element>}
      dragElastic={0.15}
      dragMomentum
      dragTransition={{ bounceStiffness: 300, bounceDamping: 22 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
      whileDrag={{ scale: 1.12, zIndex: 60 }}
      style={{ zIndex: z }}
      className={`absolute cursor-grow touch-none pointer-events-auto ${className ?? ""}`}
    >
      <motion.div style={{ rotate }} animate={{ y: [0, -float, 0] }} transition={{ repeat: Infinity, duration, ease: "easeInOut", delay }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skill cards                                                       */
/* ------------------------------------------------------------------ */

const cardVariants: Record<string, string> = {
  amber: "bg-gradient-to-br from-amber-300 to-amber-400 text-amber-950",
  light: "bg-white text-slate-900",
  dark: "bg-slate-900 text-white",
  green: "bg-gradient-to-br from-emerald-400 to-green-500 text-white",
  blue: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
  violet: "bg-gradient-to-br from-violet-500 to-purple-600 text-white",
};

function SkillCard({ title, tag, variant, icon }: { title: string; tag: string; variant: keyof typeof cardVariants; icon: ReactNode }) {
  return (
    <div className={`pointer-events-none flex h-[150px] w-[252px] flex-col justify-between rounded-[1.6rem] border border-white/40 p-6 shadow-[0_30px_60px_-22px_rgba(0,0,0,0.45)] ${cardVariants[variant]}`}>
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">Area</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/25">{icon}</span>
      </div>
      <div>
        <p className="font-display text-[26px] font-semibold leading-none">{title}</p>
        <p className="mt-2 text-[11px] font-medium opacity-70">{tag}</p>
      </div>
    </div>
  );
}

const FAN = [
  { title: "Full-stack", tag: "Next.js · Supabase · Postgres", variant: "blue", pos: "left-[-2%] top-[13%]", rotate: -16, float: 9, dur: 7.5, icon: <Code2 size={16} /> },
  { title: "AI systems", tag: "LLM apps · simulations", variant: "violet", pos: "left-[4%] top-[22%]", rotate: -9, float: 8, dur: 8, icon: <Sparkles size={16} /> },
  { title: "Desktop", tag: "C# · .NET · Electron", variant: "dark", pos: "left-[10%] top-[31%]", rotate: -3, float: 11, dur: 6.5, icon: <Cpu size={16} /> },
  { title: "Robotics", tag: "Raspberry Pi · sensors", variant: "green", pos: "left-[14%] top-[38%]", rotate: 5, float: 9, dur: 7, icon: <Bot size={16} /> },
  { title: "Aviation", tag: "The long-term destination", variant: "amber", pos: "left-[19%] top-[46%]", rotate: 12, float: 12, dur: 8.5, icon: <Plane size={16} /> },
] as const;

/* ------------------------------------------------------------------ */

type Props = { firstName: string; headline: string[]; intro: string; portraitSrc: string; portraitAlt: string };

export default function Hero({ firstName, headline, intro, portraitSrc, portraitAlt }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [l1 = "Software", l2 = "that actually", l3 = "works."] = headline;

  return (
    <section className="relative">
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#ececec] dark:bg-[#0a0e17]">
        <div ref={stageRef} className="relative flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-32 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 mb-6 inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-blue-400"
          >
            <Sparkles size={13} /> {firstName}, student developer in Kigali
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.21, 0.5, 0.3, 1] }}
            className="relative z-10 font-display text-6xl font-bold leading-[0.9] tracking-[-0.03em] text-slate-900 sm:text-7xl lg:text-[8.5rem] xl:text-[10rem] dark:text-slate-50"
          >
            <span className="block">{l1}</span>
            <span className="block">{l2}</span>
            <span className="block text-blue-600 dark:text-blue-400">{l3}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="relative z-10 mt-10 max-w-md text-lg leading-relaxed text-slate-600 dark:text-slate-300"
          >
            {intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative z-10 mt-11 flex flex-col gap-4 sm:flex-row"
          >
            <Link href="/work" className="btn-dark px-14 py-5 text-lg">
              <span className="relative z-10">See my work</span>
            </Link>
            <Link href="/about" className="btn-light px-10 py-5 text-lg">
              About me
            </Link>
          </motion.div>

          {/* draggable floating elements (lg and up) */}
          <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
            <div className="pointer-events-none absolute left-[3%] top-[28%] -rotate-12 select-none font-display text-[10rem] font-bold leading-none text-black/[0.04] dark:text-white/[0.04]">
              Y2
            </div>

            {FAN.map((c, i) => (
              <Floaty key={c.title} constraints={stageRef} rotate={c.rotate} className={c.pos} z={20 + i} float={c.float} duration={c.dur} delay={i * 0.2}>
                <SkillCard title={c.title} tag={c.tag} variant={c.variant} icon={c.icon} />
              </Floaty>
            ))}

            {/* cursor sticker */}
            <Floaty constraints={stageRef} rotate={-10} className="left-[17%] top-[56%]" z={26} float={7} duration={6}>
              <MousePointer2 size={54} className="pointer-events-none fill-white text-white drop-shadow-[0_8px_14px_rgba(0,0,0,0.35)]" />
            </Floaty>

            {/* portrait card */}
            <Floaty constraints={stageRef} rotate={6} className="right-[7%] top-[12%]" z={34} float={14} duration={7.5}>
              <div className="pointer-events-none h-[190px] w-[190px] overflow-hidden rounded-[2rem] border-4 border-white shadow-[0_30px_56px_-16px_rgba(0,0,0,0.5)]">
                <Image src={portraitSrc} alt={portraitAlt} width={380} height={380} priority className="h-full w-full object-cover" />
              </div>
            </Floaty>

            {/* lightning: ships */}
            <Floaty constraints={stageRef} rotate={-8} className="right-[22%] top-[52%]" z={32} float={14} duration={6.8} delay={0.4}>
              <div className="pointer-events-none flex h-[98px] w-[98px] items-center justify-center rounded-[1.8rem] border-4 border-white bg-slate-900 shadow-[0_28px_50px_-16px_rgba(0,0,0,0.5)]">
                <Zap size={46} className="fill-amber-400 text-amber-400" />
              </div>
            </Floaty>

            {/* code */}
            <Floaty constraints={stageRef} rotate={7} className="right-[30%] top-[66%]" z={31} float={12} duration={7.2} delay={0.6}>
              <div className="pointer-events-none flex h-[88px] w-[88px] items-center justify-center rounded-[1.8rem] border-4 border-white bg-white/70 shadow-[0_28px_50px_-16px_rgba(0,0,0,0.4)] backdrop-blur-md">
                <Code2 size={44} className="text-blue-500" />
              </div>
            </Floaty>

            {/* plane */}
            <Floaty constraints={stageRef} rotate={11} className="right-[9%] top-[64%]" z={33} float={15} duration={7} delay={0.2}>
              <div className="pointer-events-none flex h-[100px] w-[100px] items-center justify-center rounded-[2rem] border-4 border-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-[0_30px_56px_-16px_rgba(37,99,235,0.6)]">
                <Plane size={42} className="text-white" />
              </div>
            </Floaty>

            {/* green toggle */}
            <Floaty constraints={stageRef} rotate={-4} className="right-[18%] top-[30%]" z={30} float={16} duration={7.5}>
              <div className="pointer-events-none flex h-[64px] w-[116px] items-center justify-end rounded-full border-4 border-white bg-green-500 px-2 shadow-[0_24px_44px_-14px_rgba(0,0,0,0.4)]">
                <div className="h-[46px] w-[46px] rounded-full bg-white shadow-md" />
              </div>
            </Floaty>
          </div>
        </div>
      </div>
    </section>
  );
}
