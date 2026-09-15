import { cn } from "@/lib/utils/cn";

type Props = {
  index: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeader({ index, title, subtitle, className, align = "left" }: Props) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <span className="meta text-fg-subtle">{index}</span>
      <h2 className="mt-3 font-mono text-display-md font-medium text-fg">{title}</h2>
      {subtitle ? <p className="meta-lg mt-2 text-fg-subtle">{subtitle}</p> : null}
    </div>
  );
}
