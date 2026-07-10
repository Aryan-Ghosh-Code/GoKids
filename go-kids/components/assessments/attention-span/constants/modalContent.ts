import {
  Brain,
  Zap,
  TrendingDown,
  RefreshCw,
  Flame,
  type LucideIcon,
} from "lucide-react";

// ─── Shared types ────────────────────────────────────────────────────────────

export interface FaqItem {
  q: string;
  a: string;
}

export interface ChipItem {
  icon: LucideIcon;
  label: string;
  color: string;
  bg: string;
}

export interface PartCard {
  label: string;
  desc: string;
  color: string;
  bg: string;
  who: "Child" | "Parent";
}

export interface AssessmentModalContent {
  /** Emoji shown in the modal header */
  emoji: string;
  /** Title shown in the modal header */
  title: string;
  /** Two short paragraphs for the "About" section */
  aboutParagraphs: string[];
  /** Dimension chips below the about text */
  chips: ChipItem[];
  /** 2×2 (or more) part cards */
  partCards: PartCard[];
  /** Human-readable total time string, e.g. "22–28 minutes · Child + Parent" */
  totalTime: string;
  /** FAQ accordion items */
  faqs: FaqItem[];
  /** One-line disclaimer text */
  disclaimerText: string;
  /** Consent checkbox label */
  consentLabel: string;
}

// ─── Attention Span Assessment content ───────────────────────────────────────

export const attentionSpanModalContent: AssessmentModalContent = {
  emoji: "🧠",
  title: "Attention Span Assessment",

  aboutParagraphs: [
    "The Go Kids Attention Assessment was developed after observing consistent attention-related patterns across Go Kids workshops with children. Three distinct types emerged: children who did not engage at all, children who were bored in routine tasks but lit up with stimulating content, and children who participated willingly throughout. A structured, multi-part tool was built to capture these differences properly.",
    "The assessment measures five dimensions of attention: sustained attention, impulse control, attention fatigue, attention recovery, and motivation-dependent attention. Together they produce a named attention profile; not just a score.",
  ],

  chips: [
    {
      icon: Brain,
      label: "Sustained Attention",
      color: "#2BBCB0",
      bg: "#E8F8F7",
    },
    { icon: Zap, label: "Impulse Control", color: "#F4845F", bg: "#FEF0EB" },
    {
      icon: TrendingDown,
      label: "Attention Fatigue",
      color: "#8B5CF6",
      bg: "#F3EEFF",
    },
    {
      icon: RefreshCw,
      label: "Attention Recovery",
      color: "#4FC3F7",
      bg: "#E8F6FE",
    },
    {
      icon: Flame,
      label: "Motivation-Dependent",
      color: "#F5C518",
      bg: "#FFF8DC",
    },
  ],

  partCards: [
    {
      label: "Part A: Digital Shape Task",
      desc: "Child alone. Shapes appear one at a time; tap only the target. Includes a mid-task star burst challenge. 6-8 minutes.",
      color: "#F4845F",
      bg: "#FFF9F7",
      who: "Child",
    },
    {
      label: "Part B: Child Self-Report",
      desc: "Ages 10-16 only. 6 questions about how the task felt. Skipped for ages 8-10. 3-4 minutes.",
      color: "#8B5CF6",
      bg: "#F5F3FF",
      who: "Child",
    },
    {
      label: "Part C: Parent Observation",
      desc: "12 questions across 4 clusters about your child's real-world attention at home. 8-10 minutes.",
      color: "#2BBCB0",
      bg: "#F3FDFC",
      who: "Parent",
    },
    {
      label: "Part D: Motivation Check",
      desc: "10 questions that separate genuine attention difficulty from motivation-dependent attention. 5 minutes.",
      color: "#F5C518",
      bg: "#FFFBEA",
      who: "Parent",
    },
  ],

  totalTime: "22-28 minutes · Child + Parent",

  faqs: [
    {
      q: "Is this an official or medically approved test?",
      a: "No, and we want to be clear about that. The Go Kids Attention Assessment was created from patterns we observed across our own workshops with children. It is not a published, clinically validated, or medically approved tool. It is meant to help parents understand their child better; nothing more.",
    },
    {
      q: "Who is this test for?",
      a: "Children aged 8-16. Questions and tasks are adapted to three age groups so the results feel relevant to where your child actually is right now.",
    },
    {
      q: "How long does it take?",
      a: "Around 20-25 minutes. Your child completes a short digital task on their own, then you answer a few questions based on what you see at home every day.",
    },
    {
      q: "What does it measure?",
      a: "We focus on three things we kept observing in our workshops: how long a child stays focused, how patient they are before giving up, and whether they think before they act. Your answers as a parent add the everyday context that a screen task alone can't capture.",
    },
    {
      q: "Will my child find it stressful?",
      a: "It's designed not to be. The task feels more like an activity than a test. There is no pass or fail, and your child won't see any scores while doing it.",
    },
    {
      q: "What do the results look like?",
      a: "You get a simple report straight away with one of three outcomes: Doing Well, Room to Improve, or Needs Attention, along with a plain-language breakdown of what each part of the assessment showed.",
    },
    {
      q: "What if the result says 'Needs Attention'?",
      a: "It means the assessment picked up patterns worth being aware of; not that something is wrong with your child. The report will suggest practical areas to focus on at home. However, if you have genuine concerns about your child's attention, learning, or behaviour, please consult a qualified child psychologist or paediatrician. This assessment is not a clinical tool and should not be used as the basis for any medical, educational, or diagnostic decision.",
    },
    {
      q: "Can I share the report with my child's school or teacher?",
      a: "We'd encourage you not to. This report is designed purely for your own understanding as a parent, to help you spot patterns, have better conversations at home, and take small steps that support your child. It is not a standardised or approved measure. Sharing it in a school or institutional setting could give it more weight than it is meant to carry.",
    },
    {
      q: "How often should we retest?",
      a: "If results pointed to improvement areas, we suggest waiting 8-12 weeks before retesting; ideally after you've tried some of the suggested steps at home. Retesting sooner than that is unlikely to show meaningful change",
    },
    {
      q: "Is this a replacement for professional advice?",
      a: "No. If you are concerned about your child's attention, behaviour, or learning in any serious way, please speak to a paediatrician or child psychologist. This assessment can help you feel more informed going into that conversation, but it is not a substitute for professional guidance.",
    },
  ],

  disclaimerText:
    "The Go Kids Attention Assessment is an independent tool created by the Go Kids team based on observations from our workshops. It is not a clinically validated, medically approved, or standardised psychological assessment. Results are intended for personal, informational use only. They do not constitute a diagnosis, a medical opinion, or a professional evaluation of any kind. No result from this assessment should be used to make decisions about your child's education, health, or wellbeing without first speaking to a qualified professional. Go Kids accepts no liability for decisions made based on assessment results. If you have concerns about your child's development, attention, or behaviour, we strongly encourage you to seek advice from a licensed child psychologist or paediatrician. By taking this assessment, you confirm that you understand and accept these terms.",

  consentLabel:
    "I have read and understood the information, structure, and disclaimer of this screening. I consent to begin the screening and proceed with the digital CPT task.",
};
