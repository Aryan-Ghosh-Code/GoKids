import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Child } from "@/lib/db/models/Child";

type Params = { params: Promise<{ id: string }> };

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ─── GET /api/children/[id] ───────────────────────────────────────────────────
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    if (!isValidObjectId(id)) return NextResponse.json({ success: false, error: "Invalid ID." }, { status: 400 });

    await connectDB();
    const child = await Child.findOne({ _id: id, parentId: token.id }).lean();
    if (!child) return NextResponse.json({ success: false, error: "Child not found." }, { status: 404 });

    return NextResponse.json({ success: true, data: child });
  } catch (error) {
    console.error("GET /api/children/[id] error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}

// ─── PATCH /api/children/[id] ─────────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    if (!isValidObjectId(id)) return NextResponse.json({ success: false, error: "Invalid ID." }, { status: 400 });

    const body = await req.json();
    const { name, dob, grade, school, interests, behaviorNotes, photoUrl } = body;

    // Validate name if provided
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ success: false, error: "Child name cannot be empty." }, { status: 400 });
      }
    }
    if (interests !== undefined && (!Array.isArray(interests) || interests.some((i) => typeof i !== "string"))) {
      return NextResponse.json({ success: false, error: "Interests must be an array of strings." }, { status: 400 });
    }

    await connectDB();

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name.trim();
    if (dob !== undefined) updates.dob = dob ? new Date(dob) : null;
    if (grade !== undefined) updates.grade = typeof grade === "string" ? grade.trim() : "";
    if (school !== undefined) updates.school = typeof school === "string" ? school.trim() : "";
    if (interests !== undefined) updates.interests = (interests as string[]).map((i) => i.trim()).filter(Boolean);
    if (behaviorNotes !== undefined) updates.behaviorNotes = typeof behaviorNotes === "string" ? behaviorNotes.trim() : "";
    if (photoUrl !== undefined) updates.photoUrl = typeof photoUrl === "string" ? photoUrl.trim() : "";

    const child = await Child.findOneAndUpdate(
      { _id: id, parentId: token.id },
      { $set: updates },
      { new: true }
    ).lean();

    if (!child) return NextResponse.json({ success: false, error: "Child not found." }, { status: 404 });

    return NextResponse.json({ success: true, data: child });
  } catch (error) {
    console.error("PATCH /api/children/[id] error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}

// ─── DELETE /api/children/[id] ────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    if (!isValidObjectId(id)) return NextResponse.json({ success: false, error: "Invalid ID." }, { status: 400 });

    await connectDB();
    const child = await Child.findOneAndDelete({ _id: id, parentId: token.id });
    if (!child) return NextResponse.json({ success: false, error: "Child not found." }, { status: 404 });

    return NextResponse.json({ success: true, data: { message: "Child profile deleted." } });
  } catch (error) {
    console.error("DELETE /api/children/[id] error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}
