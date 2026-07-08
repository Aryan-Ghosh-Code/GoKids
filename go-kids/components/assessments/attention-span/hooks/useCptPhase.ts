"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Band,
  BAND_CONFIG,
  SHAPE_VISIBLE_MS,
  TARGET_PROBABILITY,
} from "../utils/bandConfig";

// ─── Phase counters collected during one CPT phase ───────────────────────────
export interface PhaseCounters {
  targets: number;
  hits: number;
  misses: number;
  falseAlarms: number;
}

interface UseCptPhaseOptions {
  band: Band;
  phaseDuration: number; // seconds
  onPhaseEnd: (counters: PhaseCounters) => void;
}

export interface CptPhaseState {
  secondsLeft: number;
  currentShape: string | null;
  shapeVisible: boolean;
  counters: PhaseCounters;
  tapFeedback: "idle" | "hit" | "false_alarm" | "miss";
  missText: boolean;
  shapeCount: number;
}

export function useCptPhase({
  band,
  phaseDuration,
  onPhaseEnd,
}: UseCptPhaseOptions) {
  const config = BAND_CONFIG[band];
  const shapeVisibleMs = SHAPE_VISIBLE_MS[band];

  // ── Rendering state ────────────────────────────────────────────────────────
  const [secondsLeft, setSecondsLeft] = useState(phaseDuration);
  const [currentShape, setCurrentShape] = useState<string | null>(null);
  const [shapeVisible, setShapeVisible] = useState(false);
  const [tapFeedback, setTapFeedback] =
    useState<CptPhaseState["tapFeedback"]>("idle");
  const [missText, setMissText] = useState(false);
  const [shapeCount, setShapeCount] = useState(0);
  const [counters, setCounters] = useState<PhaseCounters>({
    targets: 0,
    hits: 0,
    misses: 0,
    falseAlarms: 0,
  });

  // ── Refs ────────────────────────────────────────────────────────────────────
  const runningRef = useRef(false);
  const isTargetRef = useRef(false);
  const tapHappenedRef = useRef(false); // guard: one tap per shape display
  const shapeActiveRef = useRef(false); // is a shape currently showing?
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const endCalledRef = useRef(false);

  // ── Mutable counters ref ───────────────────────────────────────────────────
  const countersRef = useRef<PhaseCounters>({
    targets: 0,
    hits: 0,
    misses: 0,
    falseAlarms: 0,
  });

  const clearAllTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
      shapeTimeoutRef.current = null;
    }
  }, []);

  const showShapeRef = useRef<() => void>(() => {});

  // ── Schedule next shape ─────────────────────────────────────────────────────
  const scheduleNextShape = useCallback(() => {
    if (!runningRef.current) return;
    const delay = 700 + Math.random() * 1100;
    shapeTimeoutRef.current = setTimeout(() => showShapeRef.current(), delay);
  }, []);

  // ── Show a shape ───────────────────────────────────────────────────────────
  const showShape = useCallback(() => {
    if (!runningRef.current) return;

    const isTarget = Math.random() < TARGET_PROBABILITY;
    isTargetRef.current = isTarget;
    tapHappenedRef.current = false;
    shapeActiveRef.current = true;

    const shape = isTarget
      ? config.target
      : config.distractors[
          Math.floor(Math.random() * config.distractors.length)
        ];

    if (isTarget) {
      countersRef.current.targets += 1;
      setCounters({ ...countersRef.current });
    }

    setShapeCount((c) => c + 1);
    setCurrentShape(shape);
    setShapeVisible(true);

    // Hide shape after visible duration
    shapeTimeoutRef.current = setTimeout(() => {
      if (!runningRef.current) return;
      setShapeVisible(false);
      shapeActiveRef.current = false;

      // If target expired without a tap → miss
      if (isTargetRef.current && !tapHappenedRef.current) {
        countersRef.current.misses += 1;
        setCounters({ ...countersRef.current });
        setMissText(true);
        setTimeout(() => setMissText(false), 500);
      }

      // Schedule next shape
      scheduleNextShape();
    }, shapeVisibleMs);
  }, [config, shapeVisibleMs, scheduleNextShape]);

  useEffect(() => {
    showShapeRef.current = showShape;
  }, [showShape]);

  // ── Handle tap ─────────────────────────────────────────────────────────────
  const handleTap = useCallback(() => {
    if (!runningRef.current || tapHappenedRef.current) return;
    tapHappenedRef.current = true;

    if (isTargetRef.current && shapeActiveRef.current) {
      // Hit
      countersRef.current.hits += 1;
      setCounters({ ...countersRef.current });
      setTapFeedback("hit");
      setTimeout(() => setTapFeedback("idle"), 500);
    } else {
      // False alarm (tapped during gap or on distractor)
      countersRef.current.falseAlarms += 1;
      setCounters({ ...countersRef.current });
      setTapFeedback("false_alarm");
      setTimeout(() => setTapFeedback("idle"), 500);
    }
  }, []);

  // ── Start phase ─────────────────────────────────────────────────────────────
  const startPhase = useCallback(() => {
    // Reset
    countersRef.current = { targets: 0, hits: 0, misses: 0, falseAlarms: 0 };
    setCounters({ targets: 0, hits: 0, misses: 0, falseAlarms: 0 });
    setSecondsLeft(phaseDuration);
    setCurrentShape(null);
    setShapeVisible(false);
    setTapFeedback("idle");
    setMissText(false);
    setShapeCount(0);
    endCalledRef.current = false;
    runningRef.current = true;

    // Countdown timer
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0 && !endCalledRef.current) {
          endCalledRef.current = true;
          runningRef.current = false;
          clearAllTimers();
          setTimeout(() => onPhaseEnd({ ...countersRef.current }), 0);
        }
        return Math.max(0, next);
      });
    }, 1000);

    // Start showing shapes after a brief initial delay
    shapeTimeoutRef.current = setTimeout(() => showShapeRef.current(), 1500);
  }, [phaseDuration, clearAllTimers, onPhaseEnd]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      runningRef.current = false;
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return {
    state: {
      secondsLeft,
      currentShape,
      shapeVisible,
      counters,
      tapFeedback,
      missText,
      shapeCount,
    } as CptPhaseState,
    startPhase,
    handleTap,
    config,
  };
}
