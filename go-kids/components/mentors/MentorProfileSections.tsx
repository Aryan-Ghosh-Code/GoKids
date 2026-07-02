"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, GraduationCap, Briefcase, BookOpen, Sparkles, Languages } from "lucide-react";
import type { IMentor } from "@/lib/db/models/Mentor";

const CHIP_COLORS = [
  { bg: "#E8F8F7", text: "#1A7A72", border: "#B2EAE6" },
  { bg: "#FEF0EB", text: "#B94E2A", border: "#F9C4AF" },
  { bg: "#E8F4FD", text: "#1A6FA0", border: "#B3D9F2" },
];

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, icon, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="rounded-2xl overflow-hidden border transition-all"
      style={{ borderColor: open ? "#F5C518" : "#F3F4F6" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-all"
        style={{ background: open ? "#FFFBEB" : "#FFFFFF" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-xl"
            style={{ background: open ? "#FFF9E6" : "#F3F4F6", color: open ? "#D4A900" : "#9CA3AF" }}
          >
            {icon}
          </span>
          <span
            className="text-sm font-extrabold"
            style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
          >
            {title}
          </span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: "#9CA3AF" }}
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 pb-5 pt-1" style={{ background: "#FFFFFF" }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MentorProfileSectionsProps {
  mentor: IMentor;
}

export default function MentorProfileSections({ mentor }: MentorProfileSectionsProps) {
  return (
    <div className="flex flex-col gap-3 mt-6">
      {/* About */}
      <AccordionItem title="About" icon={<BookOpen size={15} />} defaultOpen>
        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#4B5563" }}>
          {mentor.bio || mentor.shortBio || "No bio provided yet."}
        </p>
      </AccordionItem>

      {/* Topics / Expertise */}
      {mentor.expertise?.length > 0 && (
        <AccordionItem title="Topics & Expertise" icon={<Sparkles size={15} />}>
          <div className="flex flex-wrap gap-2">
            {mentor.expertise.map((tag, i) => {
              const c = CHIP_COLORS[i % CHIP_COLORS.length];
              return (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </AccordionItem>
      )}

      {/* Languages */}
      {mentor.languages?.length > 0 && (
        <AccordionItem title="Languages" icon={<Languages size={15} />}>
          <div className="flex flex-wrap gap-2">
            {mentor.languages.map((lang) => (
              <span
                key={lang}
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "#F3F4F6", color: "#4B5563", border: "1px solid #E5E7EB" }}
              >
                {lang}
              </span>
            ))}
          </div>
        </AccordionItem>
      )}

      {/* Education */}
      {mentor.education?.length > 0 && (
        <AccordionItem title="Education" icon={<GraduationCap size={15} />}>
          <div className="flex flex-col gap-3">
            {mentor.education.map((edu, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "#FAFAF8", border: "1px solid #F3F4F6" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "#E8F8F7", color: "#2BBCB0" }}
                >
                  <GraduationCap size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}>
                    {edu.degree}
                  </p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    {edu.institution}
                    {edu.year ? ` · ${edu.year}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AccordionItem>
      )}

      {/* Work Experience */}
      {mentor.workExperience?.length > 0 && (
        <AccordionItem title="Work Experience" icon={<Briefcase size={15} />}>
          <div className="flex flex-col gap-3">
            {mentor.workExperience.map((exp, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "#FAFAF8", border: "1px solid #F3F4F6" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "#FEF0EB", color: "#F4845F" }}
                >
                  <Briefcase size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}>
                    {exp.role}
                  </p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    {exp.company}
                    {exp.duration ? ` · ${exp.duration}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AccordionItem>
      )}
    </div>
  );
}
