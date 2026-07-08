// utils/scoring.ts

import { Band } from "./bandConfig";

// ─── Raw CPT data collected across all 3 phases ───────────────────────────────
export interface CptRawData {
  // Phase 1
  phase1Targets:     number;
  phase1Hits:        number;
  phase1Misses:      number;
  phase1FalseAlarms: number;
  // Burst
  burstStarsTotal:   number;
  burstStarsTapped:  number;
  // Phase 3
  phase3Targets:     number;
  phase3Hits:        number;
  phase3Misses:      number;
  phase3FalseAlarms: number;
  // Totals (computed before scoring)
  totalTargets:     number;
  totalHits:        number;
  totalFalseAlarms: number;
  hitRatePct:       number;
  phase1HitRatePct: number;
  phase3HitRatePct: number;
  fatigueIndex:     number;   // phase3HitRatePct - phase1HitRatePct
  burstTapRatePct:  number;   // burstStarsTapped / burstStarsTotal * 100
}

// ─── Helpers: build CptRawData from collected phase counters ─────────────────
export function buildCptRaw(
  p1: { targets: number; hits: number; misses: number; falseAlarms: number },
  burst: { total: number; tapped: number },
  p3: { targets: number; hits: number; misses: number; falseAlarms: number },
): CptRawData {
  const totalTargets = p1.targets + p3.targets;
  const totalHits = p1.hits + p3.hits;
  const totalFalseAlarms = p1.falseAlarms + p3.falseAlarms;

  const hitRatePct = totalTargets > 0 ? (totalHits / totalTargets) * 100 : 0;
  const phase1HitRatePct = p1.targets > 0 ? (p1.hits / p1.targets) * 100 : 0;
  const phase3HitRatePct = p3.targets > 0 ? (p3.hits / p3.targets) * 100 : 0;
  const fatigueIndex = phase3HitRatePct - phase1HitRatePct;
  const burstTapRatePct = burst.total > 0 ? (burst.tapped / burst.total) * 100 : 0;

  return {
    phase1Targets: p1.targets,
    phase1Hits: p1.hits,
    phase1Misses: p1.misses,
    phase1FalseAlarms: p1.falseAlarms,
    burstStarsTotal: burst.total,
    burstStarsTapped: burst.tapped,
    phase3Targets: p3.targets,
    phase3Hits: p3.hits,
    phase3Misses: p3.misses,
    phase3FalseAlarms: p3.falseAlarms,
    totalTargets,
    totalHits,
    totalFalseAlarms,
    hitRatePct,
    phase1HitRatePct,
    phase3HitRatePct,
    fatigueIndex,
    burstTapRatePct,
  };
}

// ─── Part A scoring ──────────────────────────────────────────────────────────
export interface PartAScores {
  cptBaseScore:   number;
  recoveryScore:  number;
  fatigueIndex:   number;
  fatigueFlag:    boolean;
  recoveryBonus:  boolean;
}

export function scorePartA(cpt: CptRawData): PartAScores {
  // Step 1a: CPT base score from hit rate
  let cptBaseScore =
    cpt.hitRatePct >= 85 ? 90 :
    cpt.hitRatePct >= 65 ? 60 :
    25;

  // Step 1b: False alarm deduction
  if (cpt.totalFalseAlarms > 20)      cptBaseScore = Math.max(0, cptBaseScore - 20);
  else if (cpt.totalFalseAlarms > 10) cptBaseScore = Math.max(0, cptBaseScore - 8);

  // Step 1c: Fatigue index
  const fatigueIndex = cpt.phase3HitRatePct - cpt.phase1HitRatePct;
  const fatigueFlag = fatigueIndex <= -15;

  // Step 1d: Recovery score from burst
  let recoveryScore =
    cpt.burstTapRatePct >= 70 ? 85 :
    cpt.burstTapRatePct >= 40 ? 55 :
    25;

  // Step 1e: Post-burst recovery bonus
  const recoveryBonus = cpt.phase3HitRatePct > cpt.phase1HitRatePct;
  if (recoveryBonus) recoveryScore = Math.min(100, recoveryScore + 10);

  return { cptBaseScore, recoveryScore, fatigueIndex, fatigueFlag, recoveryBonus };
}

// ─── Part B scoring ──────────────────────────────────────────────────────────
export function scorePartB(rawAnswers: number[], band: Band): number {
  // Band A skips Part B — default neutral 50%
  if (band === "A") return 50;

  const REVERSE_INDICES = [1, 4, 5]; // B2, B5, B6
  const scored = rawAnswers.map((v, i) =>
    REVERSE_INDICES.includes(i) ? 6 - v : v
  );
  const sum = scored.reduce((a, b) => a + b, 0); // max 30
  return Math.round((sum / 30) * 100);
}

// ─── Part C scoring ──────────────────────────────────────────────────────────
export interface PartCScores {
  parentScore: number;
  clusterScores: { c1: number; c2: number; c3: number; c4: number };
}

export function scorePartC(rawAnswers: number[]): PartCScores {
  const REVERSE_INDICES = [1, 3, 7, 8, 10]; // C2, C4, C8, C9, C11
  const scored = rawAnswers.map((v, i) =>
    REVERSE_INDICES.includes(i) ? 6 - v : v
  );

  const parentScore = Math.round((scored.reduce((a, b) => a + b, 0) / 60) * 100);

  const clusterScores = {
    c1: Math.round(((scored[0] + scored[1] + scored[2]) / 15) * 100),
    c2: Math.round(((scored[3] + scored[4] + scored[5]) / 15) * 100),
    c3: Math.round(((scored[6] + scored[7] + scored[8]) / 15) * 100),
    c4: Math.round(((scored[9] + scored[10] + scored[11]) / 15) * 100),
  };

  return { parentScore, clusterScores };
}

// ─── Part D scoring ──────────────────────────────────────────────────────────
export function scorePartD(rawAnswers: number[]): number {
  const sum = rawAnswers.reduce((a, b) => a + b, 0); // max 50
  return Math.round((sum / 50) * 100);
}

// ─── Gap flag ────────────────────────────────────────────────────────────────
export interface GapFlag {
  hasGap:    boolean;
  direction: "cpt_higher" | "parent_higher" | null;
}

export function detectGapFlag(cptBaseScore: number, parentScore: number): GapFlag {
  const diff = cptBaseScore - parentScore;
  if (Math.abs(diff) >= 25) {
    return { hasGap: true, direction: diff > 0 ? "cpt_higher" : "parent_higher" };
  }
  return { hasGap: false, direction: null };
}

// ─── Aggregated scores shape (passed to determineProfile) ────────────────────
export interface AllScores {
  cptBaseScore:   number;
  recoveryScore:  number;
  fatigueIndex:   number;
  fatigueFlag:    boolean;
  recoveryBonus:  boolean;
  selfReportScore: number;
  parentScore:    number;
  clusterScores:  { c1: number; c2: number; c3: number; c4: number };
  motivationScore: number;
  gapFlag:        boolean;
  gapDirection:   "cpt_higher" | "parent_higher" | null;
}

export function computeAllScores(
  cptRaw: CptRawData,
  partBRaw: number[],
  partCRaw: number[],
  partDRaw: number[],
  band: Band,
): AllScores {
  const partA = scorePartA(cptRaw);
  const selfReportScore = scorePartB(partBRaw, band);
  const { parentScore, clusterScores } = scorePartC(partCRaw);
  const motivationScore = scorePartD(partDRaw);
  const gap = detectGapFlag(partA.cptBaseScore, parentScore);

  return {
    ...partA,
    selfReportScore,
    parentScore,
    clusterScores,
    motivationScore,
    gapFlag: gap.hasGap,
    gapDirection: gap.direction,
  };
}
