import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

// ─── Simple in-memory IP rate limiter (max 3 submissions / hour / IP) ─────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_PER_HOUR = 3;
const ONE_HOUR_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + ONE_HOUR_MS });
    return false;
  }
  if (entry.count >= MAX_PER_HOUR) return true;
  entry.count += 1;
  return false;
}

// ─── POST /api/survey/submit ───────────────────────────────────────────────────
// Public endpoint — no auth required
// Body: { answers: { Q1..Q8: string }, name: string, email: string }
export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { answers, name, email } = body as {
      answers: Record<string, string>;
      name: string;
      email: string;
    };

    // Validate — Q1–Q7 must be present (Q8 is optional)
    if (
      !answers?.Q1 ||
      !answers?.Q2 ||
      !answers?.Q3 ||
      !answers?.Q4 ||
      !answers?.Q5 ||
      !answers?.Q6 ||
      !answers?.Q7
    ) {
      return NextResponse.json(
        { error: "Incomplete survey answers." },
        { status: 400 },
      );
    }

    // ── Google Sheets Auth ────────────────────────────────────────────────────
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!clientEmail || !privateKey) {
      console.error(
        "[survey/submit] GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY is missing",
      );
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 },
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // ── Sheet ID check ────────────────────────────────────────────────────────
    const sheetId = process.env.SURVEY_SHEET_ID;
    if (!sheetId) {
      console.error("[survey/submit] SURVEY_SHEET_ID env var is missing");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 },
      );
    }

    // ── Build row ─────────────────────────────────────────────────────────────
    const row = [
      new Date().toISOString(), // A: Timestamp
      name?.trim() || "Anonymous", // B: Name
      email?.trim() || "", // C: Email
      answers.Q1 || "", // D: Child Age
      answers.Q2 || "", // E: Biggest Concern
      answers.Q3 || "", // F: Primary Difficulty
      answers.Q4 || "", // G: How Decisions Made
      answers.Q5 || "", // H: Most Useful
      answers.Q6 || "", // I: Best Describes You
      answers.Q7 || "", // J: Confidence Level
      answers.Q8 || "", // K: Open Text
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:K",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[survey/submit] error:", err);
    return NextResponse.json(
      { error: "Internal error. Please try again." },
      { status: 500 },
    );
  }
}
