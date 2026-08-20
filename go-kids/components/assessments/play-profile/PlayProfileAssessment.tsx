"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QUESTIONS } from "./utils/questions";
import { computeDimensionScores } from "./utils/scoring";
import { matchArchetype } from "./utils/archetypes";
import type { DimensionScores } from "./utils/scoring";
import type { Archetype } from "./utils/archetypes";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { QuestionScreen } from "./screens/QuestionScreen";
import { ResultsScreen } from "./screens/ResultsScreen";

type Screen = "welcome" | "questions" | "results";

interface ChildInfo {
  _id: string;
  name: string;
  dob?: string;
}

interface PlayProfileAssessmentProps {
  childrenList: ChildInfo[];
}

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function PlayProfileAssessment({
  childrenList,
}: PlayProfileAssessmentProps) {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [childId, setChildId] = useState("");
  const [childName, setChildName] = useState("");
  const [band, setBand] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [rawScores, setRawScores] = useState<DimensionScores | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const autoSaveTriggered = useRef(false);

  function handleBegin(id: string, name: string, detectedBand: string) {
    setChildId(id);
    setChildName(name);
    setBand(detectedBand);
    setCurrentQuestion(0);
    setAnswers([]);
    setScreen("questions");
  }

  function handleAnswer(optionIndex: number) {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion + 1 >= QUESTIONS.length) {
      // All questions answered — compute result
      const scores = computeDimensionScores(newAnswers);
      const matched = matchArchetype(scores);
      setRawScores(scores);
      setArchetype(matched);
      setScreen("results");
    } else {
      setCurrentQuestion((q) => q + 1);
    }
  }

  const buildPayload = useCallback(
    (savedToDashboard: boolean) => {
      if (!archetype || !rawScores) return null;
      return {
        childId: childId || undefined,
        childName,
        band,
        answers,
        scores: rawScores,
        archetype: {
          key: archetype.key,
          name: archetype.name,
          emoji: archetype.emoji,
        },
        savedToDashboard,
      };
    },
    [archetype, rawScores, childId, childName, band, answers],
  );

  // Auto-save to MongoDB when results screen appears
  useEffect(() => {
    if (screen !== "results" || autoSaveTriggered.current) return;
    const payload = buildPayload(false);
    if (!payload) return;

    autoSaveTriggered.current = true;

    (async () => {
      try {
        const res = await fetch("/api/assessments/play-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setAssessmentId(data.data.assessmentId);
        }
      } catch (err) {
        console.error("Auto-save play-profile failed:", err);
        autoSaveTriggered.current = false;
      }
    })();
  }, [screen, buildPayload]);

  const handleSave = useCallback(async () => {
    if (assessmentId) {
      const res = await fetch("/api/assessments/play-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, savedToDashboard: true }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Save failed");
      return;
    }

    const payload = buildPayload(true);
    if (!payload) throw new Error("Missing assessment data");

    const res = await fetch("/api/assessments/play-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Save failed");
    setAssessmentId(data.data.assessmentId);
  }, [assessmentId, buildPayload]);

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-4xl border-[1.5px] border-gray-200/85 shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {screen === "welcome" && (
          <motion.div
            key="welcome"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <WelcomeScreen
              childrenList={childrenList}
              onBegin={handleBegin}
            />
          </motion.div>
        )}

        {screen === "questions" && (
          <motion.div
            key={`question-${currentQuestion}`}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <QuestionScreen
              question={QUESTIONS[currentQuestion]}
              questionNumber={currentQuestion + 1}
              totalQuestions={QUESTIONS.length}
              onAnswer={handleAnswer}
            />
          </motion.div>
        )}

        {screen === "results" && archetype && rawScores && (
          <motion.div
            key="results"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ResultsScreen
              archetype={archetype}
              rawScores={rawScores}
              childName={childName}
              onSave={handleSave}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
