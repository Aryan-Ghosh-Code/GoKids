"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Globe, ArrowRight, ShieldCheck, Award } from "lucide-react";
import type { IMentor } from "@/lib/db/models/Mentor";

// Curated soft pastel palette for expertise tags and banner backgrounds
const CHIP_COLORS = [
  { bg: "#E8F8F7", text: "#1A7A72", border: "#B2EAE6" }, // Teal
  { bg: "#FEF0EB", text: "#B94E2A", border: "#F9C4AF" }, // Coral/Peach
  { bg: "#E8F4FD", text: "#1A6FA0", border: "#B3D9F2" }, // Sky Blue
  { bg: "#F3EEFF", text: "#6B3BA7", border: "#D8C4F8" }, // Lavender
];

const BANNER_COLORS = [
  "#E0F2FE", // Soft Sky Blue
  "#E0F7FA", // Soft Cyan
  "#F3E8FF", // Soft Purple/Lavender
  "#FFF7ED", // Soft Orange
  "#F0FDF4", // Soft Emerald
];

interface MentorCardProps {
  mentor: IMentor;
  index?: number;
}

export default function MentorCard({ mentor, index = 0 }: MentorCardProps) {
  const visibleExpertise = mentor?.expertise?.slice(0, 2) ?? [];
  const sessionDuration = mentor?.sessionTypes?.[0]?.duration ?? 45;
  const bannerColor = BANNER_COLORS[index % BANNER_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, boxShadow: "0 24px 48px -8px rgba(245,197,24,0.22), 0 8px 24px rgba(0,0,0,0.06)" }}
      className="group bg-white rounded-3xl flex flex-col overflow-hidden relative cursor-pointer"
      style={{
        border: "1.5px solid #EFEFEF",
        boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
        transition: "border-color 0.25s ease",
      }}
    >
      {/* Small light solid coloured banner */}
      <div
        className="h-10 w-full flex-shrink-0"
        style={{ background: bannerColor }}
      />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header: Avatar + Name + Title */}
        <div className="flex items-start gap-4 -mt-10 relative z-10">
          {/* Avatar — borders white to separate from banner background */}
          <div className="relative flex-shrink-0">
            <div
              className="w-[72px] h-[72px] rounded-2xl overflow-hidden border-4 border-white shadow-md bg-white"
            >
              {mentor?.photo ? (
                <Image
                  src={mentor.photo}
                  alt={mentor?.displayName || "Mentor"}
                  width={72}
                  height={72}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-2xl font-extrabold bg-amber-50 text-amber-700"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {(mentor?.displayName || "M").charAt(0)}
                </div>
              )}
            </div>
            {/* Verified badge */}
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100"
              title="Verified Expert"
            >
              <ShieldCheck size={11} className="text-teal-500" />
            </span>
          </div>

          <div className="flex-1 min-w-0 pt-8">
            <h3
              className="text-[15px] font-extrabold text-gray-900 leading-snug truncate group-hover:text-amber-600 transition-colors duration-200"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              {mentor?.displayName || "Expert Mentor"}
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5 line-clamp-2 leading-relaxed">
              {mentor?.title || "Specialist"}
            </p>
            {mentor?.experience && (
              <span
                className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: "#FFF9E6", color: "#92650A", border: "1px solid #F5C518" }}
              >
                <Award size={10} /> {mentor.experience}
              </span>
            )}
          </div>
        </div>

        {/* Expertise chips */}
        {visibleExpertise.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleExpertise.map((tag, i) => {
              const c = CHIP_COLORS[i % CHIP_COLORS.length];
              return (
                <span
                  key={tag}
                  className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold"
                  style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                >
                  {tag}
                </span>
              );
            })}
            {mentor?.expertise && mentor.expertise.length > 2 && (
              <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                +{mentor.expertise.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Short bio */}
        <p className="text-[12.5px] text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {mentor?.shortBio}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 pt-3 border-t border-gray-100 text-[11.5px] text-gray-400 font-medium">
          {mentor?.languages?.[0] && (
            <div className="flex items-center gap-1">
              <Globe size={12} className="text-teal-500" />
              <span>{mentor.languages.slice(0, 2).join(", ")}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-amber-500" />
            <span>{sessionDuration} min</span>
          </div>
          <span
            className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: "#DCFCE7", color: "#15803D" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            Available
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/mentors/${mentor?.slug}`}
          className="btn-primary flex items-center justify-center gap-2 w-full py-3 text-sm group-hover:gap-3 transition-all"
        >
          View Profile
          <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}
