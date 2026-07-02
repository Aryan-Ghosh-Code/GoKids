"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgeBand } from "../utils/bandConfig";
import { ChevronDown, Check, Sparkles } from "lucide-react";

interface ChildInfo {
  _id: string;
  name: string;
  dob?: string;
}

interface WelcomeScreenProps {
  childrenList: ChildInfo[];
  onBegin: (childId: string, childName: string, band: AgeBand) => void;
}

const BAND_OPTIONS: { label: string; sub: string; band: AgeBand; range: [number, number] }[] = [
  { label: "8–10 years", sub: "Band A", band: "A", range: [8, 10] },
  { label: "11–13 years", sub: "Band B", band: "B", range: [11, 13] },
  { label: "14–16 years", sub: "Band C", band: "C", range: [14, 16] },
];

const MIN_ELIGIBLE_AGE = 8;
const MAX_ELIGIBLE_AGE = 16;

function calcAge(dob?: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function bandFromAge(age: number | null): AgeBand | null {
  if (age === null) return null;
  const match = BAND_OPTIONS.find(({ range }) => age >= range[0] && age <= range[1]);
  return match?.band ?? null;
}

function isEligible(dob?: string): boolean {
  const age = calcAge(dob);
  // If no DOB recorded, we include them (they'll need to manually select band)
  if (age === null) return true;
  return age >= MIN_ELIGIBLE_AGE && age <= MAX_ELIGIBLE_AGE;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const AVATAR_BG = ["#FFF9E6", "#E8F8F7", "#FEF0EB", "#EDF7FF"];
const AVATAR_COLOR = ["#D4A900", "#1A8C84", "#C0563A", "#1A91C8"];

export function WelcomeScreen({ childrenList, onBegin }: WelcomeScreenProps) {
  // Filter to only eligible children
  const eligibleChildren = childrenList.filter((c) => isEligible(c.dob));

  const [selectedChildId, setSelectedChildId] = useState("");
  const [manualBand, setManualBand] = useState<AgeBand | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeChild = eligibleChildren.find((c) => c._id === selectedChildId);
  const childAge = calcAge(activeChild?.dob);
  const autoBand = bandFromAge(childAge);
  const effectiveBand = autoBand ?? manualBand;
  const canBegin = selectedChildId !== "" && effectiveBand !== null;

  const activeBandInfo = effectiveBand
    ? BAND_OPTIONS.find((b) => b.band === effectiveBand)
    : null;

  useEffect(() => { setManualBand(null); }, [selectedChildId]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-brand-black"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Attention Span Assessment
          </h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary text-brand-black">
            Assessment 1 of 2
          </span>
        </div>
        <p className="text-sm text-gray-500 font-semibold">
          A science-backed tool to understand your child&apos;s focus and attention.
        </p>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="rounded-2xl p-5 space-y-3 border border-gray-100 bg-[#E8F8F7]/50 shadow-xs"
        >
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-2xl bg-white shadow-xs">🧠</div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#2BBCB0]">Part A: Digital Task</p>
            <p className="text-xs mt-1 text-gray-400 font-semibold">10 min · Child completes</p>
            <p className="text-xs mt-1.5 text-gray-600 font-semibold leading-relaxed">Tracks response speed and accuracy</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="rounded-2xl p-5 space-y-3 border border-gray-100 bg-[#FEF0EB]/60 shadow-xs"
        >
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-2xl bg-white shadow-xs">📋</div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#F4845F]">Part B: Parent Report</p>
            <p className="text-xs mt-1 text-gray-400 font-semibold">10–15 min · Parent fills</p>
            <p className="text-xs mt-1.5 text-gray-600 font-semibold leading-relaxed">Observational questionnaire</p>
          </div>
        </motion.div>
      </div>

      {/* Child Dropdown */}
      {eligibleChildren.length === 0 ? (
        <div className="text-center py-4 text-sm text-gray-400 font-semibold bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          No children aged 8–16 found in your profile.
        </div>
      ) : (
        <div className="space-y-2" ref={dropdownRef}>
          <label className="block text-sm font-bold text-gray-700">Select child to assess</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-4 py-3.5 rounded-xl border text-sm transition-all outline-none bg-white cursor-pointer font-bold flex items-center justify-between text-left"
              style={{
                borderColor: isOpen ? "#F5C518" : "#E5E7EB",
                boxShadow: isOpen ? "0 0 0 3px rgba(245,197,24,0.15)" : "none",
                color: activeChild ? "#1A1A1A" : "#9CA3AF",
              }}
            >
              {activeChild ? (
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                    style={{
                      background: AVATAR_BG[eligibleChildren.indexOf(activeChild) % AVATAR_BG.length],
                      color: AVATAR_COLOR[eligibleChildren.indexOf(activeChild) % AVATAR_COLOR.length],
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {getInitials(activeChild.name)}
                  </div>
                  <span className="capitalize font-bold">{activeChild.name}</span>
                </div>
              ) : (
                <span>Select your child</span>
              )}
              <ChevronDown
                size={18}
                className="text-gray-400 transition-transform duration-200 shrink-0"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-0 right-0 z-50 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden"
                  style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.12)" }}
                >
                  <div className="py-1.5">
                    {eligibleChildren.map((c, idx) => {
                      const isSelected = c._id === selectedChildId;
                      const age = calcAge(c.dob);
                      const band = bandFromAge(age);
                      return (
                        <button
                          key={c._id}
                          type="button"
                          onClick={() => { setSelectedChildId(c._id); setIsOpen(false); }}
                          className="w-full px-4 py-3 text-left transition-all flex items-center gap-3 cursor-pointer group"
                          style={{
                            background: isSelected ? "#FFFBEA" : "transparent",
                          }}
                        >
                          {/* Mini avatar */}
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-transform group-hover:scale-105"
                            style={{
                              background: AVATAR_BG[idx % AVATAR_BG.length],
                              color: AVATAR_COLOR[idx % AVATAR_COLOR.length],
                              fontFamily: "var(--font-heading)",
                            }}
                          >
                            {getInitials(c.name)}
                          </div>

                          {/* Name + age */}
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-extrabold capitalize truncate"
                              style={{ color: isSelected ? "#92700A" : "#1A1A1A" }}
                            >
                              {c.name}
                            </p>
                            {age !== null && (
                              <p className="text-xs text-gray-400 font-semibold mt-0.5">
                                {age} years old
                                {band && (
                                  <span
                                    className="ml-2 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md"
                                    style={{ background: "#FFF9E6", color: "#D4A900" }}
                                  >
                                    Band {band}
                                  </span>
                                )}
                              </p>
                            )}
                          </div>

                          {isSelected && <Check size={15} className="text-[#D4A900] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Band section — shown only after a child is selected */}
      <AnimatePresence mode="wait">
        {activeChild && autoBand && (
          /* Premium auto-detected band card */
          <motion.div
            key="auto-band"
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl p-5"
            style={{
              background: "linear-gradient(135deg, #FFFBEA 0%, #FFF3CC 100%)",
              border: "1.5px solid rgba(245,197,24,0.35)",
            }}
          >
            {/* Decorative glow */}
            <div
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(circle, #F5C518 0%, transparent 70%)" }}
            />

            <div className="flex items-center gap-4 relative">
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(245,197,24,0.2)" }}
              >
                <Sparkles size={20} style={{ color: "#D4A900" }} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-extrabold"
                  style={{ color: "#92700A", fontFamily: "var(--font-heading)" }}
                >
                  Age group detected automatically
                </p>
                <p className="text-xs text-[#A07010] mt-0.5 font-semibold leading-relaxed">
                  {activeChild.name} is <strong>{childAge} yrs old</strong> — assigned to{" "}
                  <strong>{activeBandInfo?.label}</strong>
                </p>
              </div>

              {/* Band pill */}
              <div
                className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-extrabold text-center"
                style={{
                  background: "#F5C518",
                  color: "#1A1A1A",
                  fontFamily: "var(--font-heading)",
                  boxShadow: "0 4px 12px rgba(245,197,24,0.35)",
                  minWidth: 56,
                }}
              >
                Band {autoBand}
              </div>
            </div>
          </motion.div>
        )}

        {activeChild && !autoBand && (
          /* No DOB — manual band selection */
          <motion.div
            key="manual-band"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <p className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shrink-0" />
              No date of birth on file — please select your child&apos;s age group:
            </p>
            <div className="grid grid-cols-3 gap-3">
              {BAND_OPTIONS.map(({ label, sub, band }) => {
                const isSelected = manualBand === band;
                return (
                  <button
                    key={band}
                    onClick={() => setManualBand(band)}
                    className="rounded-xl py-3 px-2 text-center transition-all border-[1.5px] text-sm cursor-pointer"
                    style={{
                      background: isSelected ? "#F5C518" : "#FAFAF8",
                      borderColor: isSelected ? "#F5C518" : "#E5E7EB",
                      boxShadow: isSelected ? "0 4px 12px rgba(245,197,24,0.25)" : "none",
                    }}
                  >
                    <div
                      className="font-extrabold text-xs"
                      style={{ color: "#1A1A1A", fontFamily: "var(--font-heading)" }}
                    >
                      {label}
                    </div>
                    <div className="text-[10px] mt-0.5 font-bold" style={{ color: isSelected ? "#1A1A1A" : "#9CA3AF" }}>
                      {sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Begin CTA */}
      <motion.button
        onClick={() => {
          if (canBegin && effectiveBand && activeChild) {
            onBegin(activeChild._id, activeChild.name, effectiveBand);
          }
        }}
        disabled={!canBegin}
        whileHover={{ scale: canBegin ? 1.02 : 1 }}
        whileTap={{ scale: canBegin ? 0.97 : 1 }}
        className="w-full py-4 rounded-2xl text-base font-extrabold transition-all border-none"
        style={{
          background: canBegin ? "linear-gradient(135deg, #F5C518 0%, #FFD740 100%)" : "#F3F4F6",
          color: canBegin ? "#1A1A1A" : "#9CA3AF",
          cursor: canBegin ? "pointer" : "not-allowed",
          fontFamily: "var(--font-heading)",
          boxShadow: canBegin ? "0 8px 28px rgba(245,197,24,0.35)" : "none",
        }}
      >
        Begin Assessment →
      </motion.button>
    </motion.div>
  );
}
