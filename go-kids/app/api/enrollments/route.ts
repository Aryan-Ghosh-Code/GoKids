/**
 * GET /api/enrollments
 *
 * Returns all enrollments for the logged-in parent,
 * populated with workshop details.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/connect";
import EnrollmentModel from "@/lib/db/models/Enrollment";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }
    const parentId = (session.user as { id?: string }).id!;

    await connectDB();

    const enrollments = await EnrollmentModel.find({
      parentId: new mongoose.Types.ObjectId(parentId),
    })
      .populate("workshopId", "title slug thumbnail duration sessions ageGroup price isFree")
      .sort({ enrolledAt: -1 })
      .lean();

    return NextResponse.json({ enrollments });
  } catch (err) {
    console.error("[GET /api/enrollments]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
