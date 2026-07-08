// utils/profiles.ts

export type ProfileKey =
  | "deep_diver"
  | "spark_seeker"
  | "steady_pacer"
  | "effortful_focuser"
  | "wanderer";

export interface ProfileResult {
  key:           ProfileKey;
  emoji:         string;
  name:          string;
  colour:        string;
  tagline:       string;
  parentMessage: string;
  strategies:    string[];
}

// ─── Profile data — exact from spec ──────────────────────────────────────────
const PROFILES: Record<ProfileKey, ProfileResult> = {
  deep_diver: {
    key: "deep_diver",
    emoji: "🔵",
    name: "The Deep Diver",
    colour: "#3B82F6",
    tagline: "Focuses intensely on things they love — struggles when a task feels irrelevant or assigned.",
    parentMessage: "Your child's attention is strong when motivated. The challenge is relevance. Help them find the 'why' in tasks they avoid.",
    strategies: [
      "Connect tasks to interests before starting — one real-world link between the subject and something they love.",
      "Give ownership — let them choose the order of tasks, when they study, or how they present their work.",
      "Use passion projects as bridges — start with what they love, then move to harder material.",
      "State the reason for each task in one sentence before they begin — Deep Divers switch off when purpose is unclear.",
      "Avoid forcing urgency — this profile goes deep slowly. Long deadlines with check-ins beat last-minute pressure.",
    ],
  },
  spark_seeker: {
    key: "spark_seeker",
    emoji: "🟡",
    name: "The Spark Seeker",
    colour: "#F5C518",
    tagline: "Attention lights up with novelty, competition, or creativity — fades fast in routine or repetitive tasks.",
    parentMessage: "Your child needs variety and stimulation built into learning. Routine kills their focus — novelty unlocks it.",
    strategies: [
      "Inject variety every 15 minutes — change format (reading → drawing → talking) even if the topic stays the same.",
      "Turn tasks into challenges — 'Can you finish this in 10 minutes?' works far better than open-ended study time.",
      "Use a visual timer — time-boxing makes tasks feel finite, which helps Spark Seekers engage.",
      "Celebrate the start, not just the finish — this profile is energised by beginning things.",
      "Build in a genuine movement break after every task — physical reset restores focus for the next sprint.",
    ],
  },
  steady_pacer: {
    key: "steady_pacer",
    emoji: "🟢",
    name: "The Steady Pacer",
    colour: "#16a34a",
    tagline: "Consistent, reliable attention across most contexts. Even under pressure, performance stays stable.",
    parentMessage: "Your child has a solid attention foundation. Focus on keeping it consistent as academic demands increase.",
    strategies: [
      "Gradually increase challenge — Steady Pacers handle routine well but plateau without stretch.",
      "Introduce peer learning — explaining something to a friend deepens retention and adds engagement.",
      "Watch for coast mode — Steady Pacers can underperform when unchallenged. Check whether work is demanding enough.",
      "Build on existing habits — add one new strategy at a time rather than overhauling routines.",
      "Keep the environment consistent — same time, same place, same routine. This profile thrives on predictability.",
    ],
  },
  effortful_focuser: {
    key: "effortful_focuser",
    emoji: "🟠",
    name: "The Effortful Focuser",
    colour: "#F4845F",
    tagline: "Tries hard but tires quickly. Starts tasks with strong attention — focus fades before the task ends.",
    parentMessage: "Your child's attention runs out before the task does. Structured breaks and shorter work blocks will help significantly.",
    strategies: [
      "Use 15-minute focus blocks only — set a timer, full stop, then a genuine 5-minute break before the next block.",
      "Front-load the hardest task — attention is sharpest at the start of each session.",
      "Reduce decision fatigue before studying — materials ready, topic chosen, timer set before sitting down.",
      "Physical movement before study — even a 5-minute walk measurably improves subsequent focus for this profile.",
      "Track wins, not failures — Effortful Focusers are aware they tire quickly. Celebrate completed blocks.",
    ],
  },
  wanderer: {
    key: "wanderer",
    emoji: "🔴",
    name: "The Wanderer",
    colour: "#E24B4A",
    tagline: "Attention scatters easily across all contexts — regardless of topic, reward, environment, or motivation.",
    parentMessage: "Your child needs consistent, structured attention support. Small daily practices will build the focus muscle over time.",
    strategies: [
      "Start with just 5 minutes — not 20, not 10. Build the experience of completing a focused block before extending it.",
      "Remove every distraction before starting — phone away, noise off, one task visible. Environmental control is essential.",
      "Use a simple signal system — a quiet hand on the shoulder or a pre-agreed word to bring attention back without shame.",
      "Work alongside your child occasionally — shared quiet focus normalises sustained attention as a shared activity.",
      "Speak to a professional if patterns persist — if attention is consistently low across all contexts, a child psychologist will provide more targeted support than home strategies alone.",
    ],
  },
};

// ─── Profile determination — 8-rule priority system ─────────────────────────
export function determineProfile(scores: {
  motivationScore:  number;
  cptBaseScore:     number;
  parentScore:      number;
  recoveryScore:    number;
  fatigueIndex:     number;
}): ProfileResult {
  const { motivationScore, cptBaseScore, parentScore, recoveryScore, fatigueIndex } = scores;

  // Priority 1: Spark Seeker
  if (motivationScore >= 70 && cptBaseScore < 65 && parentScore < 60)
    return PROFILES.spark_seeker;

  // Priority 2: Deep Diver
  if (motivationScore >= 70 && cptBaseScore >= 65)
    return PROFILES.deep_diver;

  // Priority 3: Steady Pacer
  if (cptBaseScore >= 75 && parentScore >= 70 && recoveryScore >= 65)
    return PROFILES.steady_pacer;

  // Priority 4: Effortful Focuser
  if (fatigueIndex <= -15 || (cptBaseScore >= 55 && parentScore < 55 && recoveryScore < 50))
    return PROFILES.effortful_focuser;

  // Priority 5: Wanderer
  if (cptBaseScore < 50 && parentScore < 50 && motivationScore < 50)
    return PROFILES.wanderer;

  // Fallback 6: Spark Seeker
  if (motivationScore >= 60) return PROFILES.spark_seeker;

  // Fallback 7: Steady Pacer
  if (cptBaseScore >= 65) return PROFILES.steady_pacer;

  // Fallback 8: Effortful Focuser (catch-all)
  return PROFILES.effortful_focuser;
}
