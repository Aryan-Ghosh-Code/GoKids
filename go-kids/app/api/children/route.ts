import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Child } from "@/lib/db/models/Child";

// ─── GET /api/children — list session user's children ─────────────────────────
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const children = await Child.find({ parentId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: children });
  } catch (error) {
    console.error("GET /api/children error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}

// ─── POST /api/children — create a child profile ──────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { name, dob, grade, school, interests, behaviorNotes, photoUrl } = body;

    // Type validation — guard against NoSQL injection
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, error: "Child name is required." }, { status: 400 });
    }
    if (name.trim().length > 100) {
      return NextResponse.json({ success: false, error: "Name must be at most 100 characters." }, { status: 400 });
    }
    if (!Array.isArray(interests) || interests.some((i) => typeof i !== "string")) {
      return NextResponse.json({ success: false, error: "Interests must be an array of strings." }, { status: 400 });
    }

    await connectDB();

    const child = await Child.create({
      parentId: session.user.id,
      name: name.trim(),
      dob: dob ? new Date(dob) : undefined,
      grade: typeof grade === "string" ? grade.trim() : undefined,
      school: typeof school === "string" ? school.trim() : undefined,
      interests: interests.map((i: string) => i.trim()).filter(Boolean),
      behaviorNotes: typeof behaviorNotes === "string" ? behaviorNotes.trim() : undefined,
      photoUrl: typeof photoUrl === "string" ? photoUrl.trim() : undefined,
    });

    return NextResponse.json({ success: true, data: child }, { status: 201 });
  } catch (error) {
    console.error("POST /api/children error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}
