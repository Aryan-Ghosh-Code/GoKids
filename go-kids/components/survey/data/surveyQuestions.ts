// ─── Survey Questions ──────────────────────────────────────────────────────────
// Exact question text from spec — do not alter

export type QuestionType = "single" | "open";

export interface SingleQuestion {
  id: string;
  type: "single";
  text: string;
  instruction: string | null;
  options: string[];
}

export interface OpenQuestion {
  id: string;
  type: "open";
  text: string;
  instruction: string | null;
  placeholder: string;
}

export type SurveyQuestion = SingleQuestion | OpenQuestion;

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  // ── Q1 ──────────────────────────────────────────────────────────────────────
  {
    id: "Q1",
    type: "single",
    text: "What is the age of the child you are answering this survey about?",
    instruction: "Please select ONE.",
    options: ["1–2 years", "2–3 years", "3–4 years", "4–5 years", "5–6 years"],
  },
  // ── Q2 ──────────────────────────────────────────────────────────────────────
  {
    id: "Q2",
    type: "single",
    text: "What is the BIGGEST concern or challenge you currently face with your child?",
    instruction: "Please select ONE.",
    options: [
      "Keeping my child engaged in meaningful activities",
      "Knowing how to support my child's learning and development",
      "Reducing screen time",
      "Finding the right activities and toys",
      "Knowing what skills or milestones to expect",
    ],
  },
  // ── Q3 ──────────────────────────────────────────────────────────────────────
  {
    id: "Q3",
    type: "single",
    text: "What is your PRIMARY difficulty when choosing activities for your child?",
    instruction: "Please select ONE.",
    options: [
      "I'm unsure whether an activity matches my child's current developmental stage",
      "I'm unsure what my child is actually learning or developing through an activity",
      "I find conflicting information online",
      "There are too many toy/activity options, making it difficult to choose",
      "I don't have enough time to research and decide",
    ],
  },
  // ── Q4 ──────────────────────────────────────────────────────────────────────
  {
    id: "Q4",
    type: "single",
    text: "How do you currently decide what activities your child should do?",
    instruction: null,
    options: [
      "I follow my child's interests",
      "I search Google, YouTube or social media",
      "I ask teachers, family or other parents",
      "I use parenting/learning apps or resources",
      "I mostly decide spontaneously",
    ],
  },
  // ── Q5 ──────────────────────────────────────────────────────────────────────
  {
    id: "Q5",
    type: "single",
    text: "Which ONE would be most useful to you?",
    instruction: null,
    options: [
      "Personalized activities for my child",
      "Personalized toy recommendations",
      "Knowing what my child may need to develop next",
      "A personalized developmental roadmap",
      "Tracking my child's development and progress",
    ],
  },
  // ── Q6 ──────────────────────────────────────────────────────────────────────
  {
    id: "Q6",
    type: "single",
    text: "Which statement BEST describes you?",
    instruction: null,
    options: [
      "I mostly go with the flow and don't actively think about my child's development",
      "I have time, but I don't know what my child needs",
      "I generally know what my child needs, but finding the right activities is difficult",
      "I think about my child's development, but not in terms of specific skills",
      "I already have a good system for supporting my child's development",
    ],
  },
  // ── Q7 ──────────────────────────────────────────────────────────────────────
  {
    id: "Q7",
    type: "single",
    text: "How confident are you that you know what your child should be learning or practicing next?",
    instruction: null,
    options: [
      "Very confident",
      "Somewhat confident",
      "Not very confident",
      "Not confident at all",
      "I've never really thought about it",
    ],
  },
  // ── Q8 ──────────────────────────────────────────────────────────────────────
  {
    id: "Q8",
    type: "open",
    text: "If you could have ONE thing that would make supporting your child's play, learning or development easier, what would it be?",
    instruction: null,
    placeholder: "Write anything — there's no right answer here.",
  },
];

export const TOTAL_QUESTIONS = SURVEY_QUESTIONS.length; // 8
