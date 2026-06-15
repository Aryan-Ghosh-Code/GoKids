import { redirect } from "next/navigation";

export default async function ChildrenPage() {
  redirect("/parent/dashboard?tab=children");
}
