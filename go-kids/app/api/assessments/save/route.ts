import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Assessment } from "@/lib/db/models/Assessment";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    await connectDB();

    const body = await req.json();
    const {
      assessmentId,
      savedToDashboard = false,
      type,
      childId,
      childName,
      band,
      cptRaw,
      partBAnswers,
      partCAnswers,
      partDAnswers,
      scores,
      profile,
    } = body;

    const parentId = new mongoose.Types.ObjectId(session.user.id);

    // Mark an existing assessment as saved to dashboard
    if (assessmentId) {
      const existing = await Assessment.findOne({
        _id: new mongoose.Types.ObjectId(assessmentId),
        parentId,
      });

      if (!existing) {
        return NextResponse.json(
          { success: false, error: "Assessment not found" },
          { status: 404 },
        );
      }

      existing.savedToDashboard = savedToDashboard;
      await existing.save();

      return NextResponse.json({
        success: true,
        data: { assessmentId: existing._id.toString() },
      });
    }

    // Validate required fields for new assessment
    if (
      !type ||
      !childName ||
      !band ||
      !cptRaw ||
      !partCAnswers ||
      !partDAnswers ||
      !scores ||
      !profile
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const assessment = await Assessment.create({
      childId: childId ? new mongoose.Types.ObjectId(childId) : undefined,
      parentId,
      type,
      status: "completed",
      formData: {
        band,
        childName: childName.trim(),
        partBAnswers,
        partCAnswers,
        partDAnswers,
      },
      results: {
        cptRaw,
        scores,
        profile,
      },
      reportUrl: null,
      savedToDashboard,
    });

    return NextResponse.json({
      success: true,
      data: { assessmentId: assessment._id.toString() },
    });
  } catch (err) {
    console.error("POST /api/assessments/save error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save assessment." },
      { status: 500 },
    );
  }
}
