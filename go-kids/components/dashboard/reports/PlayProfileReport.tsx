"use client";

import { motion } from "framer-motion";
import ReportModalBase from "./ReportModalBase";
import {
  DIMENSION_LABELS,
  DIMENSION_COLORS,
  normaliseToPct,
} from "@/components/assessments/play-profile/utils/scoring";
import { ARCHETYPES } from "@/components/assessments/play-profile/utils/archetypes";
import type { Dimension } from "@/components/assessments/play-profile/utils/questions";

const DIMENSIONS: Dimension[] = [
  "persistence",
  "exploration",
  "expressiveness",
  "physicality",
  "social",
];

export interface DBPlayProfileAssessment {
  _id: string;
  type: "play-profile";
  formData: {
    childName: string;
    answers: number[];
  };
  results: {
    scores: {
      persistence: number;
      exploration: number;
      expressiveness: number;
      physicality: number;
      social: number;
    };
    archetype: {
      key: string;
      name: string;
      emoji: string;
    };
  };
  createdAt: string;
}

interface Props {
  assessment: DBPlayProfileAssessment;
  onClose: () => void;
}

function DimensionBar({
  dim,
  pct,
  delay,
}: {
  dim: Dimension;
  pct: number;
  delay: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-500">
          {DIMENSION_LABELS[dim]}
        </span>
        <span
          className="text-xs font-extrabold text-brand-black"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: DIMENSION_COLORS[dim] }}
        />
      </div>
    </div>
  );
}

export default function PlayProfileReport({ assessment, onClose }: Props) {
  const { formData, results, createdAt } = assessment;
  const archetypeData = ARCHETYPES.find(
    (a) => a.key === results.archetype.key,
  );
  const accentColor = archetypeData?.color ?? "#2BBCB0";
  const pctScores = normaliseToPct(results.scores);

  const dateStr = new Date(createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <ReportModalBase
      open={true}
      onClose={onClose}
      accentColor={accentColor}
      header={
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: `${accentColor}20` }}
          >
            {results.archetype.emoji}
          </div>
          <div>
            <p
              className="text-[10px] font-extrabold uppercase tracking-widest mb-0.5"
              style={{ color: accentColor, fontFamily: "var(--font-nunito)" }}
            >
              Play Profile · {formData.childName}
            </p>
            <h2
              className="text-xl font-extrabold text-brand-black"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              {results.archetype.name}
            </h2>
            {archetypeData && (
              <p className="text-xs text-gray-500 font-semibold mt-0.5 italic">
                &ldquo;{archetypeData.tagline}&rdquo;
              </p>
            )}
            <p className="text-[10px] text-gray-400 font-semibold mt-1">
              Completed {dateStr}
            </p>
          </div>
        </div>
      }
    >
      <div className="px-6 py-4 space-y-6">
        {/* Description */}
        {archetypeData && (
          <div className="space-y-2">
            <h3
              className="text-xs font-extrabold text-brand-black uppercase tracking-wider"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              What this means
            </h3>
            <p className="text-sm text-gray-600 font-semibold leading-relaxed">
              {archetypeData.description}
            </p>
          </div>
        )}

        {/* Dimension bars */}
        <div className="space-y-3">
          <h3
            className="text-xs font-extrabold text-brand-black uppercase tracking-wider"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Play dimensions
          </h3>
          {DIMENSIONS.map((dim, i) => (
            <DimensionBar
              key={dim}
              dim={dim}
              pct={pctScores[dim]}
              delay={0.1 + i * 0.08}
            />
          ))}
        </div>

        {/* Recommendations */}
        {archetypeData && (
          <div className="space-y-2">
            <h3
              className="text-xs font-extrabold text-brand-black uppercase tracking-wider"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Recommendations
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {archetypeData.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{
                    background: archetypeData.bg,
                    border: `1px solid ${accentColor}20`,
                  }}
                >
                  <span className="text-lg shrink-0">{rec.icon}</span>
                  <div>
                    <p
                      className="text-xs font-extrabold text-brand-black"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {rec.label}
                    </p>
                    <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                      {rec.why}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parent Tips */}
        {archetypeData && (
          <div
            className="rounded-2xl p-4 space-y-2"
            style={{ background: "#FFFBEA", border: "1px solid #FDE68A" }}
          >
            <h3
              className="text-xs font-extrabold text-amber-800 uppercase tracking-wider"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              💡 Parent Tips
            </h3>
            {archetypeData.parentTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-amber-400 shrink-0">•</span>
                <p className="text-xs text-amber-900 font-semibold leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] text-gray-400 font-semibold leading-relaxed text-center pb-2">
          For personal use only. Not a clinical assessment or developmental
          diagnosis.
        </p>
      </div>
    </ReportModalBase>
  );
}
