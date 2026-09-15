"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ActionResult } from "@/lib/actions/types";
import { Button } from "./ui";

type Props = Omit<React.ComponentProps<typeof Button>, "onClick" | "type"> & {
  action: () => Promise<ActionResult<unknown>>;
  confirm?: string;
  /** Called with the result message; when omitted a small inline status is shown. */
  onDone?: (result: ActionResult<unknown>) => void;
};

/** Runs a bound server action with pending state, optional confirm, and refresh. */
export function ActionButton({ action, confirm, onDone, children, disabled, ...rest }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  return (
    <span className="inline-flex items-center gap-2">
      <Button
        disabled={disabled || pending}
        aria-busy={pending}
        onClick={() => {
          if (confirm && !window.confirm(confirm)) return;
          start(async () => {
            const result = await action();
            if (onDone) onDone(result);
            else if (!result.ok || result.message) setStatus({ ok: result.ok, message: result.ok ? (result.message ?? "Done") : result.message });
            if (result.ok) router.refresh();
          });
        }}
        {...rest}
      >
        {children}
      </Button>
      {status ? (
        <span role="status" className={`meta ${status.ok ? "text-success" : "text-danger"}`}>{status.message}</span>
      ) : null}
    </span>
  );
}
