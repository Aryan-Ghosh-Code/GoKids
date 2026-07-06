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
    const { type, ageBand, childName, childId, parentAnswers, cptResult } =
      body;

    // Validate required fields
    if (!type || !ageBand || !childName || !parentAnswers || !cptResult) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Calculate scores server-side to prevent tampering
    const { calcResults } =
      await import("@/components/assessments/attention-span/utils/scoring");
    const parentRaw = (parentAnswers as number[]).reduce(
      (a: number, b: number) => a + b,
      0,
    );
    const scored = calcResults(
      cptResult.accuracyPct, // ML accuracy (TP+TN) / total
      cptResult.hitRatePct, // recall / sensitivity
      cptResult.falseAlarms, // raw FP count
      parentRaw, // parent questionnaire total
      cptResult.shapesShown, // total shapes for proportional FA thresholds
    );

    const assessment = await Assessment.create({
      childId: childId ? new mongoose.Types.ObjectId(childId) : undefined,
      parentId: new mongoose.Types.ObjectId(session.user.id),
      type,
      status: "completed",
      formData: {
        ageBand,
        childName: childName.trim(),
        parentAnswers,
      },
      results: {
        cpt: cptResult,
        parentRaw,
        cptScore: scored.cptScore,
        parentScore: scored.parentScore,
        overall: scored.overall,
        level: scored.level,
        sublabel: scored.sublabel,
      },
      reportUrl: null,
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
