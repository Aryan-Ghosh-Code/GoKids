"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Band, BAND_CONFIG } from "../utils/bandConfig";
import { attentionSpanModalContent } from "../constants/modalContent";

interface ChildInfo {
  _id: string;
  name: string;
  dob?: string;
}

interface Props {
  childrenList: ChildInfo[];
  onBegin: (childId: string, childName: string, band: Band) => void;
}

function calcAge(dob?: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function bandFromAge(age: number | null): Band | null {
  if (age === null) return null;
  if (age >= 8 && age <= 10) return "A";
  if (age >= 11 && age <= 13) return "B";
  if (age >= 14 && age <= 16) return "C";
  return null;
}

const BAND_BUTTONS: { band: Band; label: string; emoji: string }[] = [
  { band: "A", label: "Ages 8–10", emoji: "🌱" },
  { band: "B", label: "Ages 11–13", emoji: "🌿" },
  { band: "C", label: "Ages 14–16", emoji: "🌳" },
];

export function WelcomeScreen({ childrenList, onBegin }: Props) {
  const [selectedChildId, setSelectedChildId] = useState(
    childrenList[0]?._id ?? "",
  );
  const [selectedBand, setSelectedBand] = useState<Band | null>(null);
  const [manualBand, setManualBand] = useState<Band | null>(null);

  const activeChild =
    childrenList.find((c) => c._id === selectedChildId) ?? null;
  const childAge = calcAge(activeChild?.dob);
  const autoBand = bandFromAge(childAge);
  const effectiveBand = autoBand ?? manualBand ?? selectedBand;
  const canBegin = !!activeChild && !!effectiveBand;

  function handleChildSelect(id: string) {
    setSelectedChildId(id);
    setManualBand(null);
    setSelectedBand(null);
  }

  function handleBandSelect(band: Band) {
    if (!autoBand) {
      setManualBand(band);
    }
    setSelectedBand(band);
  }

  function handleBegin() {
    if (!activeChild || !effectiveBand) return;
    onBegin(activeChild._id, activeChild.name, effectiveBand);
  }

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-4xl mb-2">🧠</div>
        <h2
          className="text-2xl font-extrabold text-brand-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Attention Span Assessment
        </h2>
        <p className="text-sm text-gray-500 font-semibold leading-relaxed max-w-sm mx-auto">
          A 4-part assessment to understand your child&apos;s focus, impulse
          control, and attention patterns.
        </p>
      </div>

      {/* Child selector */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
          Who is this assessment for?
        </label>
        <div className="grid grid-cols-1 gap-2">
          {childrenList.map((child) => {
            const age = calcAge(child.dob);
            const isSelected = child._id === selectedChildId;
            return (
              <motion.button
                key={child._id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChildSelect(child._id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all"
                style={{
                  borderColor: isSelected ? "#F5C518" : "#E5E7EB",
                  background: isSelected ? "#FFFBEA" : "#FAFAF8",
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0"
                  style={{
                    background: isSelected ? "#F5C518" : "#F3F4F6",
                    color: isSelected ? "#1A1A1A" : "#6B7280",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {child.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold capitalize text-brand-black truncate">
                    {child.name}
                  </p>
                  {age !== null && (
                    <p className="text-xs text-gray-400 font-semibold">
                      {age} years old
                      {bandFromAge(age) && (
                        <span
                          className="ml-1.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md"
                          style={{ background: "#FFF9E6", color: "#D4A900" }}
                        >
                          Band {bandFromAge(age)}
                        </span>
                      )}
                    </p>
                  )}
                </div>
                {isSelected && <span className="text-primary text-lg">✓</span>}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Age band — auto-detected or manual */}
      {activeChild && (
        <div className="space-y-2">
          {autoBand ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: "linear-gradient(135deg,#FFFBEA,#FFF3CC)",
                border: "1.5px solid rgba(245,197,24,0.35)",
              }}
            >
              <span className="text-xl">✨</span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-extrabold"
                  style={{
                    color: "#92700A",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Age group detected automatically
                </p>
                <p className="text-xs text-[#A07010] mt-0.5 font-semibold">
                  {activeChild.name} is <strong>{childAge} yrs old</strong>: (
                  {BAND_CONFIG[autoBand].ageLabel})
                </p>
              </div>
              <div
                className="px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0"
                style={{
                  background: "#F5C518",
                  color: "#1A1A1A",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Band {autoBand}
              </div>
            </motion.div>
          ) : (
            <>
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                Select age group
              </label>
              <div className="grid grid-cols-3 gap-2">
                {BAND_BUTTONS.map(({ band, label, emoji }) => {
                  const isActive = (manualBand ?? selectedBand) === band;
                  return (
                    <motion.button
                      key={band}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleBandSelect(band)}
                      className="py-3 rounded-xl text-center text-xs font-extrabold border-2 transition-all"
                      style={{
                        borderColor: isActive ? "#F5C518" : "#E5E7EB",
                        background: isActive ? "#F5C518" : "#FAFAF8",
                        color: "#1A1A1A",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      <div className="text-xl mb-1">{emoji}</div>
                      {label}
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* What to expect */}
      <div
        className="rounded-2xl p-4 space-y-2"
        style={{ background: "#F3F4F6" }}
      >
        <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
          What to expect
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 font-semibold">
          <div className="flex items-start gap-2">
            <span>Part 1: Digital shape task (child)</span>
          </div>
          <div className="flex items-start gap-2">
            <span>Part 2: How did it feel? (child)</span>
          </div>
          <div className="flex items-start gap-2">
            <span>Part 3: Parent observations</span>
          </div>
          <div className="flex items-start gap-2">
            <span>Part 4: Motivation check</span>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 font-semibold pt-1">
          Total time: {attentionSpanModalContent.totalTime}
        </p>
      </div>

      {/* Begin button */}
      <motion.button
        whileHover={{ scale: canBegin ? 1.02 : 1 }}
        whileTap={{ scale: canBegin ? 0.97 : 1 }}
        onClick={handleBegin}
        disabled={!canBegin}
        className="w-full py-4 rounded-2xl font-extrabold text-sm transition-all"
        style={{
          background: canBegin ? "#F5C518" : "#F3F4F6",
          color: canBegin ? "#1A1A1A" : "#9CA3AF",
          fontFamily: "var(--font-heading)",
          boxShadow: canBegin ? "0 4px 16px rgba(245,197,24,0.35)" : "none",
        }}
      >
        Begin Assessment →
      </motion.button>
    </div>
  );
}
