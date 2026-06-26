"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle,
} from "lucide-react";
import GoogleButton from "@/components/shared/GoogleButton";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justVerified = searchParams.get("verified") === "true";
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Kept for backward compatibility (GoogleButton handles the click).
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError("");
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError("Invalid email or password. Please try again.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
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
          className="animate-float absolute top-24 right-20 w-60 h-60 rounded-full opacity-20"
          style={{ background: "#F5C518", filter: "blur(48px)" }}
        />
        {/* <div
          className="animate-float-delayed absolute bottom-16 left-16 w-48 h-48 rounded-full opacity-15"
          style={{ background: "#F4845F", filter: "blur(40px)" }}
        /> */}
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
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-extrabold"
              style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
            >
              Welcome back! 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Log in to your Go Kids account
            </p>
          </div>

          {/* Verification success banner */}
          <AnimatePresence>
            {justVerified && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-5 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium"
                style={{
                  background: "#E8F8F7",
                  color: "#1A7A72",
                  border: "1px solid #2BBCB0",
                }}
              >
                <CheckCircle size={16} />
                Email verified! You can now log in.
              </motion.div>
            )}
          </AnimatePresence>

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

          {/* ── Google Sign-In ── */}
          <GoogleButton
            callbackUrl={callbackUrl}
            isLoading={isGoogleLoading || isLoading}
          />

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
            <span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
              or continue with email
            </span>
            <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
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
                  id="login-email"
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-sm font-semibold"
                  style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold hover:underline"
                  style={{ color: "#F5C518" }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "#9CA3AF" }}
                />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  placeholder="Your password"
                  autoComplete="current-password"
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
                  <Loader2 size={16} className="animate-spin" /> Logging in…
                </>
              ) : (
                <>
                  Log In <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm mt-6" style={{ color: "#6B7280" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold hover:underline"
              style={{ color: "#F5C518" }}
            >
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  );
}
