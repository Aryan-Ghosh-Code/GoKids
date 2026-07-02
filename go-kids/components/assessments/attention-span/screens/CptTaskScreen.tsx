"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgeBand, BAND_CONFIG } from "../utils/bandConfig";
import { useCptTimer } from "../hooks/useCptTimer";
import { CPTResult } from "../utils/scoring";

interface CptTaskScreenProps {
  band: AgeBand;
  childName: string;
  onComplete: (
    result: CPTResult,
    targetCount: number,
    misses: number
  ) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const RADIUS = 58;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CptTaskScreen({ band, childName, onComplete }: CptTaskScreenProps) {
  const config = BAND_CONFIG[band];
  const { state, start, handleTap, destroy } = useCptTimer(band, onComplete);

  useEffect(() => {
    start();
    return () => destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = state.timeLeft / config.durSeconds;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const tapBg =
    state.tapFlash === "hit"
      ? "#22c55e"
      : state.tapFlash === "miss"
      ? "#ef4444"
      : "#FFFFFF";
  const tapTextColor =
    state.tapFlash === "hit" || state.tapFlash === "miss" ? "#FFFFFF" : "#1A1A1A";

  const tapBorderColor = 
    state.tapFlash === "hit" 
      ? "#22c55e" 
      : state.tapFlash === "miss" 
      ? "#ef4444" 
      : "#2BBCB0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 select-none"
    >
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {childName}&apos;s Task
        </p>
      </div>

      {/* Circular countdown ring */}
      <div className="flex flex-col items-center relative">
        <div className="relative w-35 h-35">
          <svg
            width={140}
            height={140}
            className="-rotate-90 absolute top-0 left-0"
          >
            <circle
              cx={70}
              cy={70}
              r={RADIUS}
              fill="none"
              stroke="#F3F4F6"
              strokeWidth={8}
            />
            <circle
              cx={70}
              cy={70}
              r={RADIUS}
              fill="none"
              stroke="#F5C518"
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          {/* Time label centred in the ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p
              className="text-2xl font-black text-brand-black"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {formatTime(state.timeLeft)}
            </p>
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400">
              remaining
            </p>
          </div>
        </div>
      </div>

      {/* Stats chips */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl py-3 px-4 text-center border border-gray-150 bg-gray-50/50 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Shown
          </p>
          <p className="text-xl font-extrabold text-brand-black mt-0.5">
            {state.shapesShown}
          </p>
        </div>
        <div className="rounded-2xl py-3 px-4 text-center border border-green-100 bg-[#E8F8F7]/50 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0D7A73]">
            Hits
          </p>
          <p className="text-xl font-extrabold text-[#0D7A73] mt-0.5">
            {state.hits}
          </p>
        </div>
        <div className="rounded-2xl py-3 px-4 text-center border border-red-100 bg-[#FEF0EB]/60 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-coral">
            Errors
          </p>
          <p className="text-xl font-extrabold text-coral mt-0.5">
            {state.falseAlarms}
          </p>
        </div>
      </div>

      {/* Shape display area */}
      <div
        className="w-full flex items-center justify-center rounded-3xl"
        style={{
          height: 160,
          background: "#FAFAF8",
          border: "2px dashed #E5E7EB",
        }}
      >
        <AnimatePresence mode="wait">
          {state.shapeVisible && state.currentShape ? (
            <motion.span
              key={`${state.shapesShown}-shape`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.12 }}
              style={{ fontSize: 72, lineHeight: 1, userSelect: "none" }}
            >
              {state.currentShape}
            </motion.span>
          ) : (
            <motion.span
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="text-2xl"
              style={{ color: "#D1D5DB" }}
            >
              · · ·
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Target reminder */}
      <p className="text-center text-sm font-semibold text-gray-500">
        Target symbol:{" "}
        <span className="font-extrabold text-brand-black">
          {config.target} {config.targetName}
        </span>
      </p>

      {/* TAP button */}
      <motion.button
        onTap={handleTap}
        onClick={handleTap}
        className="w-full rounded-2xl font-extrabold text-lg border-2 transition-all cursor-pointer shadow-md"
        style={{
          height: 72,
          background: tapBg,
          color: tapTextColor,
          borderColor: tapBorderColor,
          fontFamily: "var(--font-heading)",
          boxShadow: "0 8px 24px rgba(43, 188, 176, 0.12)",
        }}
        whileTap={{ scale: 0.96 }}
      >
        {state.tapFlash === "hit"
          ? "✓ TARGET HIT!"
          : state.tapFlash === "miss"
            ? "✗ WRONG SYMBOL!"
            : "TAP IT! 👋"}
      </motion.button>

      {/* Feedback text */}
      <div className="min-h-6 text-center">
        <AnimatePresence mode="wait">
          {state.feedback === "correct" && (
            <motion.p
              key="correct"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm font-extrabold text-green-600"
            >
              ✓ Correct!
            </motion.p>
          )}
          {state.feedback === "false-alarm" && (
            <motion.p
              key="false-alarm"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm font-extrabold text-red-500"
            >
              ✗ Not the target!
            </motion.p>
          )}
          {state.feedback === "missed" && (
            <motion.p
              key="missed"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm font-extrabold text-amber-500"
            >
              Missed that target!
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
