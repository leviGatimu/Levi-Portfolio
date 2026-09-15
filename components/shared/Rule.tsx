import { cn } from "@/lib/utils/cn";

export function Rule({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-rule", className)} />;
}
