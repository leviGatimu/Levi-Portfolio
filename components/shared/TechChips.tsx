import type { TechnologyRow } from "@/types/database";
import { cn } from "@/lib/utils/cn";

export function TechChips({ techs, max, className }: { techs: TechnologyRow[]; max?: number; className?: string }) {
  const shown = max ? techs.slice(0, max) : techs;
  const rest = techs.length - shown.length;
  if (shown.length === 0) return null;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Technologies">
      {shown.map((t) => (
        <li key={t.id} className="chip">{t.name}</li>
      ))}
      {rest > 0 ? <li className="chip">+{rest}</li> : null}
    </ul>
  );
}
