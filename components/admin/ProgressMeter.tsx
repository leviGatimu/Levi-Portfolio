import { Check, Circle } from "lucide-react";
import type { ProjectWithRelations } from "@/types/database";
import { getPublishBlockers } from "@/lib/validation/schemas";

type Step = { key: string; label: string; done: boolean; href: string; hint: string };

/** Turns the publish rules into a visible, ordered checklist with a progress bar. */
export function computeSteps(project: ProjectWithRelations): Step[] {
  const blockers = new Set(getPublishBlockers(project, project.project_images, project.project_technologies.length));
  const hasCover = project.project_images.some((i) => i.is_cover);
  const altsOk = project.project_images.every((i) => i.alt.trim().length >= 3);
  return [
    { key: "basics", label: "Basics", done: !blockers.has("Name is missing") && !blockers.has("Slug is missing"), href: "#basics", hint: "Name, slug, type, status, year" },
    { key: "images", label: "Cover & screenshots", done: hasCover && altsOk, href: "#images", hint: "A cover image and alt text on every image" },
    { key: "details", label: "Details", done: !blockers.has("One-liner is missing") && !blockers.has("Summary is missing") && !blockers.has("Role is missing") && !blockers.has("Team is missing"), href: "#details", hint: "One-liner, summary, role, team" },
    { key: "tech", label: "Technologies", done: !blockers.has("Add at least one technology"), href: "#technologies", hint: "At least one technology" },
    { key: "story", label: "Case study", done: !blockers.has("Case study is shorter than 200 characters") && !blockers.has("Case study still contains TODO / lorem text"), href: "#case-study", hint: "At least 200 characters, no TODOs" },
    { key: "publish", label: "Published", done: project.is_published, href: "#publish", hint: "Visible on the site" },
  ];
}

export function ProgressMeter({ project }: { project: ProjectWithRelations }) {
  const steps = computeSteps(project);
  const done = steps.filter((s) => s.done).length;
  const pct = Math.round((done / steps.length) * 100);
  return (
    <div className="rounded-[18px] border border-slate-200/80 bg-white p-5">
      <div className="flex items-baseline justify-between">
        <p className="text-[15px] font-semibold text-slate-900">Completeness</p>
        <p className="text-[13px] font-medium text-slate-600">{done} / {steps.length}</p>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Project completeness">
        <div className="h-full rounded-full bg-blue-600 transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      <ol className="mt-5 space-y-3">
        {steps.map((s) => (
          <li key={s.key}>
            <a href={s.href} className="group flex items-start gap-3">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${s.done ? "bg-blue-600 text-white" : "border border-black/15 text-transparent"}`}>
                {s.done ? <Check size={12} strokeWidth={3} /> : <Circle size={8} />}
              </span>
              <span>
                <span className={`block text-[13px] font-medium ${s.done ? "text-slate-400 line-through decoration-slate-300" : "text-slate-900 group-hover:underline"}`}>{s.label}</span>
                <span className="block text-[12px] text-slate-400">{s.hint}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
