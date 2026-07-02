"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Edit3, Trash2, Calendar, GraduationCap, School, Sparkles } from "lucide-react";

export interface ChildData {
  _id: string;
  name: string;
  dob?: string;
  grade?: string;
  school?: string;
  interests: string[];
  behaviorNotes?: string;
  photoUrl?: string;
}

const AVATAR_THEMES = [
  { gradient: "linear-gradient(135deg, #FFF9E6 0%, #FEF3C7 100%)", color: "#D4A900", ring: "rgba(245,197,24,0.25)" },
  { gradient: "linear-gradient(135deg, #E8F8F7 0%, #CCFBF1 100%)", color: "#1A8C84", ring: "rgba(43,188,176,0.25)" },
  { gradient: "linear-gradient(135deg, #FEF0EB 0%, #FDE8DF 100%)", color: "#C0563A", ring: "rgba(244,132,95,0.25)" },
  { gradient: "linear-gradient(135deg, #EDF7FF 0%, #DBEAFE 100%)", color: "#1A75C8", ring: "rgba(79,195,247,0.25)" },
];

const INTEREST_COLORS = [
  { bg: "#E8F8F7", color: "#1A8C84" },
  { bg: "#FEF0EB", color: "#C0563A" },
  { bg: "#FFF9E6", color: "#D4A900" },
  { bg: "#EDF7FF", color: "#1A75C8" },
];

function getAge(dob?: string): string | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 0 ? `${age} yrs` : null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface ChildCardProps {
  child: ChildData;
  index: number;
  onEdit: (child: ChildData) => void;
  onDelete: (child: ChildData) => void;
}

export default function ChildCard({ child, index, onEdit, onDelete }: ChildCardProps) {
  const theme = AVATAR_THEMES[index % AVATAR_THEMES.length];
  const age = getAge(child.dob);
  const initials = getInitials(child.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="group bg-white rounded-[28px] overflow-hidden transition-all duration-300"
      style={{
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
      whileHover={{
        y: -4,
        boxShadow: "0 16px 40px rgba(0,0,0,0.10)",
      }}
    >
      {/* Gradient hero section */}
      <div
        className="relative px-6 pt-6 pb-8"
        style={{ background: theme.gradient }}
      >
        {/* Sparkle badge */}
        <div 
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.7)" }}
        >
          <Sparkles size={13} style={{ color: theme.color }} />
        </div>

        <div className="flex items-center gap-4">
          {/* Avatar */}
          {child.photoUrl ? (
            <div
              className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0"
              style={{ boxShadow: `0 0 0 3px white, 0 0 0 5px ${theme.ring}` }}
            >
              <Image src={child.photoUrl} alt={child.name} fill className="object-cover" sizes="64px" />
            </div>
          ) : (
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 text-2xl font-black"
              style={{
                background: "rgba(255,255,255,0.85)",
                color: theme.color,
                boxShadow: `0 0 0 3px rgba(255,255,255,0.5)`,
                fontFamily: "var(--font-heading)",
              }}
            >
              {initials}
            </div>
          )}

          {/* Name + meta */}
          <div className="min-w-0">
            <h3
              className="font-extrabold text-lg text-brand-black truncate capitalize leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {child.name}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5">
              {age && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: theme.color }}>
                  <Calendar size={11} /> {age}
                </span>
              )}
              {child.grade && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: theme.color }}>
                  <GraduationCap size={11} /> {child.grade}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details section */}
      <div className="px-6 py-5 space-y-4">
        {/* School */}
        {child.school && (
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <School size={13} className="text-gray-400 shrink-0" />
            <span className="truncate">{child.school}</span>
          </div>
        )}

        {/* Interests */}
        {child.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {child.interests.slice(0, 4).map((interest, i) => {
              const ic = INTEREST_COLORS[i % INTEREST_COLORS.length];
              return (
                <span
                  key={interest}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold capitalize"
                  style={{
                    background: ic.bg,
                    color: ic.color,
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {interest}
                </span>
              );
            })}
            {child.interests.length > 4 && (
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-gray-100 text-gray-500">
                +{child.interests.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <motion.button
            type="button"
            onClick={() => onEdit(child)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Edit3 size={13} />
            Edit Profile
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onDelete(child)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer bg-red-50 hover:bg-red-100 text-[#E05252]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Trash2 size={13} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
