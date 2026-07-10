"use client";

import { motion } from "framer-motion";

interface Props {
  childName: string;
  onStart: () => void;
}

export function SelfReportInstructionsScreen({ childName, onStart }: Props) {
  return (
    <div className="space-y-6 py-2">
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#FEF0EB] text-coral"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Part 2 of 4
        </span>
        <span className="text-xs text-gray-400 font-semibold">
          How did it feel?
        </span>
      </div>

      <div className="text-center space-y-3">
        <div className="text-5xl">💬</div>
        <h2
          className="text-2xl font-extrabold text-brand-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          This part is for YOU, {childName}!
        </h2>
        <p className="text-sm text-gray-500 font-semibold leading-relaxed max-w-sm mx-auto">
          Answer honestly — there are no right or wrong answers. This helps us
          understand how the task felt to you.
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            icon: "🤫",
            text: "Parents — please give the device to your child and give them privacy",
          },
          {
            icon: "❓",
            text: "6 short questions about the shape task you just did",
          },
          { icon: "⏱️", text: "Takes about 3–4 minutes" },
          {
            icon: "🔒",
            text: "Completely private — your honest answers help us understand you better",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl"
            style={{ background: "#FAFAF8" }}
          >
            <span className="text-xl shrink-0">{item.icon}</span>
            <p className="text-sm font-semibold text-gray-700 leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="w-full py-4 rounded-2xl font-extrabold text-sm"
        style={{
          background: "#F5C518",
          color: "#1A1A1A",
          fontFamily: "var(--font-heading)",
          boxShadow: "0 4px 16px rgba(245,197,24,0.35)",
        }}
      >
        I&apos;m ready →
      </motion.button>
    </div>
  );
}
