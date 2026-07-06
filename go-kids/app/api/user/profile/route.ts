import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";

// ─── GET /api/user/profile ────────────────────────────────────────────────────
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id)
      .select("name email phone photoUrl role provider createdAt")
      .lean();

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("GET /api/user/profile error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}

// ─── PATCH /api/user/profile ──────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { name, photoUrl, phone } = body;

    const updates: Record<string, string> = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ success: false, error: "Name cannot be empty." }, { status: 400 });
      }
      if (name.trim().length > 100) {
        return NextResponse.json({ success: false, error: "Name must be at most 100 characters." }, { status: 400 });
      }
      updates.name = name.trim();
    }

    if (photoUrl !== undefined) {
      if (typeof photoUrl !== "string") {
        return NextResponse.json({ success: false, error: "Invalid photo URL." }, { status: 400 });
      }
      updates.photoUrl = photoUrl.trim();
    }

    if (phone !== undefined) {
      if (typeof phone !== "string") {
        return NextResponse.json({ success: false, error: "Invalid phone number." }, { status: 400 });
      }
      updates.phone = phone.trim();
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updates },
      { new: true }
    ).select("name email phone photoUrl role createdAt").lean();

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("PATCH /api/user/profile error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}
