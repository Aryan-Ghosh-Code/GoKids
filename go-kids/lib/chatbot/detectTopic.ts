/**
 * components/chatbot/lib/detectTopic.ts
 * Pure utility functions — no side effects, no imports from outside this folder.
 */

import type { AdSource } from "./systemPrompts";

export function detectAdSource(message: string): AdSource {
  const msg = (message || "").toLowerCase();

  if (
    msg.includes("writing") ||
    msg.includes("speed") ||
    msg.includes("exam") ||
    msg.includes("handwriting") ||
    msg.includes("board")
  )
    return "speed_writing";

  if (
    msg.includes("bag") ||
    msg.includes("backpack") ||
    msg.includes("school bag")
  )
    return "bags";

  if (
    msg.includes("toy") ||
    msg.includes("play") ||
    msg.includes("gift") ||
    msg.includes("learning toy")
  )
    return "toys";

  return "general";
}

/** Mirrors detectInterest() from index.js */
export function detectInterest(
  message: string,
): "Demo" | "Buying" | "Callback" | "Not detected" {
  const msg = (message || "").toLowerCase();

  if (
    msg.includes("demo") ||
    msg.includes("trial") ||
    msg.includes("try") ||
    msg.includes("free class") ||
    msg.includes("sample")
  )
    return "Demo";

  if (
    msg.includes("buy") ||
    msg.includes("purchase") ||
    msg.includes("order") ||
    msg.includes("enroll") ||
    msg.includes("join") ||
    msg.includes("fee") ||
    msg.includes("price") ||
    msg.includes("how much")
  )
    return "Buying";

  if (
    msg.includes("call") ||
    msg.includes("contact") ||
    msg.includes("speak") ||
    msg.includes("callback") ||
    msg.includes("number") ||
    msg.includes("reach")
  )
    return "Callback";

  return "Not detected";
}

/** Mirrors isOptOut() from index.js */
const OPT_OUT_KEYWORDS = [
  "stop",
  "not interested",
  "no thanks",
  "no thank you",
  "dont contact",
  "don't contact",
  "unsubscribe",
  "remove me",
  "band karo",
  "mat bhejo",
  "nahi chahiye",
  "nahin chahiye",
  "mat karo",
  "rehne do",
  "chhodo",
];

export function isOptOut(text: string): boolean {
  const lower = (text || "").toLowerCase().trim();
  return OPT_OUT_KEYWORDS.some((k) => lower.includes(k));
}

/** Quick reply chips per topic — UI convenience for the chat bubble */
export const QUICK_REPLIES: Record<AdSource, string[]> = {
  speed_writing: [
    "What is the fee?",
    "Book a demo class",
    "My child is 10 years old",
    "How is this different from handwriting classes?",
  ],
  bags: [
    "Show me the bags",
    "Do you deliver to my city?",
    "What's the discount right now?",
  ],
  toys: [
    "What toys do you have?",
    "My child is 8 years old",
    "How do I order?",
  ],
  general: [
    "Tell me about Go Kids",
    "Speed Writing program details",
    "School bags — 25% off?",
    "Educational toys",
  ],
};
