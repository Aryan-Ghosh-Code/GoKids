"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AgeBand } from "./utils/bandConfig";
import { CPTResult, AssessmentResults, calcResults } from "./utils/scoring";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { CptInstructionsScreen } from "./screens/CptInstructionsScreen";
import { CptTaskScreen } from "./screens/CptTaskScreen";
import { CptDoneScreen } from "./screens/CptDoneScreen";
import { ParentQuestionnaireScreen } from "./screens/ParentQuestionnaireScreen";
import { ResultsScreen } from "./screens/ResultsScreen";

type Screen =
  | "welcome"
  | "cpt-instructions"
  | "cpt-task"
  | "cpt-done"
  | "questionnaire"
  | "results";

interface ChildInfo {
  _id: string;
  name: string;
}

interface AttentionSpanAssessmentProps {
  childrenList: ChildInfo[];
}

interface AssessmentState {
  childId: string;
  childName: string;
  band: AgeBand | null;
  cptResult: CPTResult | null;
  cptTargetCount: number;
  cptMisses: number;
  parentAnswers: number[];
  parentRaw: number;
  results: AssessmentResults | null;
}

const initialState: AssessmentState = {
  childId: "",
  childName: "",
  band: null,
  cptResult: null,
  cptTargetCount: 0,
  cptMisses: 0,
  parentAnswers: [],
  parentRaw: 0,
  results: null,
};

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function AttentionSpanAssessment({
  childrenList,
}: AttentionSpanAssessmentProps) {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [state, setState] = useState<AssessmentState>(initialState);

  function handleBegin(childId: string, childName: string, band: AgeBand) {
    setState((prev) => ({ ...prev, childId, childName, band }));
    setScreen("cpt-instructions");
  }

  function handleStartTask() {
    setScreen("cpt-task");
  }

  function handleCptComplete(
    cptResult: CPTResult,
    targetCount: number,
    misses: number,
  ) {
    setState((prev) => ({
      ...prev,
      cptResult,
      cptTargetCount: targetCount,
      cptMisses: misses,
    }));
    setScreen("cpt-done");
  }

  function handleStartQuestionnaire() {
    setScreen("questionnaire");
  }

  function handleQuestionnaireComplete(answers: number[], parentRaw: number) {
    if (!state.cptResult) return;
    const results = calcResults(
      state.cptResult.accuracyPct, // ML accuracy (TP+TN) / total
      state.cptResult.hitRatePct, // recall / sensitivity
      state.cptResult.falseAlarms, // raw FP count
      parentRaw,
      state.cptResult.shapesShown, // total shapes for proportional FA thresholds
    );
    setState((prev) => ({
      ...prev,
      parentAnswers: answers,
      parentRaw,
      results,
    }));
    setScreen("results");
  }

  const handleSave = useCallback(async () => {
    if (!state.cptResult || !state.band || !state.childId) {
      throw new Error("Missing assessment data");
    }

    const res = await fetch("/api/assessments/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "attention-span",
        ageBand: state.band,
        childName: state.childName,
        childId: state.childId,
        parentAnswers: state.parentAnswers,
        cptResult: state.cptResult,
      }),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Save failed");
    }
  }, [state]);

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
            <WelcomeScreen childrenList={childrenList} onBegin={handleBegin} />
          </motion.div>
        )}

        {screen === "cpt-instructions" && state.band && (
          <motion.div
            key="cpt-instructions"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <CptInstructionsScreen
              band={state.band}
              childName={state.childName}
              onStart={handleStartTask}
            />
          </motion.div>
        )}

        {screen === "cpt-task" && state.band && (
          <motion.div
            key="cpt-task"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <CptTaskScreen
              band={state.band}
              childName={state.childName}
              onComplete={handleCptComplete}
            />
          </motion.div>
        )}

        {screen === "cpt-done" && state.cptResult && (
          <motion.div
            key="cpt-done"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <CptDoneScreen
              cptResult={state.cptResult}
              onNext={handleStartQuestionnaire}
            />
          </motion.div>
        )}

        {screen === "questionnaire" && (
          <motion.div
            key="questionnaire"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ParentQuestionnaireScreen
              onComplete={handleQuestionnaireComplete}
            />
          </motion.div>
        )}

        {screen === "results" &&
          state.results &&
          state.cptResult &&
          state.band && (
            <motion.div
              key="results"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <ResultsScreen
                results={state.results}
                cptResult={state.cptResult}
                parentRaw={state.parentRaw}
                childName={state.childName}
                ageBand={state.band}
                parentAnswers={state.parentAnswers}
                onSave={handleSave}
              />
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
