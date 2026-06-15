"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, ArrowRight, Loader2, ArrowLeft, KeyRound, Check, X, RefreshCw } from "lucide-react";
import BrandLogo from "@/components/shared/BrandLogo";

const resetPasswordSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must only contain digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (resendCountdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleResend = async () => {
    if (!canResend || !emailParam) return;
    setResendLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailParam }),
      });
      const result = await res.json();
      if (!result.success) {
        setServerError(result.error || "Failed to resend OTP.");
        return;
      }
      setCanResend(false);
      setResendCountdown(60);
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailParam,
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password") || "";

  const passwordRequirements = [
    { label: "At least 8 characters", test: passwordValue.length >= 8 },
    { label: "One uppercase letter", test: /[A-Z]/.test(passwordValue) },
    { label: "One lowercase letter", test: /[a-z]/.test(passwordValue) },
    { label: "One number", test: /[0-9]/.test(passwordValue) },
    { label: "One special character", test: /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue) },
  ];

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          otp: data.otp,
          password: data.password,
        }),
      });
      const result = await res.json();
      if (!result.success) {
        setServerError(result.error || "Reset password failed. Try again.");
        return;
      }
      // Redirect to login with verified=true parameter for success message
      router.push("/login?verified=true");
    } catch {
      setServerError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "#FAFAF8" }}
    >
      {/* Floating Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="animate-float absolute top-24 right-20 w-60 h-60 rounded-full opacity-20"
          style={{ background: "#F5C518", filter: "blur(48px)" }}
        />
        <div
          className="animate-float-delayed absolute bottom-16 left-16 w-48 h-48 rounded-full opacity-15"
          style={{ background: "#F4845F", filter: "blur(40px)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative"
      >
        <div
          className="bg-white rounded-3xl p-8 shadow-xl border border-[#F3F4F6]"
          style={{
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          }}
        >
          {/* Back link */}
          <div className="mb-6">
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full transition-all hover:bg-[#FFF9E6]"
              style={{ color: "#6B7280", fontFamily: "var(--font-nunito)" }}
            >
              <ArrowLeft size={14} />
              Back
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <BrandLogo height={48} />
            </div>
            <div className="flex justify-center mb-2">
              <div className="p-3 bg-[#E8F8F7] text-[#2BBCB0] rounded-2xl">
                <KeyRound size={24} />
              </div>
            </div>
            <h1
              className="text-2xl font-extrabold mt-2"
              style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
            >
              Reset Password
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Enter the OTP sent to your email and choose a new password.
            </p>
          </div>

          {/* Server Error */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
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
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email (hidden/read-only) */}
            <input type="hidden" {...register("email")} />

            {/* OTP Field */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
              >
                6-Digit OTP Code
              </label>
              <input
                {...register("otp")}
                type="text"
                placeholder="123456"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all tracking-[0.2em] text-center font-bold"
                style={{
                  background: "#FAFAF8",
                  border: errors.otp ? "1.5px solid #F4845F" : "1.5px solid #E5E7EB",
                  color: "#1A1A1A",
                  fontFamily: "var(--font-nunito)",
                }}
                onFocus={(e) => {
                  if (!errors.otp) e.target.style.border = "1.5px solid #F5C518";
                }}
                onBlur={(e) => {
                  if (!errors.otp) e.target.style.border = "1.5px solid #E5E7EB";
                }}
              />
              {errors.otp && (
                <p className="text-xs mt-1 font-medium text-[#C0392B]">{errors.otp.message}</p>
              )}

              <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-xs text-gray-500">Didn't receive a code?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-70 text-[#F5C518] hover:underline"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {resendLoading ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <RefreshCw size={11} />
                    )}
                    Resend OTP
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-gray-400" style={{ fontFamily: "var(--font-nunito)" }}>
                    Resend in <span style={{ color: "#F5C518" }}>{resendCountdown}s</span>
                  </span>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
              >
                New Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-3 rounded-xl text-sm border outline-none transition-all"
                  style={{
                    background: "#FAFAF8",
                    border: errors.password ? "1.5px solid #F4845F" : "1.5px solid #E5E7EB",
                    color: "#1A1A1A",
                  }}
                  onFocus={(e) => {
                    if (!errors.password) e.target.style.border = "1.5px solid #F5C518";
                  }}
                  onBlur={(e) => {
                    if (!errors.password) e.target.style.border = "1.5px solid #E5E7EB";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs mt-1 font-medium text-[#C0392B]">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-3 rounded-xl text-sm border outline-none transition-all"
                  style={{
                    background: "#FAFAF8",
                    border: errors.confirmPassword ? "1.5px solid #F4845F" : "1.5px solid #E5E7EB",
                    color: "#1A1A1A",
                  }}
                  onFocus={(e) => {
                    if (!errors.confirmPassword) e.target.style.border = "1.5px solid #F5C518";
                  }}
                  onBlur={(e) => {
                    if (!errors.confirmPassword) e.target.style.border = "1.5px solid #E5E7EB";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs mt-1 font-medium text-[#C0392B]">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Live Password Strength Indicator */}
            {passwordValue.length > 0 && (
              <div className="p-3 bg-[#FAFAF8] rounded-xl space-y-1.5 text-xs font-semibold">
                <p style={{ color: "#4B5563" }}>Password requirements:</p>
                {passwordRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    {req.test ? (
                      <Check size={14} className="text-[#2BBCB0]" />
                    ) : (
                      <X size={14} className="text-[#F4845F]" />
                    )}
                    <span style={{ color: req.test ? "#1A7A72" : "#9CA3AF" }}>{req.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer select-none active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "#F5C518",
                color: "#1A1A1A",
                fontFamily: "var(--font-nunito)",
                boxShadow: "0 4px 14px rgba(245, 197, 24, 0.4)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <Loader2 size={32} className="animate-spin text-[#F5C518]" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
