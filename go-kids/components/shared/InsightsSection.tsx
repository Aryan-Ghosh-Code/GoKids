"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/MotionWrapper";
import Link from "next/link";
import { ArrowRight, TrendingDown, Brain, Zap } from "lucide-react";

// ─── Module-level Chart.js import ─────────────────────────────────────────────
// IMPORTANT: Must be at module scope, NOT inside useEffect.
// Calling import() inside an effect creates a new dynamic chunk on every
// component mount and every HMR cycle in Next.js dev — those chunks are held
// by webpack's HMR runtime and never GC'd, causing the heap to grow to 8 GB.
// A single module-level Promise is evaluated once per module load and reused.
const _chartImport = import("chart.js/auto");

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "endurance" | "impulse" | "engagement";

// ─── Endurance Line Chart ─────────────────────────────────────────────────────
// Single useEffect([]) owns both IntersectionObserver and chart lifecycle.
// This eliminates the two-effect chain (IO → setState → chart effect) which
// caused an extra render and left a window where cleanup could miss the chart.
function EnduranceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<unknown>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let isActive = true;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect(); // once: true — stop watching immediately

        if (chartRef.current) return; // already created on a previous mount

        const mod = await _chartImport;
        if (!isActive) return; // unmounted while awaiting (first load only)

        const ctx = canvas.getContext("2d");
        if (!ctx || !isActive) return;

        chartRef.current = new (mod.default as new (...args: unknown[]) => unknown)(
          ctx,
          {
            type: "line",
            data: {
              labels: ["0 min","5 min","10 min","15 min","20 min","25 min","30 min"],
              datasets: [
                {
                  label: "Expected Baseline",
                  data: [95, 92, 88, 85, 80, 78, 75],
                  borderColor: "#D1D5DB",
                  borderDash: [6, 4],
                  borderWidth: 2,
                  tension: 0.4,
                  pointRadius: 0,
                  fill: false,
                },
                {
                  label: "Observed Focus",
                  data: [94, 90, 75, 58, 45, 40, 38],
                  borderColor: "#F5C518",
                  backgroundColor: "rgba(245, 197, 24, 0.10)",
                  borderWidth: 3,
                  fill: true,
                  tension: 0.4,
                  pointBackgroundColor: "#F5C518",
                  pointBorderColor: "#fff",
                  pointBorderWidth: 2,
                  pointRadius: 5,
                  pointHoverRadius: 7,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              animation: { duration: 1200, easing: "easeInOutQuart" },
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    boxWidth: 12,
                    usePointStyle: true,
                    color: "#6B7280",
                    font: { family: "Inter, sans-serif", size: 12 },
                    padding: 20,
                  },
                },
                tooltip: {
                  backgroundColor: "#1A1A1A",
                  titleColor: "#F5C518",
                  bodyColor: "#F3F4F6",
                  padding: 12,
                  cornerRadius: 10,
                  callbacks: { label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` },
                },
              },
              scales: {
                y: {
                  beginAtZero: false, min: 30, max: 100,
                  title: { display: true, text: "Focus Level (%)", color: "#9CA3AF", font: { size: 11 } },
                  grid: { color: "#F3F4F6" },
                  ticks: { color: "#9CA3AF", font: { size: 11 } },
                },
                x: {
                  title: { display: true, text: "Time on Task", color: "#9CA3AF", font: { size: 11 } },
                  grid: { display: false },
                  ticks: { color: "#9CA3AF", font: { size: 11 } },
                },
              },
            },
          },
        );
      },
      { threshold: 0.4 },
    );

    observer.observe(container);

    return () => {
      isActive = false;
      observer.disconnect(); // guaranteed cleanup — no leaked IO
      if (chartRef.current) {
        (chartRef.current as { destroy: () => void }).destroy();
        chartRef.current = null;
      }
    };
  }, []); // empty deps: runs once on mount, cleanup on unmount

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: "260px", width: "100%" }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}

// ─── Impact Radar Chart ───────────────────────────────────────────────────────
// function ImpactRadarChart() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const isInView = useInView(containerRef, { once: true, amount: 0.4 });
//   const chartRef = useRef<unknown>(null);

//   useEffect(() => {
//     if (!isInView || !canvasRef.current) return;

//     let isActive = true;

//     async function init() {
//       const mod = await _chartImport;
//       if (!isActive) return;
//       if (chartRef.current) return; // already mounted — do not recreate
//       const Chart = mod.default;

//       const ctx = canvasRef.current!.getContext("2d");
//       if (!ctx || !isActive) return;

//       chartRef.current = new Chart(ctx, {
//         type: "radar",
//         data: {
//           labels: [
//             "Digital Distractions",
//             "Sleep Deficit",
//             "Rote Learning",
//             "Nutrition",
//             "Home Routines",
//           ],
//           datasets: [
//             {
//               label: "Impact on Focus",
//               data: [90, 65, 85, 40, 75],
//               backgroundColor: "rgba(245, 197, 24, 0.18)",
//               borderColor: "#F5C518",
//               borderWidth: 2,
//               pointBackgroundColor: "#F5C518",
//               pointBorderColor: "#fff",
//               pointBorderWidth: 2,
//               pointRadius: 5,
//               pointHoverRadius: 7,
//             },
//           ],
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           animation: { duration: 1000 },
//           plugins: {
//             legend: { display: false },
//             tooltip: {
//               backgroundColor: "#1A1A1A",
//               titleColor: "#F5C518",
//               bodyColor: "#F3F4F6",
//               padding: 12,
//               cornerRadius: 10,
//               callbacks: {
//                 label: (ctx: any) => ` Severity: ${ctx.parsed.r}%`,
//               },
//             },
//           },
//           scales: {
//             r: {
//               min: 0,
//               max: 100,
//               angleLines: { color: "#F3F4F6" },
//               grid: { color: "#F3F4F6" },
//               pointLabels: {
//                 color: "#6B7280",
//                 font: { size: 11, family: "Inter, sans-serif" },
//               },
//               ticks: { display: false },
//             },
//           },
//         },
//       });
//     }

//     init();

//     return () => {
//       isActive = false;
//       if (chartRef.current) {
//         (chartRef.current as { destroy: () => void }).destroy();
//         chartRef.current = null;
//       }
//     };
//   }, [isInView]);

//   return (
//     <div
//       ref={containerRef}
//       style={{ position: "relative", height: "260px", width: "100%" }}
//     >
//       <canvas ref={canvasRef} />
//     </div>
//   );
//} 

// ─── Engagement Bar Chart ─────────────────────────────────────────────────────
function EngagementBarChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<unknown>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let isActive = true;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        if (chartRef.current) return;

        const mod = await _chartImport;
        if (!isActive) return;

        const ctx = canvas.getContext("2d");
        if (!ctx || !isActive) return;

        chartRef.current = new (mod.default as new (...args: unknown[]) => unknown)(ctx, {
          type: "bar",
          data: {
            labels: ["Passive Reading","Standard Lecture","Interactive Q&A","Gamified Practice"],
            datasets: [{
              label: "Minutes of Sustained Engagement",
              data: [8, 12, 22, 28],
              backgroundColor: ["#94A3B8","#CBD5E1","#2BBCB0","#F5C518"],
              borderRadius: 8,
              borderSkipped: false,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1000, easing: "easeOutQuart" },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "#1A1A1A",
                titleColor: "#F5C518",
                bodyColor: "#F3F4F6",
                padding: 12,
                cornerRadius: 10,
                callbacks: { label: (ctx: any) => ` ${ctx.parsed.y} minutes engaged` },
              },
            },
            scales: {
              y: {
                beginAtZero: true, max: 35,
                title: { display: true, text: "Minutes of Focus", color: "#9CA3AF", font: { size: 11 } },
                grid: { color: "#F3F4F6" },
                ticks: { color: "#9CA3AF", font: { size: 11 } },
              },
              x: {
                grid: { display: false },
                ticks: { color: "#6B7280", font: { size: 11 } },
              },
            },
          },
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(container);

    return () => {
      isActive = false;
      observer.disconnect();
      if (chartRef.current) {
        (chartRef.current as { destroy: () => void }).destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: "260px", width: "100%" }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}

// ─── Impulsivity Progress Bar — static data ───────────────────────────────────
// Defined at module scope so the animate target objects are stable references.
// Inline objects inside map() create new references every render, causing
// Framer Motion to re-trigger animations unnecessarily.
const IMPULSE_BARS = [
  { label: "Ages 8–10",  pct: 78, color: "#F4845F", animateIn: { width: "78%" }, animateOut: { width: 0 } },
  { label: "Ages 11–13", pct: 68, color: "#F5C518", animateIn: { width: "68%" }, animateOut: { width: 0 } },
  { label: "Ages 14–16", pct: 55, color: "#2BBCB0", animateIn: { width: "55%" }, animateOut: { width: 0 } },
] as const;

// Hoisted transition — same object reference on every render
const BAR_TRANSITION = { duration: 1, delay: 0.2, ease: "easeOut" } as const;

// ─── Impulsivity Progress Bar ─────────────────────────────────────────────────
function ImpulsivityVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ display: "flex", flexDirection: "column", gap: 20 }}
    >
      <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>
        Percentage of observed errors caused by impulsive action — not lack of
        understanding.
      </p>
      {IMPULSE_BARS.map((b) => (
        <div key={b.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}>
              {b.label}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: b.color, fontFamily: "var(--font-nunito)" }}>
              {b.pct}%
            </span>
          </div>
          <div style={{ height: 10, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? b.animateIn : b.animateOut}
              transition={BAR_TRANSITION}
              style={{ height: "100%", background: b.color, borderRadius: 99 }}
            />
          </div>
        </div>
      ))}
      <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
        Source: Controlled digital testing across 800+ children, India 2025
      </p>
    </div>
  );
}

// ─── Tab data ─────────────────────────────────────────────────────────────────
const tabs: {
  id: Tab;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    id: "endurance",
    label: "Attention Endurance",
    icon: TrendingDown,
    color: "#F5C518",
  },
  { id: "impulse", label: "Impulse Control", icon: Zap, color: "#F4845F" },
  {
    id: "engagement",
    label: "What Actually Works",
    icon: Brain,
    color: "#2BBCB0",
  },
];

const tabMeta: Record<
  Tab,
  {
    headline: string;
    stat: string;
    statLabel: string;
    body: string;
    source: string;
  }
> = {
  endurance: {
    headline: "Children lose 42% of their focus after just 15 minutes",
    stat: "~42%",
    statLabel: "Focus drop after 15 min",
    body: "While children start tasks with adequate attention, sustained engagement collapses rapidly. The gap between expected and observed focus is widest between ages 10–13 — exactly when academic demands peak.",
    source: "Cognitive Endurance Study, Indian Schools 2025 · n=1,200 children",
  },
  impulse: {
    headline: "68% of classroom errors are impulsive — not knowledge gaps",
    stat: "68%",
    statLabel: "Errors from impulsivity",
    body: "Short-form digital content trains children's brains to expect instant feedback. This erodes the capacity to pause, think, and respond deliberately — a skill critical for exams, social situations, and career success.",
    source: "Behavioural Assessment Report, India 2025 · n=800 children",
  },
  engagement: {
    headline: "Gamified, interactive learning sustains focus 3.5× longer",
    stat: "3.5×",
    statLabel: "Longer focus vs passive",
    body: "Passive reading holds attention for 8 minutes. Gamified, structured practice holds it for 28. Go Kids workshops are built around this principle — every session is interactive, not a video lecture.",
    source: "Engagement Research, EdTech India 2025 · n=500 children",
  },
};

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function InsightsSection() {
  const [activeTab, setActiveTab] = useState<Tab>("endurance");
  const meta = tabMeta[activeTab];

  return (
    <section
      id="insights"
      className="py-4 scroll-mt-24"
      style={{ background: "#FAFAF8" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <FadeInUp className="text-center mb-12">
          <p
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: "#2BBCB0", fontFamily: "var(--font-nunito)" }}
          >
            Research & Insights
          </p>
          <h2
            style={{
              fontFamily: "var(--font-nunito)",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 42px)",
              color: "#1A1A1A",
              marginBottom: 12,
            }}
          >
            The data behind why Go Kids exists
          </h2>
          <p
            className="text-base max-w-2xl mx-auto"
            style={{ color: "#6B7280" }}
          >
            India&apos;s children have the ability. What they lack is the
            structured environment to build the cognitive skills that turn
            potential into consistent performance.
          </p>
        </FadeInUp>

        {/* ── 3 stat pills ── */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            {
              value: "~42%",
              label: "Attention drop after 15 mins of structured tasks",
              color: "#F5C518",
              bg: "#FFF8DC",
            },
            {
              value: "68%",
              label: "Of classroom errors caused by impulse, not ignorance",
              color: "#F4845F",
              bg: "#FFF0EB",
            },
            {
              value: "3.5×",
              label: "Interactive >>> Passive learning for focus",
              color: "#2BBCB0",
              bg: "#E8F8F7",
            },
          ].map((s) => (
            <StaggerItem key={s.value}>
              <div
                className="rounded-2xl p-6 text-center card-hover"
                style={{
                  background: s.bg,
                  border: `1px solid ${s.color}33`,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-nunito)",
                    fontWeight: 800,
                    fontSize: 40,
                    color: s.color,
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {s.value}
                </p>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>
                  {s.label}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* ── Tab nav ── */}
        <FadeInUp className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(t.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border"
                style={{
                  fontFamily: "var(--font-nunito)",
                  backgroundColor: active ? "#101828" : "#FFFFFF",
                  borderColor: active ? t.color : "#E5E7EB",
                  color: active ? "#FFFFFF" : "#6B7280",
                  boxShadow: active ? `0 4px 12px ${t.color}40` : "none",
                }}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </FadeInUp>

        {/* ── Tab content ── */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "#FFFFFF",
              border: "1px solid #F3F4F6",
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
            }}
          >
            {/* Content card header */}
            <div
              className="px-8 py-6"
              style={{ borderBottom: "1px solid #F3F4F6" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Big stat */}
                <div
                  className="shrink-0 rounded-2xl px-6 py-4 text-center"
                  style={{
                    background:
                      activeTab === "endurance"
                        ? "#FFF8DC"
                        : activeTab === "impulse"
                          ? "#FFF0EB"
                          : "#E8F8F7",
                    minWidth: 110,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-nunito)",
                      fontWeight: 800,
                      fontSize: 36,
                      color:
                        activeTab === "endurance"
                          ? "#F5C518"
                          : activeTab === "impulse"
                            ? "#F4845F"
                            : "#2BBCB0",
                      lineHeight: 1,
                    }}
                  >
                    {meta.stat}
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
                    {meta.statLabel}
                  </p>
                </div>

                {/* Headline + body */}
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-nunito)",
                      fontWeight: 800,
                      fontSize: "clamp(16px, 2.2vw, 22px)",
                      color: "#1A1A1A",
                      marginBottom: 6,
                      lineHeight: 1.25,
                    }}
                  >
                    {meta.headline}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#6B7280",
                      lineHeight: 1.65,
                      maxWidth: 600,
                    }}
                  >
                    {meta.body}
                  </p>
                </div>
              </div>
            </div>

            {/* Chart area */}
            <div className="px-8 py-8">
              {activeTab === "endurance" && <EnduranceChart />}
              {activeTab === "impulse" && <ImpulsivityVisual />}
              {activeTab === "engagement" && <EngagementBarChart />}
            </div>

            {/* Source + CTA footer */}
            <div
              className="px-8 py-5 flex flex-col items-center sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-left"
              style={{ borderTop: "1px solid #F3F4F6", background: "#FAFAF8" }}
            >
              <p
                style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic" }}
              >
                📊 {meta.source}
              </p>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex justify-center w-full sm:w-auto"
              >
                <Link
                  href="/assessments"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all"
                  style={{
                    background: "#F5C518",
                    color: "#1A1A1A",
                    fontFamily: "var(--font-nunito)",
                    boxShadow: "0 2px 10px rgba(245,197,24,0.35)",
                  }}
                >
                  See how Go Kids helps <ArrowRight size={15} />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── Bottom investor callout ── */}
        <FadeInUp className="mt-10">
          <div
            className="rounded-2xl px-8 py-6 flex flex-col items-center sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-left"
            style={{
              background: "linear-gradient(135deg, #FFFDF9 0%, #FFF6F0 100%)",
              border: "1px solid #FFE3D8",
              boxShadow: "0 10px 30px rgba(244, 132, 95, 0.06)",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-nunito)",
                  fontWeight: 800,
                  fontSize: 20,
                  color: "#1A1A1A",
                  marginBottom: 6,
                }}
              >
                The market opportunity is{" "}
                <span style={{ color: "#F4845F" }}>now</span>.
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                  maxWidth: 520,
                  lineHeight: 1.6,
                }}
              >
                280 million school-age children in India. Less than 2% have
                access to structured cognitive skill-building. Go Kids is
                closing that gap — one child at a time.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="#about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300"
                style={{
                  background: "#101828",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-nunito)",
                  boxShadow: "0 4px 12px rgba(16, 24, 40, 0.15)",
                }}
              >
                Our Vision <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
