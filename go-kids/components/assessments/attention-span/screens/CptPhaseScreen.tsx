"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Band, BAND_CONFIG } from "../utils/bandConfig";
import { useCptPhase, PhaseCounters } from "../hooks/useCptPhase";

interface Props {
  band: Band;
  phase: 1 | 3;
  onPhaseEnd: (counters: PhaseCounters) => void;
}

function CircularCountdown({
  seconds,
  total,
}: {
  seconds: number;
  total: number;
}) {
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const progress = Math.max(0, seconds / total);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <svg width={100} height={100} viewBox="0 0 100 100" className="shrink-0">
      <circle
        cx={50}
        cy={50}
        r={r}
        fill="none"
        stroke="#F3F4F6"
        strokeWidth={8}
      />
      <circle
        cx={50}
        cy={50}
        r={r}
        fill="none"
        stroke="#F5C518"
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 0.8s linear" }}
      />
      <text
        x={50}
        y={50}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xl font-extrabold"
        style={{
          fontSize: 22,
          fontWeight: 800,
          fill: "#1A1A1A",
          fontFamily: "var(--font-heading)",
        }}
      >
        {seconds}
      </text>
    </svg>
  );
}

export function CptPhaseScreen({ band, phase, onPhaseEnd }: Props) {
  const config = BAND_CONFIG[band];
  const phaseDuration =
    phase === 1 ? config.phase1Seconds : config.phase3Seconds;

  const [showGuide, setShowGuide] = useState(true);

  const { state, startPhase, handleTap } = useCptPhase({
    band,
    phaseDuration,
    onPhaseEnd,
  });

  useEffect(() => {
    startPhase();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    secondsLeft,
    currentShape,
    shapeVisible,
    counters,
    tapFeedback,
    missText,
    shapeCount,
  } = state;

  const tapBg =
    tapFeedback === "hit"
      ? "#D1FAE5"
      : tapFeedback === "false_alarm"
        ? "#FEE2E2"
        : "#FFFFFF";

  const tapBorder =
    tapFeedback === "hit"
      ? "#10B981"
      : tapFeedback === "false_alarm"
        ? "#EF4444"
        : "#2BBCB0";

  const onButtonClicked = () => {
    setShowGuide(false);
    handleTap();
  };

  return (
    <div className="space-y-5 py-2">
      {/* Target reminder (sticky) */}
      <div className="top-0 z-20">
        <div
          className="rounded-2xl border-2 px-4 py-3 shadow-sm"
          style={{ borderColor: "#F5C518", background: "#FFF8DB" }}
        >
          <p
            className="text-[11px] font-extrabold uppercase tracking-wider"
            style={{ color: "#7C5E00" }}
          >
            Target reminder
          </p>
          <div className="mt-1 flex items-end justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold" style={{ color: "#7C5E00" }}>
                Only tap when you see:
              </p>
              <p
                className="text-xl font-extrabold text-brand-black leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {config.targetName} {config.target}
              </p>
            </div>
            <div
              className="shrink-0 rounded-2xl border-2 px-3 py-2"
              style={{
                borderColor: "#F5C518",
                background: "rgba(255,255,255,0.75)",
              }}
            >
              <span
                className="text-[11px] font-extrabold uppercase tracking-wider"
                style={{ color: "#7C5E00" }}
              >
                Target
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Phase header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
          Phase {phase} of 3 — {phase === 1 ? "Baseline" : "Endurance"}
        </span>
        <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#E8F8F7] text-teal">
          Part 1
        </span>
      </div>

      {/* Countdown + counters row */}
      <div className="flex items-center gap-4">
        <CircularCountdown seconds={secondsLeft} total={phaseDuration} />
        <div className="flex-1 grid grid-cols-3 gap-2">
          {[
            { label: "Shown", value: counters.targets },
            { label: "Hits ✓", value: counters.hits },
            { label: "False ✗", value: counters.falseAlarms },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="text-center rounded-xl py-2 px-1"
              style={{ background: "#F3F4F6" }}
            >
              <p
                className="text-lg font-extrabold text-brand-black"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {value}
              </p>
              <p className="text-[10px] text-gray-400 font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shape display area */}
      <div
        className="relative flex items-center justify-center rounded-2xl mx-auto"
        style={{
          width: 200,
          height: 200,
          background: "#FAFAF8",
          border: "2px solid #F3F4F6",
        }}
      >
        <AnimatePresence mode="wait">
          {shapeVisible && currentShape ? (
            <motion.div
              key={`${currentShape}-${shapeCount}`}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="text-[72px] leading-none select-none"
              style={{ fontFamily: "monospace", color: "#1A1A1A" }}
            >
              {currentShape}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-300 text-3xl select-none"
            >
              · · ·
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Miss / false-alarm feedback */}
      <AnimatePresence>
        {missText && (
          <motion.p
            key="miss"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm font-extrabold text-red-400"
          >
            Missed!
          </motion.p>
        )}
        {tapFeedback === "false_alarm" && (
          <motion.p
            key="false-alarm"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm font-extrabold text-red-400"
          >
            Not the target!
          </motion.p>
        )}
      </AnimatePresence>

      {/* Tap button */}
      <div className="relative">
        <AnimatePresence>
          {showGuide && phase === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="flex justify-center mb-3.5"
            >
              <div
                className="relative inline-flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #E8F8F7 0%, #D2F2EF 100%)",
                  border: "1.5px solid rgba(43,188,176,0.35)",
                  boxShadow: "0 3px 14px rgba(43,188,176,0.18)",
                }}
              >
                {/* soft pulsing focus ring */}
                <motion.span
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ border: "1.5px solid #2BBCB0" }}
                  animate={{ scale: [1, 1.07, 1], opacity: [0.55, 0, 0.55] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* bobbing pointer badge */}
                <motion.span
                  className="flex items-center justify-center w-7 h-7 rounded-full shrink-0"
                  style={{
                    background: "#2BBCB0",
                    boxShadow: "0 2px 6px rgba(43,188,176,0.4)",
                  }}
                  animate={{ y: [0, 3, 0], rotate: [0, -10, 0] }}
                  transition={{
                    duration: 1.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span style={{ fontSize: 13 }}>👇</span>
                </motion.span>

                <span
                  className="text-[13px] font-extrabold leading-tight"
                  style={{
                    color: "#0D7A73",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Tap below when you spot {config.targetName}!
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onButtonClicked}
          className="w-full py-5 rounded-2xl font-extrabold text-lg border-2 transition-colors relative z-10"
          style={{
            background: tapBg,
            borderColor: tapBorder,
            color: "#1A1A1A",
            fontFamily: "var(--font-heading)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          {tapFeedback === "hit"
            ? "✅ Hit!"
            : tapFeedback === "false_alarm"
              ? "❌ Not it!"
              : "TAP IT! 👋"}
        </motion.button>
      </div>
    </div>
  );
}
