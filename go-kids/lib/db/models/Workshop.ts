import mongoose, { Schema, type Document, type Model } from "mongoose";

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const LessonSchema = new Schema(
  {
    title: { type: String, required: true },
    duration: { type: String, required: true }, // e.g. "30 min"
  },
  { _id: false },
);

const SectionSchema = new Schema(
  {
    title: { type: String, required: true },
    lessons: { type: [LessonSchema], default: [] },
  },
  { _id: false },
);

const ReviewSchema = new Schema(
  {
    author: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: String, required: true }, // e.g. "March 2025"
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
  instructor: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
    experience: string;
  };
  instructors?: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
    experience: string;
  }[];
  thumbnail: string;
  ageGroup: string; // e.g. "9–11"
  level: "Beginner" | "Intermediate" | "Advanced";
  skill: string; // e.g. "Coding"
  category: string; // e.g. "Technology"
  duration: string; // e.g. "4 Weeks"
  sessions: number;
  isFree: boolean;
  price?: number;
  enrolledCount: number;
  rating: number;
  highlights: string[];
  requirements: string[];
  tags: string[];
  curriculum: {
    title: string;
    lessons: { title: string; duration: string }[];
  }[];
  reviews: { author: string; rating: number; comment: string; date: string }[];
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
    instructor: { type: InstructorSchema, required: true },
    instructors: { type: [InstructorSchema], default: [] },
    thumbnail: { type: String, required: true },
    ageGroup: { type: String, required: true },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    skill: { type: String, required: true },
    category: { type: String, required: true },
    duration: { type: String, required: true },
    sessions: { type: Number, required: true },
    isFree: { type: Boolean, required: true, default: true },
    price: { type: Number },
    enrolledCount: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    highlights: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    curriculum: { type: [SectionSchema], default: [] },
    reviews: { type: [ReviewSchema], default: [] },
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
