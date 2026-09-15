import Link from "next/link";
import { NewProjectForm } from "@/components/admin/NewProjectForm";
import { PageHeader } from "@/components/admin/ui";

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/admin/projects" className="text-sm font-semibold text-slate-500 hover:text-slate-900">← Projects</Link>
        <div className="mt-3">
          <PageHeader eyebrow="Step 1 of 5" title="New project" description="Start with the basics. Screenshots, details, the case study and publishing come on the next screen." />
        </div>
      </div>
      <NewProjectForm />
    </div>
  );
}
