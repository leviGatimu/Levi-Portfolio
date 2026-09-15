"use client";

import { useId, useMemo, useState } from "react";

/* Palette: validated single-hue blue (series-1) on the light admin surface. */
const SERIES = "#2a78d6";
const GRID = "rgba(15, 23, 42, 0.08)";
const TEXT_MUTED = "#64748b";

function niceMax(max: number) {
  if (max <= 5) return 5;
  const pow = 10 ** Math.floor(Math.log10(max));
  const steps = [1, 2, 2.5, 5, 10];
  for (const s of steps) if (s * pow >= max) return s * pow;
  return 10 * pow;
}

function shortDay(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

/* ---------- Area chart (views over time) ---------- */

export function AreaChart({ data, label = "Views" }: { data: { day: string; views: number }[]; label?: string }) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);
  const W = 720;
  const H = 220;
  const PAD = { l: 36, r: 12, t: 12, b: 28 };
  const max = niceMax(Math.max(1, ...data.map((d) => d.views)));
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const n = data.length;

  const points = useMemo(
    () =>
      data.map((d, i) => ({
        x: PAD.l + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW),
        y: PAD.t + innerH - (d.views / max) * innerH,
        ...d,
      })),
    [data, n, innerW, innerH, max, PAD.l, PAD.t],
  );
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${points.at(-1)?.x.toFixed(1) ?? 0},${PAD.t + innerH} L${points[0]?.x.toFixed(1) ?? 0},${PAD.t + innerH} Z`;
  const ticks = [0, 0.5, 1].map((f) => ({ v: Math.round(max * f), y: PAD.t + innerH - f * innerH }));
  const active = hover !== null ? points[hover] : null;

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bestD = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p.x - x);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setHover(best);
  }

  if (n === 0) return <p className="text-sm text-slate-500">No data yet.</p>;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby={`${id}-title`} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        <title id={`${id}-title`}>{label} per day</title>
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={SERIES} stopOpacity="0.16" />
            <stop offset="1" stopColor={SERIES} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t.v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={t.y} y2={t.y} stroke={GRID} strokeWidth="1" />
            <text x={PAD.l - 8} y={t.y + 4} textAnchor="end" fontSize="11" fill={TEXT_MUTED}>{t.v.toLocaleString()}</text>
          </g>
        ))}
        <path d={area} fill={`url(#${id}-fill)`} />
        <path d={line} fill="none" stroke={SERIES} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {points.filter((_, i) => i === 0 || i === n - 1 || i % Math.max(1, Math.round(n / 6)) === 0).map((p) => (
          <text key={p.day} x={p.x} y={H - 8} textAnchor="middle" fontSize="11" fill={TEXT_MUTED}>{shortDay(p.day)}</text>
        ))}
        {active ? (
          <g>
            <line x1={active.x} x2={active.x} y1={PAD.t} y2={PAD.t + innerH} stroke="rgba(15,23,42,0.25)" strokeWidth="1" />
            <circle cx={active.x} cy={active.y} r="5" fill={SERIES} stroke="#fff" strokeWidth="2" />
          </g>
        ) : null}
        {points.length > 0 ? <circle cx={points[n - 1]!.x} cy={points[n - 1]!.y} r="4" fill={SERIES} stroke="#fff" strokeWidth="2" /> : null}
      </svg>
      {active ? (
        <div
          className="pointer-events-none absolute -top-2 rounded-xl border border-black/[0.06] bg-white px-3 py-2 text-xs shadow-lg"
          style={{ left: `${(active.x / W) * 100}%`, transform: `translateX(${active.x > W * 0.7 ? "-110%" : "10%"})` }}
          role="status"
        >
          <span className="block text-base font-semibold text-slate-900">{active.views.toLocaleString()}</span>
          <span className="text-slate-500">{label} · {shortDay(active.day)}</span>
        </div>
      ) : null}
      <details className="mt-3 text-xs text-slate-500">
        <summary className="cursor-pointer font-semibold">Table view</summary>
        <table className="mt-2 w-full text-left">
          <thead><tr><th className="py-1 font-semibold">Day</th><th className="py-1 font-semibold">{label}</th></tr></thead>
          <tbody>{data.map((d) => <tr key={d.day}><td className="py-0.5">{d.day}</td><td className="py-0.5">{d.views}</td></tr>)}</tbody>
        </table>
      </details>
    </div>
  );
}

/* ---------- Horizontal bar list (ranked categories) ---------- */

export function BarList({ items, total, empty = "Nothing yet." }: { items: { label: string; value: number }[]; total?: number; empty?: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const sum = total ?? items.reduce((s, i) => s + i.value, 0);
  if (items.length === 0) return <p className="text-sm text-slate-500">{empty}</p>;
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i.label} className="group" title={`${i.label}: ${i.value}`}>
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="truncate font-medium text-slate-800">{i.label}</span>
            <span className="shrink-0 tabular-nums text-slate-500">
              <span className="font-semibold text-slate-900">{i.value.toLocaleString()}</span>
              {sum > 0 ? <span className="ml-1.5 text-xs">{Math.round((i.value / sum) * 100)}%</span> : null}
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-r-[4px] bg-[#2a78d6] transition-[width] duration-500 group-hover:brightness-110" style={{ width: `${(i.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Stat tile ---------- */

export function StatTile({ label, value, hint, delta }: { label: string; value: string | number; hint?: string; delta?: number | null }) {
  const up = typeof delta === "number" && delta > 0;
  const down = typeof delta === "number" && delta < 0;
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-slate-900">{typeof value === "number" ? value.toLocaleString() : value}</p>
      {typeof delta === "number" ? (
        <p className={`mt-1 text-xs font-semibold ${up ? "text-emerald-600" : down ? "text-rose-600" : "text-slate-400"}`}>
          {up ? "▲" : down ? "▼" : "•"} {Math.abs(delta)}% vs previous period
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}
