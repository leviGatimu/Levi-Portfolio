import { cn } from "@/lib/utils/cn";

type MetaProps = { children: React.ReactNode; className?: string; as?: "span" | "p" | "div" };

/** Mono uppercase metadata label, the instrument-readout style used everywhere. */
export function Meta({ children, className, as: Tag = "span" }: MetaProps) {
  return <Tag className={cn("meta text-fg-subtle", className)}>{children}</Tag>;
}
