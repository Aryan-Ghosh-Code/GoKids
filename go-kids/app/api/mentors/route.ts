import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import MentorModel from "@/lib/db/models/Mentor";
import type { SortOrder } from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;

    const page     = Math.max(1, parseInt(searchParams.get("page")  || "1", 10));
    const limit    = Math.min(24, parseInt(searchParams.get("limit") || "6", 10));
    const skip     = (page - 1) * limit;
    const sort     = searchParams.get("sort")     || "newest";
    const featured = searchParams.get("featured") === "true";
    const q        = searchParams.get("q")?.trim();
    const category = searchParams.get("category")?.trim();
    const language = searchParams.get("language")?.trim();
    const expertise= searchParams.get("expertise")?.trim();

    // Always show only published mentors on public listing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { isPublished: true };

    if (featured)  filter.isFeatured = true;
    if (category)  filter.categories = { $in: [category] };
    if (language)  filter.languages  = { $in: [language] };
    if (expertise) filter.expertise  = { $in: [expertise] };

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [
        { displayName: regex },
        { shortBio: regex },
        { bio: regex },
        { expertise: regex },
        { title: regex },
      ];
    }

    const sortOrder: Record<string, SortOrder> =
      sort === "popular"
        ? { isFeatured: -1, createdAt: -1 }
        : { createdAt: -1 };

    const [mentors, total] = await Promise.all([
      MentorModel.find(filter)
        .sort(sortOrder)
        .skip(skip)
        .limit(limit)
        .lean(),
      MentorModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        mentors,
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("GET /api/mentors error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch mentors." },
      { status: 500 }
    );
  }
}
