import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPTS } from "@/lib/chatbot/systemPrompts";
import type { AdSource } from "@/lib/chatbot/systemPrompts";

// ── Simple in-memory rate limiter (30 req/min per IP) ────────────────────────
const rateMap = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 30;
}

export async function POST(req: NextRequest) {
  // Rate limit
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 },
    );
  }

  // Parse body
  let body: { messages?: unknown; adSource?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { messages, adSource } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "messages array required" },
      { status: 400 },
    );
  }

  // Validate adSource — fall back to general
  const valid: AdSource[] = ["speed_writing", "bags", "toys", "general"];
  const source: AdSource = valid.includes(adSource as AdSource)
    ? (adSource as AdSource)
    : "general";

  // Check key
  const apiKey = process.env.CLAUDE_KEY;
  if (!apiKey) {
    console.error("[api/chat] CLAUDE_KEY is not set in .env");
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  // Call Anthropic — same model + token limit as index.js
  try {
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5", // same as index.js
        max_tokens: 300, // same as index.js
        system: SYSTEM_PROMPTS[source],
        messages,
      }),
    });

    if (!claudeRes.ok) {
      const err = await claudeRes.text();
      console.error("[api/chat] Anthropic error:", err);
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    }

    const data = await claudeRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[api/chat] Fetch failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
