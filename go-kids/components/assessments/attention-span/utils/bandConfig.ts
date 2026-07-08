// utils/bandConfig.ts

export type Band = "A" | "B" | "C";

export const BAND_CONFIG = {
  A: {
    ageLabel: "Ages 8-10",
    totalSeconds: 360, // 6 minutes
    phase1Seconds: 160,
    phase2Seconds: 40,
    phase3Seconds: 160,
    target: "◆",
    targetName: "Diamond",
    distractors: ["●", "■", "▲", "★", "⬟"],
  },
  B: {
    ageLabel: "Ages 11-13",
    totalSeconds: 480, // 8 minutes
    phase1Seconds: 215,
    phase2Seconds: 50,
    phase3Seconds: 215,
    target: "⬠",
    targetName: "Pentagon",
    distractors: ["◆", "▲", "●", "⬡", "◇"],
  },
  C: {
    ageLabel: "Ages 14-16",
    totalSeconds: 480, // 8 minutes
    phase1Seconds: 215,
    phase2Seconds: 50,
    phase3Seconds: 215,
    target: "⬡",
    targetName: "Hexagon",
    distractors: ["⬠", "◆", "▲", "●", "◇", "■"],
  },
} as const;

export const SHAPE_VISIBLE_MS: Record<Band, number> = {
  A: 900,
  B: 750,
  C: 600,
};

export const TARGET_PROBABILITY = 0.30;
