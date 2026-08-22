import {
  Puzzle,
  Baby,
  Star,
  Sparkles,
  Heart,
  type LucideIcon,
} from "lucide-react";
import type { AssessmentModalContent } from "@/components/assessments/attention-span/constants/modalContent";

// ─── Play Profile Modal Content ───────────────────────────────────────────────

export const playProfileModalContent: AssessmentModalContent = {
  emoji: "🧩",
  title: "Child Play Profile Survey",

  aboutParagraphs: [
    "The Go Kids Play Profile Survey is a short parent-completed questionnaire designed for children aged 0–5. It takes under 5 minutes and produces a named Play Profile archetype — a simple, practical summary of how your child naturally prefers to play.",
    "Unlike the Attention Span Assessment, there is no digital task and no timer. This is entirely answered by you, based on what you observe at home every day. The result gives you a named play style — with tailored toy and activity recommendations that fit your child's natural strengths.",
  ],

  chips: [
    {
      icon: Star as LucideIcon,
      label: "Persistence",
      color: "#D4A900",
      bg: "#FFF8DC",
    },
    {
      icon: Sparkles as LucideIcon,
      label: "Curiosity",
      color: "#2BBCB0",
      bg: "#E8F8F7",
    },
    {
      icon: Heart as LucideIcon,
      label: "Expressiveness",
      color: "#8B5CF6",
      bg: "#F3EEFF",
    },
    {
      icon: Baby as LucideIcon,
      label: "Physicality",
      color: "#F4845F",
      bg: "#FEF0EB",
    },
    {
      icon: Puzzle as LucideIcon,
      label: "Social Style",
      color: "#4FC3F7",
      bg: "#E8F6FE",
    },
  ],

  partCards: [
    {
      label: "10 Quick Questions",
      desc: "All answered by you, the parent. Think about your child's typical everyday behaviour — not just the best or worst days.",
      color: "#2BBCB0",
      bg: "#F3FDFC",
      who: "Parent",
    },
    {
      label: "Your Child's Play Profile",
      desc: "Instantly get a named archetype — Builder, Explorer, Storyteller, and more — with an explanation of what it means.",
      color: "#F5C518",
      bg: "#FFFBEA",
      who: "Parent",
    },
    {
      label: "Toy & Activity Recommendations",
      desc: "Each profile comes with 6 specific toy and activity suggestions matched to your child's natural play style.",
      color: "#8B5CF6",
      bg: "#F5F3FF",
      who: "Parent",
    },
    {
      label: "Dimension Breakdown",
      desc: "See how your child scores across 5 dimensions: persistence, curiosity, expressiveness, physicality, and social style.",
      color: "#F4845F",
      bg: "#FFF9F7",
      who: "Parent",
    },
  ],

  totalTime: "Under 5 minutes · Parent only",

  faqs: [
    {
      q: "Is this an official or clinically validated assessment?",
      a: "No. This is a parent-observation survey created by the Go Kids team based on play patterns we have observed with young children. It is not a clinical tool and should not be used to make any diagnostic or developmental decisions.",
    },
    {
      q: "Who is this survey for?",
      a: "Children aged 0–5. The questions are based on play behaviours typical of this age group. If your child is older, the Attention Span Assessment is likely a better fit.",
    },
    {
      q: "What if my child doesn't seem to fit one archetype?",
      a: "Many children will show strong traits from more than one archetype. The result shows your highest match, but the dimension breakdown will reveal any blend. This is completely normal — archetypes are useful shorthand, not rigid categories.",
    },
    {
      q: "Can I retake the survey?",
      a: "Yes, and we encourage it. Children's play styles shift considerably between 0 and 5. Retaking every 6 months or after a major change at home can surface useful new patterns.",
    },
    {
      q: "What do the toy recommendations mean?",
      a: "They are specific suggestions matched to how your child naturally engages with play. They are not prescriptive — they are a starting point. What matters is finding activities that feel natural and engaging for your specific child.",
    },
    {
      q: "Should I answer based on how I want my child to play or how they actually play?",
      a: "Always based on how they actually play. The survey is most useful when answered honestly about observed behaviour — not aspirations. There are no 'good' or 'bad' archetypes.",
    },
  ],

  disclaimerText:
    "The Go Kids Play Profile Survey is a parent-observation tool created by the Go Kids team. It is not clinically validated, medically approved, or a standardised developmental assessment. Results are intended for personal, informational use only and do not constitute a diagnosis or professional opinion of any kind. If you have concerns about your child's development, please consult a qualified paediatrician or child development specialist.",

  consentLabel:
    "I understand that this is a parent-observation survey, not a clinical assessment. I will answer based on my child's typical real-world behaviour and accept that results are for personal use only.",
};
