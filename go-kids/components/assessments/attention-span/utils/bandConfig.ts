export const BAND_CONFIG = {
  A: {
    durSeconds: 30,
    durLabel: "6 minutes",
    target: "🔴",
    targetName: "Red circle",
    shapes: ["🔴", "🔵", "🟢", "🟡", "🟠", "🟣"],
    targetIdx: 0,
    shapeDisplayMs: 900,
  },
  B: {
    durSeconds: 480,
    durLabel: "8 minutes",
    target: "⭐",
    targetName: "Star icon",
    shapes: ["⭐", "🔷", "🔶", "🔸", "🔹", "🔺", "🔻"],
    targetIdx: 0,
    shapeDisplayMs: 750,
  },
  C: {
    durSeconds: 600,
    durLabel: "10 minutes",
    target: "A",
    targetName: "Letter A",
    shapes: ["A", "B", "C", "D", "E", "F", "G", "H"],
    targetIdx: 0,
    shapeDisplayMs: 600,
  },
} as const;

export type AgeBand = keyof typeof BAND_CONFIG;
