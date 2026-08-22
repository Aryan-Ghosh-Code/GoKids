// ─── Play Profile Survey Questions ────────────────────────────────────────────
// 10 questions (2 per dimension), parent-completed, ages 0–5
// Each option scores: +2 (high), 0 (neutral), or -2 (low) on the primary dimension.

export type Dimension =
  | "persistence"
  | "exploration"
  | "expressiveness"
  | "physicality"
  | "social";

export interface QuestionOption {
  text: string;
  scores: Partial<Record<Dimension, number>>;
}

export interface Question {
  id: number;
  text: string;
  helpText?: string;
  primaryDimension: Dimension;
  options: [QuestionOption, QuestionOption, QuestionOption];
}

export const QUESTIONS: Question[] = [
  // ── Persistence (Q1, Q7) ───────────────────────────────────────────────────
  {
    id: 1,
    text: "When your child starts playing with something — stacking blocks, a puzzle, or building something — how long do they typically stay with it?",
    helpText: "Think about what usually happens, not just the best days.",
    primaryDimension: "persistence",
    options: [
      {
        text: "10+ minutes without prompting — they can get deeply absorbed",
        scores: { persistence: 2 },
      },
      {
        text: "A few minutes, then they look for something else",
        scores: { persistence: 0 },
      },
      {
        text: "They move on every minute or two — no one activity holds them",
        scores: { persistence: -2 },
      },
    ],
  },
  {
    id: 2,
    text: "When your child gives your child something new — a toy, a container, a household object — what do they typically do first?",
    primaryDimension: "exploration",
    options: [
      {
        text: "They inspect it carefully: turn it over, tap it, look underneath — before trying it",
        scores: { exploration: 2 },
      },
      {
        text: "They try it in one or two obvious ways, then explore a little",
        scores: { exploration: 0 },
      },
      {
        text: "They use it exactly like something familiar — or ignore it quickly",
        scores: { exploration: -2 },
      },
    ],
  },
  {
    id: 3,
    text: "During play, does your child narrate, talk to their toys, invent characters, or make sound effects?",
    primaryDimension: "expressiveness",
    options: [
      {
        text: "Yes, often — they have full running commentaries, give toys voices, or make up ongoing stories",
        scores: { expressiveness: 2 },
      },
      {
        text: "Sometimes — the occasional sound effect or talking to a toy",
        scores: { expressiveness: 0 },
      },
      {
        text: "Rarely — they tend to play silently without narration",
        scores: { expressiveness: -2 },
      },
    ],
  },
  {
    id: 4,
    text: "How would you describe your child's natural movement level during play?",
    primaryDimension: "physicality",
    options: [
      {
        text: "Very physical — climbing, rolling, jumping, crashing into cushions, always on the move",
        scores: { physicality: 2 },
      },
      {
        text: "Mixed — energetic at times, calm and seated at other times",
        scores: { physicality: 0 },
      },
      {
        text: "Calm and still — prefers sitting play like drawing, sorting, or books",
        scores: { physicality: -2 },
      },
    ],
  },
  {
    id: 5,
    text: "During free play time, does your child prefer to have someone with them or play on their own?",
    primaryDimension: "social",
    options: [
      {
        text: "Strongly prefers others — sibling, parent, or other children; solo play quickly leads to boredom",
        scores: { social: 2 },
      },
      {
        text: "Comfortable either way, depending on mood",
        scores: { social: 0 },
      },
      {
        text: "Strongly prefers to play alone — others joining in can actually disrupt them",
        scores: { social: -2 },
      },
    ],
  },
  {
    id: 6,
    text: "Which type of play material does your child choose most often when given free choice?",
    primaryDimension: "physicality",
    options: [
      {
        text: "Anything physical — balls, ride-ons, swings, sand, water, or playdough",
        scores: { physicality: 2, exploration: 1 },
      },
      {
        text: "Building and making — blocks, stacking cups, magnetic tiles, simple constructions",
        scores: { physicality: 1, persistence: 1 },
      },
      {
        text: "Quiet, focused activities — books, puzzles, sorting, drawing, or pretend-play props",
        scores: { physicality: -2, expressiveness: 1 },
      },
    ],
  },
  {
    id: 7,
    text: "When something doesn't work the way your child wants (a tower keeps falling, a lid won't open), what do they usually do?",
    primaryDimension: "persistence",
    options: [
      {
        text: "Keep trying different ways — they can stay with it for a long time before asking for help",
        scores: { persistence: 2 },
      },
      {
        text: "Try once or twice more, then ask you for help or move on",
        scores: { persistence: 0 },
      },
      {
        text: "Abandon it almost immediately and switch to something else",
        scores: { persistence: -2 },
      },
    ],
  },
  {
    id: 8,
    text: "Does your child like to find new or unusual ways to use familiar objects (using a bowl as a drum, wearing a pot as a hat)?",
    primaryDimension: "exploration",
    options: [
      {
        text: "Yes, frequently — they regularly find unexpected uses for everyday things",
        scores: { exploration: 2 },
      },
      {
        text: "Occasionally — now and then they surprise you with a creative use",
        scores: { exploration: 0 },
      },
      {
        text: "Rarely — they tend to use objects in their intended way",
        scores: { exploration: -2 },
      },
    ],
  },
  {
    id: 9,
    text: "How often does your child engage in pretend or role play — pretending to cook, be an animal, care for a doll, or act out a scene?",
    primaryDimension: "expressiveness",
    options: [
      {
        text: "Very often — pretend play is a major part of their daily play",
        scores: { expressiveness: 2 },
      },
      {
        text: "Sometimes — they do it when in the right mood",
        scores: { expressiveness: 0 },
      },
      {
        text: "Rarely — they prefer hands-on, object-based activities to imaginative ones",
        scores: { expressiveness: -2 },
      },
    ],
  },
  {
    id: 10,
    text: "When your child is excited, scared, or upset, what do they typically do first?",
    primaryDimension: "social",
    options: [
      {
        text: "Immediately run to you or another person — they process big feelings by connecting with others",
        scores: { social: 2 },
      },
      {
        text: "Sometimes come to you, sometimes sort it out on their own",
        scores: { social: 0 },
      },
      {
        text: "Tend to manage it independently — through an object, movement, or their own comfort behaviour",
        scores: { social: -2 },
      },
    ],
  },
];
