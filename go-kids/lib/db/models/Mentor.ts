import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMentor extends Document {
  userId?:        mongoose.Types.ObjectId;
  slug:           string;
  displayName:    string;
  title:          string;
  bio:            string;
  shortBio:       string;
  photo:          string;
  expertise:      string[];
  categories:     string[];
  languages:      string[];
  experience:     string;
  education:      { degree: string; institution: string; year: string }[];
  workExperience: { role: string; company: string; duration: string }[];
  socialLinks:    { platform: string; url: string }[];
  sessionTypes:   { label: string; duration: number; description: string }[];
  availability:   { dayOfWeek: number; slots: string[] }[];
  isApproved:     boolean;
  isPublished:    boolean;
  isFeatured:     boolean;
  createdAt:      Date;
  updatedAt:      Date;
}

const MentorSchema = new Schema<IMentor>(
  {
    userId:        { type: Schema.Types.ObjectId, ref: "User" },
    slug:          { type: String, required: true, unique: true, trim: true },
    displayName:   { type: String, required: true, trim: true },
    title:         { type: String, required: true, trim: true },
    bio:           { type: String, default: "" },
    shortBio:      { type: String, default: "" },
    photo:         { type: String, default: "" },
    expertise:     [{ type: String }],
    categories:    [{ type: String }],
    languages:     [{ type: String }],
    experience:    { type: String, default: "" },
    education:     [{ degree: String, institution: String, year: String }],
    workExperience:[{ role: String, company: String, duration: String }],
    socialLinks:   [{ platform: String, url: String }],
    sessionTypes:  [{ label: String, duration: Number, description: String }],
    availability:  [{ dayOfWeek: Number, slots: [String] }],
    isApproved:    { type: Boolean, default: false },
    isPublished:   { type: Boolean, default: false },
    isFeatured:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

MentorSchema.index({ isPublished: 1, isFeatured: 1 });
MentorSchema.index({ categories: 1 });
MentorSchema.index({ languages: 1 });

const MentorModel: Model<IMentor> =
  mongoose.models.Mentor ?? mongoose.model<IMentor>("Mentor", MentorSchema);

export default MentorModel;
