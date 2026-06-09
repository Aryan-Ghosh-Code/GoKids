import mongoose, { Schema, model, models, Document } from "mongoose";

export type UserRole = "parent" | "instructor" | "mentor" | "admin" | "superadmin";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  provider: "credentials" | "google";
  isEmailVerified: boolean;
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name must be at most 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"],
    },
    passwordHash: {
      type: String,
      required: false,
      default: "",
    },
    role: {
      type: String,
      enum: ["parent", "instructor", "mentor", "admin", "superadmin"],
      default: "parent",
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent model re-compilation in dev (hot-reload)
export const User = models.User || model<IUser>("User", UserSchema);
