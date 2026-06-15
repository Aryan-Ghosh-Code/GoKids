import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IChild extends Document {
  parentId: mongoose.Types.ObjectId;
  name: string;
  dob?: Date;
  grade?: string;
  school?: string;
  interests: string[];
  behaviorNotes?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChildSchema = new Schema<IChild>(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Parent ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Child name is required"],
      trim: true,
      maxlength: [100, "Name must be at most 100 characters"],
    },
    dob: {
      type: Date,
    },
    grade: {
      type: String,
      trim: true,
      maxlength: [50, "Grade must be at most 50 characters"],
    },
    school: {
      type: String,
      trim: true,
      maxlength: [200, "School name must be at most 200 characters"],
    },
    interests: {
      type: [String],
      default: [],
    },
    behaviorNotes: {
      type: String,
      trim: true,
      maxlength: [2000, "Notes must be at most 2000 characters"],
    },
    photoUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Child = models.Child || model<IChild>("Child", ChildSchema);
