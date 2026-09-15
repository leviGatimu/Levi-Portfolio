import { redirect } from "next/navigation";

export default function SiteRedirect() {
  redirect("/admin/pages/home");
}
