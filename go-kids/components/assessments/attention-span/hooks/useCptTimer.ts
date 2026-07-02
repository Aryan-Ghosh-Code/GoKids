"use client";

import { useRef, useState, useCallback } from "react";
import { BAND_CONFIG, AgeBand } from "../utils/bandConfig";
import { CPTResult } from "../utils/scoring";

export type CptState = {
  timeLeft: number;
  shapesShown: number;
  hits: number;
  falseAlarms: number;
  currentShape: string | null;
  isTarget: boolean;
  shapeVisible: boolean;
  feedback: "correct" | "false-alarm" | "missed" | null;
  tapFlash: "hit" | "miss" | null;
};

type UseCptTimerReturn = {
  state: CptState;
  start: () => void;
  handleTap: () => void;
  isRunning: boolean;
  destroy: () => void;
};

export function useCptTimer(
  band: AgeBand,
  onComplete: (result: CPTResult, targetCount: number, misses: number) => void
): UseCptTimerReturn {
  const config = BAND_CONFIG[band];

  const [state, setState] = useState<CptState>({
    timeLeft: config.durSeconds,
    shapesShown: 0,
    hits: 0,
    falseAlarms: 0,
    currentShape: null,
    isTarget: false,
    shapeVisible: false,
    feedback: null,
    tapFlash: null,
  });

  const timerRef    = useRef<NodeJS.Timeout | null>(null);
  const shapeRef    = useRef<NodeJS.Timeout | null>(null);
  const hideRef     = useRef<NodeJS.Timeout | null>(null);
  const feedbackRef = useRef<NodeJS.Timeout | null>(null);
  const runningRef  = useRef(false);

  // Per-session counters kept in refs so timers always read latest value
  const hitsRef            = useRef(0);
  const falseAlarmsRef     = useRef(0);
  const shapesShownRef     = useRef(0);
  const targetCountRef     = useRef(0);
  const nonTargetCountRef  = useRef(0);
  const missesRef          = useRef(0);
  const currentIsTargetRef = useRef(false);
  const tapHappenedRef     = useRef(false); // ONE tap per shape — prevents double-counting

  const cleanup = useCallback(() => {
    runningRef.current = false;
    if (timerRef.current)    clearInterval(timerRef.current);
    if (shapeRef.current)    clearTimeout(shapeRef.current);
    if (hideRef.current)     clearTimeout(hideRef.current);
    if (feedbackRef.current) clearTimeout(feedbackRef.current);
  }, []);

  const showFeedback = useCallback(
    (type: "correct" | "false-alarm" | "missed", tapFlash: "hit" | "miss" | null) => {
      setState((prev) => ({ ...prev, feedback: type, tapFlash }));
      feedbackRef.current = setTimeout(() => {
        setState((prev) => ({ ...prev, feedback: null, tapFlash: null }));
      }, 1200);
    },
    []
  );

  const scheduleShape = useCallback(() => {
    if (!runningRef.current) return;

    const delay = 700 + Math.random() * 1100;
    shapeRef.current = setTimeout(() => {
      if (!runningRef.current) return;

      const isTarget = Math.random() < 0.3;
      const nonTargets = config.shapes.filter(
        (_: string, i: number) => i !== config.targetIdx
      );
      const displayShape = isTarget
        ? config.target
        : nonTargets[Math.floor(Math.random() * nonTargets.length)];

      currentIsTargetRef.current = isTarget;
      tapHappenedRef.current = false; // reset for each new shape
      shapesShownRef.current++;
      if (isTarget) {
        targetCountRef.current++;
      } else {
        nonTargetCountRef.current++;
      }

      setState((prev) => ({
        ...prev,
        currentShape: displayShape,
        isTarget,
        shapeVisible: true,
        shapesShown: shapesShownRef.current,
      }));

      hideRef.current = setTimeout(() => {
        setState((prev) => ({ ...prev, shapeVisible: false }));
        // Only count a miss if this was a target and nobody tapped it
        if (isTarget && !tapHappenedRef.current) {
          missesRef.current++;
          showFeedback("missed", null);
        }
        scheduleShape();
      }, config.shapeDisplayMs);
    }, delay);
  }, [config, showFeedback]);

  /**
   * handleTap — called on button press.
   * Guard: tapHappenedRef ensures each visible shape can only register
   * ONE event (hit OR false alarm), no matter how fast the user taps.
   */
  const handleTap = useCallback(() => {
    if (!runningRef.current) return;
    if (tapHappenedRef.current) return; // already registered for this shape

    tapHappenedRef.current = true; // lock immediately

    if (currentIsTargetRef.current) {
      hitsRef.current++;
      setState((prev) => ({ ...prev, hits: hitsRef.current }));
      showFeedback("correct", "hit");
    } else {
      falseAlarmsRef.current++;
      setState((prev) => ({ ...prev, falseAlarms: falseAlarmsRef.current }));
      showFeedback("false-alarm", "miss");
    }
  }, [showFeedback]);

  const start = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;

    let remaining = config.durSeconds;

    timerRef.current = setInterval(() => {
      remaining--;
      setState((prev) => ({ ...prev, timeLeft: remaining }));

      if (remaining <= 0) {
        cleanup();

        const T   = targetCountRef.current;     // targets shown
        const NT  = nonTargetCountRef.current;  // non-targets shown
        const TP  = hitsRef.current;            // correctly tapped target
        const FP  = falseAlarmsRef.current;     // incorrectly tapped non-target
        const FN  = missesRef.current;          // target missed (not tapped)
        const TN  = Math.max(0, NT - FP);       // correctly ignored non-target
        const total = shapesShownRef.current;

        // Recall = TP / (TP + FN)
        const hitRatePct = T > 0 ? Math.round((TP / T) * 100) : 0;
        // False alarm rate = FP / (FP + TN)
        const falseAlarmRatePct = NT > 0 ? Math.round((FP / NT) * 100) : 0;
        // ML classification accuracy = (TP + TN) / total
        const accuracyPct = total > 0 ? Math.round(((TP + TN) / total) * 100) : 0;

        const result: CPTResult = {
          shapesShown: total,
          targetCount: T,
          nonTargetCount: NT,
          hits: TP,
          misses: FN,
          falseAlarms: FP,
          correctRejections: TN,
          hitRatePct,
          falseAlarmRatePct,
          accuracyPct,
        };

        onComplete(result, T, FN);
      }
    }, 1000);

    scheduleShape();
  }, [config.durSeconds, cleanup, scheduleShape, onComplete]);

  const destroy = useCallback(() => {
    cleanup();
  }, [cleanup]);

  return { state, start, handleTap, isRunning: runningRef.current, destroy };
}
