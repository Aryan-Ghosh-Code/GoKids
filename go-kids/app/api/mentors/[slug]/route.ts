import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import MentorModel from "@/lib/db/models/Mentor";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid slug." },
        { status: 400 }
      );
    }

    await connectDB();

    const mentor = await MentorModel.findOne({
      slug: slug.toLowerCase().trim(),
      isPublished: true,
    }).lean();

    if (!mentor) {
      return NextResponse.json(
        { success: false, error: "Mentor not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { mentor } });
  } catch (err) {
    console.error("GET /api/mentors/[slug] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch mentor." },
      { status: 500 }
    );
  }
}
