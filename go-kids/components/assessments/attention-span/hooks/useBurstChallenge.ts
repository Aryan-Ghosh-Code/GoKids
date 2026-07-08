"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface BurstCounters {
  total: number;
  tapped: number;
}

interface StarPosition {
  x: number; // 0–100 (percent)
  y: number;
  id: number;
}

interface UseBurstChallengeOptions {
  durationSeconds: number;
  onBurstEnd: (counters: BurstCounters) => void;
}

export function useBurstChallenge({
  durationSeconds,
  onBurstEnd,
}: UseBurstChallengeOptions) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [currentStar, setCurrentStar] = useState<StarPosition | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const [totalStars, setTotalStars] = useState(0);

  const runningRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const starTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const endCalledRef = useRef(false);
  const starIdRef = useRef(0);
  const totalRef = useRef(0);
  const tappedRef = useRef(0);
  const starTappedRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (starTimeoutRef.current) {
      clearTimeout(starTimeoutRef.current);
      starTimeoutRef.current = null;
    }
  }, []);

  const showNextStarRef = useRef<() => void>(() => {});

  const showNextStar = useCallback(() => {
    if (!runningRef.current) return;

    const id = ++starIdRef.current;
    const x = 10 + Math.random() * 80; // 10–90%
    const y = 10 + Math.random() * 80;

    totalRef.current += 1;
    setTotalStars(totalRef.current);
    starTappedRef.current = false;
    setCurrentStar({ x, y, id });

    // Auto-dismiss after 1200ms if not tapped
    starTimeoutRef.current = setTimeout(() => {
      if (!runningRef.current) return;
      setCurrentStar(null);
      // Show next star after brief gap
      starTimeoutRef.current = setTimeout(() => showNextStarRef.current(), 800);
    }, 1200);
  }, []);

  useEffect(() => {
    showNextStarRef.current = showNextStar;
  }, [showNextStar]);

  const handleStarTap = useCallback(() => {
    if (!runningRef.current || starTappedRef.current) return;
    starTappedRef.current = true;
    tappedRef.current += 1;
    setTapCount(tappedRef.current);

    // Hide star immediately on tap
    if (starTimeoutRef.current) {
      clearTimeout(starTimeoutRef.current);
      starTimeoutRef.current = null;
    }
    setCurrentStar(null);

    // Show next star quickly after tap
    starTimeoutRef.current = setTimeout(() => showNextStarRef.current(), 400);
  }, []);

  const startBurst = useCallback(() => {
    totalRef.current = 0;
    tappedRef.current = 0;
    setTotalStars(0);
    setTapCount(0);
    setSecondsLeft(durationSeconds);
    setCurrentStar(null);
    endCalledRef.current = false;
    runningRef.current = true;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0 && !endCalledRef.current) {
          endCalledRef.current = true;
          runningRef.current = false;
          clearAllTimers();
          setCurrentStar(null);
          setTimeout(
            () =>
              onBurstEnd({
                total: totalRef.current,
                tapped: tappedRef.current,
              }),
            0,
          );
        }
        return Math.max(0, next);
      });
    }, 1000);

    // Start first star after short delay
    starTimeoutRef.current = setTimeout(() => showNextStarRef.current(), 800);
  }, [durationSeconds, clearAllTimers, onBurstEnd]);

  useEffect(() => {
    return () => {
      runningRef.current = false;
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return {
    secondsLeft,
    currentStar,
    tapCount,
    totalStars,
    startBurst,
    handleStarTap,
  };
}
