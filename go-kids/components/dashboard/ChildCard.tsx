"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Edit2, Trash2, Calendar, GraduationCap, School } from "lucide-react";

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

// Colour palette cycling for initial avatars
const AVATAR_COLORS = [
  { bg: "#FFF9E6", color: "#D4A900" },
  { bg: "#F0FAFA", color: "#1A8C84" },
  { bg: "#FEF0EB", color: "#C0563A" },
  { bg: "#EDF7FF", color: "#1A91C8" },
];

const INTEREST_COLORS = [
  { bg: "#F0FAFA", color: "#2BBCB0" },
  { bg: "#FEF0EB", color: "#F4845F" },
  { bg: "#EDF7FF", color: "#4FC3F7" },
  { bg: "#FFF9E6", color: "#D4A900" },
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
  const avatarStyle = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const age = getAge(child.dob);
  const initials = getInitials(child.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden transition-all duration-250 hover:-translate-y-1.5"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      whileHover={{ boxShadow: "0 16px 40px rgba(0,0,0,0.10)" }}
    >
      {/* Top colour strip */}
      <div
        className="h-2 w-full"
        style={{ background: INTEREST_COLORS[index % INTEREST_COLORS.length].color }}
      />

      <div className="p-5">
        {/* Avatar + Name row */}
        <div className="flex items-center gap-4 mb-4">
          {child.photoUrl ? (
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#F3F4F6]">
              <Image src={child.photoUrl} alt={child.name} fill className="object-cover" sizes="64px" />
            </div>
          ) : (
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 text-xl font-extrabold"
              style={{ background: avatarStyle.bg, color: avatarStyle.color, fontFamily: "var(--font-nunito)" }}
            >
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3
              className="font-extrabold text-base truncate"
              style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
            >
              {child.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {age && (
                <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "#6B7280" }}>
                  <Calendar size={11} /> {age}
                </span>
              )}
              {child.grade && (
                <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "#6B7280" }}>
                  <GraduationCap size={11} /> {child.grade}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* School */}
        {child.school && (
          <div className="flex items-center gap-1.5 mb-3 text-xs" style={{ color: "#6B7280" }}>
            <School size={12} />
            <span className="truncate">{child.school}</span>
          </div>
        )}

        {/* Interests */}
        {child.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {child.interests.slice(0, 4).map((interest, i) => {
              const c = INTEREST_COLORS[i % INTEREST_COLORS.length];
              return (
                <span
                  key={interest}
                  className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: c.bg, color: c.color, fontFamily: "var(--font-nunito)" }}
                >
                  {interest}
                </span>
              );
            })}
            {child.interests.length > 4 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#F3F4F6", color: "#6B7280" }}>
                +{child.interests.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-[#F3F4F6]">
          <button
            onClick={() => onEdit(child)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all hover:bg-[#FFF9E6]"
            style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
          >
            <Edit2 size={13} />
            Edit
          </button>
          <button
            onClick={() => onDelete(child)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all hover:bg-[#FEF0EB]"
            style={{ color: "#F4845F", fontFamily: "var(--font-nunito)" }}
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
