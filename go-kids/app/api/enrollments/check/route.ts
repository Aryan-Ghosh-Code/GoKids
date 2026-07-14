/**
 * GET /api/enrollments/check?workshopId=xxx
 *
 * Returns { enrolled: boolean } — used by the workshop detail page
 * to show the correct button state without a full page reload.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/connect";
import EnrollmentModel from "@/lib/db/models/Enrollment";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ enrolled: false });
    }
    const parentId = (session.user as { id?: string }).id!;

    const workshopId = req.nextUrl.searchParams.get("workshopId");
    if (!workshopId) {
      return NextResponse.json({ error: "workshopId required" }, { status: 400 });
    }

    await connectDB();

    const exists = await EnrollmentModel.exists({
      parentId:   new mongoose.Types.ObjectId(parentId),
      workshopId: new mongoose.Types.ObjectId(workshopId),
    });

    return NextResponse.json({ enrolled: !!exists });
  } catch (err) {
    console.error("[GET /api/enrollments/check]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
