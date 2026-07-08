// utils/questions.ts

export interface Question {
  id: string;
  text: string;
  reverse: boolean;
}

export interface PartCQuestion extends Question {
  cluster: 1 | 2 | 3 | 4;
}

// ─── Part B — Child Self-Report (Band B/C only, 6 questions) ──────────────────
export const PART_B_QUESTIONS: Question[] = [
  { id: "B1", text: "It was easy to keep watching the shapes without my mind wandering.", reverse: false },
  { id: "B2", text: "I felt like stopping or giving up before the timer ended.", reverse: true },
  { id: "B3", text: "I always waited to be sure before tapping — I didn't guess.", reverse: false },
  { id: "B4", text: "After the star break, I found it easier to focus again.", reverse: false },
  { id: "B5", text: "The task felt boring or pointless to me.", reverse: true },
  { id: "B6", text: "I noticed my mind drifting to other thoughts during the task.", reverse: true },
];
// Scale: 1 = Strongly disagree, 5 = Strongly agree
// Reverse: B2 (index 1), B5 (index 4), B6 (index 5) → scored = 6 - raw

export const PART_B_LABELS = [
  "Strongly\nDisagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly\nAgree",
];

// ─── Part C — Parent Observation (12 questions, 4 clusters) ───────────────────
export const PART_C_QUESTIONS: PartCQuestion[] = [
  // Cluster 1 — Sustaining attention
  { id: "C1",  cluster: 1, text: "My child can work on a homework or study task for 15–20 minutes without needing a reminder, a break, or switching to something else.", reverse: false },
  { id: "C2",  cluster: 1, text: "My child starts tasks with energy but loses focus or gives up before finishing, even when the task is manageable.", reverse: true },
  { id: "C3",  cluster: 1, text: "When my child is doing something they chose — a puzzle, building, reading — they stay engaged without external prompting.", reverse: false },
  // Cluster 2 — Impulse and patience
  { id: "C4",  cluster: 2, text: "My child blurts out answers, interrupts conversations, or acts before thinking through the consequence.", reverse: true },
  { id: "C5",  cluster: 2, text: "My child can wait their turn — in games, queues, or conversations — without becoming visibly frustrated or disruptive.", reverse: false },
  { id: "C6",  cluster: 2, text: "When my child makes a mistake, they pause and try again rather than giving up immediately or reacting with frustration.", reverse: false },
  // Cluster 3 — Real-world attention
  { id: "C7",  cluster: 3, text: "My child can follow a sequence of 2–3 instructions without forgetting steps or needing them repeated.", reverse: false },
  { id: "C8",  cluster: 3, text: "My child loses or forgets things needed for daily tasks — school items, homework, belongings — on a regular basis.", reverse: true },
  { id: "C9",  cluster: 3, text: "My child is easily pulled away from a task by background noise, movement, or people nearby — even minor distractions derail them.", reverse: true },
  // Cluster 4 — Motivation vs attention
  { id: "C10", cluster: 4, text: "My child's focus is dramatically better when doing something they chose or care about — the difference is noticeable compared to assigned tasks.", reverse: false },
  { id: "C11", cluster: 4, text: "My child can stay engaged with screens, games, or videos for long periods — but struggles to apply the same focus to structured tasks.", reverse: true },
  { id: "C12", cluster: 4, text: "When my child finds a subject or activity genuinely exciting, their attention, energy, and persistence all improve significantly.", reverse: false },
];
// Scale: 1 = Never, 2 = Rarely, 3 = Sometimes, 4 = Often, 5 = Almost always
// Reverse: C2 (idx 1), C4 (idx 3), C8 (idx 7), C9 (idx 8), C11 (idx 10)

export const PART_C_CLUSTER_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Sustaining Attention",
  2: "Impulse & Patience",
  3: "Real-world Attention",
  4: "Motivation vs Attention",
};

export const PART_C_LABELS = ["Never", "Rarely", "Sometimes", "Often", "Almost always"];

// ─── Part D — Motivation Check (10 questions) ─────────────────────────────────
export const PART_D_QUESTIONS: Question[] = [
  { id: "D1",  text: "When my child picks their own activity, they stay focused far longer than when told what to do.", reverse: false },
  { id: "D2",  text: "My child loses interest quickly in tasks that feel repetitive, even if they were excited at the start.", reverse: false },
  { id: "D3",  text: "My child focuses much better when there is a reward, competition, or challenge involved.", reverse: false },
  { id: "D4",  text: "My child can sit through a full movie, long game session, or YouTube series without losing attention.", reverse: false },
  { id: "D5",  text: "My child gives up faster when a task feels pointless, even if it is easy.", reverse: false },
  { id: "D6",  text: "When genuinely curious, my child researches or explores a topic deeply without being asked.", reverse: false },
  { id: "D7",  text: "My child's attention improves noticeably when working with a friend versus working alone.", reverse: false },
  { id: "D8",  text: "My child focuses better in the morning than later in the day.", reverse: false },
  { id: "D9",  text: "My child loses focus faster in noisy or busy environments compared to quiet ones.", reverse: false },
  { id: "D10", text: "My child pays better attention when given a reason or real-world connection for why a task matters.", reverse: false },
];
// Scale: 1 = Never, 2 = Rarely, 3 = Sometimes, 4 = Often, 5 = Always
// All normal scored (no reverse items in Part D)

export const PART_D_LABELS = ["Never", "Rarely", "Sometimes", "Often", "Always"];
