"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import GoogleButton from "@/components/shared/GoogleButton";
import { signIn } from "next-auth/react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .regex(
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit Indian mobile number",
      )
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    // Kept for backward compatibility (GoogleButton handles the click).
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/parent/dashboard" });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          password: data.password,
        }),
      });
      const result = await res.json();
      if (!result.success) {
        setServerError(
          result.error || "Registration failed. Please try again.",
        );
        return;
      }
      // Redirect to OTP verification with email
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch {
      setServerError(
        "Network error. Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-16"
      style={{ background: "#FAFAF8" }}
    >
      {/* Background shapes */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="animate-float absolute top-20 right-20 w-64 h-64 rounded-full opacity-20"
          style={{ background: "#F5C518", filter: "blur(48px)" }}
        />
        <div
          className="animate-float-delayed absolute bottom-20 left-16 w-48 h-48 rounded-full opacity-15"
          style={{ background: "#2BBCB0", filter: "blur(40px)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative"
      >
        {/* Card */}
        <div
          className="bg-white rounded-3xl p-8"
          style={{
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            border: "1px solid #F3F4F6",
          }}
        >
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-extrabold"
              style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
            >
              Create your account
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Join 500+ families on Go Kids
            </p>
          </div>

          {/* Server Error */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-5 px-4 py-3 rounded-xl text-sm font-medium"
              style={{
                background: "#FEF0EB",
                color: "#C0392B",
                border: "1px solid #F4845F",
              }}
            >
              {serverError}
            </motion.div>
          )}

          {/* ── Google Sign-Up ── */}
          <GoogleButton
            callbackUrl="/parent/dashboard"
            isLoading={isGoogleLoading || isLoading}
            label="Sign up with Google"
          />

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4 mt-2">
            <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
            <span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
              or sign up with email
            </span>
            <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Name */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "#9CA3AF" }}
                />
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border outline-none transition-all"
                  style={{
                    background: "#FAFAF8",
                    border: errors.name
                      ? "1.5px solid #F4845F"
                      : "1.5px solid #E5E7EB",
                    color: "#1A1A1A",
                    fontFamily: "var(--font-inter)",
                  }}
                  onFocus={(e) => {
                    if (!errors.name)
                      (e.target as HTMLElement).style.border =
                        "1.5px solid #F5C518";
                  }}
                  onBlur={(e) => {
                    if (!errors.name)
                      (e.target as HTMLElement).style.border =
                        "1.5px solid #E5E7EB";
                  }}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs" style={{ color: "#F4845F" }}>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "#9CA3AF" }}
                />
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border outline-none transition-all"
                  style={{
                    background: "#FAFAF8",
                    border: errors.email
                      ? "1.5px solid #F4845F"
                      : "1.5px solid #E5E7EB",
                    color: "#1A1A1A",
                  }}
                  onFocus={(e) => {
                    if (!errors.email)
                      (e.target as HTMLElement).style.border =
                        "1.5px solid #F5C518";
                  }}
                  onBlur={(e) => {
                    if (!errors.email)
                      (e.target as HTMLElement).style.border =
                        "1.5px solid #E5E7EB";
                  }}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs" style={{ color: "#F4845F" }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
              >
                Mobile Number{" "}
                <span style={{ color: "#9CA3AF", fontWeight: 400 }}>
                  (optional)
                </span>
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "#9CA3AF" }}
                />
                <input
                  {...register("phone")}
                  type="tel"
                  id="phone"
                  placeholder="10-digit mobile number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border outline-none transition-all"
                  style={{
                    background: "#FAFAF8",
                    border: errors.phone
                      ? "1.5px solid #F4845F"
                      : "1.5px solid #E5E7EB",
                    color: "#1A1A1A",
                  }}
                  onFocus={(e) => {
                    if (!errors.phone)
                      (e.target as HTMLElement).style.border =
                        "1.5px solid #F5C518";
                  }}
                  onBlur={(e) => {
                    if (!errors.phone)
                      (e.target as HTMLElement).style.border =
                        "1.5px solid #E5E7EB";
                  }}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs" style={{ color: "#F4845F" }}>
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "#9CA3AF" }}
                />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm border outline-none transition-all"
                  style={{
                    background: "#FAFAF8",
                    border: errors.password
                      ? "1.5px solid #F4845F"
                      : "1.5px solid #E5E7EB",
                    color: "#1A1A1A",
                  }}
                  onFocus={(e) => {
                    if (!errors.password)
                      (e.target as HTMLElement).style.border =
                        "1.5px solid #F5C518";
                  }}
                  onBlur={(e) => {
                    if (!errors.password)
                      (e.target as HTMLElement).style.border =
                        "1.5px solid #E5E7EB";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={16} style={{ color: "#9CA3AF" }} />
                  ) : (
                    <Eye size={16} style={{ color: "#9CA3AF" }} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs" style={{ color: "#F4845F" }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "#9CA3AF" }}
                />
                <input
                  {...register("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm border outline-none transition-all"
                  style={{
                    background: "#FAFAF8",
                    border: errors.confirmPassword
                      ? "1.5px solid #F4845F"
                      : "1.5px solid #E5E7EB",
                    color: "#1A1A1A",
                  }}
                  onFocus={(e) => {
                    if (!errors.confirmPassword)
                      (e.target as HTMLElement).style.border =
                        "1.5px solid #F5C518";
                  }}
                  onBlur={(e) => {
                    if (!errors.confirmPassword)
                      (e.target as HTMLElement).style.border =
                        "1.5px solid #E5E7EB";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  aria-label={
                    showConfirm
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirm ? (
                    <EyeOff size={16} style={{ color: "#9CA3AF" }} />
                  ) : (
                    <Eye size={16} style={{ color: "#9CA3AF" }} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs" style={{ color: "#F4845F" }}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 mt-2 transition-opacity"
              style={{
                background: "#F5C518",
                color: "#1A1A1A",
                fontFamily: "var(--font-nunito)",
                opacity: isLoading ? 0.75 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm mt-6" style={{ color: "#6B7280" }}>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold hover:underline"
              style={{ color: "#F5C518" }}
            >
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
