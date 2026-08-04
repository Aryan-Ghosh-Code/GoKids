import mongoose, { Schema, type Document, type Model } from "mongoose";

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

// Lesson: title + description (no individual duration)
const LessonSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

// Module (section): has a duration, contains many lessons
const SectionSchema = new Schema(
  {
    title: { type: String, required: true },
    duration: { type: String, required: true }, // e.g. "40 min" — on the MODULE, not each lesson
    lessons: { type: [LessonSchema], default: [] },
  },
  { _id: false },
);

// FAQ
const FaqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false },
);

const InstructorSchema = new Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    avatar: { type: String, required: true },
    experience: { type: String, required: true }, // e.g. "8+ years"
  },
  { _id: false },
);

// ─── Workshop Document ────────────────────────────────────────────────────────

export interface IWorkshop extends Document {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  instructors: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
    experience: string;
  }[];
  thumbnail: string;
  ageGroup: string; // e.g. "9–11"
  level: "Beginner" | "Intermediate" | "Advanced" | "Parents";
  audienceType: "children" | "parents"; // who the workshop is for
  skills: string[]; // e.g. ["Coding"]
  category: string; // e.g. "Technology"
  duration: string; // e.g. "4 Weeks"
  sessions: number;
  isFree: boolean;
  price?: number;
  isOffline: boolean;
  date: string;
  time: string;
  venue?: string;
  googleMapsUrl?: string;
  isEnrollmentOpen: boolean;
  enrolledCount: number;
  highlights: string[];
  requirements: string[];
  tags: string[];
  /** Who should attend this workshop (2-3 points, optional) */
  whoIsItFor?: string[];
  /** Who this workshop is NOT suitable for (2-3 points, optional) */
  whoIsItNotFor?: string[];
  /** Key concrete takeaways participants leave with */
  takeaways: string[];
  /** FAQ entries */
  faqs: { question: string; answer: string }[];
  /** Module → Lesson → Description curriculum */
  curriculum: {
    title: string;
    duration: string;
    lessons: { title: string; description: string }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const WorkshopSchema = new Schema<IWorkshop>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    instructors: { type: [InstructorSchema], required: true },
    thumbnail: { type: String, required: true },
    ageGroup: { type: String, required: true },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced", "Parents"],
    },
    audienceType: {
      type: String,
      enum: ["children", "parents"],
      default: "children",
    },
    skills: { type: [String], default: [] },
    category: { type: String, required: true },
    duration: { type: String, required: true },
    sessions: { type: Number, required: true },
    isOffline: { type: Boolean, required: true, default: false },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String },
    googleMapsUrl: { type: String },
    isFree: { type: Boolean, required: true, default: true },
    price: { type: Number },
    isEnrollmentOpen: { type: Boolean, required: true, default: true },
    enrolledCount: { type: Number, required: true, default: 0 },
    highlights: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    whoIsItFor: { type: [String], default: undefined },
    whoIsItNotFor: { type: [String], default: undefined },
    takeaways: { type: [String], default: [] },
    faqs: { type: [FaqSchema], default: [] },
    curriculum: { type: [SectionSchema], default: [] },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
  },
);

// ─── Model (safe for Next.js hot-reload) ─────────────────────────────────────

const WorkshopModel: Model<IWorkshop> =
  (mongoose.models.Workshop as Model<IWorkshop>) ||
  mongoose.model<IWorkshop>("Workshop", WorkshopSchema);

export default WorkshopModel;
