import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { PasswordResetToken } from "@/lib/db/models/PasswordResetToken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = body;

    // Strict type checks — prevents NoSQL injection
    if (typeof token !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid data types provided." },
        { status: 400 }
      );
    }

    const trimmedToken = token.trim();

    if (!trimmedToken || !password) {
      return NextResponse.json(
        { success: false, error: "Token and new password are required." },
        { status: 400 }
      );
    }

    // Validate token format: must be exactly 64 lowercase hex characters
    // (32 random bytes encoded as hex). Reject anything else immediately.
    if (!/^[a-f0-9]{64}$/.test(trimmedToken)) {
      return NextResponse.json(
        { success: false, error: "Invalid or malformed reset token." },
        { status: 400 }
      );
    }

    // ── Password strength validation ──────────────────────────────────────────
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { success: false, error: "Password must contain at least one uppercase letter." },
        { status: 400 }
      );
    }
    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { success: false, error: "Password must contain at least one lowercase letter." },
        { status: 400 }
      );
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { success: false, error: "Password must contain at least one number." },
        { status: 400 }
      );
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must contain at least one special character.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Hash the incoming raw token to look it up in DB
    const tokenHash = crypto
      .createHash("sha256")
      .update(trimmedToken)
      .digest("hex");

    // Look up the stored (hashed) token record
    const tokenRecord = await PasswordResetToken.findOne({ tokenHash });

    // Generic rejection — same message for "not found" and "expired"
    // so an attacker can't distinguish the two states.
    if (!tokenRecord) {
      return NextResponse.json(
        {
          success: false,
          error: "This reset link is invalid or has already been used. Please request a new one.",
        },
        { status: 400 }
      );
    }

    if (tokenRecord.expiresAt < new Date()) {
      // Clean up the expired record
      await PasswordResetToken.deleteOne({ _id: tokenRecord._id });
      return NextResponse.json(
        {
          success: false,
          error: "This reset link has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // Fetch the associated user
    const user = await User.findById(tokenRecord.userId);
    if (!user) {
      await PasswordResetToken.deleteOne({ _id: tokenRecord._id });
      return NextResponse.json(
        { success: false, error: "User account not found." },
        { status: 404 }
      );
    }

    // ── Single-use enforcement: delete token BEFORE updating password ─────────
    // Deleting first means even if the password update fails midway, the token
    // is already gone and cannot be replayed.
    await PasswordResetToken.deleteOne({ _id: tokenRecord._id });

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(password, 12);

    // Update password and stamp passwordChangedAt (invalidates all active JWTs
    // issued before this moment — see authOptions.ts jwt callback).
    user.passwordHash = newPasswordHash;
    user.passwordChangedAt = new Date();

    // Mark email as verified in case it wasn't — a successful token validation
    // proves the user controls the inbox.
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        message:
          "Password reset successfully. You can now log in with your new password.",
      },
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
