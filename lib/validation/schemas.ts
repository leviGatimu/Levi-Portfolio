import { z } from "zod";
import { RESERVED_SLUGS } from "@/lib/utils/slugify";
import type { ProjectImageRow, ProjectRow } from "@/types/database";

const httpUrl = z
  .string()
  .trim()
  .url("Must be a full URL starting with http:// or https://")
  .refine((u) => /^https?:\/\//i.test(u), "Only http(s) URLs are allowed");

export const linkSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(30),
  url: httpUrl,
  kind: z.enum(["repo", "live", "download", "video", "other"]),
});

export const collaboratorSchema = z.object({
  name: z.string().trim().min(1).max(60),
  role: z.string().trim().min(1).max(60),
  url: z.union([httpUrl, z.literal("")]).optional(),
});

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lowercase letters, numbers and single hyphens only")
  .refine((s) => !RESERVED_SLUGS.has(s), "That slug is reserved");

export const projectCreateSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  slug: slugSchema,
  type: z.enum(["project", "experiment", "client"]),
  status: z.enum(["active", "paused", "completed", "archived"]),
  year: z.coerce.number().int().min(2020).max(2100),
});

export const projectUpdateSchema = projectCreateSchema.extend({
  one_liner: z.string().trim().max(120, "Keep the one-liner under 120 characters"),
  summary: z.string().trim().max(400, "Keep the summary under 400 characters"),
  body_md: z.string().max(60_000),
  timeline: z.string().trim().max(60),
  role: z.string().trim().max(120),
  team: z.string().trim().max(200),
  collaborators: z.array(collaboratorSchema).max(10),
  links: z.array(linkSchema).max(8),
  repo_visibility: z.enum(["public", "private", "none"]),
  video_url: z.union([httpUrl, z.literal("")]),
  cover_aspect: z.enum(["16:10", "4:5"]),
  technology_ids: z.array(z.string().uuid()).max(30),
});

export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;

export const technologySchema = z.object({
  name: z.string().trim().min(1).max(60),
  slug: slugSchema,
  group: z.enum(["language", "frontend", "backend", "database", "ai", "robotics", "embedded", "desktop", "devops", "design", "hardware"]),
  proficiency: z.union([z.enum(["strong", "comfortable", "learning", "experimental"]), z.literal("")]),
  show_on_about: z.boolean(),
});

export const focusAreaSchema = z.object({
  title: z.string().trim().min(1).max(40),
  description: z.string().trim().min(1).max(160),
});

export const siteSettingsSchema = z.object({
  display_name: z.string().trim().min(1).max(60),
  tagline: z.string().trim().max(120),
  meta_line: z.string().trim().max(120),
  meta_line_secondary: z.string().trim().max(120),
  opening_statement: z.string().trim().max(160),
  intro_line: z.string().trim().max(200),
  bio_short_md: z.string().max(1000),
  bio_long_md: z.string().max(20_000),
  now_md: z.string().max(2000),
  focus_areas: z.array(focusAreaSchema).max(4),
  highlights: z.array(focusAreaSchema).max(4),
  email: z.string().trim().email(),
  github_url: z.union([httpUrl, z.literal("")]),
  linkedin_url: z.union([httpUrl, z.literal("")]),
  instagram_url: z.union([httpUrl, z.literal("")]),
  portrait_alt: z.string().trim().min(1).max(200),
  location: z.string().trim().max(80),
  timezone: z.string().trim().max(60),
});

export const imageMetaSchema = z.object({
  alt: z.string().trim().min(3, "Alt text must be at least 3 characters").max(300),
  caption: z.string().trim().max(300),
  is_wide: z.boolean(),
});

export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * Rules that must hold before a project may be published. Pure, so the same
 * list can be shown in the editor before the click and enforced on the server.
 */
export function getPublishBlockers(
  project: Pick<ProjectRow, "name" | "slug" | "one_liner" | "summary" | "role" | "team" | "body_md">,
  images: Pick<ProjectImageRow, "is_cover" | "alt">[],
  technologyCount: number,
): string[] {
  const blockers: string[] = [];
  if (!project.name.trim()) blockers.push("Name is missing");
  if (!project.slug.trim()) blockers.push("Slug is missing");
  if (!project.one_liner.trim()) blockers.push("One-liner is missing");
  if (!project.summary.trim()) blockers.push("Summary is missing");
  if (!project.role.trim()) blockers.push("Role is missing");
  if (!project.team.trim()) blockers.push("Team is missing");
  if (!images.some((i) => i.is_cover)) blockers.push("No cover image set");
  if (images.some((i) => i.alt.trim().length < 3)) blockers.push("Every image needs alt text");
  if (technologyCount === 0) blockers.push("Add at least one technology");
  const body = project.body_md.trim();
  if (body.length < 200) blockers.push("Case study is shorter than 200 characters");
  if (/\b(todo|lorem|ipsum)\b/i.test(body)) blockers.push("Case study still contains TODO / lorem text");
  return blockers;
}

export function getPublishWarnings(
  project: Pick<ProjectRow, "links" | "status" | "body_md">,
  imageCount: number,
): string[] {
  const warnings: string[] = [];
  if (project.links.length === 0) warnings.push("No links (repository, live site…)");
  if (imageCount <= 1) warnings.push("Only one image; case studies read better with 3 to 6");
  if (project.status === "completed" && !/^##\s+Outcome/im.test(project.body_md)) warnings.push("Completed project without an “## Outcome” section");
  if (!/^##\s+/m.test(project.body_md)) warnings.push("Case study has no “## Section” headings");
  return warnings;
}
