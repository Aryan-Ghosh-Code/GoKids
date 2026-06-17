"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Star,
  ArrowLeft,
  Clock,
  Users,
  BarChart2,
  Calendar,
  CheckCircle2,
  BookOpen,
  Award,
  Play,
  ChevronRight,
  MessageSquare,
  ArrowRight,
  Zap,
} from "lucide-react";

import type { Workshop } from "@/lib/data/workshops";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function levelColor(level: string) {
  if (level === "Beginner")     return { bg: "rgba(43,188,176,0.12)",  text: "#1A7A72" };
  if (level === "Intermediate") return { bg: "rgba(244,132,95,0.12)",  text: "#C0532A" };
  return                               { bg: "rgba(56,189,248,0.12)",  text: "#0369A1" };
}

// ─── Star rating ──────────────────────────────────────────────────────────────
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          fill={s <= Math.round(rating) ? "#F5C518" : "none"}
          stroke={s <= Math.round(rating) ? "#F5C518" : "#D1D5DB"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

// ─── Section heading ─────────────────────────────────────────────────────────
function SectionHeading({
  icon,
  title,
  accent = "#F5C518",
}: {
  icon: React.ReactNode;
  title: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-7">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accent + "22", color: accent }}
      >
        {icon}
      </div>
      <h2
        className="text-xl font-extrabold"
        style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
      >
        {title}
      </h2>
    </div>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────
function AccordionSection({
  title,
  lessons,
  index,
}: {
  title: string;
  lessons: Workshop["curriculum"][number]["lessons"];
  index: number;
}) {
  const [open, setOpen] = useState(index === 0);
  const totalTime = lessons.reduce((acc, l) => {
    const m = parseInt(l.duration);
    return acc + (isNaN(m) ? 0 : m);
  }, 0);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-shadow"
      style={{
        border: "1px solid #E5E7EB",
        boxShadow: open ? "0 4px 16px rgba(43,188,176,0.08)" : "none",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
        style={{ background: open ? "#F0FDFB" : "white" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0"
            style={{ background: "#2BBCB0", color: "white", fontFamily: "var(--font-nunito)" }}
          >
            {index + 1}
          </span>
          <span
            className="font-bold text-sm"
            style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
          >
            {title}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="text-xs font-semibold hidden sm:inline" style={{ color: "#9CA3AF" }}>
            {lessons.length} lessons · {totalTime} min
          </span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}>
            <ChevronDown size={16} color="#6B7280" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ borderTop: "1px solid #E5E7EB" }}>
              {lessons.map((lesson, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[#FAFAFA]"
                  style={{ borderBottom: i < lessons.length - 1 ? "1px solid #F3F4F6" : "none" }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: "#F3F4F6", color: "#6B7280" }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="flex-1 text-sm"
                    style={{ color: "#374151", fontFamily: "var(--font-nunito)" }}
                  >
                    {lesson.title}
                  </span>
                  <span
                    className="text-xs font-semibold flex items-center gap-1 shrink-0"
                    style={{ color: "#9CA3AF" }}
                  >
                    <Clock size={11} />
                    {lesson.duration}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Enrollment Sidebar ───────────────────────────────────────────────────────
function EnrollSidebar({ workshop }: { workshop: Workshop }) {
  const stats = [
    { icon: <Play size={14} />,       label: "Sessions",  value: `${workshop.sessions} live sessions` },
    { icon: <Clock size={14} />,      label: "Duration",  value: workshop.duration },
    { icon: <BarChart2 size={14} />,  label: "Level",     value: workshop.level },
    { icon: <Calendar size={14} />,   label: "Age Group", value: `Ages ${workshop.ageGroup}` },
    { icon: <Users size={14} />,      label: "Enrolled",  value: `${workshop.enrolledCount.toLocaleString()} learners` },
  ];

  return (
    <div
      className="sticky top-24 rounded-3xl overflow-hidden"
      style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.14)", border: "1px solid #F3F4F6" }}
    >
      {/* Thumbnail with play overlay */}
      <div className="relative w-full group cursor-pointer" style={{ aspectRatio: "16/9" }}>
        <Image
          src={workshop.thumbnail}
          alt={workshop.title}
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          className="object-cover"
        />
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity"
          style={{ background: "rgba(0,0,0,0.28)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: "#F5C518", boxShadow: "0 4px 24px rgba(245,197,24,0.5)" }}
          >
            <Play size={20} fill="#1A1A1A" color="#1A1A1A" style={{ marginLeft: 2 }} />
          </div>
        </div>
      </div>

      <div className="p-6" style={{ background: "white" }}>
        {/* Free badge */}
        <div className="flex items-center gap-3 mb-5">
          <span
            className="text-3xl font-extrabold"
            style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
          >
            FREE
          </span>
          <span
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: "rgba(245,197,24,0.18)", color: "#92700A" }}
          >
            ✦ Always free
          </span>
        </div>

        {/* Enroll CTA */}
        <motion.button
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl text-base font-extrabold mb-3 transition-shadow flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, #F5C518 0%, #FFD740 100%)",
            color: "#1A1A1A",
            fontFamily: "var(--font-nunito)",
            boxShadow: "0 8px 24px rgba(245,197,24,0.45)",
          }}
        >
          Enroll for Free
          <ArrowRight size={17} />
        </motion.button>
        <p className="text-xs text-center mb-6" style={{ color: "#9CA3AF", fontFamily: "var(--font-nunito)" }}>
          No credit card required · Cancel anytime
        </p>

        {/* Stats list */}
        <div className="space-y-3 mb-6">
          {stats.map(({ icon, label, value }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2" style={{ color: "#6B7280", fontFamily: "var(--font-nunito)" }}>
                <span style={{ color: "#2BBCB0" }}>{icon}</span>
                {label}
              </span>
              <span className="font-bold" style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#F3F4F6", margin: "0 0 16px" }} />

        {/* Instructor mini-card */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0" style={{ border: "2px solid #F5C518" }}>
            <Image
              src={workshop.instructor.avatar}
              alt={workshop.instructor.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}>
              {workshop.instructor.name}
            </p>
            <p className="text-xs" style={{ color: "#6B7280" }}>{workshop.instructor.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Avatar colours for review initials ──────────────────────────────────────
const AVATAR_COLORS = [
  { bg: "#FFF9E6", text: "#92700A" },
  { bg: "#E8F8F7", text: "#1A7A72" },
  { bg: "#FEF0EB", text: "#C0532A" },
  { bg: "#E8F6FE", text: "#0369A1" },
];

// ─── Section divider ─────────────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div className="flex items-center gap-4 my-12">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, #E5E7EB, transparent)" }} />
      <div className="w-2 h-2 rounded-full" style={{ background: "#E5E7EB" }} />
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, #E5E7EB, transparent)" }} />
    </div>
  );
}

// ─── Mobile sticky enroll bar ─────────────────────────────────────────────────
function MobileEnrollBar({ workshop }: { workshop: Workshop }) {
  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 px-4 py-3"
      style={{
        background: "white",
        borderTop: "1px solid #E5E7EB",
        boxShadow: "0 -8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div className="flex items-center gap-3">
        <div>
          <p className="text-xs font-semibold" style={{ color: "#9CA3AF" }}>Workshop</p>
          <p className="text-base font-extrabold" style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}>
            FREE
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-3.5 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, #F5C518 0%, #FFD740 100%)",
            color: "#1A1A1A",
            fontFamily: "var(--font-nunito)",
            boxShadow: "0 6px 20px rgba(245,197,24,0.4)",
          }}
        >
          Enroll for Free
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function WorkshopDetailClient({ workshop }: { workshop: Workshop }) {
  const lc = levelColor(workshop.level);

  const totalLessons = workshop.curriculum.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalMins = workshop.curriculum.reduce(
    (acc, s) => acc + s.lessons.reduce((a, l) => { const m = parseInt(l.duration); return a + (isNaN(m) ? 0 : m); }, 0),
    0
  );

  return (
    <main style={{ background: "#F7F8FA", minHeight: "100vh", paddingBottom: "80px" }}>

      {/* ── HERO BANNER ───────────────────────────────────────────────────────── */}
      <div className="relative w-full pt-16" style={{ minHeight: 480 }}>
        <Image
          src={workshop.thumbnail}
          alt={workshop.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 30%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(175deg, rgba(8,8,8,0.45) 0%, rgba(8,8,8,0.65) 40%, rgba(8,8,8,0.92) 75%, #0a0a0a 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(43,188,176,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Breadcrumb */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7">
          <nav className="flex items-center gap-2 text-xs font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/workshops" className="hover:text-white transition-colors flex items-center gap-1.5">
              <ArrowLeft size={12} />
              Workshops
            </Link>
            <span>/</span>
            <span
              className="truncate max-w-[180px] sm:max-w-[300px]"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {workshop.title}
            </span>
          </nav>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
          {/* Chips */}
          <motion.div
            className="flex flex-wrap gap-2 mb-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {workshop.isFree && (
              <span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold"
                style={{ background: "#F5C518", color: "#1A1A1A" }}
              >
                ✦ FREE
              </span>
            )}
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: "rgba(255,255,255,0.10)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(6px)",
              }}
            >
              {workshop.level}
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: "rgba(43,188,176,0.18)",
                color: "#2BBCB0",
                border: "1px solid rgba(43,188,176,0.3)",
              }}
            >
              Ages {workshop.ageGroup}
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: "rgba(56,189,248,0.15)",
                color: "#38BDF8",
                border: "1px solid rgba(56,189,248,0.3)",
              }}
            >
              {workshop.skill}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-extrabold leading-tight mb-4"
            style={{
              fontFamily: "var(--font-nunito)",
              color: "white",
              fontSize: "clamp(28px, 4.5vw, 52px)",
              maxWidth: 760,
              textShadow: "0 2px 24px rgba(0,0,0,0.5)",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            {workshop.title}
          </motion.h1>

          {/* Short description */}
          <motion.p
            className="mb-7 max-w-2xl leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.78)",
              fontFamily: "var(--font-nunito)",
              fontSize: "clamp(14px, 1.5vw, 17px)",
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            {workshop.shortDescription}
          </motion.p>

          {/* Meta row */}
          <motion.div
            className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.18 }}
          >
            <div className="flex items-center gap-1.5">
              <Star size={15} fill="#F5C518" stroke="#F5C518" strokeWidth={1} />
              <span className="font-extrabold text-white">{workshop.rating}</span>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                ({workshop.reviews.length} reviews)
              </span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>|</span>
            <div className="flex items-center gap-1.5">
              <Users size={13} style={{ color: "#2BBCB0" }} />
              <span style={{ color: "rgba(255,255,255,0.85)" }}>
                <strong className="text-white">{workshop.enrolledCount.toLocaleString()}</strong> enrolled
              </span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>|</span>
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0" style={{ border: "1.5px solid #F5C518" }}>
                <Image src={workshop.instructor.avatar} alt={workshop.instructor.name} fill className="object-cover" />
              </div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                By <strong style={{ color: "#F5C518" }}>{workshop.instructor.name}</strong>
              </span>
            </div>
          </motion.div>

          {/* Quick-stat chips */}
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            {[
              { icon: <Play size={11} />,      label: `${workshop.sessions} Sessions` },
              { icon: <Clock size={11} />,     label: workshop.duration },
              { icon: <Calendar size={11} />,  label: `Ages ${workshop.ageGroup}` },
            ].map(({ icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span style={{ color: "#2BBCB0" }}>{icon}</span>
                {label}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── LEFT: scrollable content ─────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-0">

            {/* ════ 1. WHAT YOUR CHILD WILL LEARN ════ */}
            <motion.section
              id="overview"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading icon={<Zap size={18} />} title="What your child will learn" accent="#F5C518" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {workshop.highlights.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="flex items-start gap-3 p-4 rounded-2xl"
                    style={{ background: "white", border: "1px solid #F3F4F6", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
                  >
                    <CheckCircle2 size={18} color="#2BBCB0" className="shrink-0 mt-0.5" />
                    <span
                      className="text-sm leading-relaxed"
                      style={{ color: "#374151", fontFamily: "var(--font-nunito)" }}
                    >
                      {h}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* About */}
              <div
                className="rounded-2xl p-6"
                style={{ background: "white", border: "1px solid #F3F4F6", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
              >
                <h3
                  className="text-base font-extrabold mb-3 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
                >
                  <span className="w-1 h-5 rounded-full inline-block" style={{ background: "#2BBCB0" }} />
                  About this workshop
                </h3>
                <p
                  className="text-sm leading-loose"
                  style={{ color: "#6B7280", fontFamily: "var(--font-nunito)" }}
                >
                  {workshop.longDescription}
                </p>
              </div>

              {/* Requirements */}
              {workshop.requirements.length > 0 && (
                <div
                  className="rounded-2xl p-6 mt-4"
                  style={{ background: "white", border: "1px solid #F3F4F6", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
                >
                  <h3
                    className="text-base font-extrabold mb-3 flex items-center gap-2"
                    style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
                  >
                    <span className="w-1 h-5 rounded-full inline-block" style={{ background: "#F4845F" }} />
                    Requirements
                  </h3>
                  <ul className="space-y-2.5">
                    {workshop.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#6B7280" }}>
                        <ChevronRight size={16} color="#F4845F" className="shrink-0 mt-0.5" />
                        <span style={{ fontFamily: "var(--font-nunito)" }}>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-5">
                {workshop.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: "#F3F4F6", color: "#374151", fontFamily: "var(--font-nunito)" }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.section>

            <SectionDivider />

            {/* ════ 2. CURRICULUM ════ */}
            <motion.section
              id="curriculum"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading icon={<BookOpen size={18} />} title="Course Curriculum" accent="#2BBCB0" />

              {/* Summary strip */}
              <div
                className="flex flex-wrap gap-6 mb-6 px-5 py-4 rounded-2xl"
                style={{ background: "white", border: "1px solid #F3F4F6", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
              >
                {[
                  { label: "Sections",  value: workshop.curriculum.length.toString() },
                  { label: "Lessons",   value: totalLessons.toString() },
                  { label: "Duration",  value: `${totalMins} min total` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-lg font-extrabold" style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}>{value}</span>
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>{label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {workshop.curriculum.map((section, i) => (
                  <AccordionSection key={i} index={i} title={section.title} lessons={section.lessons} />
                ))}
              </div>
            </motion.section>

            <SectionDivider />

            {/* ════ 3. INSTRUCTOR ════ */}
            <motion.section
              id="instructor"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading icon={<Award size={18} />} title="Your Instructor" accent="#F4845F" />

              <div
                className="rounded-3xl overflow-hidden"
                style={{ border: "1px solid #F3F4F6", background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
              >
                {/* Gradient banner */}
                <div
                  className="h-24 w-full"
                  style={{ background: "linear-gradient(135deg, #2BBCB0 0%, #F5C518 100%)" }}
                />
                <div className="px-6 pb-7">
                  <div className="-mt-12 mb-5 flex items-end gap-4">
                    <div
                      className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0"
                      style={{ border: "4px solid white", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
                    >
                      <Image
                        src={workshop.instructor.avatar}
                        alt={workshop.instructor.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="pb-1">
                      <h3
                        className="text-xl font-extrabold"
                        style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
                      >
                        {workshop.instructor.name}
                      </h3>
                      <p className="text-sm font-semibold" style={{ color: "#2BBCB0" }}>
                        {workshop.instructor.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-5">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{ background: "#FFF9E6", color: "#92700A" }}
                    >
                      <Award size={12} />
                      {workshop.instructor.experience} experience
                    </span>
                  </div>

                  <p
                    className="text-sm leading-loose"
                    style={{ color: "#6B7280", fontFamily: "var(--font-nunito)" }}
                  >
                    {workshop.instructor.bio}
                  </p>
                </div>
              </div>
            </motion.section>

            <SectionDivider />

            {/* ════ 4. REVIEWS ════ */}
            <motion.section
              id="reviews"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading icon={<MessageSquare size={18} />} title="What Parents Are Saying" accent="#F5C518" />

              {/* Overall rating card */}
              <div
                className="flex flex-row items-stretch gap-0 mb-8 rounded-3xl overflow-hidden"
                style={{ border: "1px solid #F3F4F6", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
              >
                {/* Left: big score */}
                <div
                  className="flex flex-col items-center justify-center px-5 py-6 shrink-0"
                  style={{
                    background: "linear-gradient(160deg, #FFF9E6 0%, #FFFBEF 100%)",
                    minWidth: 100,
                    borderRight: "1px solid #F3F4F6",
                  }}
                >
                  <span
                    className="font-extrabold leading-none mb-2"
                    style={{
                      fontFamily: "var(--font-nunito)",
                      color: "#1A1A1A",
                      fontSize: "clamp(40px, 8vw, 64px)",
                    }}
                  >
                    {workshop.rating.toFixed(1)}
                  </span>
                  <StarRating rating={workshop.rating} size={16} />
                  <p
                    className="text-xs font-semibold mt-2 text-center"
                    style={{ color: "#9CA3AF", fontFamily: "var(--font-nunito)" }}
                  >
                    {workshop.reviews.length} reviews
                  </p>
                </div>

                {/* Right: rating bars */}
                <div
                  className="flex-1 flex flex-col justify-center gap-2 px-4 py-5"
                  style={{ background: "white", minWidth: 0 }}
                >
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = workshop.reviews.filter((r) => Math.round(r.rating) === stars).length;
                    const pct = workshop.reviews.length > 0 ? (count / workshop.reviews.length) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <span
                          className="text-xs font-bold w-3 text-right shrink-0"
                          style={{ color: pct > 0 ? "#1A1A1A" : "#D1D5DB" }}
                        >
                          {stars}
                        </span>
                        <Star size={9} fill={pct > 0 ? "#F5C518" : "#E5E7EB"} stroke="none" className="shrink-0" />
                        <div
                          className="flex-1 rounded-full overflow-hidden"
                          style={{ height: 8, background: "#F3F4F6", minWidth: 0 }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: pct >= 80 ? "#2BBCB0" : pct >= 40 ? "#F5C518" : "#E5E7EB",
                            }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                          />
                        </div>
                        <span
                          className="text-xs font-bold w-3 shrink-0"
                          style={{ color: count > 0 ? "#6B7280" : "#D1D5DB" }}
                        >
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review cards */}
              <div className="space-y-4">
                {workshop.reviews.map((r, i) => {
                  const ac = AVATAR_COLORS[i % AVATAR_COLORS.length];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      className="rounded-2xl overflow-hidden"
                      style={{ border: "1px solid #F3F4F6", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
                    >
                      <div
                        className="flex items-center justify-between px-5 pt-4 pb-3"
                        style={{ borderBottom: "1px solid #F9FAFB" }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0"
                            style={{ background: ac.bg, color: ac.text, fontFamily: "var(--font-nunito)" }}
                          >
                            {r.author.charAt(0)}
                          </div>
                          <div>
                            <span
                              className="font-bold text-sm block leading-tight"
                              style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
                            >
                              {r.author}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <StarRating rating={r.rating} size={11} />
                              <span className="text-xs" style={{ color: "#9CA3AF" }}>
                                {r.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{ background: "#E8F8F7", color: "#1A7A72" }}
                        >
                          ✓ Verified
                        </span>
                      </div>
                      <p
                        className="px-5 py-4 text-sm leading-relaxed"
                        style={{ color: "#6B7280", fontFamily: "var(--font-nunito)" }}
                      >
                        &ldquo;{r.comment}&rdquo;
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* ════ BOTTOM CTA STRIP ════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-12 rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              }}
            >
              <div className="px-7 py-8 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: "#F5C518" }}
                  >
                    ✦ Always Free
                  </p>
                  <h3
                    className="text-xl font-extrabold text-white mb-1"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    Ready to enroll your child?
                  </h3>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Join {workshop.enrolledCount.toLocaleString()}+ learners already enrolled
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="shrink-0 px-7 py-4 rounded-2xl text-base font-extrabold flex items-center gap-2 whitespace-nowrap"
                  style={{
                    background: "linear-gradient(135deg, #F5C518 0%, #FFD740 100%)",
                    color: "#1A1A1A",
                    fontFamily: "var(--font-nunito)",
                    boxShadow: "0 8px 24px rgba(245,197,24,0.4)",
                  }}
                >
                  Enroll for Free
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>

          </div>

          {/* ── RIGHT: Sticky sidebar ──────────────────────────────────────────── */}
          <div className="hidden lg:block w-[360px] shrink-0">
            <EnrollSidebar workshop={workshop} />
          </div>

        </div>
      </div>

      {/* Mobile sticky bottom enroll bar */}
      <MobileEnrollBar workshop={workshop} />
    </main>
  );
}
