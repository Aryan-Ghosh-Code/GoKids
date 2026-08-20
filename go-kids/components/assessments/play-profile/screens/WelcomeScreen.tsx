"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AssessmentInfoModal from "@/components/assessments/AssessmentInfoModal";
import { playProfileModalContent } from "../constants/modalContent";

interface ChildInfo {
  _id: string;
  name: string;
  dob?: string;
}

interface Props {
  childrenList: ChildInfo[];
  onBegin: (childId: string, childName: string, band: string) => void;
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

function getPlayProfileBand(age: number | null): { key: string; label: string; eligible: boolean } {
  if (age === null) return { key: "3-5", label: "3-5 years", eligible: true };
  if (age >= 0 && age <= 2) return { key: "0-2", label: "0-2 years (Toddler)", eligible: true };
  if (age >= 3 && age <= 5) return { key: "3-5", label: "3-5 years (Preschooler)", eligible: true };
  return { key: "invalid", label: "Not eligible (Ages 0-5 only)", eligible: false };
}

export function WelcomeScreen({ childrenList, onBegin }: Props) {
  const [selectedChildId, setSelectedChildId] = useState(
    childrenList[0]?._id ?? "",
  );

  const activeChild =
    childrenList.find((c) => c._id === selectedChildId) ?? null;

  const childAge = calcAge(activeChild?.dob);
  const bandInfo = getPlayProfileBand(childAge);
  const isEligible = activeChild ? bandInfo.eligible : false;

  function handleBeginClick() {
    if (!activeChild || !isEligible) return;
    onBegin(activeChild._id, activeChild.name, bandInfo.label);
  }

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-5xl mb-3">🧩</div>
        <h2
          className="text-2xl font-extrabold text-brand-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Child Play Profile Survey
        </h2>
        <p className="text-sm text-gray-500 font-semibold leading-relaxed max-w-sm mx-auto">
          A 10-question parent survey that reveals your child&apos;s natural
          play archetype and the activities that suit them best.
        </p>
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-extrabold mt-1"
          style={{ background: "#E8F8F7", color: "#0D7A73" }}
        >
          🕐 Under 5 minutes · Ages 0–5 · Parent only
        </div>
      </div>

      {/* Child selector */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
          Who is this survey for?
        </label>
        <div className="grid grid-cols-1 gap-2">
          {childrenList.map((child) => {
            const age = calcAge(child.dob);
            const isSelected = child._id === selectedChildId;
            const childBand = getPlayProfileBand(age);
            return (
              <motion.button
                key={child._id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedChildId(child._id)}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer"
                style={{
                  borderColor: isSelected ? (childBand.eligible ? "#2BBCB0" : "#EF4444") : "#E5E7EB",
                  background: isSelected ? (childBand.eligible ? "#F0FCFB" : "#FEF2F2") : "white",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{
                    background: isSelected ? (childBand.eligible ? "#2BBCB0" : "#EF4444") : "#F3F4F6",
                    color: isSelected ? "white" : "#6B7280",
                  }}
                >
                  {isSelected ? "✓" : "👶"}
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-extrabold text-brand-black"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {child.name}
                  </p>
                  {age !== null && (
                    <p className="text-xs text-gray-400 font-semibold flex items-center gap-2">
                      <span>{age} year{age !== 1 ? "s" : ""} old</span>
                      <span
                        className="text-[10px] font-extrabold px-1.5 py-0.5 rounded"
                        style={{
                          background: childBand.eligible ? "#E8F8F7" : "#FEE2E2",
                          color: childBand.eligible ? "#0D7A73" : "#EF4444",
                        }}
                      >
                        {childBand.label}
                      </span>
                    </p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Age alert / info */}
      {activeChild && !isEligible && (
        <div
          className="rounded-2xl p-4 space-y-1"
          style={{ background: "#FEF2F2", border: "1px solid #FCA5A5" }}
        >
          <p
            className="text-xs font-extrabold text-red-800 uppercase tracking-wider"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ⚠️ Age Limit Restriction
          </p>
          <p className="text-xs text-red-700 font-semibold leading-relaxed">
            {activeChild.name} is {childAge} years old. The Play Profile Survey is designed specifically for children aged <strong>0 to 5 years</strong>.
          </p>
        </div>
      )}

      {/* What you'll learn */}
      {isEligible && (
        <div
          className="rounded-2xl p-4 space-y-2"
          style={{ background: "#FFFBEA", border: "1px solid #FDE68A" }}
        >
          <p
            className="text-xs font-extrabold text-amber-800 uppercase tracking-wider"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What you&apos;ll discover
          </p>
          {[
            "Your child's named play archetype (e.g. Builder, Explorer)",
            "Which toy and activity types match their natural style",
            "A breakdown across 5 play dimensions",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5 shrink-0">✦</span>
              <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Begin button */}
      <motion.button
        whileHover={{ scale: isEligible ? 1.02 : 1 }}
        whileTap={{ scale: isEligible ? 0.98 : 1 }}
        onClick={handleBeginClick}
        disabled={!isEligible}
        className="w-full py-4 rounded-2xl font-extrabold text-sm transition-all disabled:cursor-not-allowed cursor-pointer"
        style={{
          fontFamily: "var(--font-heading)",
          background: isEligible ? "#F5C518" : "#E5E7EB",
          color: isEligible ? "#1A1A1A" : "#9CA3AF",
          boxShadow: isEligible
            ? "0 4px 12px rgba(245,197,24,0.3)"
            : "none",
        }}
      >
        Begin Survey →
      </motion.button>
    </div>
  );
}

