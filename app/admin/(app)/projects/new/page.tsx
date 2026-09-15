import { NewProjectForm } from "@/components/admin/NewProjectForm";
import { Breadcrumbs, PageHeader } from "@/components/admin/ui";

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs items={[{ label: "Content" }, { label: "Projects", href: "/admin/projects" }, { label: "New" }]} />
      <PageHeader title="New project" description="Start with the basics. Screenshots, details, the case study and publishing come on the next screen." />
      <NewProjectForm />
    </div>
  );
}
