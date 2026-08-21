"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { TOTAL_QUESTIONS } from "../data/surveyQuestions";

const emailSchema = z.string().email();

interface Props {
  name: string;
  email: string;
  emailError: string;
  isSubmitting: boolean;
  submitError: string;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export function SurveyWaitlist({
  name,
  email,
  emailError,
  isSubmitting,
  submitError,
  onNameChange,
  onEmailChange,
  onSubmit,
  onSkip,
  onBack,
}: Props) {
  const [touched, setTouched] = useState({ name: false, email: false });
  const progress = ((TOTAL_QUESTIONS + 1) / (TOTAL_QUESTIONS + 2)) * 100;

  const emailValid = emailSchema.safeParse(email).success;
  const canSubmit = name.trim().length > 0 && emailValid && !isSubmitting;

  function handleEmailBlur() {
    setTouched((t) => ({ ...t, email: true }));
  }
  function handleNameBlur() {
    setTouched((t) => ({ ...t, name: true }));
  }

  const showEmailError = touched.email && email.length > 0 && !emailValid;

  return (
    <div className="flex flex-col gap-5">
      {/* Progress + back */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1 cursor-pointer"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ← Back
          </button>
          <span className="text-xs font-semibold text-gray-400">Almost done!</span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "#F5C518" }}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h3
          className="text-xl font-extrabold text-brand-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          One Last Thing
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}
        >
          Join our waitlist to be the first to hear when our tools for parents
          go live — built directly from what you&apos;ve told us today.
        </p>
      </div>

      {/* Name input */}
      <div className="space-y-1.5">
        <label
          className="text-xs font-extrabold text-gray-600 uppercase tracking-wider"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Your Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter your name"
          className="w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition-colors"
          style={{
            borderColor: touched.name && !name.trim() ? "#F4845F" : "#E5E7EB",
            fontFamily: "Inter, sans-serif",
            color: "#1A1A1A",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#F5C518")}
          onBlur={(e) => {
            handleNameBlur();
            e.currentTarget.style.borderColor = !name.trim() ? "#F4845F" : "#E5E7EB";
          }}
        />
        {touched.name && !name.trim() && (
          <p className="text-xs font-semibold" style={{ color: "#F4845F" }}>
            Please enter your name.
          </p>
        )}
      </div>

      {/* Email input */}
      <div className="space-y-1.5">
        <label
          className="text-xs font-extrabold text-gray-600 uppercase tracking-wider"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="your@email.com"
          className="w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition-colors"
          style={{
            borderColor: showEmailError ? "#F4845F" : "#E5E7EB",
            fontFamily: "Inter, sans-serif",
            color: "#1A1A1A",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#F5C518")}
          onBlur={(e) => {
            handleEmailBlur();
            e.currentTarget.style.borderColor = showEmailError ? "#F4845F" : "#E5E7EB";
          }}
        />
        {showEmailError && (
          <p className="text-xs font-semibold" style={{ color: "#F4845F" }}>
            Please enter a valid email address.
          </p>
        )}
        {emailError && (
          <p className="text-xs font-semibold" style={{ color: "#F4845F" }}>
            {emailError}
          </p>
        )}
      </div>

      {/* Submit button */}
      <motion.button
        whileHover={{ scale: canSubmit ? 1.02 : 1 }}
        whileTap={{ scale: canSubmit ? 0.98 : 1 }}
        onClick={onSubmit}
        disabled={!canSubmit}
        className="w-full py-3.5 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        style={{
          fontFamily: "var(--font-heading)",
          background: canSubmit ? "#F5C518" : "#E5E7EB",
          color: canSubmit ? "#1A1A1A" : "#9CA3AF",
          boxShadow: canSubmit ? "0 4px 12px rgba(245,197,24,0.28)" : "none",
        }}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </>
        ) : (
          "Join the Waitlist →"
        )}
      </motion.button>

      {submitError && (
        <p
          className="text-xs font-semibold text-center"
          style={{ color: "#F4845F" }}
        >
          {submitError}
        </p>
      )}

      <p
        className="text-[11px] text-center"
        style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}
      >
        No spam. We&apos;ll only reach out when something relevant is ready.
      </p>

      {/* Skip option */}
      <button
        onClick={onSkip}
        disabled={isSubmitting}
        className="w-full text-center text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:cursor-not-allowed -mt-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Skip — submit anonymously
      </button>
    </div>
  );
}
