"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  KeyRound,
  Check,
  X,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Must contain at least one special character",
      ),
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
  const token = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect to login after success
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => router.push("/login?reset=true"), 3000);
    return () => clearTimeout(timer);
  }, [success, router]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const passwordRequirements = [
    { label: "At least 8 characters", test: passwordValue.length >= 8 },
    { label: "One uppercase letter", test: /[A-Z]/.test(passwordValue) },
    { label: "One lowercase letter", test: /[a-z]/.test(passwordValue) },
    { label: "One number", test: /[0-9]/.test(passwordValue) },
    {
      label: "One special character",
      test: /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue),
    },
  ];

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });
      const result = await res.json();
      if (!result.success) {
        setServerError(result.error || "Reset failed. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      setServerError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-16"
      style={{ background: "#FAFAF8" }}
    >
      {/* Floating Blobs */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="animate-float absolute top-24 right-20 w-60 h-60 rounded-full opacity-20"
          style={{ background: "#F5C518", filter: "blur(48px)" }}
        />
        <div
          className="animate-float-delayed absolute bottom-16 left-16 w-48 h-48 rounded-full opacity-15"
          style={{ background: "#2BBCB0", filter: "blur(40px)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative"
      >
        <div
          className="bg-white rounded-3xl p-8"
          style={{
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            border: "1px solid #F3F4F6",
          }}
        >
          <AnimatePresence mode="wait">
            {/* ── No token in URL — invalid link state ────────────────── */}
            {!token && (
              <motion.div
                key="invalid"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="flex justify-center mb-5"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "#FEF0EB" }}
                  >
                    <AlertTriangle size={32} style={{ color: "#F4845F" }} />
                  </div>
                </motion.div>

                <h1
                  className="text-2xl font-extrabold mb-3"
                  style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
                >
                  Invalid Reset Link
                </h1>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "#6B7280" }}
                >
                  This password reset link is missing or malformed. Reset links
                  arrive via email and can only be used once.
                </p>
                <Link
                  href="/forgot-password"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: "#F5C518",
                    color: "#1A1A1A",
                    fontFamily: "var(--font-nunito)",
                    boxShadow: "0 4px 14px rgba(245,197,24,0.4)",
                  }}
                >
                  Request a New Link <ArrowRight size={15} />
                </Link>

                <div className="mt-6 pt-4 border-t border-brand-grey">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-grey-text hover:text-brand-black transition-colors"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    <span>←</span> Back to Home
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ── Success state ──────────────────────────────────────── */}
            {token && success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="flex justify-center mb-5"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "#F0FBF9" }}
                  >
                    <CheckCircle size={36} style={{ color: "#2BBCB0" }} />
                  </div>
                </motion.div>

                <h1
                  className="text-2xl font-extrabold mb-3"
                  style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
                >
                  Password Reset! 🎉
                </h1>
                <p
                  className="text-sm leading-relaxed mb-2"
                  style={{ color: "#4B5563" }}
                >
                  Your password has been updated successfully.
                </p>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  Redirecting you to login in a moment…
                </p>

                {/* Manual redirect fallback */}
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: "#F5C518",
                    color: "#1A1A1A",
                    fontFamily: "var(--font-nunito)",
                    boxShadow: "0 4px 14px rgba(245,197,24,0.4)",
                  }}
                >
                  Go to Login <ArrowRight size={15} />
                </Link>
              </motion.div>
            )}

            {/* ── Reset form ─────────────────────────────────────────── */}
            {token && !success && (
              <motion.div
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-3">
                    <div
                      className="p-3 rounded-2xl"
                      style={{ background: "#F0FBF9" }}
                    >
                      <KeyRound size={24} style={{ color: "#2BBCB0" }} />
                    </div>
                  </div>
                  <h1
                    className="text-2xl font-extrabold mt-2"
                    style={{
                      fontFamily: "var(--font-nunito)",
                      color: "#1A1A1A",
                    }}
                  >
                    Choose a New Password
                  </h1>
                  <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                    Pick a strong password you haven&apos;t used before.
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
                      {/* If token is invalid/expired, offer a link to request a new one */}
                      {(serverError.includes("invalid") ||
                        serverError.includes("expired") ||
                        serverError.includes("used")) && (
                        <div className="mt-2">
                          <Link
                            href="/forgot-password"
                            className="font-bold underline"
                            style={{ color: "#C0392B" }}
                          >
                            Request a new reset link →
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  {/* New Password */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-1.5"
                      style={{
                        color: "#1A1A1A",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        id="reset-password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="w-full pl-4 pr-10 py-3 rounded-xl text-sm border outline-none transition-all"
                        style={{
                          background: "#FAFAF8",
                          border: errors.password
                            ? "1.5px solid #F4845F"
                            : "1.5px solid #E5E7EB",
                          color: "#1A1A1A",
                        }}
                        onFocus={(e) => {
                          if (!errors.password)
                            e.target.style.border = "1.5px solid #F5C518";
                        }}
                        onBlur={(e) => {
                          if (!errors.password)
                            e.target.style.border = "1.5px solid #E5E7EB";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs mt-1 font-medium text-[#C0392B]">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Live strength checker */}
                  {passwordValue.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-3 rounded-xl space-y-1.5 text-xs font-semibold"
                      style={{
                        background: "#FAFAF8",
                        border: "1px solid #F3F4F6",
                      }}
                    >
                      <p style={{ color: "#4B5563" }}>Password requirements:</p>
                      {passwordRequirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          {req.test ? (
                            <Check size={13} style={{ color: "#2BBCB0" }} />
                          ) : (
                            <X size={13} style={{ color: "#F4845F" }} />
                          )}
                          <span
                            style={{ color: req.test ? "#1A7A72" : "#9CA3AF" }}
                          >
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Confirm Password */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-1.5"
                      style={{
                        color: "#1A1A1A",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        {...register("confirmPassword")}
                        type={showConfirm ? "text" : "password"}
                        id="reset-confirm-password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="w-full pl-4 pr-10 py-3 rounded-xl text-sm border outline-none transition-all"
                        style={{
                          background: "#FAFAF8",
                          border: errors.confirmPassword
                            ? "1.5px solid #F4845F"
                            : "1.5px solid #E5E7EB",
                          color: "#1A1A1A",
                        }}
                        onFocus={(e) => {
                          if (!errors.confirmPassword)
                            e.target.style.border = "1.5px solid #F5C518";
                        }}
                        onBlur={(e) => {
                          if (!errors.confirmPassword)
                            e.target.style.border = "1.5px solid #E5E7EB";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label={
                          showConfirm ? "Hide password" : "Show password"
                        }
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

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-opacity select-none disabled:opacity-50 disabled:cursor-not-allowed"
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
                        Resetting…
                      </>
                    ) : (
                      <>
                        Reset Password
                        <ArrowRight size={16} />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Back to Home */}
                <div className="mt-5 pt-4 border-t border-brand-grey text-center">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-grey-text hover:text-brand-black transition-colors"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    <span>←</span> Back to Home
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "#FAFAF8" }}
        >
          <Loader2
            size={32}
            className="animate-spin"
            style={{ color: "#F5C518" }}
          />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
