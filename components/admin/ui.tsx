import { cn } from "@/lib/utils/cn";

/* ---------- Buttons ---------- */

type ButtonProps = React.ComponentProps<"button"> & { variant?: "primary" | "secondary" | "danger" | "ghost"; size?: "sm" | "md" };

export function Button({ className, variant = "secondary", size = "md", type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-9 px-3.5 text-xs" : "h-11 px-5 text-sm",
        variant === "primary" && "bg-blue-600 text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,0.6)] hover:bg-blue-500 active:scale-[0.98]",
        variant === "secondary" && "border border-black/[0.08] bg-white text-slate-800 shadow-sm hover:border-black/20 hover:bg-slate-50",
        variant === "danger" && "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
        variant === "ghost" && "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        className,
      )}
      {...rest}
    />
  );
}

/* ---------- Fields ---------- */

const inputBase =
  "w-full rounded-xl border border-black/[0.08] bg-white px-3.5 py-2 text-[0.9375rem] text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50 disabled:opacity-60";

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
  const helpId = help ? `${htmlFor}-help` : undefined;
  const errId = error ? `${htmlFor}-error` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={htmlFor} className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          {label}
          {required ? <span className="text-blue-600"> *</span> : null}
        </label>
        {count ? (
          <span className={cn("text-[11px] font-semibold tabular-nums", count.value > count.max ? "text-rose-600" : "text-slate-400")}>
            {count.value}/{count.max}
          </span>
        ) : null}
      </div>
      {children}
      {help ? (
        <p id={helpId} className="text-xs leading-relaxed text-slate-500">{help}</p>
      ) : null}
      {error ? (
        <p id={errId} role="alert" className="text-xs font-semibold text-rose-600">{error}</p>
      ) : null}
    </div>
  );
}

export function Fieldset({ legend, description, children, id, aside }: { legend: string; description?: string; children: React.ReactNode; id?: string; aside?: React.ReactNode }) {
  return (
    <fieldset id={id} className="scroll-mt-28 rounded-[1.5rem] border border-black/[0.06] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <legend className="font-display text-xl font-semibold tracking-tight text-slate-900">{legend}</legend>
          {description ? <p className="mt-1.5 max-w-[62ch] text-sm text-slate-500">{description}</p> : null}
        </div>
        {aside}
      </div>
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </fieldset>
  );
}

/* ---------- Cards, notices, badges ---------- */

export function Card({ title, description, action, children, className }: { title?: string; description?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[1.5rem] border border-black/[0.06] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)]", className)}>
      {title || action ? (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title ? <h2 className="font-display text-lg font-semibold tracking-tight text-slate-900">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Notice({ tone = "info", children, className }: { tone?: "info" | "success" | "danger" | "warning"; children: React.ReactNode; className?: string }) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        tone === "info" && "border-black/[0.06] bg-slate-50 text-slate-700",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        tone === "danger" && "border-rose-200 bg-rose-50 text-rose-800",
        tone === "warning" && "border-amber-200 bg-amber-50 text-amber-900",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "accent" | "danger" | "success" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em]",
        tone === "muted" && "bg-slate-100 text-slate-600",
        tone === "accent" && "bg-blue-50 text-blue-700",
        tone === "success" && "bg-emerald-50 text-emerald-700",
        tone === "danger" && "bg-rose-50 text-rose-700",
      )}
    >
      {children}
    </span>
  );
}

export function PageHeader({ title, description, action, eyebrow }: { title: string; description?: string; action?: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600">{eyebrow}</p> : null}
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-[62ch] text-sm text-slate-500">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
