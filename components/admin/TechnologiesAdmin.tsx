"use client";

import { useActionState, useState } from "react";
import { createTechnology, deleteTechnology, moveTechnology, updateTechnology } from "@/lib/actions/technologies";
import { GROUP_LABEL, PROFICIENCY_LABEL } from "@/lib/utils/format";
import type { Proficiency, TechGroup, TechnologyRow } from "@/types/database";
import { ActionButton } from "./ActionButton";
import { Button, Field, Input, Notice, Select } from "./ui";

const GROUPS = Object.keys(GROUP_LABEL) as TechGroup[];
const LEVELS = Object.keys(PROFICIENCY_LABEL) as Proficiency[];

type Props = { technologies: TechnologyRow[]; usage: Record<string, number> };

export function TechnologiesAdmin({ technologies, usage }: Props) {
  const [state, action, pending] = useActionState(createTechnology, undefined);
  const grouped = new Map<TechGroup, TechnologyRow[]>();
  for (const t of technologies) grouped.set(t.group, [...(grouped.get(t.group) ?? []), t]);

  return (
    <div className="flex flex-col gap-10">
      <form action={action} className="rounded-[4px] border border-rule p-5">
        <p className="meta text-fg-muted">Add technology</p>
        {state ? <Notice tone={state.ok ? "success" : "danger"} className="mt-3">{state.ok ? (state.message ?? "Added") : state.message}</Notice> : null}
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_180px_180px_auto] sm:items-end">
          <Field label="Name" htmlFor="new-name" required>
            <Input id="new-name" name="name" required maxLength={60} placeholder="e.g. MapLibre GL" />
          </Field>
          <Field label="Group" htmlFor="new-group">
            <Select id="new-group" name="group" defaultValue="frontend">
              {GROUPS.map((g) => <option key={g} value={g}>{GROUP_LABEL[g]}</option>)}
            </Select>
          </Field>
          <Field label="Level" htmlFor="new-level" help="Blank = not shown on About">
            <Select id="new-level" name="proficiency" defaultValue="">
              <option value="">None</option>
              {LEVELS.map((l) => <option key={l} value={l}>{PROFICIENCY_LABEL[l]}</option>)}
            </Select>
          </Field>
          <input type="hidden" name="show_on_about" value="on" />
          <Button type="submit" variant="primary" disabled={pending}>{pending ? "Adding…" : "Add"}</Button>
        </div>
      </form>

      {GROUPS.filter((g) => grouped.has(g)).map((g) => (
        <section key={g} aria-labelledby={`group-${g}`}>
          <h2 id={`group-${g}`} className="meta text-fg">{GROUP_LABEL[g]}</h2>
          <ul className="mt-3 divide-y divide-rule border-y border-rule">
            {(grouped.get(g) ?? []).map((t, i, arr) => (
              <TechRow key={t.id} tech={t} used={usage[t.id] ?? 0} isFirst={i === 0} isLast={i === arr.length - 1} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function TechRow({ tech, used, isFirst, isLast }: { tech: TechnologyRow; used: number; isFirst: boolean; isLast: boolean }) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState(updateTechnology.bind(null, tech.id), undefined);

  if (!editing) {
    return (
      <li className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
        <span className="min-w-40 text-small text-fg">{tech.name}</span>
        <span className="meta text-fg-subtle">{tech.proficiency ? PROFICIENCY_LABEL[tech.proficiency] : "not rated"}</span>
        <span className="meta text-fg-subtle">{tech.show_on_about ? "on About" : "hidden"}</span>
        <span className="meta text-fg-subtle">{used} project{used === 1 ? "" : "s"}</span>
        <span className="ml-auto flex items-center gap-1">
          <ActionButton action={() => moveTechnology(tech.id, "up")} disabled={isFirst} size="sm" variant="ghost" aria-label={`Move ${tech.name} up`}>↑</ActionButton>
          <ActionButton action={() => moveTechnology(tech.id, "down")} disabled={isLast} size="sm" variant="ghost" aria-label={`Move ${tech.name} down`}>↓</ActionButton>
          <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>Edit</Button>
          <ActionButton action={() => deleteTechnology(tech.id)} size="sm" variant="ghost" disabled={used > 0} confirm={`Delete ${tech.name}?`} title={used > 0 ? "In use by projects" : undefined}>
            Delete
          </ActionButton>
        </span>
      </li>
    );
  }

  return (
    <li className="py-3">
      <form
        action={(fd) => {
          action(fd);
          setEditing(false);
        }}
        className="grid gap-3 sm:grid-cols-[1fr_160px_160px_auto_auto] sm:items-end"
      >
        <Field label="Name" htmlFor={`name-${tech.id}`}>
          <Input id={`name-${tech.id}`} name="name" defaultValue={tech.name} required />
        </Field>
        <input type="hidden" name="slug" value={tech.slug} />
        <Field label="Group" htmlFor={`group-${tech.id}`}>
          <Select id={`group-${tech.id}`} name="group" defaultValue={tech.group}>
            {GROUPS.map((g) => <option key={g} value={g}>{GROUP_LABEL[g]}</option>)}
          </Select>
        </Field>
        <Field label="Level" htmlFor={`level-${tech.id}`}>
          <Select id={`level-${tech.id}`} name="proficiency" defaultValue={tech.proficiency ?? ""}>
            <option value="">None</option>
            {LEVELS.map((l) => <option key={l} value={l}>{PROFICIENCY_LABEL[l]}</option>)}
          </Select>
        </Field>
        <label className="flex items-center gap-2 pb-2 text-small text-fg">
          <input type="checkbox" name="show_on_about" defaultChecked={tech.show_on_about} className="accent-[var(--color-accent)]" /> On About
        </label>
        <div className="flex gap-2 pb-0.5">
          <Button type="submit" size="sm" variant="primary" disabled={pending}>Save</Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
        </div>
        {state && !state.ok ? <p className="text-xs text-danger sm:col-span-5">{state.message}</p> : null}
      </form>
    </li>
  );
}
