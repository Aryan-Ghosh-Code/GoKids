"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PART_B_QUESTIONS, PART_B_LABELS } from "../utils/questions";

interface Props {
  onComplete: (answers: number[]) => void;
}

const RATING_LABELS = [
  "Strongly\nDisagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly\nAgree",
];

export function SelfReportQuestionsScreen({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(PART_B_QUESTIONS.length).fill(null),
  );
  const [pulse, setPulse] = useState(false);

  const question = PART_B_QUESTIONS[current];
  const selected = answers[current];
  const progress = (current / PART_B_QUESTIONS.length) * 100;
  void PART_B_LABELS;

  function handleRating(val: number) {
    const updated = [...answers];
    updated[current] = val;
    setAnswers(updated);
  }

  function handleNext() {
    if (selected === null) {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
      return;
    }
    if (current < PART_B_QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      onComplete(answers as number[]);
    }
  }

  return (
    <div className="space-y-5 py-2">
      {/* Part badge */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#FEF0EB] text-coral"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Part 2 — For Child
        </span>
        <span className="text-xs font-semibold text-gray-400">
          {current + 1} of {PART_B_QUESTIONS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "#F3F4F6" }}
      >
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
          className="h-full rounded-full"
          style={{ background: "#F5C518" }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          <div
            className="rounded-2xl p-5 min-h-25 flex items-center"
            style={{ background: "#FAFAF8", border: "1.5px solid #F3F4F6" }}
          >
            <p className="text-base font-semibold text-brand-black leading-relaxed">
              {question.text}
            </p>
          </div>

          {/* Rating buttons */}
          <div
            className={`grid grid-cols-5 gap-1.5 transition-all ${pulse ? "ring-2 ring-red-300 ring-offset-2 rounded-xl" : ""}`}
          >
            {RATING_LABELS.map((label, i) => {
              const val = i + 1;
              const isSelected = selected === val;
              return (
                <motion.button
                  key={val}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleRating(val)}
                  className="flex flex-col items-center py-3 px-1 rounded-xl border-2 text-xs font-extrabold transition-all"
                  style={{
                    borderColor: isSelected ? "#F5C518" : "#E5E7EB",
                    background: isSelected ? "#F5C518" : "#FFFFFF",
                    color: "#1A1A1A",
                    fontFamily: "var(--font-heading)",
                    scale: isSelected ? 1.05 : 1,
                  }}
                >
                  <span className="text-base font-extrabold">{val}</span>
                  <span className="text-[9px] font-semibold text-center leading-tight mt-1 whitespace-pre-line text-gray-500">
                    {label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleNext}
        className="w-full py-4 rounded-2xl font-extrabold text-sm"
        style={{
          background: selected !== null ? "#F5C518" : "#F3F4F6",
          color: selected !== null ? "#1A1A1A" : "#9CA3AF",
          fontFamily: "var(--font-heading)",
          boxShadow:
            selected !== null ? "0 4px 16px rgba(245,197,24,0.35)" : "none",
        }}
      >
        {current < PART_B_QUESTIONS.length - 1 ? "Next →" : "Done →"}
      </motion.button>
    </div>
  );
}
