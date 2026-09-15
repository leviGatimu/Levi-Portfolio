import { revalidatePath } from "next/cache";

/** Purge every public page that could show project or site data. */
export function revalidatePublic(slugs: string[] = []) {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/about");
  revalidatePath("/sitemap.xml");
  for (const slug of slugs) revalidatePath(`/work/${slug}`);
}
