"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AllScores } from "../utils/scoring";
import { ProfileResult } from "../utils/profiles";
import { CptRawData } from "../utils/scoring";
import { Band } from "../utils/bandConfig";

interface Props {
  profile: ProfileResult;
  scores: AllScores;
  cptRaw: CptRawData;
  childName: string;
  band: Band;
  onSave: () => Promise<void>;
}

function ScoreBar({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-600">{label}</p>
        <p
          className="text-sm font-extrabold text-brand-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {value}%
        </p>
      </div>
      <div
        className="h-3 rounded-full overflow-hidden"
        style={{ background: "#F3F4F6" }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

export function ResultsScreen({
  profile,
  scores,
  cptRaw,
  childName,
  band,
  onSave,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  void cptRaw;
  // void band;

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await onSave();
      setSaved(true);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 py-2">
      {/* ── Profile Header Card ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: `${profile.colour}15`,
          border: `2px solid ${profile.colour}40`,
        }}
      >
        {/* Colour strip */}
        <div className="h-1" style={{ background: profile.colour }} />
        <div className="p-6 text-center space-y-2">
          <div className="text-5xl">{profile.emoji}</div>
          <h2
            className="text-2xl font-extrabold text-brand-black"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {profile.name}
          </h2>
          <p
            className="text-sm italic leading-relaxed"
            style={{ color: `${profile.colour}CC` }}
          >
            {profile.tagline}
          </p>
        </div>
      </motion.div>

      {/* ── Parent Message ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-5"
        style={{
          background: "#FFFFFF",
          borderLeft: "4px solid #2BBCB0",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-teal mb-2">
          For you, the parent:
        </p>
        <p className="text-sm font-semibold text-gray-700 leading-relaxed">
          {profile.parentMessage}
        </p>
      </motion.div>

      {/* ── Score Bars ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl p-5 space-y-4"
        style={{
          background: "#FFFFFF",
          border: "1.5px solid #F3F4F6",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
          Score Breakdown
        </p>
        <ScoreBar
          label="Part 1: Digital Task"
          value={scores.cptBaseScore}
          color="#2BBCB0"
          delay={0.2}
        />
        <ScoreBar
          label="Part 1: Recovery Score"
          value={scores.recoveryScore}
          color="#4FC3F7"
          delay={0.35}
        />
        {band !== "A" && (
          <ScoreBar
            label="Part 2 — Self Report"
            value={scores.selfReportScore}
            color="#F4845F"
            delay={0.45}
          />
        )}
        <ScoreBar
          label="Part 3: Parent Observations"
          value={scores.parentScore}
          color="#F4845F"
          delay={0.5}
        />
        <ScoreBar
          label="Part 4: Motivation Check"
          value={scores.motivationScore}
          color="#F5C518"
          delay={0.65}
        />

        {/* Fatigue flag */}
        {scores.fatigueFlag && (
          <div
            className="rounded-xl px-3 py-2 flex items-start gap-2 mt-1"
            style={{ background: "#FEF0EB" }}
          >
            <span className="text-sm shrink-0">⚠️</span>
            <p className="text-xs font-semibold text-[#C0563A] leading-relaxed">
              Attention fatigue detected — focus dropped significantly in Phase
              3 vs Phase 1.
            </p>
          </div>
        )}
      </motion.div>

      {/* ── Gap Flag ─────────────────────────────────────────────────── */}
      {scores.gapFlag && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-5"
          style={{
            background: "#FFFBEA",
            border: "2px solid rgba(245,197,24,0.5)",
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-extrabold text-[#92700A] mb-1">
                Note for parents
              </p>
              <p className="text-xs font-semibold text-gray-600 leading-relaxed">
                {scores.gapDirection === "cpt_higher"
                  ? `Your child performed well on the digital task but real-world attention challenges were observed. This is a classic ${profile.name} pattern — strong focus when engaged, harder to sustain on assigned tasks. The motivation score explains more.`
                  : "Real-world observation scores are higher than the task score. This may reflect test anxiety or an unfamiliar format rather than a genuine attention gap. Watch for patterns at home."}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── 5 Home Strategies ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl p-5 space-y-3"
        style={{
          background: "#FFFFFF",
          border: "1.5px solid #F3F4F6",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
          5 Home Strategies for {childName}
        </p>
        <div className="space-y-3">
          {profile.strategies.map((strategy, i) => (
            <div
              key={i}
              className="flex items-start gap-3 pl-3 py-2"
              style={{ borderLeft: `3px solid ${profile.colour}` }}
            >
              <span
                className="text-xs font-extrabold shrink-0 mt-0.5"
                style={{
                  color: profile.colour,
                  fontFamily: "var(--font-heading)",
                }}
              >
                {i + 1}.
              </span>
              <p className="text-xs font-semibold text-gray-700 leading-[1.65]">
                {strategy}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── CTA strip ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl p-5 text-center space-y-3"
        style={{
          background: "#FFFBEA",
          border: "1.5px solid rgba(245,197,24,0.4)",
        }}
      >
        <p
          className="text-sm font-extrabold text-brand-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Want to help {childName} build focus and attention skills?
        </p>
        <Link
          href="/workshops"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-extrabold text-xs"
          style={{
            background: "#F5C518",
            color: "#1A1A1A",
            fontFamily: "var(--font-heading)",
          }}
        >
          Explore Go Kids Workshops →
        </Link>
      </motion.div>

      {/* ── Save button ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="space-y-3"
      >
        {!saved ? (
          <motion.button
            whileHover={{ scale: saving ? 1 : 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 rounded-2xl font-extrabold text-sm"
            style={{
              background: saving ? "#F3F4F6" : "#1A1A1A",
              color: saving ? "#9CA3AF" : "#FFFFFF",
              fontFamily: "var(--font-heading)",
            }}
          >
            {saving ? "Saving…" : "💾 Save Results to Dashboard"}
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full py-4 rounded-2xl text-center font-extrabold text-sm"
            style={{
              background: "#D1FAE5",
              color: "#065F46",
              fontFamily: "var(--font-heading)",
            }}
          >
            ✅ Saved to your dashboard!
          </motion.div>
        )}

        {saveError && (
          <p className="text-xs text-red-500 text-center font-semibold">
            {saveError}
          </p>
        )}

        {/* PDF placeholder */}
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ background: "#F3F4F6" }}
        >
          <span className="text-lg">📄</span>
          <p className="text-xs font-semibold text-gray-500 leading-relaxed">
            PDF report coming soon — we&apos;ll notify you when it&apos;s ready.
          </p>
        </div>
      </motion.div>

      {/* ── Disclaimer ───────────────────────────────────────────────── */}
      <div className="rounded-xl p-4" style={{ background: "#F3F4F6" }}>
        <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
          This report was generated by the Go Kids Attention Assessment — an
          independent tool built from observations across Go Kids workshops. It
          is not a clinically validated, medically approved, or standardised
          psychological assessment. Results are for personal understanding only
          and do not constitute a diagnosis or professional evaluation of any
          kind. No result should be used to make decisions about your
          child&apos;s education, health, or wellbeing without first speaking to
          a qualified professional. If you have concerns about your child&apos;s
          development, please seek advice from a licensed child psychologist or
          paediatrician.
        </p>
      </div>
    </div>
  );
}
