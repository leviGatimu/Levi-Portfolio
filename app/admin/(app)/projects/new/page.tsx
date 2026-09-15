import Link from "next/link";
import { NewProjectForm } from "@/components/admin/NewProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <Link href="/admin/projects" className="meta text-fg-muted hover:text-fg">← Projects</Link>
      <h1 className="mt-4 font-mono text-display-md font-medium text-fg">New project</h1>
      <p className="mt-2 max-w-[60ch] text-small text-fg-muted">Starts as a draft. You add the cover, story and images on the next screen.</p>
      <NewProjectForm />
    </div>
  );
}
