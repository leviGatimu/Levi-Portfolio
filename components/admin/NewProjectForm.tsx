"use client";

import { useActionState, useState } from "react";
import { createProject } from "@/lib/actions/projects";
import { slugify } from "@/lib/utils/slugify";
import { Button, Field, Input, Notice, Select } from "./ui";

export function NewProjectForm() {
  const [state, action, pending] = useActionState(createProject, undefined);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};

  return (
    <form action={action} className="mt-8 flex max-w-xl flex-col gap-6">
      {state && !state.ok ? <Notice tone="danger">{state.message}</Notice> : null}
      <Field label="Name" htmlFor="name" required error={errors.name}>
        <Input
          id="name"
          name="name"
          required
          maxLength={60}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
      </Field>
      <Field label="Slug" htmlFor="slug" required help={`Part of the URL: /work/${slug || "…"}`} error={errors.slug}>
        <Input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
        />
      </Field>
      <div className="grid gap-6 sm:grid-cols-3">
        <Field label="Type" htmlFor="type" error={errors.type}>
          <Select id="type" name="type" defaultValue="project">
            <option value="project">Project</option>
            <option value="experiment">Experiment</option>
            <option value="client">Client work</option>
          </Select>
        </Field>
        <Field label="Status" htmlFor="status" error={errors.status}>
          <Select id="status" name="status" defaultValue="active">
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </Select>
        </Field>
        <Field label="Year" htmlFor="year" error={errors.year}>
          <Input id="year" name="year" type="number" min={2020} max={2100} defaultValue={new Date().getFullYear()} />
        </Field>
      </div>
      <div>
        <Button type="submit" variant="primary" disabled={pending} aria-busy={pending}>
          {pending ? "Creating…" : "Create draft"}
        </Button>
      </div>
    </form>
  );
}
