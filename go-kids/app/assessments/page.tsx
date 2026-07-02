"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { HelpCircle } from "lucide-react";
import { DemoModal } from "@/components/shared/DemoModal";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/MotionWrapper";

const ASSESSMENTS = [
  {
    id: "attention-span",
    emoji: "🧠",
    iconBg: "#FEF0EB",
    iconColor: "#F4845F",
    title: "Attention Span Assessment",
    description:
      "Evaluate your child's ability to sustain focus, filter distractions, and regulate impulses through a two-part digital and observational assessment.",
    tags: ["~20 min", "Ages 8–16", "Digital + Parent Report"],
    tagBg: "#FFF3CC",
    tagColor: "#92650A",
    cta: "Start Assessment",
    href: "/parent/assessments/attention-span",
    available: true,
    accent: "#F4845F",
    type: "attention" as const,
  },
  {
    id: "writing-ability",
    emoji: "✏️",
    iconBg: "#E8F8F7",
    iconColor: "#2BBCB0",
    title: "Writing Ability Assessment",
    description:
      "Assess vocabulary range, sentence structure, creative expression, and age-appropriate writing skills through guided written tasks.",
    tags: ["~25 min", "Ages 8–16", "Parent Report"],
    tagBg: "#E8F8F7",
    tagColor: "#0D7A73",
    cta: "Coming Soon",
    href: null,
    available: false,
    accent: "#2BBCB0",
    type: "writing" as const,
  },
];

export default function AssessmentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeAssessment, setActiveAssessment] = useState<"attention" | "writing" | null>(null);

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        background:
          "linear-gradient(180deg, #FFFBEA 0%, #FAFAF8 30%, #FAFAF8 100%)",
      }}
    >
      <Navbar />

      <main className="flex-1 pt-16 relative">
        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold mb-6 shadow-xs bg-white border border-[#E5E7EB]"
              style={{ color: "#2BBCB0" }}
            >
              🔬 Science-Backed Assessments
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 sm:mb-5 text-brand-black"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Understand your child <span className="text-teal">before</span>{" "}
              you guide them
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-8 text-gray-600 font-medium"
            >
              Psychometric tools designed for Indian children aged 6–18,
              developed with child psychologists and education specialists. Free
              during our launch phase.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 max-w-lg mx-auto"
            >
              {[
                { icon: "🎯", label: "Evidence-based" },
                { icon: "🛡️", label: "100% safe & private" },
                { icon: "🆓", label: "Free during beta" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-1.5 text-[11px] sm:text-xs md:text-sm font-extrabold text-gray-700 bg-white/70 backdrop-blur-xs px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-gray-200/50 shadow-2xs whitespace-nowrap"
                >
                  <span>{s.icon}</span>
                  {s.label}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Assessment Cards ─────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
          <div className="text-center">
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-brand-black"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Available Assessments
            </h2>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 mt-6 sm:mt-8">
            {ASSESSMENTS.map((a) => (
              <StaggerItem key={a.id}>
                <motion.div
                  whileHover={{
                    y: -6,
                    boxShadow: "0 24px 48px rgba(0,0,0,0.06)",
                  }}
                  className="relative rounded-4xl overflow-hidden flex flex-col h-full bg-white border border-gray-200/60 shadow-xs transition-all duration-300"
                >
                  {/* Coming soon badge */}
                  {!a.available && (
                    <div className="absolute top-5 right-5 text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-yellow-50 text-amber-700 border border-amber-200">
                      Coming Soon
                    </div>
                  )}

                  <div className="p-5 sm:p-8 flex flex-col h-full justify-between space-y-5">
                    <div className="space-y-5">
                      {/* Header Row */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div
                          className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold shrink-0"
                          style={{ background: a.iconBg }}
                        >
                          {a.emoji}
                        </div>
                        <div>
                          <h3
                            className="text-base sm:text-xl font-extrabold text-brand-black"
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {a.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            {a.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full"
                                style={{
                                  background: a.tagBg,
                                  color: a.tagColor,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 leading-relaxed font-semibold">
                        {a.description}
                      </p>

                      {/* Accent divider line */}
                      <div className="w-full h-1px bg-gray-150" />

                      {/* Trigger to see demo questions in modal */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveAssessment(a.type);
                            setModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-black hover:text-teal transition-colors cursor-pointer bg-transparent border-none p-0 outline-none"
                        >
                          <HelpCircle size={15} />
                          See Demo Questions
                        </button>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4">
                      {a.available && a.href ? (
                        <Link
                          href={a.href}
                          className="block w-full text-center py-4 rounded-2xl font-extrabold text-sm transition-all bg-primary text-brand-black hover:bg-primary-dark shadow-xs"
                          style={{
                            fontFamily: "var(--font-heading)",
                            textDecoration: "none",
                            boxShadow: "0 4px 14px rgba(245, 197, 24, 0.25)",
                          }}
                        >
                          {a.cta}
                        </Link>
                      ) : (
                        <div
                          className="w-full text-center py-4 rounded-2xl font-extrabold text-sm border border-dashed border-gray-200 text-gray-400"
                          style={{
                            fontFamily: "var(--font-heading)",
                            background: "#FAFAF9",
                          }}
                        >
                          {a.cta}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section className="py-20 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2
                className="text-2xl sm:text-3xl font-extrabold text-brand-black"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                How it works
              </h2>
              <p className="text-sm mt-2 text-gray-500 font-semibold">
                Simple, fast, and structured for both kids and parents.
              </p>
            </div>

            <div className="relative">
              {/* Desktop Horizontal Connecting Line (Icon-centered) */}
              <div className="absolute top-15 left-[15%] right-[15%] h-0.75 bg-gray-200 hidden sm:block z-0">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #F4845F 0%, #2BBCB0 50%, #F5C518 100%)",
                  }}
                />
              </div>

              {/* Mobile Vertical Connecting Line (Icon-centered) */}
              <div className="absolute left-1/2 top-15 bottom-30 w-0.75 bg-gray-200 sm:hidden z-0 -translate-x-1/2">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: "100%" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                  className="w-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(180deg, #F4845F 0%, #2BBCB0 50%, #F5C518 100%)",
                  }}
                />
              </div>

              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
                {[
                  {
                    step: "01",
                    icon: "👦",
                    title: "Child completes Part A",
                    desc: "An interactive digital game completed by your child alone — no preparation needed.",
                    color: "#F4845F",
                    glow: "rgba(244,132,95,0.15)",
                  },
                  {
                    step: "02",
                    icon: "📋",
                    title: "Parent fills Part B",
                    desc: "A short observational questionnaire based on your child's everyday behaviour.",
                    color: "#2BBCB0",
                    glow: "rgba(43,188,176,0.15)",
                  },
                  {
                    step: "03",
                    icon: "📊",
                    title: "Get instant results",
                    desc: "See a combined score, level classification, and personalised insights immediately.",
                    color: "#F5C518",
                    glow: "rgba(245,197,24,0.15)",
                  },
                ].map((item) => (
                  <StaggerItem key={item.step}>
                    <motion.div
                      whileHover={{
                        y: -6,
                        scale: 1.01,
                        boxShadow: "0 16px 32px rgba(0,0,0,0.04)",
                      }}
                      className="rounded-[28px] p-5 sm:p-8 text-center bg-white border border-gray-200/60 shadow-xs relative transition-all duration-300"
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 relative z-10 bg-white"
                        style={{
                          boxShadow: `0 8px 20px ${item.glow}`,
                          border: `1.5px solid ${item.color}`,
                        }}
                      >
                        {item.icon}
                      </div>
                      <p
                        className="text-xs font-extrabold uppercase tracking-widest mb-2"
                        style={{ color: item.color }}
                      >
                        Step {item.step}
                      </p>
                      <h3
                        className="text-base font-extrabold text-brand-black mb-2"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed font-semibold">
                        {item.desc}
                      </p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <section className="pb-20 text-center relative overflow-hidden z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div
            className="rounded-[28px] sm:rounded-[36px] p-7 sm:p-10 lg:p-14 relative z-10"
            style={{
              background: "linear-gradient(135deg, #FFFBEA 0%, #FFF3CC 100%)",
              border: "1.5px solid #FDE68A",
            }}
          >
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-brand-black mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ready to understand your child&apos;s potential?
            </h2>
            <p className="text-base mb-8 text-gray-600 max-w-lg mx-auto font-medium">
              Start with our Attention Span Assessment today — it is free and
              takes only 20 minutes.
            </p>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Link
                href="/parent/assessments/attention-span"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-extrabold text-base transition-all bg-primary text-brand-black shadow-lg"
                style={{
                  fontFamily: "var(--font-heading)",
                  textDecoration: "none",
                  boxShadow: "0 8px 30px rgba(245,197,24,0.35)",
                }}
              >
                Begin Free Assessment
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Demo Modal containing the demo questions */}
      <DemoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        assessmentType={activeAssessment}
      />
    </div>
  );
}
