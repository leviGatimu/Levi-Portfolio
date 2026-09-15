// Hand-maintained mirror of backend/migrations/*.sql.
// If you change the schema, change this file too.

export type ProjectType = "project" | "experiment" | "client";
export type ProjectStatus = "active" | "paused" | "completed" | "archived";
export type RepoVisibility = "public" | "private" | "none";
export type CoverAspect = "16:10" | "4:5";
export type TechGroup =
  | "language"
  | "frontend"
  | "backend"
  | "database"
  | "ai"
  | "robotics"
  | "embedded"
  | "desktop"
  | "devops"
  | "design"
  | "hardware";
export type Proficiency = "strong" | "comfortable" | "learning" | "experimental";

export type ProjectLink = {
  label: string;
  url: string;
  kind: "repo" | "live" | "download" | "video" | "other";
};

export type Collaborator = { name: string; role: string; url?: string };
export type FocusArea = { title: string; description: string };
export type JourneyItem = { period: string; title: string; description: string };

export type ProjectRow = {
  id: string;
  slug: string;
  name: string;
  one_liner: string;
  summary: string;
  body_md: string;
  type: ProjectType;
  status: ProjectStatus;
  year: number;
  timeline: string | null;
  role: string;
  team: string;
  collaborators: Collaborator[];
  links: ProjectLink[];
  repo_visibility: RepoVisibility;
  video_url: string | null;
  cover_aspect: CoverAspect;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TechnologyRow = {
  id: string;
  slug: string;
  name: string;
  group: TechGroup;
  proficiency: Proficiency | null;
  icon: string | null;
  show_on_about: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectTechnologyRow = {
  project_id: string;
  technology_id: string;
  sort_order: number;
};

export type ProjectImageRow = {
  id: string;
  project_id: string;
  storage_path: string;
  alt: string;
  caption: string | null;
  width: number;
  height: number;
  bytes: number;
  is_cover: boolean;
  is_wide: boolean;
  sort_order: number;
  created_at: string;
};

export type SiteSettingsRow = {
  id: boolean;
  display_name: string;
  tagline: string;
  meta_line: string;
  meta_line_secondary: string;
  opening_statement: string;
  intro_line: string;
  bio_short_md: string;
  bio_long_md: string;
  now_md: string;
  now_updated_at: string | null;
  focus_areas: FocusArea[];
  highlights: FocusArea[];
  journey: JourneyItem[];
  email: string;
  github_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  portrait_home_path: string | null;
  portrait_about_path: string | null;
  portrait_alt: string;
  location: string;
  timezone: string;
  updated_at: string;
};

export type AdminRow = { user_id: string; created_at: string };

export type PageViewRow = {
  id: number;
  path: string;
  referrer: string | null;
  country: string | null;
  device: "desktop" | "mobile" | "tablet";
  viewed_at: string;
};

type Insert<T, Required extends keyof T = never> = Partial<T> & Pick<T, Required>;

export type Database = {
  public: {
    Tables: {
      projects: { Row: ProjectRow; Insert: Insert<ProjectRow, "slug" | "name">; Update: Partial<ProjectRow>; Relationships: [] };
      technologies: { Row: TechnologyRow; Insert: Insert<TechnologyRow, "slug" | "name" | "group">; Update: Partial<TechnologyRow>; Relationships: [] };
      project_technologies: {
        Row: ProjectTechnologyRow;
        Insert: Insert<ProjectTechnologyRow, "project_id" | "technology_id">;
        Update: Partial<ProjectTechnologyRow>;
        Relationships: [
          { foreignKeyName: "project_technologies_project_id_fkey"; columns: ["project_id"]; isOneToOne: false; referencedRelation: "projects"; referencedColumns: ["id"] },
          { foreignKeyName: "project_technologies_technology_id_fkey"; columns: ["technology_id"]; isOneToOne: false; referencedRelation: "technologies"; referencedColumns: ["id"] },
        ];
      };
      project_images: {
        Row: ProjectImageRow;
        Insert: Insert<ProjectImageRow, "project_id" | "storage_path" | "alt" | "width" | "height">;
        Update: Partial<ProjectImageRow>;
        Relationships: [
          { foreignKeyName: "project_images_project_id_fkey"; columns: ["project_id"]; isOneToOne: false; referencedRelation: "projects"; referencedColumns: ["id"] },
        ];
      };
      site_settings: { Row: SiteSettingsRow; Insert: Partial<SiteSettingsRow>; Update: Partial<SiteSettingsRow>; Relationships: [] };
      page_views: { Row: PageViewRow; Insert: never; Update: never; Relationships: [] };
      admins: {
        Row: AdminRow;
        Insert: Insert<AdminRow, "user_id">;
        Update: Partial<AdminRow>;
        Relationships: [
          { foreignKeyName: "admins_user_id_fkey"; columns: ["user_id"]; isOneToOne: true; referencedRelation: "users"; referencedColumns: ["id"] },
        ];
      };
    };
    Views: { page_views_daily: { Row: { day: string; views: number }; Relationships: [] } };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      record_page_view: { Args: { p_path: string; p_referrer: string | null; p_country: string | null; p_device: string }; Returns: undefined };
    };
    Enums: {
      project_type: ProjectType;
      project_status: ProjectStatus;
      repo_visibility: RepoVisibility;
      cover_aspect: CoverAspect;
      tech_group: TechGroup;
      proficiency: Proficiency;
    };
    CompositeTypes: Record<string, never>;
  };
};

/** A project with its relations, as used by the public site and the admin editor. */
export type ProjectWithRelations = ProjectRow & {
  project_images: ProjectImageRow[];
  project_technologies: { sort_order: number; technologies: TechnologyRow | null }[];
};
