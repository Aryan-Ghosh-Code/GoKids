import mongoose, { Schema, type Document, type Model } from "mongoose";

// ─── Enrollment Document ──────────────────────────────────────────────────────

export interface IEnrollment extends Document {
  parentId: mongoose.Types.ObjectId;
  workshopId: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId; // null for free workshops
  status: "confirmed";
  amountPaid: number; // 0 for free workshops (in INR, not paise)
  enrolledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    parentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workshopId: {
      type: Schema.Types.ObjectId,
      ref: "Workshop",
      required: true,
    },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
    status: { type: String, enum: ["confirmed"], default: "confirmed" },
    amountPaid: { type: Number, required: true, default: 0 },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Prevent duplicate enrollments for the same parent+workshop
EnrollmentSchema.index({ parentId: 1, workshopId: 1 }, { unique: true });

const EnrollmentModel: Model<IEnrollment> =
  (mongoose.models.Enrollment as Model<IEnrollment>) ||
  mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);

export default EnrollmentModel;
