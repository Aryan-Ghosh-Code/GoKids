"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Users } from "lucide-react";
import type { Workshop } from "@/lib/data/workshops";

// ─── Chip sub-component ───────────────────────────────────────────────────────
function Chip({
  label,
  color,
}: {
  label: string;
  color: "teal" | "coral" | "sky" | "yellow";
}) {
  const styles: Record<string, { bg: string; text: string }> = {
    teal:   { bg: "rgba(43,188,176,0.12)",  text: "#1A7A72" },
    coral:  { bg: "rgba(244,132,95,0.12)",  text: "#C0532A" },
    sky:    { bg: "rgba(56,189,248,0.12)",  text: "#0369A1" },
    yellow: { bg: "rgba(245,197,24,0.18)",  text: "#92700A" },
  };
  const s = styles[color];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
      style={{ background: s.bg, color: s.text, fontFamily: "var(--font-nunito)" }}
    >
      {label}
    </span>
  );
}

// ─── WorkshopCard ─────────────────────────────────────────────────────────────
interface WorkshopCardProps {
  workshop: Workshop;
}

export default function WorkshopCard({ workshop }: WorkshopCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(0,0,0,0.13)" }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl overflow-hidden flex flex-col"
      style={{
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        border: "1px solid #F3F4F6",
      }}
    >
      <Link
        href={`/workshops/${workshop.slug}`}
        className="flex-1 flex flex-col"
      >
        {/* Thumbnail */}
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          <Image
            src={workshop.thumbnail}
            alt={workshop.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
          {/* FREE badge */}
          {workshop.isFree && (
            <span
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-extrabold"
              style={{
                background: "#F5C518",
                color: "#1A1A1A",
                fontFamily: "var(--font-nunito)",
                boxShadow: "0 2px 8px rgba(245,197,24,0.35)",
              }}
            >
              FREE
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Tag chips */}
          <div className="flex flex-wrap gap-1.5">
            <Chip label={`Ages ${workshop.ageGroup}`} color="teal" />
            <Chip label={workshop.level} color="coral" />
            <Chip label={workshop.skill} color="sky" />
          </div>

          {/* Title */}
          <h3
            className="text-base font-extrabold leading-snug line-clamp-2"
            style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
          >
            {workshop.title}
          </h3>

          {/* Short desc */}
          <p className="text-sm line-clamp-2" style={{ color: "#6B7280" }}>
            {workshop.shortDescription}
          </p>

          {/* Footer */}
          <div className="mt-auto pt-3 flex items-center justify-between border-t border-brand-grey">
            {/* Instructor */}
            <span
              className="text-xs font-semibold truncate"
              style={{ color: "#6B7280" }}
            >
              {workshop.instructor.name}
            </span>

            {/* Rating + enrolled */}
            <div className="flex items-center gap-2 shrink-0">
              <span
                className="flex items-center gap-0.5 text-xs font-bold"
                style={{ color: "#F5C518" }}
              >
                <Star size={12} fill="#F5C518" strokeWidth={0} />
                {workshop.rating.toFixed(1)}
              </span>
              <span
                className="flex items-center gap-0.5 text-xs"
                style={{ color: "#9CA3AF" }}
              >
                <Users size={11} />
                {workshop.enrolledCount}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
