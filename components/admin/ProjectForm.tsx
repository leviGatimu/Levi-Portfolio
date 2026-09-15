"use client";

import { useActionState, useMemo, useState } from "react";
import { quickAddTechnology } from "@/lib/actions/technologies";
import { updateProject } from "@/lib/actions/projects";
import { mediaUrl } from "@/lib/supabase/env";
import { slugify } from "@/lib/utils/slugify";
import { GROUP_LABEL } from "@/lib/utils/format";
import type { Collaborator, ProjectLink, ProjectWithRelations, TechnologyRow, TechGroup } from "@/types/database";
import { Prose } from "@/components/shared/Prose";
import { TechLogo } from "@/components/shared/TechLogo";
import { Button, Field, Fieldset, Input, Notice, Select, Textarea } from "./ui";

const BODY_TEMPLATE = `## Overview
What it is, who it is for, in a few sentences.

## Problem
The real problem, stated concretely. Why existing things fall short.

## Approach
How you attacked it. Key product decisions.

## Architecture
Components, data flow, boundaries. ASCII diagrams in a code block work well:

\`\`\`
client → API → database
\`\`\`

## Decisions
- Decision one, and *why*.
- Decision two, and why.

## Challenges
What broke, what was hard.

## Outcome
What works today, what doesn't. Only real outcomes.

## Lessons
Two to four honest lessons.
`;

type Props = { project: ProjectWithRelations; technologies: TechnologyRow[] };

export function ProjectForm({ project, technologies }: Props) {
  const [state, action, pending] = useActionState(updateProject.bind(null, project.id), undefined);
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};

  const [slug, setSlug] = useState(project.slug);
  const [oneLiner, setOneLiner] = useState(project.one_liner);
  const [summary, setSummary] = useState(project.summary);
  const [body, setBody] = useState(project.body_md);
  const [preview, setPreview] = useState(false);
  const [links, setLinks] = useState<ProjectLink[]>(project.links);
  const [collabs, setCollabs] = useState<Collaborator[]>(project.collaborators);
  const [techList, setTechList] = useState(technologies);
  const [selectedTech, setSelectedTech] = useState<string[]>(
    project.project_technologies.map((pt) => pt.technologies?.id).filter((id): id is string => Boolean(id)),
  );
  const [techSearch, setTechSearch] = useState("");
  const [newTech, setNewTech] = useState({ name: "", group: "frontend" as TechGroup });
  const [techNotice, setTechNotice] = useState<string | null>(null);

  const bodyImages = useMemo(
    () => Object.fromEntries(project.project_images.map((i) => [mediaUrl(i.storage_path), { width: i.width, height: i.height, alt: i.alt }])),
    [project.project_images],
  );

  const grouped = useMemo(() => {
    const q = techSearch.trim().toLowerCase();
    const map = new Map<TechGroup, TechnologyRow[]>();
    for (const t of techList) {
      if (q && !t.name.toLowerCase().includes(q)) continue;
      map.set(t.group, [...(map.get(t.group) ?? []), t]);
    }
    return map;
  }, [techList, techSearch]);

  async function addTech() {
    if (!newTech.name.trim()) return;
    const result = await quickAddTechnology(newTech.name, newTech.group);
    if (!result.ok) {
      setTechNotice(result.message);
      return;
    }
    const row: TechnologyRow = {
      id: result.data.id,
      name: result.data.name,
      slug: slugify(result.data.name),
      group: newTech.group,
      proficiency: null,
      icon: null,
      show_on_about: true,
      sort_order: 0,
      created_at: "",
      updated_at: "",
    };
    setTechList((l) => [...l, row]);
    setSelectedTech((s) => [...s, row.id]);
    setNewTech({ name: "", group: newTech.group });
    setTechNotice(`Added ${row.name}`);
  }

  return (
    <form action={action} className="flex flex-col gap-12">
      {state ? (
        <Notice tone={state.ok ? "success" : "danger"}>{state.ok ? (state.message ?? "Saved") : state.message}</Notice>
      ) : null}

      <div className="sticky top-2 z-10 flex items-center justify-between gap-4 rounded-full border border-black/[0.07] bg-white/95 px-4 py-2 backdrop-blur">
        <nav aria-label="Sections" className="hidden flex-wrap gap-x-5 md:flex">
          {["basics", "details", "technologies", "links", "case-study"].map((s) => (
            <a key={s} href={`#${s}`} className="rounded-full px-3 py-1.5 text-[13px] font-medium capitalize text-[#555] hover:bg-[#f2f2f4] hover:text-[#111]">{s.replace("-", " ")}</a>
          ))}
        </nav>
        <Button type="submit" variant="primary" disabled={pending} aria-busy={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>

      {/* ---------- Basics ---------- */}
      <Fieldset id="basics" legend="Basics">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Name" htmlFor="name" required error={errors.name}>
            <Input id="name" name="name" defaultValue={project.name} required maxLength={60} />
          </Field>
          <Field
            label="Slug"
            htmlFor="slug"
            required
            error={errors.slug}
            help={project.is_published && slug !== project.slug ? "Changing the slug of a published project breaks existing links." : `/work/${slug}`}
          >
            <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} required />
          </Field>
        </div>
        <div className="grid gap-6 sm:grid-cols-4">
          <Field label="Type" htmlFor="type" error={errors.type}>
            <Select id="type" name="type" defaultValue={project.type}>
              <option value="project">Project</option>
              <option value="experiment">Experiment</option>
              <option value="client">Client work</option>
            </Select>
          </Field>
          <Field label="Status" htmlFor="status" error={errors.status}>
            <Select id="status" name="status" defaultValue={project.status}>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
          <Field label="Year" htmlFor="year" error={errors.year}>
            <Input id="year" name="year" type="number" min={2020} max={2100} defaultValue={project.year} />
          </Field>
          <Field label="Timeline" htmlFor="timeline" help="e.g. May to Sep 2026" error={errors.timeline}>
            <Input id="timeline" name="timeline" defaultValue={project.timeline ?? ""} maxLength={60} />
          </Field>
        </div>
      </Fieldset>

      {/* ---------- Details ---------- */}
      <Fieldset id="details" legend="Details" description="Plain words. What it is, for whom, and what you did.">
        <Field label="One-liner" htmlFor="one_liner" required count={{ value: oneLiner.length, max: 120 }} error={errors.one_liner} help="Shown under the name on the homepage and /work.">
          <Input id="one_liner" name="one_liner" value={oneLiner} onChange={(e) => setOneLiner(e.target.value)} maxLength={140} />
        </Field>
        <Field label="Summary" htmlFor="summary" required count={{ value: summary.length, max: 400 }} error={errors.summary} help="2 to 3 sentences. Used as the meta description and the case-study sidebar.">
          <Textarea id="summary" name="summary" value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={450} />
        </Field>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Role" htmlFor="role" required help="What you did. e.g. Solo: design, frontend, backend." error={errors.role}>
            <Input id="role" name="role" defaultValue={project.role} maxLength={120} />
          </Field>
          <Field label="Team" htmlFor="team" required help="Solo, or who you worked with (real names only with permission)." error={errors.team}>
            <Input id="team" name="team" defaultValue={project.team} maxLength={200} />
          </Field>
        </div>

        <div>
          <p className="meta text-fg-muted">Collaborators (optional)</p>
          <input type="hidden" name="collaborators" value={JSON.stringify(collabs)} />
          <ul className="mt-3 flex flex-col gap-3">
            {collabs.map((c, i) => (
              <li key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <Input aria-label="Collaborator name" placeholder="Name" value={c.name} onChange={(e) => setCollabs(collabs.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                <Input aria-label="Collaborator role" placeholder="Role" value={c.role} onChange={(e) => setCollabs(collabs.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))} />
                <Input aria-label="Collaborator URL" placeholder="https://… (optional)" value={c.url ?? ""} onChange={(e) => setCollabs(collabs.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} />
                <Button variant="ghost" onClick={() => setCollabs(collabs.filter((_, j) => j !== i))} aria-label="Remove collaborator">✕</Button>
              </li>
            ))}
          </ul>
          <Button size="sm" className="mt-3" onClick={() => setCollabs([...collabs, { name: "", role: "", url: "" }])} disabled={collabs.length >= 10}>
            + Add collaborator
          </Button>
          {errors.collaborators ? <p className="mt-2 text-xs text-danger">{errors.collaborators}</p> : null}
        </div>
      </Fieldset>

      {/* ---------- Technologies ---------- */}
      <Fieldset id="technologies" legend="Technologies" description="Only what the project actually uses. The first three show on the card.">
        {selectedTech.map((id) => (
          <input key={id} type="hidden" name="technology_ids" value={id} />
        ))}
        <div className="flex flex-wrap gap-1.5">
          {selectedTech.length === 0 ? <span className="meta text-fg-subtle">None selected</span> : null}
          {selectedTech.map((id) => {
            const t = techList.find((x) => x.id === id);
            if (!t) return null;
            return (
              <button key={id} type="button" className="chip gap-2 hover:border-danger hover:text-danger" onClick={() => setSelectedTech(selectedTech.filter((x) => x !== id))} aria-label={`Remove ${t.name}`}>
                <TechLogo name={t.name} icon={t.icon} size={14} /> {t.name} ✕
              </button>
            );
          })}
        </div>
        <Input aria-label="Search technologies" placeholder="Search…" value={techSearch} onChange={(e) => setTechSearch(e.target.value)} className="sm:max-w-xs" />
        <div className="grid max-h-72 gap-4 overflow-y-auto rounded-[4px] border border-rule p-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...grouped.entries()].map(([group, items]) => (
            <div key={group}>
              <p className="meta text-fg-subtle">{GROUP_LABEL[group]}</p>
              <ul className="mt-2 flex flex-col gap-1">
                {items.map((t) => (
                  <li key={t.id}>
                    <label className="flex cursor-pointer items-center gap-2 text-small text-fg">
                      <input
                        type="checkbox"
                        checked={selectedTech.includes(t.id)}
                        onChange={(e) => setSelectedTech(e.target.checked ? [...selectedTech, t.id] : selectedTech.filter((x) => x !== t.id))}
                        className="accent-[var(--color-accent)]"
                      />
                      <TechLogo name={t.name} icon={t.icon} size={16} />
                      {t.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <Field label="Add a missing technology" htmlFor="new-tech" className="flex-1">
            <Input id="new-tech" value={newTech.name} onChange={(e) => setNewTech({ ...newTech, name: e.target.value })} placeholder="e.g. MapLibre GL" />
          </Field>
          <Field label="Group" htmlFor="new-tech-group">
            <Select id="new-tech-group" value={newTech.group} onChange={(e) => setNewTech({ ...newTech, group: e.target.value as TechGroup })}>
              {(Object.keys(GROUP_LABEL) as TechGroup[]).map((g) => (
                <option key={g} value={g}>{GROUP_LABEL[g]}</option>
              ))}
            </Select>
          </Field>
          <Button onClick={addTech} disabled={!newTech.name.trim()}>Add</Button>
        </div>
        {techNotice ? <p className="meta text-fg-subtle" role="status">{techNotice}</p> : null}
        {errors.technology_ids ? <p className="text-xs text-danger">{errors.technology_ids}</p> : null}
      </Fieldset>

      {/* ---------- Links ---------- */}
      <Fieldset id="links" legend="Links">
        <input type="hidden" name="links" value={JSON.stringify(links)} />
        <ul className="flex flex-col gap-3">
          {links.map((l, i) => (
            <li key={i} className="grid gap-2 sm:grid-cols-[160px_1fr_140px_auto]">
              <Input aria-label="Link label" placeholder="Label" value={l.label} onChange={(e) => setLinks(links.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
              <Input aria-label="Link URL" placeholder="https://…" value={l.url} onChange={(e) => setLinks(links.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} />
              <Select aria-label="Link kind" value={l.kind} onChange={(e) => setLinks(links.map((x, j) => (j === i ? { ...x, kind: e.target.value as ProjectLink["kind"] } : x)))}>
                <option value="repo">Repository</option>
                <option value="live">Live</option>
                <option value="download">Download</option>
                <option value="video">Video</option>
                <option value="other">Other</option>
              </Select>
              <Button variant="ghost" onClick={() => setLinks(links.filter((_, j) => j !== i))} aria-label="Remove link">✕</Button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setLinks([...links, { label: "Repository", url: "", kind: "repo" }])} disabled={links.length >= 8}>+ Repository</Button>
          <Button size="sm" onClick={() => setLinks([...links, { label: "Live site", url: "", kind: "live" }])} disabled={links.length >= 8}>+ Live</Button>
          <Button size="sm" onClick={() => setLinks([...links, { label: "", url: "", kind: "other" }])} disabled={links.length >= 8}>+ Other</Button>
        </div>
        {Object.entries(errors).filter(([k]) => k.startsWith("links")).map(([k, v]) => (
          <p key={k} className="text-xs text-danger">{k}: {v}</p>
        ))}
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Repository visibility" htmlFor="repo_visibility" help="If private, the page says “Private repository” instead of linking." error={errors.repo_visibility}>
            <Select id="repo_visibility" name="repo_visibility" defaultValue={project.repo_visibility}>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="none">No repository</option>
            </Select>
          </Field>
          <Field label="Video URL" htmlFor="video_url" help="YouTube or Vimeo embeds; anything else becomes a plain link." error={errors.video_url}>
            <Input id="video_url" name="video_url" defaultValue={project.video_url ?? ""} placeholder="https://youtu.be/…" />
          </Field>
        </div>
      </Fieldset>

      {/* ---------- Case study ---------- */}
      <Fieldset id="case-study" legend="Case study" description="Markdown. Use ## headings for sections. Paste image Markdown from the gallery below to place screenshots inline.">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setBody(BODY_TEMPLATE)} disabled={body.trim().length > 0}>Insert section template</Button>
          <Button size="sm" onClick={() => setPreview((v) => !v)} aria-pressed={preview}>{preview ? "Edit" : "Preview"}</Button>
          <span className="meta self-center text-fg-subtle">{body.length.toLocaleString()} characters</span>
        </div>
        <textarea name="body_md" value={body} readOnly hidden aria-hidden="true" />
        {preview ? (
          <div className="rounded-[4px] border border-rule p-6">
            {body.trim() ? <Prose markdown={body} images={bodyImages} /> : <p className="meta text-fg-subtle">Nothing to preview yet.</p>}
          </div>
        ) : (
          <Textarea
            aria-label="Case study markdown"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[520px] font-mono text-[0.8125rem] leading-relaxed"
            spellCheck
          />
        )}
        {errors.body_md ? <p className="text-xs text-danger">{errors.body_md}</p> : null}
      </Fieldset>

      <div className="flex justify-end border-t border-rule pt-6">
        <Button type="submit" variant="primary" disabled={pending} aria-busy={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
