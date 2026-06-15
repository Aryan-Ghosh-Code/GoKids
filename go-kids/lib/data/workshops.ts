// ─── Workshop Data Layer ───────────────────────────────────────────────────────
//
// Currently backed by a static constants array.
// TODO: Replace helper functions with MongoDB queries when ready:
//
//   import { connectDB } from "@/lib/db/mongoose";
//   import WorkshopModel from "@/lib/db/models/Workshop";
//
//   export async function getWorkshops(filters?) {
//     await connectDB();
//     return WorkshopModel.find(buildQuery(filters)).lean();
//   }
//   export async function getWorkshopBySlug(slug: string) {
//     await connectDB();
//     return WorkshopModel.findOne({ slug }).lean();
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WorkshopLesson {
  title: string;
  duration: string; // e.g. "30 min"
}

export interface WorkshopSection {
  title: string;
  lessons: WorkshopLesson[];
}

export interface WorkshopReview {
  author: string;
  rating: number; // 1–5
  comment: string;
  date: string;
}

export interface WorkshopInstructor {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  experience: string;
}

export interface Workshop {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  instructor: WorkshopInstructor;
  thumbnail: string;
  ageGroup: string;      // e.g. "9–11"
  level: "Beginner" | "Intermediate" | "Advanced";
  skill: string;         // e.g. "Coding", "Mathematics"
  category: string;      // used for filter grouping
  duration: string;      // e.g. "4 Weeks"
  sessions: number;
  isFree: boolean;
  price?: number;
  enrolledCount: number;
  rating: number;
  highlights: string[];  // bullet points for Overview tab
  requirements: string[];
  tags: string[];
  curriculum: WorkshopSection[];
  reviews: WorkshopReview[];
}

export type WorkshopFilters = {
  level?: string[];
  ageGroup?: string[];
  skill?: string[];
  query?: string;
  sort?: "popular" | "newest" | "rating";
};

// ─── Seed Data ────────────────────────────────────────────────────────────────

export const WORKSHOPS: Workshop[] = [
  // ── 1 ──────────────────────────────────────────────────────────────────────
  {
    id: "1",
    slug: "code-your-first-game",
    title: "Code Your First Game",
    shortDescription:
      "Build a fun, playable Scratch game from scratch — no experience needed!",
    longDescription:
      "In this workshop your child will journey from zero to game designer in just 4 weeks. Using Scratch, the world's most popular block-based coding platform, they'll learn real programming concepts — loops, events, conditionals, variables — all while building a game they'll actually want to play. Every session is hands-on, every lesson ends with something visible on screen. Designed for complete beginners.",
    instructor: {
      name: "Priya Sharma",
      title: "Software Engineer & Kids Coding Coach",
      bio: "Priya has 8+ years of experience teaching coding to children across 12+ schools in Bengaluru and Pune. She specialises in making abstract programming concepts visual, tangible, and fun for children aged 8–14.",
      avatar:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop&q=80",
      experience: "8+ years",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop&q=80",
    ageGroup: "9–11",
    level: "Beginner",
    skill: "Coding",
    category: "Technology",
    duration: "4 Weeks",
    sessions: 8,
    isFree: true,
    enrolledCount: 342,
    rating: 4.8,
    highlights: [
      "Build a complete, shareable Scratch game",
      "Understand loops, events, and conditionals",
      "Learn computational thinking step-by-step",
      "Certificate of completion on finishing",
    ],
    requirements: [
      "A laptop, desktop, or tablet with a browser",
      "A free Scratch account (we'll help you create one)",
      "No prior coding experience needed",
    ],
    tags: ["Scratch", "Game Design", "Block Coding"],
    curriculum: [
      {
        title: "Week 1 — Hello, Scratch!",
        lessons: [
          { title: "What is Scratch and why it's awesome", duration: "20 min" },
          { title: "Your first sprite & the stage", duration: "30 min" },
          { title: "Making things move with events", duration: "25 min" },
          { title: "Mini project: Animated greeting card", duration: "20 min" },
        ],
      },
      {
        title: "Week 2 — Game Logic",
        lessons: [
          { title: "Loops — repeat forever vs. repeat N", duration: "30 min" },
          { title: "If-Else: Making decisions in code", duration: "35 min" },
          { title: "Keeping score with variables", duration: "25 min" },
          { title: "Challenge: Add a timer to your game", duration: "20 min" },
        ],
      },
      {
        title: "Week 3 — Polish & Design",
        lessons: [
          { title: "Backgrounds, costumes & animations", duration: "30 min" },
          { title: "Sound effects & music", duration: "20 min" },
          { title: "Game Over & win screens", duration: "25 min" },
          { title: "Playtesting with a partner", duration: "15 min" },
        ],
      },
      {
        title: "Week 4 — Ship It!",
        lessons: [
          { title: "Testing & squashing bugs", duration: "35 min" },
          { title: "Publishing your game to the world", duration: "20 min" },
          { title: "Show & Tell — share with parents", duration: "30 min" },
          { title: "What's next: next steps in coding", duration: "15 min" },
        ],
      },
    ],
    reviews: [
      {
        author: "Asha M.",
        rating: 5,
        comment:
          "My son absolutely loved it! He finished his first game and couldn't stop showing it off. Priya is incredibly patient.",
        date: "March 2025",
      },
      {
        author: "Rajan P.",
        rating: 5,
        comment:
          "Brilliant instructor. Explains things with great clarity. My daughter went from zero to building her own game in a month.",
        date: "Feb 2025",
      },
      {
        author: "Neha K.",
        rating: 4,
        comment:
          "Great content overall. Would love even more advanced follow-up workshops for kids who want to continue!",
        date: "Jan 2025",
      },
    ],
  },

  // ── 2 ──────────────────────────────────────────────────────────────────────
  {
    id: "2",
    slug: "math-magic-tricks-puzzles",
    title: "Math Magic: Tricks & Puzzles",
    shortDescription:
      "Transform maths anxiety into genuine curiosity through puzzles, games, and mind tricks.",
    longDescription:
      "Most children think maths is about memorising formulas. This workshop flips that belief. Over 4 weeks your child will explore number patterns, mental math shortcuts, and logic puzzles that make the subject feel like magic. Sessions blend storytelling with problem-solving — every concept is grounded in something real, visual, and surprising.",
    instructor: {
      name: "Arjun Iyer",
      title: "Maths Educator & Olympiad Coach",
      bio: "Arjun has coached 50+ students to national-level Maths Olympiad success. He runs the 'Joy of Numbers' programme across schools in Chennai and has a gift for making abstract arithmetic click instantly.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80",
      experience: "10+ years",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=340&fit=crop&q=80",
    ageGroup: "8–10",
    level: "Beginner",
    skill: "Mathematics",
    category: "Core Academics",
    duration: "3 Weeks",
    sessions: 6,
    isFree: true,
    enrolledCount: 518,
    rating: 4.9,
    highlights: [
      "Mental maths shortcuts that work at any school level",
      "Logic puzzles that build real problem-solving skills",
      "Weekly 'Math Magic' show for parents",
      "Printable puzzle book included",
    ],
    requirements: [
      "Pen, paper, and a curious mind",
      "Basic addition and subtraction (Grade 2+)",
    ],
    tags: ["Mental Math", "Puzzles", "Number Sense"],
    curriculum: [
      {
        title: "Week 1 — Number Tricks",
        lessons: [
          { title: "The 9 trick & why it works", duration: "25 min" },
          { title: "Multiplying by 11, 99, 101", duration: "30 min" },
          { title: "Square numbers in your head", duration: "25 min" },
        ],
      },
      {
        title: "Week 2 — Logic & Patterns",
        lessons: [
          { title: "Fibonacci & nature's patterns", duration: "30 min" },
          { title: "Grid puzzles & Sudoku thinking", duration: "35 min" },
          { title: "The Tower of Hanoi mystery", duration: "25 min" },
        ],
      },
      {
        title: "Week 3 — Maths Puzzles Showdown",
        lessons: [
          { title: "Cryptarithmetic problems", duration: "30 min" },
          { title: "River-crossing & logic puzzles", duration: "35 min" },
          { title: "Final puzzle battle", duration: "30 min" },
        ],
      },
    ],
    reviews: [
      {
        author: "Sunita V.",
        rating: 5,
        comment:
          "My daughter used to cry before maths class. After this workshop she asks for 'one more puzzle'. Truly life-changing.",
        date: "April 2025",
      },
      {
        author: "Deepak R.",
        rating: 5,
        comment: "Arjun is a phenomenal teacher. My son scored 90% in his next maths test after this.",
        date: "March 2025",
      },
    ],
  },

  // ── 3 ──────────────────────────────────────────────────────────────────────
  {
    id: "3",
    slug: "young-scientists-lab",
    title: "Young Scientists Lab",
    shortDescription:
      "Conduct real experiments at home and discover how the world actually works.",
    longDescription:
      "Science isn't in textbooks — it's in your kitchen, your garden, and your everyday life. In this hands-on workshop, children conduct 12+ real experiments using household materials, guided by our science educator. They'll explore physics, chemistry, and biology through discovery, not memorisation. Every session ends with an 'Aha!' moment.",
    instructor: {
      name: "Dr. Meena Krishnaswamy",
      title: "PhD Biochemistry, STEM Educator",
      bio: "Dr. Meena holds a PhD in Biochemistry from IISc and has designed STEM curriculum for 20+ schools. She's passionate about making children fall in love with asking 'Why?'",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&q=80",
      experience: "12+ years",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=340&fit=crop&q=80",
    ageGroup: "10–12",
    level: "Intermediate",
    skill: "Science",
    category: "STEM",
    duration: "6 Weeks",
    sessions: 12,
    isFree: true,
    enrolledCount: 276,
    rating: 4.7,
    highlights: [
      "12+ hands-on experiments with household materials",
      "Covers Physics, Chemistry, and Biology",
      "Experiment journal printable included",
      "Science fair project guidance in final week",
    ],
    requirements: [
      "Basic household materials (list provided before each session)",
      "Curiosity and willingness to make a mess!",
    ],
    tags: ["Experiments", "STEM", "Physics", "Chemistry"],
    curriculum: [
      {
        title: "Week 1–2 — Forces & Motion",
        lessons: [
          { title: "Balloon rocket physics", duration: "45 min" },
          { title: "Egg drop challenge", duration: "40 min" },
          { title: "Newton's cradle at home", duration: "35 min" },
          { title: "Paper bridge load test", duration: "40 min" },
        ],
      },
      {
        title: "Week 3–4 — Chemistry at Home",
        lessons: [
          { title: "Baking soda volcano (and why it works)", duration: "40 min" },
          { title: "Chromatography with markers", duration: "35 min" },
          { title: "pH indicators from cabbage juice", duration: "45 min" },
          { title: "Non-Newtonian fluid (oobleck!)", duration: "40 min" },
        ],
      },
      {
        title: "Week 5–6 — Biology & Life Science",
        lessons: [
          { title: "Grow your own crystals", duration: "40 min" },
          { title: "Dissecting a flower (virtual)", duration: "35 min" },
          { title: "Science fair project planning", duration: "50 min" },
          { title: "Presentation & peer review", duration: "45 min" },
        ],
      },
    ],
    reviews: [
      {
        author: "Preethi N.",
        rating: 5,
        comment:
          "My son dragged me to the kitchen every Saturday for 'science time'. The cabbage pH experiment is now a dinner party trick!",
        date: "May 2025",
      },
      {
        author: "Vikram S.",
        rating: 4,
        comment:
          "Dr. Meena makes science so accessible. My daughter now wants to be a scientist. A few experiments needed harder-to-find materials.",
        date: "April 2025",
      },
    ],
  },

  // ── 4 ──────────────────────────────────────────────────────────────────────
  {
    id: "4",
    slug: "creative-storytelling",
    title: "Creative Storytelling Workshop",
    shortDescription:
      "Help your child find their voice and craft stories that captivate any audience.",
    longDescription:
      "Every child has a story inside them. This workshop gives them the tools to tell it. Over 5 sessions, children explore the building blocks of great stories — character, conflict, setting, plot, and voice — through games, prompts, and guided writing. By the final session, every child has a complete story they're proud of.",
    instructor: {
      name: "Kavitha Nair",
      title: "Children's Author & Creative Writing Teacher",
      bio: "Kavitha is the author of three published children's books and has run creative writing workshops for 1,000+ children across India. Her workshops are celebrated for creating an environment where every child feels heard.",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&q=80",
      experience: "9+ years",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=340&fit=crop&q=80",
    ageGroup: "7–9",
    level: "Beginner",
    skill: "Language Arts",
    category: "Creative Arts",
    duration: "3 Weeks",
    sessions: 5,
    isFree: true,
    enrolledCount: 429,
    rating: 4.9,
    highlights: [
      "Write and finish a complete original story",
      "Build vocabulary & descriptive language skills",
      "Story read-aloud session for family",
      "Illustrated story booklet (printable) included",
    ],
    requirements: [
      "A notebook and pencil or tablet for writing",
      "No prior writing experience needed",
    ],
    tags: ["Writing", "Storytelling", "Creativity", "English"],
    curriculum: [
      {
        title: "Week 1 — The Story World",
        lessons: [
          { title: "What makes a great story? (Story anatomy)", duration: "25 min" },
          { title: "Building your protagonist", duration: "30 min" },
          { title: "Creating a world that feels real", duration: "25 min" },
        ],
      },
      {
        title: "Week 2 — Conflict & Plot",
        lessons: [
          { title: "The magic of conflict", duration: "30 min" },
          { title: "Plot structure: Beginning, Muddle, End", duration: "35 min" },
          { title: "Writing your first draft", duration: "40 min" },
        ],
      },
      {
        title: "Week 3 — Polish & Perform",
        lessons: [
          { title: "Editing: making every word count", duration: "30 min" },
          { title: "Read-aloud: sharing your story", duration: "25 min" },
        ],
      },
    ],
    reviews: [
      {
        author: "Ananya T.",
        rating: 5,
        comment:
          "My 8-year-old wrote a 12-page story about a flying elephant detective. Kavitha made her believe she could do it. She did!",
        date: "May 2025",
      },
      {
        author: "Ritu M.",
        rating: 5,
        comment:
          "Absolutely brilliant. My shy child confidently read her story aloud to the family. I cried happy tears.",
        date: "April 2025",
      },
    ],
  },

  // ── 5 ──────────────────────────────────────────────────────────────────────
  {
    id: "5",
    slug: "chess-critical-thinking",
    title: "Chess & Critical Thinking",
    shortDescription:
      "Learn chess from fundamentals to strategy — and sharpen how your child thinks.",
    longDescription:
      "Chess is more than a game — it's a training ground for patience, strategic thinking, and resilience. This workshop teaches chess from the very basics (how each piece moves) all the way to opening strategies and tactical patterns. Along the way, children develop skills that transfer directly to school: focus, planning ahead, and learning from mistakes.",
    instructor: {
      name: "Sameer Kulkarni",
      title: "FIDE-rated Chess Player & Coach",
      bio: "Sameer is a FIDE-rated chess player who has coached 200+ children including 3 national champions. He developed the 'Chess for Schools' programme adopted by 15 schools across Maharashtra.",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80",
      experience: "7+ years",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&h=340&fit=crop&q=80",
    ageGroup: "10–14",
    level: "Intermediate",
    skill: "Chess",
    category: "Logic & Strategy",
    duration: "4 Weeks",
    sessions: 8,
    isFree: true,
    enrolledCount: 197,
    rating: 4.8,
    highlights: [
      "Learn all piece movements and basic rules",
      "Understand 3 key opening principles",
      "Recognise and execute 5 tactical patterns",
      "End with a mini-tournament against peers",
    ],
    requirements: [
      "A chess set (physical or online at chess.com — free)",
      "No chess experience needed",
    ],
    tags: ["Chess", "Strategy", "Focus", "Logic"],
    curriculum: [
      {
        title: "Week 1 — The Board & the Pieces",
        lessons: [
          { title: "How the board is set up", duration: "20 min" },
          { title: "Every piece: movement & power", duration: "40 min" },
          { title: "Check, Checkmate, and Stalemate", duration: "30 min" },
          { title: "Your first full game", duration: "25 min" },
        ],
      },
      {
        title: "Week 2 — Opening Principles",
        lessons: [
          { title: "Control the center", duration: "30 min" },
          { title: "Develop your pieces fast", duration: "30 min" },
          { title: "King safety & castling", duration: "35 min" },
          { title: "Play 3 opening practice games", duration: "30 min" },
        ],
      },
      {
        title: "Week 3 — Tactics",
        lessons: [
          { title: "Forks & double attacks", duration: "35 min" },
          { title: "Pins, skewers, and discovered attacks", duration: "40 min" },
          { title: "Solving 20 tactics puzzles", duration: "35 min" },
          { title: "Back-rank checkmate patterns", duration: "30 min" },
        ],
      },
      {
        title: "Week 4 — Tournament",
        lessons: [
          { title: "Game analysis: learning from losses", duration: "35 min" },
          { title: "Mini tournament Round 1 & 2", duration: "45 min" },
          { title: "Mini tournament Final + Awards", duration: "45 min" },
          { title: "Next steps in chess", duration: "20 min" },
        ],
      },
    ],
    reviews: [
      {
        author: "Kiran B.",
        rating: 5,
        comment:
          "My son beat me for the first time ever after this workshop. He was more excited than I've ever seen him. Sameer is an incredible coach.",
        date: "March 2025",
      },
      {
        author: "Pooja D.",
        rating: 5,
        comment:
          "The tactical puzzles section was superb. My daughter's patience and focus at school have noticeably improved.",
        date: "March 2025",
      },
    ],
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────
// TODO: Replace these with async DB queries when MongoDB is connected.

export function getWorkshops(filters?: WorkshopFilters): Workshop[] {
  let result = [...WORKSHOPS];

  if (filters?.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.shortDescription.toLowerCase().includes(q) ||
        w.skill.toLowerCase().includes(q),
    );
  }
  if (filters?.level?.length) {
    result = result.filter((w) => filters.level!.includes(w.level));
  }
  if (filters?.ageGroup?.length) {
    result = result.filter((w) => filters.ageGroup!.includes(w.ageGroup));
  }
  if (filters?.skill?.length) {
    result = result.filter((w) => filters.skill!.includes(w.skill));
  }

  // Sort
  if (filters?.sort === "rating") {
    result.sort((a, b) => b.rating - a.rating);
  } else if (filters?.sort === "popular") {
    result.sort((a, b) => b.enrolledCount - a.enrolledCount);
  }
  // "newest" = insertion order (default)

  return result;
}

export function getWorkshopBySlug(slug: string): Workshop | undefined {
  return WORKSHOPS.find((w) => w.slug === slug);
}

export function getAllSlugs(): string[] {
  return WORKSHOPS.map((w) => w.slug);
}

// ─── Filter Option Helpers ────────────────────────────────────────────────────

export const FILTER_AGE_GROUPS = [...new Set(WORKSHOPS.map((w) => w.ageGroup))];
export const FILTER_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
export const FILTER_SKILLS = [...new Set(WORKSHOPS.map((w) => w.skill))];
