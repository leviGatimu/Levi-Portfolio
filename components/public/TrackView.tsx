"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Sends one cookieless beacon per page view. Skipped when the browser asks not to be tracked. */
export function TrackView() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || navigator.doNotTrack === "1") return;
    const body = JSON.stringify({ path: pathname, referrer: document.referrer || null });
    const timer = setTimeout(() => {
      fetch("/api/view", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true }).catch(() => {});
    }, 800);
    return () => clearTimeout(timer);
  }, [pathname]);
  return null;
}
