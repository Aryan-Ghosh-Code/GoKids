import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { OtpToken } from "@/lib/db/models/OtpToken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    // Strict NoSQL injection type checking
    if (typeof email !== "string" || typeof otp !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid data types provided." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.toLowerCase().trim();
    const trimmedOtp = otp.trim();

    if (!trimmedEmail || !trimmedOtp) {
      return NextResponse.json(
        { success: false, error: "Email and OTP are required." },
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

    if (user.isEmailVerified) {
      return NextResponse.json(
        { success: false, error: "Email is already verified." },
        { status: 400 }
      );
    }

    // Find the latest OTP token for this user
    const tokenRecord = await OtpToken.findOne({ userId: user._id }).sort({ createdAt: -1 });

    if (!tokenRecord) {
      return NextResponse.json(
        { success: false, error: "OTP not found. Please request a new one." },
        { status: 400 }
      );
    }

    if (tokenRecord.expiresAt < new Date()) {
      await OtpToken.deleteMany({ userId: user._id });
      return NextResponse.json(
        { success: false, error: "OTP has expired. Please request a new one." },
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

    // Mark user as verified
    user.isEmailVerified = true;
    await user.save();

    // Delete used OTP tokens
    await OtpToken.deleteMany({ userId: user._id });

    return NextResponse.json({
      success: true,
      data: { message: "Email verified successfully. You can now log in." },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
