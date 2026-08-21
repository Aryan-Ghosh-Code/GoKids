"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const PlayDevelopmentSurvey = dynamic(
  () => import("./PlayDevelopmentSurvey"),
  { ssr: false },
);

interface Props {
  assessmentsSectionRef?: React.RefObject<HTMLElement | null>;
}

export default function SurveyEntryCard({ assessmentsSectionRef }: Props) {
  const [surveyOpen, setSurveyOpen] = useState(false);

  function handleScrollToAssessments() {
    assessmentsSectionRef?.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* ── Entry Banner Card ─────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border bg-white overflow-hidden"
        style={{
          borderColor: "#E5E7EB",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 sm:p-8">
          {/* Left content */}
          <div className="flex-1 min-w-0 space-y-3">
            <p
              className="text-xs font-extrabold uppercase tracking-widest"
              style={{ color: "#2BBCB0", fontFamily: "var(--font-heading)" }}
            >
              Quick Survey · 3–4 Minutes
            </p>
            <h2
              className="text-xl sm:text-[22px] font-extrabold text-brand-black leading-snug"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Help Us Understand Your Child Better
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}
            >
              We&apos;re building tools for Indian parents raising young children.
              8 quick questions — your answers shape what we build next.
            </p>
            <div className="pt-1">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSurveyOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold text-sm cursor-pointer"
                style={{
                  fontFamily: "var(--font-heading)",
                  background: "#F5C518",
                  color: "#1A1A1A",
                  boxShadow: "0 4px 14px rgba(245,197,24,0.28)",
                }}
              >
                Be Part of Our Survey →
              </motion.button>
            </div>
          </div>

          {/* Right illustration (desktop only) */}
          <div className="hidden md:flex flex-col items-center justify-center shrink-0 space-y-2 w-36">
            <div className="text-7xl select-none">🧩</div>
            <p
              className="text-[11px] font-semibold text-center"
              style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}
            >
              No login needed · Takes 3 minutes
            </p>
          </div>
        </div>
      </div>

      {/* ── Survey Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {surveyOpen && (
          <PlayDevelopmentSurvey
            isOpen={surveyOpen}
            onClose={() => setSurveyOpen(false)}
            onSuccessScrollToAssessments={handleScrollToAssessments}
          />
        )}
      </AnimatePresence>
    </>
  );
}
