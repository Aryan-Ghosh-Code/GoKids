"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowRight } from "lucide-react";
import BrandLogo from "@/components/shared/BrandLogo";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#FAFAF8" }}
    >
      {/* Background shapes */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="animate-float absolute top-16 right-20 w-72 h-72 rounded-full opacity-20"
          style={{ background: "#F5C518", filter: "blur(56px)" }}
        />
        <div
          className="animate-float-delayed absolute bottom-16 left-10 w-56 h-56 rounded-full opacity-15"
          style={{ background: "#2BBCB0", filter: "blur(44px)" }}
        />
        <div
          className="animate-float-slow absolute top-1/2 left-1/3 w-40 h-40 rounded-full opacity-10"
          style={{ background: "#F4845F", filter: "blur(36px)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative text-center max-w-md w-full"
      >
        <div className="flex justify-center mb-8">
          <BrandLogo height={48} />
        </div>

        {/* 404 Illustration */}
        <motion.div
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl mb-6 select-none"
          aria-hidden="true"
        >
          🔍
        </motion.div>

        <h1
          className="mb-3"
          style={{
            fontFamily: "var(--font-nunito)",
            fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 48px)",
            color: "#1A1A1A",
          }}
        >
          Oops! Page Not Found
        </h1>

        <p
          className="text-base mb-8 leading-relaxed"
          style={{ color: "#6B7280" }}
        >
          This page is still being built — we&apos;re working on it! Head back
          home and explore what&apos;s ready now.
        </p>

        {/* Coming Soon chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {["Assessments", "Workshops", "Mentors", "Talk"].map((item, i) => {
            const colors = ["#E8F8F7", "#FEF0EB", "#E8F6FE", "#FFF9E6"];
            const text = ["#2BBCB0", "#F4845F", "#4FC3F7", "#D4A900"];
            return (
              <span
                key={item}
                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: colors[i],
                  color: text[i],
                  fontFamily: "var(--font-nunito)",
                }}
              >
                {item} — Coming Soon ✨
              </span>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm"
              style={{
                background: "#F5C518",
                color: "#1A1A1A",
                fontFamily: "var(--font-nunito)",
                boxShadow: "0 4px 16px rgba(245,197,24,0.35)",
              }}
            >
              <Home size={15} />
              Back to Home
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm border-2"
              style={{
                borderColor: "#1A1A1A",
                color: "#1A1A1A",
                background: "white",
                fontFamily: "var(--font-nunito)",
              }}
            >
              Get Started Free <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
