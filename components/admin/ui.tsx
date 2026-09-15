import { cn } from "@/lib/utils/cn";

/* ---------- Buttons ---------- */

type ButtonProps = React.ComponentProps<"button"> & { variant?: "primary" | "secondary" | "danger" | "ghost"; size?: "sm" | "md" };

export function Button({ className, variant = "secondary", size = "md", type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[4px] font-mono uppercase tracking-[0.08em] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-8 px-3 text-[0.625rem]" : "h-10 px-4 text-[0.6875rem]",
        variant === "primary" && "bg-accent text-accent-ink hover:bg-[#62e7ab]",
        variant === "secondary" && "border border-rule-strong bg-transparent text-fg hover:border-fg-subtle hover:bg-bg-raised",
        variant === "danger" && "border border-danger/50 text-danger hover:bg-danger/10",
        variant === "ghost" && "text-fg-muted hover:bg-bg-raised hover:text-fg",
        className,
      )}
      {...rest}
    />
  );
}

/* ---------- Fields ---------- */

const inputBase =
  "w-full rounded-[4px] border border-rule-strong bg-bg-sunken px-3 py-2 font-sans text-[0.9375rem] text-fg placeholder:text-fg-subtle/70 focus:border-accent focus:outline-none disabled:opacity-50";

export function Input({ className, ...rest }: React.ComponentProps<"input">) {
  return <input className={cn(inputBase, "h-10", className)} {...rest} />;
}

export function Textarea({ className, ...rest }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(inputBase, "min-h-24 leading-relaxed", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: React.ComponentProps<"select">) {
  return (
    <select className={cn(inputBase, "h-10 appearance-none pr-8", className)} {...rest}>
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
  const helpId = help ? `${htmlFor}-help` : undefined;
  const errId = error ? `${htmlFor}-error` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={htmlFor} className="meta text-fg-muted">
          {label}
          {required ? <span className="text-accent"> *</span> : null}
        </label>
        {count ? (
          <span className={cn("meta", count.value > count.max ? "text-danger" : "text-fg-subtle")}>
            {count.value}/{count.max}
          </span>
        ) : null}
      </div>
      {children}
      {help ? (
        <p id={helpId} className="text-xs leading-relaxed text-fg-subtle">{help}</p>
      ) : null}
      {error ? (
        <p id={errId} role="alert" className="text-xs text-danger">{error}</p>
      ) : null}
    </div>
  );
}

export function Fieldset({ legend, description, children, id }: { legend: string; description?: string; children: React.ReactNode; id?: string }) {
  return (
    <fieldset id={id} className="scroll-mt-24 border-t border-rule pt-8">
      <legend className="font-mono text-heading font-medium text-fg">{legend}</legend>
      {description ? <p className="mt-2 max-w-[60ch] text-small text-fg-muted">{description}</p> : null}
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </fieldset>
  );
}

/* ---------- Notices ---------- */

export function Notice({ tone = "info", children, className }: { tone?: "info" | "success" | "danger" | "warning"; children: React.ReactNode; className?: string }) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "rounded-[4px] border px-4 py-3 text-small",
        tone === "info" && "border-rule-strong bg-bg-raised text-fg-muted",
        tone === "success" && "border-success/40 bg-success/10 text-fg",
        tone === "danger" && "border-danger/40 bg-danger/10 text-fg",
        tone === "warning" && "border-[#d9a441]/40 bg-[#d9a441]/10 text-fg",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "accent" | "danger" }) {
  return (
    <span
      className={cn(
        "meta inline-flex items-center rounded-[2px] px-1.5 py-1",
        tone === "muted" && "bg-bg-sunken text-fg-muted",
        tone === "accent" && "bg-accent/15 text-accent",
        tone === "danger" && "bg-danger/15 text-danger",
      )}
    >
      {children}
    </span>
  );
}
