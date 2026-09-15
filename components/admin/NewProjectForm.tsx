"use client";

import { useActionState, useState } from "react";
import { createProject } from "@/lib/actions/projects";
import { slugify } from "@/lib/utils/slugify";
import { Button, Field, Input, Notice, Select, Textarea } from "./ui";

const STEPS = [
  { n: "1", title: "Basics", text: "Name, type, status and year. Takes a minute." },
  { n: "2", title: "Screenshots", text: "Upload the cover and a few real screenshots with alt text." },
  { n: "3", title: "Details & stack", text: "Role, team, links and the technologies used." },
  { n: "4", title: "Case study", text: "Write the story in Markdown from the template, then preview." },
  { n: "5", title: "Publish", text: "The checklist tells you what is missing. Publish when it is green." },
];

export function NewProjectForm() {
  const [state, action, pending] = useActionState(createProject, undefined);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [oneLiner, setOneLiner] = useState("");
  const [summary, setSummary] = useState("");
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <form action={action} className="flex flex-col gap-6 rounded-[1.5rem] border border-black/[0.06] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)] sm:p-8">
        {state && !state.ok ? <Notice tone="danger">{state.message}</Notice> : null}
        <Field label="Project name" htmlFor="name" required error={errors.name}>
          <Input
            id="name"
            name="name"
            required
            maxLength={60}
            value={name}
            placeholder="e.g. Study Flow"
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
        </Field>
        <Field label="URL slug" htmlFor="slug" required help={`The page will live at /work/${slug || "…"}`} error={errors.slug}>
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
        <Field label="One-liner" htmlFor="one_liner" help="One plain sentence: what it is, for whom. You can refine it later." count={{ value: oneLiner.length, max: 120 }} error={errors.one_liner}>
          <Input id="one_liner" name="one_liner" value={oneLiner} onChange={(e) => setOneLiner(e.target.value)} maxLength={140} placeholder="A private, local activity history for Windows." />
        </Field>
        <Field label="Summary" htmlFor="summary" help="Two or three sentences. Optional now, required to publish." count={{ value: summary.length, max: 400 }} error={errors.summary}>
          <Textarea id="summary" name="summary" value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={450} />
        </Field>
        <div className="flex items-center justify-between border-t border-black/[0.06] pt-6">
          <p className="text-xs text-slate-500">Saved as a draft. Nothing is public until you publish.</p>
          <Button type="submit" variant="primary" disabled={pending} aria-busy={pending}>
            {pending ? "Creating…" : "Create draft and continue"}
          </Button>
        </div>
      </form>

      <aside className="rounded-[1.5rem] border border-black/[0.06] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">How it works</p>
        <ol className="mt-4 space-y-4">
          {STEPS.map((s, i) => (
            <li key={s.n} className="flex gap-3">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>{s.n}</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{s.title}</p>
                <p className="text-xs leading-relaxed text-slate-500">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
