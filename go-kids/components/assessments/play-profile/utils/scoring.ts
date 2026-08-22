// ─── Play Profile Scoring ─────────────────────────────────────────────────────
// Aggregates per-question option scores into 5 dimension totals,
// then normalises to 0–100 for display.

import type { Dimension, QuestionOption } from "./questions";
import { QUESTIONS } from "./questions";

export interface DimensionScores {
  persistence: number;
  exploration: number;
  expressiveness: number;
  physicality: number;
  social: number;
}

// Raw min/max per dimension: 2 questions × (-2 or +2) each = -4 to +4
const RAW_MIN = -4;
const RAW_MAX = 4;
const DIMENSIONS: Dimension[] = [
  "persistence",
  "exploration",
  "expressiveness",
  "physicality",
  "social",
];

export const DIMENSION_LABELS: Record<Dimension, string> = {
  persistence: "Persistence",
  exploration: "Curiosity & Exploration",
  expressiveness: "Expressiveness",
  physicality: "Physicality",
  social: "Social Orientation",
};

export const DIMENSION_COLORS: Record<Dimension, string> = {
  persistence: "#F5C518",
  exploration: "#2BBCB0",
  expressiveness: "#8B5CF6",
  physicality: "#F4845F",
  social: "#4FC3F7",
};

/**
 * Given the index of the chosen option for each question (0, 1, or 2),
 * compute the raw score for every dimension.
 */
export function computeDimensionScores(
  answers: number[], // parallel to QUESTIONS array
): DimensionScores {
  const raw: DimensionScores = {
    persistence: 0,
    exploration: 0,
    expressiveness: 0,
    physicality: 0,
    social: 0,
  };

  answers.forEach((answerIdx, qIdx) => {
    const question = QUESTIONS[qIdx];
    if (!question) return;
    const option: QuestionOption = question.options[answerIdx as 0 | 1 | 2];
    if (!option) return;

    for (const dim of DIMENSIONS) {
      const delta = option.scores[dim];
      if (delta !== undefined) {
        raw[dim] += delta;
      }
    }
  });

  return raw;
}

/**
 * Convert raw dimension scores (-4 to +4) to 0–100 percentage for display.
 */
export function normaliseToPct(raw: DimensionScores): DimensionScores {
  const result = {} as DimensionScores;
  for (const dim of DIMENSIONS) {
    const pct =
      ((raw[dim] - RAW_MIN) / (RAW_MAX - RAW_MIN)) * 100;
    result[dim] = Math.round(Math.max(0, Math.min(100, pct)));
  }
  return result;
}
