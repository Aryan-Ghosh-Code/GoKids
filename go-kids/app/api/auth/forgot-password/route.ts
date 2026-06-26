import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { PasswordResetToken } from "@/lib/db/models/PasswordResetToken";
import {
  sendPasswordResetLinkEmail,
  sendGoogleAccountEmail,
} from "@/lib/auth/mailer";

// Generic response — always returned to the client regardless of outcome
// to prevent email enumeration attacks.
const GENERIC_OK = {
  success: true,
  data: {
    message:
      "If an account with that email exists, we've sent reset instructions.",
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    // Strict type check — prevents NoSQL injection via object payloads
    if (typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid data types provided." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.toLowerCase().trim();

    if (!trimmedEmail) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    // Strict email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: trimmedEmail });

    // ── Case 1: User not found — do nothing, return generic response ──────────
    if (!user) {
      return NextResponse.json(GENERIC_OK);
    }

    // ── Case 2: Google-only account — no password to reset ────────────────────
    if (user.provider === "google" && !user.passwordHash) {
      // Fire-and-forget — we don't await so response time doesn't leak account
      // existence, and we don't want email failure to surface an error.
      sendGoogleAccountEmail(user.email, user.name).catch((err) =>
        console.error("Google account email failed:", err)
      );
      return NextResponse.json(GENERIC_OK);
    }

    // ── Case 3: Local account — generate cryptographic reset token ────────────

    // Rate-limit: one token request per 60 seconds per user.
    // We check silently and return the generic response regardless, so an
    // attacker cannot infer account existence from different response codes.
    const recentToken = await PasswordResetToken.findOne({
      userId: user._id,
    }).sort({ createdAt: -1 });

    if (recentToken) {
      const secondsSinceLast =
        (Date.now() - recentToken.createdAt.getTime()) / 1000;
      if (secondsSinceLast < 60) {
        // Silently return generic success — no 429 (prevents enumeration)
        return NextResponse.json(GENERIC_OK);
      }
    }

    // Generate a cryptographically random 32-byte token
    const rawToken = crypto.randomBytes(32).toString("hex"); // 64 hex chars
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Invalidate any existing reset tokens for this user (single active token)
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Store only the hash — never the raw token
    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    // Build the reset link with the raw token in the query string
    const baseUrl = process.env.NEXTAUTH_URL;
    const resetLink = `${baseUrl}/reset-password?token=${rawToken}`;

    // Send the reset email (fire-and-forget to keep response time constant)
    sendPasswordResetLinkEmail(user.email, user.name, resetLink).catch((err) =>
      console.error("Reset password email failed:", err)
    );

    return NextResponse.json(GENERIC_OK);
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
