"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteProject, publishProject, setFeatured, unpublishProject } from "@/lib/actions/projects";
import type { ProjectWithRelations } from "@/types/database";
import { getPublishBlockers, getPublishWarnings } from "@/lib/validation/schemas";
import { ActionButton } from "./ActionButton";
import { Fieldset, Input, Notice } from "./ui";

export function PublishPanel({ project }: { project: ProjectWithRelations }) {
  const blockers = getPublishBlockers(project, project.project_images, project.project_technologies.length);
  const warnings = getPublishWarnings(project, project.project_images.length);
  const [confirmName, setConfirmName] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  return (
    <Fieldset legend="Publish" description="Drafts are invisible to visitors. Publishing is checked against the rules below; the panel reflects the last saved version.">
      {blockers.length > 0 ? (
        <Notice tone="danger">
          <p className="meta mb-2">Blocks publishing</p>
          <ul className="list-inside list-disc text-small">{blockers.map((b) => <li key={b}>{b}</li>)}</ul>
        </Notice>
      ) : (
        <Notice tone="success">Everything required is in place.</Notice>
      )}
      {warnings.length > 0 ? (
        <Notice tone="warning">
          <p className="meta mb-2">Suggestions</p>
          <ul className="list-inside list-disc text-small">{warnings.map((w) => <li key={w}>{w}</li>)}</ul>
        </Notice>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        {project.is_published ? (
          <ActionButton action={() => unpublishProject(project.id)} confirm="Unpublish this project? It will disappear from the site.">Unpublish</ActionButton>
        ) : (
          <ActionButton action={() => publishProject(project.id)} variant="primary" disabled={blockers.length > 0}>Publish</ActionButton>
        )}
        <ActionButton action={() => setFeatured(project.id, !project.is_featured)} aria-pressed={project.is_featured}>
          {project.is_featured ? "★ Featured (remove)" : "☆ Mark as featured"}
        </ActionButton>
        <Link href={`/admin/preview/${project.id}`} target="_blank" className="meta text-fg-muted hover:text-fg">
          Preview draft <span aria-hidden="true">↗</span>
        </Link>
        {project.is_published ? (
          <a href={`/work/${project.slug}`} target="_blank" rel="noopener noreferrer" className="meta text-fg-muted hover:text-fg">
            View live <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>

      <div className="border-t border-rule pt-6">
        <p className="meta text-danger">Danger zone</p>
        <p className="mt-2 max-w-[60ch] text-small text-fg-muted">
          Deleting removes the project and all its images permanently. {project.is_published ? "Unpublish it first." : `Type “${project.name}” to confirm.`}
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input aria-label="Type the project name to confirm deletion" value={confirmName} onChange={(e) => setConfirmName(e.target.value)} disabled={project.is_published} className="sm:max-w-xs" placeholder={project.name} />
          <ActionButton
            variant="danger"
            disabled={project.is_published || confirmName.trim() !== project.name}
            action={() => deleteProject(project.id, confirmName)}
            onDone={(r) => {
              if (!r.ok) setDeleteError(r.message);
            }}
          >
            Delete project
          </ActionButton>
        </div>
        {deleteError ? <p className="mt-2 text-xs text-danger" role="alert">{deleteError}</p> : null}
      </div>
    </Fieldset>
  );
}
