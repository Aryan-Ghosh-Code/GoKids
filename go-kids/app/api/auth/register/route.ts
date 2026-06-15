import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { OtpToken } from "@/lib/db/models/OtpToken";
import { sendOtpEmail } from "@/lib/auth/mailer";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    // Strict NoSQL injection and parameter type checks
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      (phone !== undefined && phone !== null && typeof phone !== "string")
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid data types provided." },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.toLowerCase().trim();
    const trimmedPhone = phone?.trim();

    // Basic required field validations
    if (!trimmedName || !trimmedEmail || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required." },
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

    // Strong password checks
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

    // Indian phone verification if provided
    if (trimmedPhone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(trimmedPhone)) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid 10-digit Indian mobile number." },
          { status: 400 }
        );
      }
    }

    await connectDB();

    // Check if user already exists
    const existing = await User.findOne({ email: trimmedEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone || undefined,
      passwordHash,
      role: "parent",
      isEmailVerified: false,
    });

    // Generate OTP
    const otp = generateOtp();
    const tokenHash = crypto.createHash("sha256").update(otp).digest("hex");

    // Remove any existing OTP for this user
    await OtpToken.deleteMany({ userId: user._id });

    // Save hashed OTP (15 min expiry)
    await OtpToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    // Send OTP email
    await sendOtpEmail(user.email, user.name, otp);

    return NextResponse.json(
      {
        success: true,
        data: {
          userId: user._id.toString(),
          email: user.email,
          message: "OTP sent to your email. Please verify to continue.",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
