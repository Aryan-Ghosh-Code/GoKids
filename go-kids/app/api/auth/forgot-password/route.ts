import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { OtpToken } from "@/lib/db/models/OtpToken";
import { sendResetPasswordOtpEmail } from "@/lib/auth/mailer";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    // Strict NoSQL injection type checking
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
    
    // To prevent account enumeration, return success even if user is not found
    if (!user) {
      return NextResponse.json({
        success: true,
        data: { message: "If an account matches this email, a reset password OTP has been sent." },
      });
    }

    // Google-only authenticated users shouldn't reset passwords via local flow
    if (user.provider === "google" && !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Google accounts must log in via Google OAuth." },
        { status: 400 }
      );
    }

    // Rate-limit check: wait 60 seconds between OTPs
    const recentToken = await OtpToken.findOne({ userId: user._id }).sort({ createdAt: -1 });
    if (recentToken) {
      const secondsSinceLastOtp = (Date.now() - recentToken.createdAt.getTime()) / 1000;
      if (secondsSinceLastOtp < 60) {
        return NextResponse.json(
          {
            success: false,
            error: `Please wait ${Math.ceil(60 - secondsSinceLastOtp)} seconds before requesting a new OTP.`,
          },
          { status: 429 }
        );
      }
    }

    const otp = generateOtp();
    const tokenHash = crypto.createHash("sha256").update(otp).digest("hex");

    // Clear any previous OtpTokens for this user
    await OtpToken.deleteMany({ userId: user._id });

    // Store token (expires in 15 mins)
    await OtpToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    // Send styled Reset Password OTP email
    await sendResetPasswordOtpEmail(user.email, user.name, otp);

    return NextResponse.json({
      success: true,
      data: { message: "If an account matches this email, a reset password OTP has been sent." },
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
