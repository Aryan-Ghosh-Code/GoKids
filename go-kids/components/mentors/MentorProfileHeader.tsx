"use client";

import Image from "next/image";
import { ShieldCheck, Globe, Calendar, Sparkles } from "lucide-react";
import type { IMentor } from "@/lib/db/models/Mentor";

const CHIP_COLORS = [
  { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  { bg: "#FDF2F8", text: "#9D174D", border: "#FBCFE8" },
  { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
  { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  { bg: "#F5F3FF", text: "#5B21B6", border: "#DDD6FE" },
];

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function getSocialIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p === "linkedin") return <LinkedInIcon />;
  return <ExternalLinkIcon />;
}

interface MentorProfileHeaderProps {
  mentor: IMentor;
}

export default function MentorProfileHeader({ mentor }: MentorProfileHeaderProps) {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const availableDays = mentor.availability
    ?.map((a) => dayNames[a.dayOfWeek])
    .filter(Boolean);

  return (
    <div className="flex flex-col sm:flex-row gap-5 sm:gap-7 items-start text-left">

      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-[3px] border-white"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
        >
          {mentor.photo ? (
            <Image
              src={mentor.photo}
              alt={mentor.displayName}
              width={112}
              height={112}
              className="w-full h-full object-cover"
              priority
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-4xl font-extrabold bg-amber-100 text-amber-700"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              {mentor.displayName.charAt(0)}
            </div>
          )}
        </div>
        {/* Verified badge — bottom of avatar */}
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-md whitespace-nowrap z-10"
          style={{ background: "#DCFCE7", color: "#15803D", border: "1.5px solid #BBF7D0" }}
        >
          <ShieldCheck size={10} className="text-emerald-600" />
          Verified
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pt-1">
        {/* Name */}
        <h1
          className="text-2xl sm:text-[28px] font-extrabold text-gray-900 leading-tight"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          {mentor.displayName}
        </h1>

        {/* Title + experience inline */}
        <p className="text-sm text-gray-500 font-medium mt-0.5 mb-3">
          {mentor.title}
          {mentor.experience && (
            <span className="ml-2 text-gray-400">· {mentor.experience} exp.</span>
          )}
        </p>

        {/* Expertise chips */}
        {mentor.expertise?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {mentor.expertise.map((tag, i) => {
              const c = CHIP_COLORS[i % CHIP_COLORS.length];
              return (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold"
                  style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                >
                  <Sparkles size={9} style={{ opacity: 0.7 }} />
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* Meta pills row */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          {mentor.languages?.length > 0 && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Globe size={12} className="text-teal-500" />
              <span className="font-semibold">{mentor.languages.join(", ")}</span>
            </div>
          )}
          {availableDays && availableDays.length > 0 && (
            <>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Calendar size={12} className="text-amber-500" />
                <span className="font-semibold">{availableDays.join(", ")}</span>
              </div>
            </>
          )}
          {/* Social links */}
          {mentor.socialLinks?.length > 0 && (
            <div className="flex items-center gap-1.5 ml-auto">
              {mentor.socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center transition-all hover:bg-gray-200 hover:text-gray-800"
                  aria-label={link.platform}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
