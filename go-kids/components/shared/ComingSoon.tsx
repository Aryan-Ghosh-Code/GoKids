"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

interface ComingSoonPageProps {
  title: string;
  emoji: string;
  description: string;
  accentColor: string;
  lightColor: string;
}

export function ComingSoonPage({
  title,
  emoji,
  description,
  accentColor,
  lightColor,
}: ComingSoonPageProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main
        className="flex-1 flex items-center justify-center px-4 py-24"
        style={{ background: "#FAFAF8" }}
      >
        {/* Background blobs */}
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="animate-float absolute top-16 right-16 w-80 h-80 rounded-full opacity-20"
            style={{ background: accentColor, filter: "blur(64px)" }}
          />
          <div
            className="animate-float-delayed absolute bottom-16 left-16 w-64 h-64 rounded-full opacity-15"
            style={{ background: "#2BBCB0", filter: "blur(52px)" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative text-center max-w-lg w-full"
        >
          {/* Floating emoji */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-7xl mb-8 select-none"
            aria-hidden="true"
          >
            {emoji}
          </motion.div>

          {/* Coming Soon badge */}
          <div className="flex justify-center mb-4">
            <span
              className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider"
              style={{
                background: lightColor,
                color: accentColor,
                fontFamily: "var(--font-nunito)",
              }}
            >
              Coming Soon
            </span>
          </div>

          <h1
            className="mb-4"
            style={{
              fontFamily: "var(--font-nunito)",
              fontWeight: 800,
              fontSize: "clamp(32px, 5vw, 48px)",
              color: "#1A1A1A",
              lineHeight: 1.15,
            }}
          >
            {title}
          </h1>

          <p
            className="text-base leading-relaxed mb-10"
            style={{ color: "#6B7280" }}
          >
            {description}
          </p>

          {/* Progress bar decoration */}
          <div
            className="w-full h-2 rounded-full mb-10 mx-auto max-w-xs overflow-hidden"
            style={{ background: "#F3F4F6" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: accentColor }}
              initial={{ width: "0%" }}
              animate={{ width: "72%" }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            />
          </div>

          {/* Notify + Back buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm"
                style={{
                  background: accentColor,
                  color: accentColor === "#F5C518" ? "#1A1A1A" : "white",
                  fontFamily: "var(--font-nunito)",
                  boxShadow: `0 4px 20px ${accentColor}55`,
                }}
              >
                Notify Me When Live →
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm border-2 transition-colors hover:bg-brand-offwhite"
                style={{
                  borderColor: "#E5E7EB",
                  color: "#1A1A1A",
                  fontFamily: "var(--font-nunito)",
                  background: "white",
                }}
              >
                <ArrowLeft size={14} />
                Go Back
              </button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-colors hover:bg-[#FFF9E6]"
                style={{
                  color: "#6B7280",
                  fontFamily: "var(--font-nunito)",
                }}
              >
                <Home size={14} />
                Home
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
