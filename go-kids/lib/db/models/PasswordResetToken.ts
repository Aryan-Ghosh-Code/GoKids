import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IPasswordResetToken extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string; // SHA-256(rawToken) — never store raw token at rest
  expiresAt: Date;
  createdAt: Date;
}

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
      index: true, // fast lookup by hash
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // MongoDB TTL — auto-deletes after expiresAt
    },
  },
  { timestamps: true }
);

// Prevent model re-compilation in dev (hot-reload)
export const PasswordResetToken =
  models.PasswordResetToken ||
  model<IPasswordResetToken>("PasswordResetToken", PasswordResetTokenSchema);
