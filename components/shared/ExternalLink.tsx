import { cn } from "@/lib/utils/cn";

type Props = React.ComponentProps<"a"> & { arrow?: boolean };

export function ExternalLink({ className, children, arrow = true, ...rest }: Props) {
  return (
    <a target="_blank" rel="noopener noreferrer" className={cn("link-underline", className)} {...rest}>
      {children}
      {arrow ? <span aria-hidden="true"> ↗</span> : null}
    </a>
  );
}
