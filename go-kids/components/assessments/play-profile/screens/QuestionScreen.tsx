"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "../utils/questions";

interface Props {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (optionIndex: number) => void;
}

export function QuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const progress = ((questionNumber - 1) / totalQuestions) * 100;

  function handleSelect(idx: number) {
    setSelected(idx);
  }

  function handleNext() {
    if (selected === null) return;
    onAnswer(selected);
    setSelected(null);
  }

  const optionLetters = ["A", "B", "C"];

  return (
    <div className="space-y-5 py-2">
      {/* Progress header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Question {questionNumber} of {totalQuestions}
          </span>
          <span
            className="text-[10px] font-extrabold text-gray-400"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {Math.round(progress)}% complete
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "#2BBCB0" }}
            initial={{ width: `${progress}%` }}
            animate={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question text */}
      <div className="space-y-1.5 pt-1">
        <h3
          className="text-base sm:text-lg font-extrabold text-brand-black leading-snug"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {question.text}
        </h3>
        {question.helpText && (
          <p className="text-xs text-gray-400 font-semibold italic">
            {question.helpText}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        <AnimatePresence mode="wait">
          {question.options.map((option, idx) => {
            const isSelected = selected === idx;
            return (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(idx)}
                className="w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer"
                style={{
                  borderColor: isSelected ? "#2BBCB0" : "#E5E7EB",
                  background: isSelected ? "#F0FCFB" : "white",
                  boxShadow: isSelected
                    ? "0 0 0 3px rgba(43,188,176,0.12)"
                    : "none",
                }}
              >
                {/* Letter badge */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 transition-all"
                  style={{
                    fontFamily: "var(--font-heading)",
                    background: isSelected ? "#2BBCB0" : "#F3F4F6",
                    color: isSelected ? "white" : "#6B7280",
                  }}
                >
                  {optionLetters[idx]}
                </div>
                <p
                  className="text-sm font-semibold leading-relaxed text-brand-black"
                  style={{ color: isSelected ? "#1A1A1A" : "#374151" }}
                >
                  {option.text}
                </p>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Next button */}
      <motion.button
        whileHover={{ scale: selected !== null ? 1.02 : 1 }}
        whileTap={{ scale: selected !== null ? 0.98 : 1 }}
        onClick={handleNext}
        disabled={selected === null}
        className="w-full py-4 rounded-2xl font-extrabold text-sm transition-all disabled:cursor-not-allowed cursor-pointer mt-2"
        style={{
          fontFamily: "var(--font-heading)",
          background: selected !== null ? "#F5C518" : "#E5E7EB",
          color: selected !== null ? "#1A1A1A" : "#9CA3AF",
          boxShadow:
            selected !== null ? "0 4px 12px rgba(245,197,24,0.3)" : "none",
        }}
      >
        {questionNumber < totalQuestions ? "Next Question →" : "See My Results →"}
      </motion.button>
    </div>
  );
}
