"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PARENT_QUESTIONS } from "../utils/parentQuestions";
import { useParentQuestionnaire } from "../hooks/useParentQuestionnaire";

const RATING_LABELS: Record<number, string> = {
  1: "Never",
  2: "Rarely",
  3: "Sometimes",
  4: "Often",
  5: "Almost always",
};

interface ParentQuestionnaireScreenProps {
  onComplete: (answers: number[], parentRaw: number) => void;
}

export function ParentQuestionnaireScreen({
  onComplete,
}: ParentQuestionnaireScreenProps) {
  const {
    currentIndex,
    selectedRating,
    showValidationError,
    selectRating,
    next,
    progress,
    isLast,
  } = useParentQuestionnaire(PARENT_QUESTIONS.length);

  function handleNext() {
    next((answers) => {
      const raw = answers.reduce((a, b) => a + b, 0);
      onComplete(answers, raw);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-bold uppercase tracking-wider text-gray-500"
          >
            Part B — Parent Questionnaire
          </span>
          <span className="text-xs font-bold text-gray-500">
            {currentIndex + 1} / {PARENT_QUESTIONS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-2 rounded-full overflow-hidden bg-gray-100"
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          <div className="bg-brand-offwhite rounded-2xl p-5 border border-gray-150 shadow-2xs min-h-[96px] flex items-center justify-center text-center">
            <p
              className="text-base font-semibold leading-relaxed text-brand-black"
            >
              &ldquo;{PARENT_QUESTIONS[currentIndex]}&rdquo;
            </p>
          </div>

          {/* Rating buttons */}
          <div className="space-y-4">
            <motion.div
              className="grid grid-cols-5 gap-3"
              animate={
                showValidationError
                  ? { x: [0, -6, 6, -4, 4, 0] }
                  : { x: 0 }
              }
              transition={{ duration: 0.3 }}
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <motion.button
                  key={rating}
                  onClick={() => selectRating(rating)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full font-extrabold text-lg flex items-center justify-center transition-all cursor-pointer border-none"
                  style={{
                    background:
                      selectedRating === rating ? "#F5C518" : "#FFFFFF",
                    color: "#1A1A1A",
                    boxShadow:
                      selectedRating === rating
                        ? "0 4px 14px rgba(245,197,24,0.35)"
                        : "0 2px 8px rgba(0,0,0,0.04)",
                    border:
                      showValidationError && selectedRating === 0
                        ? "2px solid #ef4444"
                        : selectedRating === rating
                        ? "2px solid #F5C518"
                        : "1.5px solid #E5E7EB",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {rating}
                </motion.button>
              ))}
            </motion.div>

            {/* Labels row */}
            <div className="flex justify-between px-2">
              <span className="text-xs font-bold text-gray-400">
                Never
              </span>
              <span className="text-xs font-bold text-gray-400">
                Almost always
              </span>
            </div>

            {/* Selected label */}
            <div className="min-h-[20px]">
              <AnimatePresence mode="wait">
                {selectedRating > 0 ? (
                  <motion.p
                    key={selectedRating}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-sm font-extrabold text-brand-black"
                  >
                    Rating: <span className="text-[#F4845F]">{RATING_LABELS[selectedRating]}</span>
                  </motion.p>
                ) : (
                  <p className="text-center text-xs font-semibold text-gray-400">
                    Select a number from 1 to 5
                  </p>
                )}
              </AnimatePresence>
            </div>

            {showValidationError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs font-extrabold text-red-500"
              >
                Please select a rating before continuing.
              </motion.p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      <motion.button
        onClick={handleNext}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-2xl font-extrabold text-base cursor-pointer bg-primary text-brand-black border-none shadow-md"
        style={{
          fontFamily: "var(--font-heading)",
          boxShadow: "0 8px 24px rgba(245, 197, 24, 0.25)",
        }}
      >
        {isLast ? "See Results →" : "Next →"}
      </motion.button>
    </motion.div>
  );
}
