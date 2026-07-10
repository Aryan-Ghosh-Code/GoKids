"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Band } from "./utils/bandConfig";
import {
  CptRawData,
  AllScores,
  computeAllScores,
  buildCptRaw,
} from "./utils/scoring";
import { determineProfile, ProfileResult } from "./utils/profiles";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { CptInstructionsScreen } from "./screens/CptInstructionsScreen";
import { CptPhaseScreen } from "./screens/CptPhaseScreen";
import { BurstChallengeScreen } from "./screens/BurstChallengeScreen";
import { CptDoneScreen } from "./screens/CptDoneScreen";
import { SelfReportInstructionsScreen } from "./screens/SelfReportInstructionsScreen";
import { SelfReportQuestionsScreen } from "./screens/SelfReportQuestionsScreen";
import { HandToParentScreen } from "./screens/HandToParentScreen";
import { ParentObservationInstructionsScreen } from "./screens/ParentObservationInstructionsScreen";
import { ParentObservationQuestionsScreen } from "./screens/ParentObservationQuestionsScreen";
import { MotivationInstructionsScreen } from "./screens/MotivationInstructionsScreen";
import { MotivationQuestionsScreen } from "./screens/MotivationQuestionsScreen";
import { ResultsScreen } from "./screens/ResultsScreen";

type Screen =
  | "welcome"
  | "part-a-instructions"
  | "part-a-phase1"
  | "part-a-phase2"
  | "part-a-phase3"
  | "part-a-done"
  | "part-b-instructions"
  | "part-b-questions"
  | "hand-to-parent"
  | "part-c-instructions"
  | "part-c-questions"
  | "part-d-instructions"
  | "part-d-questions"
  | "results";

interface ChildInfo {
  _id: string;
  name: string;
}

interface AttentionSpanAssessmentProps {
  childrenList: ChildInfo[];
}

interface Phase1Counters {
  targets: number;
  hits: number;
  misses: number;
  falseAlarms: number;
}

interface Phase3Counters {
  targets: number;
  hits: number;
  misses: number;
  falseAlarms: number;
}

interface BurstCounters {
  total: number;
  tapped: number;
}

interface AssessmentState {
  childId: string;
  childName: string;
  band: Band | null;

  // CPT Data
  phase1: Phase1Counters | null;
  burst: BurstCounters | null;
  phase3: Phase3Counters | null;
  cptRaw: CptRawData | null;

  // Questionnaire responses
  partBAnswers: number[] | null;
  partCAnswers: number[] | null;
  partDAnswers: number[] | null;

  // Final scores & profile
  scores: AllScores | null;
  profile: ProfileResult | null;
}

const initialState: AssessmentState = {
  childId: "",
  childName: "",
  band: null,
  phase1: null,
  burst: null,
  phase3: null,
  cptRaw: null,
  partBAnswers: null,
  partCAnswers: null,
  partDAnswers: null,
  scores: null,
  profile: null,
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
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const autoSaveTriggered = useRef(false);

  const handleBegin = (childId: string, childName: string, band: Band) => {
    setState((prev) => ({ ...prev, childId, childName, band }));
    setScreen("part-a-instructions");
  };

  const handleStartTask = () => {
    setScreen("part-a-phase1");
  };

  const handlePhase1Complete = (counters: Phase1Counters) => {
    setState((prev) => ({ ...prev, phase1: counters }));
    setScreen("part-a-phase2");
  };

  const handleBurstComplete = (counters: BurstCounters) => {
    setState((prev) => ({ ...prev, burst: counters }));
    setScreen("part-a-phase3");
  };

  const handlePhase3Complete = (counters: Phase3Counters) => {
    setState((prev) => {
      if (!prev.phase1 || !prev.burst) return prev;
      const cptRaw = buildCptRaw(prev.phase1, prev.burst, counters);
      return {
        ...prev,
        phase3: counters,
        cptRaw,
      };
    });
    setScreen("part-a-done");
  };

  const handlePartADoneNext = () => {
    if (state.band === "A") {
      setScreen("hand-to-parent");
    } else {
      setScreen("part-b-instructions");
    }
  };

  const handlePartBStart = () => {
    setScreen("part-b-questions");
  };

  const handlePartBComplete = (answers: number[]) => {
    setState((prev) => ({ ...prev, partBAnswers: answers }));
    setScreen("hand-to-parent");
  };

  const handleHandToParentContinue = () => {
    setScreen("part-c-instructions");
  };

  const handlePartCStart = () => {
    setScreen("part-c-questions");
  };

  const handlePartCComplete = (answers: number[]) => {
    setState((prev) => ({ ...prev, partCAnswers: answers }));
    setScreen("part-d-instructions");
  };

  const handlePartDStart = () => {
    setScreen("part-d-questions");
  };

  const handlePartDComplete = (answers: number[]) => {
    setState((prev) => {
      const band = prev.band;
      const cptRaw = prev.cptRaw;
      const partCAnswers = prev.partCAnswers;
      if (!band || !cptRaw || !partCAnswers) return prev;

      const partBAnswers = prev.partBAnswers || [];
      const scores = computeAllScores(
        cptRaw,
        partBAnswers,
        partCAnswers,
        answers,
        band,
      );
      const profile = determineProfile(scores);

      return {
        ...prev,
        partDAnswers: answers,
        scores,
        profile,
      };
    });
    setScreen("results");
  };

  const buildSavePayload = useCallback(
    (savedToDashboard: boolean) => {
      if (
        !state.band ||
        !state.childId ||
        !state.cptRaw ||
        !state.partCAnswers ||
        !state.partDAnswers ||
        !state.scores ||
        !state.profile
      ) {
        return null;
      }

      return {
        type: "attention-span",
        childId: state.childId,
        childName: state.childName,
        band: state.band,
        cptRaw: state.cptRaw,
        partBAnswers: state.partBAnswers,
        partCAnswers: state.partCAnswers,
        partDAnswers: state.partDAnswers,
        scores: {
          cptBaseScore: state.scores.cptBaseScore,
          recoveryScore: state.scores.recoveryScore,
          fatigueIndex: state.scores.fatigueIndex,
          fatigueFlag: state.scores.fatigueFlag,
          selfReportScore: state.scores.selfReportScore,
          parentScore: state.scores.parentScore,
          clusterScores: state.scores.clusterScores,
          motivationScore: state.scores.motivationScore,
          gapFlag: state.scores.gapFlag,
          gapDirection: state.scores.gapDirection,
        },
        profile: {
          key: state.profile.key,
          name: state.profile.name,
          emoji: state.profile.emoji,
        },
        savedToDashboard,
      };
    },
    [state],
  );

  // Persist results to MongoDB as soon as the assessment completes
  useEffect(() => {
    if (screen !== "results" || autoSaveTriggered.current) return;

    const payload = buildSavePayload(false);
    if (!payload) return;

    autoSaveTriggered.current = true;

    (async () => {
      try {
        const res = await fetch("/api/assessments/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.success) {
          setAssessmentId(data.data.assessmentId);
        }
      } catch (err) {
        console.error("Auto-save assessment failed:", err);
        autoSaveTriggered.current = false;
      }
    })();
  }, [screen, buildSavePayload]);

  const handleSave = useCallback(async () => {
    if (assessmentId) {
      const res = await fetch("/api/assessments/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId,
          savedToDashboard: true,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Save failed");
      }
      return;
    }

    const payload = buildSavePayload(true);
    if (!payload) {
      throw new Error("Missing assessment data to save");
    }

    const res = await fetch("/api/assessments/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Save failed");
    }

    setAssessmentId(data.data.assessmentId);
  }, [assessmentId, buildSavePayload]);

  const partADoneNextLabel =
    state.band === "A"
      ? "Hand the device to a parent. Part 3 starts next"
      : `Hand the device back to ${state.childName}. Part 2 is next`;

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

        {screen === "part-a-instructions" && state.band && (
          <motion.div
            key="part-a-instructions"
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

        {screen === "part-a-phase1" && state.band && (
          <motion.div
            key="part-a-phase1"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <CptPhaseScreen
              band={state.band}
              phase={1}
              onPhaseEnd={handlePhase1Complete}
            />
          </motion.div>
        )}

        {screen === "part-a-phase2" && state.band && (
          <motion.div
            key="part-a-phase2"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <BurstChallengeScreen
              band={state.band}
              onBurstEnd={handleBurstComplete}
            />
          </motion.div>
        )}

        {screen === "part-a-phase3" && state.band && (
          <motion.div
            key="part-a-phase3"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <CptPhaseScreen
              band={state.band}
              phase={3}
              onPhaseEnd={handlePhase3Complete}
            />
          </motion.div>
        )}

        {screen === "part-a-done" && state.band && state.cptRaw && (
          <motion.div
            key="part-a-done"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <CptDoneScreen
              band={state.band}
              childName={state.childName}
              cptRaw={state.cptRaw}
              onNext={handlePartADoneNext}
              nextLabel={partADoneNextLabel}
            />
          </motion.div>
        )}

        {screen === "part-b-instructions" && (
          <motion.div
            key="part-b-instructions"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <SelfReportInstructionsScreen
              childName={state.childName}
              onStart={handlePartBStart}
            />
          </motion.div>
        )}

        {screen === "part-b-questions" && (
          <motion.div
            key="part-b-questions"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <SelfReportQuestionsScreen onComplete={handlePartBComplete} />
          </motion.div>
        )}

        {screen === "hand-to-parent" && (
          <motion.div
            key="hand-to-parent"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <HandToParentScreen onContinue={handleHandToParentContinue} />
          </motion.div>
        )}

        {screen === "part-c-instructions" && (
          <motion.div
            key="part-c-instructions"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ParentObservationInstructionsScreen onStart={handlePartCStart} />
          </motion.div>
        )}

        {screen === "part-c-questions" && (
          <motion.div
            key="part-c-questions"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ParentObservationQuestionsScreen
              onComplete={handlePartCComplete}
            />
          </motion.div>
        )}

        {screen === "part-d-instructions" && (
          <motion.div
            key="part-d-instructions"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <MotivationInstructionsScreen onStart={handlePartDStart} />
          </motion.div>
        )}

        {screen === "part-d-questions" && (
          <motion.div
            key="part-d-questions"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <MotivationQuestionsScreen onComplete={handlePartDComplete} />
          </motion.div>
        )}

        {screen === "results" &&
          state.profile &&
          state.scores &&
          state.cptRaw &&
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
                profile={state.profile}
                scores={state.scores}
                cptRaw={state.cptRaw}
                childName={state.childName}
                band={state.band}
                onSave={handleSave}
              />
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
