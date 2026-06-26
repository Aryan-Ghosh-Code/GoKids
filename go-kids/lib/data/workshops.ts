// ─── Workshop Data Layer ──────────────────────────────────────────────────────
//
// All helpers are async and query MongoDB via Mongoose.
// SERVER-ONLY — never import this from a client component.
//
// ─────────────────────────────────────────────────────────────────────────────

import "server-only";
import { connectDB } from "@/lib/db/connect";
import WorkshopModel from "@/lib/db/models/Workshop";


// ─── Types ────────────────────────────────────────────────────────────────────

export interface WorkshopLesson {
  title: string;
  duration: string; // e.g. "30 min"
}

export interface WorkshopSection {
  title: string;
  lessons: WorkshopLesson[];
}

export interface WorkshopReview {
  author: string;
  rating: number; // 1–5
  comment: string;
  date: string;
}

export interface WorkshopInstructor {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  experience: string;
}

export interface Workshop {
  _id: string;        // MongoDB ObjectId as string
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  instructor: WorkshopInstructor;
  thumbnail: string;
  ageGroup: string;       // e.g. "9–11"
  level: "Beginner" | "Intermediate" | "Advanced";
  skill: string;          // e.g. "Coding", "Mathematics"
  category: string;       // used for filter grouping
  duration: string;       // e.g. "4 Weeks"
  sessions: number;
  isFree: boolean;
  price?: number;
  enrolledCount: number;
  rating: number;
  highlights: string[];   // bullet points for Overview tab
  requirements: string[];
  tags: string[];
  curriculum: WorkshopSection[];
  reviews: WorkshopReview[];
  createdAt: string;
  updatedAt: string;
}

export type WorkshopFilters = {
  level?: string[];
  ageGroup?: string[];
  skill?: string[];
  query?: string;
  sort?: "popular" | "newest" | "rating";
};

// ─── Transform helper ─────────────────────────────────────────────────────────
// Converts a Mongoose lean document to a plain Workshop object
// (serialises ObjectId → string, Date → ISO string).

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toWorkshop(doc: any): Workshop {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt,
  };
}

// ─── Query Helpers ────────────────────────────────────────────────────────────

/**
 * Fetch all workshops, optionally filtered + sorted.
 * Used server-side; result is serialised and passed to client components.
 */
export async function getWorkshops(filters?: WorkshopFilters): Promise<Workshop[]> {
  await connectDB();

  // Build MongoDB query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: Record<string, any> = {};

  if (filters?.level?.length)    query.level    = { $in: filters.level };
  if (filters?.ageGroup?.length) query.ageGroup = { $in: filters.ageGroup };
  if (filters?.skill?.length)    query.skill    = { $in: filters.skill };

  if (filters?.query) {
    const re = new RegExp(filters.query, "i");
    query.$or = [
      { title: re },
      { shortDescription: re },
      { skill: re },
    ];
  }

  // Sort
  let sortOption: Record<string, 1 | -1> = { createdAt: -1 }; // "newest" default
  if (filters?.sort === "popular") sortOption = { enrolledCount: -1 };
  if (filters?.sort === "rating")  sortOption = { rating: -1 };

  const docs = await WorkshopModel.find(query).sort(sortOption).lean();
  return docs.map(toWorkshop);
}

/**
 * Fetch a single workshop by slug.
 * Returns null if not found (caller should call notFound() in that case).
 */
export async function getWorkshopBySlug(slug: string): Promise<Workshop | null> {
  await connectDB();
  const doc = await WorkshopModel.findOne({ slug }).lean();
  if (!doc) return null;
  return toWorkshop(doc);
}

/**
 * Fetch all slugs for generateStaticParams / sitemap generation.
 */
export async function getAllSlugs(): Promise<string[]> {
  await connectDB();
  const docs = await WorkshopModel.find({}, "slug").lean();
  return docs.map((d) => d.slug);
}

// ─── Filter Option Helpers ────────────────────────────────────────────────────
// Static level options live in lib/data/workshop-constants.ts (client-safe).
// Age groups & skills are derived dynamically from DB results.
