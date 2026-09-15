import { cn } from "@/lib/utils/cn";

type Props = {
  index: string;
  title: string;
  subtitle?: string;
  className?: string;
  id?: string;
};

export function SectionHeader({ index, title, subtitle, className, id }: Props) {
  return (
    <div className={className}>
      <span className="meta text-fg-subtle">{index}</span>
      <h2 id={id} className={cn("grow-line mt-4 font-mono text-display-md font-medium text-fg")}>{title}</h2>
      {subtitle ? <p className="meta-lg mt-5 text-fg-subtle">{subtitle}</p> : null}
    </div>
  );
}
