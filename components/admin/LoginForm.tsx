"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/actions/auth";
import { Button, Field, Input, Notice } from "./ui";

export function LoginForm({ notAdmin }: { notAdmin: boolean }) {
  const [state, action, pending] = useActionState(signIn, undefined);
  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      {notAdmin ? <Notice tone="danger">That account is not the admin.</Notice> : null}
      {state && !state.ok ? <Notice tone="danger">{state.message}</Notice> : null}
      <Field label="Email" htmlFor="email" required>
        <Input id="email" name="email" type="email" autoComplete="username" required />
      </Field>
      <Field label="Password" htmlFor="password" required>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <Button type="submit" variant="primary" disabled={pending} aria-busy={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
