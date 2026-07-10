"use client";

import { motion } from "framer-motion";
import ReportModalBase from "./ReportModalBase";
import type { DBAssessmentFull } from "../AssessmentReportModal";

// ── Profile metadata (taglines + parent-facing messages) ──────────────────────
const PROFILE_META: Record<
  string,
  { colour: string; tagline: string; parentMessage: string }
> = {
  deep_diver: {
    colour: "#3B82F6",
    tagline:
      "Focuses intensely on things they love; struggles when a task feels irrelevant or assigned.",
    parentMessage:
      "Your child's attention is strong when motivated. The challenge is relevance — help them find the 'why' in tasks they avoid.",
  },
  spark_seeker: {
    colour: "#F5C518",
    tagline:
      "Attention lights up with novelty and creativity; fades fast in routine or repetitive tasks.",
    parentMessage:
      "Your child needs variety built into learning. Routine kills their focus — novelty unlocks it.",
  },
  steady_pacer: {
    colour: "#16a34a",
    tagline:
      "Consistent, reliable attention across most contexts. Even under pressure, performance stays stable.",
    parentMessage:
      "Your child has a solid attention foundation. Focus on keeping it consistent as academic demands increase.",
  },
  effortful_focuser: {
    colour: "#F4845F",
    tagline:
      "Tries hard but tires quickly. Starts tasks with strong attention — focus fades before the task ends.",
    parentMessage:
      "Your child's attention runs out before the task does. Structured breaks and shorter work blocks will help significantly.",
  },
  wanderer: {
    colour: "#E24B4A",
    tagline:
      "Attention scatters easily across all contexts — regardless of topic, reward, or environment.",
    parentMessage:
      "Your child needs consistent, structured attention support. Small daily practices will build the focus muscle over time.",
  },
};

// ── Shared sub-components ─────────────────────────────────────────────────────

/** A single animated score bar row — shows the raw score from scoring.ts, no fabricated labels */
function ScoreRow({
  label,
  value,
  color,
  delay,
  note,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
  note?: string;
}) {
  return (
    <div className="py-2.5 border-b border-brand-grey last:border-0">
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-xs font-bold text-brand-black"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          {label}
        </span>
        <span
          className="text-sm font-extrabold"
          style={{ color, fontFamily: "var(--font-nunito)" }}
        >
          {value}%
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
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
      {note && (
        <p className="text-[10px] text-gray-400 mt-1 font-medium">{note}</p>
      )}
    </div>
  );
}

/** A compact stat tile used for raw CPT numbers */
function RawStat({ value, label }: { value: string | number; label: string }) {
  return (
    <div
      className="flex-1 text-center px-2 py-3 rounded-2xl"
      style={{ background: "#F9FAFB", border: "1.5px solid #EFEFEF" }}
    >
      <p
        className="text-lg font-extrabold text-brand-black leading-none"
        style={{ fontFamily: "var(--font-nunito)" }}
      >
        {value}
      </p>
      <p className="text-[10px] font-semibold text-gray-500 mt-1 leading-tight">
        {label}
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface Props {
  assessment: DBAssessmentFull | null;
  onClose: () => void;
}

export default function AttentionSpanReport({ assessment, onClose }: Props) {
  if (!assessment) return null;

  const { formData, results, createdAt } = assessment;
  const { scores, profile: prof, cptRaw } = results;
  const meta = PROFILE_META[prof.key] ?? {
    colour: "#6B7280",
    tagline: "",
    parentMessage: "",
  };
  const band = formData.band;
  const childName = formData.childName;

  const completedDate = new Date(createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const fatigueDirection =
    cptRaw.phase3HitRatePct - cptRaw.phase1HitRatePct > 5
      ? "↑ Improved"
      : cptRaw.phase1HitRatePct - cptRaw.phase3HitRatePct > 5
      ? "↓ Dropped"
      : "→ Stable";

  return (
    <ReportModalBase
      open
      onClose={onClose}
      accentColor={meta.colour}
      header={
        <>
          {/* Profile identity */}
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{
                background: `${meta.colour}20`,
                border: `2px solid ${meta.colour}40`,
              }}
            >
              {prof.emoji}
            </div>
            <div className="min-w-0 flex-1 pr-8">
              <p
                className="text-[10px] font-extrabold uppercase tracking-widest mb-0.5"
                style={{ color: meta.colour }}
              >
                Attention Profile
              </p>
              <h2
                className="text-lg font-extrabold text-brand-black leading-tight"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                {prof.name}
              </h2>
              <p className="text-xs text-gray-500 mt-1 leading-snug">
                {meta.tagline}
              </p>
            </div>
          </div>

          {/* Meta strip */}
          <div
            className="flex items-center gap-3 mt-4 pt-4 border-t"
            style={{ borderColor: `${meta.colour}20` }}
          >
            <span className="text-[11px] font-semibold text-gray-500">
              <span className="font-bold text-brand-black">{childName}</span>
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-[11px] font-semibold text-gray-500">
              Band <span className="font-bold text-brand-black">{band}</span>
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-[11px] font-semibold text-gray-500">
              {completedDate}
            </span>
          </div>
        </>
      }
    >
      {/* ── For the parent ── */}
      <div
        className="mx-5 mt-4 rounded-2xl px-4 py-3"
        style={{ borderLeft: `4px solid ${meta.colour}`, background: "#FAFAFA" }}
      >
        <p
          className="text-[10px] font-extrabold uppercase tracking-wider mb-1"
          style={{ color: meta.colour }}
        >
          For you, the parent
        </p>
        <p className="text-xs font-semibold text-gray-600 leading-relaxed">
          {meta.parentMessage}
        </p>
      </div>

      {/* ── Part 1 — Digital Task (CPT) ── */}
      <div className="px-5 mt-5">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-2">
          Part 1 · Digital Task — Raw Numbers
        </p>

        {/* Phase stat rows */}
        <div
          className="rounded-2xl overflow-hidden mb-2"
          style={{ border: "1.5px solid #F0F0F0" }}
        >
          {/* Phase 1 */}
          <div className="px-4 pt-3 pb-2">
            <p
              className="text-[9px] font-extrabold uppercase tracking-widest mb-2"
              style={{ color: "#6B7280" }}
            >
              Phase 1 · Baseline
            </p>
            <div className="flex gap-2">
              <RawStat value={cptRaw.phase1Targets} label="Shapes shown" />
              <RawStat value={cptRaw.phase1Hits} label="Correct hits" />
              <RawStat
                value={`${Math.round(cptRaw.phase1HitRatePct)}%`}
                label="Hit rate"
              />
              <RawStat value={cptRaw.phase1FalseAlarms} label="False taps" />
            </div>
          </div>

          <div className="border-t border-brand-grey mx-4" />

          {/* Burst */}
          <div className="px-4 pt-2.5 pb-2">
            <p
              className="text-[9px] font-extrabold uppercase tracking-widest mb-2"
              style={{ color: "#F5C518" }}
            >
              Star Burst ⚡
            </p>
            <div className="flex gap-2">
              <RawStat
                value={`${Math.round(cptRaw.burstTapRatePct)}%`}
                label="Burst tap rate"
              />
              <RawStat
                value={`${cptRaw.burstStarsTapped} / ${cptRaw.burstStarsTotal}`}
                label="Stars tapped"
              />
              <RawStat value={cptRaw.fatigueIndex >= 0
                  ? `+${Math.round(cptRaw.fatigueIndex)}`
                  : `${Math.round(cptRaw.fatigueIndex)}`}
                label="Fatigue index"
              />
            </div>
          </div>

          <div className="border-t border-brand-grey mx-4" />

          {/* Phase 3 */}
          <div className="px-4 pt-2.5 pb-3">
            <p
              className="text-[9px] font-extrabold uppercase tracking-widest mb-2"
              style={{ color: "#F4845F" }}
            >
              Phase 3 · Endurance
            </p>
            <div className="flex gap-2">
              <RawStat value={cptRaw.phase3Targets} label="Shapes shown" />
              <RawStat value={cptRaw.phase3Hits} label="Correct hits" />
              <RawStat
                value={`${Math.round(cptRaw.phase3HitRatePct)}%`}
                label="Hit rate"
              />
              <RawStat value={cptRaw.phase3FalseAlarms} label="False taps" />
            </div>
          </div>

          <div className="border-t border-brand-grey mx-4" />

          {/* Focus trend */}
          <div className="px-4 py-2.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-400">
              Focus trend (Phase 1 → Phase 3)
            </span>
            <span
              className="text-[11px] font-extrabold"
              style={{
                color:
                  fatigueDirection.startsWith("↑")
                    ? "#16a34a"
                    : fatigueDirection.startsWith("↓")
                    ? "#E24B4A"
                    : "#F5C518",
                fontFamily: "var(--font-nunito)",
              }}
            >
              {fatigueDirection}
            </span>
          </div>
        </div>

        {/* CPT Base Score highlight */}
        <div
          className="rounded-2xl px-4 py-3 flex items-center justify-between"
          style={{ background: `${meta.colour}10`, border: `1.5px solid ${meta.colour}25` }}
        >
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: meta.colour }}>
              Digital Task Score
            </p>
            <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
              Derived from hits, false taps & fatigue index
            </p>
          </div>
          <span
            className="text-2xl font-extrabold"
            style={{ color: meta.colour, fontFamily: "var(--font-nunito)" }}
          >
            {scores.cptBaseScore}%
          </span>
        </div>
      </div>

      {/* ── Assessment Score Breakdown ── */}
      <div className="px-5 mt-5">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1">
          Assessment Score Breakdown
        </p>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1.5px solid #F0F0F0" }}
        >
          <div className="px-4 pt-3 pb-0">
            <ScoreRow
              label="Part 1 · Digital Task"
              value={scores.cptBaseScore}
              color={meta.colour}
              delay={0.05}
            />
            <ScoreRow
              label="Part 1 · Burst Recovery"
              value={scores.recoveryScore}
              color="#4FC3F7"
              delay={0.15}
              note={
                scores.fatigueFlag
                  ? "Attention fatigue detected — focus dropped significantly in Phase 3 vs Phase 1"
                  : undefined
              }
            />
            {band !== "A" && (
              <ScoreRow
                label="Part 2 · Child Self-Report"
                value={scores.selfReportScore}
                color="#F4845F"
                delay={0.25}
              />
            )}
            <ScoreRow
              label="Part 3 · Parent Observations"
              value={scores.parentScore}
              color="#F4845F"
              delay={0.35}
            />
            <ScoreRow
              label="Part 4 · Motivation Check"
              value={scores.motivationScore}
              color="#F5C518"
              delay={0.45}
            />
          </div>
          <div className="px-4 pb-3" />
        </div>
      </div>

      {/* ── Parent Observation Clusters ── */}
      {scores.clusterScores && (
        <div className="px-5 mt-5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-3">
            Parent Observation — Clusters
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Sustaining Attention",   value: scores.clusterScores.c1, color: "#2BBCB0", delay: 0.1  },
              { label: "Impulse & Patience",      value: scores.clusterScores.c2, color: "#F5C518", delay: 0.15 },
              { label: "Real-world Attention",    value: scores.clusterScores.c3, color: "#F4845F", delay: 0.2  },
              { label: "Motivation vs Attention", value: scores.clusterScores.c4, color: "#3B82F6", delay: 0.25 },
            ].map(({ label, value, color, delay }) => (
              <div
                key={label}
                className="rounded-2xl px-3 py-3"
                style={{ border: "1.5px solid #F0F0F0" }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-gray-500 leading-tight">
                    {label}
                  </span>
                  <span
                    className="text-sm font-extrabold ml-2 shrink-0"
                    style={{ color, fontFamily: "var(--font-nunito)" }}
                  >
                    {value}%
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "#F3F4F6" }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.7, delay, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Observation gap flag ── */}
      {scores.gapFlag && (
        <div
          className="mx-5 mt-4 rounded-2xl p-4"
          style={{ background: "#FFFBEA", border: "1.5px solid #F5C51840" }}
        >
          <p className="text-xs font-extrabold text-[#92700A] mb-1">
            Note for parents
          </p>
          <p className="text-xs font-semibold text-gray-600 leading-relaxed">
            {scores.gapDirection === "cpt_higher"
              ? `Your child performed well on the digital task but real-world attention challenges were observed. This is a classic ${prof.name} pattern — strong focus when engaged, harder to sustain on assigned tasks. The motivation score explains more.`
              : `Real-world observation scores are higher than the task score. This may reflect test anxiety or an unfamiliar format rather than a genuine attention gap. Watch for patterns at home.`}
          </p>
        </div>
      )}

      {/* ── Disclaimer ── */}
      <p className="text-[10px] text-gray-400 leading-relaxed font-medium mx-5 mt-5">
        This report is generated by the Go Kids Attention Assessment — an
        independent tool built from observations across Go Kids workshops. It is
        not a clinically validated or standardised psychological assessment.
        Results are for personal understanding only and do not constitute a
        diagnosis or professional evaluation of any kind.
      </p>
    </ReportModalBase>
  );
}
