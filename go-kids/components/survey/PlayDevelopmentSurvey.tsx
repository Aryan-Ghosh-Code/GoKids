"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SURVEY_QUESTIONS } from "./data/surveyQuestions";
import { SingleQuestionScreen, OpenQuestionScreen } from "./screens/SurveyQuestion";
import { SurveyWaitlist } from "./screens/SurveyWaitlist";
import { SurveySuccess } from "./screens/SurveySuccess";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SurveyState {
  screen: number;
  answers: Record<string, string>;
  name: string;
  email: string;
  emailError: string;
  isSubmitting: boolean;
  submitError: string;
}

const initial: SurveyState = {
  screen: 0,
  answers: {},
  name: "",
  email: "",
  emailError: "",
  isSubmitting: false,
  submitError: "",
};

// Screen mapping:
// 0  → Intro
// 1–7 → Q1–Q7 (single choice)
// 8  → Q8 (open text)
// 9  → Waitlist
// 10 → Success

const TOTAL_SCREENS = 10;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccessScrollToAssessments?: () => void;
}

const slideVariants = {
  initial: { opacity: 0, x: 32 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
};

export default function PlayDevelopmentSurvey({
  isOpen,
  onClose,
  onSuccessScrollToAssessments,
}: Props) {
  const [state, setState] = useState<SurveyState>(initial);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const hasAnswered = Object.keys(state.answers).length > 0;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleClose() {
    if (hasAnswered && state.screen < 10) {
      setShowExitConfirm(true);
    } else {
      setState(initial);
      onClose();
    }
  }

  function confirmClose() {
    setShowExitConfirm(false);
    setState(initial);
    onClose();
  }

  function cancelClose() {
    setShowExitConfirm(false);
  }

  function goTo(screen: number) {
    setState((s) => ({ ...s, screen }));
  }

  function setAnswer(qId: string, value: string) {
    setState((s) => ({ ...s, answers: { ...s.answers, [qId]: value } }));
  }

  // Screen 0 → 1
  function handleStartSurvey() {
    goTo(1);
  }

  // Screens 1–7 (Q1–Q7, single choice)
  function handleSingleNext(qId: string) {
    setState((s) => ({ ...s, screen: s.screen + 1 }));
  }

  function handleBack() {
    setState((s) => ({ ...s, screen: Math.max(0, s.screen - 1) }));
  }

  // Screen 8 (Q8, open text) → 9
  function handleOpenNext() {
    goTo(9);
  }

  // Waitlist submit
  const handleSubmit = useCallback(
    async (skipWaitlist = false) => {
      setState((s) => ({ ...s, isSubmitting: true, submitError: "" }));

      try {
        const res = await fetch("/api/survey/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: state.answers,
            name: skipWaitlist ? "" : state.name,
            email: skipWaitlist ? "" : state.email,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Submission failed");
        }

        setState((s) => ({ ...s, isSubmitting: false, screen: 10 }));
      } catch (err) {
        setState((s) => ({
          ...s,
          isSubmitting: false,
          submitError:
            err instanceof Error
              ? err.message
              : "Something went wrong. Please try again.",
        }));
      }
    },
    [state.answers, state.name, state.email],
  );

  function handleExploreAssessments() {
    setState(initial);
    onClose();
    onSuccessScrollToAssessments?.();
  }

  function handleSuccessClose() {
    setState(initial);
    onClose();
  }

  // Derive current question (screens 1–8 map to SURVEY_QUESTIONS[0–7])
  const currentQuestion =
    state.screen >= 1 && state.screen <= 8
      ? SURVEY_QUESTIONS[state.screen - 1]
      : null;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    >
      {/* Modal panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "92vh" }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all z-10 cursor-pointer"
          aria-label="Close survey"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          <AnimatePresence mode="wait">
            {/* ── Screen 0: Intro ─────────────────────────────────────────── */}
            {state.screen === 0 && (
              <motion.div
                key="intro"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.22 }}
                className="flex flex-col items-center text-center gap-5 py-4"
              >
                <div className="text-6xl">🧩</div>
                <div className="space-y-2">
                  <h2
                    className="text-2xl font-extrabold text-brand-black"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Help Us Understand Your Child Better
                  </h2>
                  <p
                    className="text-sm leading-relaxed max-w-sm mx-auto"
                    style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}
                  >
                    8 quick questions to help us build the right tools for Indian parents.
                    No login needed. Takes 3–4 minutes.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStartSurvey}
                  className="w-full py-4 rounded-xl font-extrabold text-sm cursor-pointer"
                  style={{
                    fontFamily: "var(--font-heading)",
                    background: "#F5C518",
                    color: "#1A1A1A",
                    boxShadow: "0 4px 16px rgba(245,197,24,0.3)",
                  }}
                >
                  Start Survey →
                </motion.button>
                <p
                  className="text-[11px]"
                  style={{ fontFamily: "Inter, sans-serif", color: "#9CA3AF" }}
                >
                  Your responses are anonymous unless you choose to join our waitlist.
                </p>
              </motion.div>
            )}

            {/* ── Screens 1–7: Single-choice questions ─────────────────────── */}
            {state.screen >= 1 &&
              state.screen <= 7 &&
              currentQuestion?.type === "single" && (
                <motion.div
                  key={`q-${state.screen}`}
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.22 }}
                >
                  <SingleQuestionScreen
                    question={currentQuestion}
                    questionNumber={state.screen}
                    selected={state.answers[currentQuestion.id] ?? ""}
                    onSelect={(v) => setAnswer(currentQuestion.id, v)}
                    onNext={() => handleSingleNext(currentQuestion.id)}
                    onBack={handleBack}
                    canGoBack={state.screen > 1}
                  />
                </motion.div>
              )}

            {/* ── Screen 8: Open text (Q8) ──────────────────────────────────── */}
            {state.screen === 8 && currentQuestion?.type === "open" && (
              <motion.div
                key="q8"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.22 }}
              >
                <OpenQuestionScreen
                  question={currentQuestion}
                  questionNumber={8}
                  value={state.answers["Q8"] ?? ""}
                  onChange={(v) => setAnswer("Q8", v)}
                  onNext={handleOpenNext}
                  onBack={handleBack}
                />
              </motion.div>
            )}

            {/* ── Screen 9: Waitlist ────────────────────────────────────────── */}
            {state.screen === 9 && (
              <motion.div
                key="waitlist"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.22 }}
              >
                <SurveyWaitlist
                  name={state.name}
                  email={state.email}
                  emailError={state.emailError}
                  isSubmitting={state.isSubmitting}
                  submitError={state.submitError}
                  onNameChange={(v) => setState((s) => ({ ...s, name: v }))}
                  onEmailChange={(v) => setState((s) => ({ ...s, email: v, emailError: "" }))}
                  onSubmit={() => handleSubmit(false)}
                  onSkip={() => handleSubmit(true)}
                  onBack={handleBack}
                />
              </motion.div>
            )}

            {/* ── Screen 10: Success ────────────────────────────────────────── */}
            {state.screen === 10 && (
              <motion.div
                key="success"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.22 }}
              >
                <SurveySuccess
                  onExplore={handleExploreAssessments}
                  onClose={handleSuccessClose}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Exit confirmation overlay */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.4)", zIndex: 110 }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-xl text-center space-y-4"
            >
              <p
                className="text-sm font-extrabold text-brand-black"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Your progress will be lost. Exit?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Keep going
                </button>
                <button
                  onClick={confirmClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                  style={{
                    fontFamily: "var(--font-heading)",
                    background: "#F4845F",
                    color: "white",
                  }}
                >
                  Yes, exit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
