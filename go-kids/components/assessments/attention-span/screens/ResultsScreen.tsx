"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AssessmentResults, CPTResult, buildInsights } from "../utils/scoring";
import { AgeBand } from "../utils/bandConfig";

interface ResultsScreenProps {
  results: AssessmentResults;
  cptResult: CPTResult;
  parentRaw: number;
  childName: string;
  ageBand: AgeBand;
  parentAnswers: number[];
  onSave: () => Promise<void>;
}

const LEVEL_STYLES = {
  High: { bg: "#EAF3DE", color: "#3B6D11", border: "#B6D98A" },
  Moderate: { bg: "#FAEEDA", color: "#854F0B", border: "#F5C89E" },
  Low: { bg: "#FCEBEB", color: "#A32D2D", border: "#F4A0A0" },
};

const INSIGHT_COLORS = {
  green: { bg: "#DCFCE7", color: "#15803D", icon: "✓" },
  amber: { bg: "#FEF9C3", color: "#854D0E", icon: "⚠" },
  red: { bg: "#FEE2E2", color: "#DC2626", icon: "✗" },
};

export function ResultsScreen({
  results,
  cptResult,
  parentRaw,
  childName,
  onSave,
}: ResultsScreenProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const levelStyle = LEVEL_STYLES[results.level];
  const insights = buildInsights(
    cptResult.accuracyPct,
    cptResult.hitRatePct,
    cptResult.falseAlarmRatePct,
    cptResult.falseAlarms,
    parentRaw,
    results.level,
    cptResult.shapesShown
  );

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await onSave();
      setSaved(true);
    } catch {
      setSaveError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-4"
    >
      {/* Heading */}
      <div className="text-center">
        <h2
          className="text-2xl sm:text-3xl font-extrabold text-brand-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {childName}&apos;s Results
        </h2>
        <p className="text-sm mt-1 text-gray-500 font-semibold">
          Attention Span Assessment completed successfully
        </p>
      </div>

      {/* Result band */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="rounded-[28px] p-6 border-2"
        style={{
          background: levelStyle.bg,
          borderColor: levelStyle.border,
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p
              className="text-[10px] font-extrabold uppercase tracking-widest"
              style={{ color: levelStyle.color, opacity: 0.8 }}
            >
              Focus Classification
            </p>
            <p
              className="text-3xl font-black"
              style={{
                fontFamily: "var(--font-heading)",
                color: levelStyle.color,
              }}
            >
              {results.level}
            </p>
            <p
              className="text-sm font-bold mt-1"
              style={{ color: levelStyle.color }}
            >
              {results.sublabel}
            </p>
          </div>
          <div
            className="w-18 h-18 rounded-[22px] flex flex-col items-center justify-center bg-white shadow-xs shrink-0"
            style={{ border: `1.5px solid ${levelStyle.border}` }}
          >
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              Score
            </span>
            <span
              className="text-2xl font-black mt-0.5"
              style={{
                color: levelStyle.color,
                fontFamily: "var(--font-heading)",
              }}
            >
              {results.overall}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Score breakdown */}
      <div className="rounded-[28px] p-6 space-y-5 bg-white border border-gray-150 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Score Breakdown
        </h3>

        {/* Part A bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700">
              Part A — Digital Task{" "}
              <span className="text-xs font-semibold text-gray-400">
                (Weight 60%)
              </span>
            </span>
            <span className="text-sm font-extrabold text-teal">
              {results.cptScore} / 100
            </span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#2BBCB0" }}
              initial={{ width: 0 }}
              animate={{ width: `${results.cptScore}%` }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Part B bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700">
              Part B — Parent Scale{" "}
              <span className="text-xs font-semibold text-gray-400">
                (Weight 40%)
              </span>
            </span>
            <span className="text-sm font-extrabold text-coral">
              {results.parentScore} / 100
            </span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#F4845F" }}
              initial={{ width: 0 }}
              animate={{ width: `${results.parentScore}%` }}
              transition={{ delay: 0.45, duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Overall score */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm font-extrabold text-brand-black">
            Overall Score
          </span>
          <span
            className="text-3xl font-black text-brand-black"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {results.overall}{" "}
            <span className="text-base font-bold text-gray-400">/ 100</span>
          </span>
        </div>
      </div>

      {/* Key Insights */}
      <div className="rounded-[28px] p-6 space-y-4 bg-white border border-gray-150 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Key Insights
        </h3>
        <div className="space-y-4">
          {insights.map((insight, i) => {
            const style = INSIGHT_COLORS[insight.color];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-3.5"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 mt-0.5"
                  style={{ background: style.bg, color: style.color }}
                >
                  {style.icon}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-brand-black">
                    {insight.label}
                  </p>
                  <p className="text-xs mt-1 text-gray-500 font-semibold leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Save button */}
      <AnimatePresence mode="wait">
        {saved ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full py-4 rounded-2xl text-center font-extrabold text-base border-none"
            style={{
              background: "#DCFCE7",
              color: "#15803D",
              border: "1.5px solid #22c55e",
              fontFamily: "var(--font-heading)",
            }}
          >
            ✅ Saved to your dashboard
          </motion.div>
        ) : (
          <motion.button
            key="save-btn"
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 cursor-pointer border-none shadow-md"
            style={{
              background: saving ? "#FDE68A" : "#F5C518",
              color: "#1A1A1A",
              fontFamily: "var(--font-heading)",
              opacity: saving ? 0.8 : 1,
              boxShadow: "0 8px 24px rgba(245, 197, 24, 0.3)",
            }}
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#1A1A1A"
                    strokeWidth="3"
                    strokeOpacity="0.25"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="#1A1A1A"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                Saving…
              </>
            ) : (
              "Save Results to Dashboard"
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {saveError && (
        <p className="text-center text-sm font-bold text-red-500">
          {saveError}
        </p>
      )}

      {/* PDF placeholder */}
      <div className="rounded-2xl px-5 py-4 text-xs font-semibold bg-brand-offwhite border border-gray-150 text-gray-500 flex gap-2.5 items-center shadow-2xs">
        <span className="text-base">📄</span>
        <p>
          <span className="font-extrabold text-gray-700">
            Your detailed PDF report will be ready soon.
          </span>{" "}
          We&apos;ll notify you when it&apos;s available to download.
        </p>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-center text-gray-400 leading-relaxed font-semibold">
        Disclaimer: This assessment is a screening tool and not a clinical
        diagnosis. Results should be interpreted by a qualified professional.
      </p>
    </motion.div>
  );
}
