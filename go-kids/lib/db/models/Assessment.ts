import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IAssessment extends Document {
  childId?: mongoose.Types.ObjectId;
  parentId: mongoose.Types.ObjectId;
  type: string;
  status: string;
  formData: Record<string, any>;
  results: Record<string, any>;
  reportUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    childId: {
      type: Schema.Types.ObjectId,
      ref: "Child",
      required: false,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Parent ID is required"],
      index: true,
    },
    type: {
      type: String,
      required: [true, "Assessment type is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["completed", "in-progress"],
      required: [true, "Status is required"],
      default: "completed",
    },
    formData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    results: {
      type: Schema.Types.Mixed,
      required: true,
    },
    reportUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const Assessment =
  models.Assessment || model<IAssessment>("Assessment", AssessmentSchema);
