import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/* ---------- Buttons ---------- */

type ButtonProps = React.ComponentProps<"button"> & { variant?: "primary" | "secondary" | "danger" | "ghost"; size?: "sm" | "md" };

export function Button({ className, variant = "secondary", size = "md", type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        size === "sm" ? "h-9 px-4 text-[13px]" : "h-11 px-5 text-sm",
        variant === "primary" && "bg-[#111] text-white hover:bg-black",
        variant === "secondary" && "border border-black/[0.1] bg-white text-[#111] hover:bg-[#f6f6f7]",
        variant === "danger" && "border border-red-200 bg-white text-red-600 hover:bg-red-50",
        variant === "ghost" && "text-[#555] hover:bg-[#f2f2f4] hover:text-[#111]",
        className,
      )}
      {...rest}
    />
  );
}

/** Circular outlined icon button, as in the reference card headers. */
export function IconButton({ className, label, ...rest }: React.ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn("flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.1] bg-white text-[#333] transition-colors hover:bg-[#f2f2f4] disabled:opacity-40", className)}
      {...rest}
    />
  );
}

export function IconLink({ className, label, href, children, external }: { className?: string; label: string; href: string; children: React.ReactNode; external?: boolean }) {
  const cls = cn("flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.1] bg-white text-[#333] transition-colors hover:bg-[#f2f2f4]", className);
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={cls}>{children}</a>;
  return <Link href={href} aria-label={label} title={label} className={cls}>{children}</Link>;
}

/* ---------- Fields ---------- */

const inputBase =
  "w-full rounded-xl border border-black/[0.1] bg-white px-3.5 py-2 text-[14px] text-[#111] placeholder:text-[#9a9a9a] focus:border-[#111] focus:outline-none disabled:bg-[#f6f6f7] disabled:opacity-60";

export function Input({ className, ...rest }: React.ComponentProps<"input">) {
  return <input className={cn(inputBase, "h-11", className)} {...rest} />;
}

export function Textarea({ className, ...rest }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(inputBase, "min-h-24 leading-relaxed", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: React.ComponentProps<"select">) {
  return (
    <select className={cn(inputBase, "h-11 appearance-none pr-8", className)} {...rest}>
      {children}
    </select>
  );
}

type FieldProps = {
  label: string;
  htmlFor: string;
  help?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  count?: { value: number; max: number };
};

export function Field({ label, htmlFor, help, error, required, children, className, count }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-[#333]">
          {label}
          {required ? <span className="text-[#999]"> *</span> : null}
        </label>
        {count ? <span className={cn("text-[11px] tabular-nums", count.value > count.max ? "text-red-600" : "text-[#9a9a9a]")}>{count.value}/{count.max}</span> : null}
      </div>
      {children}
      {help ? <p className="text-[12px] leading-relaxed text-[#8a8a8a]">{help}</p> : null}
      {error ? <p role="alert" className="text-[12px] font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

/* ---------- Cards ---------- */

type CardProps = {
  title?: string;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  id?: string;
};

/** White card with the reference's header row: icon circle, title, actions on the right. */
export function Card({ title, subtitle, icon, actions, children, className, bodyClassName, id }: CardProps) {
  return (
    <section id={id} className={cn("scroll-mt-28 rounded-[18px] border border-black/[0.07] bg-white", className)}>
      {title ? (
        <header className="flex items-center justify-between gap-4 border-b border-black/[0.06] px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-3">
            {icon ? <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[0.1] text-[#333]">{icon}</span> : null}
            <div>
              <h2 className="text-[15px] font-semibold text-[#111]">{title}</h2>
              {subtitle ? <div className="mt-0.5 text-[12px] text-[#777]">{subtitle}</div> : null}
            </div>
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/** Fieldset that looks like a card, for forms. */
export function Fieldset({ legend, description, children, id, icon, aside }: { legend: string; description?: string; children: React.ReactNode; id?: string; icon?: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <fieldset id={id} className="scroll-mt-28 rounded-[18px] border border-black/[0.07] bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-3">
          {icon ? <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[0.1] text-[#333]">{icon}</span> : null}
          <div>
            <legend className="text-[15px] font-semibold text-[#111]">{legend}</legend>
            {description ? <p className="mt-0.5 text-[12px] text-[#777]">{description}</p> : null}
          </div>
        </div>
        {aside}
      </div>
      <div className="flex flex-col gap-5 p-4 sm:p-5">{children}</div>
    </fieldset>
  );
}

/** Icon + label + value row, as in the reference "Main information" card. */
export function InfoRow({ icon, label, children, action }: { icon: React.ReactNode; label: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] py-3.5 last:border-b-0">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[0.1] text-[#333]">{icon}</span>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[#111]">{label}</p>
          <div className="mt-0.5 text-[13px] text-[#666]">{children}</div>
        </div>
      </div>
      {action}
    </div>
  );
}

/* ---------- Small parts ---------- */

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-[#f2f2f4] px-3 py-1.5 text-[12px] font-medium text-[#333]", className)}>{children}</span>;
}

export function Badge({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "accent" | "danger" | "success" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tone === "muted" && "bg-[#f2f2f4] text-[#555]",
        tone === "accent" && "bg-[#111] text-white",
        tone === "success" && "bg-emerald-50 text-emerald-700",
        tone === "danger" && "bg-red-50 text-red-700",
      )}
    >
      {children}
    </span>
  );
}

export function Notice({ tone = "info", children, className }: { tone?: "info" | "success" | "danger" | "warning"; children: React.ReactNode; className?: string }) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "rounded-xl border px-4 py-3 text-[13px]",
        tone === "info" && "border-black/[0.07] bg-[#f8f8f9] text-[#333]",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        tone === "danger" && "border-red-200 bg-red-50 text-red-800",
        tone === "warning" && "border-amber-200 bg-amber-50 text-amber-900",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 rounded-[14px] border border-black/[0.07] bg-white px-4 py-3 text-[13px] text-[#666]">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
          {i > 0 ? <ChevronRight size={14} className="text-[#bbb]" /> : null}
          {item.href ? <Link href={item.href} className="hover:text-[#111]">{item.label}</Link> : <span className="font-medium text-[#111]">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-[#111]">{title}</h1>
        {description ? <p className="mt-1 max-w-[62ch] text-[13px] text-[#777]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
