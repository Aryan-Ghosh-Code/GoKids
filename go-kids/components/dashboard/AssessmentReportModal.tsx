"use client";

import AttentionSpanReport from "./reports/AttentionSpanReport";
import PlayProfileReport, {
  type DBPlayProfileAssessment,
} from "./reports/PlayProfileReport";

// ── Canonical DB shape ─────────────────────────────────────────────────────────
// This is the single source-of-truth type used across all report components.
export interface DBAssessmentFull {
  _id: string;
  type: string;
  formData: {
    band?: string;
    childName: string;
    partBAnswers?: number[] | null;
    partCAnswers?: number[] | null;
    partDAnswers?: number[] | null;
    answers?: number[];
    [key: string]: unknown;
  };
  // results is typed loosely here because different assessment types store
  // different shapes. Individual report components receive narrower types.
  results: {
    // attention-span fields
    cptRaw?: {
      phase1Targets: number;
      phase1Hits: number;
      phase1Misses: number;
      phase1FalseAlarms: number;
      burstStarsTotal: number;
      burstStarsTapped: number;
      phase3Targets: number;
      phase3Hits: number;
      phase3Misses: number;
      phase3FalseAlarms: number;
      totalTargets: number;
      totalHits: number;
      totalFalseAlarms: number;
      hitRatePct: number;
      phase1HitRatePct: number;
      phase3HitRatePct: number;
      fatigueIndex: number;
      burstTapRatePct: number;
    };
    scores?: {
      cptBaseScore: number;
      recoveryScore: number;
      fatigueIndex: number;
      fatigueFlag: boolean;
      selfReportScore: number;
      parentScore: number;
      clusterScores: { c1: number; c2: number; c3: number; c4: number };
      motivationScore: number;
      gapFlag: boolean;
      gapDirection: string | null;
    };
    profile?: {
      key: string;
      name: string;
      emoji: string;
    };
    // play-profile fields
    archetype?: {
      key: string;
      name: string;
      emoji: string;
    };
    // catch-all for any future assessment type
    [key: string]: unknown;
  };
  createdAt: string;
}

interface Props {
  assessment: DBAssessmentFull | null;
  onClose: () => void;
}

/**
 * Orchestrator — picks the right report view based on assessment.type.
 * Add new assessment types here as the platform grows.
 */
export default function AssessmentReportModal({ assessment, onClose }: Props) {
  if (!assessment) return null;

  switch (assessment.type) {
    case "attention-span":
      return <AttentionSpanReport assessment={assessment} onClose={onClose} />;

    case "play-profile":
      return (
        <PlayProfileReport
          assessment={assessment as unknown as DBPlayProfileAssessment}
          onClose={onClose}
        />
      );

    // Future: case "talent": return <TalentReport assessment={assessment} onClose={onClose} />;

    default:
      return null;
  }
}
