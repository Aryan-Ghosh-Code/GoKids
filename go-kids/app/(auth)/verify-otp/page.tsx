"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, RefreshCw, ArrowLeft } from "lucide-react";
import BrandLogo from "@/components/shared/BrandLogo";

const OTP_LENGTH = 6;

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const canResend = resendCountdown <= 0;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const redirectTimeoutRef = useRef<number | null>(null);

  // Countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError("");

    if (digit && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }

    // Auto-submit when all filled
    if (digit && index === OTP_LENGTH - 1 && newOtp.every(Boolean)) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        focusInput(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
    if (pasted.length === OTP_LENGTH) {
      handleVerify(pasted);
    }
  };

  const handleVerify = useCallback(
    async (otpString: string) => {
      if (!email || otpString.length !== OTP_LENGTH) return;
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpString }),
        });
        const result = await res.json();
        if (!result.success) {
          setError(result.error || "Invalid OTP. Please try again.");
          setOtp(Array(OTP_LENGTH).fill(""));
          focusInput(0);
          return;
        }
        setSuccess(true);
        redirectTimeoutRef.current = window.setTimeout(
          () => router.push("/login?verified=true"),
          2000,
        );
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [email, router],
  );

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const handleResend = async () => {
    if (!canResend) return;
    setResendLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (!result.success) {
        setError(result.error || "Failed to resend OTP.");
        return;
      }
      setResendCountdown(60);
      setOtp(Array(OTP_LENGTH).fill(""));
      focusInput(0);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setResendLoading(false);
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
          className="animate-float absolute top-16 left-24 w-56 h-56 rounded-full opacity-20"
          style={{ background: "#F5C518", filter: "blur(48px)" }}
        />
        <div
          className="animate-float-delayed absolute bottom-24 right-16 w-48 h-48 rounded-full opacity-15"
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
          className="bg-white rounded-3xl p-6 sm:p-8"
          style={{
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            border: "1px solid #F3F4F6",
          }}
        >
          {/* Back */}
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors hover:opacity-70"
            style={{ color: "#6B7280", fontFamily: "var(--font-nunito)" }}
          >
            <ArrowLeft size={14} /> Back to Register
          </Link>

          <div className="text-center mb-8">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="flex flex-col items-center gap-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  >
                    <CheckCircle size={64} style={{ color: "#2BBCB0" }} />
                  </motion.div>
                  <h1
                    className="text-2xl font-extrabold"
                    style={{
                      fontFamily: "var(--font-nunito)",
                      color: "#1A1A1A",
                    }}
                  >
                    Email Verified! 🎉
                  </h1>
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    Redirecting you to login…
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h1
                    className="text-2xl font-extrabold"
                    style={{
                      fontFamily: "var(--font-nunito)",
                      color: "#1A1A1A",
                    }}
                  >
                    Verify Your Email
                  </h1>
                  <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                    We sent a 6-digit code to{" "}
                    <span
                      className="font-semibold"
                      style={{ color: "#1A1A1A" }}
                    >
                      {email || "your email"}
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!success && (
            <>
              {/* Error */}
              <AnimatePresence>
                {error && (
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
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* OTP Inputs */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 justify-items-center mb-6">
                {otp.map((digit, i) => (
                  <motion.input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    id={`otp-${i}`}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    disabled={isLoading}
                    whileFocus={{ scale: 1.08 }}
                    className="w-11 sm:w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all"
                    style={{
                      fontFamily: "var(--font-nunito)",
                      background: digit ? "#FFF9E6" : "#FAFAF8",
                      borderColor: digit ? "#F5C518" : "#E5E7EB",
                      color: "#1A1A1A",
                      boxShadow: digit
                        ? "0 0 0 3px rgba(245, 197, 24, 0.2)"
                        : "none",
                    }}
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <motion.button
                type="button"
                disabled={isLoading || otp.some((d) => !d)}
                onClick={() => handleVerify(otp.join(""))}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 mb-5 transition-opacity"
                style={{
                  background: "#F5C518",
                  color: "#1A1A1A",
                  fontFamily: "var(--font-nunito)",
                  opacity: isLoading || otp.some((d) => !d) ? 0.65 : 1,
                  cursor:
                    isLoading || otp.some((d) => !d)
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Verifying…
                  </>
                ) : (
                  "Verify Email →"
                )}
              </motion.button>

              {/* Resend */}
              <div className="text-center">
                <p className="text-sm mb-2" style={{ color: "#6B7280" }}>
                  Didn&apos;t receive a code?
                </p>
                {canResend ? (
                  <button
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="inline-flex items-center gap-1.5 text-sm font-bold transition-opacity hover:opacity-70"
                    style={{
                      color: "#F5C518",
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    {resendLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <RefreshCw size={14} />
                    )}
                    Resend OTP
                  </button>
                ) : (
                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: "#9CA3AF",
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    Resend in{" "}
                    <span style={{ color: "#F5C518" }}>{resendCountdown}s</span>
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyOtpPage() {
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
      <VerifyOtpForm />
    </Suspense>
  );
}
