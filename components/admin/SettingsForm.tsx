"use client";

import { useActionState, useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { updateSiteFields } from "@/lib/actions/settings";
import type { FocusArea, JourneyItem, SiteSettingsRow } from "@/types/database";
import { Button, Field, Fieldset, IconButton, Input, Notice, Textarea } from "./ui";

type TextKey = "display_name" | "tagline" | "meta_line" | "meta_line_secondary" | "opening_statement" | "intro_line" | "bio_short_md" | "bio_long_md" | "now_md" | "email" | "github_url" | "linkedin_url" | "instagram_url" | "portrait_alt" | "location" | "timezone";
type ListKey = "focus_areas" | "highlights";

export type FieldSpec =
  | { key: TextKey; label: string; kind: "input" | "textarea" | "markdown"; help?: string; placeholder?: string; maxLength?: number; required?: boolean }
  | { key: ListKey; label: string; kind: "pairs"; help?: string; max?: number; titleLabel?: string; descriptionLabel?: string }
  | { key: "journey"; label: string; kind: "journey"; help?: string; max?: number };

type Section = { legend: string; description?: string; icon?: React.ReactNode; fields: FieldSpec[] };

type Props = { settings: SiteSettingsRow; sections: Section[]; submitLabel?: string };

/** One form per admin page, saving only the keys it renders. */
export function SettingsForm({ settings, sections, submitLabel = "Save changes" }: Props) {
  const keys = sections.flatMap((s) => s.fields.map((f) => f.key));
  const [state, action, pending] = useActionState(updateSiteFields.bind(null, keys), undefined);
  const [lists, setLists] = useState<Record<string, FocusArea[]>>(() => {
    const init: Record<string, FocusArea[]> = {};
    for (const s of sections) for (const f of s.fields) if (f.kind === "pairs") init[f.key] = settings[f.key] ?? [];
    return init;
  });
  const [journey, setJourney] = useState<JourneyItem[]>(settings.journey ?? []);

  const move = <T,>(arr: T[], i: number, dir: -1 | 1): T[] => {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return arr;
    const next = [...arr];
    const a = next[i]!;
    next[i] = next[j]!;
    next[j] = a;
    return next;
  };

  return (
    <form action={action} className="flex flex-col gap-5">
      {state ? <Notice tone={state.ok ? "success" : "danger"}>{state.ok ? (state.message ?? "Saved") : state.message}</Notice> : null}

      {sections.map((section) => (
        <Fieldset key={section.legend} legend={section.legend} description={section.description} icon={section.icon}>
          {section.fields.map((f) => {
            if (f.kind === "pairs") {
              const items = lists[f.key] ?? [];
              const set = (next: FocusArea[]) => setLists({ ...lists, [f.key]: next });
              return (
                <div key={f.key}>
                  <div className="flex items-baseline justify-between">
                    <p className="text-[13px] font-medium text-[#333]">{f.label}</p>
                    {f.help ? <p className="text-[12px] text-[#8a8a8a]">{f.help}</p> : null}
                  </div>
                  <input type="hidden" name={f.key} value={JSON.stringify(items)} />
                  <ul className="mt-3 flex flex-col gap-3">
                    {items.map((it, i) => (
                      <li key={i} className="grid gap-2 rounded-2xl border border-black/[0.07] p-3 sm:grid-cols-[200px_1fr_auto]">
                        <Input aria-label={f.titleLabel ?? "Title"} placeholder={f.titleLabel ?? "Title"} value={it.title} maxLength={40} onChange={(e) => set(items.map((x, k) => (k === i ? { ...x, title: e.target.value } : x)))} />
                        <Input aria-label={f.descriptionLabel ?? "Description"} placeholder={f.descriptionLabel ?? "One sentence"} value={it.description} maxLength={160} onChange={(e) => set(items.map((x, k) => (k === i ? { ...x, description: e.target.value } : x)))} />
                        <div className="flex gap-1">
                          <IconButton label="Move up" disabled={i === 0} onClick={() => set(move(items, i, -1))}><ArrowUp size={15} /></IconButton>
                          <IconButton label="Move down" disabled={i === items.length - 1} onClick={() => set(move(items, i, 1))}><ArrowDown size={15} /></IconButton>
                          <IconButton label="Remove" onClick={() => set(items.filter((_, k) => k !== i))}><X size={15} /></IconButton>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button size="sm" className="mt-3" onClick={() => set([...items, { title: "", description: "" }])} disabled={items.length >= (f.max ?? 4)}>
                    <Plus size={14} /> Add
                  </Button>
                </div>
              );
            }
            if (f.kind === "journey") {
              return (
                <div key={f.key} id="add">
                  <div className="flex items-baseline justify-between">
                    <p className="text-[13px] font-medium text-[#333]">{f.label}</p>
                    {f.help ? <p className="text-[12px] text-[#8a8a8a]">{f.help}</p> : null}
                  </div>
                  <input type="hidden" name="journey" value={JSON.stringify(journey)} />
                  <ol className="mt-3 flex flex-col gap-3">
                    {journey.map((j, i) => (
                      <li key={i} className="grid gap-2 rounded-2xl border border-black/[0.07] p-3 sm:grid-cols-[130px_1fr_auto]">
                        <Input aria-label="Period" placeholder="Year 1" value={j.period} maxLength={30} onChange={(e) => setJourney(journey.map((x, k) => (k === i ? { ...x, period: e.target.value } : x)))} />
                        <div className="flex flex-col gap-2">
                          <Input aria-label="Title" placeholder="Title" value={j.title} maxLength={80} onChange={(e) => setJourney(journey.map((x, k) => (k === i ? { ...x, title: e.target.value } : x)))} />
                          <Textarea aria-label="Description" placeholder="What happened" value={j.description} maxLength={300} className="min-h-16" onChange={(e) => setJourney(journey.map((x, k) => (k === i ? { ...x, description: e.target.value } : x)))} />
                        </div>
                        <div className="flex gap-1 sm:flex-col">
                          <IconButton label="Move up" disabled={i === 0} onClick={() => setJourney(move(journey, i, -1))}><ArrowUp size={15} /></IconButton>
                          <IconButton label="Move down" disabled={i === journey.length - 1} onClick={() => setJourney(move(journey, i, 1))}><ArrowDown size={15} /></IconButton>
                          <IconButton label="Remove" onClick={() => setJourney(journey.filter((_, k) => k !== i))}><X size={15} /></IconButton>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <Button size="sm" className="mt-3" onClick={() => setJourney([...journey, { period: "", title: "", description: "" }])} disabled={journey.length >= (f.max ?? 12)}>
                    <Plus size={14} /> Add entry
                  </Button>
                </div>
              );
            }
            const value = settings[f.key] ?? "";
            return (
              <Field key={f.key} label={f.label} htmlFor={f.key} help={f.help} required={f.required}>
                {f.kind === "input" ? (
                  <Input id={f.key} name={f.key} defaultValue={value} placeholder={f.placeholder} maxLength={f.maxLength} required={f.required} />
                ) : (
                  <Textarea id={f.key} name={f.key} defaultValue={value} placeholder={f.placeholder} maxLength={f.maxLength} className={f.kind === "markdown" ? "min-h-56 font-mono text-[13px]" : "min-h-28"} />
                )}
              </Field>
            );
          })}
        </Fieldset>
      ))}

      <div className="flex items-center justify-end gap-3">
        <p className="text-[12px] text-[#8a8a8a]">Changes go live on the site within seconds.</p>
        <Button type="submit" variant="primary" disabled={pending} aria-busy={pending}>{pending ? "Saving…" : submitLabel}</Button>
      </div>
    </form>
  );
}
