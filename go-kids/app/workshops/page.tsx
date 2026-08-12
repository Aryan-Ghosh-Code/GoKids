import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Users, ArrowRight, Sparkles, CheckCircle2, Award, ShieldCheck, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Go Kids Workshops — Future Skills & Smart Parenting",
  description: "Explore Go Kids India workshops. Choose between expert-led programs designed for kids or practical masterclasses for modern parenting.",
};

export default function WorkshopsPage() {
  return (
    <main className="min-h-screen bg-[#FCFCFD] pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Premium Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-teal/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-15%] w-[65%] h-[65%] rounded-full bg-primary/5 blur-[160px] pointer-events-none" />
      <div className="absolute top-[40%] left-[45%] w-62.5 h-62.5rounded-full bg-coral/3 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mb-16">
          <span
            className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full text-xs font-extrabold mb-5 uppercase tracking-wider"
            style={{
              background: "rgba(43,188,176,0.1)",
              color: "#168B80",
              fontFamily: "var(--font-nunito)",
              border: "1px solid rgba(43,188,176,0.2)",
            }}
          >
            <Sparkles size={12} className="animate-pulse" />
            Curated Educational Pathways
          </span>

          <h1
            className="text-4xl sm:text-6xl font-extrabold text-brand-black mb-6 tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Empowering Minds at{" "}
            <span className="bg-linear-to-r from-teal to-[#1A7A72] bg-clip-text text-transparent">
              Go Kids
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Choose a dedicated track designed specifically for children’s skills
            or smart, modern parenting frameworks.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 w-full max-w-5xl mb-24">
          {/* Track 1: Children */}
          <div className="relative group">
            {/* Glowing border highlight effect */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-teal to-[#1A7A72] rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 blur-md -z-10" />

            <Link
              href="/workshops/children"
              className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100/80 flex flex-col h-full transition-transform duration-300 transform group-hover:-translate-y-2"
            >
              {/* Visual Header */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <Image
                  src="/images/workshops-banner.jpg"
                  alt="Workshops for Children"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

                {/* Category Indicator */}
                <div className="absolute top-5 left-5 bg-teal text-white px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-lg tracking-wider">
                  <GraduationCap size={14} />
                  <span>FOR CHILDREN</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-8 flex flex-col flex-1">
                <h2
                  className="text-2xl font-extrabold text-brand-black mb-3 group-hover:text-teal transition-colors"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  Smarter & Stronger Kids Track
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                  Build future-ready superpowers in tech, logical reasoning,
                  speed writing, and confidence to make them stand out in school
                  and life.
                </p>

                {/* Bullet Points of What's Inside */}
                <div className="space-y-3 mb-8 flex-1">
                  {[
                    "Speed Writing & Exam Structuring Mastery",
                    "Practical AI Literacy & Coding Tools",
                    "Interactive live practice and speed-drills",
                  ].map((bullet, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 text-sm text-gray-700"
                    >
                      <CheckCircle2 size={16} className="text-teal shrink-0" />
                      <span className="font-semibold">{bullet}</span>
                    </div>
                  ))}
                </div>

                {/* Action Bar */}
                <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">
                    Ages 8 to 15 Years
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-teal group-hover:translate-x-2 transition-transform">
                    Explore Programs
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Track 2: Parents */}
          <div className="relative group">
            {/* Glowing border highlight effect */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-coral to-[#E26941] rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 blur-md -z-10" />

            <Link
              href="/workshops/parents"
              className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100/80 flex flex-col h-full transition-transform duration-300 transform group-hover:-translate-y-2"
            >
              {/* Visual Header */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <Image
                  src="/images/workshops-banner-parents.jpeg"
                  alt="Workshops for Parents"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

                {/* Category Indicator */}
                <div className="absolute top-5 left-5 bg-coral text-white px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-lg tracking-wider">
                  <Users size={14} />
                  <span>FOR PARENTS</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-8 flex flex-col flex-1">
                <h2
                  className="text-2xl font-extrabold text-brand-black mb-3 group-hover:text-coral transition-colors"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  Smarter Parenting Masterclasses
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                  Practical, high-impact parenting strategies backed by research
                  to solve daily modern challenges with screen time, yelling,
                  and study habits.
                </p>

                {/* Bullet Points of What's Inside */}
                <div className="space-y-3 mb-8 flex-1">
                  {[
                    "Discipline without Yelling (Notice-Name-Nudge)",
                    "Smart home setups using shared family AI tools",
                    "Strengthen trust & daily connection routines",
                  ].map((bullet, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 text-sm text-gray-700"
                    >
                      <CheckCircle2 size={16} className="text-coral shrink-0" />
                      <span className="font-semibold">{bullet}</span>
                    </div>
                  ))}
                </div>

                {/* Action Bar */}
                <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">
                    Parents & Educators
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-coral group-hover:translate-x-2 transition-transform">
                    Explore Masterclasses
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Why Go Kids Section */}
        <div className="w-full max-w-4xl bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden mb-16">
          <div className="absolute right-0 top-0 w-32 h-32 bg-teal/5 rounded-bl-full pointer-events-none" />
          <h3
            className="text-2xl sm:text-3xl font-extrabold text-brand-black text-center mb-10"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Why Families Trust Go Kids Workshops
          </h3>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center text-teal mb-4">
                <Award size={24} />
              </div>
              <h4
                className="font-extrabold text-brand-black text-base mb-2"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Expert Instructors
              </h4>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                Led by principal educators, alums from ISB, MICA, and incubees
                from IIT.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-[#92700A] mb-4">
                <ShieldCheck size={24} />
              </div>
              <h4
                className="font-extrabold text-brand-black text-base mb-2"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Actionable Content
              </h4>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                No boring lectures. You leave with practical trackers,
                templates, and ready tools.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-coral/10 flex items-center justify-center text-coral mb-4">
                <Heart size={24} />
              </div>
              <h4
                className="font-extrabold text-brand-black text-base mb-2"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                100% Parent Approved
              </h4>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                Over 1,500+ parents counselled and transformed through our
                structured framework.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Stats / Trust Badges */}
        <div className="border-t border-gray-100 pt-10 flex flex-wrap justify-center gap-6 sm:gap-8 text-center w-full max-w-4xl">
          <div className="px-4 py-2">
            <h4
              className="text-2xl font-black text-[#1D7E75] leading-none"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              3,500+
            </h4>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase">
              Children Mentored
            </p>
          </div>
          <div className="w-px bg-gray-200 hidden md:block" />
          <div className="px-4 py-2">
            <h4
              className="text-2xl font-black text-teal leading-none"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              1,500+
            </h4>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase">
              Parents Counselled
            </p>
          </div>
          <div className="w-px bg-gray-200 hidden md:block" />
          <div className="px-4 py-2">
            <h4
              className="text-2xl font-black text-brand-black leading-none"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Live
            </h4>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase">
              Interactive Cohorts
            </p>
          </div>
          <div className="w-px bg-gray-200 hidden md:block" />
          <div className="px-4 py-2">
            <h4
              className="text-2xl font-black text-coral leading-none"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              4 Years
            </h4>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase">
              Research-Backed
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
