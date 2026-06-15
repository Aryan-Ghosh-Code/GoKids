import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Child } from "@/lib/db/models/Child";
import ProfilePageClient from "@/components/dashboard/ProfilePageClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Parent Dashboard | Go Kids",
  description: "Manage your Go Kids profile, children, workshops, and assessments.",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();

  // Fetch user profile from DB for latest data (including photoUrl)
  const userDoc = await User.findById((session.user as { id?: string }).id)
    .select("name email phone photoUrl provider createdAt")
    .lean();

  if (!userDoc) redirect("/login");

  // Fetch all children for the parent
  const childrenDocs = await Child.find({
    parentId: (session.user as { id?: string }).id,
  })
    .select("name dob grade school interests photoUrl")
    .sort({ createdAt: -1 })
    .lean();

  // Serialise Mongoose docs to plain objects
  const user = JSON.parse(JSON.stringify(userDoc));
  const children = JSON.parse(JSON.stringify(childrenDocs));

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32 bg-[#FAFAF8] min-h-[50vh]">
          <Loader2 size={32} className="animate-spin text-[#F5C518]" />
        </div>
      }
    >
      <ProfilePageClient user={user} children={children} />
    </Suspense>
  );
}
