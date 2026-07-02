export type CPTResult = {
  shapesShown: number;
  targetCount: number;
  nonTargetCount: number;
  hits: number;             // TP — correctly tapped on target
  misses: number;           // FN — target shown, not tapped
  falseAlarms: number;      // FP — tapped on non-target
  correctRejections: number;// TN — non-target shown, correctly ignored
  hitRatePct: number;       // Recall  = TP / (TP + FN)   × 100
  falseAlarmRatePct: number;// FP rate = FP / (FP + TN)   × 100
  accuracyPct: number;      // (TP + TN) / (TP + TN + FP + FN) × 100
};

export type AssessmentResults = {
  cptScore: number;
  parentScore: number;
  overall: number;
  level: "High" | "Moderate" | "Low";
  sublabel: string;
};

export type Insight = {
  icon: "check" | "warn" | "alert";
  color: "green" | "amber" | "red";
  label: string;
  description: string;
};

/**
 * Calculate assessment results.
 *
 * CPT scoring uses ML-style accuracy: (TP + TN) / Total
 * which accounts for both correct hits AND correct rejections,
 * not just recall/sensitivity.
 *
 * @param accuracyPct  - (TP+TN)/Total × 100   (ML classification accuracy)
 * @param hitRatePct   - TP/(TP+FN) × 100      (recall — used in insights)
 * @param cptFalseAlarms - raw false alarm count (FP)
 * @param parentRaw    - raw parent questionnaire total (12–60)
 * @param totalShapes  - total shapes shown (TP+TN+FP+FN) — for proportional FA penalty
 */
export function calcResults(
  accuracyPct: number,
  hitRatePct: number,
  cptFalseAlarms: number,
  parentRaw: number,
  totalShapes: number = 40
): AssessmentResults {
  // Primary CPT score is based on overall accuracy (TP+TN / total)
  let cptScore = accuracyPct >= 85 ? 90 : accuracyPct >= 70 ? 70 : accuracyPct >= 55 ? 50 : 20;

  // Proportional false-alarm penalty: scale thresholds by session length
  // Baseline: 40 total shapes → thresholds 20 / 10
  const highFaThreshold = Math.max(1, Math.round((20 / 40) * totalShapes));
  const modFaThreshold  = Math.max(1, Math.round((10 / 40) * totalShapes));

  if (cptFalseAlarms > highFaThreshold) cptScore = Math.max(0, cptScore - 20);
  else if (cptFalseAlarms > modFaThreshold) cptScore = Math.max(0, cptScore - 8);

  // Parent questionnaire score (range 12–60 → 0–100)
  let parentScore = Math.round(((parentRaw - 12) / 48) * 100);
  parentScore = Math.max(0, Math.min(100, parentScore));

  const overall = Math.round(cptScore * 0.6 + parentScore * 0.4);
  const level: "High" | "Moderate" | "Low" =
    overall >= 66 ? "High" : overall >= 41 ? "Moderate" : "Low";
  const sublabel =
    level === "High"
      ? "Strong sustained attention observed"
      : level === "Moderate"
      ? "Some areas of attention to develop"
      : "Attention support is recommended";

  return { cptScore, parentScore, overall, level, sublabel };
}

/**
 * Build insight bullets for the results screen.
 *
 * @param accuracyPct    - ML accuracy (TP+TN)/Total × 100
 * @param hitRatePct     - Recall/sensitivity TP/(TP+FN) × 100
 * @param falseAlarmRatePct - FP rate FP/(FP+TN) × 100
 * @param falseAlarms    - raw FP count
 * @param parentRaw      - raw parent score
 * @param level          - final classification level
 * @param totalShapes    - total shapes in session (for proportional thresholds)
 */
export function buildInsights(
  accuracyPct: number,
  hitRatePct: number,
  falseAlarmRatePct: number,
  falseAlarms: number,
  parentRaw: number,
  level: string,
  totalShapes: number = 40
): Insight[] {
  const insights: Insight[] = [];

  const highFaThreshold = Math.max(1, Math.round((20 / 40) * totalShapes));
  const modFaThreshold  = Math.max(1, Math.round((10 / 40) * totalShapes));

  // 1. Overall accuracy (TP+TN / Total) — primary metric
  if (accuracyPct >= 85) {
    insights.push({
      icon: "check",
      color: "green",
      label: `${accuracyPct}% overall accuracy`,
      description:
        "Excellent classification accuracy — correctly identified targets and filtered distractors.",
    });
  } else if (accuracyPct >= 70) {
    insights.push({
      icon: "warn",
      color: "amber",
      label: `${accuracyPct}% overall accuracy`,
      description:
        "Good accuracy with some lapses — a few targets missed or distractors incorrectly tapped.",
    });
  } else if (accuracyPct >= 55) {
    insights.push({
      icon: "warn",
      color: "amber",
      label: `${accuracyPct}% overall accuracy`,
      description:
        "Moderate accuracy — noticeable difficulty distinguishing targets from non-targets.",
    });
  } else {
    insights.push({
      icon: "alert",
      color: "red",
      label: `${accuracyPct}% overall accuracy`,
      description:
        "Low accuracy — significant difficulty sustaining attention and filtering distractors.",
    });
  }

  // 2. Hit rate (recall) — sensitivity to targets
  if (hitRatePct >= 85) {
    insights.push({
      icon: "check",
      color: "green",
      label: `${hitRatePct}% target detection rate`,
      description: "Excellent ability to detect and respond to target stimuli.",
    });
  } else if (hitRatePct >= 65) {
    insights.push({
      icon: "warn",
      color: "amber",
      label: `${hitRatePct}% target detection rate`,
      description: "Moderate target detection — some lapses in sustained attention.",
    });
  } else {
    insights.push({
      icon: "alert",
      color: "red",
      label: `${hitRatePct}% target detection rate`,
      description: "Low target detection — significant attention lapses observed.",
    });
  }

  // 3. False alarm rate (impulsivity / specificity)
  if (falseAlarms <= modFaThreshold) {
    insights.push({
      icon: "check",
      color: "green",
      label: `${falseAlarmRatePct}% false alarm rate`,
      description: "Strong impulse control — rarely responded to non-target stimuli.",
    });
  } else if (falseAlarms <= highFaThreshold) {
    insights.push({
      icon: "warn",
      color: "amber",
      label: `${falseAlarmRatePct}% false alarm rate`,
      description: "Moderate impulsivity — some difficulty inhibiting responses to distractors.",
    });
  } else {
    insights.push({
      icon: "alert",
      color: "red",
      label: `${falseAlarmRatePct}% false alarm rate`,
      description: "Significant impulsivity — frequent responses to non-target stimuli.",
    });
  }

  // 4. Parent questionnaire
  if (parentRaw >= 45) {
    insights.push({
      icon: "check",
      color: "green",
      label: `Parent score: ${parentRaw}/60`,
      description: "Parent observations suggest strong attention skills in daily life.",
    });
  } else if (parentRaw >= 29) {
    insights.push({
      icon: "warn",
      color: "amber",
      label: `Parent score: ${parentRaw}/60`,
      description: "Some attention challenges noted in daily activities.",
    });
  } else {
    insights.push({
      icon: "alert",
      color: "red",
      label: `Parent score: ${parentRaw}/60`,
      description: "Notable attention difficulties observed across daily activities.",
    });
  }

  // 5. Professional referral for Low only
  if (level === "Low") {
    insights.push({
      icon: "alert",
      color: "red",
      label: "Professional consultation recommended",
      description:
        "Consult a qualified child psychologist before making educational decisions.",
    });
  }

  return insights;
}
