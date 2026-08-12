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

/** A single lesson inside a curriculum module. No individual duration. */
export interface WorkshopLesson {
  title: string;
  description: string;
}

/** A curriculum module. Carries the duration; lessons do not. */
export interface WorkshopSection {
  title: string;
  duration: string; // e.g. "40 min"
  lessons: WorkshopLesson[];
}

export interface WorkshopFaq {
  question: string;
  answer: string;
}

export interface WorkshopInstructor {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  experience: string;
}

export interface Workshop {
  _id: string; // MongoDB ObjectId as string
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  instructors: WorkshopInstructor[];
  thumbnail: string;
  ageGroup: string; // e.g. "9–11"
  level: "Beginner" | "Intermediate" | "Advanced" | "Parents";
  audienceType: "children" | "parents"; // who the workshop is for
  skills: string[]; // e.g. ["Coding", "Mathematics"]
  category: string; // used for filter grouping
  duration: string; // e.g. "4 Weeks"
  sessions: number;
  isOffline: boolean;
  date: string;
  time: string;
  venue?: string;
  googleMapsUrl?: string;
  isFree: boolean;
  price?: number;        // active selling price (charged to user)
  /** Crossed-out original / MRP price shown to convey discount (optional) */
  oldPrice?: number;
  isEnrollmentOpen: boolean;
  enrolledCount: number;
  highlights: string[]; // bullet points for Overview tab
  requirements: string[];
  tags: string[];
  /** Who should attend this workshop (2-3 points, optional) */
  whoIsItFor?: string[];
  /** Who this workshop is NOT suitable for (2-3 points, optional) */
  whoIsItNotFor?: string[];
  /** Key concrete takeaways participants leave with */
  takeaways: string[];
  /** FAQ entries */
  faqs: WorkshopFaq[];
  /** Module → Lesson → Description curriculum */
  curriculum: WorkshopSection[];
  createdAt: string;
  updatedAt: string;
}

export type WorkshopFilters = {
  level?: string[];
  ageGroup?: string[];
  skill?: string[];
  query?: string;
  sort?: "popular" | "newest";
  audienceType?: "children" | "parents";
};

// ─── Transform helper ─────────────────────────────────────────────────────────
// Converts a Mongoose lean document to a plain Workshop object
// (serialises ObjectId → string, Date → ISO string).

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toWorkshop(doc: any): Workshop {
  const plainDoc = {
    ...doc,
    _id: doc._id.toString(),
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : doc.createdAt,
    updatedAt:
      doc.updatedAt instanceof Date
        ? doc.updatedAt.toISOString()
        : doc.updatedAt,
  };

  plainDoc.instructors = plainDoc.instructors || [];
  if (plainDoc.instructor) {
    delete plainDoc.instructor;
  }

  return plainDoc;
}

// ─── Query Helpers ────────────────────────────────────────────────────────────

/**
 * Fetch all workshops, optionally filtered + sorted.
 * Used server-side; result is serialised and passed to client components.
 */
export async function getWorkshops(
  filters?: WorkshopFilters,
): Promise<Workshop[]> {
  await connectDB();

  // Build MongoDB query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: Record<string, any> = {};

  if (filters?.level?.length) query.level = { $in: filters.level };
  if (filters?.ageGroup?.length) query.ageGroup = { $in: filters.ageGroup };
  if (filters?.skill?.length) query.skills = { $in: filters.skill };
  if (filters?.audienceType) query.audienceType = filters.audienceType;

  if (filters?.query) {
    const re = new RegExp(filters.query, "i");
    query.$or = [{ title: re }, { shortDescription: re }, { skills: re }];
  }

  // Sort — "rating" removed since that field no longer exists
  const sortOption: Record<string, 1 | -1> =
    filters?.sort === "popular" ? { enrolledCount: -1 } : { createdAt: -1 };

  const docs = await WorkshopModel.find(query).sort(sortOption).lean();
  return docs.map(toWorkshop);
}

/**
 * Fetch a single workshop by slug.
 * Returns null if not found (caller should call notFound() in that case).
 */
export async function getWorkshopBySlug(
  slug: string,
): Promise<Workshop | null> {
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
