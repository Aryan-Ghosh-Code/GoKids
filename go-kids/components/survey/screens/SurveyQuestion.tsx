"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SingleQuestion, OpenQuestion } from "../data/surveyQuestions";
import { TOTAL_QUESTIONS } from "../data/surveyQuestions";

// ─── Single-choice Question Screen ────────────────────────────────────────────
interface SingleQuestionProps {
  question: SingleQuestion;
  questionNumber: number;
  selected: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
}

function SingleQuestionScreen({
  question,
  questionNumber,
  selected,
  onSelect,
  onNext,
  onBack,
  canGoBack,
}: SingleQuestionProps) {
  const [pulseError, setPulseError] = useState(false);
  const progress = (questionNumber / (TOTAL_QUESTIONS + 2)) * 100; // +2 for intro + waitlist

  function handleNextClick() {
    if (!selected) {
      setPulseError(true);
      setTimeout(() => setPulseError(false), 400);
      return;
    }
    onNext();
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Progress + back row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {canGoBack ? (
            <button
              onClick={onBack}
              className="text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1 cursor-pointer"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              ← Back
            </button>
          ) : (
            <div />
          )}
          <span className="text-xs font-semibold text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
            Question {questionNumber} of {TOTAL_QUESTIONS}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "#F5C518" }}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question text */}
      <div className="space-y-1">
        <h3
          className="text-[17px] leading-snug font-bold text-brand-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {question.text}
        </h3>
        {question.instruction && (
          <p className="text-[13px] text-gray-400 font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>
            {question.instruction}
          </p>
        )}
      </div>

      {/* Options */}
      <div
        className={`space-y-2.5 transition-all duration-300 ${pulseError ? "animate-[errorPulse_0.3s_ease-in-out]" : ""}`}
      >
        <style>{`
          @keyframes errorPulse {
            0%,100% { }
            50% { filter: drop-shadow(0 0 4px rgba(239,68,68,0.5)); }
          }
        `}</style>
        {question.options.map((opt) => {
          const isSelected = selected === opt;
          return (
            <motion.button
              key={opt}
              whileHover={!isSelected ? { backgroundColor: "#F9FAFB" } : {}}
              whileTap={{ scale: 0.99 }}
              animate={isSelected ? { scale: 1.01 } : { scale: 1 }}
              transition={{ duration: 0.15 }}
              onClick={() => onSelect(opt)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left cursor-pointer transition-colors"
              style={{
                borderColor: isSelected ? "#F5C518" : "#E5E7EB",
                borderWidth: "1.5px",
                background: isSelected ? "#FFF9E6" : "white",
              }}
            >
              {/* Radio circle */}
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all"
                style={{
                  border: isSelected ? "none" : "1.5px solid #D1D5DB",
                  background: isSelected ? "#F5C518" : "transparent",
                }}
              >
                {isSelected && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                className="text-sm leading-snug"
                style={{ fontFamily: "Inter, sans-serif", color: "#1A1A1A" }}
              >
                {opt}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Next button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleNextClick}
        className="w-full py-3.5 rounded-xl font-extrabold text-sm transition-all cursor-pointer mt-1"
        style={{
          fontFamily: "var(--font-heading)",
          background: selected ? "#F5C518" : "#E5E7EB",
          color: selected ? "#1A1A1A" : "#9CA3AF",
          boxShadow: selected ? "0 4px 12px rgba(245,197,24,0.28)" : "none",
        }}
      >
        Next →
      </motion.button>
    </div>
  );
}

// ─── Open-text Question Screen ─────────────────────────────────────────────────
interface OpenQuestionProps {
  question: OpenQuestion;
  questionNumber: number;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

function OpenQuestionScreen({
  question,
  questionNumber,
  value,
  onChange,
  onNext,
  onBack,
}: OpenQuestionProps) {
  const MAX = 500;
  const progress = (questionNumber / (TOTAL_QUESTIONS + 2)) * 100;

  return (
    <div className="flex flex-col gap-5">
      {/* Progress + back row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1 cursor-pointer"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ← Back
          </button>
          <span className="text-xs font-semibold text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
            Question {questionNumber} of {TOTAL_QUESTIONS}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "#F5C518" }}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question text */}
      <h3
        className="text-[17px] leading-snug font-bold text-brand-black"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {question.text}
      </h3>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX))}
          placeholder={question.placeholder}
          className="w-full resize-none rounded-xl border px-3.5 py-3 text-sm leading-relaxed outline-none transition-colors"
          style={{
            minHeight: "128px",
            borderColor: "#E5E7EB",
            fontFamily: "Inter, sans-serif",
            color: "#1A1A1A",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#F5C518")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
        />
        <span
          className="absolute bottom-2.5 right-3 text-[11px]"
          style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}
        >
          {value.length} / {MAX}
        </span>
      </div>

      <p className="text-xs text-gray-400 font-semibold -mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
        Optional — you can leave this blank.
      </p>

      {/* Continue button — always active */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="w-full py-3.5 rounded-xl font-extrabold text-sm transition-all cursor-pointer"
        style={{
          fontFamily: "var(--font-heading)",
          background: "#F5C518",
          color: "#1A1A1A",
          boxShadow: "0 4px 12px rgba(245,197,24,0.28)",
        }}
      >
        Continue →
      </motion.button>
    </div>
  );
}

// ─── Exported wrapper that selects the right variant ──────────────────────────
export { SingleQuestionScreen, OpenQuestionScreen };
