import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Child } from "@/lib/db/models/Child";
import { Assessment } from "@/lib/db/models/Assessment";
import ProfilePageClient from "@/components/dashboard/ProfilePageClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Parent Dashboard | Go Kids",
  description:
    "Manage your Go Kids profile, children, workshops, and assessments.",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();

  const userId = (session.user as { id?: string }).id;

  // Fetch user profile from DB for latest data
  const userDoc = await User.findById(userId)
    .select("name email phone photoUrl provider createdAt")
    .lean();

  if (!userDoc) redirect("/login");

  // Fetch all children for the parent
  const childrenDocs = await Child.find({ parentId: userId })
    .select("name dob grade school interests photoUrl")
    .sort({ createdAt: -1 })
    .lean();

  // Fetch assessments the parent has explicitly saved to their dashboard
  const assessmentDocs = await Assessment.find({
    parentId: userId,
    savedToDashboard: { $ne: false },
  })
    .sort({ createdAt: -1 })
    .lean();

  // Serialise Mongoose docs to plain objects
  const user = JSON.parse(JSON.stringify(userDoc));
  const children = JSON.parse(JSON.stringify(childrenDocs));
  const dbAssessments = JSON.parse(JSON.stringify(assessmentDocs));

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32 bg-brand-offwhite min-h-[50vh]">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      }
    >
      <ProfilePageClient
        user={user}
        childProfiles={children}
        dbAssessments={dbAssessments}
      />
    </Suspense>
  );
}
