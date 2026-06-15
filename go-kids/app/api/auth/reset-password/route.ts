import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { OtpToken } from "@/lib/db/models/OtpToken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, password } = body;

    // Strict NoSQL injection type checks
    if (
      typeof email !== "string" ||
      typeof otp !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid data types provided." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.toLowerCase().trim();
    const trimmedOtp = otp.trim();

    if (!trimmedEmail || !trimmedOtp || !password) {
      return NextResponse.json(
        { success: false, error: "Email, OTP, and new password are required." },
        { status: 400 }
      );
    }

    // Backend password strength checks
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
        { success: false, error: "Password must contain at least one special character." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    // Find the latest OTP token for this user
    const tokenRecord = await OtpToken.findOne({ userId: user._id }).sort({ createdAt: -1 });

    if (!tokenRecord) {
      return NextResponse.json(
        { success: false, error: "OTP not found. Please request a new code." },
        { status: 400 }
      );
    }

    if (tokenRecord.expiresAt < new Date()) {
      await OtpToken.deleteMany({ userId: user._id });
      return NextResponse.json(
        { success: false, error: "OTP has expired. Please request a new code." },
        { status: 400 }
      );
    }

    const providedHash = crypto.createHash("sha256").update(trimmedOtp).digest("hex");
    if (providedHash !== tokenRecord.tokenHash) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(password, 12);

    // Update password
    user.passwordHash = newPasswordHash;
    // Make sure user is verified if they reset their password successfully
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
    }
    await user.save();

    // Delete used tokens
    await OtpToken.deleteMany({ userId: user._id });

    return NextResponse.json({
      success: true,
      data: { message: "Password reset successfully. You can now log in." },
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
