"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, useInView } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ClipboardList,
  BookOpen,
  Users,
  Mic2,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FlaskConical,
  Target,
  PenTool,
  Sparkles,
  Clock,
  Pencil,
  Brain,
  Heart,
  Flame,
  Folder,
} from "lucide-react";
import FloatingShapes from "@/components/animations/FloatingShapes";
import {
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/MotionWrapper";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { DemoModal } from "@/components/shared/DemoModal";
import InsightsSection from "@/components/shared/InsightsSection";
import ChatWidget from "@/components/chatbot/ChatWidget";

const steps = [
  {
    id: "assess",
    number: "1",
    icon: ClipboardList,
    title: "Assess",
    description:
      "Understand your child's strengths, gaps, and natural inclinations.",
    duration: "20-30 min",
    href: "/assessments",
    color: "#F5C518",
  },
  {
    id: "programs",
    number: "2",
    icon: BookOpen,
    title: "Workshops",
    description: "Skill-based programs matched to your child's profile.",
    duration: "4-8 weeks",
    href: "/workshops",
    color: "#4FC3F7",
  },
  {
    id: "practice",
    number: "3",
    icon: Mic2,
    title: "Practice",
    description:
      "Daily micro-exercises that build habits and track real progress.",
    duration: "15 min/day",
    href: "/workshops",
    color: "#2BBCB0",
  },
  {
    id: "guide",
    number: "4",
    icon: Users,
    title: "Talk",
    description:
      "Expert mentors and parent community for personalised guidance.",
    duration: "On demand",
    href: "/talk",
    color: "#F4845F",
  },
];

const programsData = [
  {
    title: "Writing Speed",
    description:
      "Build fluency and confidence in written expression for school and life.",
    level: "Beginner",
    category: "Communication",
    iconType: "pencil",
    iconBg: "#FEF0EB",
    iconColor: "#F4845F",
    levelBg: "#E8F8F7",
    levelColor: "#2BBCB0",
  },
  {
    title: "Spelling Mastery",
    description:
      "From uncertainty to precision — build a strong vocabulary foundation.",
    level: "Beginner",
    category: "Communication",
    iconType: "text-abc",
    iconBg: "#E8F8F7",
    iconColor: "#2BBCB0",
    levelBg: "#E8F8F7",
    levelColor: "#2BBCB0",
  },
  {
    title: "Public Speaking",
    description:
      "Speak with confidence, clarity, and presence — in class and beyond.",
    level: "Intermediate",
    category: "Communication",
    iconType: "mic",
    iconBg: "#FEF0EB",
    iconColor: "#F4845F",
    levelBg: "#F3EEFF",
    levelColor: "#8B5CF6",
    isPopular: true,
  },
  {
    title: "Critical Thinking",
    description:
      "Ask better questions, solve harder problems, think independently.",
    level: "Intermediate",
    category: "Cognitive",
    iconType: "brain",
    iconBg: "#F3EEFF",
    iconColor: "#8B5CF6",
    levelBg: "#F3EEFF",
    levelColor: "#8B5CF6",
  },
  {
    title: "Creative Storytelling",
    description:
      "Unlock imagination and narrative skills that last a lifetime.",
    level: "Beginner",
    category: "Communication",
    iconType: "book",
    iconBg: "#FFF0F5",
    iconColor: "#EC4899",
    levelBg: "#E8F8F7",
    levelColor: "#2BBCB0",
  },
  {
    title: "Emotional Vocabulary",
    description:
      "Name, understand, and manage emotions for stronger relationships.",
    level: "Beginner",
    category: "Emotional",
    iconType: "heart",
    iconBg: "#FFF0F5",
    iconColor: "#EC4899",
    levelBg: "#E8F8F7",
    levelColor: "#2BBCB0",
  },
  {
    title: "Logical Reasoning",
    description:
      "Structured thinking patterns that make complex problems simple.",
    level: "Intermediate",
    category: "Cognitive",
    iconType: "text-math",
    iconBg: "#E8F6FE",
    iconColor: "#3B82F6",
    levelBg: "#F3EEFF",
    levelColor: "#8B5CF6",
  },
  {
    title: "Focus & Attention",
    description: "Build deep focus and resist distraction in a world of noise.",
    level: "Beginner",
    category: "Cognitive",
    iconType: "target",
    iconBg: "#E8F8F7",
    iconColor: "#2BBCB0",
    levelBg: "#E8F8F7",
    levelColor: "#2BBCB0",
  },
];

const communityPosts = [
  {
    name: "Priya S.",
    location: "Mumbai",
    message:
      "My daughter just completed the public speaking module — she's so much more confident now!",
  },
  {
    name: "Arun M.",
    location: "Bangalore",
    message:
      "The assessment report helped us understand our son's learning style in a way no school ever explained.",
  },
  {
    name: "Kavita L.",
    location: "Delhi",
    message:
      "Grateful for this community — finally feel heard as a parent navigating these years.",
  },
];

const featuredMentors = [
  {
    initials: "DR",
    name: "Dr. Reena Anand",
    title: "Child Psychologist · 12 years exp.",
    rating: "4.9",
    color: "#F5C518",
  },
  {
    initials: "SM",
    name: "Sneha Mehta",
    title: "Career Coach · 8 years exp.",
    rating: "4.8",
    color: "#2BBCB0",
  },
  {
    initials: "AK",
    name: "Amit Khurana",
    title: "Education Specialist · 10 years exp.",
    rating: "4.9",
    color: "#4FC3F7",
  },
];

const testimonials = [
  {
    initials: "SR",
    color: "#2BBCB0",
    name: "Sunita Rao",
    role: "Parent of Arjun, Age 11",
    quote:
      "Go Kids helped us understand Arjun's learning style in a way no school ever explained. The assessment report was eye-opening — we finally know how to support him.",
  },
  {
    initials: "PM",
    color: "#F5C518",
    name: "Priya Mehta",
    role: "Parent of Ishaan, Age 14",
    quote:
      "The public speaking workshop transformed my shy son into a confident presenter. His teacher couldn't believe the change in just 8 weeks!",
  },
  {
    initials: "AK",
    color: "#F4845F",
    name: "Ananya K.",
    role: "Student, Age 15",
    quote:
      "I never knew what career I wanted. After Go Kids' career assessment, I discovered my passion for design and enrolled in the creativity workshop. It changed everything.",
  },
  {
    initials: "RV",
    color: "#4FC3F7",
    name: "Rajan Verma",
    role: "Parent of Diya, Age 9",
    quote:
      "The mentorship sessions are incredible. Our mentor understood Diya instantly and gave us practical strategies we still use every day.",
  },
  {
    initials: "NJ",
    color: "#2BBCB0",
    name: "Neha Joshi",
    role: "Parent of Rohan, Age 12",
    quote:
      "Workshops are well-structured and the instructors are genuinely passionate. Rohan looks forward to every session — that alone says everything.",
  },
];

const trustStats = [
  { label: "Assessments completed", value: 12400 },
  { label: "Mentoring sessions", value: 860 },
  { label: "Active families", value: 3200 },
];

const trustedBy = [
  "Times of India",
  "YourStory",
  "NDTV Education",
  "EduMinds India",
  "Parent Circle",
];

// ─── Testimonial Carousel ───────────────────────────────────────────
function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Auto-scroll every 3.5 seconds
  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => emblaApi.scrollNext(), 3500);
    return () => clearInterval(id);
  }, [emblaApi]);

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <div
                className="card-hover bg-white rounded-2xl p-6 h-full"
                style={{
                  border: "1px solid #F3F4F6",
                  borderLeft: "4px solid #F5C518",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#F5C518" color="#F5C518" />
                  ))}
                </div>

                {/* Quote */}
                <p
                  className="flex-1 text-sm leading-relaxed"
                  style={{ color: "#374151", fontStyle: "italic" }}
                >
                  &quot;{t.quote}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{
                      background: t.color,
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p
                      className="font-bold text-sm"
                      style={{
                        color: "#1A1A1A",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={scrollPrev}
          className="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all hover:bg-primary hover:border-primary"
          style={{ borderColor: "#E5E7EB" }}
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={16} color="#1A1A1A" />
        </button>

        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === selectedIndex ? 24 : 8,
                height: 8,
                background: i === selectedIndex ? "#F5C518" : "#E5E7EB",
              }}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          className="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all hover:bg-primary hover:border-primary"
          style={{ borderColor: "#E5E7EB" }}
          aria-label="Next testimonial"
        >
          <ChevronRight size={16} color="#1A1A1A" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────
export default function HomePage() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session;
  const [journeyMode, setJourneyMode] = useState<"full" | "anywhere">("full");
  const [activeJourneyStep, setActiveJourneyStep] = useState(steps[0].id);
  const [animatedStats, setAnimatedStats] = useState(trustStats.map(() => 0));
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoType, setDemoType] = useState<"attention" | "writing" | null>(
    null,
  );
  const [activeCategory, setActiveCategory] = useState("All Programs");

  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.5 });
  const hasRunStats = useRef(false);

  useEffect(() => {
    if (!isStatsInView || hasRunStats.current) return;
    hasRunStats.current = true;

    const duration = 1800;
    const frameMs = 24;
    const totalFrames = Math.ceil(duration / frameMs);
    let frame = 0;

    const timer = setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats(
        trustStats.map((stat) => Math.round(stat.value * eased)),
      );

      if (progress >= 1) clearInterval(timer);
    }, frameMs);

    return () => clearInterval(timer);
  }, [isStatsInView]);

  const formatStat = (value: number) => `${value.toLocaleString("en-IN")}+`;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% -10%, rgba(245,197,24,0.13) 0%, transparent 60%), " +
            "radial-gradient(ellipse 60% 50% at -5% 80%, rgba(43,188,176,0.10) 0%, transparent 55%), " +
            "radial-gradient(ellipse 50% 40% at 105% 50%, rgba(244,132,95,0.08) 0%, transparent 50%), " +
            "#FAFAF8",
        }}
      >
        <FloatingShapes />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* ── LEFT: Text Content ── */}
            <div>
              {/* Badge row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="flex flex-wrap items-center gap-2 mb-6"
              >
                <span
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold"
                  style={{
                    background: "#FFF3CC",
                    color: "#92650A",
                    fontFamily: "var(--font-nunito)",
                    border: "1px solid #F5C518",
                  }}
                >
                  🌟 India&apos;s #1 Child Development Platform
                </span>
                {/* Quick-scan trust pills */}
                {["Free to Start", "Science-Backed", "India-First"].map(
                  (pill) => (
                    <span
                      key={pill}
                      className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: "#F3F4F6",
                        color: "#6B7280",
                        fontFamily: "var(--font-nunito)",
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      {pill}
                    </span>
                  ),
                )}
              </motion.div>

              {/* Headline — shorter, one punchy highlighted word */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  fontFamily: "var(--font-nunito)",
                  fontWeight: 800,
                  fontSize: "clamp(38px, 5vw, 62px)",
                  lineHeight: 1.08,
                  color: "#1A1A1A",
                  marginBottom: 20,
                  letterSpacing: "-0.02em",
                }}
              >
                Every child is{" "}
                <span
                  style={{
                    color: "#F5C518",
                    display: "inline-block",
                    position: "relative",
                  }}
                >
                  capable of more.
                  {/* Underline squiggle */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 220 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      position: "absolute",
                      bottom: -6,
                      left: 0,
                      width: "100%",
                      height: 8,
                    }}
                  >
                    <path
                      d="M2 8 C 40 2, 80 11, 120 5 S 180 2, 218 8"
                      stroke="#F5C518"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.7"
                    />
                  </svg>
                </span>
                <br />
                We help them{" "}
                <span style={{ color: "#2BBCB0" }}>find out how!!</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.22, ease: "easeOut" }}
                className="text-base sm:text-lg leading-relaxed mb-8 text-justify"
                style={{ color: "#6B7280", maxWidth: 460 }}
              >
                Go Kids helps Indian parents discover, develop, and track their
                child&apos;s full potential, beyond marks, beyond grades, beyond
                limits.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.34, ease: "easeOut" }}
                className="flex flex-row gap-2 sm:gap-3 mb-6 w-full sm:w-auto"
              >
                <motion.div
                  className="flex-1 sm:flex-initial"
                  // whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href={isLoggedIn ? "/assessments" : "/register"}
                    className="btn-primary text-xs sm:text-base px-3! sm:px-7! py-2.5! sm:py-3.5! animate-shimmer flex items-center justify-center gap-1.5 sm:gap-2 w-full"
                  >
                    <ClipboardList size={16} />
                    <span>
                      <span className="hidden sm:inline">Start </span>Free Assessment
                    </span>
                  </Link>
                </motion.div>

                <motion.div
                  className="flex-1 sm:flex-initial"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/workshops"
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-base font-bold px-3 sm:px-7 py-2.5 sm:py-3.5 rounded-full transition-all w-full text-center"
                    style={{
                      background: "white",
                      color: "#1A1A1A",
                      border:
                        "1.5px solid #D1D5DB" /* softer than black — doesn't compete */,
                      fontFamily: "var(--font-nunito)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#F5C518";
                      (e.currentTarget as HTMLElement).style.background =
                        "#FFFBEA";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#D1D5DB";
                      (e.currentTarget as HTMLElement).style.background =
                        "white";
                    }}
                  >
                    <span>Explore Programs</span> <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Social proof avatars + line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.44 }}
                className="flex items-center gap-3 mb-8"
              >
                {/* Stacked avatars */}
                <div className="flex -space-x-2">
                  {["SR", "PM", "AK", "RV"].map((initials, i) => (
                    <div
                      key={initials}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background: [
                          "#2BBCB0",
                          "#F5C518",
                          "#F4845F",
                          "#4FC3F7",
                        ][i],
                        color: i === 1 ? "#1A1A1A" : "white",
                        fontFamily: "var(--font-nunito)",
                        zIndex: 4 - i,
                      }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  <span
                    className="font-bold"
                    style={{
                      color: "#1A1A1A",
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    500+ families
                  </span>{" "}
                  building future-ready kids
                </p>
              </motion.div>

              {/* Stat mini-cards — replaces the plain text row */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.54 }}
                className="grid grid-cols-3 gap-3 max-w-sm"
              >
                {[
                  {
                    value: "12,000+",
                    label: "Kids Assessed",
                    color: "#F5C518",
                    bg: "#FFF8DC",
                  },
                  {
                    value: "98%",
                    label: "Parent Satisfaction",
                    color: "#2BBCB0",
                    bg: "#E8F8F7",
                  },
                  {
                    value: "50+",
                    label: "Live Workshops",
                    color: "#F4845F",
                    bg: "#FFF0EB",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl p-3 text-center"
                    style={{
                      background: s.bg,
                      border: `1px solid ${s.color}44`,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-nunito)",
                        fontWeight: 800,
                        fontSize: "clamp(18px, 2.5vw, 22px)",
                        color: s.color,
                        lineHeight: 1,
                        marginBottom: 3,
                      }}
                    >
                      {s.value}
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: "#6B7280",
                        lineHeight: 1.3,
                      }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── RIGHT: Hero Image with framing ── */}
            <motion.div
              initial={{ opacity: 0, x: 36, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative w-full max-w-lg lg:max-w-none mx-auto mt-12 lg:mt-0"
            >
              {/* Yellow offset frame behind image */}
              <div
                aria-hidden="true"
                className="absolute rounded-3xl"
                style={{
                  inset: 0,
                  transform: "translate(12px, 12px)",
                  background: "#F5C518",
                  opacity: 0.25,
                  zIndex: 0,
                  borderRadius: 24,
                }}
              />

              {/* SVG dotted backdrop */}
              <div
                aria-hidden="true"
                className="absolute -top-6 -right-6 opacity-40"
                style={{ zIndex: 0 }}
              >
                <svg width="120" height="120" viewBox="0 0 120 120">
                  {Array.from({ length: 6 }).map((_, row) =>
                    Array.from({ length: 6 }).map((_, col) => (
                      <circle
                        key={`${row}-${col}`}
                        cx={col * 20 + 10}
                        cy={row * 20 + 10}
                        r="2.5"
                        fill="#F5C518"
                      />
                    )),
                  )}
                </svg>
              </div>

              {/* Main image */}
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  boxShadow: "0 32px 80px rgba(0,0,0,0.16)",
                  aspectRatio: "4/3",
                  zIndex: 1,
                }}
              >
                <Image
                  src="/images/hero.jpg"
                  alt="Children learning together in a bright, joyful classroom"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Subtle gradient overlay at bottom for card readability */}
                <div
                  className="absolute inset-x-0 bottom-0 h-28"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 100%)",
                  }}
                />
              </div>

              {/* Floating card — bottom left (original, improved) */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-8 -left-2 sm:-bottom-7 sm:-left-7 bg-white rounded-2xl shadow-xl p-3.5 flex items-center gap-3"
                style={{
                  border: "1px solid #F3F4F6",
                  zIndex: 2,
                  minWidth: 170,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: "#FFF3CC" }}
                >
                  🏆
                </div>
                <div>
                  <p
                    className="text-xs font-bold"
                    style={{
                      color: "#1A1A1A",
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    500+ Families
                  </p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    Building tomorrow&apos;s leaders
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ──────────────────────────────────────── */}
      <section id="about" className="py-8" style={{ background: "#FAFAF8" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp className="mb-14">
            <div className="text-center max-w-3xl mx-auto">
              <p
                className="text-sm font-semibold uppercase tracking-wider mb-3"
                style={{ color: "#F4845F", fontFamily: "var(--font-nunito)" }}
              >
                How It Works
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-nunito)",
                  fontWeight: 800,
                  fontSize: "clamp(28px, 4vw, 42px)",
                  color: "#1A1A1A",
                }}
              >
                Your child&apos;s journey starts here
              </h2>
              <p className="mt-2 text-base" style={{ color: "#6B7280" }}>
                Four connected steps - or start anywhere that feels right.
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center gap-2">
              <div className="relative inline-flex rounded-full p-1 bg-brand-grey border border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setJourneyMode("full")}
                  className="relative px-6 py-1.5 rounded-full text-sm font-bold transition-colors duration-300"
                  style={{
                    color: journeyMode === "full" ? "#1A1A1A" : "#6B7280",
                    fontFamily: "var(--font-nunito)",
                  }}
                >
                  {journeyMode === "full" && (
                    <motion.div
                      layoutId="journey-pill"
                      className="absolute inset-0 bg-primary rounded-full shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">Full Journey</span>
                </button>
                <button
                  type="button"
                  onClick={() => setJourneyMode("anywhere")}
                  className="relative px-6 py-1.5 rounded-full text-sm font-bold transition-colors duration-300"
                  style={{
                    color: journeyMode === "anywhere" ? "#1A1A1A" : "#6B7280",
                    fontFamily: "var(--font-nunito)",
                  }}
                >
                  {journeyMode === "anywhere" && (
                    <motion.div
                      layoutId="journey-pill"
                      className="absolute inset-0 bg-primary rounded-full shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">Start Anywhere</span>
                </button>
              </div>
              <p
                className="text-xs"
                style={{ color: "#9CA3AF", fontFamily: "var(--font-nunito)" }}
              >
                {journeyMode === "full"
                  ? "Follow all 4 steps in sequence."
                  : "Choose any step card below to begin."}
              </p>
            </div>
          </FadeInUp>

          <div className="relative">
            <div
              className="hidden lg:block absolute left-24 right-24"
              style={{
                top: "2.2rem",
                borderTop:
                  journeyMode === "full"
                    ? "2px dashed #F5C518"
                    : "2px dashed #D1D5DB",
                pointerEvents: "none",
              }}
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isActive = activeJourneyStep === step.id;
                const highlighted =
                  journeyMode === "full" ||
                  (journeyMode === "anywhere" && isActive);

                return (
                  <FadeInUp key={step.id} delay={i * 0.12}>
                    <div
                      className="text-center cursor-pointer"
                      onClick={() => setActiveJourneyStep(step.id)}
                    >
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 relative transition-all"
                        style={{
                          background: highlighted ? "#FFFFFF" : "#F3F4F6",
                          border: `1px solid ${highlighted ? step.color : "#E5E7EB"}`,
                        }}
                      >
                        <Icon size={20} color={step.color} />
                        {journeyMode === "full" && (
                          <span
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                            style={{
                              background: "#F5C518",
                              color: "#1A1A1A",
                              fontFamily: "var(--font-nunito)",
                            }}
                          >
                            {step.number}
                          </span>
                        )}
                      </div>

                      <h3
                        className="text-2xl font-bold"
                        style={{
                          fontFamily: "var(--font-nunito)",
                          color: "#1A1A1A",
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed mt-1 mx-auto max-w-57.5"
                        style={{ color: "#6B7280" }}
                      >
                        {step.description}
                      </p>
                      <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>
                        {step.duration}
                      </p>
                      <Link
                        href={step.href}
                        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold"
                        style={{
                          color: highlighted ? "#F4845F" : "#9CA3AF",
                          fontFamily: "var(--font-nunito)",
                        }}
                      >
                        Go here <ArrowRight size={13} />
                      </Link>
                    </div>
                  </FadeInUp>
                );
              })}
            </div>

            {journeyMode === "anywhere" && (
              <p
                className="text-center mt-8 text-sm"
                style={{ color: "#6B7280" }}
              >
                Start with any step and continue in the order that works for
                your child.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── 1.5. ASSESSMENTS ──────────────────────────────────────── */}
      <section className="py-8" style={{ background: "#FAFAF8" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp className="mb-14 text-center max-w-3xl mx-auto flex flex-col items-center">
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5"
              style={{ color: "#F4845F", fontFamily: "var(--font-nunito)" }}
            >
              <FlaskConical size={16} /> Assessments
            </p>
            <h2
              style={{
                fontFamily: "var(--font-nunito)",
                fontWeight: 800,
                fontSize: "clamp(32px, 4.5vw, 48px)",
                color: "#1A1A1A",
                lineHeight: 1.15,
                marginBottom: 16,
              }}
            >
              Understand your child before you{" "}
              <span style={{ color: "#F4845F" }}>guide them</span>
            </h2>
            <p className="text-base sm:text-lg" style={{ color: "#6B7280" }}>
              Science-backed assessments that reveal who your child really is —
              not just how they score.
            </p>
          </FadeInUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attention Span Card */}
            <StaggerItem>
              <motion.div
                whileHover={{
                  y: -6,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-4xl p-8 h-full flex flex-col relative"
                style={{
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                }}
              >
                <div className="flex justify-between items-start mb-8">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "#FEF0EB", color: "#F4845F" }}
                  >
                    <Target size={24} />
                  </div>
                  <div
                    className="w-14 h-14 rounded-full border-[3px] flex items-center justify-center relative"
                    style={{ borderColor: "#FEF0EB" }}
                  >
                    <svg
                      className="absolute inset-0 w-full h-full transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-[#F4845F"
                        strokeDasharray="73, 100"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                    </svg>
                    <span
                      className="text-sm font-bold z-10"
                      style={{
                        color: "#F4845F",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      73%
                    </span>
                  </div>
                </div>

                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
                >
                  Attention Span
                </h3>
                <p
                  className="text-sm leading-relaxed mb-6 flex-1"
                  style={{ color: "#6B7280" }}
                >
                  Find out how long your child can stay focused and what breaks
                  their concentration cycle.
                </p>

                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold mb-8 w-fit"
                  style={{ background: "#E8F8F7", color: "#8B5CF6" }}
                >
                  <Sparkles size={12} /> Powered by adaptive assessment engine
                </div>

                <div
                  className="flex flex-col lg:flex-row items-start lg:items-center justify-between pt-6 mt-auto gap-4 relative z-10"
                  style={{ borderTop: "1px solid #F3F4F6" }}
                >
                  <div
                    className="flex items-center gap-1.5 text-sm font-semibold shrink-0"
                    style={{ color: "#9CA3AF" }}
                  >
                    <Clock size={16} /> ~20 minutes
                  </div>
                  <div className="flex flex-col lg:flex-row flex-wrap items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
                    <button
                      onClick={() => {
                        setDemoType("attention");
                        setIsDemoModalOpen(true);
                      }}
                      className="px-6 py-2.5 rounded-full text-sm font-bold border-2 border-gray-200 text-gray-600 bg-white hover:border-gray-900 hover:text-gray-900 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md w-full lg:w-auto"
                    >
                      Demo Questions
                    </button>
                    <Link
                      href="/assessments"
                      className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gray-900 hover:bg-black transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md shadow-sm w-full lg:w-auto text-center"
                    >
                      Start Assessment
                    </Link>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>

            {/* Writing Ability Card */}
            <StaggerItem>
              <motion.div
                whileHover={{
                  y: -6,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-4xl p-8 h-full flex flex-col relative"
                style={{
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                }}
              >
                <div className="flex justify-between items-start mb-8">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "#E8F8F7", color: "#2BBCB0" }}
                  >
                    <PenTool size={24} />
                  </div>
                  <div
                    className="flex items-end gap-1 h-12 opacity-80"
                    style={{
                      transform: "scale(1.2)",
                      transformOrigin: "bottom right",
                    }}
                  >
                    <div
                      className="w-1.5 h-4 rounded-sm"
                      style={{ background: "#E8F8F7" }}
                    ></div>
                    <div
                      className="w-1.5 h-6 rounded-sm"
                      style={{ background: "#2BBCB0" }}
                    ></div>
                    <div
                      className="w-1.5 h-10 rounded-sm"
                      style={{ background: "#2BBCB0" }}
                    ></div>
                    <div
                      className="w-1.5 h-8 rounded-sm"
                      style={{ background: "#2BBCB0" }}
                    ></div>
                  </div>
                </div>

                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
                >
                  Writing Ability
                </h3>
                <p
                  className="text-sm leading-relaxed mb-6 flex-1"
                  style={{ color: "#6B7280" }}
                >
                  Measure speed, accuracy, and style — see exactly where your
                  child&apos;s writing needs a boost.
                </p>

                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold mb-8 w-fit"
                  style={{ background: "#F3EEFF", color: "#8B5CF6" }}
                >
                  <Sparkles size={12} /> Powered by adaptive assessment engine
                </div>

                <div
                  className="flex flex-col lg:flex-row items-start lg:items-center justify-between pt-6 mt-auto gap-4 relative z-10"
                  style={{ borderTop: "1px solid #F3F4F6" }}
                >
                  <div
                    className="flex items-center gap-1.5 text-sm font-semibold shrink-0"
                    style={{ color: "#9CA3AF" }}
                  >
                    <Clock size={16} /> ~25 minutes
                  </div>
                  <div className="flex flex-col lg:flex-row flex-wrap items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
                    <button
                      onClick={() => {
                        setDemoType("writing");
                        setIsDemoModalOpen(true);
                      }}
                      className="px-6 py-2.5 rounded-full text-sm font-bold border-2 border-gray-200 text-gray-600 bg-white hover:border-gray-900 hover:text-gray-900 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md w-full lg:w-auto"
                    >
                      Demo Questions
                    </button>
                    <Link
                      href="/assessments"
                      className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gray-900 hover:bg-black transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md shadow-sm w-full lg:w-auto text-center"
                    >
                      Start Assessment
                    </Link>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>

          <FadeInUp className="mt-12 flex justify-center">
            <Link
              href="/assessments"
              className="text-base font-bold px-8 py-3.5 rounded-full flex items-center justify-center gap-2 transition-transform hover:scale-101 shadow-sm"
              style={{
                background: "#F5C518",
                color: "#1A1A1A",
                fontFamily: "var(--font-nunito)",
              }}
            >
              Explore All Assessments <ArrowRight size={20} />
            </Link>
          </FadeInUp>
        </div>
      </section>

      {/* ── 4. PROGRAMS ──────────────────────────────────────────── */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Header & Subtitle */}
          <FadeInUp className="text-center mb-10 flex flex-col items-center">
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5"
              style={{ color: "#2BBCB0", fontFamily: "var(--font-nunito)" }}
            >
              <Folder size={14} /> PROGRAMS
            </p>
            <h2
              style={{
                fontFamily: "var(--font-nunito)",
                fontWeight: 800,
                fontSize: "clamp(32px, 4.5vw, 48px)",
                color: "#1A1A1A",
                lineHeight: 1.15,
                marginBottom: 16,
              }}
            >
              Skills that{" "}
              <span style={{ color: "#F4845F" }}>actually matter</span>
            </h2>
            <p
              className="text-base sm:text-lg max-w-2xl"
              style={{ color: "#6B7280" }}
            >
              Eight research-backed programs designed for children ages 6-16.
            </p>
          </FadeInUp>

          {/* Category Filter Tiles */}
          <FadeInUp className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {["All Programs", "Communication", "Cognitive", "Emotional"].map(
              (cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className="px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border"
                    style={{
                      backgroundColor: isActive ? "#101828 " : "#FFFFFF",
                      borderColor: isActive ? "#F4845F" : "#E5E7EB",
                      color: isActive ? "#FFFFFF" : "#6B7280",
                      fontFamily: "var(--font-nunito)",
                      boxShadow: isActive
                        ? "0 4px 12px rgba(244, 132, 95, 0.25)"
                        : "none",
                    }}
                  >
                    {cat}
                  </button>
                );
              },
            )}
          </FadeInUp>

          {/* Cards Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {programsData
              .filter(
                (prog) =>
                  activeCategory === "All Programs" ||
                  prog.category === activeCategory,
              )
              .map((prog) => {
                return (
                  <motion.div
                    key={prog.title}
                    layout
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    className="rounded-4xl p-6 h-full flex flex-col justify-between"
                    style={{
                      border: "1px solid #E5E7EB",
                      boxShadow: prog.isPopular
                        ? "0 8px 24px rgba(0, 0, 0, 0.04)"
                        : "0 4px 20px rgba(0, 0, 0, 0.03)",
                      background: prog.isPopular ? "#FFF9F6" : "#FFFFFF",
                      transition: "box-shadow 0.22s ease",
                    }}
                  >
                    <div>
                      {/* Icon & "Most Popular" Badge */}
                      <div className="flex justify-between items-center mb-5">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: prog.iconBg }}
                        >
                          {prog.iconType === "pencil" && (
                            <Pencil size={18} color={prog.iconColor} />
                          )}
                          {prog.iconType === "mic" && (
                            <Mic2 size={18} color={prog.iconColor} />
                          )}
                          {prog.iconType === "brain" && (
                            <Brain size={18} color={prog.iconColor} />
                          )}
                          {prog.iconType === "book" && (
                            <BookOpen size={18} color={prog.iconColor} />
                          )}
                          {prog.iconType === "heart" && (
                            <Heart size={18} color={prog.iconColor} />
                          )}
                          {prog.iconType === "target" && (
                            <Target size={18} color={prog.iconColor} />
                          )}
                          {prog.iconType === "text-abc" && (
                            <span
                              className="font-bold text-xs"
                              style={{
                                color: prog.iconColor,
                                fontFamily: "var(--font-nunito)",
                              }}
                            >
                              Abc
                            </span>
                          )}
                          {prog.iconType === "text-math" && (
                            <span
                              className="font-bold text-xs"
                              style={{
                                color: prog.iconColor,
                                fontFamily: "var(--font-nunito)",
                              }}
                            >
                              √x
                            </span>
                          )}
                        </div>

                        {prog.isPopular && (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                            style={{
                              background:
                                "linear-gradient(135deg, #FFEBE5 0%, #FFDFD5 100%)",
                              color: "#E0533C",
                              border: "1px solid #FFC4B3",
                              boxShadow: "0 2px 8px rgba(224, 83, 60, 0.08)",
                              fontFamily: "var(--font-nunito)",
                            }}
                          >
                            <Flame
                              size={11}
                              fill="#E0533C"
                              color="#E0533C"
                              className="animate-pulse"
                            />{" "}
                            Most Popular
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3
                        className="text-base font-bold mb-2"
                        style={{
                          fontFamily: "var(--font-nunito)",
                          color: "#1A1A1A",
                        }}
                      >
                        {prog.title}
                      </h3>
                      <p
                        className="text-xs leading-relaxed mb-6"
                        style={{ color: "#6B7280" }}
                      >
                        {prog.description}
                      </p>
                    </div>

                    {/* Footer Row */}
                    <div
                      className="flex items-center justify-between pt-4 mt-auto"
                      style={{ borderTop: "1px solid #F3F4F6" }}
                    >
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                        style={{
                          background: prog.levelBg,
                          color: prog.levelColor,
                          fontFamily: "var(--font-nunito)",
                        }}
                      >
                        {prog.level}
                      </span>

                      <Link
                        href="/workshops"
                        className="inline-flex items-center gap-1 text-xs font-bold transition-all hover:gap-1.5"
                        style={{
                          color: "#F4845F",
                          fontFamily: "var(--font-nunito)",
                        }}
                      >
                        Learn more <ArrowRight size={12} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
          </motion.div>
        </div>
      </section>

      {/* ── 5. WORKSHOPS BANNER ──────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/workshops-banner.jpg"
            alt="Kids drawing and creating in a teal-themed classroom workshop"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0, 0, 0, 0.52)" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInUp>
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#F5C518", fontFamily: "var(--font-nunito)" }}
            >
              50+ Live & Self-Paced
            </p>
            <h2
              className="text-white mb-4"
              style={{
                fontFamily: "var(--font-nunito)",
                fontWeight: 800,
                fontSize: "clamp(30px, 5vw, 52px)",
                color: "#F6F8FA",
              }}
            >
              Explore Our Workshops
            </h2>
            <p
              className="text-base mb-8 mx-auto max-w-xl"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              From robotics to public speaking — skill-building sessions
              designed for curious minds aged 4 to 16.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/workshops"
                  className="btn-primary text-base px-7 py-3.5 flex items-center justify-center gap-2"
                >
                  Explore All Workshops <ArrowRight size={20} />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/workshops"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-bold text-base text-white border-2 border-white hover:bg-white hover:text-brand-black transition-all"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  View Schedule
                </Link>
              </motion.div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ── 6. TALK & MENTOR ─────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#FAFAF8" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp className="text-center mb-12 max-w-3xl mx-auto">
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#F4845F", fontFamily: "var(--font-nunito)" }}
            >
              Support & Community
            </p>
            <h2
              style={{
                fontFamily: "var(--font-nunito)",
                fontWeight: 800,
                fontSize: "clamp(28px, 4vw, 42px)",
                color: "#1A1A1A",
                lineHeight: 1.2,
              }}
            >
              You don&apos;t have to figure this out{" "}
              <span style={{ color: "#F4845F" }}>alone</span>
            </h2>
            <p className="mt-3 text-base" style={{ color: "#6B7280" }}>
              Two ways to get the support you need — community warmth or expert
              1-on-1 sessions.
            </p>
          </FadeInUp>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Community */}
            <StaggerItem>
              <div
                className="h-full flex flex-col rounded-2xl bg-white p-6 sm:p-8"
                style={{
                  border: "1px solid rgba(244,132,95,0.22)",
                  boxShadow: "0 10px 36px rgba(0,0,0,0.06)",
                }}
              >
                <span
                  className="inline-block self-start px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4"
                  style={{
                    background: "#FEF0EB",
                    color: "#F4845F",
                    fontFamily: "var(--font-nunito)",
                  }}
                >
                  Talk — Community
                </span>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{
                    fontFamily: "var(--font-nunito)",
                    color: "#1A1A1A",
                  }}
                >
                  You&apos;re not alone in this.
                </h3>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: "#6B7280" }}
                >
                  A safe space for Indian parents to discuss, share experiences,
                  and grow together.
                </p>

                <div className="flex flex-col gap-3 flex-1">
                  {communityPosts.map((post) => (
                    <div
                      key={post.name}
                      className="rounded-xl px-4 py-3 text-sm leading-relaxed"
                      style={{
                        background: "#FAFAF8",
                        color: "#4B5563",
                        border: "1px solid #F3F4F6",
                      }}
                    >
                      <span
                        className="font-semibold"
                        style={{ color: "#1A1A1A" }}
                      >
                        {post.name}, {post.location}
                      </span>
                      {" — "}
                      {post.message}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p
                    className="flex items-center gap-2 text-sm font-semibold"
                    style={{
                      color: "#2BBCB0",
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: "#2BBCB0" }}
                      aria-hidden
                    />
                    14 parents online now
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/talk"
                      className="btn-primary text-base px-7 py-3.5 flex items-center justify-center gap-2"
                    >
                      <Users size={20} />
                      Join the Community <ArrowRight size={20} />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </StaggerItem>

            {/* Mentor */}
            <StaggerItem>
              <div
                className="h-full flex flex-col rounded-2xl bg-white p-6 sm:p-8"
                style={{
                  border: "1px solid rgba(79,195,247,0.24)",
                  boxShadow: "0 10px 36px rgba(0,0,0,0.06)",
                }}
              >
                <span
                  className="inline-block self-start px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4"
                  style={{
                    background: "#E8F6FE",
                    color: "#4FC3F7",
                    fontFamily: "var(--font-nunito)",
                  }}
                >
                  Mentor — 1-on-1 Sessions
                </span>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{
                    fontFamily: "var(--font-nunito)",
                    color: "#1A1A1A",
                  }}
                >
                  Get answers, not more anxiety.
                </h3>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: "#6B7280" }}
                >
                  Book a session with a child development expert — personalised,
                  confidential, effective.
                </p>

                <div className="flex flex-col gap-3 flex-1">
                  {featuredMentors.map((mentor) => (
                    <div
                      key={mentor.name}
                      className="flex items-center gap-3 rounded-xl px-4 py-3"
                      style={{
                        background: "#FAFAF8",
                        border: "1px solid #F3F4F6",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                        style={{
                          background: mentor.color,
                          color:
                            mentor.color === "#F5C518" ? "#1A1A1A" : "white",
                          fontFamily: "var(--font-nunito)",
                        }}
                      >
                        {mentor.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-bold truncate"
                          style={{
                            color: "#1A1A1A",
                            fontFamily: "var(--font-nunito)",
                          }}
                        >
                          {mentor.name}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: "#6B7280" }}
                        >
                          {mentor.title}
                        </p>
                      </div>
                      <div
                        className="flex items-center gap-1 shrink-0 text-sm font-semibold"
                        style={{
                          color: "#1A1A1A",
                          fontFamily: "var(--font-nunito)",
                        }}
                      >
                        <Star size={14} fill="#F5C518" stroke="#F5C518" />
                        {mentor.rating}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/mentors"
                      className="btn-primary text-base px-7 py-3.5 flex items-center justify-center gap-2"
                    >
                      <Calendar size={20} />
                      Book a Session <ArrowRight size={20} />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ── 6.5. INSIGHTS ────────────────────────────────────────── */}
      <InsightsSection />

      {/* ── 7. TESTIMONIALS ──────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp className="text-center mb-12">
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#2BBCB0", fontFamily: "var(--font-nunito)" }}
            >
              Real Stories
            </p>
            <h2
              style={{
                fontFamily: "var(--font-nunito)",
                fontWeight: 800,
                fontSize: "clamp(28px, 4vw, 42px)",
                color: "#1A1A1A",
              }}
            >
              What Parents & Kids Say
            </h2>
          </FadeInUp>

          <TestimonialsCarousel />
        </div>
      </section>

      {/* ── 7. STATS & TRUST ─────────────────────────────────────── */}
      <section
        ref={statsRef}
        className="py-14"
        style={{ background: "#FAFAF8" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div
              className="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 bg-white"
              style={{
                border: "1px solid #F3F4F6",
                boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
              }}
            >
              {trustStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="py-8 px-6 md:px-10 text-center flex flex-col items-center justify-center transition-shadow duration-200 hover:shadow-lg"
                  style={{
                    borderRight:
                      index === trustStats.length - 1
                        ? "none"
                        : "1px solid #F3F4F6",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-nunito)",
                      fontWeight: 800,
                      fontSize: "clamp(36px, 6vw, 64px)",
                      color: "#1A1A1A",
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {formatStat(animatedStats[index])}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#6B7280" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p
                className="text-xs font-bold uppercase tracking-[0.18em] mb-4"
                style={{ color: "#9CA3AF", fontFamily: "var(--font-nunito)" }}
              >
                Trusted By Schools & Featured In
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl mx-auto">
                {trustedBy.map((brand) => (
                  <span
                    key={brand}
                    className="px-5 py-2 rounded-full text-sm font-semibold bg-white shadow-sm transform transition-all duration-150 hover:scale-105"
                    style={{
                      border: "1px solid #F3F4F6",
                      color: "#6B7280",
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>
      <ChatWidget />
      {/* ── 7. CTA STRIP ─────────────────────────────────────────── */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ background: "#F5C518" }}
      >
        {/* SVG Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          aria-hidden="true"
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="stars"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="3" fill="#1A1A1A" />
                <circle cx="40" cy="30" r="2" fill="#1A1A1A" />
                <circle cx="20" cy="50" r="4" fill="#1A1A1A" />
                <circle cx="55" cy="5" r="2.5" fill="#1A1A1A" />
                <circle cx="5" cy="45" r="2" fill="#1A1A1A" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stars)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <FadeInUp>
            <h2
              style={{
                fontFamily: "var(--font-nunito)",
                fontWeight: 800,
                fontSize: "clamp(28px, 4.5vw, 48px)",
                color: "#1A1A1A",
                marginBottom: 12,
              }}
            >
              <span className="block">Start with a free assessment.</span>
              <span className="block">See what your child is truly</span>
              <span className="block">capable of.</span>
            </h2>
            <p className="text-base mb-8" style={{ color: "#374151" }}>
              No commitments. No pressure. Just honest, science-backed clarity
              about your child — in 30 minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-base text-white transition-all hover:opacity-90"
                  style={{
                    background: "#1A1A1A",
                    fontFamily: "var(--font-nunito)",
                  }}
                >
                  <ClipboardList size={20} />
                  Book a Free Assessment
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/workshops"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-base transition-all border-2 border-brand-black hover:bg-brand-black hover:text-white"
                  style={{
                    background: "white",
                    color: "#1A1A1A",
                    fontFamily: "var(--font-nunito)",
                  }}
                >
                  Browse Workshops <ArrowRight size={20} />
                </Link>
              </motion.div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ── 8. CONTACT ───────────────────────────────────────────── */}
      <section id="contact" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp className="text-center mb-12">
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#F4845F", fontFamily: "var(--font-nunito)" }}
            >
              Get In Touch
            </p>
            <h2
              style={{
                fontFamily: "var(--font-nunito)",
                fontWeight: 800,
                fontSize: "clamp(28px, 4vw, 42px)",
                color: "#1A1A1A",
              }}
            >
              Contact Go Kids India
            </h2>
            <p
              className="mt-3 text-base max-w-2xl mx-auto"
              style={{ color: "#6B7280" }}
            >
              We are happy to help you choose the right path for your child.
              Connect with us directly for guidance and support.
            </p>
          </FadeInUp>

          <div
            className="rounded-3xl overflow-hidden"
            style={{
              border: "1px solid #F3F4F6",
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            }}
          >
            <div className="p-7 sm:p-10 bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Details Column */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                  <div>
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{
                        color: "#1A1A1A",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      Contact Details
                    </h3>
                    <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
                      Prefer a direct conversation? Call or email us anytime. We
                      are happy to guide you!
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div
                      className="rounded-2xl p-5"
                      style={{
                        border: "1px solid #F3F4F6",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: "#FFF3CC", color: "#92650A" }}
                        >
                          <Phone size={18} />
                        </div>
                        <div>
                          <p
                            className="text-sm font-bold mb-1"
                            style={{
                              color: "#1A1A1A",
                              fontFamily: "var(--font-nunito)",
                            }}
                          >
                            Call Us
                          </p>
                          <a
                            href="tel:+919876524155"
                            className="text-sm font-semibold hover:underline"
                            style={{ color: "#374151" }}
                          >
                            +91-9876524155
                          </a>
                        </div>
                      </div>
                    </div>

                    <div
                      className="rounded-2xl p-5"
                      style={{
                        border: "1px solid #F3F4F6",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: "#E8F8F7", color: "#2BBCB0" }}
                        >
                          <Mail size={18} />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-sm font-bold mb-1"
                            style={{
                              color: "#1A1A1A",
                              fontFamily: "var(--font-nunito)",
                            }}
                          >
                            Email
                          </p>
                          <a
                            href="mailto:pallavimodi@gmail.com"
                            className="text-sm font-semibold hover:underline break-all"
                            style={{ color: "#374151" }}
                          >
                            pallavimodi@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>

                    <div
                      className="rounded-2xl p-5"
                      style={{
                        border: "1px solid #F3F4F6",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: "#E8F6FE", color: "#4FC3F7" }}
                        >
                          <MapPin size={18} />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-sm font-bold mb-1"
                            style={{
                              color: "#1A1A1A",
                              fontFamily: "var(--font-nunito)",
                            }}
                          >
                            Location
                          </p>
                          <p className="text-sm" style={{ color: "#374151" }}>
                            SCO-2, Behind Gopals, Patiala Road, Zirakpur
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Column */}
                <div className="lg:col-span-7 min-h-95 lg:min-h-full rounded-2xl overflow-hidden border-2 border-brand-grey relative group transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/5">
                  <iframe
                    title="Go Kids India Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3432.770587829187!2d76.80062797619098!3d30.640422390087096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390feb5784af9b3b%3A0x9b2515a0225d9ed6!2sGo%20Kids!5e0!3m2!1sen!2sin!4v1781506397447!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  {/* Premium overlay badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 pointer-events-none transition-all duration-300 group-hover:scale-105 z-10">
                    <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                    <span
                      className="text-[10px] font-extrabold text-brand-black tracking-wider uppercase"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      Go Kids Center
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        assessmentType={demoType}
      />
    </div>
  );
}
