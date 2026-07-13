import type { Metadata } from "next";
import Image from "next/image";
import { getWorkshops } from "@/lib/data/workshops";
import WorkshopsClient from "@/components/workshops/WorkshopsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Workshops — Go Kids India",
  description:
    "Browse free, expert-led workshops in Coding, Maths, Science, and more — designed for Indian children aged 7–14.",
  openGraph: {
    title: "Workshops — Go Kids India",
    description: "Free expert-led workshops for kids aged 7–14.",
    images: ["/images/workshops-banner.jpg"],
  },
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
function WorkshopsHero() {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: 340 }}>
      <Image
        src="/images/workshops-banner.jpg"
        alt="Go Kids Workshops"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(26,26,26,0.72) 0%, rgba(43,188,176,0.55) 100%)",
        }}
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20 min-h-85">

        <h1
          className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight"
          style={{
            color: "white",
            fontFamily: "var(--font-nunito)",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)"
          }}
        >
          Explore Our Workshops
        </h1>

        <p
          className="text-lg text-white/85 max-w-xl mb-8"
          style={{
            color: "rgba(255, 255, 255, 0.85)",
            fontFamily: "var(--font-nunito)"
          }}
        >
          Expert-led sessions in Coding, Maths, Science & more:
          designed specifically for Indian children aged 7-14.
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
          Browse Workshops
        </a>
      </div>

      {/* Bottom fade into page bg */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #FAFAFA)" }}
      />
    </section>
  );
}

interface StatsBarProps {
  totalWorkshops: number;
  totalEnrolled: number;
  avgRating: number;
  skillsCount: number;
}

// ─── Stats bar ────────────────────────────────────────────────────────────────
function StatsBar({ totalWorkshops, totalEnrolled, avgRating, skillsCount }: StatsBarProps) {
  const stats = [
    { value: `${totalWorkshops}+`, label: "Workshops" },
    {
      value: totalEnrolled >= 1000
        ? `${(totalEnrolled / 1000).toFixed(1).replace(".0", "")}k+`
        : `${totalEnrolled}+`,
      label: "Kids Enrolled"
    },
    { value: `${skillsCount}+`, label: "Skills Taught" },
    { value: `${avgRating}★`, label: "Avg Rating" },
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
export default async function WorkshopsPage() {
  const workshops = await getWorkshops();

  // Calculate stats dynamically from MongoDB data
  const totalWorkshops = workshops.length;
  const totalEnrolled = workshops.reduce((sum, w) => sum + (w.enrolledCount || 0), 0);
  const skillsCount = new Set(workshops.flatMap((w) => w.skills)).size;
  const avgRating = workshops.length
    ? parseFloat(
        (workshops.reduce((sum, w) => sum + (w.rating || 0), 0) / workshops.length).toFixed(1)
      )
    : 4.8;

  return (
    <main style={{ background: "#FAFAFA", minHeight: "100vh" }}>
      <WorkshopsHero />
      <StatsBar
        totalWorkshops={totalWorkshops}
        totalEnrolled={totalEnrolled}
        avgRating={avgRating}
        skillsCount={skillsCount}
      />
      <div id="workshops-grid">
        <WorkshopsClient workshops={workshops} />
      </div>
    </main>
  );
}
