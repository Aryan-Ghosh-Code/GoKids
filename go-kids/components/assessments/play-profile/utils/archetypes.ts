// ─── Play Profile Archetypes ──────────────────────────────────────────────────
// 6 archetypes for children aged 0–5, each with a signature dimension vector,
// description, traits, and tailored toy/activity recommendations.

import type { DimensionScores } from "./scoring";

export interface Archetype {
  key: string;
  name: string;
  tagline: string;
  emoji: string;
  color: string;
  bg: string;
  /** Normalised signature weights per dimension, used for matching */
  signature: DimensionScores;
  description: string;
  traits: string[];
  /** Toy & activity recommendations (6–8 items) */
  recommendations: Array<{
    label: string;
    icon: string;
    why: string;
  }>;
  /** Tips for parents */
  parentTips: string[];
}

export const ARCHETYPES: Archetype[] = [
  {
    key: "builder",
    name: "The Builder",
    tagline: "Focused, hands-on, and driven to make things.",
    emoji: "🧱",
    color: "#F4845F",
    bg: "#FFF5F2",
    signature: {
      persistence: 4,
      exploration: 0,
      expressiveness: -2,
      physicality: 2,
      social: -2,
    },
    description:
      "Builder children are deeply focused, hands-on learners who find their zone in physical construction. They can stay with a project far longer than other children their age, and they gain genuine satisfaction from making something that works. They don't need an audience — they play best in their own space, with time and materials at hand.",
    traits: [
      "Stays with one activity for extended periods",
      "Motivated by achieving a physical result",
      "Prefers to work independently without interruption",
      "Frustrated when builds are disrupted by others",
      "Quiet and focused during deep play",
    ],
    recommendations: [
      {
        label: "LEGO DUPLO & large interlocking blocks",
        icon: "🟧",
        why: "Supports structured construction and rewards persistence with visible outcomes.",
      },
      {
        label: "Magnetic tiles (Magna-Tiles, Connetix)",
        icon: "🔷",
        why: "Complex enough to sustain focus; instant visual feedback on each connection.",
      },
      {
        label: "Wooden unit blocks",
        icon: "🪵",
        why: "Open-ended and physically satisfying — the classic builder's material.",
      },
      {
        label: "Simple bolt-and-screw toys",
        icon: "🔩",
        why: "Develops fine motor control while feeding the need to assemble things.",
      },
      {
        label: "Jigsaw puzzles (age-appropriate)",
        icon: "🧩",
        why: "Structured problem-solving that rewards sustained effort over time.",
      },
      {
        label: "Sand and kinetic sand",
        icon: "🏖️",
        why: "Physical, tactile, and infinitely re-buildable — perfect for Builder hands.",
      },
    ],
    parentTips: [
      "Give them uninterrupted time — don't break their focus to show others what they made.",
      "Introduce more complex builds gradually as their skills grow.",
      "Let them leave works-in-progress out overnight; forcing tidy-up mid-build frustrates Builders deeply.",
    ],
  },
  {
    key: "explorer",
    name: "The Explorer",
    tagline: "Curious, novelty-seeking, and always discovering.",
    emoji: "🌿",
    color: "#2BBCB0",
    bg: "#F0FCFB",
    signature: {
      persistence: -2,
      exploration: 4,
      expressiveness: 0,
      physicality: 2,
      social: -1,
    },
    description:
      "Explorer children are driven by novelty and curiosity above everything else. They are not being inattentive when they move from one thing to the next — they are gathering information at high speed. Their wide-ranging interest in how things work, what things feel like, and what happens when you try something different is a genuine cognitive strength that just needs the right environment.",
    traits: [
      "Investigates new objects thoroughly before using them",
      "Finds creative, unexpected uses for familiar objects",
      "Moves quickly between activities — breadth over depth",
      "Drawn to variety and novel sensory input",
      "Gets restless with repetitive or routine play",
    ],
    recommendations: [
      {
        label: "Sensory bins (rice, lentils, water beads)",
        icon: "🫙",
        why: "Offers rich tactile novelty and endless discovery within a single container.",
      },
      {
        label: "Simple science kits for toddlers",
        icon: "🧪",
        why: "Structured novelty — each experiment is a new mini-discovery.",
      },
      {
        label: "Loose parts play (shells, stones, corks, tubes)",
        icon: "🐚",
        why: "Maximally open-ended; the Explorer can combine and recombine endlessly.",
      },
      {
        label: "Nature walks with a collection bag",
        icon: "🌱",
        why: "Outdoor exploration feeds curiosity with constant fresh stimulation.",
      },
      {
        label: "Pop-up books and novelty lift-the-flap books",
        icon: "📚",
        why: "Surprise on every page keeps the Explorer engaged and curious.",
      },
      {
        label: "Water play with funnels, tubes, and containers",
        icon: "💧",
        why: "Physics-based exploration that never gets dull — water always does something new.",
      },
    ],
    parentTips: [
      "Rotate toys frequently — novelty is more motivating than variety in the room.",
      "Let them follow tangents during play, even if it means 'not finishing' something.",
      "Outdoor and nature-based activities are especially energising for Explorer children.",
    ],
  },
  {
    key: "storyteller",
    name: "The Storyteller",
    tagline: "Imaginative, expressive, and lives in their inner world.",
    emoji: "📖",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    signature: {
      persistence: 0,
      exploration: -1,
      expressiveness: 4,
      physicality: -2,
      social: 2,
    },
    description:
      "Storyteller children narrate their world. Play is a stage, and every toy is a character with a name, a history, and something to say. They draw others into their imaginative worlds naturally and are often ahead of their peers in language, role-play complexity, and emotional understanding of characters. They need an audience — a parent who listens in, a sibling who plays along.",
    traits: [
      "Rich, ongoing pretend play with complex narratives",
      "Gives toys voices, names, and backstories",
      "Highly verbal — narrates constantly during play",
      "Naturally draws others into their imaginative world",
      "Sensitive to the 'mood' of a story or scene",
    ],
    recommendations: [
      {
        label: "Dollhouses and small world play sets",
        icon: "🏡",
        why: "Perfect stage for ongoing narratives with multiple characters.",
      },
      {
        label: "Puppets (hand puppets and finger puppets)",
        icon: "🧸",
        why: "Gives the Storyteller another 'voice' and an audience for their tales.",
      },
      {
        label: "Dress-up costumes and role-play accessories",
        icon: "👑",
        why: "Transforms their body into a character — Storytellers love becoming someone else.",
      },
      {
        label: "Illustrated story books (especially with dialogue)",
        icon: "📕",
        why: "Feeds their narrative appetite and grows their vocabulary of stories.",
      },
      {
        label: "Play kitchens and role-play sets (doctor, shop)",
        icon: "🍳",
        why: "Real-world role-play scenarios for layered, continuing stories.",
      },
      {
        label: "Drawing and painting (to illustrate their stories)",
        icon: "🎨",
        why: "Externalises the inner story world — many Storytellers are also artists.",
      },
    ],
    parentTips: [
      "Be an audience — let them narrate their play to you even if you are doing other things.",
      "Ask open questions: 'What happens next?' or 'What is that character feeling?'",
      "Storytellers often prefer a play companion over solo toys — siblings and playdates matter.",
    ],
  },
  {
    key: "director",
    name: "The Director",
    tagline: "Organised, social, and born to lead the play.",
    emoji: "🎬",
    color: "#F5C518",
    bg: "#FFFBEA",
    signature: {
      persistence: 2,
      exploration: -2,
      expressiveness: 2,
      physicality: -1,
      social: 4,
    },
    description:
      "Director children organise the world around them. They don't just want to play — they want to choreograph. They assign roles, establish rules, and keep play on track toward a vision only they fully see. This can sometimes cause friction with peers who don't share their agenda, but in the right environment it's the seed of extraordinary leadership and social confidence.",
    traits: [
      "Naturally assigns roles and organises group play",
      "Has a strong internal vision for how play 'should' go",
      "Persistent — will advocate firmly for their ideas",
      "Social and motivated by the presence of others",
      "Expressive and comfortable giving instructions",
    ],
    recommendations: [
      {
        label: "Board games and cooperative group games",
        icon: "🎲",
        why: "Structured social play with rules — the Director's ideal environment.",
      },
      {
        label: "Play sets with multiple figures (farm, city, castle)",
        icon: "🏰",
        why: "Multiple characters to direct; a world to organise.",
      },
      {
        label: "Costume and prop sets for group pretend play",
        icon: "🎭",
        why: "Provides the 'cast' and 'wardrobe' for the Director's productions.",
      },
      {
        label: "Simple card games (snap, matching games)",
        icon: "🃏",
        why: "Teaches turn-taking and rule-following within social play.",
      },
      {
        label: "Building sets that produce a 'stage' (tracks, roads)",
        icon: "🚂",
        why: "A collaborative build that then becomes the scene for directed play.",
      },
      {
        label: "Playdates and small group activities",
        icon: "👫",
        why: "Directors thrive with real people — this is where their strengths shine.",
      },
    ],
    parentTips: [
      "Let them organise play sessions — resist the urge to redirect their plans.",
      "Gently introduce taking turns as Director; others need a role too.",
      "Channel their energy into group activities, playdates, and team-based games.",
    ],
  },
  {
    key: "investigator",
    name: "The Investigator",
    tagline: "Observant, methodical, and endlessly analytical.",
    emoji: "🔍",
    color: "#4FC3F7",
    bg: "#EBF8FF",
    signature: {
      persistence: 2,
      exploration: 4,
      expressiveness: -2,
      physicality: -2,
      social: 0,
    },
    description:
      "Investigator children examine the world with the patience of a scientist. They are not passive observers — they are deeply, quietly engaged. They will spend longer than any other archetype looking at a single object, testing a single idea, or figuring out exactly how something works. They tend to be quieter and less physically active during play, but what is happening internally is rich and complex.",
    traits: [
      "Spends long periods examining a single object or mechanism",
      "Notices details others walk past",
      "Prefers understanding over action",
      "Quiet, focused, and internally motivated",
      "Can find social interruptions during deep investigation disruptive",
    ],
    recommendations: [
      {
        label: "Magnifying glasses and simple nature observation kits",
        icon: "🔬",
        why: "Gives Investigators a tool that matches their instinct — look closer.",
      },
      {
        label: "Sorting and categorisation toys (shape sorters, colour sets)",
        icon: "🟡",
        why: "Structured by logic — deeply satisfying for the Investigator mind.",
      },
      {
        label: "Simple mechanism toys (cogs, gears, pulleys)",
        icon: "⚙️",
        why: "There is something to figure out — and they will figure it out.",
      },
      {
        label: "Age-appropriate science books and 'how things work' books",
        icon: "📗",
        why: "Visual explanations of cause and effect feed their analytical appetite.",
      },
      {
        label: "Puzzles with increasing complexity",
        icon: "🧩",
        why: "Systematic, logic-driven problem solving — a natural fit.",
      },
      {
        label: "Ant farms, growing kits, or observation terrariums",
        icon: "🐛",
        why: "A living, slow-changing subject to observe over days and weeks.",
      },
    ],
    parentTips: [
      "Don't rush them — an Investigator examining something intently is doing important work.",
      "Ask 'What do you think will happen if…?' to deepen their thinking.",
      "They often don't need more toys; they need more time with fewer, richer objects.",
    ],
  },
  {
    key: "whirlwind",
    name: "The Whirlwind",
    tagline: "High-energy, sensory-driven, and always in motion.",
    emoji: "🌀",
    color: "#F4845F",
    bg: "#FEF0EB",
    signature: {
      persistence: -4,
      exploration: 0,
      expressiveness: 2,
      physicality: 4,
      social: 1,
    },
    description:
      "Whirlwind children experience the world through their bodies. They are not disobedient — they are sensory-seekers who process input through movement, touch, and physical experience. Their energy is not a problem to be managed; it is a learning style that requires outlets, not suppression. The right environment channels this into rich, joyful, and deeply developmental play.",
    traits: [
      "Constant movement — running, jumping, spinning, climbing",
      "Highly sensory — loves messy, tactile, and physical experiences",
      "Shifts quickly between activities seeking new physical input",
      "Expressive and loud during play",
      "Thrives in open, outdoor spaces",
    ],
    recommendations: [
      {
        label: "Outdoor play equipment (swings, slides, climbing frames)",
        icon: "🛝",
        why: "Gross motor movement is their primary learning channel — outdoor time is non-negotiable.",
      },
      {
        label: "Sensory play (water table, mud kitchen, sand)",
        icon: "🌊",
        why: "Multi-sensory input is deeply regulating for Whirlwind children.",
      },
      {
        label: "Balance boards, stepping stones, obstacle courses",
        icon: "🪨",
        why: "Channels physical energy into proprioceptive, controlled movement.",
      },
      {
        label: "Dance and movement activities (freeze dance, action songs)",
        icon: "💃",
        why: "Structured movement with an expressive outlet — a Whirlwind's sweet spot.",
      },
      {
        label: "Crash pads, cushion pits, and safe rough-and-tumble zones",
        icon: "🛋️",
        why: "Gives safe physical impact that satisfies deep sensory needs.",
      },
      {
        label: "Balls of all sizes (kicking, throwing, rolling)",
        icon: "⚽",
        why: "Simple, infinitely energetic play that requires nothing but space.",
      },
    ],
    parentTips: [
      "Prioritise outdoor time every day — an indoor Whirlwind is a frustrated Whirlwind.",
      "Before quiet activities, give them 10 minutes of active play first.",
      "Sensory activities like water or sand play are deeply calming for physical children.",
    ],
  },
];

/** Find the best-matching archetype for a given set of dimension scores */
export function matchArchetype(scores: DimensionScores): Archetype {
  let bestMatch = ARCHETYPES[0];
  let bestScore = -Infinity;

  for (const archetype of ARCHETYPES) {
    const dotProduct =
      scores.persistence * archetype.signature.persistence +
      scores.exploration * archetype.signature.exploration +
      scores.expressiveness * archetype.signature.expressiveness +
      scores.physicality * archetype.signature.physicality +
      scores.social * archetype.signature.social;

    if (dotProduct > bestScore) {
      bestScore = dotProduct;
      bestMatch = archetype;
    }
  }

  return bestMatch;
}
