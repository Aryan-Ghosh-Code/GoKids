import mongoose, { Schema, type Document, type Model } from "mongoose";

// ─── Payment Document ─────────────────────────────────────────────────────────

export interface IPayment extends Document {
  parentId: mongoose.Types.ObjectId;
  workshopId: mongoose.Types.ObjectId;
  razorpayOrderId: string; // created by Razorpay
  razorpayPaymentId?: string; // filled on success
  razorpaySignature?: string; // filled on success (for verification)
  amount: number; // in paise (e.g. ₹499 → 49900)
  currency: string; // "INR"
  status: "initiated" | "success" | "failed";
  razorpayResponse?: Record<string, unknown>; // raw webhook/callback payload
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    parentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workshopId: {
      type: Schema.Types.ObjectId,
      ref: "Workshop",
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true }, // paise
    currency: { type: String, required: true, default: "INR" },
    status: {
      type: String,
      enum: ["initiated", "success", "failed"],
      default: "initiated",
    },
    razorpayResponse: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

const PaymentModel: Model<IPayment> =
  (mongoose.models.Payment as Model<IPayment>) ||
  mongoose.model<IPayment>("Payment", PaymentSchema);

export default PaymentModel;
