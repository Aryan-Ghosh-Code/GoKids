import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Child } from "@/lib/db/models/Child";
import PlayProfileAssessment from "@/components/assessments/play-profile/PlayProfileAssessment";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Child Play Profile Survey | Go Kids",
  description:
    "Discover your child's natural play archetype with our 10-question parent survey designed for children aged 0–5.",
};

export default async function PlayProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();

  const userId = (session.user as { id?: string }).id;

  const childrenDocs = await Child.find({ parentId: userId })
    .select("name dob grade")
    .sort({ createdAt: -1 })
    .lean();

  const children = JSON.parse(JSON.stringify(childrenDocs));

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 sm:py-8 space-y-5 sm:space-y-8">
      {/* Back navigation */}
      <div>
        <Link
          href="/assessments"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-black transition-colors"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <ArrowLeft size={16} /> Back to Assessments
        </Link>
      </div>

      {/* Assessment Branding Header */}
      <div className="border-b border-gray-200/80 pb-4 sm:pb-6 space-y-1.5 sm:space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl">🧩</span>
          <h1
            className="text-xl sm:text-3xl font-extrabold text-brand-black tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Child Play Profile Survey
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
          A 10-question parent survey for children aged 0–5. Discover your
          child&apos;s natural play archetype and the activities that suit them best.
        </p>
      </div>

      {/* Conditional rendering depending on if parent has children */}
      {children.length === 0 ? (
        <div className="pt-6">
          <div className="max-w-md mx-auto bg-white rounded-4xl p-8 border border-gray-150 shadow-md space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl mx-auto">
              👶
            </div>
            <h2
              className="text-2xl font-extrabold text-brand-black"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Add a child profile first
            </h2>
            <p className="text-sm text-gray-500 font-semibold leading-relaxed">
              To start the survey, you must first add a child profile to your
              dashboard. This lets us save the results against the correct child.
            </p>
            <Link
              href="/parent/dashboard?tab=children&add=true&callbackUrl=/parent/assessments/play-profile"
              className="block w-full text-center py-4 rounded-2xl font-extrabold text-sm transition-all bg-primary text-brand-black hover:bg-primary-dark shadow-xs"
              style={{
                fontFamily: "var(--font-heading)",
                textDecoration: "none",
              }}
            >
              Go to Parent Hub to add Child
            </Link>
          </div>
        </div>
      ) : (
        <div className="pt-2">
          <PlayProfileAssessment childrenList={children} />
        </div>
      )}
    </div>
  );
}
