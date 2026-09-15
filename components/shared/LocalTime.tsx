"use client";

import { useEffect, useState } from "react";
import { formatLocalTime } from "@/lib/utils/format";

/** Kigali local time; renders the server value first, then ticks each half minute. */
export function LocalTime({ timezone, initial }: { timezone: string; initial: string }) {
  const [time, setTime] = useState(initial);
  useEffect(() => {
    // Correct the server-rendered value once on the client, then tick.
    const first = setTimeout(() => setTime(formatLocalTime(timezone)), 0);
    const id = setInterval(() => setTime(formatLocalTime(timezone)), 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [timezone]);
  return <time suppressHydrationWarning>{time}</time>;
}
