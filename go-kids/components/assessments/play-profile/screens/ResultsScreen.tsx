"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Archetype } from "../utils/archetypes";
import type { DimensionScores } from "../utils/scoring";
import {
  DIMENSION_LABELS,
  DIMENSION_COLORS,
  normaliseToPct,
} from "../utils/scoring";
import type { Dimension } from "../utils/questions";

interface Props {
  archetype: Archetype;
  rawScores: DimensionScores;
  childName: string;
  onSave: () => Promise<void>;
}

const DIMENSIONS: Dimension[] = [
  "persistence",
  "exploration",
  "expressiveness",
  "physicality",
  "social",
];

function DimensionBar({
  dim,
  pct,
  delay,
}: {
  dim: Dimension;
  pct: number;
  delay: number;
}) {
  const color = DIMENSION_COLORS[dim];
  const label = DIMENSION_LABELS[dim];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-600">{label}</p>
        <p
          className="text-xs font-extrabold text-brand-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {pct}%
        </p>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#F3F4F6" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

export function ResultsScreen({ archetype, rawScores, childName, onSave }: Props) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const pctScores = normaliseToPct(rawScores);

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
      {/* Archetype Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl p-6 text-center space-y-3"
        style={{ background: archetype.bg, border: `1.5px solid ${archetype.color}30` }}
      >
        <div className="text-6xl">{archetype.emoji}</div>
        <div>
          <p
            className="text-xs font-extrabold uppercase tracking-widest mb-1"
            style={{ color: archetype.color, fontFamily: "var(--font-heading)" }}
          >
            {childName}&apos;s Play Profile
          </p>
          <h2
            className="text-2xl font-extrabold text-brand-black"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {archetype.name}
          </h2>
          <p className="text-sm text-gray-500 font-semibold mt-1 italic">
            &ldquo;{archetype.tagline}&rdquo;
          </p>
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <h3
          className="text-sm font-extrabold text-brand-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          What this means
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed font-semibold">
          {archetype.description}
        </p>
      </motion.div>

      {/* Traits */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="space-y-2"
      >
        <h3
          className="text-sm font-extrabold text-brand-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Common traits
        </h3>
        <div className="space-y-1.5">
          {archetype.traits.map((trait, i) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className="text-xs mt-0.5 shrink-0 font-extrabold"
                style={{ color: archetype.color }}
              >
                ✦
              </span>
              <p className="text-sm text-gray-600 font-semibold leading-relaxed">
                {trait}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Dimension breakdown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h3
          className="text-sm font-extrabold text-brand-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Play dimension breakdown
        </h3>
        <div className="space-y-3">
          {DIMENSIONS.map((dim, i) => (
            <DimensionBar
              key={dim}
              dim={dim}
              pct={pctScores[dim]}
              delay={0.35 + i * 0.1}
            />
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <h3
          className="text-sm font-extrabold text-brand-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Toy & activity recommendations
        </h3>
        <div className="grid grid-cols-1 gap-2.5">
          {archetype.recommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.07 }}
              className="flex items-start gap-3 p-3.5 rounded-2xl"
              style={{
                background: archetype.bg,
                border: `1px solid ${archetype.color}25`,
              }}
            >
              <span className="text-xl shrink-0">{rec.icon}</span>
              <div>
                <p
                  className="text-xs font-extrabold text-brand-black"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {rec.label}
                </p>
                <p className="text-[11px] text-gray-500 font-semibold leading-relaxed mt-0.5">
                  {rec.why}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Parent tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="rounded-2xl p-4 space-y-2"
        style={{ background: "#FFFBEA", border: "1px solid #FDE68A" }}
      >
        <h3
          className="text-xs font-extrabold text-amber-800 uppercase tracking-wider"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          💡 Parent tips
        </h3>
        {archetype.parentTips.map((tip, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-amber-500 shrink-0 mt-0.5">•</span>
            <p className="text-xs text-amber-800 font-semibold leading-relaxed">
              {tip}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Save to dashboard */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="space-y-3 pt-2 border-t border-gray-100"
      >
        {saveError && (
          <p className="text-xs text-red-500 font-semibold text-center">
            {saveError}
          </p>
        )}
        {!saved ? (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 rounded-2xl font-extrabold text-sm transition-all cursor-pointer disabled:opacity-60"
            style={{
              fontFamily: "var(--font-heading)",
              background: "#F5C518",
              color: "#1A1A1A",
              boxShadow: "0 4px 12px rgba(245,197,24,0.3)",
            }}
          >
            {saving ? "Saving…" : "Save to My Dashboard →"}
          </button>
        ) : (
          <div
            className="w-full py-4 rounded-2xl font-extrabold text-sm text-center"
            style={{
              fontFamily: "var(--font-heading)",
              background: "#E8F8F7",
              color: "#0D7A73",
            }}
          >
            ✓ Saved to your dashboard
          </div>
        )}
        <Link
          href="/parent/dashboard?tab=assessments"
          className="block w-full py-3 rounded-2xl text-sm font-bold text-center border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          View Dashboard
        </Link>
      </motion.div>

      {/* Disclaimer */}
      <p className="text-[10px] text-gray-400 font-semibold leading-relaxed text-center pb-2">
        This survey is for personal use only and is not a clinical assessment.
        Results reflect observed play patterns and are not a developmental
        diagnosis of any kind.
      </p>
    </div>
  );
}
