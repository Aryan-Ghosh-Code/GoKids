"use client";

import { motion } from "framer-motion";
import { CPTResult } from "../utils/scoring";

interface CptDoneScreenProps {
  cptResult: CPTResult;
  onNext: () => void;
}

function StatPill({
  emoji,
  label,
  value,
  bg,
  color,
  delay,
}: {
  emoji: string;
  label: string;
  value: string | number;
  bg: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
      style={{ background: bg }}
    >
      <span className="text-xl shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-500">{label}</p>
        <p
          className="text-lg font-black"
          style={{ color, fontFamily: "var(--font-heading)" }}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}

export function CptDoneScreen({ cptResult, onNext }: CptDoneScreenProps) {
  const { shapesShown, hits, misses, falseAlarms, accuracyPct } = cptResult;

  const accuracyStyle =
    accuracyPct >= 85
      ? { emoji: "🌟", label: "Excellent!", bg: "linear-gradient(135deg,#F0FDF4,#DCFCE7)", color: "#15803D", ring: "#22c55e" }
      : accuracyPct >= 70
      ? { emoji: "👍", label: "Good job!", bg: "linear-gradient(135deg,#FFFBEB,#FEF9C3)", color: "#854D0E", ring: "#F5C518" }
      : accuracyPct >= 55
      ? { emoji: "💪", label: "Keep trying!", bg: "linear-gradient(135deg,#FFF7ED,#FFEDD5)", color: "#9A3412", ring: "#FB923C" }
      : { emoji: "🤗", label: "Nice effort!", bg: "linear-gradient(135deg,#FEF2F2,#FEE2E2)", color: "#991B1B", ring: "#EF4444" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Hero check */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 18,
            delay: 0.1,
          }}
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold bg-[#E8F8F7] border-[3px] border-teal"
          style={{ color: "#2BBCB0" }}
        >
          ✓
        </motion.div>
        <div className="text-center">
          <h2
            className="text-2xl font-extrabold text-brand-black"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Part A Complete! ✅
          </h2>
          <p className="text-sm mt-1 text-gray-500 font-semibold">
            Great job! Here&apos;s how your child performed.
          </p>
        </div>
      </div>

      {/* Big accuracy card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="rounded-3xl p-6 flex items-center justify-between gap-4"
        style={{
          background: accuracyStyle.bg,
          border: `2px solid ${accuracyStyle.ring}40`,
        }}
      >
        <div>
          <p
            className="text-xs font-extrabold uppercase tracking-widest"
            style={{ color: accuracyStyle.color, opacity: 0.7 }}
          >
            Focus Score
          </p>
          <p
            className="text-5xl font-black mt-1"
            style={{
              color: accuracyStyle.color,
              fontFamily: "var(--font-heading)",
            }}
          >
            {accuracyPct}%
          </p>
          <p
            className="text-sm font-bold mt-1"
            style={{ color: accuracyStyle.color }}
          >
            {accuracyStyle.label}
          </p>
        </div>
        <span className="text-5xl shrink-0">{accuracyStyle.emoji}</span>
      </motion.div>

      {/* Simple friendly stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatPill
          emoji="👁️"
          label="Shapes seen"
          value={shapesShown}
          bg="#F3F4F6"
          color="#1A1A1A"
          delay={0.2}
        />
        <StatPill
          emoji="✅"
          label="Correct taps"
          value={hits}
          bg="#F0FDF4"
          color="#15803D"
          delay={0.25}
        />
        <StatPill
          emoji="⏱️"
          label="Missed targets"
          value={misses}
          bg="#FFFBEB"
          color="#92400E"
          delay={0.3}
        />
        <StatPill
          emoji="❌"
          label="Wrong taps"
          value={falseAlarms}
          bg="#FEF2F2"
          color="#991B1B"
          delay={0.35}
        />
      </div>

      {/* Hand-off banner */}
      <div className="rounded-2xl p-5 flex gap-3.5 items-start bg-[#E8F8F7]/60 border border-teal/30">
        <span className="text-2xl">👨‍👩‍👧</span>
        <div>
          <p className="text-sm font-bold text-[#0D7A73]">
            Hand the device back to the parent
          </p>
          <p className="text-xs mt-1 text-gray-600 leading-relaxed font-semibold">
            The child&apos;s part is complete. The next section is a short
            questionnaire for a parent or guardian.
          </p>
        </div>
      </div>

      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-2xl font-extrabold text-base cursor-pointer border-none"
        style={{
          background: "#F5C518",
          color: "#1A1A1A",
          fontFamily: "var(--font-heading)",
          boxShadow: "0 8px 24px rgba(245,197,24,0.3)",
        }}
      >
        Hand to Parent — Start Part B →
      </motion.button>
    </motion.div>
  );
}
