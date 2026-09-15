"use client";

import { ArrowDown, ArrowUp, Star } from "lucide-react";
import { moveProject, publishProject, setFeatured, unpublishProject } from "@/lib/actions/projects";
import { ActionButton } from "./ActionButton";

type Props = { id: string; isFirst: boolean; isLast: boolean; isFeatured: boolean; isPublished: boolean };

export function ProjectRowActions({ id, isFirst, isLast, isFeatured, isPublished }: Props) {
  return (
    <div className="flex items-center gap-1">
      <ActionButton action={() => moveProject(id, "up")} disabled={isFirst} variant="ghost" size="sm" aria-label="Move up" title="Move up">
        <ArrowUp size={14} aria-hidden="true" />
      </ActionButton>
      <ActionButton action={() => moveProject(id, "down")} disabled={isLast} variant="ghost" size="sm" aria-label="Move down" title="Move down">
        <ArrowDown size={14} aria-hidden="true" />
      </ActionButton>
      <ActionButton
        action={() => setFeatured(id, !isFeatured)}
        variant="ghost"
        size="sm"
        aria-label={isFeatured ? "Remove from featured" : "Mark as featured"}
        aria-pressed={isFeatured}
        title={isFeatured ? "Featured" : "Feature"}
        className={isFeatured ? "text-accent" : ""}
      >
        <Star size={14} aria-hidden="true" fill={isFeatured ? "currentColor" : "none"} />
      </ActionButton>
      {isPublished ? (
        <ActionButton action={() => unpublishProject(id)} variant="ghost" size="sm" confirm="Unpublish this project? It will disappear from the site.">
          Unpublish
        </ActionButton>
      ) : (
        <ActionButton action={() => publishProject(id)} variant="ghost" size="sm">
          Publish
        </ActionButton>
      )}
    </div>
  );
}
