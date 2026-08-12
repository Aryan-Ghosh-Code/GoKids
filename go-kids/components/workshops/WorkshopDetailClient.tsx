"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ArrowLeft,
  Clock,
  Users,
  Calendar,
  CheckCircle2,
  BookOpen,
  Award,
  Play,
  ChevronRight,
  Zap,
  MapPin,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Package,
} from "lucide-react";

import type { Workshop } from "@/lib/data/workshops";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import EnrollButton from "./EnrollButton";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInstructors = (workshop: Workshop) => {
  return workshop.instructors || [];
};

const getInstructorsNamesList = (instructors: any[]) => {
  if (instructors.length === 0) return "";
  if (instructors.length === 1) return instructors[0].name;
  if (instructors.length === 2)
    return `${instructors[0].name} & ${instructors[1].name}`;
  return `${instructors
    .slice(0, -1)
    .map((i) => i.name)
    .join(", ")}, & ${instructors[instructors.length - 1].name}`;
};

// ─── Star rating ──────────────────────────────────────────────────────────────
// function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
//   return (
//     <div className="flex items-center gap-0.5">
//       {[1, 2, 3, 4, 5].map((s) => (
//         <Star
//           key={s}
//           size={size}
//           fill={s <= Math.round(rating) ? "#F5C518" : "none"}
//           stroke={s <= Math.round(rating) ? "#F5C518" : "#D1D5DB"}
//           strokeWidth={1.5}
//         />
//       ))}
//     </div>
//   );
// }

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
  duration,
  lessons,
  index,
}: {
  title: string;
  duration: string;
  lessons: Workshop["curriculum"][number]["lessons"];
  index: number;
}) {
  const [open, setOpen] = useState(index === 0);

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
            style={{
              background: "#2BBCB0",
              color: "white",
              fontFamily: "var(--font-nunito)",
            }}
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
          <span
            className="text-xs font-semibold hidden sm:inline"
            style={{ color: "#9CA3AF" }}
          >
            {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"} · {duration}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.22 }}
          >
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
                  className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-[#FAFAFA]"
                  style={{
                    borderBottom:
                      i < lessons.length - 1 ? "1px solid #F3F4F6" : "none",
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{ background: "#F3F4F6", color: "#6B7280" }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold leading-snug mb-0.5"
                      style={{
                        color: "#1A1A1A",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      {lesson.title}
                    </p>
                    {lesson.description && (
                      <p
                        className="text-xs leading-relaxed"
                        style={{
                          color: "#6B7280",
                          fontFamily: "var(--font-inter)",
                        }}
                      >
                        {lesson.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: "1px solid #E5E7EB",
        boxShadow: open ? "0 4px 16px rgba(245,197,24,0.08)" : "none",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
        style={{ background: open ? "#FFFDF0" : "white" }}
      >
        <span
          className="font-bold text-sm pr-4"
          style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
        >
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          className="shrink-0"
        >
          <ChevronDown size={16} color="#6B7280" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <p
              className="px-5 py-4 text-sm leading-relaxed"
              style={{
                borderTop: "1px solid #F3F4F6",
                color: "#6B7280",
                fontFamily: "var(--font-inter)",
              }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Enrollment Sidebar (desktop) ─────────────────────────────────────────────
function EnrollSidebar({
  workshop,
  isLoggedIn,
  isEnrolled,
}: {
  workshop: Workshop;
  isLoggedIn: boolean;
  isEnrolled: boolean;
}) {
  const stats = [
    {
      icon: <Play size={14} />,
      label: "Sessions",
      value: `${workshop.sessions} live sessions`,
    },
    { icon: <Clock size={14} />, label: "Duration", value: workshop.duration },
    // { icon: <BarChart2 size={14} />, label: "Level", value: workshop.level },
    // {
    //   icon: <Calendar size={14} />,
    //   label: "Age Group",
    //   value: `Ages ${workshop.ageGroup}`,
    // },
    {
      icon: <Calendar size={14} />,
      label: "Date",
      value: workshop.date,
    },
    {
      icon: <Clock size={14} />,
      label: "Time",
      value: workshop.time,
    },
    ...(workshop.isOffline && workshop.venue
      ? [
          {
            icon: <MapPin size={14} />,
            label: "Venue",
            value: (
              <div className="flex flex-col items-end gap-1">
                <span className="font-bold text-right leading-tight max-w-47.5 block">
                  {workshop.venue}
                </span>
                {workshop.googleMapsUrl && (
                  <a
                    href={workshop.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-teal hover:underline flex items-center gap-0.5"
                  >
                    View in Google Maps ↗
                  </a>
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      icon: <Users size={14} />,
      label: "Enrolled",
      value: `${workshop.enrolledCount.toLocaleString()} learners`,
    },
  ];

  return (
    <div
      className="sticky top-24 rounded-3xl overflow-y-auto overscroll-contain"
      style={{
        boxShadow: "0 20px 60px rgba(0,0,0,0.14)",
        border: "1px solid #F3F4F6",
        maxHeight: "calc(100vh - 6rem - 24px)", // matches top-24 (96px) + a little breathing room
      }}
    >
      {/* Thumbnail with play overlay */}
      <div
        className="relative w-full group cursor-pointer"
        style={{ aspectRatio: "16/9" }}
      >
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
          {/* In future for video playbacks */}
          {/* <div
            className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
            style={{
              background: "#F5C518",
              boxShadow: "0 4px 24px rgba(245,197,24,0.5)",
            }}
          >
            <Play
              size={20}
              fill="#1A1A1A"
              color="#1A1A1A"
              style={{ marginLeft: 2 }}
            />
          </div> */}
        </div>
      </div>

      <div className="p-6" style={{ background: "white" }}>
        {/* Price / Free badge */}
        <div className="flex flex-col gap-1.5 mb-5">
          {workshop.isFree ? (
            <div className="flex items-center gap-3">
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
          ) : (
            <div className="flex flex-wrap items-baseline gap-2.5">
              <span
                className="text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
              >
                ₹{workshop.price?.toLocaleString("en-IN")}
              </span>
              {workshop.oldPrice && (
                <>
                  <span
                    className="text-base font-semibold line-through"
                    style={{ color: "#9CA3AF", fontFamily: "var(--font-nunito)" }}
                  >
                    ₹{workshop.oldPrice.toLocaleString("en-IN")}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-extrabold"
                    style={{ background: "rgba(43,188,176,0.15)", color: "#1A7A72" }}
                  >
                    {Math.round(((workshop.oldPrice - (workshop.price ?? 0)) / workshop.oldPrice) * 100)}% off
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Enroll CTA */}
        <EnrollButton
          workshopId={workshop._id}
          price={workshop.price ?? 0}
          isFree={workshop.isFree}
          slug={workshop.slug}
          isLoggedIn={isLoggedIn}
          initialIsEnrolled={isEnrolled}
          isEnrollmentOpen={workshop.isEnrollmentOpen}
        />
        <p
          className="text-xs text-center mb-6"
          style={{ color: "#9CA3AF", fontFamily: "var(--font-nunito)" }}
        >
          {workshop.isFree
            ? "No credit card required · Cancel anytime"
            : "Secure payment · Instant access"}
        </p>

        {/* Stats list */}
        <div className="space-y-3 mb-6">
          {stats.map(({ icon, label, value }) => (
            <div
              key={label}
              className="flex items-start justify-between text-sm py-0.5"
            >
              <span
                className="flex items-center gap-2 pt-0.5"
                style={{ color: "#6B7280", fontFamily: "var(--font-nunito)" }}
              >
                <span style={{ color: "#2BBCB0", display: "inline-flex" }}>
                  {icon}
                </span>
                {label}
              </span>
              <span
                className="font-bold"
                style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#F3F4F6", margin: "0 0 16px" }} />

        {/* Instructor mini-card */}
        <div className="space-y-3">
          {getInstructors(workshop).map((ins) => (
            <div key={ins.name} className="flex items-center gap-3">
              <div
                className="relative w-11 h-11 rounded-full overflow-hidden shrink-0"
                style={{ border: "2px solid #F5C518" }}
              >
                <Image
                  src={ins.avatar}
                  alt={ins.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p
                  className="text-sm font-bold"
                  style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
                >
                  {ins.name}
                </p>
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  {ins.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile/Tablet key-details card (Date · Time · Venue) ─────────────────────
// Desktop hides the right sidebar below `lg`, so this card is what carries the
// date/time/venue info on phones and tablets. Placed right at the top of the
// body content so it's visible without any scrolling.
function MobileKeyDetails({ workshop }: { workshop: Workshop }) {
  const hasVenue = workshop.isOffline && workshop.venue;

  return (
    <div
      className="lg:hidden rounded-2xl p-4 mb-8"
      style={{
        background: "white",
        border: "1px solid #F3F4F6",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
      }}
    >
      <div
        className={`grid gap-4 ${hasVenue ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"}`}
      >
        <div className="flex items-start gap-2.5">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(43,188,176,0.12)", color: "#2BBCB0" }}
          >
            <Calendar size={15} />
          </span>
          <div className="min-w-0">
            <p
              className="text-[11px] font-semibold"
              style={{ color: "#9CA3AF" }}
            >
              Date
            </p>
            <p
              className="text-sm font-bold leading-tight"
              style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
            >
              {workshop.date}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(43,188,176,0.12)", color: "#2BBCB0" }}
          >
            <Clock size={15} />
          </span>
          <div className="min-w-0">
            <p
              className="text-[11px] font-semibold"
              style={{ color: "#9CA3AF" }}
            >
              Time
            </p>
            <p
              className="text-sm font-bold leading-tight"
              style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
            >
              {workshop.time}
            </p>
          </div>
        </div>

        {hasVenue && (
          <div className="flex items-start gap-2.5">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(43,188,176,0.12)", color: "#2BBCB0" }}
            >
              <MapPin size={15} />
            </span>
            <div className="min-w-0">
              <p
                className="text-[11px] font-semibold"
                style={{ color: "#9CA3AF" }}
              >
                Venue
              </p>
              <p
                className="text-sm font-bold leading-tight"
                style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
              >
                {workshop.venue}
              </p>
              {workshop.googleMapsUrl && (
                <a
                  href={workshop.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold hover:underline inline-block mt-0.5"
                  style={{ color: "#2BBCB0" }}
                >
                  View in Google Maps ↗
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Avatar colours for review initials ──────────────────────────────────────
// const AVATAR_COLORS = [
//   { bg: "#FFF9E6", text: "#92700A" },
//   { bg: "#E8F8F7", text: "#1A7A72" },
//   { bg: "#FEF0EB", text: "#C0532A" },
//   { bg: "#E8F6FE", text: "#0369A1" },
// ];

// ─── Section divider ─────────────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div className="flex items-center gap-4 my-12">
      <div
        className="flex-1 h-px"
        style={{
          background: "linear-gradient(to right, #E5E7EB, transparent)",
        }}
      />
      <div className="w-2 h-2 rounded-full" style={{ background: "#E5E7EB" }} />
      <div
        className="flex-1 h-px"
        style={{ background: "linear-gradient(to left, #E5E7EB, transparent)" }}
      />
    </div>
  );
}

// ─── Mobile sticky enroll bar ─────────────────────────────────────────────────
function MobileEnrollBar({
  workshop,
  isLoggedIn,
  isEnrolled,
}: {
  workshop: Workshop;
  isLoggedIn: boolean;
  isEnrolled: boolean;
}) {
  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 px-4 py-3"
      style={{
        background: "white",
        borderTop: "1px solid #E5E7EB",
        boxShadow: "0 -8px 24px rgba(0,0,0,0.08)",
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex flex-col gap-0.5">
          {workshop.isFree ? (
            <p
              className="text-base font-extrabold leading-none"
              style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
            >
              FREE
            </p>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <p
                className="text-base font-extrabold leading-none"
                style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
              >
                ₹{workshop.price?.toLocaleString("en-IN")}
              </p>
              {workshop.oldPrice && (
                <span
                  className="text-xs font-semibold line-through"
                  style={{ color: "#9CA3AF", fontFamily: "var(--font-nunito)" }}
                >
                  ₹{workshop.oldPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          )}
          <div
            className="text-[10px] font-bold leading-tight"
            style={{ color: "#6B7280", fontFamily: "var(--font-nunito)" }}
          >
            <div className="truncate">{workshop.date}</div>
            <div
              className="truncate text-[9px] font-medium"
              style={{ color: "#9CA3AF" }}
            >
              {workshop.time}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <EnrollButton
            workshopId={workshop._id}
            price={workshop.price ?? 0}
            isFree={workshop.isFree}
            slug={workshop.slug}
            isLoggedIn={isLoggedIn}
            initialIsEnrolled={isEnrolled}
            isEnrollmentOpen={workshop.isEnrollmentOpen}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function WorkshopDetailClient({
  workshop,
  isLoggedIn = false,
  isEnrolled = false,
}: {
  workshop: Workshop;
  isLoggedIn?: boolean;
  isEnrolled?: boolean;
}) {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");
  const enrolledStatus = searchParams.get("enrolled");

  const totalLessons = workshop.curriculum.reduce(
    (acc, s) => acc + s.lessons.length,
    0,
  );
  const totalMins = workshop.curriculum.reduce((acc, s) => {
    const m = parseInt(s.duration);
    return acc + (isNaN(m) ? 0 : m);
  }, 0);

  return (
    <main
      style={{
        background: "#F7F8FA",
        minHeight: "100vh",
        paddingBottom: "80px",
      }}
    >


      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      {paymentStatus === "failed" && (
        <div className="max-w-7xl mx-auto px-4 pt-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-2xl flex items-center gap-2 text-sm font-semibold">
            <span className="text-base">⚠️</span>
            Payment failed. Please try again.
          </div>
        </div>
      )}

      {enrolledStatus === "true" && (
        <div className="max-w-7xl mx-auto px-4 pt-4 sm:px-6 lg:px-8">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3.5 rounded-2xl flex items-center gap-2 text-sm font-semibold">
            <span className="text-base">🎉</span>
            You&apos;re enrolled! Welcome to the workshop.
          </div>
        </div>
      )}

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
            background:
              "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(43,188,176,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Breadcrumb */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7">
          <nav
            className="flex items-center gap-2 text-xs font-semibold"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href={
                workshop.audienceType === "parents"
                  ? "/workshops/parents"
                  : "/workshops/children"
              }
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={12} />
              Workshops
            </Link>
            <span>/</span>
            <span
              className="truncate max-w-45 sm:max-w-75"
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
              {workshop.ageGroup}
            </span>
            {(workshop.skills || []).map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full text-xs font-bold font-nunito"
                style={{
                  background: "rgba(56,189,248,0.15)",
                  color: "#38BDF8",
                  border: "1px solid rgba(56,189,248,0.3)",
                }}
              >
                {s}
              </span>
            ))}
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
              fontFamily: "var(--font-inter)",
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
              <Users size={13} style={{ color: "#2BBCB0" }} />
              <span style={{ color: "rgba(255,255,255,0.85)" }}>
                <strong className="text-white">
                  {workshop.enrolledCount.toLocaleString()}
                </strong>{" "}
                enrolled
              </span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>|</span>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex -space-x-1.5">
                {getInstructors(workshop).map((ins, index) => (
                  <div
                    key={ins.name}
                    className="relative w-6 h-6 rounded-full overflow-hidden shrink-0"
                    style={{
                      border: "1.5px solid #F5C518",
                      zIndex: getInstructors(workshop).length - index,
                    }}
                  >
                    <Image
                      src={ins.avatar}
                      alt={ins.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <span
                className="text-xs sm:text-sm"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                By{" "}
                <strong style={{ color: "#F5C518" }}>
                  {getInstructorsNamesList(getInstructors(workshop))}
                </strong>
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
              {
                icon: <Play size={11} />,
                label: `${workshop.sessions} Sessions`,
              },
              { icon: <Clock size={11} />, label: workshop.duration },
              {
                icon: <Calendar size={11} />,
                label: `${workshop.ageGroup}`,
              },
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
            {/* Mobile/Tablet only: Date · Time · Venue — hidden on lg since the
                sidebar covers this. Placed first so it's visible immediately. */}
            <MobileKeyDetails workshop={workshop} />

            {/* ════ 1. WHAT YOUR CHILD WILL LEARN ════ */}
            <motion.section
              id="overview"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading
                icon={<Zap size={18} />}
                title="What you'll walk away with"
                accent="#F5C518"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {workshop.highlights.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="flex items-start gap-3 p-4 rounded-2xl"
                    style={{
                      background: "white",
                      border: "1px solid #F3F4F6",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    }}
                  >
                    <CheckCircle2
                      size={18}
                      color="#2BBCB0"
                      className="shrink-0 mt-0.5"
                    />
                    <span
                      className="text-sm leading-relaxed"
                      style={{
                        color: "#374151",
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      {h}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* About */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "white",
                  border: "1px solid #F3F4F6",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <h3
                  className="text-base font-extrabold mb-3 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
                >
                  <span
                    className="w-1 h-5 rounded-full inline-block"
                    style={{ background: "#2BBCB0" }}
                  />
                  About this Workshop
                </h3>
                <p
                  className="text-sm leading-loose text-justify"
                  style={{ color: "#6B7280", fontFamily: "var(--font-inter)" }}
                >
                  {workshop.longDescription}
                </p>
              </div>

              {/* Requirements */}
              {workshop.requirements.length > 0 && (
                <div
                  className="rounded-2xl p-6 mt-4"
                  style={{
                    background: "white",
                    border: "1px solid #F3F4F6",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  }}
                >
                  <h3
                    className="text-base font-extrabold mb-3 flex items-center gap-2"
                    style={{
                      fontFamily: "var(--font-nunito)",
                      color: "#1A1A1A",
                    }}
                  >
                    <span
                      className="w-1 h-5 rounded-full inline-block"
                      style={{ background: "#F4845F" }}
                    />
                    Requirements
                  </h3>
                  <ul className="space-y-2.5">
                    {workshop.requirements.map((r, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm"
                        style={{ color: "#6B7280" }}
                      >
                        <ChevronRight
                          size={16}
                          color="#F4845F"
                          className="shrink-0 mt-0.5"
                        />
                        <span style={{ fontFamily: "var(--font-nunito)" }}>
                          {r}
                        </span>
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
                    style={{
                      background: "#F3F4F6",
                      color: "#374151",
                      fontFamily: "var(--font-nunito)",
                    }}
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
              <SectionHeading
                icon={<BookOpen size={18} />}
                title="Course Curriculum"
                accent="#2BBCB0"
              />

              {/* Summary strip */}
              <div
                className="flex flex-wrap gap-6 mb-6 px-5 py-4 rounded-2xl"
                style={{
                  background: "white",
                  border: "1px solid #F3F4F6",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                {[
                  {
                    label: "Modules",
                    value: workshop.curriculum.length.toString(),
                  },
                  { label: "Lessons", value: totalLessons.toString() },
                  { label: "Duration", value: `${totalMins} min total` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col">
                    <span
                      className="text-lg font-extrabold"
                      style={{
                        fontFamily: "var(--font-nunito)",
                        color: "#1A1A1A",
                      }}
                    >
                      {value}
                    </span>
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {workshop.curriculum.map((section, i) => (
                  <AccordionSection
                    key={i}
                    index={i}
                    title={section.title}
                    duration={section.duration}
                    lessons={section.lessons}
                  />
                ))}
              </div>
            </motion.section>

            <SectionDivider />

            {/* ════ 3. WHO IS THIS FOR / NOT FOR ════ */}
            {(workshop.whoIsItFor?.length || workshop.whoIsItNotFor?.length) && (
              <motion.section
                id="who-for"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
              >
                <SectionHeading
                  icon={<ThumbsUp size={18} />}
                  title="Is This Workshop For You?"
                  accent="#2BBCB0"
                />
                <div className={`grid gap-5 ${
                  workshop.whoIsItFor?.length && workshop.whoIsItNotFor?.length
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1"
                }`}>
                  {/* Who it IS for */}
                  {workshop.whoIsItFor?.length ? (
                    <div
                      className="rounded-2xl p-5"
                      style={{
                        background: "white",
                        border: "1px solid #D1FAF6",
                        boxShadow: "0 2px 8px rgba(43,188,176,0.06)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "rgba(43,188,176,0.12)", color: "#2BBCB0" }}
                        >
                          <ThumbsUp size={14} />
                        </span>
                        <h3
                          className="text-sm font-extrabold"
                          style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
                        >
                          This is for you if…
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {workshop.whoIsItFor.map((point, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle2
                              size={16}
                              color="#2BBCB0"
                              className="shrink-0 mt-0.5"
                            />
                            <span
                              className="text-sm leading-relaxed"
                              style={{ color: "#374151", fontFamily: "var(--font-inter)" }}
                            >
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Who it is NOT for */}
                  {workshop.whoIsItNotFor?.length ? (
                    <div
                      className="rounded-2xl p-5"
                      style={{
                        background: "white",
                        border: "1px solid #FDE8E0",
                        boxShadow: "0 2px 8px rgba(244,132,95,0.06)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "rgba(244,132,95,0.12)", color: "#F4845F" }}
                        >
                          <ThumbsDown size={14} />
                        </span>
                        <h3
                          className="text-sm font-extrabold"
                          style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
                        >
                          This is NOT for you if…
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {workshop.whoIsItNotFor.map((point, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span
                              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-extrabold"
                              style={{ background: "rgba(244,132,95,0.15)", color: "#F4845F" }}
                            >
                              ✕
                            </span>
                            <span
                              className="text-sm leading-relaxed"
                              style={{ color: "#374151", fontFamily: "var(--font-inter)" }}
                            >
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </motion.section>
            )}

            {(workshop.whoIsItFor?.length || workshop.whoIsItNotFor?.length) && <SectionDivider />}

            {/* ════ 4. TAKEAWAYS ════ */}
            {workshop.takeaways?.length > 0 && (
              <>
                <motion.section
                  id="takeaways"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                >
                  <SectionHeading
                    icon={<Package size={18} />}
                    title="What You Take Home"
                    accent="#F5C518"
                  />
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      background: "white",
                      border: "1px solid #F3F4F6",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    }}
                  >
                    <ul className="space-y-3">
                      {workshop.takeaways.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5"
                            style={{ background: "rgba(245,197,24,0.18)", color: "#92700A", fontFamily: "var(--font-nunito)" }}
                          >
                            {i + 1}
                          </span>
                          <span
                            className="text-sm leading-relaxed"
                            style={{ color: "#374151", fontFamily: "var(--font-inter)" }}
                          >
                            {item}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.section>
                <SectionDivider />
              </>
            )}

            {/* ════ 5. FAQs ════ */}
            {workshop.faqs?.length > 0 && (
              <>
                <motion.section
                  id="faqs"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                >
                  <SectionHeading
                    icon={<HelpCircle size={18} />}
                    title="Frequently Asked Questions"
                    accent="#F4845F"
                  />
                  <div className="space-y-3">
                    {workshop.faqs.map((faq, i) => (
                      <FaqItem
                        key={i}
                        index={i}
                        question={faq.question}
                        answer={faq.answer}
                      />
                    ))}
                  </div>
                </motion.section>
                <SectionDivider />
              </>
            )}

            {/* ════ 6. INSTRUCTOR ════ */}
            <motion.section
              id="instructor"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading
                icon={<Award size={18} />}
                title={
                  getInstructors(workshop).length > 1
                    ? "Your Instructors"
                    : "Your Instructor"
                }
                accent="#F4845F"
              />

              <div
                className={
                  getInstructors(workshop).length > 1
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "space-y-6"
                }
              >
                {getInstructors(workshop).map((ins) => (
                  <div
                    key={ins.name}
                    className="rounded-3xl p-6 bg-white border border-brand-grey h-full flex flex-col justify-between"
                    style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}
                  >
                    <div>
                      {/* Avatar + Info Block */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-5">
                        {/* Avatar */}
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-[#E5E7EB] bg-brand-offwhite">
                          <Image
                            src={ins.avatar}
                            alt={ins.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {/* Info */}
                        <div className="grow text-center sm:text-left pt-1">
                          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2.5 mb-1.5">
                            <h3
                              className="text-xl font-bold tracking-tight"
                              style={{
                                fontFamily: "var(--font-heading)",
                                color: "#1A1A1A",
                              }}
                            >
                              {ins.name}
                            </h3>
                            <span
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                              style={{
                                background: "#FFF9E6",
                                color: "#92700A",
                                border: "1px solid rgba(245,197,24,0.3)",
                              }}
                            >
                              <Award size={10} />
                              {ins.experience} Exp
                            </span>
                          </div>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "#2BBCB0" }}
                          >
                            {ins.title}
                          </p>
                        </div>
                      </div>

                      <p
                        className="text-sm leading-relaxed text-brand-grey-text text-justify"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {ins.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <SectionDivider />

            {/* ════ 4. REVIEWS ════ */}
            {/* <motion.section
              id="reviews"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading
                icon={<MessageSquare size={18} />}
                title="What Parents Are Saying"
                accent="#F5C518"
              /> */}

            {/* Overall rating card */}
            {/* <div
                className="flex flex-row items-stretch gap-0 mb-8 rounded-3xl overflow-hidden"
                style={{
                  border: "1px solid #F3F4F6",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                }}
              > */}
            {/* Left: big score */}
            {/* <div
                  className="flex flex-col items-center justify-center px-5 py-6 shrink-0"
                  style={{
                    background:
                      "linear-gradient(160deg, #FFF9E6 0%, #FFFBEF 100%)",
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
                    style={{
                      color: "#9CA3AF",
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    {workshop.reviews.length} reviews
                  </p>
                </div> */}

            {/* Right: rating bars */}
            {/* <div
                  className="flex-1 flex flex-col justify-center gap-2 px-4 py-5"
                  style={{ background: "white", minWidth: 0 }}
                >
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = workshop.reviews.filter(
                      (r) => Math.round(r.rating) === stars,
                    ).length;
                    const pct =
                      workshop.reviews.length > 0
                        ? (count / workshop.reviews.length) * 100
                        : 0;
                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <span
                          className="text-xs font-bold w-3 text-right shrink-0"
                          style={{ color: pct > 0 ? "#1A1A1A" : "#D1D5DB" }}
                        >
                          {stars}
                        </span>
                        <Star
                          size={9}
                          fill={pct > 0 ? "#F5C518" : "#E5E7EB"}
                          stroke="none"
                          className="shrink-0"
                        />
                        <div
                          className="flex-1 rounded-full overflow-hidden"
                          style={{
                            height: 8,
                            background: "#F3F4F6",
                            minWidth: 0,
                          }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background:
                                pct >= 80
                                  ? "#2BBCB0"
                                  : pct >= 40
                                    ? "#F5C518"
                                    : "#E5E7EB",
                            }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.7,
                              ease: "easeOut",
                              delay: 0.1,
                            }}
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
              </div> */}

            {/* Review cards */}
            {/* <div className="space-y-4">
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
                      style={{
                        border: "1px solid #F3F4F6",
                        background: "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                      }}
                    >
                      <div
                        className="flex items-center justify-between px-5 pt-4 pb-3"
                        style={{ borderBottom: "1px solid #F9FAFB" }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0"
                            style={{
                              background: ac.bg,
                              color: ac.text,
                              fontFamily: "var(--font-nunito)",
                            }}
                          >
                            {r.author.charAt(0)}
                          </div>
                          <div>
                            <span
                              className="font-bold text-sm block leading-tight"
                              style={{
                                fontFamily: "var(--font-nunito)",
                                color: "#1A1A1A",
                              }}
                            >
                              {r.author}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <StarRating rating={r.rating} size={11} />
                              <span
                                className="text-xs"
                                style={{ color: "#9CA3AF" }}
                              >
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
                        style={{
                          color: "#6B7280",
                          fontFamily: "var(--font-nunito)",
                        }}
                      >
                        &ldquo;{r.comment}&rdquo;
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section> */}

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
                    {workshop.isFree ? "✦ Always Free" : "✦ Premium Workshop"}
                  </p>
                  <h3
                    className="text-xl font-extrabold text-white mb-1"
                    style={{
                      fontFamily: "var(--font-nunito)",
                      color: "#fffffa",
                    }}
                  >
                    Ready to enroll your child?
                  </h3>
                  <p
                    className="text-sm mb-3"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Join {workshop.enrolledCount.toLocaleString()}+ learners
                    already enrolled
                  </p>
                  <p
                    className="text-xs font-semibold flex items-center gap-1"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    <span>💡</span>
                    <span>For any issues, please reach out to <a href="tel:+919876524155" className="underline font-bold text-[#F5C518] hover:text-[#d4aa12] transition-colors">+91-9876524155</a></span>
                  </p>
                </div>
                <div className="shrink-0 w-full sm:w-auto min-w-50">
                  <EnrollButton
                    workshopId={workshop._id}
                    price={workshop.price ?? 0}
                    isFree={workshop.isFree}
                    slug={workshop.slug}
                    isLoggedIn={isLoggedIn}
                    initialIsEnrolled={isEnrolled}
                    isEnrollmentOpen={workshop.isEnrollmentOpen}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Sticky sidebar ──────────────────────────────────────────── */}
          <div className="hidden lg:block w-90 shrink-0">
            <EnrollSidebar
              workshop={workshop}
              isLoggedIn={isLoggedIn}
              isEnrolled={isEnrolled}
            />
          </div>
        </div>
      </div>



      {/* Mobile sticky bottom enroll bar */}
      <MobileEnrollBar
        workshop={workshop}
        isLoggedIn={isLoggedIn}
        isEnrolled={isEnrolled}
      />
    </main>
  );
}
