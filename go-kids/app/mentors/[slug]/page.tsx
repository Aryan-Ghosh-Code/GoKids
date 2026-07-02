import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import MentorModel from "@/lib/db/models/Mentor";
import MentorProfileHeader from "@/components/mentors/MentorProfileHeader";
import MentorProfileSections from "@/components/mentors/MentorProfileSections";
import BookingCalendarWidget from "@/components/mentors/BookingCalendarWidget";
import type { IMentor } from "@/lib/db/models/Mentor";
import { ArrowLeft, ArrowRight, Award, Clock, Globe, ShieldCheck, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const mentor = await MentorModel.findOne({ slug, isPublished: true }).lean();
  if (!mentor) return { title: "Mentor Not Found | Go Kids" };

  return {
    title: `${mentor.displayName} | Go Kids Mentors`,
    description: mentor.shortBio || mentor.bio?.slice(0, 155),
    openGraph: {
      title: `${mentor.displayName} | Go Kids Mentors`,
      description: mentor.shortBio || mentor.bio?.slice(0, 155),
      images: mentor.photo ? [mentor.photo] : [],
    },
  };
}

export default async function MentorProfilePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await connectDB();
  const raw = await MentorModel.findOne({ slug, isPublished: true }).lean();
  if (!raw) notFound();

  const mentor = JSON.parse(JSON.stringify(raw)) as IMentor;

  return (
    <main style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      {/* ── Top accent bar for layout offset ────────────────────────── */}
      <div className="pt-24 bg-brand-offwhite" />

      {/* ── Main page content ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Back link */}
        <Link
          href="/mentors"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
        >
          <ArrowLeft
            size={13}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back to Mentor Directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          {/* ── LEFT COLUMN ──────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-5">
            {/* Profile card */}
            <div
              className="bg-white rounded-3xl overflow-hidden"
              style={{
                border: "1.5px solid #E5E7EB",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              }}
            >
              {/* Light soft banner */}
              <div
                className="h-28 w-full relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #FFFBEA 0%, #E0F2FE 100%)",
                }}
              >
                {/* Subtle dot grid */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>
              <div className="px-6 sm:px-8 pb-7 -mt-12 relative z-10">
                <MentorProfileHeader mentor={mentor} />
              </div>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "Experience",
                  value: mentor.experience || "Expert",
                  icon: <Award size={17} className="text-amber-500" />,
                  iconBg: "#FFF9E6",
                },
                {
                  label: "Languages",
                  value: mentor.languages?.length
                    ? mentor.languages.join(", ")
                    : "English",
                  icon: <Globe size={17} className="text-teal-500" />,
                  iconBg: "#E8F8F7",
                },
                {
                  label: "Sessions",
                  value: `${mentor.sessionTypes?.length ?? 1} Type${(mentor.sessionTypes?.length ?? 1) > 1 ? "s" : ""}`,
                  icon: <Clock size={17} className="text-blue-500" />,
                  iconBg: "#EFF6FF",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-4 flex flex-col items-center text-center"
                  style={{
                    border: "1.5px solid #F3F4F6",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5"
                    style={{ background: stat.iconBg }}
                  >
                    {stat.icon}
                  </div>
                  <p
                    className="text-sm font-extrabold text-gray-900 leading-tight truncate w-full"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Verified banner — clean minimal */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
              style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "#DCFCE7" }}
              >
                <ShieldCheck size={16} className="text-emerald-600" />
              </div>
              <div>
                <p
                  className="text-sm font-extrabold text-emerald-900"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  Verified Expert
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Background-checked and approved by the Go Kids team
                </p>
              </div>
            </div>

            {/* Accordion detail sections */}
            <div
              className="bg-white rounded-3xl border overflow-hidden"
              style={{
                borderColor: "#EFEFEF",
                boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
              }}
            >
              <div className="px-6 pt-6 pb-2">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Full Profile
                </p>
                <h2
                  className="text-lg font-extrabold text-gray-900"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  About &amp; Qualifications
                </h2>
              </div>
              <div className="px-6 pb-6">
                <MentorProfileSections mentor={mentor} />
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Calendar widget ────────────────────────── */}
          <div className="lg:col-span-5 sticky top-24 lg:top-28 z-20 self-start">
            <BookingCalendarWidget mentorName={mentor.displayName} />
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <div
        className="border-t mt-4"
        style={{ borderColor: "#F3F4F6", background: "#FAFAF8" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: "#FFF3CC" }}>
              <Users size={18} className="text-amber-600" />
            </div>
            <div>
              <p
                className="text-sm font-extrabold text-gray-900"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Looking for other mentors?
              </p>
              <p className="text-xs text-gray-500">
                Browse our full directory of verified experts
              </p>
            </div>
          </div>
          <Link
            href="/mentors"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm"
          >
            View All Mentors <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
