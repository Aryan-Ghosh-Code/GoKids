import type { Metadata } from "next";
import Image from "next/image";
import { getWorkshops } from "@/lib/data/workshops";
import WorkshopsClient from "@/components/workshops/WorkshopsClient";

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
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5"
          style={{
            background: "rgba(245,197,24,0.18)",
            color: "#F5C518",
            border: "1px solid rgba(245,197,24,0.4)",
          }}
        >
          ✦ All workshops are completely free
        </div>

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
          Expert-led sessions in Coding, Maths, Science & more —
          designed specifically for Indian children aged 7–14.
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

// ─── Stats bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: "5+",     label: "Workshops" },
    { value: "1,700+", label: "Kids Enrolled" },
    { value: "100%",   label: "Free Forever" },
    { value: "4.8★",   label: "Avg Rating" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-10">
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)", background: "#E5E7EB" }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white flex flex-col items-center justify-center py-5 px-4 text-center"
          >
            <span
              className="text-2xl font-extrabold"
              style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
            >
              {s.value}
            </span>
            <span className="text-xs font-semibold mt-0.5" style={{ color: "#6B7280" }}>
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

  return (
    <main style={{ background: "#FAFAFA", minHeight: "100vh" }}>
      <WorkshopsHero />
      <StatsBar />
      <div id="workshops-grid" className="pt-8">
        <WorkshopsClient workshops={workshops} />
      </div>
    </main>
  );
}
