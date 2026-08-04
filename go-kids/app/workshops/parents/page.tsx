import type { Metadata } from "next";
import Image from "next/image";
import { getWorkshops } from "@/lib/data/workshops";
import WorkshopsClient from "@/components/workshops/WorkshopsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Workshops for Parents — Go Kids India",
  description:
    "Expert-led workshops designed for parents — learn how to support your child's learning journey, manage screen time, and build a growth mindset at home.",
  openGraph: {
    title: "Workshops for Parents — Go Kids India",
    description:
      "Expert-led workshops tailored for parents of school-age children.",
    images: ["/images/workshops-banner.jpg"],
  },
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
function ParentsWorkshopsHero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: 340 }}
    >
      <Image
        src="/images/workshops-banner-parents.jpeg"
        alt="Go Kids Workshops for Parents"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Overlay — warmer tones for a parent-facing feel */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(26,26,26,0.72) 0%, rgba(43,188,176,0.55) 100%)",
        }}
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20 min-h-85">
        <span
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold mb-4"
          style={{
            background: "rgba(245,197,24,0.18)",
            color: "#F5C518",
            border: "1px solid rgba(245,197,24,0.35)",
            fontFamily: "var(--font-nunito)",
          }}
        >
          👨‍👩‍👧 For Parents
        </span>

        <h1
          className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight"
          style={{
            color: "white",
            fontFamily: "var(--font-nunito)",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}
        >
          Workshops for Parents
        </h1>

        <p
          className="text-lg text-white/85 max-w-xl mb-8"
          style={{
            color: "rgba(255, 255, 255, 0.85)",
            fontFamily: "var(--font-nunito)",
          }}
        >
          Expert guidance to help you support your child&apos;s learning, manage
          screen time, and nurture a growth mindset at home.
        </p>

        <a
          href="#workshops-grid"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-extrabold transition-all hover:scale-105 active:scale-95"
          style={{
            background: "#F5C518",
            color: "#1A1A1A",
            fontFamily: "var(--font-nunito)",
            boxShadow: "0 8px 24px rgba(245,197,24,0.45)",
          }}
        >
          Explore Sessions
        </a>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #FAFAFA)",
        }}
      />
    </section>
  );
}

interface StatsBarProps {
  totalWorkshops: number;
  totalEnrolled: number;
  avgRating: number;
}

function StatsBar({ totalWorkshops, totalEnrolled, avgRating }: StatsBarProps) {
  const stats = [
    { value: `${totalWorkshops}+`, label: "Sessions" },
    {
      value:
        totalEnrolled >= 1000
          ? `${(totalEnrolled / 1000).toFixed(1).replace(".0", "")}k+`
          : `${totalEnrolled}+`,
      label: "Parents Enrolled",
    },
    { value: `${avgRating}★`, label: "Avg Rating" },
    { value: "Live", label: "Format" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 -mt-10 relative z-10">
      <div className="grid grid-cols-4 gap-1.5 sm:gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl sm:rounded-2xl flex flex-col items-center justify-center py-2.5 sm:py-5 px-1 sm:px-4 text-center border border-brand-grey"
            style={{
              boxShadow:
                "0 10px 30px -10px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <span
              className="text-base sm:text-3xl font-extrabold"
              style={{
                fontFamily: "var(--font-nunito)",
                background: "linear-gradient(135deg, #1A1A1A 0%, #4B5563 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {s.value}
            </span>
            <span
              className="text-[9px] sm:text-xs font-bold mt-0.5 sm:mt-1 text-brand-grey-text"
              style={{ fontFamily: "var(--font-nunito)", lineHeight: 1.1 }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ParentsWorkshopsPage() {
  const workshops = await getWorkshops({ audienceType: "parents" });

  const totalWorkshops = workshops.length;
  const totalEnrolled = workshops.reduce(
    (sum, w) => sum + (w.enrolledCount || 0),
    0,
  );
  const avgRating = 4.8;

  return (
    <main style={{ background: "#FAFAFA", minHeight: "100vh" }}>
      <ParentsWorkshopsHero />
      <StatsBar
        totalWorkshops={totalWorkshops}
        totalEnrolled={totalEnrolled}
        avgRating={avgRating}
      />
      <div id="workshops-grid">
        {/* hideSkillChips: hides age/level/skill tags irrelevant for parents */}
        {/* hideSkillFilter: hides skill subject filter in sidebar */}
        <WorkshopsClient workshops={workshops} hideSkillChips hideSkillFilter />
      </div>
    </main>
  );
}
