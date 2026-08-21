"use client";

import { motion } from "framer-motion";

interface Props {
  onExplore: () => void;
  onClose: () => void;
}

export function SurveySuccess({ onExplore, onClose }: Props) {
  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: "#16a34a" }}
      >
        <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
          <motion.path
            d="M2 11L10 19L26 2"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          />
        </svg>
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-2"
      >
        <h3
          className="text-2xl font-extrabold text-brand-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Thank you! 🎉
        </h3>
        <p
          className="text-sm leading-relaxed max-w-xs mx-auto"
          style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}
        >
          Your responses have been recorded. We&apos;ll use them to build better
          tools for Indian parents — and we&apos;ll let you know when they&apos;re ready.
        </p>
      </motion.div>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="w-full space-y-3 pt-2"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onExplore}
          className="w-full py-3.5 rounded-xl font-extrabold text-sm transition-all cursor-pointer"
          style={{
            fontFamily: "var(--font-heading)",
            background: "#F5C518",
            color: "#1A1A1A",
            boxShadow: "0 4px 12px rgba(245,197,24,0.28)",
          }}
        >
          Explore Assessments →
        </motion.button>

        <button
          onClick={onClose}
          className="w-full text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer py-1"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}
