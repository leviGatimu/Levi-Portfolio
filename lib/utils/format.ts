export function formatDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", opts).format(new Date(iso));
}

export function formatIndex(n: number): string {
  return String(n).padStart(2, "0");
}

export const STATUS_LABEL = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  archived: "Archived",
} as const;

export const TYPE_LABEL = {
  project: "Project",
  experiment: "Experiment",
  client: "Client work",
} as const;

export const GROUP_LABEL = {
  language: "Languages",
  frontend: "Frontend",
  backend: "Backend",
  database: "Databases",
  ai: "AI",
  robotics: "Robotics",
  embedded: "Embedded",
  desktop: "Desktop",
  devops: "DevOps & tools",
  design: "Design",
  hardware: "Hardware",
} as const;

export const PROFICIENCY_LABEL = {
  strong: "Strong",
  comfortable: "Comfortable",
  learning: "Learning",
  experimental: "Experimental",
} as const;

export function formatLocalTime(timezone: string, date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: timezone }).format(date);
}
