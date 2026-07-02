"use client";

import { motion } from "framer-motion";
import { Clock, Target, Info } from "lucide-react";
import { AgeBand, BAND_CONFIG } from "../utils/bandConfig";

interface CptInstructionsScreenProps {
  band: AgeBand;
  childName: string;
  onStart: () => void;
}

export function CptInstructionsScreen({
  band,
  childName,
  onStart,
}: CptInstructionsScreenProps) {
  const config = BAND_CONFIG[band];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Progress header */}
      <div>
        <div className="flex justify-between text-xs mb-1.5 font-bold uppercase tracking-wider text-gray-500">
          <span>Part A — Digital Task</span>
          <span>10%</span>
        </div>
        <div
          className="w-full rounded-full overflow-hidden bg-gray-100"
          style={{ height: 6 }}
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "10%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-1 text-center sm:text-left">
        <h2
          className="text-2xl font-extrabold text-brand-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Part A: Digital Attention Task
        </h2>
        <p className="text-sm text-gray-500">
          Read these instructions together with{" "}
          <span className="font-extrabold text-brand-black">{childName}</span>
        </p>
      </div>

      {/* Target shape display */}
      <div className="flex flex-col items-center space-y-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-36 h-36 rounded-[28px] flex items-center justify-center bg-white shadow-md border-2 border-teal relative overflow-hidden"
        >
          {/* Subtle bg glow */}
          <div className="absolute inset-0 bg-[#E8F8F7]/30 pointer-events-none" />
          <span style={{ fontSize: 72, lineHeight: 1 }}>{config.target}</span>
        </motion.div>
        <p className="text-sm font-extrabold text-[#0D7A73]">
          Target Symbol: {config.targetName}
        </p>
      </div>

      {/* Info rows */}
      <div className="rounded-3xl p-5 space-y-4 bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#E8F8F7]">
            <Clock size={18} className="text-teal" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">
              Duration: {config.durLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#FEF0EB]">
            <Target size={18} className="text-coral" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">
              Tap ONLY when you see the{" "}
              <span className="text-coral font-extrabold">
                {config.targetName}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#FFF8E1]">
            <Info size={18} className="text-[#D97706]" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">
              Ignore all other shapes and letters
            </p>
          </div>
        </div>
      </div>

      {/* Handover notice */}
      <div className="rounded-[20px] p-4 flex items-start gap-3 bg-[#FFFBEB] border border-[#FDE68A]">
        <span className="text-xl">📱</span>
        <p className="text-sm font-semibold text-[#92400E] leading-relaxed">
          Hand the device to your child after reading through this page
          together.
        </p>
      </div>

      {/* CTA */}
      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-2xl text-base font-extrabold transition-all border-none cursor-pointer bg-primary text-brand-black shadow-md"
        style={{
          fontFamily: "var(--font-heading)",
          boxShadow: "0 8px 24px rgba(245, 197, 24, 0.25)",
        }}
      >
        I understand — Start Task
      </motion.button>
    </motion.div>
  );
}
