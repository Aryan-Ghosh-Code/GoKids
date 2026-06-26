"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowRight,
  Loader2,
  ArrowLeft,
  KeyRound,
  CheckCircle,
  InboxIcon,
} from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const result = await res.json();
      if (!result.success) {
        setServerError(result.error || "Failed to process request. Try again.");
        return;
      }
      setSubmittedEmail(data.email);
      setSent(true);
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
          className="bg-white rounded-3xl p-8"
          style={{
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            border: "1px solid #F3F4F6",
          }}
        >
          <AnimatePresence mode="wait">
            {/* ── Success state ──────────────────────────────────── */}
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                {/* Animated checkmark */}
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
                  Check Your Inbox!
                </h1>

                <p
                  className="text-sm leading-relaxed mb-2"
                  style={{ color: "#4B5563" }}
                >
                  If a Go Kids account exists for{" "}
                  <span className="font-bold" style={{ color: "#1A1A1A" }}>
                    {submittedEmail}
                  </span>
                  , we&apos;ve sent a password reset link to that address.
                </p>

                {/* Inbox hint card */}
                <div
                  className="rounded-2xl p-4 mt-5 mb-6 flex items-start gap-3 text-left"
                  style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}
                >
                  <InboxIcon
                    size={18}
                    className="mt-0.5 shrink-0"
                    style={{ color: "#D97706" }}
                  />
                  <div>
                    <p
                      className="text-xs font-bold mb-0.5"
                      style={{
                        color: "#92400E",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      Don&apos;t see the email?
                    </p>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "#78350F" }}
                    >
                      Check your spam or junk folder. The link expires in{" "}
                      <strong>15 minutes</strong> and can only be used once.
                    </p>
                  </div>
                </div>

                {/* Try a different email */}
                <button
                  onClick={() => {
                    setSent(false);
                    setServerError("");
                  }}
                  className="text-sm font-bold transition-opacity hover:opacity-70 mb-4"
                  style={{ color: "#F5C518", fontFamily: "var(--font-nunito)" }}
                >
                  Try a different email
                </button>

                {/* Divider */}
                <div className="mt-2 pt-4 border-t border-brand-grey">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-grey-text hover:text-brand-black transition-colors"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    <span>←</span> Back to Home
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* ── Request form ────────────────────────────────── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Back to Login */}
                <div className="mb-6">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full transition-all hover:bg-[#FFF9E6]"
                    style={{
                      color: "#6B7280",
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    <ArrowLeft size={14} />
                    Back to Login
                  </Link>
                </div>

                <div className="text-center mb-8">
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-[#FEF0EB] text-coral rounded-2xl">
                      <KeyRound size={24} />
                    </div>
                  </div>
                  <h1
                    className="text-2xl font-extrabold mt-2"
                    style={{
                      fontFamily: "var(--font-nunito)",
                      color: "#1A1A1A",
                    }}
                  >
                    Forgot Password?
                  </h1>
                  <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                    Enter your email and we&apos;ll send you a secure reset
                    link.
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

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                  noValidate
                >
                  {/* Email */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-1.5"
                      style={{
                        color: "#1A1A1A",
                        fontFamily: "var(--font-nunito)",
                      }}
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
                        id="forgot-email"
                        placeholder="you@example.com"
                        autoComplete="email"
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
                            e.target.style.border = "1.5px solid #F5C518";
                        }}
                        onBlur={(e) => {
                          if (!errors.email)
                            e.target.style.border = "1.5px solid #E5E7EB";
                        }}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs mt-1 font-medium text-[#C0392B]">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

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
                        Sending link...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
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
